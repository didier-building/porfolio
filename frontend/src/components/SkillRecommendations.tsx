import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface SkillGapAnalysis {
  success: boolean;
  target_role: string;
  skill_gaps: {
    missing_skills: string[];
    matching_skills: string[];
    skill_match_percentage: number;
  };
  learning_path: {
    immediate_priorities: string[];
    short_term_goals: string[];
    long_term_objectives: string[];
    learning_resources: Record<string, string[]>;
    project_ideas: Array<{
      name: string;
      description: string;
      skills_practiced: string;
    }>;
    certification_paths: Array<{
      name: string;
      provider: string;
      difficulty: string;
      estimated_time: string;
    }>;
  };
  priority_score: number;
  estimated_timeline: {
    immediate_phase: string;
    short_term_phase: string;
    long_term_phase: string;
    total_estimated: string;
  };
}

interface MarketTrends {
  trending_skills: string[];
  emerging_technologies: string[];
  high_demand_roles: string[];
  generated_at: string;
}

interface CareerRecommendations {
  next_roles: string[];
  leadership_track: string[];
  technical_track: string[];
  skills_to_develop: string[];
  generated_at: string;
}

const SkillRecommendations: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'gap-analysis' | 'market-trends' | 'career-path'>('gap-analysis');
  const [targetRole, setTargetRole] = useState('');
  const [skillGapAnalysis, setSkillGapAnalysis] = useState<SkillGapAnalysis | null>(null);
  const [marketTrends, setMarketTrends] = useState<MarketTrends | null>(null);
  const [careerRecommendations, setCareerRecommendations] = useState<CareerRecommendations | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'market-trends' && !marketTrends) {
      fetchMarketTrends();
    }
    if (activeTab === 'career-path' && !careerRecommendations) {
      fetchCareerRecommendations();
    }
  }, [activeTab]);

  const analyzeSkillGaps = async () => {
    if (!targetRole.trim()) {
      setError('Please enter a target role');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post<SkillGapAnalysis>('/ai/skill-gaps/', {
        target_role: targetRole
      });

      if (response.data && response.data.skill_gaps) {
        setSkillGapAnalysis(response.data);
        setError(null);
      } else {
        setError('Invalid response from skill analysis. Please try again.');
      }
    } catch (err: any) {
      console.error('Skill Gap Analysis Error:', err);

      if (err.response?.status === 404) {
        setError('Skill analysis service not found. Please contact support.');
      } else if (err.response?.status === 500) {
        setError('Server error during analysis. Please try again in a moment.');
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Skill gap analysis failed. Please try again or contact support if the issue persists.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMarketTrends = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<MarketTrends>('/ai/market-trends/');
      setMarketTrends(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch market trends.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCareerRecommendations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<CareerRecommendations>('/ai/career-recommendations/');
      setCareerRecommendations(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch career recommendations.');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 80) return 'text-red-600 bg-red-50';
    if (priority >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <section className="py-20 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            🎯 Skill Recommendations
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            AI-powered skill gap analysis, market trends, and personalized career development recommendations.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center mb-8">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-1 shadow-lg">
              <button
                onClick={() => setActiveTab('gap-analysis')}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                  activeTab === 'gap-analysis'
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                📊 Skill Gap Analysis
              </button>
              <button
                onClick={() => setActiveTab('market-trends')}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                  activeTab === 'market-trends'
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                📈 Market Trends
              </button>
              <button
                onClick={() => setActiveTab('career-path')}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                  activeTab === 'career-path'
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                🚀 Career Path
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Skill Gap Analysis Tab */}
          {activeTab === 'gap-analysis' && (
            <div className="space-y-8">
              {/* Input Section */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  Analyze Skills for Target Role
                </h3>
                
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="Enter target role (e.g., Senior Full-Stack Developer)"
                    className="flex-1 p-4 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    disabled={isLoading}
                  />
                  <button
                    onClick={analyzeSkillGaps}
                    disabled={isLoading || !targetRole.trim()}
                    className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 transform-gpu disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Analyzing...' : '🔍 Analyze'}
                  </button>
                </div>
              </div>

              {/* Results */}
              {skillGapAnalysis && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Skill Match Overview */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                      Skill Match Analysis
                    </h4>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 dark:text-slate-300">Match Percentage</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(skillGapAnalysis.skill_gaps.skill_match_percentage)}`}>
                          {skillGapAnalysis.skill_gaps.skill_match_percentage.toFixed(0)}%
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 dark:text-slate-300">Priority Score</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(skillGapAnalysis.priority_score)}`}>
                          {skillGapAnalysis.priority_score}/100
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 dark:text-slate-300">Estimated Timeline</span>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          {skillGapAnalysis.estimated_timeline.total_estimated}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      <div>
                        <h5 className="font-semibold text-green-600 mb-2">✅ Matching Skills</h5>
                        <div className="flex flex-wrap gap-2">
                          {skillGapAnalysis.skill_gaps.matching_skills.map((skill, index) => (
                            <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-red-600 mb-2">📚 Skills to Develop</h5>
                        <div className="flex flex-wrap gap-2">
                          {skillGapAnalysis.skill_gaps.missing_skills.map((skill, index) => (
                            <span key={index} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Learning Path */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                      Personalized Learning Path
                    </h4>
                    
                    <div className="space-y-6">
                      <div>
                        <h5 className="font-semibold text-blue-600 mb-3">🎯 Immediate Priorities</h5>
                        <ul className="space-y-2">
                          {skillGapAnalysis.learning_path.immediate_priorities.map((skill, index) => (
                            <li key={index} className="flex items-center text-slate-700 dark:text-slate-300">
                              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                              {skill}
                            </li>
                          ))}
                        </ul>
                        <p className="text-sm text-slate-500 mt-2">
                          Timeline: {skillGapAnalysis.estimated_timeline.immediate_phase}
                        </p>
                      </div>

                      <div>
                        <h5 className="font-semibold text-yellow-600 mb-3">📈 Short-term Goals</h5>
                        <ul className="space-y-2">
                          {skillGapAnalysis.learning_path.short_term_goals.map((skill, index) => (
                            <li key={index} className="flex items-center text-slate-700 dark:text-slate-300">
                              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                              {skill}
                            </li>
                          ))}
                        </ul>
                        <p className="text-sm text-slate-500 mt-2">
                          Timeline: {skillGapAnalysis.estimated_timeline.short_term_phase}
                        </p>
                      </div>

                      <div>
                        <h5 className="font-semibold text-purple-600 mb-3">🚀 Long-term Objectives</h5>
                        <ul className="space-y-2">
                          {skillGapAnalysis.learning_path.long_term_objectives.map((skill, index) => (
                            <li key={index} className="flex items-center text-slate-700 dark:text-slate-300">
                              <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                              {skill}
                            </li>
                          ))}
                        </ul>
                        <p className="text-sm text-slate-500 mt-2">
                          Timeline: {skillGapAnalysis.estimated_timeline.long_term_phase}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Market Trends Tab */}
          {activeTab === 'market-trends' && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                  <p className="text-slate-600 dark:text-slate-300">Loading market trends...</p>
                </div>
              ) : marketTrends ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div>
                    <h4 className="text-lg font-bold text-emerald-600 mb-4">🔥 Trending Skills</h4>
                    <div className="space-y-2">
                      {marketTrends.trending_skills.map((skill, index) => (
                        <div key={index} className="px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg">
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-blue-600 mb-4">🚀 Emerging Technologies</h4>
                    <div className="space-y-2">
                      {marketTrends.emerging_technologies.map((tech, index) => (
                        <div key={index} className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg">
                          {tech}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-purple-600 mb-4">💼 High Demand Roles</h4>
                    <div className="space-y-2">
                      {marketTrends.high_demand_roles.map((role, index) => (
                        <div key={index} className="px-3 py-2 bg-purple-50 text-purple-700 rounded-lg">
                          {role}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-600 dark:text-slate-300">No market trends data available.</p>
                </div>
              )}
            </div>
          )}

          {/* Career Path Tab */}
          {activeTab === 'career-path' && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                  <p className="text-slate-600 dark:text-slate-300">Generating career recommendations...</p>
                </div>
              ) : careerRecommendations ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-bold text-emerald-600 mb-4">🎯 Recommended Next Roles</h4>
                    <div className="space-y-3">
                      {careerRecommendations.next_roles.map((role, index) => (
                        <div key={index} className="p-4 bg-emerald-50 text-emerald-700 rounded-lg border-l-4 border-emerald-500">
                          {role}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-blue-600 mb-4">👥 Leadership Track</h4>
                    <div className="space-y-3">
                      {careerRecommendations.leadership_track.map((role, index) => (
                        <div key={index} className="p-4 bg-blue-50 text-blue-700 rounded-lg border-l-4 border-blue-500">
                          {role}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-purple-600 mb-4">🔧 Technical Track</h4>
                    <div className="space-y-3">
                      {careerRecommendations.technical_track.map((role, index) => (
                        <div key={index} className="p-4 bg-purple-50 text-purple-700 rounded-lg border-l-4 border-purple-500">
                          {role}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-orange-600 mb-4">📚 Skills to Develop</h4>
                    <div className="space-y-3">
                      {careerRecommendations.skills_to_develop.map((skill, index) => (
                        <div key={index} className="p-4 bg-orange-50 text-orange-700 rounded-lg border-l-4 border-orange-500">
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-600 dark:text-slate-300">No career recommendations available.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SkillRecommendations;
