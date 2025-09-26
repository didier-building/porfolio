import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { portfolioData } from '@/data/portfolio'

// Rate limiting store
const rateLimitStore = new Map<string, { count: number; lastReset: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX = 20 // 20 requests per minute per IP

// Initialize Gemini AI
let genAI: GoogleGenerativeAI | null = null

function initGemini() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return null
  }
  
  if (!genAI) {
    genAI = new GoogleGenerativeAI(apiKey)
  }
  
  return genAI
}

function checkRateLimit(ip: string): boolean {
  const key = `ai_secretary_${ip}`
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

// Create comprehensive portfolio context for the AI
function createPortfolioContext() {
  const { personal, projects, skills, experience, achievements, services } = portfolioData
  
  return `You are Didier Imanirahari's professional AI secretary. You represent him professionally and help visitors learn about his work, skills, and availability.

=== PERSONAL INFORMATION ===
Name: ${personal.name}
Role: ${personal.role}
Summary: ${personal.summary}
Location: ${personal.location}
Email: ${personal.email}
GitHub: ${personal.github}
LinkedIn: ${personal.linkedin}
CV: ${personal.cv}

=== KEY ACHIEVEMENTS ===
${achievements.map(achievement => `• ${achievement}`).join('\n')}

=== SERVICES OFFERED ===
${services.map(service => `
${service.title}:
${service.description}
Key Features: ${service.features.join(', ')}`).join('\n\n')}

=== TECHNICAL SKILLS ===
${Object.entries(skills.reduce((acc, skill) => {
  if (!acc[skill.category]) acc[skill.category] = []
  acc[skill.category].push(`${skill.name} (${skill.proficiency}% proficiency)`)
  return acc
}, {} as Record<string, string[]>)).map(([category, skillList]) => `
${category}:
${skillList.map(skill => `  • ${skill}`).join('\n')}`).join('\n')}

=== PROFESSIONAL EXPERIENCE ===
${experience.map(exp => `
${exp.date} - ${exp.title}
${exp.organization} (${exp.type})
${exp.description.map(desc => `• ${desc}`).join('\n')}`).join('\n\n')}

=== PORTFOLIO PROJECTS ===
${projects.map(project => `
${project.title} (${project.category.toUpperCase()})
Description: ${project.description}
Technologies: ${project.technologies.join(', ')}
GitHub: ${project.links.github || 'Private repository'}
Live Demo: ${project.links.live || 'Not publicly available'}
${project.features ? `Key Features: ${project.features.join(', ')}` : ''}`).join('\n\n')}

=== INSTRUCTIONS ===
1. Be professional, helpful, and enthusiastic about Didier's work
2. Answer questions about his experience, skills, projects, and services
3. For work inquiries, direct them to contact him at ${personal.email}
4. Stay focused on professional topics related to his portfolio
5. If asked about personal matters, politely redirect to professional topics
6. Be specific when discussing projects - mention technologies, features, and outcomes
7. Highlight relevant experience based on the visitor's interests
8. Suggest specific projects or skills that match their needs
9. Always maintain a professional, confident tone representing Didier
10. If you don't have specific information, be honest but offer to connect them directly

=== CONVERSATION STYLE ===
- Professional but approachable
- Confident in Didier's abilities
- Specific and detailed when discussing technical topics
- Helpful in matching visitor needs with Didier's expertise
- Proactive in suggesting relevant projects or skills`
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
            message: 'Too many requests. Please wait a moment before asking another question.' 
          } 
        },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { message, conversationHistory = [] } = body

    // Validate input
    if (!message?.trim()) {
      return NextResponse.json(
        { 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Message is required.' 
          } 
        },
        { status: 400 }
      )
    }

    if (message.length > 1000) {
      return NextResponse.json(
        { 
          error: { 
            code: 'MESSAGE_TOO_LONG', 
            message: 'Message is too long. Please keep it under 1000 characters.' 
          } 
        },
        { status: 400 }
      )
    }

    // Check if Gemini API key is configured
    const ai = initGemini()
    if (!ai) {
      return NextResponse.json(
        { 
          error: { 
            code: 'API_KEY_MISSING', 
            message: 'AI service is not configured. Please contact Didier directly at didier53053@gmail.com.' 
          } 
        },
        { status: 503 }
      )
    }

    try {
      // Get the generative model with safety settings
      const model = ai.getGenerativeModel({ 
        model: 'gemini-2.0-flash',
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 1000,
        }
      })

      // Create conversation context
      const portfolioContext = createPortfolioContext()
      let conversationContext = ''
      
      if (conversationHistory.length > 0) {
        conversationContext = '\n\n=== RECENT CONVERSATION ===\n' + 
          conversationHistory.slice(-6).map((msg: any) => 
            `${msg.role === 'user' ? 'Visitor' : 'Secretary'}: ${msg.content}`
          ).join('\n')
      }

      const fullPrompt = `${portfolioContext}${conversationContext}\n\n=== CURRENT MESSAGE ===\nVisitor: ${message.trim()}\n\nSecretary:`

      // Generate response
      const result = await model.generateContent(fullPrompt)
      const response = await result.response
      const reply = response.text()

      if (!reply) {
        throw new Error('Empty response from Gemini')
      }

      // Clean up the response
      const cleanReply = reply.trim().replace(/^Secretary:\s*/, '')

      return NextResponse.json({ 
        reply: cleanReply,
        timestamp: new Date().toISOString(),
        conversationId: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      })

    } catch (geminiError: any) {
      console.error('Gemini API error:', geminiError)
      
      // Handle specific Gemini errors
      if (geminiError.message?.includes('API_KEY')) {
        return NextResponse.json(
          { 
            error: { 
              code: 'INVALID_API_KEY', 
              message: 'AI service configuration error. Please contact Didier directly.' 
            } 
          },
          { status: 401 }
        )
      }

      if (geminiError.message?.includes('quota') || geminiError.message?.includes('limit')) {
        return NextResponse.json(
          { 
            error: { 
              code: 'QUOTA_EXCEEDED', 
              message: 'AI service is temporarily busy. Please try again in a few minutes or contact Didier directly at didier53053@gmail.com.' 
            } 
          },
          { status: 429 }
        )
      }

      if (geminiError.message?.includes('SAFETY')) {
        return NextResponse.json(
          { 
            reply: "I'm here to help with questions about Didier's professional background, projects, and services. Could you please rephrase your question to focus on his work and expertise?"
          }
        )
      }

      return NextResponse.json(
        { 
          error: { 
            code: 'AI_SERVICE_ERROR', 
            message: 'AI service is temporarily unavailable. Please contact Didier directly at didier53053@gmail.com.' 
          } 
        },
        { status: 503 }
      )
    }

  } catch (error) {
    console.error('Secretary API error:', error)
    
    return NextResponse.json(
      { 
        error: { 
          code: 'INTERNAL_ERROR', 
          message: 'An internal error occurred. Please contact Didier directly at didier53053@gmail.com.' 
        } 
      },
      { status: 500 }
    )
  }
}