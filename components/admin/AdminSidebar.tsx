'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAdminAuth } from '@/lib/admin-auth';
import {
  LayoutDashboard, Package, Layers, FileText, X, LogOut, ExternalLink,
  RefreshCw, Users, UserCircle, Image, Award, MapPin, Newspaper,
  CheckCircle, Briefcase, MessageSquare, Settings, Search
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { label: 'Products', icon: Package, path: '/admin/products' },
  { label: 'Categories', icon: Layers, path: '/admin/categories' },
  { label: 'Blogs', icon: FileText, path: '/admin/blogs' },
  { label: 'Daily Updates', icon: RefreshCw, path: '/admin/daily-updates' },
  { label: 'Distributors', icon: Users, path: '/admin/distributors' },
  { label: 'Team', icon: UserCircle, path: '/admin/team' },
  { label: 'Gallery', icon: Image, path: '/admin/gallery' },
  { label: 'Certificates', icon: Award, path: '/admin/certificates' },
  { label: 'Expos', icon: MapPin, path: '/admin/expos' },
  { label: 'Press', icon: Newspaper, path: '/admin/press' },
  { label: 'Trusted By', icon: CheckCircle, path: '/admin/trusted-by' },
  { label: 'Careers', icon: Briefcase, path: '/admin/careers' },
  { label: 'Enquiries', icon: MessageSquare, path: '/admin/enquiries' },
  { label: 'Settings', icon: Settings, path: '/admin/settings' },
  { label: 'SEO', icon: Search, path: '/admin/seo' },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: Props) {
  const { logout } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const isActive = (path: string) => {
    if (path === '/admin') return pathname === '/admin';
    return pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col transition-transform duration-300 ease-in-out -translate-x-full lg:translate-x-0 ${isOpen ? 'translate-x-0' : ''}`}
        style={{
          background: 'linear-gradient(180deg, #0a0a0a 0%, #141414 100%)',
          borderRight: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* Logo area */}
        <div className="flex items-center justify-between h-16 px-5 shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white text-base shrink-0"
              style={{ background: 'linear-gradient(135deg, #222, #444)' }}>
              F
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight">Flexicore</p>
              <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>Admin Panel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => { if (window.innerWidth < 1024) onClose(); }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group"
              style={isActive(item.path)
                ? { background: 'linear-gradient(135deg, #222, #333)', color: '#fff', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }
                : { color: 'rgba(255,255,255,0.6)' }
              }
              onMouseEnter={e => { if (!isActive(item.path)) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
              onMouseLeave={e => { if (!isActive(item.path)) { (e.currentTarget as HTMLElement).style.background = ''; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)'; }}}
            >
              <item.icon size={18} className="shrink-0" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 space-y-2 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all"
            style={{ color: 'rgba(255,255,255,0.4)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ''; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)'; }}
          >
            <ExternalLink size={16} />
            <span>View Website</span>
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm font-medium transition-all"
            style={{ color: '#ef4444' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ''; }}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
