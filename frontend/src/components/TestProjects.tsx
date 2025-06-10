import { useState, useEffect } from 'react';
import axios from 'axios';

export default function TestProjects() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Use a direct URL to avoid any issues with environment variables
        const response = await axios.get('http://localhost:8000/api/projects/');
        console.log('Direct API response:', response.data);
        setData(response.data);
        setError(null);
      } catch (err: any) {
        console.error('Error in test component:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">API Test</h2>
      
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      
      {data && (
        <div>
          <h3 className="text-xl mb-2">Raw API Response:</h3>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(data, null, 2)}
          </pre>
          
          <h3 className="text-xl mt-6 mb-2">Projects:</h3>
          <div className="grid gap-4">
            {(data.results || data).map((project: any) => (
              <div key={project.id} className="border p-4 rounded">
                <h4 className="font-bold">{project.title}</h4>
                <p>{project.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}