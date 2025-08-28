import React, { useState } from 'react';
import api from '../services/api';

interface CVData {
  personal_info: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    portfolio: string;
  };
  professional_summary: string;
  key_skills: string[];
  experience: Array<{
    position: string;
    company: string;
    duration: string;
    location: string;
    description: string;
    achievements: string[];
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    duration: string;
    role: string;
    achievements: string[];
  }>;
  education: any[];
  certifications: any[];
  ats_keywords: string[];
  customization_score: number;
}

interface CVGenerationResult {
  success: boolean;
  cv_data: CVData;
  job_analysis: any;
  customization_notes: string[];
  generated_at: string;
  format: string;
  error?: string;
}

const CVGenerator: React.FC = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [cvFormat, setCvFormat] = useState('professional');
  const [cvResult, setCvResult] = useState<CVGenerationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateCV = async () => {
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
      const response = await api.post<CVGenerationResult>('/ai/cv-generator/', {
        job_description: jobDescription,
        format: cvFormat
      });

      if (response.data && response.data.cv_data) {
        setCvResult(response.data);
        setError(null);
      } else {
        setError('Invalid response from CV generator. Please try again.');
      }
    } catch (err: any) {
      console.error('CV Generation Error:', err);

      if (err.response?.status === 404) {
        setError('CV generation service not found. Please contact support.');
      } else if (err.response?.status === 500) {
        setError('Server error during CV generation. Please try again in a moment.');
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.code === 'NETWORK_ERROR') {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('CV generation failed. Please try again or contact support if the issue persists.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const downloadCV = (format: 'pdf' | 'docx') => {
    // This would integrate with a PDF/DOCX generation service
    console.log(`Downloading CV as ${format}`);
    // Implementation would generate and download the file
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            🎯 AI CV Generator
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Generate customized CVs tailored to specific job descriptions. 
            AI-powered optimization for maximum impact and ATS compatibility.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Input Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Job Description Input */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Job Description
              </h3>
              
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the complete job description here..."
                className="w-full h-64 p-4 border border-slate-300 dark:border-slate-600 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                disabled={isLoading}
              />
              
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-slate-500">
                  {jobDescription.length} characters (minimum 50 required)
                </span>
              </div>
            </div>

            {/* CV Format Selection */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                CV Format & Options
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    CV Format
                  </label>
                  <select
                    value={cvFormat}
                    onChange={(e) => setCvFormat(e.target.value)}
                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    disabled={isLoading}
                  >
                    <option value="professional">Professional</option>
                    <option value="modern">Modern</option>
                    <option value="creative">Creative</option>
                    <option value="ats-optimized">ATS Optimized</option>
                  </select>
                </div>

                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                    Format Features:
                  </h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                    {cvFormat === 'professional' && (
                      <>
                        <li>• Clean, traditional layout</li>
                        <li>• Conservative design</li>
                        <li>• Corporate-friendly</li>
                      </>
                    )}
                    {cvFormat === 'modern' && (
                      <>
                        <li>• Contemporary design</li>
                        <li>• Visual elements</li>
                        <li>• Tech industry focused</li>
                      </>
                    )}
                    {cvFormat === 'creative' && (
                      <>
                        <li>• Unique visual design</li>
                        <li>• Creative industries</li>
                        <li>• Portfolio integration</li>
                      </>
                    )}
                    {cvFormat === 'ats-optimized' && (
                      <>
                        <li>• ATS-friendly format</li>
                        <li>• Keyword optimized</li>
                        <li>• Maximum compatibility</li>
                      </>
                    )}
                  </ul>
                </div>

                <button
                  onClick={generateCV}
                  disabled={isLoading || jobDescription.length < 50}
                  className="w-full px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 transform-gpu disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating CV...
                    </span>
                  ) : (
                    '🚀 Generate Custom CV'
                  )}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* CV Results */}
          {cvResult && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Generated CV
                </h3>
                <div className="flex items-center space-x-4">
                  <div className={`px-4 py-2 rounded-full text-sm font-medium ${getScoreColor(cvResult.cv_data.customization_score)}`}>
                    {cvResult.cv_data.customization_score}% Match
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => downloadCV('pdf')}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      📄 PDF
                    </button>
                    <button
                      onClick={() => downloadCV('docx')}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      📝 DOCX
                    </button>
                  </div>
                </div>
              </div>

              {/* CV Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Personal Info & Summary */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Header */}
                  <div className="border-b border-slate-200 dark:border-slate-600 pb-4">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                      {cvResult.cv_data.personal_info.name}
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-300">
                      {cvResult.cv_data.personal_info.title}
                    </p>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">
                      <span>{cvResult.cv_data.personal_info.email}</span>
                      <span>{cvResult.cv_data.personal_info.phone}</span>
                      <span>{cvResult.cv_data.personal_info.location}</span>
                    </div>
                  </div>

                  {/* Professional Summary */}
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                      Professional Summary
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {cvResult.cv_data.professional_summary}
                    </p>
                  </div>

                  {/* Experience */}
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                      Professional Experience
                    </h2>
                    <div className="space-y-4">
                      {cvResult.cv_data.experience.map((exp, index) => (
                        <div key={index} className="border-l-2 border-indigo-500 pl-4">
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {exp.position}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-300">
                            {exp.company} • {exp.duration}
                          </p>
                          <p className="text-sm text-slate-500 mt-1">
                            {exp.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Key Skills */}
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                      Key Skills
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {cvResult.cv_data.key_skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Customization Notes */}
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                      AI Customizations
                    </h2>
                    <ul className="space-y-2">
                      {cvResult.customization_notes.map((note, index) => (
                        <li key={index} className="text-sm text-slate-600 dark:text-slate-300 flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* ATS Keywords */}
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                      ATS Keywords
                    </h2>
                    <div className="flex flex-wrap gap-1">
                      {cvResult.cv_data.ats_keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-600">
                <p className="text-sm text-slate-500 text-center">
                  CV generated on {new Date(cvResult.generated_at).toLocaleString()} • Format: {cvResult.format}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CVGenerator;
