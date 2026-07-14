import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import nodemailer from 'nodemailer'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
})

const Admin = mongoose.model('Admin', adminSchema)

async function connectDb() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.error('MONGODB_URI is not set in .env')
    process.exit(1)
  }
  await mongoose.connect(uri)
  console.log('Connected to MongoDB')
}

async function seedAdmin() {
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

function isUserEmail(email) {
  return /^[^\s@]+@getpayedmail\.com$/.test(email)
}

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const admin = await Admin.findOne({ email: normalizedEmail })

    if (admin) {
      const valid = await bcrypt.compare(password, admin.password)
      if (!valid) {
        return res.status(401).json({ error: 'Invalid email or password' })
      }
      return res.json({ email: admin.email, role: 'admin' })
    }

    if (!isUserEmail(normalizedEmail)) {
      return res.status(401).json({ error: 'Email must be a @getpayedmail.com address' })
    }

    return res.json({ email: normalizedEmail, role: 'user' })
  } catch (error) {
    console.error('Login failed', error)
    return res.status(500).json({ error: 'Login failed' })
  }
})

app.post('/api/send-voucher-email', async (req, res) => {
  try {
    const { to, cc, subject, text } = req.body

    if (!to || !subject || !text) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth:
        process.env.SMTP_USER && process.env.SMTP_PASS
          ? {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            }
          : undefined,
    })

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      cc: cc || undefined,
      subject,
      text,
    })

    return res.json({ ok: true, messageId: info.messageId })
  } catch (error) {
    console.error('send-voucher-email failed', error)
    return res.status(500).json({ error: 'Failed to send email' })
  }
})

const port = process.env.PORT || 3001

connectDb()
  .then(seedAdmin)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`)
    })
  })
  .catch((error) => {
    console.error('Failed to start server', error)
    process.exit(1)
  })
