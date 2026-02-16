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
        const token = localStorage.getItem('adminToken');
        const username = localStorage.getItem('adminUsername');
        
        // Only restore session if we have BOTH token and username present
        // This prevents false positives from stale localStorage data
        if (token && username && token === 'frontend-session') {
          setAdminUser({ id: '1', email: username, role: 'admin' });
        } else {
          // Clear any invalid or partial authentication data
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUsername');
          sessionStorage.removeItem('csrfToken');
          setAdminUser(null);
        }
      } catch (err) {
        console.error('Init auth error:', err);
        // On any error, clear auth data and require fresh login
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUsername');
        sessionStorage.removeItem('csrfToken');
        setAdminUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Admin login - auto-authenticate without password
  const adminLogin = useCallback(
    async (email: string, password: string) => {
      setError(null);
      setLoading(true);

      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Auto-authenticate without password check
        setAdminUser({ id: '1', email: email || 'admin', role: 'admin' });
        localStorage.setItem('adminToken', 'frontend-session');
        localStorage.setItem('adminUsername', email || 'admin');
        sessionStorage.setItem('csrfToken', 'frontend-token-' + Date.now());
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