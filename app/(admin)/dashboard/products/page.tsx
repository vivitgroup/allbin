'use client';

import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, EyeOff, Save, X } from 'lucide-react';
import { useProductsStore } from '@/stores/productsStore';
import { Product } from '@/types';

const BS = { deep: '#8B1A1A', vivid: '#D41E2F', silver: '#B8B8B8', pearl: '#F7F5F2' };
const CATEGORIES = ['جورجيت', 'ساتان', 'شيفون', 'قطن', 'كريب', 'حرير', 'قطيفة', 'دانتيل'];

const EMPTY_FORM = { name: '', description: '', price: '', category: 'جورجيت', stock_quantity: '', color1name: '', color1hex: '#D41E2F', color2name: '', color2hex: '#1A1A1A' };

export default function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct, toggleActive } = useProductsStore();
  const [search,     setSearch]     = useState('');
  const [showModal,  setShowModal]  = useState(false);
  const [editId,     setEditId]     = useState<string | null>(null);
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [saved,      setSaved]      = useState(false);

  const filtered = products.filter((p) =>
    p.name.includes(search) || p.category.includes(search)
  );

  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setShowModal(true); };
  const openEdit = (p: Product) => {
    setForm({
      name: p.name, description: p.description, price: String(p.price),
      category: p.category, stock_quantity: String(p.stock_quantity),
      color1name: p.colors[0]?.name || '', color1hex: p.colors[0]?.hex || '#D41E2F',
      color2name: p.colors[1]?.name || '', color2hex: p.colors[1]?.hex || '',
    });
    setEditId(p.id);
    setShowModal(true);
  };

  const handleSave = () => {
    const payload = {
      name: form.name, description: form.description,
      price: Number(form.price), price_per_meter: Number(form.price),
      category: form.category, stock_quantity: Number(form.stock_quantity),
      colors: [
        ...(form.color1name ? [{ name: form.color1name, hex: form.color1hex }] : []),
        ...(form.color2name ? [{ name: form.color2name, hex: form.color2hex }] : []),
      ],
      images: [], is_active: true,
    };
    if (editId) { updateProduct(editId, payload); }
    else        { addProduct(payload); }
    setSaved(true);
    setTimeout(() => { setSaved(false); setShowModal(false); }, 800);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`حذف "${name}"؟`)) deleteProduct(id);
  };

  return (
    <div className="p-8" style={{ backgroundColor: BS.pearl, minHeight: '100vh' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black" style={{ color: BS.deep }}>المنتجات</h1>
          <p className="text-gray-500 mt-1">
            {products.filter((p) => p.is_active).length} نشط من {products.length} منتج
            <span className="mr-2 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
              ● مزامنة تلقائية مع المتجر
            </span>
          </p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all hover:opacity-90"
          style={{ background: `linear-gradient(135deg, ${BS.deep}, ${BS.vivid})` }}>
          <Plus className="w-5 h-5" />
          إضافة منتج
        </button>
      </div>

      <div className="card overflow-hidden bg-white">
        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative max-w-sm">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="ابحث..." value={search}
              onChange={(e) => setSearch(e.target.value)} className="input pr-9 py-2.5 text-sm" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: `${BS.pearl}` }}>
              <tr>
                {['المنتج', 'الفئة', 'السعر/م', 'الألوان', 'المخزون', 'الحالة', 'إجراءات'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 border-b">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors"
                    style={{ opacity: p.is_active ? 1 : 0.5 }}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0"
                           style={{ background: `linear-gradient(135deg, ${p.colors[0]?.hex || BS.vivid}, ${p.colors[1]?.hex || BS.deep})` }}>
                        <span className="w-full h-full flex items-center justify-center text-white text-xs font-black opacity-30">Q</span>
                      </div>
                      <span className="font-semibold text-gray-800">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{ backgroundColor: `${BS.vivid}15`, color: BS.deep }}>{p.category}</span>
                  </td>
                  <td className="px-5 py-4 font-black text-lg" style={{ color: BS.vivid }}>{p.price} ر.س</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1.5">
                      {p.colors.map((c) => (
                        <div key={c.hex} title={c.name}
                             className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                             style={{ backgroundColor: c.hex }} />
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`font-semibold ${p.stock_quantity === 0 ? 'text-red-500' : p.stock_quantity < 50 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {p.stock_quantity === 0 ? 'نفد' : `${p.stock_quantity} م`}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={() => toggleActive(p.id)}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium transition-all"
                      style={{
                        backgroundColor: p.is_active ? '#dcfce7' : '#f3f4f6',
                        color:           p.is_active ? '#15803d' : '#6b7280',
                      }}>
                      {p.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      {p.is_active ? 'نشط' : 'مخفي'}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1.5">
                      <button onClick={() => openEdit(p)}
                        className="p-2 rounded-lg transition-colors hover:bg-blue-50 text-blue-500">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(p.id, p.name)}
                        className="p-2 rounded-lg transition-colors hover:bg-red-50 text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
             onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl animate-float-up"
               onClick={(e) => e.stopPropagation()}
               style={{ borderTop: `4px solid ${BS.vivid}` }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black" style={{ color: BS.deep }}>
                {editId ? 'تعديل المنتج' : 'إضافة منتج جديد'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <input className="input" placeholder="اسم المنتج *"
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <textarea className="input resize-none h-20" placeholder="وصف المنتج"
                value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <input className="input" placeholder="السعر/م (ر.س) *" type="number"
                  value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                <input className="input" placeholder="الكمية في المخزون *" type="number"
                  value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} />
              </div>
              <select className="input" value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>

              {/* Colors */}
              <div className="p-4 rounded-xl" style={{ backgroundColor: `${BS.pearl}` }}>
                <p className="text-sm font-semibold mb-3" style={{ color: BS.deep }}>الألوان</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex gap-2">
                    <input type="color" value={form.color1hex}
                      onChange={(e) => setForm({ ...form, color1hex: e.target.value })}
                      className="w-10 h-10 rounded-lg border cursor-pointer" />
                    <input className="input flex-1 py-2" placeholder="اسم اللون 1"
                      value={form.color1name} onChange={(e) => setForm({ ...form, color1name: e.target.value })} />
                  </div>
                  <div className="flex gap-2">
                    <input type="color" value={form.color2hex}
                      onChange={(e) => setForm({ ...form, color2hex: e.target.value })}
                      className="w-10 h-10 rounded-lg border cursor-pointer" />
                    <input className="input flex-1 py-2" placeholder="اسم اللون 2 (اختياري)"
                      value={form.color2name} onChange={(e) => setForm({ ...form, color2name: e.target.value })} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1 py-3">إلغاء</button>
              <button
                onClick={handleSave}
                disabled={!form.name || !form.price}
                className="flex-1 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                style={{ background: saved ? '#16a34a' : `linear-gradient(135deg, ${BS.deep}, ${BS.vivid})` }}>
                {saved ? <><Save className="w-4 h-4" /> تم الحفظ!</> : 'حفظ المنتج'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
