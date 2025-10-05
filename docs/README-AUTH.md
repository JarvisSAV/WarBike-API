# 🔐 API de Autenticación - WarBike

Sistema de autenticación completo con sesiones almacenadas en MongoDB y contraseñas hasheadas con Argon2.

## 📋 Características

- ✅ Registro de usuarios (signup)
- ✅ Inicio de sesión (signin)
- ✅ Cierre de sesión (logout)
- ✅ Verificación de sesión (me)
- ✅ Contraseñas hasheadas con Argon2id
- ✅ Sesiones almacenadas en MongoDB con Mongoose
- ✅ Validación con Zod y Mongoose schemas
- ✅ Cookies HttpOnly y Secure

## 🚀 Endpoints

### 1. Registro de Usuario

**POST** `/api/signup`

```bash
curl -X POST http://localhost:3000/api/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "MiPassword123!",
    "name": "Juan Pérez"
  }' \
  -c cookies.txt
```

**Request Body:**
```json
{
  "email": "usuario@example.com",
  "password": "MiPassword123!",
  "name": "Juan Pérez"
}
```

**Response (201):**
```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "usuario@example.com",
    "name": "Juan Pérez"
  }
}
```

**Validaciones:**
- Email válido
- Contraseña mínimo 8 caracteres
- Nombre mínimo 2 caracteres

---

### 2. Inicio de Sesión

**POST** `/api/signin`

```bash
curl -X POST http://localhost:3000/api/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "MiPassword123!"
  }' \
  -c cookies.txt
```

**Request Body:**
```json
{
  "email": "usuario@example.com",
  "password": "MiPassword123!"
}
```

**Response (200):**
```json
{
  "message": "Inicio de sesión exitoso",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "usuario@example.com",
    "name": "Juan Pérez"
  }
}
```

**Response (401) - Credenciales inválidas:**
```json
{
  "message": "Credenciales inválidas"
}
```

---

### 3. Verificar Sesión

**GET** `/api/me`

```bash
curl -X GET http://localhost:3000/api/me \
  -b cookies.txt
```

**Response (200):**
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "usuario@example.com",
    "name": "Juan Pérez",
    "createdAt": "2025-10-04T03:00:00.000Z"
  }
}
```

**Response (401) - No autenticado:**
```json
{
  "message": "No autenticado"
}
```

---

### 4. Cierre de Sesión

**POST** `/api/logout`

```bash
curl -X POST http://localhost:3000/api/logout \
  -b cookies.txt \
  -c cookies.txt
```

**Response (200):**
```json
{
  "message": "Sesión cerrada exitosamente"
}
```

---

## 🧪 Pruebas Rápidas

### Flujo completo con curl:

```bash
# 1. Registrar usuario
curl -X POST http://localhost:3000/api/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test1234","name":"Test User"}' \
  -c cookies.txt

# 2. Verificar sesión
curl -X GET http://localhost:3000/api/me -b cookies.txt

# 3. Cerrar sesión
curl -X POST http://localhost:3000/api/logout -b cookies.txt -c cookies.txt

# 4. Intentar acceder sin sesión (debe fallar)
curl -X GET http://localhost:3000/api/me -b cookies.txt
```

### Con JavaScript/Fetch:

```javascript
// Registro
const signup = async () => {
  const response = await fetch('/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test@test.com',
      password: 'Test1234',
      name: 'Test User'
    }),
    credentials: 'include' // Importante para cookies
  })
  return response.json()
}

// Inicio de sesión
const signin = async () => {
  const response = await fetch('/api/signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test@test.com',
      password: 'Test1234'
    }),
    credentials: 'include'
  })
  return response.json()
}

// Verificar sesión
const getMe = async () => {
  const response = await fetch('/api/me', {
    credentials: 'include'
  })
  return response.json()
}

// Cerrar sesión
const logout = async () => {
  const response = await fetch('/api/logout', {
    method: 'POST',
    credentials: 'include'
  })
  return response.json()
}
```

---

## 🔒 Seguridad

### Argon2id
- **Tipo**: Argon2id (híbrido, resistente a ataques GPU y side-channel)
- **Memory Cost**: 19 MiB (19456 KiB)
- **Time Cost**: 2 iteraciones
- **Parallelism**: 1 hilo

### Cookies
- **HttpOnly**: ✅ (No accesible desde JavaScript)
- **Secure**: ✅ (Solo HTTPS en producción)
- **SameSite**: Lax (Protección CSRF)
- **Path**: / (Todo el sitio)
- **Expires**: 7 días

### Sesiones
- Almacenadas en MongoDB
- ID generado con `crypto.randomBytes(32)`
- Expiración automática después de 7 días
- Limpieza automática con índice TTL de MongoDB

---

## 🗄️ Estructura de la Base de Datos

### Colección `users`
```typescript
interface IUser {
  _id: ObjectId;
  email: string;        // Único, lowercase, formato email
  password: string;     // Hash Argon2, mínimo 60 caracteres
  name: string;         // Mínimo 1 carácter
  createdAt: Date;      // Timestamp automático
  updatedAt: Date;      // Timestamp automático
}

// Esquema Mongoose
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: 'Email inválido'
    }
  },
  password: { type: String, required: true, minlength: 60 },
  name: { type: String, required: true, minlength: 1 }
}, { timestamps: true });
```

### Colección `sessions`
```typescript
interface ISession {
  _id: ObjectId;
  sessionId: string;    // Único, generado con crypto
  userId: ObjectId;     // Referencia a users
  expiresAt: Date;      // TTL index, auto-limpieza
  createdAt: Date;      // Timestamp automático
  updatedAt: Date;      // Timestamp automático
}

// Esquema Mongoose
const sessionSchema = new Schema({
  sessionId: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  expiresAt: { type: Date, required: true }
}, { timestamps: true });

// Índice TTL para auto-limpieza
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
```

### Validación JSON Schema (init-mongo.js)
MongoDB también aplica validaciones a nivel de base de datos:
```javascript
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      required: ["email", "password", "name"],
      properties: {
        email: { bsonType: "string", pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$" },
        password: { bsonType: "string", minLength: 60 },
        name: { bsonType: "string", minLength: 1 }
      }
    }
  }
});
```

---

## 🛠️ Mantenimiento

### Limpieza automática de sesiones

MongoDB maneja automáticamente la limpieza de sesiones expiradas gracias al índice TTL:

```typescript
// El índice TTL se configura en el schema
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
```

MongoDB revisa este índice cada 60 segundos y elimina documentos donde `expiresAt` haya pasado.

### Limpieza manual (opcional)

Si necesitas limpiar sesiones manualmente:

```typescript
import { Session } from '@/lib/models';

// Eliminar sesiones expiradas
await Session.deleteMany({ expiresAt: { $lt: new Date() } });
```

O directamente en MongoDB shell:
```javascript
db.sessions.deleteMany({ expiresAt: { $lt: new Date() } });
```

---

## 📝 Notas

- Las sesiones se renuevan automáticamente cuando se accede a rutas protegidas usando `updateSession()`
- El registro crea automáticamente una sesión (auto-login)
- Todas las contraseñas se hashean con Argon2id antes de almacenarse
- Las validaciones usan Zod en la aplicación y JSON Schema en MongoDB
- Los IDs son ObjectIds de MongoDB (ejemplo: `507f1f77bcf86cd799439011`)
- Mongoose maneja automáticamente los timestamps `createdAt` y `updatedAt`
