# 🐳 Docker Setup para WarBike API

## Requisitos previos
- Docker instalado
- Docker Compose instalado

## Configuración

### 1. Variables de entorno
Las credenciales ya están configuradas en el archivo `.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=warbike
DB_PASSWORD=2J9Hfq+ixVY
DB_NAME=warbike
```

### 2. Iniciar la base de datos

```bash
# Iniciar el contenedor de MySQL
docker-compose up -d

# Ver los logs
docker-compose logs -f mysql

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

### Conectarse a MySQL desde la terminal
```bash
docker exec -it warbike-mysql mysql -u warbike -p
# Contraseña: 2J9Hfq+ixVY
```

### Ver los logs en tiempo real
```bash
docker-compose logs -f mysql
```

### Reiniciar el contenedor
```bash
docker-compose restart mysql
```

### Ejecutar un backup de la base de datos
```bash
docker exec warbike-mysql mysqldump -u warbike -p2J9Hfq+ixVY warbike > backup.sql
```

### Restaurar desde un backup
```bash
docker exec -i warbike-mysql mysql -u warbike -p2J9Hfq+ixVY warbike < backup.sql
```

### Ver el estado del health check
```bash
docker inspect warbike-mysql --format='{{.State.Health.Status}}'
```

## Estructura de la base de datos

El archivo `init.sql` crea automáticamente:
- Tabla `users`: Para almacenar usuarios
- Tabla `sessions`: Para almacenar sesiones de usuario
- Índices optimizados para consultas rápidas

## Troubleshooting

### El contenedor no inicia
```bash
# Ver logs detallados
docker-compose logs mysql

# Verificar que el puerto 3306 no esté en uso
sudo lsof -i :3306
```

### Error de conexión desde la aplicación
Asegúrate de que `DB_HOST=localhost` en el `.env` si estás ejecutando la aplicación fuera de Docker, o usa `DB_HOST=mysql` si la aplicación también está en Docker.

### Resetear completamente la base de datos
```bash
docker-compose down -v
docker-compose up -d
```

## Notas importantes

- Los datos se persisten en un volumen Docker llamado `mysql_data`
- El script `init.sql` solo se ejecuta la primera vez que se crea el contenedor
- Para reinicializar la base de datos, debes eliminar el volumen con `docker-compose down -v`
