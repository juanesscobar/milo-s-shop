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

# Log para verificar dependencias instaladas
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

# Cambiar propietario del directorio de trabajo
RUN chown -R nextjs:nodejs /app

# Copiar solo los package.json
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm install --omit=dev && npm cache clean --force

# Copiar los artefactos generados: cliente (client/dist) y servidor compilado (build)
COPY --from=builder --chown=nextjs:nodejs /app/client/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/build ./build

# Variables de entorno por defecto (pueden ser sobreescritas en runtime)
ENV NODE_ENV=production
ENV PORT=3000

# Exponer puerto
EXPOSE 3000

# Healthcheck básico
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Cambiar a usuario no-root
USER nextjs

# Comando para correr el servidor compilado con dumb-init
CMD ["dumb-init", "node", "build/index.js"]