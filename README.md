# Milo's Shop - Sistema de Reservas para Autolavado 🚗

Sistema moderno de gestión y reservas para autolavado/estética automotriz, diseñado especialmente para el mercado paraguayo con soporte multilingüe (Español/Portugués).

## 🎯 Características Principales

- **Panel de Cliente**: Reservas en línea, seguimiento de servicios, historial
- **Panel Administrativo**: Gestión de reservas, servicios, clientes y reportes
- **Sistema de Autenticación**: Login seguro con roles diferenciados
- **Multilingüe**: Interfaz en Español y Portugués
- **Pagos Múltiples**: Soporte para tarjeta, PIX y efectivo
- **Diseño Responsive**: Mobile-first, inspirado en apps modernas tipo Uber/Rappi

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** con TypeScript
- **Vite** como bundler
- **Tailwind CSS** para estilos
- **shadcn/ui** y Radix UI para componentes
- **Wouter** para routing
- **TanStack Query** para manejo de estado del servidor

### Backend
- **Node.js** con Express + TypeScript
- **PostgreSQL** como base de datos principal
- **Drizzle ORM** para manejo de base de datos
- **Session-based Auth** con connect-pg-simple
- **WebSockets** para actualizaciones en tiempo real

### DevOps
- **Docker** para containerización
- **ESBuild** para bundling del servidor
- **Drizzle Kit** para migraciones

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- PostgreSQL 14+ (o usar SQLite para desarrollo local)

## 🚀 Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/milos-shop.git
cd milos-shop
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Generar claves seguras (opcional pero recomendado)
node setup-env.js
```

4. **Configurar base de datos**
```bash
# Ejecutar migraciones
npm run db:migrate

# (Opcional) Poblar con datos de prueba
npm run db:seed
```

5. **Iniciar el proyecto**
```bash
# Modo desarrollo
npm run dev

# El servidor estará en http://localhost:5000
# El cliente estará en http://localhost:5173
```

## 🔧 Variables de Entorno

Las siguientes variables son necesarias en tu archivo `.env`:

### Esenciales
- `DATABASE_URL`: URL de conexión a la base de datos
- `SESSION_SECRET`: Clave secreta para sesiones (generar con `node setup-env.js`)
- `ADMIN_WS_TOKEN`: Token para WebSockets administrativos

### Configuración del servidor
- `NODE_ENV`: Entorno (development/production)
- `PORT`: Puerto del servidor (default: 5000)
- `CORS_ORIGIN`: Origen permitido para CORS

### Opcionales (para funcionalidades adicionales)
- Variables SMTP para emails
- Claves de Stripe/MercadoPago para pagos
- `SENTRY_DSN` para monitoreo de errores

## 📁 Estructura del Proyecto

```
milos-shop/
├── client/                  # Aplicación React
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # Utilidades y configuración
│   │   └── styles/         # Estilos CSS
│   └── public/             # Assets estáticos
├── server/                  # API Backend
│   ├── auth/               # Sistema de autenticación
│   ├── migrations/         # Migraciones de DB
│   ├── routes.ts           # Rutas de la API
│   └── index.ts            # Entry point del servidor
├── shared/                  # Código compartido
│   └── schema.ts           # Esquemas de DB y validación
├── migrations/             # Archivos de migración SQL
└── docker-compose.yml      # Configuración Docker
```

## 📜 Scripts Principales

```bash
# Desarrollo
npm run dev              # Inicia cliente y servidor en modo desarrollo
npm run dev:client       # Solo cliente
npm run dev:server       # Solo servidor

# Base de datos
npm run db:migrate       # Ejecuta migraciones pendientes
npm run db:seed          # Poblar con datos de prueba
npm run db:drop          # Reiniciar base de datos (¡cuidado!)

# Producción
npm run build            # Construir para producción
npm start                # Iniciar servidor en producción

# Testing y utilidades
npm run check-db         # Verificar conexión a DB
npm run check-users      # Listar usuarios actuales
npm run create-admin     # Crear usuario administrador
```

## 👤 Crear Usuario Administrador

Para crear un usuario administrador inicial:

```bash
node create-admin.js
```

⚠️ **NOTA DE SEGURIDAD**: Los scripts `create-admin.js` y `create-admin-proper.js` contienen contraseñas de prueba hardcodeadas (`AdminPass123!`). Estos scripts son solo para desarrollo inicial. Para producción:

1. **NUNCA** uses las credenciales por defecto
2. Modifica los scripts para usar variables de entorno o solicitar credenciales
3. Cambia inmediatamente las contraseñas después del primer login
4. Considera eliminar estos scripts del repositorio en producción

Credenciales de prueba generadas (SOLO DESARROLLO):
- Email: admin@milosshop.com / admin@test.com
- Password: AdminPass123!
- Rol: admin

## 🔒 Seguridad

- Todas las contraseñas se hashean con bcrypt
- Autenticación basada en sesiones con cookies HTTP-only
- Protección CSRF implementada
- Rate limiting en endpoints sensibles
- Validación de datos con Zod

## 🐳 Docker

Para ejecutar con Docker:

```bash
# Construir y ejecutar
docker-compose up --build

# Solo ejecutar (si ya está construido)
docker-compose up
```

## 📱 Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/session` - Verificar sesión actual

### Servicios
- `GET /api/services` - Listar servicios disponibles
- `POST /api/services` - Crear servicio (admin)
- `PUT /api/services/:id` - Actualizar servicio (admin)

### Reservas
- `GET /api/bookings` - Listar reservas
- `POST /api/bookings` - Crear nueva reserva
- `PUT /api/bookings/:id` - Actualizar estado de reserva

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es privado y confidencial. Todos los derechos reservados.

## 💡 Soporte

Para soporte o consultas, contacta al equipo de desarrollo.

---

**Desarrollado con ❤️ para Milo's Shop - Asunción, Paraguay**