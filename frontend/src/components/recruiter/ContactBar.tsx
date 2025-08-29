import React, { useState } from 'react';
import { recruiterApi } from '../../services/recruiterApi';

interface ContactBarProps {
  jobDescription?: string;
}

const ContactBar: React.FC<ContactBarProps> = ({ jobDescription }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleEmailClick = () => {
    recruiterApi.trackEvent('CONTACT_CLICKED', { method: 'email' });
    window.location.href = 'mailto:your.email@example.com?subject=Job Opportunity Discussion';
  };

  const handleLinkedInClick = () => {
    recruiterApi.trackEvent('CONTACT_CLICKED', { method: 'linkedin' });
    window.open('https://linkedin.com/in/yourprofile', '_blank');
  };

  const handleBookCallClick = () => {
    recruiterApi.trackEvent('BOOK_CALL_CLICKED', { source: 'contact_bar' });
    window.open('https://calendly.com/your-calendar', '_blank');
  };

  const handleDownloadCV = async () => {
    setIsDownloading(true);
    try {
      recruiterApi.trackEvent('RESUME_DOWNLOADED', { 
        source: 'contact_bar',
        has_jd: !!jobDescription 
      });

      const blob = await recruiterApi.downloadCV(jobDescription);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'CV_Tailored.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error: any) {
      console.error('CV download failed:', error);
      alert('CV download failed. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Contact info */}
          <div className="flex items-center space-x-6">
            <div className="hidden md:block">
              <h3 className="text-lg font-semibold text-slate-900">Ready to connect?</h3>
              <p className="text-sm text-slate-600">Available for immediate start</p>
            </div>
          </div>

          {/* Right side - Action buttons */}
          <div className="flex items-center space-x-3">
            {/* Email */}
            <button
              onClick={handleEmailClick}
              className="flex items-center px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
              title="Send Email"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="hidden sm:inline">Email</span>
            </button>

            {/* LinkedIn */}
            <button
              onClick={handleLinkedInClick}
              className="flex items-center px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
              title="LinkedIn Profile"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span className="hidden sm:inline">LinkedIn</span>
            </button>

            {/* Download CV */}
            <button
              onClick={handleDownloadCV}
              disabled={isDownloading}
              className="flex items-center px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors disabled:opacity-50"
              title="Download CV"
            >
              {isDownloading ? (
                <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
              <span className="hidden sm:inline">
                {isDownloading ? 'Generating...' : 'Download CV'}
              </span>
            </button>

            {/* Book Call - Primary CTA */}
            <button
              onClick={handleBookCallClick}
              className="flex items-center px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 transform-gpu"
              title="Book 15-min Call"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="hidden sm:inline">Book 15-min Call</span>
              <span className="sm:hidden">Call</span>
            </button>
          </div>
        </div>

        {/* Mobile-optimized layout */}
        <div className="md:hidden mt-3 text-center">
          <p className="text-sm text-slate-600">
            📍 Kigali, Rwanda • Available for immediate start
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactBar;
