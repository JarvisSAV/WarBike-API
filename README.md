# 🚴 WarBike API

API REST completa construida con Next.js 15, MongoDB, Mongoose, Argon2 y Rate Limiting.

## 🚀 Inicio Rápido

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con tus credenciales
```

### 3. Iniciar base de datos (Docker)
```bash
docker-compose up -d
```

### 4. Iniciar servidor de desarrollo
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 📋 Características

### 🔐 Autenticación Completa
- ✅ Registro de usuarios con Argon2id
- ✅ Inicio de sesión seguro
- ✅ Sesiones almacenadas en MongoDB
- ✅ Cookies HttpOnly y Secure
- ✅ Validación con Zod

[📖 Ver documentación de autenticación](./docs/README-AUTH.md)

### 🛡️ Rate Limiting
- ✅ Protección contra fuerza bruta
- ✅ Límites por IP y por Email
- ✅ Headers HTTP estándar
- ✅ Preparado para Redis

[📖 Ver documentación de rate limiting](./docs/README-RATE-LIMIT.md)

### 🗄️ Base de Datos MongoDB
- ✅ Docker Compose configurado
- ✅ Mongoose ODM integrado
- ✅ Validaciones de esquema
- ✅ Índices optimizados
- ✅ TTL para auto-limpieza de sesiones

[📖 Ver documentación de Docker](./docs/README-DOCKER.md)

---

## 📚 Documentación

### Guías de Usuario
- 📘 [Autenticación](./docs/README-AUTH.md) - Sistema de login/registro
- 📘 [Docker & MongoDB](./docs/README-DOCKER.md) - Configuración de base de datos
- 📘 [Rate Limiting](./docs/README-RATE-LIMIT.md) - Protección de APIs

### Documentación Técnica
- 🔧 [Implementación: Autenticación](./docs/IMPLEMENTACION-AUTH.md)
- 🔧 [Implementación: Rate Limiting](./docs/IMPLEMENTACION-RATE-LIMIT.md)
- 🔧 [Resumen General](./docs/IMPLEMENTACION-RESUMEN.md)
- 🔧 [Migración a Redis](./docs/REDIS-MIGRATION.md)

---

## 🎯 Endpoints Disponibles

### Autenticación
```
POST   /api/signup           # Registro de usuario
POST   /api/signin           # Inicio de sesión
POST   /api/logout           # Cierre de sesión
GET    /api/me               # Perfil del usuario
```

### Utilidades
```
GET    /api/ping             # Health check
GET    /api/db-test          # Test de conexión DB
GET    /api/rate-limit-status # Estado de rate limits
```

---

## 🧪 Testing

### Test de autenticación
```bash
# Registrar usuario
curl -X POST http://localhost:3000/api/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test1234","name":"Test User"}' \
  -c cookies.txt

# Verificar sesión
curl http://localhost:3000/api/me -b cookies.txt

# Cerrar sesión
curl -X POST http://localhost:3000/api/logout -b cookies.txt
```

### Test de rate limiting
```bash
# Ejecutar suite de pruebas
./test-rate-limit.sh

# Ver estado de límites
curl http://localhost:3000/api/rate-limit-status | jq
```

---

## 🛠️ Stack Tecnológico

- **Next.js 15**: App Router con Turbopack para desarrollo ultrarrápido
- **React 19**: Última versión con mejoras de performance
- **MongoDB 7.0**: Base de datos NoSQL orientada a documentos en Docker
- **Mongoose**: ODM elegante para MongoDB con validaciones y tipos
- **Argon2**: Hashing de contraseñas con algoritmo ganador del Password Hashing Competition
- **Zod**: Validación de esquemas TypeScript-first
- **TypeScript**: Seguridad de tipos en todo el proyecto
- **Docker**: Contenedorización de la base de datos

---

## 📦 Scripts Disponibles

```bash
npm run dev      # Desarrollo con Turbopack
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # Linter
```

---

## 🔒 Seguridad

- ✅ Contraseñas hasheadas con **Argon2id**
- ✅ Sesiones seguras en **MongoDB**
- ✅ Cookies **HttpOnly** y **Secure**
- ✅ **Rate limiting** en rutas críticas
- ✅ Validación de entrada con **Zod**
- ✅ Protección **CSRF** con SameSite cookies

---

## 🐳 Docker

### Iniciar servicios
```bash
docker-compose up -d
```

### Ver logs
```bash
docker-compose logs -f mongodb
```

### Conectar a MongoDB
```bash
docker exec -it warbike-mongodb mongosh -u warbike -p
```

### Detener servicios
```bash
docker-compose down
```

[📖 Ver guía completa de Docker](./docs/README-DOCKER.md)

---

## 📝 Variables de Entorno

```env
# Sesiones
SESSION_SECRET=your-secret-key-here

# Base de datos MongoDB
DB_HOST=localhost
DB_PORT=27017
DB_USER=warbike
DB_PASSWORD=your-password
DB_NAME=warbike

# Opcional: URI completa de MongoDB (alternativa a variables individuales)
# MONGODB_URI=mongodb://warbike:password@localhost:27017/warbike?authSource=admin

# Opcional: Redis para rate limiting
# REDIS_URL=redis://localhost:6379
```

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

---

## 👨‍💻 Autor

**JarvisSAV** - [GitHub](https://github.com/JarvisSAV)

---

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/)
- [Argon2](https://github.com/ranisalt/node-argon2)
- [Zod](https://zod.dev/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
