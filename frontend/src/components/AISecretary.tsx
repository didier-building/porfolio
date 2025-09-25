'use client'

import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, Send, X, Bot, User, Loader2, Minimize2, Maximize2, Sparkles } from 'lucide-react'
import { AISecretaryQuickActions } from './AISecretaryQuickActions'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface AISecretaryProps {
  className?: string
}

export function AISecretary({ className = '' }: AISecretaryProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I'm Didier's AI secretary. I can help you learn about his experience, projects, skills, and services. Use the quick questions below or ask me anything!",
      timestamp: new Date().toISOString()
    }
  ])
  const [showQuickActions, setShowQuickActions] = useState(true)
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen, isMinimized])

  const handleQuickAction = (message: string) => {
    setInputMessage(message)
    setShowQuickActions(false)
    // Auto-send the message
    setTimeout(() => {
      sendMessage(message)
    }, 100)
  }

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)
    setShowQuickActions(false)

    try {
      const response = await fetch('/api/secretary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          conversationHistory: messages.slice(-10).map(msg => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
          }))
        }),
      })

      const data = await response.json()

      if (response.ok && data.reply) {
        const assistantMessage: Message = {
          id: `assistant_${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          timestamp: data.timestamp || new Date().toISOString()
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        const errorMessage: Message = {
          id: `error_${Date.now()}`,
          role: 'assistant',
          content: data.error?.message || 'Sorry, I encountered an error. Please try again or contact Didier directly at didier53053@gmail.com.',
          timestamp: new Date().toISOString()
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered a connection error. Please try again or contact Didier directly at didier53053@gmail.com.',
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async () => {
    await sendMessage(inputMessage)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const clearConversation = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: "Hello! I'm Didier's AI secretary. I can help you learn about his experience, projects, skills, and services. Use the quick questions below or ask me anything!",
        timestamp: new Date().toISOString()
      }
    ])
    setShowQuickActions(true)
  }

  if (!isOpen) {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-terminal-accent dark:bg-terminal-accent hover:bg-terminal-accent-dim dark:hover:bg-terminal-accent-dim text-black dark:text-black p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group relative overflow-hidden"
          aria-label="Open Didier's Secretary"
        >
          <MessageCircle size={24} />
          <div className="absolute -top-2 -left-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white dark:text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
            <Sparkles size={12} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full animate-pulse"></div>
        </button>
      </div>
    )
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <div className={`bg-terminal-bg dark:bg-terminal-bg border border-terminal-border dark:border-terminal-border rounded-lg shadow-2xl transition-all duration-300 flex flex-col ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[520px]'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-terminal-border bg-terminal-bg-light rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bot className="w-6 h-6 text-terminal-accent" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h3 className="font-mono text-terminal-text font-semibold">Didier's Secretary</h3>
              <p className="text-xs text-terminal-text-dim">AI Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-terminal-text-dim dark:text-terminal-text-dim hover:text-terminal-accent dark:hover:text-terminal-accent transition-colors"
              aria-label={isMinimized ? "Maximize" : "Minimize"}
            >
              {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-terminal-text-dim dark:text-terminal-text-dim hover:text-red-400 dark:hover:text-red-400 transition-colors"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0">
                      <Bot className="w-6 h-6 text-terminal-accent" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-2 rounded-lg font-mono text-sm ${
                      message.role === 'user'
                        ? 'bg-terminal-accent dark:bg-terminal-accent text-black dark:text-black'
                        : 'bg-terminal-bg-light dark:bg-terminal-bg-light text-terminal-text dark:text-terminal-text border border-terminal-border dark:border-terminal-border'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-black/70 dark:text-black/70' : 'text-terminal-text-dim dark:text-terminal-text-dim'
                    }`}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                  {message.role === 'user' && (
                    <div className="flex-shrink-0">
                      <User className="w-6 h-6 text-terminal-text-dim" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <Bot className="w-6 h-6 text-terminal-accent" />
                  <div className="bg-terminal-bg-light dark:bg-terminal-bg-light text-terminal-text dark:text-terminal-text border border-terminal-border dark:border-terminal-border p-2 rounded-lg font-mono text-sm">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {showQuickActions && messages.length <= 1 && (
              <div className="flex-shrink-0">
                <AISecretaryQuickActions onQuickAction={handleQuickAction} />
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-terminal-border dark:border-terminal-border bg-terminal-bg dark:bg-terminal-bg">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about Didier's work, projects, or skills..."
                  className="flex-1 bg-terminal-bg-light dark:bg-terminal-bg-light border border-terminal-border dark:border-terminal-border rounded-md px-3 py-2 text-terminal-text dark:text-terminal-text placeholder-terminal-text-dim dark:placeholder-terminal-text-dim font-mono text-sm focus:outline-none focus:ring-2 focus:ring-terminal-accent/50 focus:border-terminal-accent dark:focus:border-terminal-accent"
                  disabled={isLoading}
                  maxLength={1000}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-terminal-accent dark:bg-terminal-accent hover:bg-terminal-accent-dim dark:hover:bg-terminal-accent-dim text-black dark:text-black p-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-terminal-text-dim dark:text-terminal-text-dim">
                  {inputMessage.length}/1000
                </span>
                <button
                  onClick={clearConversation}
                  className="text-xs text-terminal-text-dim dark:text-terminal-text-dim hover:text-terminal-accent dark:hover:text-terminal-accent transition-colors"
                >
                  Clear chat
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}