import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { Route } from '@/lib/models/route'
import { Territory } from '@/lib/models/territory'
import { connectDB } from '@/lib/db'
import { applyRateLimit } from '@/lib/rate-limit-middleware'
import { RATE_LIMITS } from '@/lib/rate-limit'
import mongoose from 'mongoose'

export async function GET(request: Request) {
  // Aplicar rate limiting
  const rateLimitResponse = applyRateLimit(request, RATE_LIMITS.API)
  if (rateLimitResponse) {
    return rateLimitResponse
  }

  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { message: 'No autenticado o sesión expirada' },
        { status: 401 }
      )
    }

    await connectDB()

    const userId = new mongoose.Types.ObjectId(session.userId)

    // Obtener estadísticas agregadas
    const [routeStats, territoryStats, recentRoutes] = await Promise.all([
      // Estadísticas de rutas
      Route.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: null,
            totalRoutes: { $sum: 1 },
            totalDistance: { $sum: '$stats.distance' },
            totalDuration: { $sum: '$stats.duration' },
            avgSpeed: { $avg: '$stats.avgSpeed' },
            maxSpeed: { $max: '$stats.maxSpeed' },
            totalCalories: { $sum: '$stats.calories' },
            totalTerritory: { $sum: '$conqueredTerritory' }
          }
        }
      ]),
      // Estadísticas de territorios
      Territory.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: null,
            totalTerritories: { $sum: 1 },
            totalArea: { $sum: '$area' }
          }
        }
      ]),
      // Últimas 5 rutas
      Route.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('stats startTime endTime conqueredTerritory name createdAt')
        .lean()
    ])

    const routeData = routeStats[0] || {
      totalRoutes: 0,
      totalDistance: 0,
      totalDuration: 0,
      avgSpeed: 0,
      maxSpeed: 0,
      totalCalories: 0,
      totalTerritory: 0
    }

    const territoryData = territoryStats[0] || {
      totalTerritories: 0,
      totalArea: 0
    }

    // Estadísticas por mes (últimos 6 meses)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const monthlyStats = await Route.aggregate([
      {
        $match: {
          userId,
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          routes: { $sum: 1 },
          distance: { $sum: '$stats.distance' },
          duration: { $sum: '$stats.duration' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ])

    return NextResponse.json(
      {
        overview: {
          totalRoutes: routeData.totalRoutes,
          totalDistance: Number(routeData.totalDistance.toFixed(2)),
          totalDuration: routeData.totalDuration,
          avgSpeed: Number(routeData.avgSpeed.toFixed(2)),
          maxSpeed: routeData.maxSpeed || 0,
          totalCalories: routeData.totalCalories || 0,
          totalTerritories: territoryData.totalTerritories,
          totalArea: Number(territoryData.totalArea.toFixed(2))
        },
        recentRoutes: recentRoutes.map((route) => ({
          id: route._id.toString(),
          name: route.name,
          distance: route.stats.distance,
          duration: route.stats.duration,
          avgSpeed: route.stats.avgSpeed,
          startTime: route.startTime,
          endTime: route.endTime,
          conqueredTerritory: route.conqueredTerritory,
          createdAt: route.createdAt
        })),
        monthlyStats: monthlyStats.map((stat) => ({
          year: stat._id.year,
          month: stat._id.month,
          routes: stat.routes,
          distance: Number(stat.distance.toFixed(2)),
          duration: stat.duration
        }))
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
