import { useState } from 'react';
import { aiApi } from '../services/api';

interface JobMatchResult {
  score: number;
  rationale: string;
  strengths: string[];
  gaps: string[];
  pitch: string;
  keywords: string[];
}

export default function JobMatch() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<JobMatchResult | null>(null);

  const analyze = async () => {
    setLoading(true);
    try {
      const res = await aiApi.jobMatchAnalyze({ text });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setResult({
        score: 0,
        rationale: 'No analysis available.',
        strengths: [],
        gaps: [],
        pitch: '',
        keywords: [],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Job Match Analyzer</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        className="w-full border rounded-md p-2 mb-4"
      />
      <button
        onClick={analyze}
        disabled={loading}
        className="px-4 py-2 bg-teal-600 text-white rounded-md disabled:opacity-50"
      >
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>

      {result && (
        <div className="mt-6 space-y-4">
          <div>
            <strong>Score:</strong> {result.score}
          </div>
          <div>
            <strong>Rationale:</strong> {result.rationale}
          </div>
          {result.strengths.length > 0 && (
            <div>
              <strong>Strengths:</strong>
              <ul className="list-disc list-inside">
                {result.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
          {result.gaps.length > 0 && (
            <div>
              <strong>Gaps:</strong>
              <ul className="list-disc list-inside">
                {result.gaps.map((g, i) => (
                  <li key={i}>{g}</li>
                ))}
              </ul>
            </div>
          )}
          {result.pitch && (
            <div>
              <strong>Pitch:</strong> {result.pitch}
            </div>
          )}
          {result.keywords.length > 0 && (
            <div>
              <strong>Keywords:</strong> {result.keywords.join(', ')}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
