import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface CareerInsightsData {
  career_stage: string;
  strengths: string[];
  growth_areas: string[];
  market_position: string;
  next_steps: string[];
  industry_trends: string[];
  salary_range: string;
  generated_at: string;
  profile_name: string;
  ai_powered: boolean;
}

const CareerInsights: React.FC = () => {
  const [insights, setInsights] = useState<CareerInsightsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<CareerInsightsData>('/ai/career-insights/');
      setInsights(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate insights. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const getStageColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'expert': return 'text-purple-600 bg-purple-50';
      case 'senior': return 'text-blue-600 bg-blue-50';
      case 'mid-level': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPositionColor = (position: string) => {
    switch (position.toLowerCase()) {
      case 'strong': return 'text-green-600 bg-green-50';
      case 'competitive': return 'text-blue-600 bg-blue-50';
      case 'developing': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="inline-flex items-center px-6 py-3 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
              <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-lg font-medium text-slate-700 dark:text-slate-300">
                Generating AI Career Insights...
              </span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchInsights}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!insights) return null;

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            📊 Career Insights
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            AI-powered career analysis and professional development recommendations 
            based on current market trends and skill assessment.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Header with AI Badge */}
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Professional Analysis for {insights.profile_name}
            </h3>
            <div className="flex items-center space-x-3">
              {insights.ai_powered && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  🤖 AI Generated
                </span>
              )}
              <button
                onClick={fetchInsights}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all duration-200 hover:scale-105 transform-gpu"
              >
                🔄 Refresh
              </button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 text-center">
              <div className={`inline-block px-4 py-2 rounded-full text-lg font-semibold ${getStageColor(insights.career_stage)}`}>
                {insights.career_stage}
              </div>
              <p className="text-slate-600 dark:text-slate-300 mt-2">Career Stage</p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 text-center">
              <div className={`inline-block px-4 py-2 rounded-full text-lg font-semibold ${getPositionColor(insights.market_position)}`}>
                {insights.market_position}
              </div>
              <p className="text-slate-600 dark:text-slate-300 mt-2">Market Position</p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 text-center">
              <div className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                {insights.salary_range}
              </div>
              <p className="text-slate-600 dark:text-slate-300 mt-2">Salary Range</p>
            </div>
          </div>

          {/* Detailed Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Strengths */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
              <h4 className="text-xl font-bold text-green-600 mb-6 flex items-center">
                <span className="mr-2">💪</span>
                Key Strengths
              </h4>
              <ul className="space-y-3">
                {insights.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-3 mt-1">✓</span>
                    <span className="text-slate-700 dark:text-slate-300">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Growth Areas */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
              <h4 className="text-xl font-bold text-orange-600 mb-6 flex items-center">
                <span className="mr-2">🎯</span>
                Growth Areas
              </h4>
              <ul className="space-y-3">
                {insights.growth_areas.map((area, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-orange-500 mr-3 mt-1">→</span>
                    <span className="text-slate-700 dark:text-slate-300">{area}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Next Steps */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
              <h4 className="text-xl font-bold text-blue-600 mb-6 flex items-center">
                <span className="mr-2">🚀</span>
                Recommended Next Steps
              </h4>
              <ul className="space-y-3">
                {insights.next_steps.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 mr-3 mt-1">{index + 1}.</span>
                    <span className="text-slate-700 dark:text-slate-300">{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Industry Trends */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
              <h4 className="text-xl font-bold text-purple-600 mb-6 flex items-center">
                <span className="mr-2">📈</span>
                Industry Trends
              </h4>
              <ul className="space-y-3">
                {insights.industry_trends.map((trend, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-purple-500 mr-3 mt-1">•</span>
                    <span className="text-slate-700 dark:text-slate-300">{trend}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 inline-block">
              <p className="text-sm text-slate-500">
                Analysis generated on {new Date(insights.generated_at).toLocaleString()}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Insights are based on current market data and professional profile analysis
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareerInsights;
