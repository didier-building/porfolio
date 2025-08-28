import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface JournalEntry {
  id: number;
  title: string;
  content: string;
  category: string;
  tags: string[];
  mood: string;
  date_created: string;
  word_count: number;
  reading_time: number;
  sentiment_score: number;
  key_themes: string[];
  ai_insights: any;
}

interface JournalInsights {
  week_summary?: string;
  mood_patterns?: string;
  key_achievements?: string[];
  recommendations?: string[];
  career_progress?: string;
  skill_development?: string;
}

const AIJournal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'write' | 'entries' | 'insights' | 'goals'>('write');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [insights, setInsights] = useState<JournalInsights>({});
  const [prompts, setPrompts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New entry form state
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    category: 'reflection',
    mood: 'neutral',
    tags: [] as string[],
    is_private: true
  });

  useEffect(() => {
    if (activeTab === 'entries') {
      fetchEntries();
    } else if (activeTab === 'insights') {
      fetchInsights();
    }
  }, [activeTab]);

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchEntries = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/journal/entries/?days=30');
      setEntries(response.data.entries || []);
    } catch (err: any) {
      setError('Failed to fetch journal entries');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInsights = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/journal/insights/?type=weekly');
      setInsights(response.data.insights || {});
    } catch (err: any) {
      setError('Failed to fetch insights');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPrompts = async () => {
    try {
      const response = await api.get('/journal/prompts/');
      setPrompts(response.data.prompts || []);
    } catch (err: any) {
      console.error('Failed to fetch prompts:', err);
    }
  };

  const createEntry = async () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) {
      setError('Title and content are required');
      return;
    }

    if (newEntry.content.length < 10) {
      setError('Content too short. Please write at least 10 characters.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/journal/entries/', newEntry);
      
      if (response.data.success) {
        // Reset form
        setNewEntry({
          title: '',
          content: '',
          category: 'reflection',
          mood: 'neutral',
          tags: [],
          is_private: true
        });
        
        // Refresh entries if on entries tab
        if (activeTab === 'entries') {
          fetchEntries();
        }
        
        // Show success message
        setError(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create journal entry');
    } finally {
      setIsLoading(false);
    }
  };

  const usePrompt = (prompt: string) => {
    setNewEntry(prev => ({
      ...prev,
      content: prev.content + (prev.content ? '\n\n' : '') + prompt + '\n\n'
    }));
  };

  const getMoodColor = (mood: string) => {
    const colors = {
      excellent: 'text-green-600 bg-green-50',
      good: 'text-blue-600 bg-blue-50',
      neutral: 'text-gray-600 bg-gray-50',
      challenging: 'text-yellow-600 bg-yellow-50',
      difficult: 'text-red-600 bg-red-50'
    };
    return colors[mood as keyof typeof colors] || colors.neutral;
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      work: '💼',
      learning: '📚',
      project: '🚀',
      achievement: '🏆',
      reflection: '💭',
      goal: '🎯',
      challenge: '⚡',
      networking: '🤝',
      skill: '🛠️',
      idea: '💡'
    };
    return icons[category as keyof typeof icons] || '📝';
  };

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            📝 AI-Enhanced Journal
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Professional journaling with AI insights, mood tracking, and career development guidance.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center mb-8">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-1 shadow-lg">
              <button
                onClick={() => setActiveTab('write')}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                  activeTab === 'write'
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                ✍️ Write Entry
              </button>
              <button
                onClick={() => setActiveTab('entries')}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                  activeTab === 'entries'
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                📚 My Entries
              </button>
              <button
                onClick={() => setActiveTab('insights')}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                  activeTab === 'insights'
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                🧠 AI Insights
              </button>
              <button
                onClick={() => setActiveTab('goals')}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                  activeTab === 'goals'
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                🎯 Goals & Growth
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Write Entry Tab */}
          {activeTab === 'write' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Entry Form */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  Create New Entry
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={newEntry.title}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="What's on your mind today?"
                      className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Category
                      </label>
                      <select
                        value={newEntry.category}
                        onChange={(e) => setNewEntry(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                      >
                        <option value="reflection">💭 Personal Reflection</option>
                        <option value="work">💼 Work & Career</option>
                        <option value="learning">📚 Learning & Development</option>
                        <option value="project">🚀 Project Progress</option>
                        <option value="achievement">🏆 Achievements</option>
                        <option value="goal">🎯 Goals & Planning</option>
                        <option value="challenge">⚡ Challenges & Solutions</option>
                        <option value="networking">🤝 Networking</option>
                        <option value="skill">🛠️ Skill Development</option>
                        <option value="idea">💡 Ideas & Innovation</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Mood
                      </label>
                      <select
                        value={newEntry.mood}
                        onChange={(e) => setNewEntry(prev => ({ ...prev, mood: e.target.value }))}
                        className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                      >
                        <option value="excellent">😄 Excellent</option>
                        <option value="good">😊 Good</option>
                        <option value="neutral">😐 Neutral</option>
                        <option value="challenging">😕 Challenging</option>
                        <option value="difficult">😞 Difficult</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Content
                    </label>
                    <textarea
                      value={newEntry.content}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Write about your thoughts, experiences, learnings, or goals..."
                      rows={12}
                      className="w-full p-4 border border-slate-300 dark:border-slate-600 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-slate-500">
                        {newEntry.content.length} characters
                      </span>
                      <span className="text-sm text-slate-500">
                        ~{Math.max(1, Math.ceil(newEntry.content.split(' ').length / 200))} min read
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newEntry.is_private}
                        onChange={(e) => setNewEntry(prev => ({ ...prev, is_private: e.target.checked }))}
                        className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                        Keep private
                      </span>
                    </label>
                  </div>

                  <button
                    onClick={createEntry}
                    disabled={isLoading || !newEntry.title.trim() || !newEntry.content.trim()}
                    className="w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 transform-gpu disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Entry...
                      </span>
                    ) : (
                      '✨ Create Entry with AI Analysis'
                    )}
                  </button>
                </div>
              </div>

              {/* Prompts Sidebar */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  💡 Writing Prompts
                </h4>
                <div className="space-y-3">
                  {prompts.slice(0, 6).map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => usePrompt(prompt)}
                      className="w-full text-left p-3 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors text-sm"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Entries Tab */}
          {activeTab === 'entries' && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                My Journal Entries
              </h3>
              
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                  <p className="text-slate-600 dark:text-slate-300">Loading entries...</p>
                </div>
              ) : entries.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-600 dark:text-slate-300 mb-4">No journal entries yet.</p>
                  <button
                    onClick={() => setActiveTab('write')}
                    className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                  >
                    Write Your First Entry
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {entries.map((entry) => (
                    <div key={entry.id} className="border border-slate-200 dark:border-slate-600 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{getCategoryIcon(entry.category)}</span>
                          <div>
                            <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                              {entry.title}
                            </h4>
                            <div className="flex items-center space-x-4 text-sm text-slate-500">
                              <span>{new Date(entry.date_created).toLocaleDateString()}</span>
                              <span>{entry.word_count} words</span>
                              <span>{entry.reading_time} min read</span>
                            </div>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMoodColor(entry.mood)}`}>
                          {entry.mood}
                        </span>
                      </div>
                      
                      <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-3">
                        {entry.content}
                      </p>
                      
                      {entry.key_themes && entry.key_themes.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {entry.key_themes.map((theme, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs"
                            >
                              {theme}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Insights Tab */}
          {activeTab === 'insights' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  📊 Weekly Summary
                </h3>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-slate-600 dark:text-slate-300">
                      {insights.week_summary || 'No insights available yet. Start journaling to generate AI insights!'}
                    </p>
                    {insights.key_achievements && insights.key_achievements.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Key Achievements:</h4>
                        <ul className="space-y-1">
                          {insights.key_achievements.map((achievement, index) => (
                            <li key={index} className="text-slate-600 dark:text-slate-300 flex items-start">
                              <span className="text-green-500 mr-2">✓</span>
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  🎯 Recommendations
                </h3>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {insights.recommendations && insights.recommendations.length > 0 ? (
                      <ul className="space-y-3">
                        {insights.recommendations.map((rec, index) => (
                          <li key={index} className="text-slate-600 dark:text-slate-300 flex items-start">
                            <span className="text-blue-500 mr-2">→</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-slate-600 dark:text-slate-300">
                        Keep journaling to receive personalized AI recommendations!
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Goals Tab */}
          {activeTab === 'goals' && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                🎯 Goals & Growth Tracking
              </h3>
              <div className="text-center py-12">
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  Goal tracking and AI-powered growth recommendations coming soon!
                </p>
                <p className="text-sm text-slate-500">
                  Continue journaling to unlock personalized goal suggestions.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AIJournal;
