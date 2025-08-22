import { useEffect, useRef, useState } from 'react';
import Meta from './Meta';
import useInView from '../hooks/useInView';
import { aiApi } from '../services/api';

interface JobMatchResult {
  match_score: number;
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
  const { ref, inView } = useInView<HTMLDivElement>();
  const [open, setOpen] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);

  const analyze = async () => {
    setLoading(true);
    const controller = new AbortController();
    controllerRef.current = controller;
    try {
      const res = await aiApi.jobMatchAnalyze(
        { job_description: text },
        { signal: controller.signal },
      );
      setResult(res.data);
    } catch (err) {
      if (!controller.signal.aborted) {
        console.error(err);
        setResult({
          match_score: 0,
          rationale: 'No analysis available.',
          strengths: [],
          gaps: [],
          pitch: '',
          keywords: [],
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => () => controllerRef.current?.abort(), []);

  return (
    <div
      ref={ref}
      aria-labelledby="job-match-heading"
      className="p-8 max-w-3xl mx-auto"
    >
      <Meta title="Job Match" description="Analyze job descriptions" />
      <details onToggle={(e) => setOpen(e.currentTarget.open)}>
        <summary id="job-match-heading" className="text-2xl font-bold mb-4">
          Job Match Analyzer
        </summary>
        {inView && open && (
          <>
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
                  <strong>Score:</strong> {result.match_score}
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
          </>
        )}
      </details>
    </div>
  );
}
