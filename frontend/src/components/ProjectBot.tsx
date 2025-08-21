import { useEffect, useState } from 'react';
import { aiApi, projectsApi } from '../services/api';

interface Project {
  id: number;
  title: string;
}

interface Message {
  role: 'user' | 'bot';
  content: string;
}

export default function ProjectBot() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selected, setSelected] = useState<Project | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    projectsApi
      .getAll()
      .then((res) => setProjects(res.data))
      .catch((err) => console.error('Failed to load projects', err));
  }, []);

  const sendMessage = async () => {
    if (!selected || !input) return;
    const userMsg: Message = { role: 'user', content: input };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    try {
        const res = await aiApi.projectExplainerChat({
          question: userMsg.content,
          project_ids: [selected.id],
        });
        const reply = res.data?.answer || 'No response available.';
        setMessages((m) => [...m, { role: 'bot', content: reply }]);
    } catch (err) {
      console.error(err);
      setMessages((m) => [...m, { role: 'bot', content: 'No response available.' }]);
    }
  };

  return (
    <section className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Project Explainer Bot</h1>
      <div className="flex flex-wrap gap-2 mb-4">
        {projects.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelected(p)}
            className={`px-3 py-1 rounded-full border ${selected?.id === p.id ? 'bg-teal-600 text-white' : ''}`}
          >
            {p.title}
          </button>
        ))}
      </div>

      <div className="border rounded-md p-4 h-64 overflow-y-auto mb-4">
        {messages.map((m, i) => (
          <div key={i} className={`mb-2 ${m.role === 'user' ? 'text-right' : ''}`}>
            <span className="inline-block px-2 py-1 rounded bg-slate-200">
              {m.content}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded-md p-2"
          placeholder="Ask about the project..."
        />
        <button
          onClick={sendMessage}
          disabled={!selected}
          className="px-4 py-2 bg-teal-600 text-white rounded-md disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </section>
  );
}
