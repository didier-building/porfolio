import React, { useState, useEffect } from 'react';
import JDFitAnalyzer from '../components/recruiter/JDFitAnalyzer';
import PortfolioChat from '../components/recruiter/PortfolioChat';
import ContactBar from '../components/recruiter/ContactBar';
import { FitAnalysisResult } from '../services/recruiterApi';

const RecruiterLanding: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<FitAnalysisResult | null>(null);
  const [jobDescription, setJobDescription] = useState('');

  const handleAnalysisComplete = (result: FitAnalysisResult) => {
    setAnalysisResult(result);
  };

  // Extract job description from analyzer for CV tailoring
  useEffect(() => {
    // This would be passed from the analyzer component
    // For now, we'll use a simple approach
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            Should we talk to this person?
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Get instant job fit analysis, explore the portfolio through AI chat, 
            and connect directly. Fast track from job description to hiring decision.
          </p>
          
          {/* Quick Stats */}
          <div className="flex justify-center space-x-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">3+</div>
              <div className="text-sm text-slate-600">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">6</div>
              <div className="text-sm text-slate-600">AI Tools Built</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">99.9%</div>
              <div className="text-sm text-slate-600">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">24h</div>
              <div className="text-sm text-slate-600">Response Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Job Fit Analyzer */}
            <div>
              <JDFitAnalyzer onAnalysisComplete={handleAnalysisComplete} />
            </div>

            {/* Right Column - Portfolio Chat */}
            <div>
              <PortfolioChat />
            </div>
          </div>

          {/* Results Summary */}
          {analysisResult && (
            <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
                📋 Quick Decision Summary
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Compatibility */}
                <div className="text-center p-6 bg-slate-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {analysisResult.score}%
                  </div>
                  <div className="text-sm text-slate-600">Job Compatibility</div>
                </div>

                {/* Key Strengths */}
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {analysisResult.matches.length}
                  </div>
                  <div className="text-sm text-slate-600">Strong Matches</div>
                </div>

                {/* Interview Ready */}
                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {analysisResult.questions.length}
                  </div>
                  <div className="text-sm text-slate-600">Interview Questions</div>
                </div>
              </div>

              {/* Quick Action */}
              <div className="mt-8 text-center">
                <p className="text-lg text-slate-700 mb-4">
                  Ready to move forward? Book a 15-minute call to discuss the role.
                </p>
                <a
                  href="https://calendly.com/your-calendar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 transform-gpu"
                >
                  📅 Schedule Interview
                </a>
              </div>
            </div>
          )}

          {/* Key Projects Preview */}
          <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
              🚀 Featured Projects
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* AI Portfolio */}
              <div className="p-6 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="text-2xl mb-3">🤖</div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  AI-Enhanced Portfolio
                </h3>
                <p className="text-sm text-slate-600 mb-3">
                  Full-stack platform with 6 AI-powered tools for recruiters and career development.
                </p>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">React</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Django</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">AI</span>
                </div>
              </div>

              {/* Microservices Platform */}
              <div className="p-6 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="text-2xl mb-3">🏗️</div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Microservices Platform
                </h3>
                <p className="text-sm text-slate-600 mb-3">
                  Scalable e-commerce architecture handling 1000+ concurrent users.
                </p>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">Python</span>
                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">Redis</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Docker</span>
                </div>
              </div>

              {/* Analytics Dashboard */}
              <div className="p-6 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="text-2xl mb-3">📊</div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Real-time Dashboard
                </h3>
                <p className="text-sm text-slate-600 mb-3">
                  Live data visualization with sub-second latency and interactive charts.
                </p>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded text-xs">React</span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">D3.js</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">WebSocket</span>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Skills */}
          <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
              🛠️ Technical Expertise
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Backend</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm">Python & Django</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm">REST APIs</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm">PostgreSQL</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Frontend</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm">React & TypeScript</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm">Modern CSS</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm">Responsive Design</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-3">AI/ML</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                    <span className="text-sm">Google Gemini AI</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                    <span className="text-sm">RAG Systems</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                    <span className="text-sm">NLP Processing</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-3">DevOps</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                    <span className="text-sm">Docker & CI/CD</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                    <span className="text-sm">Cloud Deployment</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                    <span className="text-sm">Performance Optimization</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Contact Bar */}
      <ContactBar jobDescription={jobDescription} />
      
      {/* Add bottom padding to account for sticky contact bar */}
      <div className="h-20"></div>
    </div>
  );
};

export default RecruiterLanding;
