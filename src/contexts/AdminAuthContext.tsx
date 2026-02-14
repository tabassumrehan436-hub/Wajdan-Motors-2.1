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

  // Initialize auth state - check localStorage for existing session
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (localStorage.getItem('adminToken')) {
          const username = localStorage.getItem('adminUsername');
          setAdminUser({ id: '1', email: username || 'wajdan', role: 'admin' });
        }
      } catch (err) {
        console.error('Init auth error:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Admin login - frontend only (hardcoded credentials)
  const adminLogin = useCallback(
    async (email: string, password: string) => {
      setError(null);
      setLoading(true);
      
      // Hardcoded credentials
      const ADMIN_USERNAME = 'wajdan';
      const ADMIN_PASSWORD = 'rehan110';

      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        if (email === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
          // Set admin user and tokens
          setAdminUser({ id: '1', email, role: 'admin' });
          localStorage.setItem('adminToken', 'frontend-session');
          localStorage.setItem('adminUsername', email);
          sessionStorage.setItem('csrfToken', 'frontend-token-' + Date.now());
          setLoading(false);
          return { success: true };
        } else {
          const msg = 'Invalid credentials';
          setError(msg);
          setLoading(false);
          return { success: false, error: msg };
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Login error.';
        setError(errorMsg);
        setLoading(false);
        return { success: false, error: errorMsg };
      }
    },
    []
  );

  // Admin logout - frontend only
  const adminLogout = useCallback(async () => {
    try {
      sessionStorage.removeItem('csrfToken');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUsername');
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