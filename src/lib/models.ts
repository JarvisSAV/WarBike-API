// Modelos de Mongoose para la aplicación
import mongoose, { Schema, Model, Document } from 'mongoose'

// ==================== USER MODEL ====================

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId
  email: string
  password: string
  name: string
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'El email es requerido'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email inválido']
    },
    password: {
      type: String,
      required: [true, 'La contraseña es requerida'],
      minlength: [8, 'La contraseña debe tener al menos 8 caracteres']
    },
    name: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres']
    }
  },
  {
    timestamps: true,
    collection: 'users'
  }
)

// Índices
userSchema.index({ email: 1 })
userSchema.index({ createdAt: -1 })

// Modelo
export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema)

// ==================== SESSION MODEL ====================

export interface ISession extends Document {
  _id: mongoose.Types.ObjectId
  sessionId: string
  userId: mongoose.Types.ObjectId
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
