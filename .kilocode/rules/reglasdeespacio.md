# reglasdeespacio.md

📌 Reglas del Espacio de Trabajo: Milo’s Shop
🎯 Objetivo del Proyecto

Construir una aplicación moderna de reserva y gestión de autolavado/estética automotriz en Paraguay.

Dual interface: cliente y administrador.

Soporte multilingüe (español y portugués).

⚙️ Stack Tecnológico del Espacio de Trabajo
Frontend

React 18 + TypeScript con Vite.

UI: Radix UI + shadcn/ui.

Estilos: Tailwind CSS (tema: fondo negro, tarjetas blancas, acento rojo #E10600).

Routing: Wouter (/, /cliente, /admin).

Estado: TanStack Query (server state) + React hooks (local).

Diseño: Mobile-first, minimalista, inspirado en apps tipo Uber/Rappi.

Backend

Node.js con Express.js + TypeScript.

API RESTful con prefijo /api.

Sesiones con PostgreSQL usando connect-pg-simple.

Bundling: esbuild (ESM).

Base de Datos

PostgreSQL (Neon serverless).

ORM: Drizzle ORM + validación con Zod.

Migraciones: Drizzle Kit.

Entidades actuales: users.

Entidades planificadas: bookings, services, payments.

🔑 Autenticación & Seguridad

Autenticación basada en sesiones (session-based auth).

Roles: client y admin.

Middleware de seguridad en Express con persistencia en PostgreSQL.

Proteger endpoints sensibles con validación estricta.

🔗 Integraciones

Pagos: tarjeta, PIX y efectivo.

Push notifications: Firebase Cloud Messaging (FCM).

File storage: carga de imágenes para galerías de servicios.

Analytics: Google Analytics.

Internacionalización: sistema de traducción (ES/PT), soporte para PYG y fechas locales.

📊 Gestión de Servicios

Servicios dinámicos con precios según tipo de vehículo (auto, SUV, camioneta).

Tipos de servicios: lavado básico, premium, detailing especializado.

Cada servicio con duración estimada y registro histórico por cliente.

🧭 Estilo de Comunicación en Kilo Code

Lenguaje simple y cotidiano (evitar jerga excesiva).

Explicaciones claras, paso a paso, cuando se trate de código.

Mantener ejemplos de uso prácticos y alineados al contexto de Milo’s Shop.

## Directrices

- Directriz 1
- Directriz 2
