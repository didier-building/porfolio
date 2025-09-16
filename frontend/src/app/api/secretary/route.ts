import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { portfolioData } from '@/data/portfolio'

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

// Create portfolio context for the AI
function createPortfolioContext() {
  const { personal, projects, skills, experience, achievements, services } = portfolioData
  
  return `
You are Didier Imanirahari's AI secretary, providing information about his professional background and portfolio.

Personal Information:
- Name: ${personal.name}
- Role: ${personal.role}
- Summary: ${personal.summary}
- Location: ${personal.location}
- Email: ${personal.email}
- GitHub: ${personal.github}

Key Achievements:
${achievements.map(achievement => `- ${achievement}`).join('\n')}

Services Offered:
${services.map(service => `
${service.title}:
- Description: ${service.description}
- Features: ${service.features.join(', ')}
`).join('\n')}

Technical Skills:
${Object.entries(skills.reduce((acc, skill) => {
  if (!acc[skill.category]) acc[skill.category] = []
  acc[skill.category].push(`${skill.name} (${skill.proficiency}%)`)
  return acc
}, {} as Record<string, string[]>)).map(([category, skillList]) => `
${category}: ${skillList.join(', ')}`).join('\n')}

Professional Experience:
${experience.map(exp => `
${exp.date} - ${exp.title} at ${exp.organization} (${exp.type})
${exp.description.map(desc => `- ${desc}`).join('\n')}
`).join('\n')}

Projects:
${projects.map(project => `
${project.title} (${project.category}):
- Description: ${project.description}
- Technologies: ${project.technologies.join(', ')}
- GitHub: ${project.links.github || 'N/A'}
- Live Demo: ${project.links.live || 'N/A'}
${project.features ? `- Key Features: ${project.features.join(', ')}` : ''}
`).join('\n')}

Instructions:
- Be helpful, professional, and concise
- Answer questions about Didier's experience, skills, projects, and services
- If asked about availability for work, mention contacting him at ${personal.email}
- Stay in character as his AI secretary
- If asked about topics outside his portfolio, politely redirect to his professional background
- Be enthusiastic about his work but factual
`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt } = body

    // Validate input
    if (!prompt?.trim()) {
      return NextResponse.json(
        { 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Prompt is required.' 
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
            message: 'Gemini API key is not configured. Please contact the administrator.' 
          } 
        },
        { status: 503 }
      )
    }

    try {
      // Get the generative model
      const model = ai.getGenerativeModel({ model: 'gemini-pro' })

      // Create the full prompt with portfolio context
      const portfolioContext = createPortfolioContext()
      const fullPrompt = `${portfolioContext}\n\nUser Question: ${prompt.trim()}\n\nPlease provide a helpful response about Didier's professional background:`

      // Generate response
      const result = await model.generateContent(fullPrompt)
      const response = await result.response
      const reply = response.text()

      if (!reply) {
        throw new Error('Empty response from Gemini')
      }

      return NextResponse.json({ reply })

    } catch (geminiError: any) {
      console.error('Gemini API error:', geminiError)
      
      // Handle specific Gemini errors
      if (geminiError.message?.includes('API_KEY')) {
        return NextResponse.json(
          { 
            error: { 
              code: 'INVALID_API_KEY', 
              message: 'Invalid Gemini API key. Please check the configuration.' 
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
              message: 'AI service quota exceeded. Please try again later.' 
            } 
          },
          { status: 429 }
        )
      }

      return NextResponse.json(
        { 
          error: { 
            code: 'AI_SERVICE_ERROR', 
            message: 'AI service is temporarily unavailable. Please try again later.' 
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
          message: 'An internal error occurred. Please try again later.' 
        } 
      },
      { status: 500 }
    )
  }
}