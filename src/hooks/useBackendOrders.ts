import { useState, useCallback, useEffect } from 'react';
import { getOrders as getStoredOrders, updateOrderStatus as updateStoredOrderStatus, deleteOrder as deleteStoredOrder } from '../lib/carsData';

export interface OrderWithDetails {
  id: string;
  customer_name?: string;
  customer_email?: string;
  car_id?: string | number;
  car_name?: string;
  status?: 'pending' | 'approved' | 'rejected' | 'completed';
  total_amount?: number;
  created_at?: string;
}

interface UseBackendOrdersReturn {
  getAllOrders: (status?: string) => Promise<OrderWithDetails[]>;
  updateOrderStatus: (id: string, status: OrderWithDetails['status']) => Promise<boolean>;
  deleteOrder: (id: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

function useBackendOrders(): UseBackendOrdersReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAllOrders = useCallback(async (status?: string) => {
    setLoading(true);
    setError(null);
    try {
      const orders = getStoredOrders();
      if (status) return orders.filter((o) => o.status === status) as OrderWithDetails[];
      return orders as OrderWithDetails[];
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch orders';
      setError(errorMsg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Load orders on mount
  useEffect(() => {
    getAllOrders();
  }, [getAllOrders]);

  const updateOrderStatus = useCallback(async (id: string, status: OrderWithDetails['status']) => {
    setLoading(true);
    setError(null);
    try {
      const updated = updateStoredOrderStatus(id, status || 'pending');
      return !!updated;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update order';
      setError(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteOrder = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const ok = deleteStoredOrder(id);
      return ok;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete order';
      setError(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getAllOrders,
    updateOrderStatus,
    deleteOrder,
    loading,
    error,
  };
}

export default useBackendOrders;
