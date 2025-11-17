import { connectDB } from '../lib/db'
import { User } from '../lib/models/user'
import { Route } from '../lib/models/route'
import { Territory } from '../lib/models/territory'
import { Session } from '../lib/models/sessions'
import argon2 from 'argon2'

// Coordenadas de zonas populares en Guadalajara, Jalisco
const GUADALAJARA_ZONES = {
  centro: { lat: 20.6737, lng: -103.3444 },
  chapalita: { lat: 20.6770, lng: -103.3920 },
  zapopan: { lat: 20.7214, lng: -103.3918 },
  tlaquepaque: { lat: 20.6401, lng: -103.3125 },
  providencia: { lat: 20.6764, lng: -103.3710 },
  minerva: { lat: 20.6739, lng: -103.3917 },
  andares: { lat: 20.6929, lng: -103.3844 },
  oblatos: { lat: 20.6956, lng: -103.3210 },
  huentitan: { lat: 20.7311, lng: -103.3123 },
  tonala: { lat: 20.6223, lng: -103.2329 }
}

// Generar coordenadas aleatorias cerca de un punto
function generateNearbyCoords(
  baseLat: number,
  baseLng: number,
  radiusKm: number,
  count: number
): { latitude: number; longitude: number }[] {
  const coords: { latitude: number; longitude: number }[] = []
  
  for (let i = 0; i < count; i++) {
    // Convertir km a grados (aproximación)
    const radiusInDegrees = radiusKm / 111
    
    const angle = Math.random() * 2 * Math.PI
    const distance = Math.random() * radiusInDegrees
    
    const latitude = baseLat + distance * Math.cos(angle)
    const longitude = baseLng + distance * Math.sin(angle)
    
    coords.push({ latitude, longitude })
  }
  
  return coords
}

// Generar polígono de territorio
function generateTerritoryPolygon(
  centerLat: number,
  centerLng: number,
  radiusKm: number = 0.5
): { latitude: number; longitude: number }[] {
  const points = 6 // Hexágono
  const coords: { latitude: number; longitude: number }[] = []
  const radiusInDegrees = radiusKm / 111
  
  for (let i = 0; i < points; i++) {
    const angle = (i * 2 * Math.PI) / points
    const latitude = centerLat + radiusInDegrees * Math.cos(angle)
    const longitude = centerLng + radiusInDegrees * Math.sin(angle)
    coords.push({ latitude, longitude })
  }
  
  return coords
}

async function seed() {
  try {
    console.log('🌱 Iniciando seed de la base de datos...\n')
    
    await connectDB()
    
    // Limpiar datos existentes
    console.log('🗑️  Limpiando datos existentes...')
    await Promise.all([
      User.deleteMany({}),
      Route.deleteMany({}),
      Territory.deleteMany({}),
      Session.deleteMany({})
    ])
    console.log('✅ Datos eliminados\n')
    
    // Crear usuarios
    console.log('👥 Creando usuarios...')
    const hashedPassword = await argon2.hash('g5XJOWbcFKE=', {
      type: argon2.argon2id,
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1
    })
    
    const users = [
      {
        name: 'Silvino Aguiar',
        email: 'silvino@devcore.dev',
        password: hashedPassword
      },
      {
        name: 'Carlos Mendoza',
        email: 'carlos.mendoza@email.com',
        password: hashedPassword
      },
      {
        name: 'Ana García',
        email: 'ana.garcia@email.com',
        password: hashedPassword
      },
      {
        name: 'Luis Ramírez',
        email: 'luis.ramirez@email.com',
        password: hashedPassword
      },
      {
        name: 'María Fernández',
        email: 'maria.fernandez@email.com',
        password: hashedPassword
      },
      {
        name: 'Roberto Silva',
        email: 'roberto.silva@email.com',
        password: hashedPassword
      }
    ]
    
    const createdUsers = await User.insertMany(users)
    console.log(`✅ ${createdUsers.length} usuarios creados\n`)
    
    // Crear rutas y territorios para cada usuario
    console.log('🚴 Creando rutas y territorios...')
    
    const zones = Object.values(GUADALAJARA_ZONES)
    let totalRoutes = 0
    let totalTerritories = 0
    
    for (const user of createdUsers) {
      const routesCount = Math.floor(Math.random() * 6) + 4 // 3-7 rutas por usuario
      
      for (let i = 0; i < routesCount; i++) {
        // Seleccionar zona aleatoria de Guadalajara
        const zone = zones[Math.floor(Math.random() * zones.length)]
        
        // Generar ruta
        const numCoords = Math.floor(Math.random() * 50) + 30 // 30-80 puntos
        const routeCoords = generateNearbyCoords(zone.lat, zone.lng, 2, numCoords)
        
        // Calcular estadísticas
        const distance = (Math.random() * 15) + 2 // 2-17 km
        const duration = Math.floor((distance / (Math.random() * 5 + 10)) * 3600) // 10-15 km/h
        const avgSpeed = distance / (duration / 3600)
        const maxSpeed = avgSpeed * (1 + Math.random() * 0.3) // 0-30% más rápido
        const calories = Math.round(distance * 50)
        
        // Fecha aleatoria en los últimos 60 días
        const daysAgo = Math.floor(Math.random() * 60)
        const startTime = new Date()
        startTime.setDate(startTime.getDate() - daysAgo)
        startTime.setHours(Math.floor(Math.random() * 8) + 6) // 6-14 hrs
        
        const endTime = new Date(startTime.getTime() + duration * 1000)
        
        // Generar territorio conquistado
        const conqueredArea = distance * 0.08 // ~8% del recorrido
        const territoryCoords = generateTerritoryPolygon(zone.lat, zone.lng, Math.sqrt(conqueredArea))
        
        const route = await Route.create({
          userId: user._id,
          coordinates: routeCoords,
          stats: {
            distance,
            duration,
            avgSpeed,
            maxSpeed,
            calories
          },
          startTime,
          endTime,
          conqueredTerritory: conqueredArea,
          territoryCoords,
          name: `Ruta ${['matutina', 'vespertina', 'nocturna', 'del fin de semana'][Math.floor(Math.random() * 4)]}`,
          description: [
            'Gran recorrido por la ciudad',
            'Entrenamiento intenso',
            'Paseo relajado',
            'Exploración de nuevas rutas'
          ][Math.floor(Math.random() * 4)]
        })
        
        totalRoutes++
        
        // Crear territorio
        if (territoryCoords.length >= 3) {
          await Territory.create({
            userId: user._id,
            routeId: route._id,
            coordinates: territoryCoords,
            area: conqueredArea,
            timestamp: endTime,
            name: route.name
          })
          totalTerritories++
        }
      }
      
      console.log(`  ✅ Usuario ${user.name}: ${routesCount} rutas creadas`)
    }
    
    console.log(`\n✅ Total: ${totalRoutes} rutas y ${totalTerritories} territorios creados\n`)
    
    // Resumen final
    console.log('📊 RESUMEN:')
    console.log('─────────────────────────────────')
    console.log(`👥 Usuarios: ${createdUsers.length}`)
    console.log(`🚴 Rutas: ${totalRoutes}`)
    console.log(`🗺️  Territorios: ${totalTerritories}`)
    console.log('─────────────────────────────────')
    console.log('\n💡 Credenciales de acceso:')
    console.log('   Email: cualquiera de los emails creados')
    console.log('   Password: g5XJOWbcFKE=')
    console.log('\n✨ Seed completado exitosamente!\n')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error en el seed:', error)
    process.exit(1)
  }
}

// Ejecutar seed
seed()
