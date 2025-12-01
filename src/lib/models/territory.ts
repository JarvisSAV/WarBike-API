import mongoose, { Schema } from 'mongoose'
import type { Model, ObjectId } from 'mongoose'

export interface ICoordinate {
  latitude: number
  longitude: number
}

export interface ITerritory extends Document {
  _id: ObjectId
  userId: ObjectId
  routeId: ObjectId
  coordinates: ICoordinate[]
  area: number // en km²
  timestamp: Date
  name?: string
  createdAt: Date
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

const territorySchema = new Schema<ITerritory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El userId es requerido'],
      index: true
    },
    routeId: {
      type: Schema.Types.ObjectId,
      ref: 'Route',
      required: [true, 'El routeId es requerido']
    },
    coordinates: {
      type: [coordinateSchema],
      required: [true, 'Las coordenadas son requeridas'],
      validate: {
        validator: function (coords: ICoordinate[]) {
          return coords.length >= 3
        },
        message: 'Debe haber al menos 3 coordenadas para formar un polígono'
      }
    },
    area: {
      type: Number,
      required: [true, 'El área es requerida'],
      min: 0
    },
    timestamp: {
      type: Date,
      required: [true, 'El timestamp es requerido'],
      default: Date.now
    },
    name: {
      type: String,
      trim: true,
      maxlength: 100
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'territories'
  }
)

// Índices
territorySchema.index({ userId: 1, timestamp: -1 })
territorySchema.index({ routeId: 1 })
territorySchema.index({ timestamp: -1 })

// Modelo
export const Territory: Model<ITerritory> =
  mongoose.models.Territory || mongoose.model<ITerritory>('Territory', territorySchema)
