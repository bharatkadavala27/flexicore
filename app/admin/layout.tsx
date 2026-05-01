import type { Metadata } from 'next';
import { AdminAuthProvider } from '@/lib/admin-auth';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Admin Panel | Flexicore',
  description: 'Flexicore CMS Admin Panel',
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      {children}
    </AdminAuthProvider>
  );
}
