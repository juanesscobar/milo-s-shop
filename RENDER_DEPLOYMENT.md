# 🚀 Deployment en Render.com - Milo's Shop

Esta guía te llevará paso a paso para desplegar tu aplicación en Render.com con PostgreSQL.

## 📋 Pre-requisitos

- ✅ Base de datos PostgreSQL creada en Render.com
- ✅ Cuenta de Render.com activa
- ✅ Código subido a GitHub/GitLab

---

## 🗄️ Paso 1: Obtener la URL de la Base de Datos

1. Ve a tu **Dashboard de Render.com**
2. Haz clic en tu base de datos PostgreSQL
3. En la página de detalles, busca la sección **"Connections"**
4. Copia la **"Internal Database URL"** (se ve así):
   ```
   postgresql://milos_shop_user:xxxxx@dpg-xxxxx-a/milos_shop_db
   ```
   
   ⚠️ **IMPORTANTE**: Usa la **Internal Database URL**, NO la External URL. La Internal es más rápida y segura para servicios dentro de Render.

---

## 🔐 Paso 2: Generar Secrets Seguros

Necesitas generar valores seguros para las variables de sesión. Ejecuta estos comandos en tu terminal local:

### Para SESSION_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Para ADMIN_WS_TOKEN:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Guarda estos valores**, los necesitarás en el siguiente paso.

---

## ⚙️ Paso 3: Configurar Variables de Entorno en Render

1. En Render.com, ve a tu **Web Service** (o créalo si aún no existe)
2. Ve a la pestaña **"Environment"**
3. Haz clic en **"Add Environment Variable"**
4. Agrega las siguientes variables **UNA POR UNA**:
        
### 🔴 Variables OBLIGATORIAS:

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `DATABASE_URL` | `postgresql://milos_shop_user:xxxxx@dpg-xxxxx-a/milos_shop_db` | La Internal Database URL que copiaste en el Paso 1 |
| `SESSION_SECRET` | `[tu-secret-generado]` | El valor generado en el Paso 2 |
| `ADMIN_WS_TOKEN` | `[tu-token-generado]` | El valor generado en el Paso 2 |
| `NODE_ENV` | `production` | Modo de producción |
| `PORT` | `10000` | Puerto por defecto de Render (NO cambiar) |

### 🟡 Variables OPCIONALES (pero recomendadas):

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `CORS_ORIGIN` | `https://tu-app.onrender.com` | Tu dominio de Render (actualizar después del deploy) |
| `LOG_LEVEL` | `info` | Nivel de logging |
| `SENTRY_DSN` | `https://...` | Para monitoreo de errores (opcional) |

### 🟢 Variables para Email (OPCIONAL - solo si usas notificaciones):

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `SMTP_HOST` | `smtp.gmail.com` | Servidor SMTP |
| `SMTP_PORT` | `587` | Puerto SMTP |
| `SMTP_USER` | `tu-email@gmail.com` | Tu email |
| `SMTP_PASS` | `tu-app-password` | Contraseña de aplicación de Gmail |

### 🟢 Variables para Pagos (OPCIONAL - solo si usas Stripe/MercadoPago):

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `STRIPE_SECRET_KEY` | `sk_live_...` | API Key de Stripe (producción) |
| `STRIPE_PUBLISHABLE_KEY` | `pk_live_...` | Public Key de Stripe |
| `MERCADOPAGO_ACCESS_TOKEN` | `APP_USR-...` | Token de MercadoPago |

---

## 🐳 Paso 4: Configurar el Web Service

### Si estás CREANDO un nuevo Web Service:

1. En Render Dashboard, haz clic en **"New +"** → **"Web Service"**
2. Conecta tu repositorio de GitHub/GitLab
3. Configura los siguientes valores:

| Campo | Valor |
|-------|-------|
| **Name** | `milos-shop` (o el nombre que prefieras) |
| **Region** | `Oregon (US West)` o el más cercano a Paraguay |
| **Branch** | `main` (o tu rama principal) |
| **Root Directory** | (dejar vacío) |
| **Runtime** | `Docker` |
| **Instance Type** | `Free` (para empezar) o `Starter` |

4. Haz clic en **"Create Web Service"**

### Si ya TIENES un Web Service creado:

1. Ve a tu Web Service en Render
2. Verifica que esté configurado para usar **Docker**
3. Asegúrate de que las variables de entorno estén configuradas (Paso 3)

---

## 🔄 Paso 5: Ejecutar Migraciones de Base de Datos

Después del primer deploy, necesitas crear las tablas en la base de datos:

### Opción A: Desde tu terminal local (recomendado)

1. Instala las dependencias localmente:
   ```bash
   npm install
   ```

2. Crea un archivo `.env.production` con la DATABASE_URL de Render:
   ```bash
   DATABASE_URL="postgresql://milos_shop_user:xxxxx@dpg-xxxxx-a.oregon-postgres.render.com/milos_shop_db"
   ```

3. Ejecuta las migraciones:
   ```bash
   npx drizzle-kit push --config=drizzle.config.ts
   ```

### Opción B: Desde Render Shell (alternativa)

1. En tu Web Service, ve a la pestaña **"Shell"**
2. Ejecuta:
   ```bash
   npm install drizzle-kit
   npx drizzle-kit push
   ```

---

## 🌱 Paso 6: Poblar la Base de Datos (Seed)

Para crear el usuario administrador inicial y datos de prueba:

### Desde tu terminal local:

```bash
# Asegúrate de tener el .env.production configurado
node server/seed.ts
```

O si prefieres usar el seed completo con servicios:

```bash
node seed-full.js
```

Esto creará:
- ✅ Usuario administrador (email: `admin@milosshop.com`, password: `admin123`)
- ✅ Servicios de ejemplo
- ✅ Datos de prueba

---

## 🎉 Paso 7: Verificar el Deploy

1. Espera a que Render termine de construir y desplegar (5-10 minutos)
2. Una vez que el estado sea **"Live"**, haz clic en la URL de tu app
3. Deberías ver la landing page de Milo's Shop
4. Prueba el login de administrador:
   - Email: `admin@milosshop.com`
   - Password: `admin123`

---

## 🔍 Paso 8: Actualizar CORS_ORIGIN

Después del primer deploy exitoso:

1. Copia la URL de tu aplicación (ej: `https://milos-shop.onrender.com`)
2. Ve a **Environment Variables** en Render
3. Actualiza `CORS_ORIGIN` con tu URL real
4. Guarda los cambios (esto reiniciará el servicio)

---

## 🐛 Troubleshooting

### ❌ Error: "Cannot connect to database"

**Solución:**
- Verifica que `DATABASE_URL` sea la **Internal Database URL**
- Asegúrate de que la base de datos esté en estado "Available"
- Revisa los logs en Render: **Logs** tab

### ❌ Error: "Port already in use"

**Solución:**
- NO cambies la variable `PORT` en Render
- Render asigna automáticamente el puerto 10000

### ❌ Error: "Build failed"

**Solución:**
- Verifica que tu `Dockerfile` esté en la raíz del proyecto
- Revisa los logs de build en Render
- Asegúrate de que todas las dependencias estén en `package.json`

### ❌ La app se despliega pero no carga

**Solución:**
- Verifica que las migraciones se hayan ejecutado (Paso 5)
- Revisa los logs en tiempo real: **Logs** tab
- Verifica que `NODE_ENV=production` esté configurado

### ❌ Error: "Session secret not configured"

**Solución:**
- Asegúrate de haber configurado `SESSION_SECRET` en las variables de entorno
- Regenera el secret con el comando del Paso 2

---

## 📊 Monitoreo y Logs

### Ver logs en tiempo real:
1. Ve a tu Web Service en Render
2. Haz clic en la pestaña **"Logs"**
3. Aquí verás todos los logs del servidor

### Métricas:
1. Ve a la pestaña **"Metrics"**
2. Monitorea CPU, memoria y requests

---

## 🔄 Actualizaciones Futuras

Cada vez que hagas `git push` a tu rama principal:
1. Render detectará los cambios automáticamente
2. Construirá una nueva imagen Docker
3. Desplegará la nueva versión
4. El proceso toma ~5-10 minutos

---

## 🔐 Seguridad Post-Deploy

### ⚠️ IMPORTANTE - Cambiar credenciales por defecto:

1. **Cambiar password del admin:**
   - Inicia sesión como admin
   - Ve a configuración de perfil
   - Cambia la contraseña

2. **Rotar secrets periódicamente:**
   - Regenera `SESSION_SECRET` cada 3-6 meses
   - Regenera `ADMIN_WS_TOKEN` cada 3-6 meses

3. **Configurar HTTPS:**
   - Render proporciona HTTPS automáticamente
   - Verifica que `cookie.secure` esté en `true` en producción

---

## 📞 Soporte

Si tienes problemas:

1. **Revisa los logs** en Render (pestaña Logs)
2. **Verifica las variables de entorno** (pestaña Environment)
3. **Consulta la documentación de Render**: https://render.com/docs
4. **Revisa el README.md** del proyecto para más detalles

---

## ✅ Checklist Final

Antes de considerar el deploy completo, verifica:

- [ ] Base de datos PostgreSQL creada y "Available"
- [ ] Todas las variables de entorno obligatorias configuradas
- [ ] Web Service creado y en estado "Live"
- [ ] Migraciones ejecutadas exitosamente
- [ ] Seed ejecutado (usuario admin creado)
- [ ] Landing page carga correctamente
- [ ] Login de administrador funciona
- [ ] CORS_ORIGIN actualizado con la URL real
- [ ] Password del admin cambiado

---

## 🎯 Próximos Pasos

Una vez que tu app esté funcionando:

1. **Configurar dominio personalizado** (opcional)
2. **Configurar backups automáticos** de la base de datos
3. **Implementar monitoreo con Sentry** (opcional)
4. **Configurar notificaciones por email** (opcional)
5. **Integrar pagos** (Stripe/MercadoPago)

---

**¡Felicidades! 🎉 Tu aplicación Milo's Shop está ahora en producción.**