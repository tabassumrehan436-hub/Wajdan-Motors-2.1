import { useState, useEffect, useCallback } from 'react';
import { getInquiries as getStoredInquiries, updateInquiryStatus as updateStoredInquiryStatus, deleteInquiry as deleteStoredInquiry } from '../lib/carsData';

export interface Inquiry {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  car_name: string;
  message: string;
  status: 'new' | 'contacted' | 'closed';
  created_at?: string;
  updated_at?: string;
}

interface UseBackendInquiriesReturn {
  inquiries: Inquiry[];
  loading: boolean;
  error: string | null;
  updateInquiryStatus: (id: string | number, status: Inquiry['status']) => Promise<{ success: boolean; error?: string }>;
  deleteInquiry: (id: string | number) => Promise<{ success: boolean; error?: string }>;
}

// Use relative URLs so Vite proxy handles them
const API_URL = '';

export function useBackendInquiries(): UseBackendInquiriesReturn {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load inquiries from localStorage
  useEffect(() => {
    try {
      setLoading(true);
      const stored = getStoredInquiries();
      setInquiries(stored || []);
      setError(null);
    } catch (err) {
      console.error('Error loading inquiries:', err);
      setError(err instanceof Error ? err.message : 'Failed to load inquiries');
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update inquiry status
  const updateInquiryStatus = useCallback(
    async (id: string | number, status: Inquiry['status']) => {
      try {
        updateStoredInquiryStatus(String(id), status);
        setInquiries(getStoredInquiries());
        return { success: true };
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to update inquiry';
        return { success: false, error: errorMsg };
      }
    },
    []
  );

  // Delete inquiry
  const deleteInquiry = useCallback(
    async (id: string | number) => {
      try {
        deleteStoredInquiry(String(id));
        setInquiries(getStoredInquiries());
        return { success: true };
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to delete inquiry';
        return { success: false, error: errorMsg };
      }
    },
    []
  );

  return {
    inquiries,
    loading,
    error,
    updateInquiryStatus,
    deleteInquiry,
  };
}
