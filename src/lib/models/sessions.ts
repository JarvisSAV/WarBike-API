import mongoose, { Schema } from 'mongoose'
import type { Model, ObjectId } from 'mongoose'

export interface ISession extends Document {
  _id: ObjectId
  sessionId: string
  userId: ObjectId
  expiresAt: Date
  createdAt: Date
}

const sessionSchema = new Schema<ISession>(
  {
    sessionId: {
      type: String,
      required: [true, 'El sessionId es requerido'],
      unique: true,
      length: 64
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El userId es requerido']
    },
    expiresAt: {
      type: Date,
      required: [true, 'La fecha de expiración es requerida'],
      index: { expires: 0 } // TTL index para auto-eliminar sesiones expiradas
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'sessions'
  }
)

// Índices
sessionSchema.index({ sessionId: 1 })
sessionSchema.index({ userId: 1 })
sessionSchema.index({ expiresAt: 1 })

// Modelo
export const Session: Model<ISession> = mongoose.models.Session || mongoose.model<ISession>('Session', sessionSchema)
