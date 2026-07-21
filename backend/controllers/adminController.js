import bcrypt from 'bcryptjs'
import User from '../models/User.js'

function isUserEmail(email) {
  return /^[^\s@]+@getpayedmail\.com$/.test(email)
}

export const listUsers = async (_req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 })
    return res.json(
      users.map((user) => ({
        id: user._id.toString(),
        email: user.email,
        addedAt: user.createdAt.toISOString().slice(0, 10),
      })),
    )
  } catch (error) {
    console.error('Failed to list users', error)
    return res.status(500).json({ error: 'Failed to list users' })
  }
}

export const createUser = async (req, res) => {
  try {
    const { email, password, createdBy } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const normalizedEmail = email.trim().toLowerCase()
    if (!isUserEmail(normalizedEmail)) {
      return res.status(400).json({ error: 'Email must be a @getpayedmail.com address' })
    }

    const existing = await User.findOne({ email: normalizedEmail })
    if (existing) {
      return res.status(409).json({ error: 'This user has already been added' })
    }

    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({
      email: normalizedEmail,
      password: hashed,
      createdBy: createdBy || undefined,
    })

    return res.status(201).json({
      id: user._id.toString(),
      email: user.email,
      addedAt: user.createdAt.toISOString().slice(0, 10),
    })
  } catch (error) {
    console.error('Failed to create user', error)
    return res.status(500).json({ error: 'Failed to create user' })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    return res.json({ ok: true })
  } catch (error) {
    console.error('Failed to delete user', error)
    return res.status(500).json({ error: 'Failed to delete user' })
  }
}
