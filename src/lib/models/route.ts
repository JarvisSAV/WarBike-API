import mongoose, { Schema } from 'mongoose'
import type { Model, ObjectId } from 'mongoose'

export interface ICoordinate {
  latitude: number
  longitude: number
}

export interface IRouteStats {
  distance: number // en kilómetros
  duration: number // en segundos
  avgSpeed: number // en km/h
  maxSpeed?: number // en km/h
  calories?: number // calorías quemadas estimadas
}

export interface IRoute extends Document {
  _id: ObjectId
  userId: ObjectId
  coordinates: ICoordinate[]
  stats: IRouteStats
  startTime: Date
  endTime: Date
  conqueredTerritory?: number // área en km²
  territoryCoords?: ICoordinate[] // polígono del territorio conquistado
  name?: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

const coordinateSchema = new Schema<ICoordinate>(
  {
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180
    }
  },
  { _id: false }
)

const routeStatsSchema = new Schema<IRouteStats>(
  {
    distance: {
      type: Number,
      required: true,
      min: 0
    },
    duration: {
      type: Number,
      required: true,
      min: 0
    },
    avgSpeed: {
      type: Number,
      required: true,
      min: 0
    },
    maxSpeed: {
      type: Number,
      min: 0
    },
    calories: {
      type: Number,
      min: 0
    }
  },
  { _id: false }
)

const routeSchema = new Schema<IRoute>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El userId es requerido'],
      index: true
    },
    coordinates: {
      type: [coordinateSchema],
      required: [true, 'Las coordenadas son requeridas'],
      validate: {
        validator: function (coords: ICoordinate[]) {
          return coords.length >= 2
        },
        message: 'Debe haber al menos 2 coordenadas'
      }
    },
    stats: {
      type: routeStatsSchema,
      required: [true, 'Las estadísticas son requeridas']
    },
    startTime: {
      type: Date,
      required: [true, 'La hora de inicio es requerida']
    },
    endTime: {
      type: Date,
      required: [true, 'La hora de fin es requerida'],
      validate: {
        validator: function (this: IRoute, endTime: Date) {
          return endTime > this.startTime
        },
        message: 'La hora de fin debe ser posterior a la hora de inicio'
      }
    },
    conqueredTerritory: {
      type: Number,
      min: 0
    },
    territoryCoords: {
      type: [coordinateSchema]
    },
    name: {
      type: String,
      trim: true,
      maxlength: 100
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500
    }
  },
  {
    timestamps: true,
    collection: 'routes'
  }
)

// Índices
routeSchema.index({ userId: 1, createdAt: -1 })
routeSchema.index({ startTime: -1 })
routeSchema.index({ 'stats.distance': -1 })

// Modelo
export const Route: Model<IRoute> =
  mongoose.models.Route || mongoose.model<IRoute>('Route', routeSchema)
