// Test de conexión a la base de datos MongoDB
import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import mongoose from 'mongoose'

export async function GET() {
  try {
    // Probar la conexión a MongoDB
    await connectDB()
    
    // Verificar estado de la conexión
    const connectionState = mongoose.connection.readyState
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting']
    
    if (connectionState !== 1) {
      return NextResponse.json(
        { 
          error: 'No se pudo conectar a la base de datos',
          state: states[connectionState] || 'unknown'
        },
        { status: 500 }
      )
    }

    // Obtener información de la base de datos
    const db = mongoose.connection.db
    const admin = db?.admin()
    
    // Información del servidor
    const serverInfo = await admin?.serverInfo()
    
    // Lista de colecciones
    const collections = await db?.listCollections().toArray()
    const collectionNames = collections?.map(col => col.name) || []
    
    // Estadísticas de la base de datos
    const dbStats = await db?.stats()
    
    return NextResponse.json({
      success: true,
      message: 'Conexión exitosa a MongoDB',
      connection: {
        state: states[connectionState],
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        name: mongoose.connection.name
      },
      server: {
        version: serverInfo?.version,
        platform: serverInfo?.os?.type,
        uptime: serverInfo?.uptime
      },
      database: {
        collections: collectionNames,
        dataSize: dbStats?.dataSize,
        storageSize: dbStats?.storageSize,
        indexes: dbStats?.indexes,
        objects: dbStats?.objects
      }
    })
  } catch (error) {
    console.error('Error en db-test:', error)
    return NextResponse.json(
      { 
        error: 'Error al conectar con MongoDB',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}
