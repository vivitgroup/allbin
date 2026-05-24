'use client';

import { useState } from 'react';
import { Save, Store, Bell, Shield } from 'lucide-react';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">الإعدادات</h1>

      <div className="space-y-6">
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-5">
            <Store className="w-5 h-5 text-[#C41E3A]" />
            <h2 className="font-bold text-lg">معلومات المتجر</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">اسم المتجر</label>
              <input className="input" defaultValue="Bin Siddiq Fabric" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
              <input className="input" type="email" defaultValue="info@binsiddiq.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">رقم الجوال</label>
              <input className="input" defaultValue="+966 50 000 0000" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-5">
            <Bell className="w-5 h-5 text-[#C41E3A]" />
            <h2 className="font-bold text-lg">الإشعارات</h2>
          </div>
          <div className="space-y-4">
            {[
              { label: 'إشعارات الطلبات الجديدة', defaultChecked: true },
              { label: 'إشعارات نفاد المخزون', defaultChecked: true },
              { label: 'التقارير الأسبوعية', defaultChecked: false },
            ].map((n) => (
              <label key={n.label} className="flex items-center justify-between">
                <span className="font-medium">{n.label}</span>
                <input type="checkbox" defaultChecked={n.defaultChecked} className="w-5 h-5 accent-[#C41E3A]" />
              </label>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-5">
            <Shield className="w-5 h-5 text-[#C41E3A]" />
            <h2 className="font-bold text-lg">الأمان</h2>
          </div>
          <div className="space-y-4">
            <input className="input" type="password" placeholder="كلمة المرور الحالية" />
            <input className="input" type="password" placeholder="كلمة المرور الجديدة" />
            <input className="input" type="password" placeholder="تأكيد كلمة المرور الجديدة" />
          </div>
        </div>

        <button onClick={handleSave} className={`btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 ${saved ? 'bg-green-600' : ''}`}>
          <Save className="w-5 h-5" />
          {saved ? '✓ تم الحفظ!' : 'حفظ الإعدادات'}
        </button>
      </div>
    </div>
  );
}
