'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '')}/api`
  : 'http://localhost:5000/api';

export { API_BASE };

type User = { id: string; name: string; email: string; role: string };
type AuthCtx = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      const token = localStorage.getItem('flexicore_token');
      if (!token) { setIsLoading(false); return; }
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setUser(await res.json());
        else localStorage.removeItem('flexicore_token');
      } catch { /* ignore */ }
      finally { setIsLoading(false); }
    };
    check();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Login failed' }));
      throw new Error(err.message);
    }
    const data = await res.json();
    localStorage.setItem('flexicore_token', data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('flexicore_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}

// ── API helper ──────────────────────────────────────────────────
export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('flexicore_token') : null;
  const headers: Record<string, string> = { ...(options.headers as Record<string, string> || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!(options.body instanceof FormData)) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  if (!res.ok) {
    const text = await res.text();
    let msg = 'Request failed';
    try { msg = JSON.parse(text).message || msg; } catch { msg = text || msg; }
    throw new Error(msg);
  }
  return res.json();
}

export async function uploadFile(file: File): Promise<{ url: string; publicId: string }> {
  const fd = new FormData();
  fd.append('file', file);
  return apiRequest('/upload/image', { method: 'POST', body: fd });
}
