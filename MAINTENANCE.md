# 📋 Guía de Mantenimiento y Monitoreo - Milos-Shop

Esta guía proporciona procedimientos completos para el mantenimiento continuo y monitoreo de la aplicación Milos-Shop en producción. Incluye guías para monitoreo de logs, backups, actualizaciones de dependencias, alertas y resolución de problemas comunes.

## 📋 Tabla de Contenidos

- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Monitoreo de Logs](#monitoreo-de-logs)
- [Backups de Base de Datos](#backups-de-base-de-datos)
- [Actualizaciones de Dependencias](#actualizaciones-de-dependencias)
- [Sistema de Alertas](#sistema-de-alertas)
- [Procedimientos de Resolución de Problemas](#procedimientos-de-resolución-de-problemas)
- [Mantenimiento Rutinario](#mantenimiento-rutinario)
- [Contactos de Soporte](#contactos-de-soporte)

## 🏗️ Arquitectura del Sistema

### Componentes Principales

- **Backend**: Node.js/Express con TypeScript
- **Frontend**: React con Vite, TailwindCSS
- **Base de Datos**: SQLite (producción), opción PostgreSQL
- **Contenedorización**: Docker con Docker Compose
- **WebSockets**: Socket.io para actualizaciones en tiempo real
- **ORM**: Drizzle ORM con migraciones
- **Monitoreo**: Sentry para errores, health checks integrados

### Servicios en Producción

- Puerto principal: 5000
- Health check endpoint: `GET /api/services`
- Base de datos: `/app/data/milos_shop.db` (en contenedor)
- Assets estáticos: `/attached_assets/`

## 📊 Monitoreo de Logs

### Tipos de Logs

#### 1. Logs de Aplicación
Los logs de la aplicación se generan automáticamente para todas las rutas API:

```
METHOD /api/path STATUS_CODE in DURATIONms :: {response_json}
```

**Comandos para ver logs:**

```bash
# En contenedor Docker
docker logs milos-shop

# En contenedor con seguimiento en tiempo real
docker logs -f milos-shop

# Últimas 100 líneas
docker logs --tail 100 milos-shop
```

#### 2. Logs de Sentry
Errores y excepciones se capturan automáticamente con Sentry:

- **DSN**: Configurado en `SENTRY_DSN`
- **Entorno**: `NODE_ENV=production`
- **Tasa de muestreo**: 100% para transacciones y perfiles

**Ver errores en Sentry Dashboard:**
1. Accede a https://sentry.io
2. Selecciona el proyecto Milos-Shop
3. Revisa Issues y Performance

#### 3. Logs del Sistema
```bash
# Logs del sistema operativo (si es necesario)
docker exec milos-shop tail -f /var/log/syslog

# Logs de Docker
docker-compose logs -f
```

### Configuración de Log Levels

```env
LOG_LEVEL=info  # Opciones: error, warn, info, debug
```

### Monitoreo de Rendimiento

- **Tiempos de respuesta API**: Monitoreados automáticamente
- **Uso de CPU/Memoria**: Ver con `docker stats`
- **Conexiones WebSocket**: Logs en tiempo real

## 💾 Backups de Base de Datos

### Estrategia de Backup

Dado que usa SQLite, los backups consisten en copiar el archivo de base de datos.

### Backup Automático

```bash
#!/bin/bash
# backup-db.sh

BACKUP_DIR="/app/backups"
TIMESTAMP=$(date +%Y-%m-%dT%H-%M-%S)
DB_PATH="/app/data/milos_shop.db"
BACKUP_FILE="$BACKUP_DIR/milos_shop_backup_$TIMESTAMP.db"

# Crear directorio si no existe
mkdir -p $BACKUP_DIR

# Copiar base de datos
cp $DB_PATH $BACKUP_FILE

# Comprimir
gzip $BACKUP_FILE

echo "Backup completado: $BACKUP_FILE.gz"
```

### Backup Manual

```bash
# Dentro del contenedor
docker exec milos-shop cp /app/data/milos_shop.db /app/backups/milos_shop_manual_$(date +%Y%m%d_%H%M%S).db

# Desde host (si volumen montado)
cp /path/to/volume/milos_shop.db ./backups/milos_shop_manual_$(date +%Y%m%d_%H%M%S).db
```

### Restauración

```bash
# Detener la aplicación
docker-compose down

# Restaurar backup
cp backup_file.db /app/data/milos_shop.db

# Reiniciar aplicación
docker-compose up -d

# Verificar integridad
docker exec milos-shop sqlite3 /app/data/milos_shop.db "PRAGMA integrity_check;"
```

### Retención de Backups

- **Diarios**: Mantener 7 días
- **Semanales**: Mantener 4 semanas
- **Mensuales**: Mantener 12 meses

```bash
# Script de limpieza
find /app/backups -name "*.db.gz" -mtime +7 -delete  # Eliminar backups > 7 días
```

## 🔄 Actualizaciones de Dependencias

### Verificación de Vulnerabilidades

```bash
# Verificar vulnerabilidades
npm audit

# Actualizar dependencias menores
npm update

# Verificar compatibilidad
npm outdated
```

### Proceso de Actualización

#### 1. Actualización Menor (patch)

```bash
# Backup antes de actualizar
npm run backup-db

# Actualizar dependencias
npm update

# Rebuild de la aplicación
npm run build

# Reiniciar contenedor
docker-compose restart milos-shop

# Verificar funcionamiento
curl http://localhost:5000/api/services
```

#### 2. Actualización Mayor

```bash
# En entorno de staging primero
git checkout -b update-dependencies

# Actualizar package.json
npm install package@latest

# Ejecutar tests
npm test

# Build y deploy en staging
npm run build
docker-compose -f docker-compose.staging.yml up -d

# Si OK, merge a main y deploy en producción
```

### Actualización de Docker Images

```bash
# Pull latest images
docker-compose pull

# Rebuild si Dockerfile cambió
docker-compose build --no-cache

# Deploy
docker-compose up -d
```

### Migraciones de Base de Datos

```bash
# Generar nuevas migraciones (desarrollo)
npm run db:generate

# Aplicar migraciones
npm run db:push

# Verificar estado
npm run db:check
```

## 🚨 Sistema de Alertas

### Alertas con Sentry

Configuradas automáticamente para:
- Errores no manejados
- Excepciones del servidor
- Problemas de rendimiento
- Tiempos de respuesta lentos

### Health Checks

```bash
# Health check manual
curl -f http://localhost:5000/api/services

# En Docker Compose
docker-compose ps
docker stats
```

### Alertas Personalizadas

#### Alerta de Espacio en Disco

```bash
#!/bin/bash
# check-disk-space.sh

THRESHOLD=90
USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')

if [ $USAGE -gt $THRESHOLD ]; then
    echo "ALERTA: Uso de disco > ${THRESHOLD}% (${USAGE}%)"
    # Enviar notificación (email, Slack, etc.)
fi
```

#### Alerta de Memoria Alta

```bash
#!/bin/bash
# check-memory.sh

CONTAINER="milos-shop"
MEM_USAGE=$(docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemPerc}}" | grep $CONTAINER | awk '{print $3}' | sed 's/%//')

if (( $(echo "$MEM_USAGE > 80" | bc -l) )); then
    echo "ALERTA: Uso de memoria alto en $CONTAINER (${MEM_USAGE}%)"
fi
```

### Notificaciones

Configurar alertas para:
- Errores 5xx
- Tiempo de respuesta > 5s
- Uso de CPU > 80%
- Uso de memoria > 80%
- Espacio en disco < 10% libre

## 🔧 Procedimientos de Resolución de Problemas

### Problema: Aplicación no responde

**Síntomas:**
- Error 502/503
- Timeout en requests

**Solución:**
```bash
# Verificar estado del contenedor
docker-compose ps

# Ver logs recientes
docker-compose logs --tail 50 milos-shop

# Reiniciar aplicación
docker-compose restart milos-shop

# Si no funciona, rebuild
docker-compose up -d --build
```

### Problema: Base de datos corrupta

**Síntomas:**
- Errores SQL
- Datos inconsistentes

**Solución:**
```bash
# Backup actual (si posible)
cp milos_shop.db milos_shop_corrupted.db

# Restaurar desde backup
cp backup_file.db milos_shop.db

# Verificar integridad
sqlite3 milos_shop.db "PRAGMA integrity_check;"

# Recrear si necesario
rm milos_shop.db
npm run db:push
npm run seed
```

### Problema: Alta carga del servidor

**Síntomas:**
- Respuestas lentas
- CPU/Memoria alta

**Solución:**
```bash
# Ver procesos
docker stats

# Reiniciar contenedor
docker-compose restart milos-shop

# Escalar si es necesario
docker-compose up -d --scale milos-shop=2
```

### Problema: WebSockets no funcionan

**Síntomas:**
- Panel admin no se actualiza en tiempo real

**Solución:**
```bash
# Verificar conexión WebSocket
curl -I -N -H "Connection: Upgrade" -H "Upgrade: websocket" http://localhost:5000

# Reiniciar servidor
docker-compose restart milos-shop
```

### Problema: Errores de rate limiting

**Síntomas:**
- Usuarios reportan bloqueos temporales

**Solución:**
```bash
# Verificar configuración de rate limit en server/index.ts
# Ajustar límites si es necesario
# Reiniciar aplicación
docker-compose restart milos-shop
```

## 📅 Mantenimiento Rutinario

### Checklist Diario

- [ ] Verificar estado de contenedores: `docker-compose ps`
- [ ] Revisar logs de errores: `docker-compose logs --since 24h | grep -i error`
- [ ] Verificar espacio en disco: `df -h`
- [ ] Backup automático ejecutado
- [ ] Health checks OK: `curl http://localhost:5000/api/services`

### Checklist Semanal

- [ ] Actualizar dependencias menores: `npm update`
- [ ] Verificar vulnerabilidades: `npm audit`
- [ ] Limpiar backups antiguos
- [ ] Revisar métricas de rendimiento en Sentry
- [ ] Verificar logs de WebSockets

### Checklist Mensual

- [ ] Actualización mayor de dependencias (si disponible)
- [ ] Revisión de configuraciones de seguridad
- [ ] Optimización de base de datos: `VACUUM;` en SQLite
- [ ] Verificación de backups: Restaurar en entorno de test
- [ ] Actualización de Docker images

## 📞 Contactos de Soporte

### Equipo de Desarrollo
- **Email**: dev@milos-shop.com
- **Slack**: #milos-shop-support
- **Documentación**: https://docs.milos-shop.com

### Infraestructura
- **Proveedor**: [Nombre del proveedor cloud]
- **Dashboard**: [URL del dashboard]
- **Alertas**: [Sistema de alertas]

### Base de Datos
- **Tipo**: SQLite
- **Ubicación**: `/app/data/milos_shop.db`
- **Backups**: `/app/backups/`

---

**Última actualización**: $(date +%Y-%m-%d)
**Versión**: 1.0.0