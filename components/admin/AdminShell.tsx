'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAdminAuth } from '@/lib/admin-auth';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Menu, User } from 'lucide-react';

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0a' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#555', borderTopColor: 'transparent' }} />
          <p className="text-sm" style={{ color: '#888' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const pageName = pathname === '/admin' ? 'Dashboard'
    : pathname.startsWith('/admin/products') ? 'Products'
    : pathname.startsWith('/admin/categories') ? 'Categories'
    : pathname.startsWith('/admin/blogs') ? 'Blogs'
    : 'Admin';

  return (
    <div className="min-h-screen" style={{ background: '#f7f4f0' }}>
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main content */}
      <div className="lg:ml-64 min-h-screen flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-20 h-14 flex items-center px-4 lg:px-6 gap-4"
          style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg transition-colors"
            style={{ color: '#1a1a1a' }}
          >
            <Menu size={20} />
          </button>
          <h1 className="text-sm font-semibold" style={{ color: '#1a1a1a' }}>{pageName}</h1>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{ background: 'rgba(0,0,0,0.06)', color: '#1a1a1a' }}>
              <User size={13} />
              <span>{user.name || user.email}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
