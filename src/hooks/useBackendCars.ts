import { useState, useEffect, useCallback } from 'react';

// Matches backend schema exactly (fields returned by API)
export interface Car {
  id: number | string;
  name: string;
  make?: string | null;
  body_type?: string | null;
  year?: number | null;
  price?: number | null;
  mileage?: string | null;
  image?: string | null; // maps to primary_image
  images?: string[];
  status?: string | null;
  engine?: string | null;
  transmission?: string | null;
  fuel_type?: string | null;
  color?: string | null;
  seating?: number | null;
  description?: string | null;
  features?: string | null; // backend stores as TEXT (string or comma list)
  created_at?: string | null;
  updated_at?: string | null;
}

// Normalizer used everywhere to keep mapping consistent
function normalizeCar(api: any): Car {
  return {
    id: api.id,
    name: api.name,
    make: api.make ?? null,
    body_type: api.body_type ?? null,
    year: api.year !== null ? (api.year ? Number(api.year) : null) : null,
    price: api.price !== null ? (api.price ? Number(api.price) : null) : null,
    mileage: api.mileage ?? null,
    image: api.primary_image ?? (Array.isArray(api.images) && api.images[0]) ?? null,
    images: Array.isArray(api.images) ? api.images : (api.images ? [api.images] : []),
    status: api.status ?? null,
    engine: api.engine ?? null,
    transmission: api.transmission ?? null,
    fuel_type: api.fuel_type ?? null,
    color: api.color ?? null,
    seating: api.seating !== null ? (api.seating ? Number(api.seating) : null) : null,
    description: api.description ?? null,
    features: api.features ?? null,
    created_at: api.created_at ?? null,
    updated_at: api.updated_at ?? null,
  };
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

  // Helper: convert data URL / base64 to File
  const base64ToFile = (dataUrl: string, filename = 'image.jpg') => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] ?? 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  // Fetch all cars from PHP API
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/get-cars.php');
        if (!res.ok) throw new Error(`Failed to fetch cars (${res.status})`);
        const body = await res.json();
        const data = Array.isArray(body.data) ? body.data : [];
        // Normalize using helper
        const normalized = data.map((c: any) => normalizeCar(c));
        setCars(normalized);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Failed to load cars');
        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // Add car (supports base64 images from current form)
  const addCar = useCallback(async (data: Omit<Car, 'id' | 'created_at' | 'updated_at'>) => {
    setError(null);
    try {
      const fd = new FormData();
      fd.append('name', data.name as string);
      fd.append('price', String((data as any).priceNum ?? data.price ?? 0));
      fd.append('make', (data as any).make ?? '');
      fd.append('body_type', (data as any).bodyType ?? '');
      fd.append('year', String((data as any).year ?? ''));
      fd.append('mileage', (data as any).mileage ?? '');
      fd.append('status', (data as any).status ?? 'available');
      fd.append('engine', (data as any).engine ?? '');
      fd.append('transmission', (data as any).transmission ?? '');
      fd.append('fuel_type', (data as any).fuelType ?? '');
      fd.append('color', (data as any).color ?? '');
      fd.append('seating', String((data as any).seating ?? ''));
      fd.append('description', (data as any).description ?? '');
      fd.append('features', Array.isArray((data as any).features) ? (data as any).features.join(',') : ((data as any).features || ''));

      // primary image can be a data URL or external URL; only upload if data URL
      const primary = (data as any).image || '';
      if (primary.startsWith('data:')) {
        fd.append('primary_image', base64ToFile(primary, 'primary.jpg'));
      }

      // additional images (base64)
      if (Array.isArray((data as any).images)) {
        (data as any).images.forEach((img: string, idx: number) => {
          if (typeof img === 'string' && img.startsWith('data:')) {
            fd.append('images[]', base64ToFile(img, `img_${idx}.jpg`));
          }
        });
      }

      const res = await fetch('/api/add-car.php', { method: 'POST', body: fd });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Failed to add car');

      // Refresh list (use same normalizer)
      const refresh = await fetch('/api/get-cars.php');
      const refreshed = await refresh.json();
      setCars((refreshed.data || []).map((c: any) => normalizeCar(c)));

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add car';
      return { success: false, error: message };
    }
  }, []);

  // Update car
  const updateCar = useCallback(async (id: string | number, data: Partial<Omit<Car, 'id' | 'created_at' | 'updated_at'>>) => {
    setError(null);
    try {
      const fd = new FormData();
      fd.append('id', String(id));
      Object.entries(data).forEach(([k, v]) => {
        if (k === 'image' && typeof v === 'string' && v.startsWith('data:')) {
          fd.append('primary_image', base64ToFile(v, 'primary.jpg'));
        } else if (k === 'images' && Array.isArray(v)) {
          (v as any[]).forEach((img, idx) => {
            if (typeof img === 'string' && img.startsWith('data:')) {
              fd.append('images[]', base64ToFile(img, `img_${idx}.jpg`));
            }
          });
        } else {
          fd.append(k, String(v as any));
        }
      });

      const res = await fetch('/api/update-car.php', { method: 'POST', body: fd });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Failed to update car');

      // refresh (use normalizeCar)
      const refresh = await fetch('/api/get-cars.php');
      const refreshed = await refresh.json();
      setCars((refreshed.data || []).map((c: any) => normalizeCar(c)));

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update car';
      return { success: false, error: message };
    }
  }, []);

  // Delete car
  const deleteCar = useCallback(async (id: string | number) => {
    setError(null);
    try {
      const fd = new FormData();
      fd.append('id', String(id));
      const res = await fetch('/api/delete-car.php', { method: 'POST', body: fd });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Failed to delete car');

      // remove locally
      setCars((prev) => prev.filter((c) => c.id !== id));
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete car';
      return { success: false, error: message };
    }
  }, []);

  return {
    cars,
    loading,
    error,
    addCar,
    updateCar,
    deleteCar,
  };
}
