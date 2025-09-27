# 📡 Documentación de API - Milos-Shop

Documentación completa de la API REST para la aplicación Milos-Shop.

## 🔗 Base URL

```
http://localhost:5000/api
```

## 🔐 Autenticación

La API utiliza sesiones HTTP para autenticación. Los endpoints protegidos requieren que el usuario esté autenticado.

### Headers Requeridos

```
Content-Type: application/json
Cookie: connect.sid=session_id
```

---

## 👥 Endpoints de Usuarios

### POST /api/users
Crear un nuevo usuario (uso interno).

**Request Body:**
```json
{
  "name": "Juan Pérez",
  "phone": "+595987654321",
  "email": "juan@example.com",
  "role": "client",
  "isGuest": false
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "name": "Juan Pérez",
  "phone": "+595987654321",
  "email": "juan@example.com",
  "role": "client",
  "isGuest": false,
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

### GET /api/users/:id
Obtener información de un usuario específico.

**Response (200):**
```json
{
  "id": "uuid",
  "name": "Juan Pérez",
  "phone": "+595987654321",
  "email": "juan@example.com",
  "role": "client",
  "isGuest": false,
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

---

## 🔓 Endpoints de Autenticación

### POST /api/auth/register
Registrar un nuevo usuario cliente.

**Request Body:**
```json
{
  "name": "Juan Pérez",
  "phone": "+595987654321",
  "email": "juan@example.com"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "name": "Juan Pérez",
    "phone": "+595987654321",
    "email": "juan@example.com",
    "role": "client"
  },
  "message": "User registered successfully"
}
```

### POST /api/auth/login
Iniciar sesión de usuario.

**Request Body:**
```json
{
  "phone": "+595987654321"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "name": "Juan Pérez",
    "phone": "+595987654321",
    "role": "client"
  },
  "message": "Login successful"
}
```

### POST /api/auth/logout
Cerrar sesión del usuario.

**Response (200):**
```json
{
  "message": "Logout successful"
}
```

### GET /api/auth/me
Obtener información del usuario autenticado.

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "name": "Juan Pérez",
    "phone": "+595987654321",
    "role": "client"
  }
}
```

---

## 🚗 Endpoints de Vehículos

### GET /api/users/:userId/vehicles
Obtener vehículos de un usuario.

**Response (200):**
```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "plate": "ABC-123",
    "type": "auto",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
]
```

### POST /api/vehicles
Crear un nuevo vehículo.

**Request Body:**
```json
{
  "userId": "uuid",
  "plate": "ABC-123",
  "type": "auto"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "plate": "ABC-123",
  "type": "auto",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

---

## 🧽 Endpoints de Servicios

### GET /api/services
Obtener lista de servicios disponibles.

**Response (200):**
```json
[
  {
    "id": "uuid",
    "slug": "lavado-basico",
    "nameKey": "lavado_basico",
    "title": "Lavado Básico",
    "description": "Lavado exterior completo",
    "titleEs": "Lavado Básico",
    "titlePt": "Lavagem Básica",
    "subtitleEs": "Lavado exterior completo",
    "subtitlePt": "Lavagem exterior completa",
    "copyEs": "Servicio de lavado exterior...",
    "copyPt": "Serviço de lavagem exterior...",
    "prices": {
      "auto": 50000,
      "suv": 70000,
      "camioneta": 90000
    },
    "durationMin": 30,
    "imageUrl": null,
    "active": true,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
]
```

### GET /api/services/:id
Obtener detalles de un servicio específico.

### POST /api/services/upload-image
Subir imagen para un servicio.

**Request Body (FormData):**
```
image: File
serviceSlug: string
```

**Response (200):**
```json
{
  "success": true,
  "message": "Image uploaded and optimized successfully",
  "imageUrl": "/attached_assets/service_images/optimized-image.jpg",
  "filename": "optimized-image.jpg",
  "serviceSlug": "lavado-basico"
}
```

---

## 📅 Endpoints de Reservas

### GET /api/bookings
Obtener reservas del usuario autenticado o todas las reservas (admin).

**Response (200):**
```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "vehicleId": "uuid",
    "serviceId": "uuid",
    "date": "2025-01-15",
    "timeSlot": "09:00",
    "status": "waiting",
    "price": 50000,
    "paymentMethod": "cash",
    "paymentCaptureUrl": null,
    "notes": null,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
]
```

### GET /api/bookings/today
Obtener reservas de hoy con detalles completos (admin).

### POST /api/bookings
Crear una nueva reserva.

**Request Body:**
```json
{
  "userId": "uuid",
  "vehicleId": "uuid",
  "serviceId": "uuid",
  "date": "2025-01-15",
  "timeSlot": "09:00",
  "price": 50000,
  "paymentMethod": "cash",
  "notes": "Vehículo rojo"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "vehicleId": "uuid",
  "serviceId": "uuid",
  "date": "2025-01-15",
  "timeSlot": "09:00",
  "status": "waiting",
  "price": 50000,
  "paymentMethod": "cash",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

### PATCH /api/bookings/:id/status
Actualizar estado de una reserva (admin).

**Request Body:**
```json
{
  "status": "washing"
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "status": "washing",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

---

## 💳 Endpoints de Pagos

### POST /api/payments
Crear un nuevo pago.

**Request Body:**
```json
{
  "bookingId": "uuid",
  "method": "cash",
  "amountGs": 50000,
  "status": "pending"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "bookingId": "uuid",
  "method": "cash",
  "amountGs": 50000,
  "status": "pending",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

### PATCH /api/payments/:id/status
Actualizar estado de un pago.

**Request Body:**
```json
{
  "status": "paid"
}
```

---

## 📊 Códigos de Estado HTTP

- **200**: OK - Solicitud exitosa
- **201**: Created - Recurso creado exitosamente
- **400**: Bad Request - Datos inválidos
- **401**: Unauthorized - No autenticado
- **403**: Forbidden - No autorizado
- **404**: Not Found - Recurso no encontrado
- **409**: Conflict - Conflicto (usuario ya existe)
- **500**: Internal Server Error - Error del servidor

## 🔒 Estados de Reserva

- `waiting`: Esperando ser atendido
- `washing`: En proceso de lavado
- `done`: Completado
- `cancelled`: Cancelado

## 💰 Métodos de Pago

- `cash`: Efectivo
- `transfer`: Transferencia bancaria
- `pix`: PIX (Brasil)

## 🚗 Tipos de Vehículo

- `auto`: Automóvil estándar
- `suv`: SUV
- `camioneta`: Camioneta/Pickup

## 🌐 WebSockets

### Conexión Admin

```javascript
const socket = io('http://localhost:5000');

// Unirse a sala admin
socket.emit('join-admin', 'admin-token');

// Escuchar nuevas reservas
socket.on('new-booking', (data) => {
  console.log('Nueva reserva:', data);
});

// Escuchar actualizaciones de reservas
socket.on('booking-updated', (data) => {
  console.log('Reserva actualizada:', data);
});
```

---

## 🧪 Testing con cURL

### Registrar usuario
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","phone":"+595999999999","email":"test@example.com"}'
```

### Obtener servicios
```bash
curl http://localhost:5000/api/services
```

### Crear reserva (requiere autenticación)
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Cookie: connect.sid=your-session-id" \
  -d '{"userId":"uuid","vehicleId":"uuid","serviceId":"uuid","date":"2025-01-15","timeSlot":"09:00","price":50000}'
```

---

## 📝 Notas Importantes

1. **Autenticación requerida**: La mayoría de los endpoints requieren sesión activa
2. **Validación**: Todos los datos son validados con Zod
3. **Cache**: Los servicios se cachean por 5 minutos
4. **Rate limiting**: Aplicado a rutas de autenticación y API general
5. **WebSockets**: Actualizaciones en tiempo real para panel admin
6. **Idioma**: Soporte para español y portugués
7. **Moneda**: Precios en Guaraníes (PYG)

Para más detalles técnicos, consulta el código fuente en `server/routes.ts`.