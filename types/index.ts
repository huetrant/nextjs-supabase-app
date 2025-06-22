// Common interfaces for the application

export interface Product {
  id: string;
  name: string;
  descriptions?: string;
  link_image?: string;
  categories_id?: string;
  categories?: { name_cat: string; description?: string };
  created_at?: string;
}

export interface Category {
  id: string;
  name_cat: string;
  description?: string;
}

export interface Customer {
  id: string;
  name: string;
  sex?: string;
  age?: number;
  location?: string;
  picture?: string;
  embedding?: string;
  username?: string;
  password?: string;
}

export interface Order {
  id: string;
  order_date: string;
  total_amount: number;
  customer_id?: string;
  status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  store_id?: string;
  customers?: { name: string; location?: string; sex?: string; age?: number; username?: string };
  store?: { name_store: string; address?: string; phone?: string; open_close?: string };
  order_details?: OrderDetail[];
}

export interface OrderDetail {
  id: string;
  order_id: string;
  variant_id?: string;
  quantity: number;
  rate?: number;
  unit_price: number;
  products?: Product;
  variants?: Variant;
}

// Legacy interface for backward compatibility
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  products?: Product;
  variants?: Variant;
}

export interface StoreData {
  id: string;
  name_store: string;
  address?: string;
  phone?: string;
  open_close?: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalStores: number;
  totalCategories: number;
  totalVariants: number;
}

export interface Variant {
  id: string;
  product_id: string;
  Beverage_Option?: string;
  calories?: number;
  dietary_fibre_g?: number;
  sugars_g?: number;
  protein_g?: number;
  'vitamin_a_%'?: number;
  'vitamin_c_%'?: number;
  caffeine_mg?: number;
  price?: number;
  sales_rank?: number;
}

// Legacy Category interface for backward compatibility
// Note: This is different from the main Category interface above
export interface LegacyCategory {
  id: string;
  name: string;
  description?: string;
}