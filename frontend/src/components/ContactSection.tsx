'use client'

import React, { useState } from 'react'
import { Mail, Github, Copy, Send, Loader2 } from 'lucide-react'
import { SectionTitle } from './SectionTitle'
import { portfolioData } from '@/data/portfolio'
// Security utilities
const sanitizeInput = (input: any) => {
  if (typeof input !== 'string') return input;
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
};

class RateLimiter {
  private requests: Map<string, number[]>;
  
  constructor() {
    this.requests = new Map();
  }
  
  isAllowed(key: string, limit = 5, windowMs = 60000): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }
    
    const requests = this.requests.get(key) || [];
    const validRequests = requests.filter((time: number) => time > windowStart);
    
    if (validRequests.length >= limit) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(key, validRequests);
    return true;
  }
}

const rateLimiter = new RateLimiter();

interface ContactFormData {
  name: string
  email: string
  message: string
  honeypot: string // Spam protection
}

export function ContactSection() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
    honeypot: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [copyFeedback, setCopyFeedback] = useState(false)
  
  const { personal } = portfolioData

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personal.email)
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    } catch (err) {
      console.error('Failed to copy email:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Rate limiting check
    const clientId = 'contact_form';
    if (!rateLimiter.isAllowed(clientId, 3, 300000)) {
      setSubmitStatus('error')
      return
    }
    
    // Input sanitization
    const sanitizedData = {
      name: sanitizeInput(formData.name.trim()),
      email: sanitizeInput(formData.email.trim()),
      message: sanitizeInput(formData.message.trim())
    }
    
    // Basic validation
    if (!sanitizedData.name || !sanitizedData.email || !sanitizedData.message) {
      setSubmitStatus('error')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(sanitizedData.email)) {
      setSubmitStatus('error')
      return
    }

    // Honeypot check
    if (formData.honeypot) {
      setSubmitStatus('error')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('http://127.0.0.1:8000/api/contact/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedData),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', message: '', honeypot: '' })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-16">
      <SectionTitle cmd="contact --open" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="text-terminal-text-dim font-mono text-sm">
            <span className="text-terminal-accent">$</span> Let&apos;s connect and build something amazing together
          </div>

          {/* Email with copy button */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-terminal-accent" />
              <span className="font-mono text-terminal-text">{personal.email}</span>
              <button
                onClick={copyEmail}
                className="inline-flex items-center gap-1 text-xs font-mono text-terminal-accent hover:underline"
              >
                <Copy size={12} />
                {copyFeedback ? 'Copied!' : 'Copy'}
              </button>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-3">
              <Github className="w-5 h-5 text-terminal-accent" />
              <a
                href={personal.github}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-terminal-text hover:text-terminal-accent transition-colors"
              >
                GitHub
              </a>
            </div>

            {personal.linkedin && (
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 text-terminal-accent">💼</span>
                <a
                  href={personal.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-terminal-text hover:text-terminal-accent transition-colors"
                >
                  LinkedIn
                </a>
              </div>
            )}
          </div>

            <div className="text-terminal-text-dim font-mono text-xs mt-1">
              <span className="text-terminal-accent">Note:</span> Response time typically 24-48 hours
            </div>
        </div>

        {/* Contact Form */}
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Honeypot field (hidden) */}
            <input
              type="text"
              name="honeypot"
              value={formData.honeypot}
              onChange={handleInputChange}
              style={{ display: 'none' }}
              tabIndex={-1}
              autoComplete="off"
            />

            <div>
              <label htmlFor="name" className="block text-sm font-mono text-terminal-accent mb-2">
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full bg-terminal-bg-light border border-terminal-border rounded-md px-3 py-2 text-terminal-text font-mono text-sm focus:outline-none focus:ring-2 focus:ring-terminal-accent/50 focus:border-terminal-accent"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-mono text-terminal-accent mb-2">
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full bg-terminal-bg-light border border-terminal-border rounded-md px-3 py-2 text-terminal-text font-mono text-sm focus:outline-none focus:ring-2 focus:ring-terminal-accent/50 focus:border-terminal-accent"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-mono text-terminal-accent mb-2">
                Message:
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full bg-terminal-bg-light border border-terminal-border rounded-md px-3 py-2 text-terminal-text font-mono text-sm focus:outline-none focus:ring-2 focus:ring-terminal-accent/50 focus:border-terminal-accent resize-none"
                placeholder="Your message..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-3 bg-terminal-accent text-black font-mono font-semibold rounded-md hover:bg-terminal-accent-dim transition-colors focus:outline-none focus:ring-2 focus:ring-terminal-accent/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Send Message
                </>
              )}
            </button>

            {/* Status messages */}
            {submitStatus === 'success' && (
              <div className="text-terminal-accent font-mono text-sm">
                ✓ Message sent successfully! I&apos;ll get back to you soon.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="text-red-400 font-mono text-sm">
                ✗ Error sending message. Please try again or email me directly.
              </div>
            )}
          </form>
        </div>
      </div>

      <div className="mt-8 text-terminal-text-dim font-mono text-sm">
        <span className="text-terminal-accent">$</span> contact --help: Send a message or reach out directly via email/social media
      </div>
    </section>
  )
}