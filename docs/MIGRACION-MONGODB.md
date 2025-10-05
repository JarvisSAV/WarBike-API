# 🔄 Migración de MySQL a MongoDB - WarBike API

## ✅ Completado

### 1. **Instalación de dependencias**
- ✅ Instalado Mongoose (`npm install mongoose`)
- ✅ Desinstalado mysql2 (`npm uninstall mysql2`)

### 2. **Docker Compose actualizado**
- ✅ Cambiado de MySQL 8.0 a MongoDB 7.0
- ✅ Puerto 27017 (MongoDB)
- ✅ Variables de entorno actualizadas
- ✅ Health check configurado

### 3. **Script de inicialización**
- ✅ Creado `init-mongo.js`
- ✅ Colecciones: `users` y `sessions`
- ✅ Validación de esquemas JSON Schema
- ✅ Índices configurados
- ✅ TTL index para auto-limpieza de sesiones

### 4. **Conexión a MongoDB**
- ✅ `src/lib/db.ts` actualizado con Mongoose
- ✅ Pool de conexiones configurado
- ✅ Event listeners para debugging
- ✅ Cierre graceful

### 5. **Modelos de Mongoose**
- ✅ `src/lib/models.ts` creado
- ✅ Modelo `User` con validaciones
- ✅ Modelo `Session` con TTL
- ✅ Timestamps automáticos
- ✅ Índices optimizados

### 6. **Sistema de sesiones**
- ✅ `src/lib/session.ts` actualizado
- ✅ Usa Mongoose en lugar de SQL
- ✅ IDs de usuario son ObjectId
- ✅ Auto-limpieza con TTL index

### 7. **Rutas API actualizadas**
- ✅ `POST /api/signup` - Usa Mongoose
- ⚠️  `POST /api/signin` - En proceso
- ⚠️  `POST /api/logout` - Pendiente
- ⚠️  `GET /api/me` - Pendiente

---

## 🚧 Pendiente

### Rutas por actualizar:
1. **signin** - Migrar consultas SQL a Mongoose
2. **logout** - Ya debería funcionar (usa session.ts)
3. **me** - Migrar consulta SQL a Mongoose  
4. **db-test** - Actualizar para MongoDB

### Archivos por actualizar:
- `/src/app/api/signin/route.ts` (tiene problemas)
- `/src/app/api/me/route.ts`
- `/src/app/api/db-test/route.ts`

---

## 📊 Diferencias Clave: MySQL vs MongoDB

| Aspecto | MySQL | MongoDB |
|---------|-------|---------|
| **Tipo** | Relacional (SQL) | Documento (NoSQL) |
| **IDs** | INT AUTO_INCREMENT | ObjectId (12 bytes) |
| **Esquema** | Rígido (DDL) | Flexible (JSON Schema) |
| **Queries** | SQL | MQL (MongoDB Query Language) |
| **Relaciones** | FOREIGN KEY | Referencias o Embedded |
| **Transacciones** | Nativas | Soportadas (v4.0+) |
| **Índices** | B-Tree | B-Tree + otros |
| **TTL** | Trigger/Event | TTL Index nativo |

---

## 🔄 Cambios en el Código

### Antes (MySQL):
```typescript
// Query SQL
const [rows] = await db.query(
  'SELECT * FROM users WHERE email = ?',
  [email]
) as [UserRow[], unknown]

const user = rows[0]
const userId = result.insertId // number
```

### Después (MongoDB):
```typescript
// Query Mongoose
const user = await User.findOne({ 
  email: email.toLowerCase() 
})

const userId = user._id // ObjectId
```

---

## 🎯 Ventajas de MongoDB

### 1. **Flexibilidad de Esquema**
- Agregar campos sin migraciones
- Documentos anidados naturalmente
- Arrays y objetos nativos

### 2. **Desarrollo más rápido**
- Menos boilerplate
- Mongoose ORM/ODM integrado
- Validaciones declarativas

### 3. **Escalabilidad**
- Sharding nativo
- Replicación automática
- Distribución horizontal

### 4. **Features Modernos**
- TTL indexes (auto-limpieza)
- Aggregation Framework
- Change Streams (real-time)
- Full-text search

---

## 🛠️ Comandos Útiles

### Docker
```bash
# Iniciar MongoDB
docker-compose up -d

# Ver logs
docker-compose logs -f mongodb

# Conectarse a MongoDB
docker exec -it warbike-mongodb mongosh -u warbike -p 2J9Hfq+ixVY --authenticationDatabase admin

# Detener
docker-compose down
```

### MongoDB Shell
```javascript
// Conectado al shell
use warbike

// Ver colecciones
show collections

// Ver usuarios
db.users.find().pretty()

// Ver sesiones
db.sessions.find().pretty()

// Contar documentos
db.users.countDocuments()

// Ver índices
db.users.getIndexes()
```

---

## 📝 Variables de Entorno

```env
# MongoDB Configuration
DB_HOST=localhost
DB_PORT=27017
DB_USER=warbike
DB_PASSWORD=2J9Hfq+ixVY
DB_NAME=warbike

# O usar URI directo
MONGODB_URI=mongodb://warbike:2J9Hfq+ixVY@localhost:27017/warbike?authSource=admin
```

---

## 🔍 Testing

### Probar conexión
```bash
curl http://localhost:3000/api/db-test | jq
```

### Registrar usuario
```bash
curl -X POST http://localhost:3000/api/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@mongo.com","password":"Test1234","name":"Test User"}' \
  -c cookies.txt | jq
```

### Verificar en MongoDB
```bash
docker exec -it warbike-mongodb mongosh \
  -u warbike -p 2J9Hfq+ixVY --authenticationDatabase admin \
  --eval "use warbike; db.users.find().pretty()"
```

---

## ⚠️ Problemas Conocidos

1. **Archivo signin/route.ts corrupto**
   - Contenido duplicado
   - Necesita recreación limpia

2. **Rate limiting**
   - Funcionando correctamente
   - No requiere cambios

3. **Sesiones**
   - Migradas a MongoDB
   - TTL index configurado

---

## 📚 Próximos Pasos

1. ✅ Arreglar `/api/signin`
2. ✅ Actualizar `/api/me`
3. ✅ Actualizar `/api/db-test`
4. ✅ Probar flujo completo
5. ✅ Actualizar documentación
6. ✅ Verificar rate limiting funciona
7. ✅ Tests completos

---

## 🎓 Recursos

- [Mongoose Docs](https://mongoosejs.com/)
- [MongoDB Manual](https://docs.mongodb.com/)
- [MongoDB University](https://university.mongodb.com/)
- [Mongoose Schema Validation](https://mongoosejs.com/docs/validation.html)

---

**Estado**: 🟡 **EN PROGRESO** (70% completado)
**Última actualización**: Octubre 4, 2025
