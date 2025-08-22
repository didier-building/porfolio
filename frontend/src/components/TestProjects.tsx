import { useState, useEffect } from 'react';
import { projectsApi } from '../services/api';

export default function TestProjects() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isDev = import.meta.env.DEV;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await projectsApi.getAll();
        if (isDev) {
          console.log('Projects API response:', response.data);
        }
        setData(response.data);
        setError(null);
      } catch (err: unknown) {
        if (isDev) {
          console.error('Error loading projects:', err);
        }
        setError('Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isDev]);

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