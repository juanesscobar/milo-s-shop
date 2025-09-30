# Guía de Despliegue Docker para Milo’s Shop

Esta guía explica cómo desplegar la aplicación Milo’s Shop usando Docker en fly.io y Railway.

## Imagen Docker

La aplicación usa una imagen Docker multi-etapa optimizada con:
- **Seguridad**: Usuario no-root, dumb-init para manejo de señales
- **Optimización**: Build multi-etapa, capas eficientes
- **Monitoreo**: Healthcheck integrado en `/api/health`

## Variables de Entorno Requeridas

Configura estas variables en tu plataforma de despliegue:

```bash
# Base de datos
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# Sesiones
SESSION_SECRET="tu-session-secret-seguro"

# WebSockets para admin
ADMIN_WS_TOKEN="tu-admin-token-seguro"

# Servidor
NODE_ENV="production"
PORT=3000

# CORS (configura para tu dominio)
CORS_ORIGIN="https://tu-dominio.com"

# Opcionales: Email, pagos, etc.
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="tu-email@gmail.com"
SMTP_PASS="tu-app-password"
STRIPE_SECRET_KEY="sk_live_..."
```

## Despliegue en fly.io

### 1. Instalar flyctl
```bash
# Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex

# Verificar instalación
fly version
```

### 2. Autenticarse
```bash
fly auth login
```

### 3. Crear aplicación
```bash
fly launch --name milos-shop --region scl
```

### 4. Configurar variables de entorno
```bash
fly secrets set DATABASE_URL="postgresql://..."
fly secrets set SESSION_SECRET="tu-secret-seguro"
fly secrets set ADMIN_WS_TOKEN="tu-admin-token"
fly secrets set CORS_ORIGIN="https://milos-shop.fly.dev"
```

### 5. Desplegar
```bash
fly deploy
```

### 6. Verificar despliegue
```bash
fly status
fly logs
```

### Comandos útiles fly.io
```bash
# Ver estado
fly status

# Ver logs
fly logs

# Escalar
fly scale count 2

# Abrir en navegador
fly open

# Conectar a base de datos
fly postgres connect
```

## Despliegue en Railway

### 1. Instalar Railway CLI
```bash
npm install -g @railway/cli
```

### 2. Autenticarse
```bash
railway login
```

### 3. Crear proyecto
```bash
railway init milos-shop
cd milos-shop
```

### 4. Conectar repositorio Git
```bash
railway link
```

### 5. Configurar variables de entorno
```bash
railway variables set DATABASE_URL="postgresql://..."
railway variables set SESSION_SECRET="tu-secret-seguro"
railway variables set ADMIN_WS_TOKEN="tu-admin-token"
railway variables set NODE_ENV="production"
railway variables set PORT=3000
```

### 6. Desplegar
```bash
railway up
```

### 7. Verificar despliegue
```bash
railway status
railway logs
```

### Comandos útiles Railway
```bash
# Ver estado
railway status

# Ver logs
railway logs

# Abrir en navegador
railway open

# Conectar a base de datos
railway connect
```

## Verificación Post-Despliegue

1. **Health Check**: Visita `https://tu-dominio.com/api/health`
2. **Aplicación**: Accede al frontend en la URL del despliegue
3. **Base de Datos**: Verifica conexión ejecutando queries
4. **Sesiones**: Prueba login/logout
5. **WebSockets**: Verifica panel admin si aplica

## Troubleshooting

### Problemas Comunes

**Error de conexión DB:**
- Verifica DATABASE_URL
- Asegúrate que la DB esté accesible desde el contenedor

**Healthcheck falla:**
- Revisa logs: `fly logs` o `railway logs`
- Verifica que el puerto 3000 esté expuesto

**Variables de entorno:**
- En fly.io: usa `fly secrets list`
- En Railway: usa `railway variables`

**Build falla:**
- Verifica que Dockerfile esté en la raíz
- Asegúrate que .dockerignore excluya archivos innecesarios

## Optimizaciones Adicionales

- **CDN**: Configura Cloudflare para assets estáticos
- **Monitoring**: Integra Sentry con SENTRY_DSN
- **Backups**: Configura backups automáticos de DB
- **SSL**: Ambos plataformas proveen SSL automático