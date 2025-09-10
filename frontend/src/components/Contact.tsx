import React, { useState } from 'react';
import { Mail, Send, Github, Twitter } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    website: '',
  });
  const apiUrl = import.meta.env.VITE_API_URL;
  
  const [formStatus, setFormStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({
    type: null,
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({
        type: 'error',
        message: 'Please fill in all fields'
      });
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormStatus({
        type: 'error',
        message: 'Please enter a valid email address'
      });
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/contact/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setFormStatus({
          type: 'success',
          message: 'Message sent successfully! I\'ll get back to you soon.'
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          message: '',
          website: '',
        });
      } else {
        const errorData = await response.json();
        setFormStatus({
          type: 'error',
          message: errorData.message || 'Something went wrong. Please try again.'
        });
      }
    } catch {
      setFormStatus({
        type: 'error',
        message: 'Network error. Please check your connection and try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-100 to-purple-100 dark:from-primary-900/30 dark:to-purple-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium mb-6 shadow-sm backdrop-blur-sm border border-primary-200/50 dark:border-primary-700/30">
            <Mail size={16} />
            <span>Let's Connect</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 font-display">
            <span className="text-gradient-teal">Get In</span> Touch
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Have a project in mind or want to discuss a potential opportunity? I'd love to hear from you!
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="glass-card glass-card-hover">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 font-display">Send Me a Message</h3>
              
              {formStatus.type && (
                <div className={`mb-6 p-4 rounded-lg ${
                  formStatus.type === 'success' 
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' 
                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                }`}>
                  {formStatus.message}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input peer"
                      placeholder=" "
                    />
                    <label htmlFor="name" className="form-floating-label peer-focus:focused peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4">
                      Your Name
                    </label>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input peer"
                      placeholder=" "
                    />
                    <label htmlFor="email" className="form-floating-label peer-focus:focused peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4">
                      Email Address
                    </label>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="relative">
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="form-input peer resize-none"
                      placeholder=" "
                    ></textarea>
                    <label htmlFor="message" className="form-floating-label peer-focus:focused peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4">
                      Message
                    </label>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center justify-center w-full"
                >
                  <Send size={18} className="mr-2" />
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
                </form>
              </div>
            </div>
          
          <div className="space-y-8">
            <div className="glass-card glass-card-hover p-8">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 font-display">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-teal-100 to-primary-100 dark:from-teal-900/30 dark:to-primary-900/30 text-teal-600 dark:text-teal-400">
                    <Mail size={24} />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Email</h4>
                    <a href="mailto:didier53053@gmail.com" className="text-teal-600 dark:text-teal-400 hover:underline transition-colors">didier53053@gmail.com</a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass-card glass-card-hover p-8">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 font-display">Follow Me</h3>
              
              <div className="flex flex-wrap gap-4">
                <a 
                  href="https://github.com/didier-building" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-100/80 dark:bg-slate-800/50 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50"
                >
                  <Github size={24} />
                </a>
                <a 
                  href="https://x.com/didier53053" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-100/80 dark:bg-slate-800/50 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50"
                >
                  <Twitter size={24} />
                </a>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-primary-600 via-purple-600 to-teal-600 rounded-xl p-8 text-white shadow-xl">
              <h3 className="text-2xl font-bold mb-4 font-display">Let's Work Together!</h3>
              <p className="mb-6 opacity-90">
                I'm currently available for freelance work and open to discussing new opportunities.
              </p>
              <a 
                href="#contact" 
                className="inline-block px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-medium rounded-lg hover:bg-white/30 transition-all duration-300 border border-white/30 hover:scale-105 transform"
              >
                Hire Me
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(Contact);
