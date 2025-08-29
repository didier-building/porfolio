import React, { useState } from 'react';
import { analytics } from '../services/analytics';

interface CaseStudyProps {
  title: string;
  problem: string;
  approach: string;
  results: string[];
  metrics: string[];
  demoUrl?: string;
  technologies: string[];
  image?: string;
}

const CaseStudy: React.FC<CaseStudyProps> = ({
  title,
  problem,
  approach,
  results,
  metrics,
  demoUrl,
  technologies,
  image
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      analytics.trackPageView(`case-study-${title.toLowerCase().replace(/\s+/g, '-')}`);
    }
  };

  const handleDemoPlay = () => {
    setIsVideoPlaying(true);
    analytics.trackDemoPlay(title);
    
    if (demoUrl) {
      window.open(demoUrl, '_blank');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">{title}</h3>
          <button
            onClick={handleExpand}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            {isExpanded ? 'Show Less' : 'View Case Study'}
          </button>
        </div>
        
        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mt-3">
          {technologies.map((tech, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* Problem */}
          <div>
            <h4 className="text-lg font-semibold text-slate-900 mb-2 flex items-center">
              🎯 Problem
            </h4>
            <p className="text-slate-700">{problem}</p>
          </div>

          {/* Approach */}
          <div>
            <h4 className="text-lg font-semibold text-slate-900 mb-2 flex items-center">
              🛠️ Approach
            </h4>
            <p className="text-slate-700">{approach}</p>
          </div>

          {/* Results */}
          <div>
            <h4 className="text-lg font-semibold text-slate-900 mb-2 flex items-center">
              ✅ Results
            </h4>
            <ul className="space-y-2">
              {results.map((result, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span className="text-slate-700">{result}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Metrics */}
          {metrics.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                📊 Key Metrics
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {metrics.map((metric, index) => (
                  <div
                    key={index}
                    className="bg-green-50 border border-green-200 rounded-lg p-3 text-center"
                  >
                    <span className="text-green-700 font-semibold">{metric}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Demo Video */}
          {demoUrl && (
            <div>
              <h4 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                🎥 Demo (≤90s)
              </h4>
              <button
                onClick={handleDemoPlay}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all duration-200 hover:scale-105 transform-gpu"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Watch Demo
              </button>
            </div>
          )}

          {/* Schema.org structured data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "CreativeWork",
                "name": title,
                "description": problem,
                "creator": {
                  "@type": "Person",
                  "name": "Full-Stack Developer"
                },
                "keywords": technologies.join(", "),
                "dateCreated": new Date().toISOString()
              })
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CaseStudy;
