import { useEffect, useState } from 'react';
import type { Session } from '../store/session.store';
import type { Analysis } from '../store/analysis.store';
import { useChatStore } from '../store/chat.store';
import DOMPurify from 'dompurify';

const safeHTML = (html: string) => {
  return DOMPurify.sanitize(html);
};

export function ChatModal({
  onClose,
  session,
}: {
  onClose: () => void;
  session: Session | null;
  analysis?: Analysis;
}) {
  const { messages, fetchChatHistory, sendMessage, clearChatHistory } =
    useChatStore();

  const [isChatLoading, setIsChatLoading] = useState(false);
  useEffect(() => {
    if (!session || !session._id) return;
    const loadChatHistory = async () => {
      try {
        clearChatHistory();
        setIsChatLoading(true);
        await fetchChatHistory(session._id);
      } finally {
        setIsChatLoading(false);
      }
    };
    loadChatHistory();
  }, [session, session?._id]);

  const [input, setInput] = useState('');
  async function send() {
    if (!input.trim()) return;
    const text = input.trim();
    if (session && session._id) {
      setInput('');
      await sendMessage(session._id, text);
    }
  }
  if (isChatLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center">
        {/* Background */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Modal */}
        <div className="relative w-full max-w-2xl bg-white rounded-t-lg lg:rounded-lg shadow-lg overflow-hidden ">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div>
              <div className="h-4 w-40 bg-slate-200 rounded mb-2"></div>
              <div className="h-3 w-24 bg-slate-200 rounded"></div>
            </div>
            <div className="h-8 w-16 bg-slate-200 rounded-md"></div>
          </div>

          {/* Messages */}
          <div className="p-4 space-y-3 max-h-[60vh] overflow-auto">
            {/* Assistant bubble */}
            <div className="flex justify-start">
              <div className="w-[70%] h-10 bg-slate-200 rounded-md"></div>
            </div>

            {/* User bubble */}
            <div className="flex justify-end">
              <div className="w-[60%] h-10 bg-slate-300 rounded-md"></div>
            </div>

            {/* Assistant bubble */}
            <div className="flex justify-start">
              <div className="w-[80%] h-14 bg-slate-200 rounded-md"></div>
            </div>

            {/* User bubble */}
            <div className="flex justify-end">
              <div className="w-[50%] h-10 bg-slate-300 rounded-md"></div>
            </div>

            {/* Assistant bubble */}
            <div className="flex justify-start">
              <div className="w-[65%] h-12 bg-slate-200 rounded-md"></div>
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t flex gap-2">
            <div className="flex-1 h-10 bg-slate-200 rounded-md"></div>
            <div className="w-20 h-10 bg-slate-200 rounded-md"></div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-t-lg lg:rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <div className="font-semibold">Chat — {session?.title}</div>
            <div className="text-xs text-slate-500">{session?._id}</div>
          </div>
          <div>
            <button
              onClick={onClose}
              className="px-3 py-1 rounded-md text-sm bg-slate-100 hover:bg-slate-200"
            >
              Close
            </button>
          </div>
        </div>
        <div className="p-4 space-y-3 max-h-[60vh] overflow-auto">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.from === 'assistant' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[80%] px-3 py-2 rounded-md text-sm ${
                  m.from === 'assistant'
                    ? 'bg-slate-100 text-slate-800'
                    : 'bg-orange-500 text-white'
                }`}
                dangerouslySetInnerHTML={{ __html: safeHTML(m.text) }}
              />
            </div>
          ))}
        </div>
        <div className="p-4 border-t flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') send();
            }}
            placeholder="Ask about the analysis, propose fixes..."
            className="flex-1 border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-200"
          />
          <button
            onClick={send}
            className="px-4 py-2  text-white rounded-md bg-orange-500 text-white hover:brightness-105 disabled:opacity-60"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
