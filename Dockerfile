# Dockerfile de producción para Milos-Shop

# Etapa 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar los package.json primero para aprovechar la cache
COPY package*.json ./

# Instalar TODAS las dependencias (incluye devDependencies necesarias para vite build y tsc)
RUN npm install

# Ejecutar npm audit fix para resolver vulnerabilidades de alta severidad
RUN npm audit fix --audit-level=high

# Copiar el resto del código
COPY . .

# Log para verificar dependencias
RUN echo "Verificando dependencias @radix-ui:" && npm list | grep @radix-ui || echo "Algunas dependencias @radix-ui pueden faltar" && echo "Verificando socket.io-client:" && npm list socket.io-client || echo "socket.io-client puede faltar"

# Construir la app con Vite (cliente)
RUN npm run build

# Compilar el servidor TypeScript
RUN npm run build:server


# Etapa 2: Producción con Node + Express
FROM node:20-alpine AS runner

# Instalar dumb-init para manejar señales correctamente
RUN apk add --no-cache dumb-init

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

WORKDIR /app
RUN chown -R nextjs:nodejs /app

# Copiar solo los package.json
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm install --omit=dev && npm cache clean --force

# Copiar los artefactos generados: cliente (client/dist) y servidor compilado (build)
COPY --from=builder --chown=nextjs:nodejs /app/client/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/build ./build

# Variables de entorno
ENV NODE_ENV=production

# Puerto por defecto (Render usa 10000, pero se puede sobrescribir con variable de entorno)
ENV PORT=10000

# Exponer puerto dinámico
EXPOSE 10000

# Healthcheck optimizado para PostgreSQL y servicios cloud (Render, Fly.io, Railway)
# Usa el puerto de la variable de entorno PORT
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD node -e "const http = require('http'); const port = process.env.PORT || 10000; const req = http.get('http://localhost:' + port + '/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); }); req.on('error', () => process.exit(1)); req.setTimeout(10000, () => { req.destroy(); process.exit(1); });"

# Cambiar a usuario no-root
USER nextjs

# Comando para correr el servidor compilado con dumb-init
CMD ["dumb-init", "node", "build/server/index.js"]
