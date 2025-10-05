// Conexión a MongoDB usando Mongoose
import { config } from '@/utils/config'
import mongoose from 'mongoose'

// URI de conexión MongoDB
const MONGODB_URI = config.mongodbUri

// Variable para trackear el estado de conexión
let isConnected = false

/**
 * Conecta a MongoDB usando Mongoose
 */
export async function connectDB(): Promise<typeof mongoose> {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose
  }

  try {
    const db = await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    })

    isConnected = true
    console.log('✅ Conectado a MongoDB:', config.db.name)
    
    return db
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error)
    isConnected = false
    throw error
  }
}

/**
 * Verifica la conexión a MongoDB
 */
export async function testConnection(): Promise<boolean> {
  try {
    await connectDB()
    await mongoose.connection.db?.admin().ping()
    console.log('✅ Conexión a MongoDB exitosa')
    return true
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error)
    return false
  }
}

/**
 * Cierra la conexión a MongoDB
 */
export async function closeConnection(): Promise<void> {
  try {
    await mongoose.connection.close()
    isConnected = false
    console.log('✅ Conexión a MongoDB cerrada')
  } catch (error) {
    console.error('❌ Error al cerrar conexión:', error)
  }
}

// Event listeners para debugging
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose conectado a MongoDB')
})

mongoose.connection.on('error', (err) => {
  console.error('❌ Error de conexión Mongoose:', err)
  isConnected = false
})

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose desconectado de MongoDB')
  isConnected = false
})

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  await closeConnection()
  process.exit(0)
})

// Exportar mongoose y utilidades
export default mongoose
export { mongoose }
export const db = {
  connect: connectDB,
  close: closeConnection,
  test: testConnection
}
