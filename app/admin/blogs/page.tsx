'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminShell from '@/components/admin/AdminShell';
import { apiRequest } from '@/lib/admin-auth';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [msg, setMsg] = useState('');

  const fetchData = () => {
    setLoading(true);
    apiRequest('/blogs')
      .then(setBlogs)
      .catch(() => setMsg('Failed to load blogs'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this blog post?')) return;
    setDeleting(id);
    try {
      await apiRequest(`/blogs/${id}`, { method: 'DELETE' });
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
          <h1 className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>Blog / News</h1>
          <Link href="/admin/blogs/add"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #1a1a1a, #333)', boxShadow: '0 2px 10px rgba(107,47,42,0.25)' }}>
            <Plus size={16} /> Add Post
          </Link>
        </div>

        {msg && <div className="px-4 py-3 rounded-xl text-sm text-red-700 bg-red-50 border border-red-200">{msg}</div>}

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3" style={{ color: '#6b5a4a' }}>
              <Loader2 className="animate-spin" size={28} />
              <span className="text-sm">Loading blog posts...</span>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-16 text-sm" style={{ color: '#6b5a4a' }}>
              No blog posts yet.{' '}
              <Link href="/admin/blogs/add" className="underline" style={{ color: '#555' }}>Write your first post</Link>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
              {blogs.map(b => (
                <div key={b._id} className="flex items-center gap-4 px-5 py-4 hover:bg-amber-50/30 transition-colors">
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-gray-100"
                    style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                    {b.featuredImage?.url ? (
                      <img src={b.featuredImage.url} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] font-medium" style={{ color: '#6b5a4a' }}>
                        No img
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate text-sm" style={{ color: '#1a1a1a' }}>{b.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#6b5a4a' }}>
                      {b.author || 'No author'} · {new Date(b.publishDate || b.createdAt).toLocaleDateString()}
                    </p>
                    {b.tags?.length > 0 && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {b.tags.slice(0, 3).map((tag: string) => (
                          <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full"
                            style={{ background: 'rgba(194,139,90,0.12)', color: '#555' }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Status + Actions */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full ${b.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {b.isPublished ? 'Published' : 'Draft'}
                    </span>
                    <div className="flex items-center gap-1">
                      <Link href={`/admin/blogs/edit/${b._id}`}
                        className="p-2 rounded-lg transition-colors hover:bg-amber-100"
                        style={{ color: '#6b5a4a' }}>
                        <Pencil size={15} />
                      </Link>
                      <button
                        onClick={() => handleDelete(b._id)}
                        disabled={deleting === b._id}
                        className="p-2 rounded-lg transition-colors hover:bg-red-100"
                        style={{ color: deleting === b._id ? '#ccc' : '#6b5a4a' }}>
                        {deleting === b._id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
