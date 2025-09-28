# ==============================================
# Dockerfile optimizado para producción - Milo's Shop
# Multi-stage build para reducir el tamaño final
# ==============================================

# ===== STAGE 1: DEPENDENCIES =====
# Instalación de dependencias en una etapa separada
FROM node:20-alpine AS deps

# Instalar dependencias del sistema necesarias para compilación
RUN apk add --no-cache python3 make g++ libc6-compat

WORKDIR /app

# Copiar archivos de configuración de dependencias
COPY package.json package-lock.json ./

# Instalar TODAS las dependencias (incluidas devDependencies para build)
RUN npm ci --include=dev && \
    npm cache clean --force

# ===== STAGE 2: BUILDER =====
# Construcción de la aplicación
FROM node:20-alpine AS builder

# Variables de build para optimización
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

# Copiar node_modules desde la etapa anterior
COPY --from=deps /app/node_modules ./node_modules

# Copiar archivos de configuración
COPY package.json package-lock.json tsconfig.json vite.config.ts ./
COPY drizzle.config.ts ./
COPY postcss.config.js tailwind.config.ts ./
COPY components.json ./

# Copiar código fuente
COPY client ./client
COPY server ./server
COPY shared ./shared
COPY migrations ./migrations

# Build del frontend (Vite)
RUN npm run build

# Build del backend (esbuild)
# El script ya está configurado en package.json
RUN npx esbuild server/index.ts \
    --platform=node \
    --packages=external \
    --bundle \
    --format=esm \
    --outdir=dist \
    --minify \
    --sourcemap=external

# ===== STAGE 3: PRODUCTION =====
# Imagen final optimizada para producción
FROM node:20-alpine AS production

# Instalar dumb-init para manejo correcto de señales
RUN apk add --no-cache dumb-init

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S milosapp -u 1001

WORKDIR /app

# Copiar package.json para producción
COPY package.json package-lock.json ./

# Instalar SOLO dependencias de producción
RUN npm ci --only=production --omit=dev && \
    npm cache clean --force && \
    rm -rf /tmp/*

# Copiar archivos compilados desde builder
COPY --from=builder --chown=milosapp:nodejs /app/dist ./dist
COPY --from=builder --chown=milosapp:nodejs /app/client/dist ./client/dist

# Copiar archivos necesarios para producción
COPY --chown=milosapp:nodejs migrations ./migrations
COPY --chown=milosapp:nodejs drizzle.config.ts ./

# Crear directorio para uploads si es necesario
RUN mkdir -p /app/uploads && chown -R milosapp:nodejs /app/uploads

# Cambiar a usuario no-root
USER milosapp

# Variables de entorno para producción
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=512"

# Puerto configurable (Railway proporciona PORT)
ARG PORT=5000
ENV PORT=${PORT}
EXPOSE ${PORT}

# Health check optimizado
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + process.env.PORT + '/api/health', (res) => { \
    if (res.statusCode === 200) process.exit(0); \
    else process.exit(1); \
  }).on('error', () => process.exit(1));"

# Usar dumb-init para manejo correcto de señales
ENTRYPOINT ["dumb-init", "--"]

# Comando de inicio
CMD ["node", "--enable-source-maps", "dist/index.js"]