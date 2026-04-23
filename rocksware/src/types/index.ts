export interface Shoe {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  images: string[];
  category: ShoeCategory;
  sizes: number[];
  colors: string[];
  stock: number;
  featured: boolean;
  createdAt: Date;
}

export type ShoeCategory =
  | "sneakers"
  | "heels"
  | "boots"
  | "loafers"
  | "sandals"
  | "formal"
  | "kids";

export interface CartItem {
  shoe: Shoe;
  size: number;
  color: string;
  quantity: number;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: "customer" | "admin";
  createdAt: Date;
}

export interface Order {
  id: string;
  userId: string | null;
  guestEmail: string | null;
  items: CartItem[];
  total: number;
  status: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentMethod: "mpesa" | "airtel" | "visa";
  paymentRef: string;
  shippingAddress: ShippingAddress;
  createdAt: Date;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  county: string;
}