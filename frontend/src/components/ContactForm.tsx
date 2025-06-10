import { useState, FormEvent } from 'react';
import { contactApi } from '../services/api';

interface ContactFormProps {
  className?: string;
}

export default function ContactForm({ className }: ContactFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !message) {
      setErrorMessage('Please fill out all fields');
      return;
    }
    
    try {
      setStatus('submitting');
      await contactApi.submit({ name, email, message });
      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error('Contact form submission failed:', error);
      setStatus('error');
      setErrorMessage('Failed to send message. Please try again later.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          disabled={status === 'submitting'}
          required
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          disabled={status === 'submitting'}
          required
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="message" className="block text-sm font-medium mb-1">
          Message
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          className="w-full px-3 py-2 border rounded-md"
          disabled={status === 'submitting'}
          required
        />
      </div>
      
      {status === 'error' && (
        <div className="mb-4 text-red-500">{errorMessage}</div>
      )}
      
      {status === 'success' && (
        <div className="mb-4 text-green-500">Message sent successfully!</div>
      )}
      
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {status === 'submitting' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}