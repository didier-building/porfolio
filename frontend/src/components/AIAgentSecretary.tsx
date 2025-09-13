import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, User, Bot } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIAgentSecretary: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm Didier's AI Secretary. I can tell you about his experience, skills, projects, and help you understand why he'd be perfect for your team. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Show/hide button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 200; // Show after scrolling 200px
      setIsVisible(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll to bottom when new message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Simulate AI response - in real app this would call your AI API
      setTimeout(() => {
        const responses = [
          "Didier has 3+ years of experience building production-ready systems with Python/Django, React, and cloud technologies. He's skilled in API design, database optimization, and DevOps practices.",
          "His standout projects include an AI-enhanced portfolio with 6 intelligent tools, an order & inventory backend with idempotent APIs, and blockchain supply chain solutions. Each project demonstrates full-stack expertise.",
          "Didier excels in modern development practices: Docker containerization, Kubernetes orchestration, CI/CD pipelines, and comprehensive testing. He's reduced team onboarding time from 1 day to under 30 minutes.",
          "What sets Didier apart is his focus on production-ready solutions, clear documentation, and developer experience. He's pursuing a BSc in Computer & Software Engineering while actively building real-world systems.",
          "His technical skills span backend (Python, Django, PostgreSQL), frontend (React, TypeScript, Tailwind), cloud (Docker, Kubernetes), and collaboration tools. He's proven in both independent and team environments."
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const aiMessage: Message = {
          role: 'assistant',
          content: randomResponse,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
      }, 1000 + Math.random() * 1000); // Simulate network delay
    } catch (error) {
      setIsLoading(false);
      const errorMessage: Message = {
        role: 'assistant',
        content: "I apologize, but I'm having trouble responding right now. Please try asking your question again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "Tell me about Didier's experience",
    "What are his strongest technical skills?",
    "What projects showcase his abilities?",
    "Why should we hire Didier?",
    "What's his background in AI/ML?",
    "How experienced is he with cloud technologies?"
  ];

  return (
    <>
      {/* Floating Button */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-500 transform ${
          isVisible 
            ? 'translate-y-0 opacity-100 scale-100' 
            : 'translate-y-16 opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`group relative p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 ${
            isOpen
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-gradient-to-br from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700'
          }`}
        >
          {/* Pulsing ring animation */}
          {!isOpen && (
            <div className="absolute inset-0 rounded-full bg-teal-400 animate-ping opacity-20" />
          )}
          
          {/* Icon with smooth rotation */}
          <div className="relative z-10 text-white transition-transform duration-300">
            {isOpen ? (
              <X size={24} className="transform rotate-0 group-hover:rotate-90 transition-transform duration-300" />
            ) : (
              <MessageCircle size={24} className="transform group-hover:rotate-12 transition-transform duration-300" />
            )}
          </div>

          {/* Sparkle effects */}
          {!isOpen && (
            <>
              <Sparkles 
                size={12} 
                className="absolute -top-1 -right-1 text-amber-300 animate-pulse" 
              />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-amber-300 rounded-full animate-pulse" />
            </>
          )}
        </button>
      </div>

      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-6 z-40 w-96 h-[500px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 transition-all duration-500 transform ${
          isOpen
            ? 'translate-y-0 opacity-100 scale-100'
            : 'translate-y-8 opacity-0 scale-95 pointer-events-none'
        }`}
      >
        {/* Chat Header */}
        <div className="flex items-center p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot size={20} />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div>
              <h3 className="font-semibold">AI Secretary</h3>
              <p className="text-xs text-blue-100">Didier's Portfolio Assistant</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 h-80">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.role === 'assistant' && (
                    <Bot size={16} className="mt-0.5 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                  )}
                  {message.role === 'user' && (
                    <User size={16} className="mt-0.5 text-blue-100 flex-shrink-0" />
                  )}
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <Bot size={16} className="text-teal-600 dark:text-teal-400" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length <= 1 && (
          <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-1">
              {suggestedQuestions.slice(0, 3).map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(question)}
                  className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about Didier's experience..."
              className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="px-3 py-2 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 disabled:from-slate-300 disabled:to-slate-400 text-white rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default AIAgentSecretary;