# 🚀 Guía de Despliegue - Milos-Shop

Esta guía proporciona instrucciones detalladas para desplegar la aplicación Milos-Shop en diferentes plataformas de hosting.

## 📋 Prerrequisitos

- Node.js 18+
- Docker (opcional pero recomendado)
- Cuenta en la plataforma de destino
- Variables de entorno configuradas

## 🔧 Configuración Previa

### 1. Variables de Entorno

Copia `.env.example` a `.env` y configura las variables:

```bash
cp .env.example .env
```

Variables críticas para producción:
- `SESSION_SECRET`: Clave segura para sesiones
- `ADMIN_WS_TOKEN`: Token seguro para WebSockets admin
- `DATABASE_URL`: URL de base de datos
- `NODE_ENV=production`

### 2. Build de Producción

```bash
npm run build
```

### 3. Base de Datos

Asegúrate de que las migraciones estén aplicadas:

```bash
npm run db:push
```

---

## 🌐 Despliegue en Heroku

### Opción 1: Despliegue Directo

1. **Crear aplicación en Heroku:**
   ```bash
   heroku create milos-shop-tu-nombre
   ```

2. **Configurar variables de entorno:**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set SESSION_SECRET=tu-clave-muy-segura
   heroku config:set ADMIN_WS_TOKEN=token-admin-seguro
   heroku config:set DATABASE_URL=file:./milos_shop.db
   ```

3. **Desplegar:**
   ```bash
   git push heroku main
   ```

### Opción 2: Usando Docker

1. **Crear aplicación con stack de contenedores:**
   ```bash
   heroku create milos-shop-tu-nombre --stack=container
   ```

2. **Configurar variables:**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set SESSION_SECRET=tu-clave-muy-segura
   heroku config:set ADMIN_WS_TOKEN=token-admin-seguro
   ```

3. **Desplegar:**
   ```bash
   heroku container:push web
   heroku container:release web
   ```

**Archivos necesarios para Heroku:**
- `heroku.yml` (para stack de contenedores)
- `package.json` con script `start`

---

## 🚀 Despliegue en Vercel

### Despliegue del Frontend

1. **Instalar Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Desplegar frontend:**
   ```bash
   cd client
   vercel --prod
   ```

3. **Configurar variables de entorno en Vercel dashboard**

### Despliegue del Backend (API Routes)

Vercel no es ideal para APIs con WebSockets. Considera usar Railway o Render para el backend.

---

## ☁️ Despliegue en AWS

### Opción 1: AWS Elastic Beanstalk

1. **Instalar EB CLI:**
   ```bash
   pip install awsebcli
   ```

2. **Inicializar proyecto:**
   ```bash
   eb init
   ```

3. **Crear entorno:**
   ```bash
   eb create production-env
   ```

4. **Desplegar:**
   ```bash
   eb deploy
   ```

### Opción 2: AWS EC2 + Docker

1. **Lanzar instancia EC2** (t2.micro para desarrollo)

2. **Instalar Docker:**
   ```bash
   sudo yum update -y
   sudo amazon-linux-extras install docker
   sudo service docker start
   sudo usermod -a -G docker ec2-user
   ```

3. **Desplegar con Docker Compose:**
   ```bash
   docker-compose up -d
   ```

### Opción 3: AWS Fargate (Serverless)

1. **Crear cluster ECS**
2. **Configurar task definition con Docker**
3. **Crear servicio Fargate**

---

## 🐙 Despliegue en Railway

### Despliegue Automático

1. **Generar variables de entorno seguras:**
   ```bash
   node setup-env.js
   ```
   Esto generará valores seguros para `SESSION_SECRET` y `ADMIN_WS_TOKEN`.

2. **Conectar repositorio GitHub a Railway**

3. **Configurar variables de entorno en Railway Dashboard:**
   - Ve a https://railway.app/dashboard
   - Selecciona tu proyecto Milos-Shop
   - Ve a la pestaña "Variables"
   - Agrega las siguientes variables:

### Variables de Entorno Requeridas en Railway:
```
DATABASE_URL=file:./milos_shop.db
SESSION_SECRET=<valor-generado-por-setup-env.js>
ADMIN_WS_TOKEN=<valor-generado-por-setup-env.js>
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://tu-dominio-railway.com
```

### Variables Opcionales:
```
# Email (si usas notificaciones)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password

# Pagos (si procesas pagos)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
MERCADOPAGO_ACCESS_TOKEN=...

# Logging
LOG_LEVEL=info
```

4. **Railway detectará automáticamente Node.js y desplegará**

**⚠️ Importante:** Nunca commits los valores reales de `SESSION_SECRET` y `ADMIN_WS_TOKEN` al repositorio. Solo usa los valores generados por el script en el dashboard de Railway.

---

## 🎨 Despliegue en Render

### Despliegue con Docker

1. **Crear servicio Web Service**
2. **Seleccionar Docker**
3. **Conectar repositorio GitHub**
4. **Configurar variables de entorno**
5. **Desplegar automáticamente**

### Variables de Entorno en Render:
```
NODE_ENV=production
SESSION_SECRET=tu-clave-segura
ADMIN_WS_TOKEN=token-admin-seguro
DATABASE_URL=file:./milos_shop.db
```

---

## 🐳 Despliegue con Docker (Genérico)

### Construir y Ejecutar

```bash
# Construir imagen
docker build -t milos-shop .

# Ejecutar contenedor
docker run -d \
  --name milos-shop \
  -p 5000:5000 \
  -e NODE_ENV=production \
  -e SESSION_SECRET=tu-clave-segura \
  -e ADMIN_WS_TOKEN=token-admin-seguro \
  milos-shop
```

### Usando Docker Compose

```bash
# Para producción
docker-compose up -d

# Para desarrollo
docker-compose --profile dev up -d
```

---

## 🔒 Consideraciones de Seguridad

### Antes del Despliegue

1. **Cambiar claves secretas:**
   - `SESSION_SECRET`: Genera una clave segura de 32+ caracteres
   - `ADMIN_WS_TOKEN`: Token único para WebSockets admin

2. **Configurar CORS:**
   ```env
   CORS_ORIGIN=https://tu-dominio.com
   ```

3. **HTTPS obligatorio:**
   - Todas las plataformas modernas incluyen HTTPS automático
   - Configura `secure: true` en cookies de sesión

### Monitoreo

1. **Logs:**
   ```bash
   # Ver logs en contenedor
   docker logs milos-shop

   # En Heroku
   heroku logs --tail
   ```

2. **Health Checks:**
   - Endpoint: `GET /api/services`
   - Configurado en Docker healthcheck

---

## 🚀 CI/CD con GitHub Actions

### Archivo `.github/workflows/deploy.yml`

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run tests
      run: npm test

    - name: Build application
      run: npm run build

    - name: Deploy to Heroku
      uses: akhileshns/heroku-deploy@v3.12.12
      with:
        heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
        heroku_app_name: milos-shop-production
        heroku_email: tu-email@ejemplo.com
```

---

## 📊 Monitoreo y Mantenimiento

### Comandos Útiles

```bash
# Ver estado del contenedor
docker ps

# Ver logs
docker logs -f milos-shop

# Reiniciar aplicación
docker restart milos-shop

# Backup de base de datos
cp milos_shop.db milos_shop_backup_$(date +%Y%m%d_%H%M%S).db
```

### Métricas a Monitorear

- **Rendimiento:** Tiempos de respuesta API
- **Disponibilidad:** Uptime del servicio
- **Errores:** Logs de aplicación
- **Uso de recursos:** CPU, memoria, disco

---

## 🆘 Solución de Problemas

### Problemas Comunes

1. **Error de puerto ya en uso:**
   ```bash
   # Cambiar puerto en .env
   PORT=5001
   ```

2. **Error de base de datos:**
   ```bash
   # Recrear base de datos
   rm milos_shop.db
   npm run db:push
   ```

3. **Error de memoria en contenedor:**
   ```bash
   # Aumentar límite de memoria
   docker run --memory=1g milos-shop
   ```

### Soporte

- 📧 Email: soporte@milos-shop.com
- 📖 Documentación: [docs.milos-shop.com](https://docs.milos-shop.com)
- 🐛 Issues: [GitHub Issues](https://github.com/tu-usuario/milos-shop/issues)

---

¡Tu aplicación Milos-Shop está lista para producción! 🎉