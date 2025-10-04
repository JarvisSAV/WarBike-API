# 🔐 API de Autenticación - WarBike

Sistema de autenticación completo con sesiones almacenadas en MySQL y contraseñas hasheadas con Argon2.

## 📋 Características

- ✅ Registro de usuarios (signup)
- ✅ Inicio de sesión (signin)
- ✅ Cierre de sesión (logout)
- ✅ Verificación de sesión (me)
- ✅ Contraseñas hasheadas con Argon2id
- ✅ Sesiones almacenadas en MySQL
- ✅ Validación con Zod
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
    "id": 1,
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
    "id": 1,
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
    "id": 1,
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
- Almacenadas en MySQL
- ID generado con `crypto.randomBytes(32)`
- Expiración automática después de 7 días
- Limpieza automática de sesiones expiradas

---

## 🗄️ Estructura de la Base de Datos

### Tabla `users`
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);
```

### Tabla `sessions`
```sql
CREATE TABLE sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id INT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at)
);
```

---

## 🛠️ Mantenimiento

### Limpiar sesiones expiradas manualmente

Puedes crear un endpoint o cron job para limpiar sesiones:

```typescript
import { cleanupExpiredSessions } from '@/lib/session'

// Ejecutar cada hora
setInterval(() => {
  cleanupExpiredSessions()
}, 60 * 60 * 1000)
```

O directamente en MySQL:
```sql
DELETE FROM sessions WHERE expires_at < NOW();
```

---

## 📝 Notas

- Las sesiones se renuevan automáticamente cuando se accede a rutas protegidas usando `updateSession()`
- El registro crea automáticamente una sesión (auto-login)
- Todas las contraseñas se hashean con Argon2id antes de almacenarse
- Las validaciones usan Zod para mayor seguridad
