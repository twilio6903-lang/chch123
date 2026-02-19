
export enum Category {
  MAIN = 'main',
  SOUPS = 'soups',
  BAKERY = 'bakery',
  SALADS = 'salads',
  DRINKS = 'drinks'
}

export interface Dish {
  id: string;
  name: string;
  category: Category;
  price: number;
  image: string;
  description: string;
  ingredients: string;
  available: boolean;
  weight?: string;
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COOKING = 'cooking',
  DELIVERING = 'delivering',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export type PaymentMethod = 'online' | 'cash';

export interface CartItem extends Dish {
  quantity: number;
}

export interface Order {
  id: string;
  user_id: string;
  created_at: string;
  items: CartItem[];
  total_amount: number;
  status: OrderStatus;
  delivery_address: string;
  contact_phone: string;
  comment?: string;
  payment_status: 'paid' | 'unpaid';
  payment_method: PaymentMethod;
  payment_id?: string;
}

export interface Profile {
  id: string;
  full_name: string;
  address: string;
  role: 'admin' | 'user';
  email: string;
}
