import mongoose, { Schema } from 'mongoose'
import type { Model, ObjectId } from 'mongoose'

export interface ISession extends Document {
  _id: ObjectId
  sessionId: string
  userId: ObjectId
  expiresAt: Date
  createdAt: Date
  deviceName?: string
  deviceType?: string
  deviceModel?: string
  lastUsed: Date
}

const sessionSchema = new Schema<ISession>(
  {
    sessionId: {
      type: String,
      required: [true, 'El sessionId es requerido'],
      length: 64
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El userId es requerido']
    },
    expiresAt: {
      type: Date,
      required: [true, 'La fecha de expiración es requerida']
    },
    deviceName: {
      type: String,
      required: false
    },
    deviceType: {
      type: String,
      required: false
    },
    deviceModel: {
      type: String,
      required: false
    },
    lastUsed: {
      type: Date,
      required: true,
      default: Date.now
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'sessions'
  }
)

// Índices
sessionSchema.index({ sessionId: 1 }, { unique: true })
sessionSchema.index({ userId: 1 })
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }) // TTL index para auto-eliminar sesiones expiradas

// Modelo
export const Session: Model<ISession> = mongoose.models.Session || mongoose.model<ISession>('Session', sessionSchema)
