# 🐳 Docker Setup para WarBike API

## Requisitos previos
- Docker instalado
- Docker Compose instalado

## Configuración

### 1. Variables de entorno
Las credenciales ya están configuradas en el archivo `.env`:
```env
DB_HOST=localhost
DB_PORT=27017
DB_USER=warbike
DB_PASSWORD=2J9Hfq+ixVY
DB_NAME=warbike
```

### 2. Iniciar la base de datos

```bash
# Iniciar el contenedor de MongoDB
docker-compose up -d

# Ver los logs
docker-compose logs -f mongodb

# Verificar que el contenedor está corriendo
docker-compose ps
```

### 3. Detener la base de datos

```bash
# Detener el contenedor
docker-compose down

# Detener y eliminar los volúmenes (⚠️ esto borrará todos los datos)
docker-compose down -v
```

## Comandos útiles

### Conectarse a MongoDB desde la terminal
```bash
docker exec -it warbike-mongodb mongosh -u warbike -p
# Contraseña: 2J9Hfq+ixVY
# Base de datos: warbike

# O con la URI completa:
docker exec -it warbike-mongodb mongosh "mongodb://warbike:2J9Hfq+ixVY@localhost:27017/warbike?authSource=admin"
```

### Ver los logs en tiempo real
```bash
docker-compose logs -f mongodb
```

### Reiniciar el contenedor
```bash
docker-compose restart mongodb
```

### Ejecutar un backup de la base de datos
```bash
# Backup de toda la base de datos
docker exec warbike-mongodb mongodump -u root -p rootpassword --authenticationDatabase admin -d warbike -o /tmp/backup

# Copiar backup al host
docker cp warbike-mongodb:/tmp/backup ./backup
```

### Restaurar desde un backup
```bash
# Copiar backup al contenedor
docker cp ./backup warbike-mongodb:/tmp/backup

# Restaurar
docker exec warbike-mongodb mongorestore -u root -p rootpassword --authenticationDatabase admin -d warbike /tmp/backup/warbike
```

### Ver el estado del health check
```bash
docker inspect warbike-mongodb --format='{{.State.Health.Status}}'
```

## Estructura de la base de datos

El archivo `init-mongo.js` crea automáticamente:
- Colección `users`: Para almacenar usuarios con validación de esquema JSON
- Colección `sessions`: Para almacenar sesiones con TTL (expiración automática)
- Índices únicos en `email` y `sessionId`
- Índice TTL en `expiresAt` para auto-limpieza de sesiones

### Esquema de validación
```javascript
// Colección users
{
  email: { type: "string", format: "email" },
  password: { type: "string", minLength: 60 },
  name: { type: "string", minLength: 1 },
  createdAt: { type: "date" }
}

// Colección sessions
{
  sessionId: { type: "string" },
  userId: { type: "objectId" },
  expiresAt: { type: "date" }
}
```

## Troubleshooting

### El contenedor no inicia
```bash
# Ver logs detallados
docker-compose logs mongodb

# Verificar que el puerto 27017 no esté en uso
sudo lsof -i :27017
```

### Error de conexión desde la aplicación
Asegúrate de que `DB_HOST=localhost` en el `.env` si estás ejecutando la aplicación fuera de Docker, o usa `DB_HOST=mongodb` si la aplicación también está en Docker.

### Verificar colecciones e índices
```bash
docker exec -it warbike-mongodb mongosh -u warbike -p2J9Hfq+ixVY --authenticationDatabase admin

# En mongosh:
use warbike
show collections
db.users.getIndexes()
db.sessions.getIndexes()
```

### Resetear completamente la base de datos
```bash
docker-compose down -v
docker-compose up -d
```

## Notas importantes

- Los datos se persisten en un volumen Docker llamado `mongodb_data`
- El script `init-mongo.js` solo se ejecuta la primera vez que se crea el contenedor
- Para reinicializar la base de datos, debes eliminar el volumen con `docker-compose down -v`
- Las sesiones expiradas se eliminan automáticamente gracias al índice TTL
- MongoDB usa el puerto `27017` por defecto
