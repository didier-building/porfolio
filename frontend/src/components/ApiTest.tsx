import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ApiTest: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [endpoint, setEndpoint] = useState('/projects/');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      if (import.meta.env.DEV) {
        console.log(`Testing API: ${apiUrl}${endpoint}`);
      }

      const response = await axios.get(`${apiUrl}${endpoint}`);
      if (import.meta.env.DEV) {
        console.log('API Response:', response);
      }
      setData(response.data);
    } catch (err: any) {
      console.error('API Test Error:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">API Test Tool</h1>
      
      <div className="mb-4">
        <label className="block mb-2">Endpoint:</label>
        <div className="flex">
          <input
            type="text"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            className="flex-1 p-2 border rounded-l"
          />
          <button 
            onClick={fetchData}
            className="bg-blue-500 text-white px-4 py-2 rounded-r"
          >
            Test
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">API URL</h2>
        <div className="bg-gray-100 p-3 rounded">
          {import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}
        </div>
      </div>
      
      {loading && <p>Loading...</p>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      {data && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Response</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ApiTest;