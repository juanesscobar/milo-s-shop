# 🐳 Docker Deployment Guide - Milo's Shop

## 📋 Resumen de la Configuración Docker

Esta guía describe la configuración Docker optimizada para producción de Milo's Shop, una aplicación de reserva y gestión de autolavado en Paraguay.

## 🏗️ Arquitectura Docker

### Dockerfile Multi-Stage
- **Stage 1 (deps)**: Instalación de dependencias con cache optimizado
- **Stage 2 (builder)**: Compilación de TypeScript y build de Vite
- **Stage 3 (production)**: Imagen final minimalista con Alpine Linux

### Características de Seguridad
- ✅ Usuario no-root (`milosapp`)
- ✅ Imagen base Alpine (mínimo tamaño)
- ✅ Health checks automáticos
- ✅ Variables de entorno seguras
- ✅ Manejo de señales con dumb-init

## 🚀 Deploy en Railway

### Opción 1: Configuración Automática
Railway detectará automáticamente el `Dockerfile` y usará la configuración en `railway.json` o `railway.toml`.

### Opción 2: Deploy Manual

1. **Conecta tu repositorio GitHub con Railway**
   ```bash
   railway login
   railway link
   ```

2. **Configura las variables de entorno en Railway Dashboard:**
   ```env
   DATABASE_URL=postgresql://...@ep-xxx.neon.tech/milos_shop
   SESSION_SECRET=<generado-automáticamente>
   ADMIN_WS_TOKEN=<generado-automáticamente>
   CORS_ORIGIN=https://tu-app.up.railway.app
   NODE_ENV=production
   ```

3. **Deploy:**
   ```bash
   railway up
   ```

## 🐋 Deploy Local con Docker

### Build de la imagen
```bash
# Build para producción
docker build -t miloshop:latest .

# Build con cache (más rápido en rebuilds)
docker build --cache-from miloshop:latest -t miloshop:latest .
```

### Ejecutar con Docker Compose
```bash
# Copiar y configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores de producción

# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f miloshop

# Detener servicios
docker-compose down
```

### Ejecutar contenedor individual
```bash
docker run -d \
  --name miloshop \
  -p 5000:5000 \
  --env-file .env \
  --restart unless-stopped \
  miloshop:latest
```

## 🔧 Variables de Entorno Requeridas

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DATABASE_URL` | URL de PostgreSQL (Neon) | `postgresql://user:pass@host/db` |
| `SESSION_SECRET` | Secret para sesiones | Generado automáticamente |
| `ADMIN_WS_TOKEN` | Token para WebSocket admin | Generado automáticamente |
| `PORT` | Puerto del servidor | `5000` (Railway lo asigna) |
| `CORS_ORIGIN` | URL del frontend | `https://tu-dominio.com` |
| `NODE_ENV` | Entorno de ejecución | `production` |

### Variables Opcionales

| Variable | Descripción | Por defecto |
|----------|-------------|-------------|
| `SMTP_HOST` | Servidor SMTP | - |
| `SMTP_PORT` | Puerto SMTP | `587` |
| `SMTP_USER` | Usuario SMTP | - |
| `SMTP_PASS` | Contraseña SMTP | - |
| `STRIPE_SECRET_KEY` | API Key de Stripe | - |
| `MERCADOPAGO_ACCESS_TOKEN` | Token de MercadoPago | - |
| `SENTRY_DSN` | DSN de Sentry | - |
| `LOG_LEVEL` | Nivel de logging | `info` |

## 📊 Health Checks

El contenedor incluye health checks automáticos:
- **Endpoint**: `/api/health`
- **Intervalo**: 30 segundos
- **Timeout**: 5 segundos
- **Reintentos**: 3

### Verificar health manualmente:
```bash
curl http://localhost:5000/api/health
```

Respuesta esperada:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "production",
  "memory": {
    "used": 45,
    "total": 512
  },
  "database": "connected"
}
```

## 🔍 Debugging

### Ver logs del contenedor
```bash
docker logs miloshop -f
```

### Acceder al contenedor
```bash
docker exec -it miloshop sh
```

### Verificar uso de recursos
```bash
docker stats miloshop
```

## 📈 Optimizaciones de Producción

1. **Tamaño de imagen**: ~150MB (gracias a Alpine Linux)
2. **Tiempo de build**: ~2-3 minutos con cache
3. **Memoria**: Limitada a 512MB (configurable)
4. **CPU**: Limitada a 1 core (configurable)
5. **Seguridad**: Usuario no-root, variables sensibles en .env

## 🚨 Troubleshooting

### Problema: El contenedor no inicia
```bash
# Verificar logs
docker logs miloshop

# Verificar variables de entorno
docker exec miloshop env
```

### Problema: No se puede conectar a la base de datos
- Verificar que `DATABASE_URL` esté correctamente configurada
- Verificar que la IP del servidor esté en whitelist en Neon

### Problema: Health check falla
```bash
# Verificar endpoint manualmente
docker exec miloshop curl http://localhost:5000/api/health
```

## 📝 Notas Importantes

1. **Base de datos**: Este proyecto usa PostgreSQL en Neon (serverless). No incluye PostgreSQL en el contenedor.

2. **Archivos estáticos**: Los archivos compilados del frontend se sirven desde Express en la misma aplicación.

3. **WebSockets**: Configurados para actualizaciones en tiempo real del dashboard admin.

4. **Sesiones**: Almacenadas en PostgreSQL usando `connect-pg-simple`.

5. **Uploads**: Los archivos subidos se almacenan en `/app/uploads` dentro del contenedor (usar volumen para persistencia).

## 🔄 Actualización de la Aplicación

```bash
# 1. Hacer pull de los cambios
git pull origin main

# 2. Rebuild la imagen
docker build -t miloshop:latest .

# 3. Recrear el contenedor
docker-compose down && docker-compose up -d

# O con Railway
railway up
```

## 📚 Referencias

- [Dockerfile](./Dockerfile) - Configuración multi-stage
- [docker-compose.yml](./docker-compose.yml) - Orquestación local
- [.dockerignore](./.dockerignore) - Archivos excluidos
- [railway.json](./railway.json) - Configuración de Railway
- [railway.toml](./railway.toml) - Configuración alternativa de Railway

---

**Milo's Shop** - Sistema de gestión de autolavado 🚗✨