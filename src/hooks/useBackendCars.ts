import { useState, useEffect, useCallback } from 'react';

// Matches backend schema exactly (fields returned by API) — single source of truth Car type
export interface Car {
  id: number;                      // DB primary key — always a number
  name: string;
  make?: string | null;
  body_type?: string | null;
  year?: number | null;
  price?: number | null;
  mileage?: number | null;         // mileage stored as number
  primary_image?: string | null;   // use backend primary_image instead of legacy `image`
  images?: string[];
  status?: string | null;
  engine?: string | null;
  transmission?: string | null;
  fuel_type?: string | null;
  color?: string | null;
  seating?: number | null;
  description?: string | null;
  features?: string | null;        // backend stores as TEXT (string or comma list)
  created_at?: string | null;
  updated_at?: string | null;
}

// Normalizer used everywhere to keep mapping consistent
function normalizeCar(api: unknown): Car {
  const obj = api as Record<string, unknown>;
  return {
    id: Number(obj.id),
    name: String(obj.name),
    make: (obj.make as string | null) ?? null,
    body_type: (obj.body_type as string | null) ?? null,
    year: obj.year !== null && obj.year !== undefined ? Number(obj.year) : null,
    price: obj.price !== null && obj.price !== undefined ? Number(obj.price) : null,
    mileage: obj.mileage !== null && obj.mileage !== undefined ? Number(obj.mileage) : null,
    primary_image: (obj.primary_image as string | null) ?? (Array.isArray(obj.images) && obj.images[0]) ?? null,
    images: Array.isArray(obj.images) ? (obj.images as string[]) : (obj.images ? [(obj.images as string)] : []),
    status: (obj.status as string | null) ?? null,
    engine: (obj.engine as string | null) ?? null,
    transmission: (obj.transmission as string | null) ?? null,
    fuel_type: (obj.fuel_type as string | null) ?? null,
    color: (obj.color as string | null) ?? null,
    seating: obj.seating !== null && obj.seating !== undefined ? Number(obj.seating) : null,
    description: (obj.description as string | null) ?? null,
    features: (obj.features as string | null) ?? null,
    created_at: (obj.created_at as string | null) ?? null,
    updated_at: (obj.updated_at as string | null) ?? null,
  };
}

interface UseBackendCarsReturn {
  cars: Car[];
  loading: boolean;
  error: string | null;
  addCar: (data: Omit<Car, 'id' | 'created_at' | 'updated_at'>) => Promise<{ success: boolean; error?: string }>;
  updateCar: (id: number, data: Partial<Omit<Car, 'id' | 'created_at' | 'updated_at'>>) => Promise<{ success: boolean; error?: string }>;
  deleteCar: (id: number) => Promise<{ success: boolean; error?: string }>;
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
        const body = await res.json() as { data: unknown[] };
        const data = Array.isArray(body.data) ? body.data : [];
        // Normalize using helper
        const normalized = data.map((c: unknown) => normalizeCar(c));
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
      fd.append('price', String((data.price ?? 0)));
      fd.append('make', (data.make ?? ''));
      fd.append('body_type', (data.body_type ?? ''));
      fd.append('year', String((data.year ?? '')));
      fd.append('mileage', String(data.mileage ?? ''));
      fd.append('status', (data.status ?? 'available'));
      fd.append('engine', (data.engine ?? ''));
      fd.append('transmission', (data.transmission ?? ''));
      fd.append('fuel_type', (data.fuel_type ?? ''));
      fd.append('color', (data.color ?? ''));
      fd.append('seating', String((data.seating ?? '')));
      fd.append('description', (data.description ?? ''));
      fd.append('features', Array.isArray(data.features) ? (data.features as string[]).join(',') : ((data.features as string) || ''));

      // primary image can be a data URL or external URL; only upload if data URL
      const primary = (data.primary_image || '') as string;
      if (typeof primary === 'string' && primary.startsWith('data:')) {
        fd.append('primary_image', base64ToFile(primary, 'primary.jpg'));
      }

      // additional images (base64)
      if (Array.isArray(data.images)) {
        data.images.forEach((img: string, idx: number) => {
          if (typeof img === 'string' && img.startsWith('data:')) {
            fd.append('images[]', base64ToFile(img, `img_${idx}.jpg`));
          }
        });
      }

      // attach CSRF token (set after admin login)
      const csrf = sessionStorage.getItem('csrfToken');
      if (csrf) fd.append('csrf_token', csrf);

      const res = await fetch('/api/add-car.php', { method: 'POST', body: fd, credentials: 'same-origin' });
      const body = await res.json() as { error?: string; message?: string };
      if (!res.ok) throw new Error(body.error || 'Failed to add car');

      // Refresh list (use same normalizer)
      const refresh = await fetch('/api/get-cars.php');
      const refreshed = await refresh.json() as { data: unknown[] };
      setCars((refreshed.data || []).map((c: unknown) => normalizeCar(c)));

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add car';
      return { success: false, error: message };
    }
  }, []);

  // Update car
  const updateCar = useCallback(async (id: number, data: Partial<Omit<Car, 'id' | 'created_at' | 'updated_at'>>) => {
    setError(null);
    try {
      const fd = new FormData();
      fd.append('id', String(id));
      Object.entries(data).forEach(([k, v]) => {
        if (k === 'primary_image' && typeof v === 'string' && v.startsWith('data:')) {
          fd.append('primary_image', base64ToFile(v, 'primary.jpg'));
        } else if (k === 'images' && Array.isArray(v)) {
          (v as string[]).forEach((img, idx) => {
            if (typeof img === 'string' && img.startsWith('data:')) {
              fd.append('images[]', base64ToFile(img, `img_${idx}.jpg`));
            }
          });
        } else {
          fd.append(k, String(v ?? ''));
        }
      });

      // attach CSRF token (set after admin login)
      const csrf = sessionStorage.getItem('csrfToken');
      if (csrf) fd.append('csrf_token', csrf);

      const res = await fetch('/api/update-car.php', { method: 'POST', body: fd, credentials: 'same-origin' });
      const body = await res.json() as { error?: string; message?: string };
      if (!res.ok) throw new Error(body.error || 'Failed to update car');

      // refresh (use normalizeCar)
      const refresh = await fetch('/api/get-cars.php');
      const refreshed = await refresh.json() as { data: unknown[] };
      setCars((refreshed.data || []).map((c: unknown) => normalizeCar(c)));

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update car';
      return { success: false, error: message };
    }
  }, []);

  // Delete car
  const deleteCar = useCallback(async (id: number) => {
    setError(null);
    try {
      const fd = new FormData();
      fd.append('id', String(id));
      // attach CSRF token (set after admin login)
      const csrf = sessionStorage.getItem('csrfToken');
      if (csrf) fd.append('csrf_token', csrf);

      const res = await fetch('/api/delete-car.php', { method: 'POST', body: fd, credentials: 'same-origin' });
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
