import express from 'express'
import nodemailer from 'nodemailer'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

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
      auth: process.env.SMTP_USER && process.env.SMTP_PASS
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

app.listen(process.env.PORT || 3001, () => {
  console.log(`Email server listening on port ${process.env.PORT || 3001}`)
})
