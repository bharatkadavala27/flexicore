'use client';

import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { apiRequest } from '@/lib/admin-auth';
import { Package, FileText, Layers, Eye } from 'lucide-react';
import Link from 'next/link';

interface Stats {
  products: number;
  blogs: number;
  categories: number;
  publishedBlogs: number;
  visibleProducts: number;
  recentBlogs: any[];
}

function StatCard({ title, value, icon, sub, href }: { title: string; value: number; icon: React.ReactNode; sub?: string; href: string }) {
  return (
    <Link href={href} className="block group">
      <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 border"
        style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
        <div className="flex items-start justify-between mb-4">
          <div className="p-2.5 rounded-xl" style={{ background: 'rgba(0,0,0,0.06)' }}>
            <span style={{ color: '#1a1a1a' }}>{icon}</span>
          </div>
          <span className="text-3xl font-bold" style={{ color: '#1a1a1a' }}>{value}</span>
        </div>
        <p className="text-sm font-semibold" style={{ color: '#1a1a1a' }}>{title}</p>
        {sub && <p className="text-xs mt-0.5" style={{ color: '#666' }}>{sub}</p>}
      </div>
    </Link>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest('/dashboard')
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: '#6b5a4a' }}>Welcome to Flexicore CMS</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-28 animate-pulse" style={{ border: '1px solid rgba(0,0,0,0.06)' }} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Products" value={stats?.products || 0} icon={<Package size={18} />} sub={`${stats?.visibleProducts || 0} visible`} href="/admin/products" />
            <StatCard title="Blog Posts" value={stats?.blogs || 0} icon={<FileText size={18} />} sub={`${stats?.publishedBlogs || 0} published`} href="/admin/blogs" />
            <StatCard title="Categories" value={stats?.categories || 0} icon={<Layers size={18} />} href="/admin/categories" />
            <StatCard title="Published Blogs" value={stats?.publishedBlogs || 0} icon={<Eye size={18} />} sub="Live on website" href="/admin/blogs" />
          </div>
        )}

        {/* Recent Blogs */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <h2 className="font-semibold" style={{ color: '#1a1a1a' }}>Recent Blog Posts</h2>
            <Link href="/admin/blogs" className="text-xs font-medium hover:underline" style={{ color: '#555' }}>View all →</Link>
          </div>
          <div className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
            {stats?.recentBlogs?.length ? stats.recentBlogs.map((b: any) => (
              <div key={b._id} className="px-6 py-3.5 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: '#1a1a1a' }}>{b.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#6b5a4a' }}>{b.author || 'No author'} · {new Date(b.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${b.isPublished ? 'text-green-700 bg-green-100' : 'text-gray-500 bg-gray-100'}`}>
                  {b.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
            )) : (
              <div className="px-6 py-10 text-center text-sm" style={{ color: '#6b5a4a' }}>No blog posts yet.</div>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Add Product', href: '/admin/products/add', icon: <Package size={16} /> },
            { label: 'Add Blog', href: '/admin/blogs/add', icon: <FileText size={16} /> },
            { label: 'Add Category', href: '/admin/categories', icon: <Layers size={16} /> },
            { label: 'View Website', href: '/', icon: <Eye size={16} /> },
          ].map(a => (
            <Link key={a.href} href={a.href}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:shadow-md"
              style={{ background: 'linear-gradient(135deg, #1a1a1a, #333)', color: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
              {a.icon}
              {a.label}
            </Link>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
