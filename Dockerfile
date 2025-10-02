# syntax=docker/dockerfile:1.6
# Dockerfile de producción para Milos-Shop

# Etapa 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar los package.json primero para aprovechar la cache
COPY package*.json ./

# Instalar dependencias (incluye devDependencies para vite/tsc) usando caché de npm (BuildKit)
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund

# Copiar el resto del código
COPY . .

# Construir la app con Vite (cliente)
RUN npm run build

# Compilar el servidor TypeScript (build de producción NodeNext)
RUN npx tsc -p tsconfig.build.json

# Validaciones rápidas de artefactos (sin ejecutar el servidor)
RUN ls -la build/server && \
    test -f build/server/routes.js && echo "✅ routes.js existe" && \
    grep -n 'from "./routes.js"' build/server/index.js && echo "✅ import con extensión .js presente"


# Etapa 2: Producción con Node + Express
FROM node:20-alpine AS runner

# Instalar dumb-init para manejar señales correctamente
RUN apk add --no-cache dumb-init

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

WORKDIR /app
RUN chown -R nextjs:nodejs /app

# Copiar node_modules del builder y podar a prod (evita segundo npm install)
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
RUN npm prune --omit=dev && npm cache clean --force

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
