// Small helpers for demo-only features (inquiries/orders). No mock car data here — cars are database-driven.

export interface Inquiry {
  id: string;
  carId: string;
  carName: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  date: string;
  status: "new" | "contacted" | "closed";
}

const INQUIRIES_KEY = "carclub_fsd_inquiries";

export function getInquiries(): Inquiry[] {
  const stored = localStorage.getItem(INQUIRIES_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveInquiries(inquiries: Inquiry[]): void {
  localStorage.setItem(INQUIRIES_KEY, JSON.stringify(inquiries));
}

export function addInquiry(inquiry: Omit<Inquiry, "id" | "date" | "status">): Inquiry {
  const inquiries = getInquiries();
  const newInquiry: Inquiry = {
    ...inquiry,
    id: Date.now().toString(),
    date: new Date().toISOString(),
    status: "new",
  };
  inquiries.unshift(newInquiry);
  saveInquiries(inquiries);
  return newInquiry;
}

export function updateInquiryStatus(id: string, status: Inquiry["status"]): void {
  const inquiries = getInquiries();
  const index = inquiries.findIndex((i) => i.id === id);
  if (index !== -1) {
    inquiries[index].status = status;
    saveInquiries(inquiries);
  }
}

export function deleteInquiry(id: string): void {
  const inquiries = getInquiries();
  saveInquiries(inquiries.filter((i) => i.id !== id));
}

// Orders (demo only)
export interface Order {
  id: string;
  customer_name?: string;
  customer_email?: string;
  car_id?: string;
  car_name?: string;
  status?: 'pending' | 'approved' | 'rejected' | 'completed';
  total_amount?: number;
  created_at?: string;
}

const ORDERS_KEY = 'carclub_fsd_orders';

export function getOrders(): Order[] {
  const stored = localStorage.getItem(ORDERS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveOrders(orders: Order[]): void {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function addOrder(order: Omit<Order, 'id' | 'created_at'>): Order {
  const orders = getOrders();
  const newOrder: Order = {
    ...order,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
  };
  orders.unshift(newOrder);
  saveOrders(orders);
  return newOrder;
}

export function updateOrderStatus(id: string, status: Order['status']): Order | null {
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return null;
  orders[idx].status = status;
  saveOrders(orders);
  return orders[idx];
}

export function deleteOrder(id: string): boolean {
  const orders = getOrders();
  const filtered = orders.filter((o) => o.id !== id);
  if (filtered.length === orders.length) return false;
  saveOrders(filtered);
  return true;
}


