import React, { useState } from 'react';
import { recruiterApi, FitAnalysisResult } from '../../services/recruiterApi';

interface JDFitAnalyzerProps {
  onAnalysisComplete?: (result: FitAnalysisResult) => void;
}

const JDFitAnalyzer: React.FC<JDFitAnalyzerProps> = ({ onAnalysisComplete }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<FitAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cached, setCached] = useState(false);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setError('Please paste a job description');
      return;
    }

    if (jobDescription.length < 50) {
      setError('Job description too short (minimum 50 characters)');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Track analytics
      await recruiterApi.trackEvent('JD_PASTED', {
        jd_length: jobDescription.length
      });

      const response = await recruiterApi.analyzeFit(jobDescription);
      
      setResult(response.data);
      setCached(response.cached);
      
      // Track successful analysis
      await recruiterApi.trackEvent('MATCH_GENERATED', {
        score: response.data.score,
        cache_hit: response.cached
      });

      onAnalysisComplete?.(response.data);

    } catch (err: any) {
      setError(err.message);
      
      if (err.message.includes('Rate limit')) {
        // Show book call CTA for rate limited users
        setError('You\'ve reached the hourly limit. Book a call to discuss your role directly.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-blue-600 bg-blue-50';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Partial Match';
    return 'Limited Match';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          🎯 Job Fit Analyzer
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Paste any job description to get an instant compatibility analysis with detailed insights and interview questions.
        </p>
      </div>

      {/* Job Description Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Job Description
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here..."
          rows={8}
          className="w-full p-4 border border-slate-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isAnalyzing}
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-slate-500">
            {jobDescription.length} characters
          </span>
          <span className="text-sm text-slate-500">
            Minimum 50 characters required
          </span>
        </div>
      </div>

      {/* Analyze Button */}
      <button
        onClick={handleAnalyze}
        disabled={isAnalyzing || jobDescription.length < 50}
        className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 transform-gpu disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isAnalyzing ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing Fit...
          </span>
        ) : (
          '🚀 Analyze Job Fit'
        )}
      </button>

      {/* Error Display */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
          {error.includes('Rate limit') && (
            <div className="mt-3">
              <a
                href="https://calendly.com/your-calendar"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                onClick={() => recruiterApi.trackEvent('BOOK_CALL_CLICKED', { source: 'rate_limit' })}
              >
                📅 Book a Call Instead
              </a>
            </div>
          )}
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div className="mt-8 space-y-6">
          {/* Cache indicator */}
          {cached && (
            <div className="flex items-center justify-center">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                ⚡ Instant result (cached)
              </span>
            </div>
          )}

          {/* Compatibility Score */}
          <div className="text-center">
            <div className={`inline-flex items-center px-6 py-3 rounded-full text-2xl font-bold ${getScoreColor(result.score)}`}>
              {result.score}% {getScoreLabel(result.score)}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-slate-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">📋 Executive Summary</h3>
            <p className="text-slate-700 leading-relaxed">{result.summary}</p>
          </div>

          {/* Matching Skills */}
          {result.matches.length > 0 && (
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-3">✅ Strong Matches</h3>
              <div className="flex flex-wrap gap-2">
                {result.matches.map((match, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm"
                  >
                    {match}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Gaps & Mitigations */}
          {result.gaps.length > 0 && (
            <div className="bg-yellow-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-3">⚠️ Gaps & Mitigations</h3>
              <ul className="space-y-2">
                {result.gaps.map((gap, index) => (
                  <li key={index} className="text-yellow-800">
                    • {gap}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Interview Questions */}
          {result.questions.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">❓ Suggested Interview Questions</h3>
              <ul className="space-y-2">
                {result.questions.map((question, index) => (
                  <li key={index} className="text-blue-800">
                    {index + 1}. {question}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Availability */}
          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-purple-900 mb-3">📅 Availability</h3>
            <p className="text-purple-800">{result.availability}</p>
          </div>

          {/* Fallback indicator */}
          {result.fallback && (
            <div className="text-center">
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                ⚡ AI service unavailable - using intelligent fallback
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JDFitAnalyzer;
