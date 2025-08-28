import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatResponse {
  response: string;
  timestamp: string;
  ai_powered: boolean;
  profile_name: string;
}

const ProjectExplainerBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hello! I'm Didier's AI representative. I can discuss his technical projects, work experience, skills, and provide detailed information about his capabilities. What would you like to know?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await api.post<ChatResponse>('/ai/project-chat/', {
        message: userMessage.content,
        history: conversationHistory
      });

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.data.response,
        timestamp: response.data.timestamp
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to get response. Please try again.');
      
      // Add error message to chat
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: "I apologize, but I'm having trouble responding right now. Please try asking your question again.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestedQuestions = [
    "Tell me about the AI-powered portfolio system",
    "What blockchain projects has Didier worked on?",
    "Explain the cloud infrastructure experience",
    "What technologies does Didier specialize in?",
    "Describe the network security projects",
    "What's Didier's experience with Python and Django?"
  ];

  const askSuggestedQuestion = (question: string) => {
    setInputMessage(question);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            💬 Project Explainer Bot
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Interactive AI chat about Didier's projects and experience. 
            Ask specific questions to get detailed technical insights.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Chat Container */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-teal-500 to-blue-500 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl">🤖</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Didier's AI Assistant</h3>
                  <p className="text-blue-100">Professional Portfolio Representative</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <p className={`text-xs mt-2 ${
                      message.role === 'user' ? 'text-blue-100' : 'text-slate-500'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 dark:bg-slate-700 px-4 py-3 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Error Display */}
            {error && (
              <div className="px-6 py-2">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="border-t border-slate-200 dark:border-slate-600 p-6">
              <div className="flex space-x-4">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about projects, experience, or technical skills..."
                  className="flex-1 p-3 border border-slate-300 dark:border-slate-600 rounded-lg resize-none focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  rows={2}
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 transform-gpu disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v4m0 8v4m8-8h-4M4 12h4m11.314-5.686l-2.828 2.828M8.686 8.686L5.858 5.858m12.728 12.728l-2.828-2.828M8.686 15.314L5.858 18.142"></path>
                    </svg>
                  ) : (
                    <span>Send</span>
                  )}
                </button>
              </div>
              
              <p className="text-xs text-slate-500 mt-2">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </div>

          {/* Suggested Questions */}
          <div className="mt-8">
            <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              💡 Suggested Questions
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => askSuggestedQuestion(question)}
                  className="text-left p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg hover:border-teal-500 hover:shadow-md transition-all duration-200 group"
                >
                  <span className="text-slate-700 dark:text-slate-300 group-hover:text-teal-600">
                    {question}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectExplainerBot;
