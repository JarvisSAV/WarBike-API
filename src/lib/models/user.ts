import type { Model, ObjectId } from 'mongoose'
import mongoose, { Schema } from 'mongoose'

export interface IUser extends Document {
  _id: ObjectId
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
userSchema.index({ email: 1 }, { unique: true })
userSchema.index({ createdAt: -1 })

// Modelo
export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema)
