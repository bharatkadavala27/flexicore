'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminShell from '@/components/admin/AdminShell';
import { apiRequest } from '@/lib/admin-auth';
import { Plus, Pencil, Trash2, Loader2, Eye, EyeOff } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  sku: string;
  category: any;
  images: { url: string; publicId: string }[];
  priceRange: string;
  isVisible: boolean;
  surface: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [msg, setMsg] = useState('');

  const fetchData = () => {
    setLoading(true);
    apiRequest('/products')
      .then(setProducts)
      .catch(() => setMsg('Failed to load products'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    setDeleting(id);
    try {
      await apiRequest(`/products/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err: any) {
      setMsg(err.message);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <AdminShell>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>Products</h1>
          <Link href="/admin/products/add"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #1a1a1a, #333)', boxShadow: '0 2px 10px rgba(107,47,42,0.25)' }}>
            <Plus size={16} /> Add Product
          </Link>
        </div>

        {msg && <div className="px-4 py-3 rounded-xl text-sm text-red-700 bg-red-50 border border-red-200">{msg}</div>}

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3" style={{ color: '#6b5a4a' }}>
              <Loader2 className="animate-spin" size={28} />
              <span className="text-sm">Loading products...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 text-sm" style={{ color: '#6b5a4a' }}>
              No products yet. <Link href="/admin/products/add" className="underline" style={{ color: '#555' }}>Add your first product</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', background: 'rgba(247,244,240,0.6)' }}>
                    <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider" style={{ color: '#6b5a4a' }}>Image</th>
                    <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider" style={{ color: '#6b5a4a' }}>Name</th>
                    <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider hidden md:table-cell" style={{ color: '#6b5a4a' }}>SKU</th>
                    <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider hidden lg:table-cell" style={{ color: '#6b5a4a' }}>Category</th>
                    <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider" style={{ color: '#6b5a4a' }}>Status</th>
                    <th className="text-right px-5 py-3.5 font-semibold text-xs uppercase tracking-wider" style={{ color: '#6b5a4a' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, i) => (
                    <tr key={p._id} className="hover:bg-amber-50/30 transition-colors"
                      style={{ borderBottom: i < products.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}>
                      <td className="px-5 py-3">
                        {p.images?.[0] ? (
                          <img src={p.images[0].url} className="w-11 h-11 rounded-lg object-cover" alt=""
                            style={{ border: '1px solid rgba(0,0,0,0.08)' }} />
                        ) : (
                          <div className="w-11 h-11 rounded-lg flex items-center justify-center text-[10px] font-medium"
                            style={{ background: '#f7f4f0', color: '#6b5a4a', border: '1px solid rgba(0,0,0,0.08)' }}>
                            No img
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3 font-medium" style={{ color: '#1a1a1a' }}>{p.name}</td>
                      <td className="px-5 py-3 hidden md:table-cell" style={{ color: '#6b5a4a' }}>{p.sku || '—'}</td>
                      <td className="px-5 py-3 hidden lg:table-cell" style={{ color: '#6b5a4a' }}>{p.category?.name || '—'}</td>
                      <td className="px-5 py-3">
                        {p.isVisible
                          ? <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700"><Eye size={10} /> Visible</span>
                          : <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500"><EyeOff size={10} /> Hidden</span>
                        }
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/admin/products/edit/${p._id}`}
                            className="p-2 rounded-lg transition-colors hover:bg-amber-100"
                            style={{ color: '#6b5a4a' }}>
                            <Pencil size={15} />
                          </Link>
                          <button
                            onClick={() => handleDelete(p._id)}
                            disabled={deleting === p._id}
                            className="p-2 rounded-lg transition-colors hover:bg-red-100"
                            style={{ color: deleting === p._id ? '#ccc' : '#6b5a4a' }}>
                            {deleting === p._id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
