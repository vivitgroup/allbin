'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Sparkles, RotateCcw } from 'lucide-react';
import { QUICK_REPLIES } from '@/lib/chatKnowledge';
import Link from 'next/link';

interface Message { role: 'user' | 'assistant'; content: string; timestamp: Date; }

const WELCOME: Message = {
  role: 'assistant',
  content: '👋 أهلاً! أنا **سدى** — مستشارتك الذكية للأقمشة في بن صديق للأقمشة الفاخرة، ينبع.\n\nأستطيع مساعدتك في:\n• 🧮 حساب كمية القماش لفستانك\n• 🎨 اختيار الألوان المناسبة لبشرتك\n• 👗 اقتراح الموديل والقصة\n• 🧵 اختيار نوع القماش لكل مناسبة\n• 💡 نصائح العناية بالأقمشة\n\nما الذي تودين معرفته؟',
  timestamp: new Date(),
};

export default function ChatFull() {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input,    setInput]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const userMsg: Message = { role: 'user', content: trimmed, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const history = [...messages, userMsg].slice(-10).map(({ role, content }) => ({ role, content }));
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: history }) });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply || 'عذراً، حاولي مرة أخرى.', timestamp: new Date() }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'عذراً، حدث خطأ. حاولي مرة أخرى! 🔄', timestamp: new Date() }]);
    } finally { setLoading(false); }
  }, [messages, loading]);

  const formatMsg = (text: string) => text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>');
  const reset = () => setMessages([WELCOME]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card overflow-hidden shadow-xl" style={{ height: '650px', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 flex-shrink-0" style={{ background: 'var(--bs-grad)' }}>
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">✂️</div>
          <div className="flex-1">
            <div className="font-black text-white flex items-center gap-2">
              سدى
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI مدعومة بالذكاء الاصطناعي
              </span>
            </div>
            <div className="text-white/70 text-xs">مستشارة الأقمشة · بن صديق، ينبع</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /><span className="text-white/60 text-xs">متاحة الآن</span></div>
            <button onClick={reset} className="text-white/50 hover:text-white transition-colors" title="بدء محادثة جديدة"><RotateCcw className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ background: 'var(--bs-pearl)' }}>
          {messages.map((msg, i) => (
            <div key={i} className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-base ${msg.role === 'assistant' ? '' : 'bg-gray-200'}`}
                   style={msg.role === 'assistant' ? { background: 'var(--bs-grad)' } : {}}>
                {msg.role === 'assistant' ? '✂️' : '👤'}
              </div>
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed animate-bubble shadow-sm ${msg.role === 'user' ? 'rounded-br-sm text-white' : 'rounded-bl-sm text-gray-800 bg-white'}`}
                style={msg.role === 'user' ? { background: 'var(--bs-grad)' } : {}}
                dangerouslySetInnerHTML={{ __html: formatMsg(msg.content) }}
              />
            </div>
          ))}
          {loading && (
            <div className="flex items-end gap-2">
              <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-base" style={{ background: 'var(--bs-grad)' }}>✂️</div>
              <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex gap-1.5">
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
          <div className="px-4 py-2 border-t flex gap-2 overflow-x-auto flex-shrink-0 bg-white" style={{ borderColor: 'rgba(184,184,184,0.2)' }}>
            {QUICK_REPLIES.map((q) => (
              <button key={q} onClick={() => send(q)}
                className="flex-shrink-0 text-xs px-3 py-2 rounded-full border font-medium transition-all hover:opacity-80 whitespace-nowrap"
                style={{ borderColor: 'var(--bs-vivid)', color: 'var(--bs-deep)', background: 'rgba(212,30,47,0.05)' }}>
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-3 px-4 py-3.5 border-t bg-white flex-shrink-0" style={{ borderColor: 'rgba(184,184,184,0.2)' }}>
          <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="اسألي سدى عن أقمشة، مقاسات، ألوان، مناسبات..."
            disabled={loading} maxLength={500} dir="rtl"
            className="flex-1 text-sm outline-none bg-transparent font-cairo"
            style={{ color: 'var(--bs-dark)' }} />
          <button type="submit" disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-full text-white flex items-center justify-center transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
            style={{ background: 'var(--bs-grad)', flexShrink: 0 }}>
            <Send className="w-4 h-4" style={{ transform: 'scaleX(-1)' }} />
          </button>
        </form>
      </div>

      <p className="text-center text-xs mt-4" style={{ color: 'var(--bs-silver)' }}>
        سدى مدعومة بالذكاء الاصطناعي · للطلبات المباشرة{' '}
        <Link href="/products" style={{ color: 'var(--bs-vivid)' }} className="font-semibold hover:underline">تصفح المنتجات</Link>
      </p>
    </div>
  );
}
