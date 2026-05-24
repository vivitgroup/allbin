'use client';

import { useState } from 'react';
import { Video, Users, Radio } from 'lucide-react';

export default function StreamingPage() {
  const [isLive, setIsLive] = useState(false);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">البث المباشر</h1>
      <p className="text-gray-500 mb-8">أدر جلسات البث المباشر وعرض المنتجات</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {[
          { icon: Video, label: 'جلسات البث', value: '24', color: 'bg-[#C41E3A]' },
          { icon: Users, label: 'إجمالي المشاهدين', value: '12,847', color: 'bg-blue-500' },
          { icon: Radio, label: 'مباشر الآن', value: isLive ? '1' : '0', color: 'bg-green-500' },
        ].map((s) => (
          <div key={s.label} className="card p-6 flex items-center gap-4">
            <div className={`w-14 h-14 ${s.color} rounded-xl flex items-center justify-center text-white`}>
              <s.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-3xl font-black">{s.value}</p>
              <p className="text-gray-500 text-sm">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-8 text-center max-w-lg mx-auto">
        <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${isLive ? 'bg-red-100 animate-pulse' : 'bg-gray-100'}`}>
          <Radio className={`w-10 h-10 ${isLive ? 'text-red-600' : 'text-gray-400'}`} />
        </div>
        <h2 className="text-2xl font-bold mb-2">{isLive ? '🔴 جاري البث الآن' : 'ابدأ بثاً مباشراً'}</h2>
        <p className="text-gray-500 mb-6">
          {isLive ? 'يشاهدك 47 شخصاً الآن. شاركي منتجاتك!' : 'ابدئي بثاً مباشراً لعرض منتجاتك وزيادة المبيعات'}
        </p>
        <button
          onClick={() => setIsLive(!isLive)}
          className={`py-4 px-10 rounded-xl text-lg font-bold transition-all ${isLive ? 'bg-red-600 text-white hover:bg-red-700' : 'btn-primary'}`}
        >
          {isLive ? '⬛ إيقاف البث' : '🔴 بدء البث المباشر'}
        </button>
      </div>
    </div>
  );
}
