# Dockerfile para Milos-Shop
# Aplicación full-stack de lavadero de autos

# ===== ETAPA DE BUILD =====
FROM node:20-alpine AS builder

# Instalar dependencias del sistema para compilación
RUN apk add --no-cache python3 make g++

# Establecer directorio de trabajo
WORKDIR /app

# Crear directorio para base de datos y configurar DATABASE_URL
RUN mkdir -p /app/data
ENV DATABASE_URL="file:/app/data/milos_shop.db"

# Copiar archivos de configuración
COPY package*.json ./
COPY tsconfig.json ./
COPY drizzle.config.ts ./

# Instalar dependencias
RUN npm ci --only=production=false

# Copiar código fuente
COPY . .

# Generar migraciones de base de datos
RUN npm run db:generate

# Build de la aplicación
RUN npm run build

# ===== ETAPA DE PRODUCCIÓN =====
FROM node:20-alpine AS production

# Instalar dependencias del sistema para SQLite
RUN apk add --no-cache sqlite

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S milosapp -u 1001

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos necesarios desde builder
COPY --from=builder --chown=milosapp:nodejs /app/package*.json ./
COPY --from=builder --chown=milosapp:nodejs /app/dist ./dist
COPY --from=builder --chown=milosapp:nodejs /app/client/dist ./client/dist
COPY --from=builder --chown=milosapp:nodejs /app/attached_assets ./attached_assets
COPY --from=builder --chown=milosapp:nodejs /app/migrations ./migrations
COPY --from=builder --chown=milosapp:nodejs /app/drizzle.config.ts ./

# Instalar solo dependencias de producción
RUN npm ci --only=production && npm cache clean --force

# Crear directorio para base de datos
RUN mkdir -p /app/data && chown milosapp:nodejs /app/data

# Cambiar a usuario no-root
USER milosapp

# Variables de entorno
ENV NODE_ENV=production
ENV DATABASE_URL="file:/app/data/milos_shop.db"

# Exponer puerto
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/services', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Comando de inicio
CMD ["npm", "start"]