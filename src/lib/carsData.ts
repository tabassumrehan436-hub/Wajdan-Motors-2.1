import invFortuner from "@/assets/inv-fortuner.png";
import invCivic from "@/assets/inv-civic.png";
import invHaval from "@/assets/inv-haval.png";
import heroLc300 from "@/assets/hero-lc300.png";

export interface Car {
  id: string;
  name: string;
  price: string;
  priceNum: number;
  specs: string;
  year: string;
  mileage: string;
  image: string;
  images?: string[];
  tag: string;
  make: string;
  bodyType: string;
  status: "available" | "sold";
  engine?: string;
  transmission?: string;
  fuelType?: string;
  color?: string;
  description?: string;
  seating?: string;
  features?: string[];
}

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

const defaultCars: Car[] = [
  {
    id: "1",
    name: "Haval H6 HEV",
    price: "PKR 12,500,000",
    priceNum: 12500000,
    specs: "165,700 km • Automatic",
    year: "2007",
    mileage: "165,700 km",
    image: invHaval,
    tag: "2007",
    make: "haval",
    bodyType: "suv",
    status: "available",
    engine: "2.0L Turbo",
    transmission: "Automatic",
    fuelType: "Hybrid",
    color: "White",
    seating: "5 Seater",
    features: ["Sunroof", "Leather Seats", "360° Camera", "Cruise Control", "Lane Assist", "Apple CarPlay"],
    description: "Experience the perfect blend of efficiency and power with the Haval H6 HEV. This premium SUV combines cutting-edge hybrid technology with luxurious comfort, making every journey memorable.",
  },
  {
    id: "2",
    name: "Honda Civic RS",
    price: "PKR 9,900,000",
    priceNum: 9900000,
    specs: "35,100 km • Automatic",
    year: "2024",
    mileage: "35,100 km",
    image: invCivic,
    tag: "2024",
    make: "honda",
    bodyType: "sedan",
    status: "available",
    engine: "1.5L VTEC Turbo",
    transmission: "CVT",
    fuelType: "Petrol",
    color: "Black",
    seating: "5 Seater",
    features: ["Honda Sensing", "Wireless Charging", "Premium Audio", "LED Headlights", "Sport Mode", "Android Auto"],
    description: "The Honda Civic RS represents the pinnacle of sporty sedan design. With its turbocharged engine and advanced safety features, it delivers an exhilarating driving experience without compromising on practicality.",
  },
  {
    id: "3",
    name: "Toyota Fortuner",
    price: "PKR 19,500,000",
    priceNum: 19500000,
    specs: "15,500 km • Automatic",
    year: "2024",
    mileage: "15,500 km",
    image: invFortuner,
    tag: "2024",
    make: "toyota",
    bodyType: "suv",
    status: "available",
    engine: "2.8L Diesel",
    transmission: "Automatic",
    fuelType: "Diesel",
    color: "Silver",
    seating: "7 Seater",
    features: ["4WD", "Cooled Seats", "JBL Sound System", "Terrain Select", "Rear AC", "Power Tailgate"],
    description: "Dominate any terrain with the legendary Toyota Fortuner. Built for adventure and designed for comfort, this SUV is the ultimate choice for those who demand excellence in every aspect.",
  },
  {
    id: "4",
    name: "Land Cruiser LC300",
    price: "PKR 95,000,000",
    priceNum: 95000000,
    specs: "0 km • Automatic",
    year: "2024",
    mileage: "0 km",
    image: heroLc300,
    tag: "2024",
    make: "toyota",
    bodyType: "suv",
    status: "available",
    engine: "3.5L V6 Twin Turbo",
    transmission: "Automatic",
    fuelType: "Petrol",
    color: "White Pearl",
    seating: "7 Seater",
    features: ["Fingerprint Start", "Multi-Terrain Monitor", "Kinetic Dynamic Suspension", "Heated Steering", "Premium Leather", "Mark Levinson Audio"],
    description: "The iconic Land Cruiser LC300 sets the benchmark for luxury SUVs worldwide. With unmatched off-road capability and refined on-road comfort, it's the ultimate expression of automotive excellence.",
  },
  {
    id: "5",
    name: "BMW M5 F90",
    price: "PKR 48,500,000",
    priceNum: 48500000,
    specs: "12,450 km • Automatic",
    year: "2023",
    mileage: "12,450 km",
    image: "https://images.unsplash.com/photo-1635770311293-b09d08a522fc?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    images: [
      "https://images.unsplash.com/photo-1635770311293-b09d08a522fc?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1616455263449-0bd3aac04029?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fGJtdyUyMG01fGVufDB8fDB8fHww",
      "https://images.unsplash.com/photo-1641230285232-95fd25d6286d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fGJtdyUyMG01fGVufDB8fDB8fHww",
    ],
    tag: "2023",
    make: "bmw",
    bodyType: "sedan",
    status: "available",
    engine: "4.4L Twin-Turbo V8",
    transmission: "Automatic (8-Speed M Sport)",
    fuelType: "Petrol",
    color: "Alpine White",
    seating: "5 Seater",
    features: [
      "M Sport Package",
      "M Carbon Fiber Trim",
      "Adaptive M Suspension",
      "M Performance Brakes",
      "Head-Up Display",
      "Panoramic Sunroof",
      "Premium Harman Kardon Audio",
      "Gesture Control",
      "Ambient Air Lighting",
      "M Sport Steering Wheel",
      "Wireless Charging",
      "360° Camera System",
      "Adaptive LED Headlights",
      "Active Aerodynamics",
      "Remote Engine Start"
    ],
    description: "Experience the ultimate in performance and luxury with the BMW M5 F90. Featuring a potent 4.4L Twin-Turbo V8 engine delivering 625 hp, advanced adaptive suspension, and cutting-edge technology, this is the definitive sports sedan. Meticulously maintained with full service history and M Sport package.",
  },
];

const CARS_KEY = "wajdan_motors_cars";
const INQUIRIES_KEY = "wajdan_motors_inquiries";

export function getCars(): Car[] {
  const stored = localStorage.getItem(CARS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(CARS_KEY, JSON.stringify(defaultCars));
  return defaultCars;
}

export function saveCars(cars: Car[]): void {
  localStorage.setItem(CARS_KEY, JSON.stringify(cars));
}

export function addCar(car: Omit<Car, "id">): Car {
  const cars = getCars();
  const newCar: Car = {
    ...car,
    id: Date.now().toString(),
  };
  cars.push(newCar);
  saveCars(cars);
  return newCar;
}

export function updateCar(id: string, updates: Partial<Car>): Car | null {
  const cars = getCars();
  const index = cars.findIndex((c) => c.id === id);
  if (index === -1) return null;
  cars[index] = { ...cars[index], ...updates };
  saveCars(cars);
  return cars[index];
}

export function deleteCar(id: string): boolean {
  const cars = getCars();
  const filtered = cars.filter((c) => c.id !== id);
  if (filtered.length === cars.length) return false;
  saveCars(filtered);
  return true;
}

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

// Orders localStorage helpers
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

const ORDERS_KEY = 'wajdan_motors_orders';

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
