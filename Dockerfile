# Etapa 1: Build
FROM node:20-slim AS builder

# Instalar dependencias del sistema necesarias para build de paquetes nativos
RUN apt-get update && apt-get install -y \
    python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar package.json y lockfile primero (para aprovechar cache)
COPY package*.json ./

# Instalar dependencias con cache de npm
RUN npm ci --no-audit --no-fund

# Copiar archivos necesarios para el build (evita contexto masivo y filtrar secretos)
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY postcss.config.js ./
COPY tailwind.config.ts ./
COPY client ./client
COPY server ./server
COPY shared ./shared

# Build frontend (Vite) y backend (TypeScript)
RUN npm run build
RUN npx tsc -p tsconfig.build.json

# Validaciones rápidas de artefactos (sin ejecutar el servidor)
RUN ls -la build/server && \
    test -f build/server/routes.js && echo "✅ routes.js existe" && \
    grep -n 'from "./routes.js"' build/server/index.js && echo "✅ import con extensión .js presente"

# Etapa 2: Producción
FROM node:20-slim AS runner

# Instalar dumb-init para manejo correcto de señales
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Crear usuario no-root
RUN addgroup --system nodejs && adduser --system --ingroup nodejs nextjs

# Copiar package manifests para permitir npm prune
COPY --from=builder /app/package*.json ./

# Copiar node_modules y podar a prod (evita segundo npm install)
COPY --from=builder /app/node_modules ./node_modules
RUN npm prune --omit=dev && npm cache clean --force

# Copiar artefactos compilados (frontend y backend)
COPY --from=builder /app/client/dist ./dist
COPY --from=builder /app/build ./build

# Preparar directorio de adjuntos con permisos de escritura
RUN mkdir -p /app/attached_assets/service_images && \
    chown -R nextjs:nodejs /app

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=10000

# Render expone el puerto a través de $PORT
EXPOSE 10000

# Healthcheck para Render
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD node -e "const http = require('http'); const port = process.env.PORT || 10000; const req = http.get('http://localhost:' + port + '/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); }); req.on('error', () => process.exit(1)); req.setTimeout(10000, () => { req.destroy(); process.exit(1); });"

# Cambiar a usuario no-root
USER nextjs

# Entrypoint con dumb-init para manejo correcto de señales
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "build/server/index.js"]
