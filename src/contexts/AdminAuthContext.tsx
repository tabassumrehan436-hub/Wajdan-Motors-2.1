import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

export interface AdminUser {
  id?: string;
  email?: string;
  full_name?: string | null;
  role: 'admin' | 'user';
  avatar_url?: string | null;
  phone_number?: string | null;
  created_at?: string;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  adminLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => Promise<void>;
  clearError: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state by checking server session
  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await fetch('/api/admin-session.php', { method: 'GET' });
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const body = await res.json();
        if (body.logged_in) {
          setAdminUser({ id: body.admin.id, email: body.admin.username, role: 'admin' });
          // store csrf token for use by admin requests
          if (body.csrf_token) sessionStorage.setItem('csrfToken', body.csrf_token);
          // keep a simple client-side flag for compatibility
          localStorage.setItem('adminToken', 'server-session');
        }
      } catch (err) {
        console.error('Init auth error:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Admin login (server-backed)
  const adminLogin = useCallback(
    async (email: string, password: string) => {
      setError(null);
      setLoading(true);
      try {
        const res = await fetch('/api/admin-login.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: email, password }),
        });

        const body = await res.json();
        if (!res.ok || !body.success) {
          const msg = body.message || 'Invalid credentials';
          setError(msg);
          setLoading(false);
          return { success: false, error: msg };
        }

        // store csrf token and set admin user
        if (body.csrf_token) sessionStorage.setItem('csrfToken', body.csrf_token);
        setAdminUser({ id: 1, email, role: 'admin' });
        // compatibility flag for client-side checks
        localStorage.setItem('adminToken', 'server-session');
        setLoading(false);
        return { success: true };
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Login error.';
        setError(errorMsg);
        setLoading(false);
        return { success: false, error: errorMsg };
      }
    },
    []
  );

  // Admin logout (server-backed)
  const adminLogout = useCallback(async () => {
    try {
      await fetch('/api/admin-logout.php', { method: 'POST' });
      sessionStorage.removeItem('csrfToken');
      localStorage.removeItem('adminToken');
      setAdminUser(null);
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AdminAuthContextType = {
    adminUser,
    loading,
    error,
    isAdmin: adminUser?.role === 'admin',
    // consider user authenticated when adminUser is present (server session validated)
    isAuthenticated: !!adminUser,
    adminLogin,
    adminLogout,
    clearError,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
}