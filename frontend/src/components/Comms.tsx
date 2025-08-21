import { useEffect, useState } from 'react';
import { commsApi, MEDIA_BASE } from '../services/api';

interface CommsDocument {
  id: number;
  title: string;
  file: string;
}

export default function Comms() {
  const [docs, setDocs] = useState<CommsDocument[]>([]);

  useEffect(() => {
    commsApi
      .list()
      .then((res) => setDocs(res.data))
      .catch((err) => console.error('Failed to load documents', err));
  }, []);

    const resolveUrl = (path: string) =>
      path.startsWith('http') ? path : `${MEDIA_BASE}${path}`;

  return (
    <section className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Documents</h1>
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
    </section>
  );
}
