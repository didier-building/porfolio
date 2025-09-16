import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

// Rate limiting store (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; lastReset: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX = 5 // 5 requests per minute per IP

function getRateLimitKey(ip: string): string {
  return `contact_${ip}`
}

function checkRateLimit(ip: string): boolean {
  const key = getRateLimitKey(ip)
  const now = Date.now()
  const entry = rateLimitStore.get(key)

  if (!entry || now - entry.lastReset > RATE_LIMIT_WINDOW) {
    rateLimitStore.set(key, { count: 1, lastReset: now })
    return true
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false
  }

  entry.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { 
          error: { 
            code: 'RATE_LIMIT_EXCEEDED', 
            message: 'Too many requests. Please try again later.' 
          } 
        },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { name, email, message, honeypot } = body

    // Validate required fields
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Name, email, and message are required.' 
          } 
        },
        { status: 400 }
      )
    }

    // Check honeypot for spam protection
    if (honeypot) {
      return NextResponse.json(
        { 
          error: { 
            code: 'SPAM_DETECTED', 
            message: 'Invalid submission detected.' 
          } 
        },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          error: { 
            code: 'INVALID_EMAIL', 
            message: 'Please provide a valid email address.' 
          } 
        },
        { status: 400 }
      )
    }

    // Create contact record
    const contact = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      ip,
      created_at: new Date().toISOString(),
    }

    // Store contact (simple JSON file storage for now)
    // In production, use a proper database
    try {
      const contactsDir = join(process.cwd(), 'data')
      const contactsFile = join(contactsDir, 'contacts.json')
      
      // Ensure directory exists
      if (!existsSync(contactsDir)) {
        await mkdir(contactsDir, { recursive: true })
      }
      
      // Read existing contacts
      let contacts: any[] = []
      try {
        if (existsSync(contactsFile)) {
          const data = await readFile(contactsFile, 'utf-8')
          contacts = JSON.parse(data)
        }
      } catch {
        contacts = []
      }

      // Add new contact
      contacts.push(contact)

      // Write back to file
      await writeFile(contactsFile, JSON.stringify(contacts, null, 2))
    } catch (storageError) {
      console.error('Error storing contact:', storageError)
      // Continue even if storage fails
    }

    // If email configuration is available, send email
    const mailConfig = {
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO,
    }

    if (mailConfig.host && mailConfig.user && mailConfig.pass) {
      // Email sending logic would go here
      // For now, just log that we would send an email
      console.log('Would send email notification:', {
        to: mailConfig.to,
        subject: `New contact from ${name}`,
        body: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      })
    }

    return NextResponse.json({ ok: true })

  } catch (error) {
    console.error('Contact API error:', error)
    
    return NextResponse.json(
      { 
        error: { 
          code: 'INTERNAL_ERROR', 
          message: 'An internal error occurred. Please try again later.' 
        } 
      },
      { status: 500 }
    )
  }
}