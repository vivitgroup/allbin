'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Sparkles, ChevronDown } from 'lucide-react';
import { QUICK_REPLIES } from '@/lib/chatKnowledge';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const WELCOME: Message = {
  role: 'assistant',
  content: '👋 أهلاً! أنا **سدى** — مستشارتك الذكية للأقمشة في بن صديق.\n\nيسعدني مساعدتك في اختيار القماش، حساب الكميات، الألوان المناسبة، ونصائح المناسبات! ✂️',
  timestamp: new Date(),
};

export default function ChatWidget() {
  const [open,     setOpen]     = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input,    setInput]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [unread,   setUnread]   = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open) { setUnread(0); inputRef.current?.focus(); }
  }, [open]);

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: 'user', content: trimmed, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = [...messages, userMsg]
        .slice(-10) // last 10 for context window
        .map(({ role, content }) => ({ role, content }));

      const res = await fetch('/api/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ messages: history }),
      });

      const data = await res.json();
      const reply: Message = {
        role:      'assistant',
        content:   data.reply || 'عذراً، حاولي مرة أخرى.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, reply]);
      if (!open) setUnread((n) => n + 1);

    } catch {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: 'عذراً، حدث خطأ مؤقت. حاولي مرة أخرى أو تواصلي معنا عبر واتساب! 📱',
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  }, [messages, loading, open]);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); send(input); };

  // Format message with basic markdown (bold, newlines)
  const formatMsg = (text: string) =>
    text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');

  return (
    <>
      {/* ── Floating Button ── */}
      <div className="fixed bottom-20 left-4 lg:bottom-6 lg:left-6 z-50">
        <button
          onClick={() => setOpen((o) => !o)}
          className="relative w-14 h-14 rounded-full text-white shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95 animate-glow"
          style={{ background: 'var(--bs-grad)' }}
          aria-label="فتح المساعد الذكي"
        >
          {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
          {unread > 0 && !open && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-bounce">
              {unread}
            </span>
          )}
        </button>
      </div>

      {/* ── Chat Window ── */}
      {open && (
        <div
          className="fixed bottom-36 left-4 lg:bottom-24 lg:left-6 z-50 w-[calc(100vw-2rem)] max-w-sm animate-float-up"
          style={{ maxHeight: '75vh' }}
        >
          <div className="card flex flex-col overflow-hidden shadow-2xl" style={{ height: '520px', maxHeight: '75vh' }}>

            {/* Header */}
            <div
              className="flex items-center gap-3 px-4 py-3.5 flex-shrink-0"
              style={{ background: 'var(--bs-grad)' }}
            >
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">✂️</div>
              <div className="flex-1">
                <div className="font-black text-white text-sm flex items-center gap-1.5">
                  سدى
                  <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                    <Sparkles className="w-2.5 h-2.5" /> AI
                  </span>
                </div>
                <div className="text-white/70 text-xs">مستشارة الأقمشة الذكية</div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-white/60 text-xs">متاحة</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white transition-colors mr-1">
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3" style={{ background: 'var(--bs-pearl)' }}>
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full flex-shrink-0 ml-2 flex items-center justify-center text-sm" style={{ background: 'var(--bs-grad)' }}>
                      ✂️
                    </div>
                  )}
                  <div
                    className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed animate-bubble ${
                      msg.role === 'user'
                        ? 'rounded-br-sm text-white'
                        : 'rounded-bl-sm text-gray-800 shadow-sm'
                    }`}
                    style={{
                      background: msg.role === 'user' ? 'var(--bs-grad)' : 'white',
                      
                    }}
                    dangerouslySetInnerHTML={{ __html: formatMsg(msg.content) }}
                  />
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-gray-200 flex-shrink-0 mr-2 flex items-center justify-center text-sm">👤</div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex justify-end items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex-shrink-0 ml-2 flex items-center justify-center text-sm" style={{ background: 'var(--bs-grad)' }}>✂️</div>
                  <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-typing-1" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-typing-2" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-typing-3" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick Replies */}
            {messages.length <= 2 && (
              <div className="px-3 py-2 border-t flex gap-1.5 overflow-x-auto flex-shrink-0" style={{ borderColor: 'rgba(184,184,184,0.2)', background: 'white' }}>
                {QUICK_REPLIES.slice(0, 4).map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full border font-medium transition-all hover:opacity-80"
                    style={{ borderColor: 'var(--bs-vivid)', color: 'var(--bs-deep)', background: 'rgba(212,30,47,0.05)' }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="flex items-center gap-2 px-3 py-3 border-t bg-white flex-shrink-0" style={{ borderColor: 'rgba(184,184,184,0.2)' }}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="اسألي سدى عن الأقمشة..."
                disabled={loading}
                maxLength={300}
                className="flex-1 text-sm outline-none bg-transparent placeholder-gray-400 font-cairo"
                style={{ color: 'var(--bs-dark)' }}
                dir="rtl"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
                style={{ background: 'var(--bs-grad)', flexShrink: 0 }}
              >
                <Send className="w-4 h-4" style={{ transform: 'scaleX(-1)' }} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}


// Enhanced conversational AI flow for fashion recommendations and upselling.
