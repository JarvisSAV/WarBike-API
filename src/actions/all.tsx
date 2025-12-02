'use server'

import { connectDB } from '@/lib/db'
import { Territory } from '@/lib/models/territory'
import { Route } from '@/lib/models/route'
import { User } from '@/lib/models/user'

export async function getUsers() {
  try {
    await connectDB()
    const users = await User.find({}).lean()
    return users.map(u => ({
      ...u,
      _id: u._id.toString(),
      createdAt: u.createdAt.toISOString(),
      updatedAt: u.updatedAt.toISOString()
    }))
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
}

export async function getTerritories(userId?: string) {
  try {
    await connectDB()
    const query = userId ? { userId } : {}
    const territories = await Territory.find(query).lean()
    
    // Serialize MongoDB objects to plain objects
    return territories.map(t => ({
      ...t,
      _id: t._id.toString(),
      userId: t.userId.toString(),
      routeId: t.routeId.toString(),
      timestamp: t.timestamp.toISOString(),
      createdAt: t.createdAt.toISOString()
    }))
  } catch (error) {
    console.error('Error fetching territories:', error)
    return []
  }
}

export async function getRoutes(userId?: string) {
  try {
    await connectDB()
    const query = userId ? { userId } : {}
    const routes = await Route.find(query).lean()

    // Serialize MongoDB objects to plain objects
    return routes.map(r => ({
      ...r,
      _id: r._id.toString(),
      userId: r.userId.toString(),
      startTime: r.startTime.toISOString(),
      endTime: r.endTime.toISOString(),
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString()
    }))
  } catch (error) {
    console.error('Error fetching routes:', error)
    return []
  }
}
