'use client'

import { APIProvider, Map as GoogleMaps, useMap, useMapsLibrary } from '@vis.gl/react-google-maps'
import { useEffect, useState, useMemo } from 'react'
import { getTerritories, getRoutes, getUsers } from '@/actions/all'

interface Coordinate {
  latitude: number
  longitude: number
}

interface Territory {
  _id: string
  userId: string
  routeId: string
  coordinates: Coordinate[]
  timestamp: string
  createdAt: string
}

interface Route {
  _id: string
  userId: string
  coordinates: Coordinate[]
  startTime: string
  endTime: string
  createdAt: string
  updatedAt: string
}

interface User {
  _id: string
  name: string
  createdAt: string
  updatedAt: string
}

// Helper to generate color from string (userId)
const stringToColor = (str: string) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase()
  return '#' + '00000'.substring(0, 6 - c.length) + c
}

function MapContent() {
  const map = useMap()
  const maps = useMapsLibrary('maps')
  const [territories, setTerritories] = useState<Territory[]>([])
  const [routes, setRoutes] = useState<Route[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<string>('all')
  const [showTerritories, setShowTerritories] = useState(true)
  const [showRoutes, setShowRoutes] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const [t, r, u] = await Promise.all([getTerritories(), getRoutes(), getUsers()])
      console.log({t, r, u})
      setTerritories(t)
      setRoutes(r)
      setUsers(u)
    }
    fetchData()
  }, [])

  const filteredTerritories = useMemo(() => {
    if (!showTerritories) return []
    if (selectedUser === 'all') return territories
    return territories.filter(t => t.userId === selectedUser)
  }, [territories, selectedUser, showTerritories])

  const filteredRoutes = useMemo(() => {
    if (!showRoutes) return []
    if (selectedUser === 'all') return routes
    return routes.filter(r => r.userId === selectedUser)
  }, [routes, selectedUser, showRoutes])

  useEffect(() => {
    if (!map || !maps) return

    // Render Territories
    const territoryPolygons = filteredTerritories.map(t => {
      const color = stringToColor(t.userId)
      const polygon = new maps.Polygon({
        paths: t.coordinates.map((c) => ({ lat: c.latitude, lng: c.longitude })),
        strokeColor: color,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: color,
        fillOpacity: 0.35,
        map: map
      })
      return polygon
    })

    // Render Routes
    const routePolylines = filteredRoutes.map(r => {
      const color = stringToColor(r.userId)
      const polyline = new maps.Polyline({
        path: r.coordinates.map((c) => ({ lat: c.latitude, lng: c.longitude })),
        geodesic: true,
        strokeColor: color,
        strokeOpacity: 1.0,
        strokeWeight: 4,
        map: map
      })
      return polyline
    })

    return () => {
      territoryPolygons.forEach(p => p.setMap(null))
      routePolylines.forEach(p => p.setMap(null))
    }
  }, [map, maps, filteredTerritories, filteredRoutes])

  return (
    <div className="absolute top-4 left-4 bg-white p-4 rounded shadow-md z-10 flex flex-col gap-2 min-w-[200px]">
      <h3 className="font-bold text-gray-800">Filtros</h3>
            
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Usuario</label>
        <select 
          value={selectedUser} 
          onChange={(e) => setSelectedUser(e.target.value)}
          className="border rounded p-1 text-sm bg-white text-gray-800"
        >
          <option value="all">Todos los usuarios</option>
          {users.map(u => (
            <option key={u._id} value={u._id}>{u.name}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1 mt-2">
        <label className="text-sm font-medium text-gray-700">Ver</label>
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input 
            type="checkbox" 
            checked={showTerritories} 
            onChange={(e) => setShowTerritories(e.target.checked)}
          />
                    Territorios
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input 
            type="checkbox" 
            checked={showRoutes} 
            onChange={(e) => setShowRoutes(e.target.checked)}
          />
                    Rutas
        </label>
      </div>
    </div>
  )
}

export default function Map() {
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMaps
        defaultCenter={{ lat: 20.6767, lng: -103.3475 }}
        defaultZoom={15}
        gestureHandling='greedy'
        disableDefaultUI
        className="w-full h-full min-h-[400px]"
      >
        <MapContent />
      </GoogleMaps>
    </APIProvider>
  )
}
