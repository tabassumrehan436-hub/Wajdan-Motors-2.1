import { useState, useEffect, useCallback } from 'react';
import { getCars as getStoredCars, addCar as addStoredCar, updateCar as updateStoredCar, deleteCar as deleteStoredCar } from '../lib/carsData';

export interface Car {
  id: string | number;
  name: string;
  car_name: string;
  make: string;
  body_type: string;
  year: number;
  price: number;
  mileage: number;
  image: string;
  status: 'available' | 'sold';
  created_at?: string;
  updated_at?: string;
}

interface UseBackendCarsReturn {
  cars: Car[];
  loading: boolean;
  error: string | null;
  addCar: (data: Omit<Car, 'id' | 'created_at' | 'updated_at'>) => Promise<{ success: boolean; error?: string }>;
  updateCar: (id: string | number, data: Partial<Omit<Car, 'id' | 'created_at' | 'updated_at'>>) => Promise<{ success: boolean; error?: string }>;
  deleteCar: (id: string | number) => Promise<{ success: boolean; error?: string }>;
}

export function useBackendCars(): UseBackendCarsReturn {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all cars
  useEffect(() => {
    // load from localStorage backing store
    const load = () => {
      try {
        setLoading(true);
        const stored = getStoredCars();
        // Ensure each entry has `name` field for compatibility
        const formatted = stored.map((car: any) => ({ ...car, name: car.name ?? car.car_name ?? car.name }));
        setCars(formatted);
        setError(null);
      } catch (err) {
        console.error('Error loading cars from localStorage:', err);
        setError(err instanceof Error ? err.message : 'Failed to load cars');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // Add car
  const addCar = useCallback(
    async (data: Omit<Car, 'id' | 'created_at' | 'updated_at'>) => {
      try {
        addStoredCar(data as any);
        const updated = getStoredCars();
        setCars(updated.map((c: any) => ({ ...c, name: c.name ?? c.car_name })));
        return { success: true };
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to add car';
        return { success: false, error: errorMsg };
      }
    },
    []
  );

  // Update car
  const updateCar = useCallback(
    async (id: string | number, data: Partial<Omit<Car, 'id' | 'created_at' | 'updated_at'>>) => {
      try {
        const updated = updateStoredCar(String(id), data as any);
        if (!updated) return { success: false, error: 'Car not found' };
        setCars(getStoredCars().map((c: any) => ({ ...c, name: c.name ?? c.car_name })));
        return { success: true };
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to update car';
        return { success: false, error: errorMsg };
      }
    },
    []
  );

  // Delete car
  const deleteCar = useCallback(
    async (id: string | number) => {
      try {
        const ok = deleteStoredCar(String(id));
        if (!ok) return { success: false, error: 'Car not found' };
        setCars(getStoredCars().map((c: any) => ({ ...c, name: c.name ?? c.car_name })));
        return { success: true };
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to delete car';
        return { success: false, error: errorMsg };
      }
    },
    []
  );

  return {
    cars,
    loading,
    error,
    addCar,
    updateCar,
    deleteCar,
  };
}
