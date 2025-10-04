// conexión a la base de datos mysql usando mysql2 exportando db
import mysql from 'mysql2/promise'

// Configuración de la conexión a la base de datos
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'warbike',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
})

// Función para verificar la conexión
export async function testConnection() {
  try {
    const connection = await pool.getConnection()
    console.log('✅ Conexión a la base de datos exitosa')
    connection.release()
    return true
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error)
    return false
  }
}

// Exportar el pool de conexiones
export const db = pool
