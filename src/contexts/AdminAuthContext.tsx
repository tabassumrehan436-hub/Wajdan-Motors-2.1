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

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if token exists in localStorage
        const token = localStorage.getItem('adminToken');
        
        if (token) {
          // Token exists, user was previously logged in
          const mockUser: AdminUser = {
            id: 'admin',
            email: 'admin@wajdanmotors.com',
            full_name: 'Admin User',
            role: 'admin',
            avatar_url: null,
            phone_number: null,
            created_at: new Date().toISOString(),
          };
          setAdminUser(mockUser);
        }

        setLoading(false);
      } catch (err) {
        console.error('Init auth error:', err);
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Admin login (local mock using localStorage)
  const adminLogin = useCallback(
    async (email: string, password: string) => {
      setError(null);
      setLoading(true);
      try {
        // Simple demo credential check. Adjust or replace as needed.
        if (email === 'admin' && password === 'admin123') {
          // create a mock token with a decodable payload
          const payload = { id: 'admin', username: email };
          const token = `mock.${btoa(JSON.stringify(payload))}.sig`;
          localStorage.setItem('adminToken', token);
          const user: AdminUser = {
            id: payload.id,
            email: payload.username,
            full_name: 'Admin User',
            role: 'admin',
            avatar_url: null,
            phone_number: null,
            created_at: new Date().toISOString(),
          };
          setAdminUser(user);
          setLoading(false);
          return { success: true };
        }

        const errMsg = 'Invalid credentials';
        setError(errMsg);
        setLoading(false);
        return { success: false, error: errMsg };
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Login error.';
        setError(errorMsg);
        setLoading(false);
        return { success: false, error: errorMsg };
      }
    },
    []
  );

  // Admin logout
  const adminLogout = useCallback(async () => {
    try {
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
    isAuthenticated: !!adminUser && !!localStorage.getItem('adminToken'),
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