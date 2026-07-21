import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import Admin from '../models/Admin.js'

export async function connectDb() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.error('MONGODB_URI is not set in .env')
    process.exit(1)
  }
  await mongoose.connect(uri)
  console.log('Connected to MongoDB Atlas')
}

export async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  if (!email || !password) {
    console.warn('ADMIN_EMAIL or ADMIN_PASSWORD not set — skipping admin seed')
    return
  }

  const existing = await Admin.findOne({ email: email.toLowerCase() })
  if (existing) return

  const hashed = await bcrypt.hash(password, 10)
  await Admin.create({ email: email.toLowerCase(), password: hashed, role: 'admin' })
  console.log(`Seeded admin account: ${email}`)
}
