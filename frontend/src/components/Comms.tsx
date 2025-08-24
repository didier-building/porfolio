import { useEffect, useState } from 'react';
import Meta from './Meta';
import useInView from '../hooks/useInView';
import { commsApi, MEDIA_BASE } from '../services/api';
import { fallbackComms } from '../data/commsData';

interface CommsDocument {
  id: number;
  title: string;
  file: string;
}

export default function Comms() {
  const [docs, setDocs] = useState<CommsDocument[]>([]);
  const { ref, inView } = useInView<HTMLDivElement>();

  useEffect(() => {
    if (!inView || docs.length) return;
    const controller = new AbortController();
    commsApi
      .list({ signal: controller.signal })
      .then((res) => setDocs(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        if (!controller.signal.aborted) {
          console.error('Failed to load documents', err);
          // Use fallback documents when API call fails
          setDocs(fallbackComms);
        }
      });
    return () => controller.abort();
  }, [inView, docs.length]);

  const resolveUrl = (path: string) =>
    path.startsWith('http') ? path : `${MEDIA_BASE}${path}`;

  return (
    <div
      ref={ref}
      aria-labelledby="docs-heading"
      className="p-8 max-w-3xl mx-auto"
    >
      <Meta title="Docs" description="Downloadable documents" />
      <h2 id="docs-heading" className="text-2xl font-bold mb-4">
        Documents
      </h2>
      <ul className="space-y-2">
        {docs.map((doc) => (
          <li key={doc.id}>
            <a
              href={resolveUrl(doc.file)}
              className="text-teal-600 underline"
              download
            >
              {doc.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
