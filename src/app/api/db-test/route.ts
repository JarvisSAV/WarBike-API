// Test de conexión a la base de datos
import { NextResponse } from 'next/server'
import { db, testConnection } from '@/lib/db'

export async function GET() {
  try {
    // Probar la conexión
    const isConnected = await testConnection()
    
    if (!isConnected) {
      return NextResponse.json(
        { error: 'No se pudo conectar a la base de datos' },
        { status: 500 }
      )
    }

    // Obtener información de la base de datos
    const [dbInfo] = await db.query('SELECT DATABASE() as db_name, VERSION() as version')
    const [tables] = await db.query('SHOW TABLES')
    
    return NextResponse.json({
      success: true,
      message: 'Conexión exitosa a la base de datos',
      database: dbInfo,
      tables: tables
    })
  } catch (error) {
    console.error('Error en db-test:', error)
    return NextResponse.json(
      { 
        error: 'Error al conectar con la base de datos',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}
