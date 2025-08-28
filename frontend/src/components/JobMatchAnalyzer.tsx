import React, { useState } from 'react';
import api from '../services/api';

interface JobAnalysisResult {
  compatibility_score: number;
  matching_skills: string[];
  missing_skills: string[];
  experience_match: string;
  education_match: string;
  overall_fit: string;
  recommendations: string[];
  summary: string;
  analyzed_at: string;
  profile_name: string;
  ai_powered: boolean;
}

const JobMatchAnalyzer: React.FC = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState<JobAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeJob = async () => {
    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    if (jobDescription.length < 50) {
      setError('Job description too short. Please provide more details.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/ai/job-match/', {
        job_description: jobDescription
      });

      setAnalysis(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getFitColor = (fit: string) => {
    switch (fit.toLowerCase()) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'fair': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-red-600 bg-red-50';
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            🎯 Job Match Analyzer
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            AI-powered job compatibility analysis for recruiters and employers. 
            Get instant insights on candidate fit and skill alignment.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Input Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Paste Job Description
            </h3>
            
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the complete job description here..."
              className="w-full h-64 p-4 border border-slate-300 dark:border-slate-600 rounded-lg resize-none focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              disabled={isLoading}
            />
            
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-slate-500">
                {jobDescription.length} characters (minimum 50 required)
              </span>
              
              <button
                onClick={analyzeJob}
                disabled={isLoading || jobDescription.length < 50}
                className="px-8 py-3 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 transform-gpu disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  '🔍 Analyze Job Match'
                )}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}
          </div>

          {/* Results Section */}
          {analysis && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Analysis Results
                </h3>
                <div className="flex items-center space-x-2">
                  {analysis.ai_powered && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      🤖 AI Powered
                    </span>
                  )}
                  <span className="text-sm text-slate-500">
                    for {analysis.profile_name}
                  </span>
                </div>
              </div>

              {/* Compatibility Score */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-slate-50 dark:bg-slate-700 rounded-xl">
                  <div className={`text-4xl font-bold ${getScoreColor(analysis.compatibility_score)} mb-2`}>
                    {analysis.compatibility_score}%
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">Compatibility Score</p>
                </div>
                
                <div className="text-center p-6 bg-slate-50 dark:bg-slate-700 rounded-xl">
                  <div className={`text-lg font-semibold px-3 py-1 rounded-full ${getFitColor(analysis.overall_fit)}`}>
                    {analysis.overall_fit}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mt-2">Overall Fit</p>
                </div>
                
                <div className="text-center p-6 bg-slate-50 dark:bg-slate-700 rounded-xl">
                  <div className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                    {analysis.experience_match}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">Experience Match</p>
                </div>
              </div>

              {/* Skills Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h4 className="text-lg font-semibold text-green-600 mb-3">✅ Matching Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.matching_skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-orange-600 mb-3">📚 Skills to Develop</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missing_skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">📋 Summary</h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {analysis.summary}
                </p>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">💡 Recommendations</h4>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-teal-500 mr-2">•</span>
                      <span className="text-slate-600 dark:text-slate-300">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-600">
                <p className="text-sm text-slate-500 text-center">
                  Analysis completed on {new Date(analysis.analyzed_at).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default JobMatchAnalyzer;
