export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  price_per_meter: number;
  category: string;
  colors: FabricColor[];
  images: string[];
  stock_quantity: number;
  is_active: boolean;
  created_at?: string;
}

export interface FabricColor {
  name: string;
  hex: string;
  image?: string;
}

export interface SkinTone {
  name: string;
  hex: string;
  label: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selected_color?: FabricColor;
  meters: number;
}

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  shipping_address: ShippingAddress;
  payment_status: 'unpaid' | 'paid' | 'refunded';
  payment_intent_id?: string;
  tracking_number?: string;
  items?: OrderItem[];
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  meters: number;
  unit_price: number;
  total_price: number;
}

export interface ShippingAddress {
  full_name: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

export interface MeasurementInput {
  height_cm: number;
  weight_kg: number;
  dress_style: 'fitted' | 'semi-fitted' | 'loose' | 'mermaid';
  fabric_width: 45 | 60;
  has_pattern: boolean;
}

export interface MeasurementResult {
  estimated_meters: number;
  recommended_size: string;
  bmi: number;
  notes: string[];
}

export interface LiveStream {
  id: string;
  title: string;
  description: string;
  host_id: string;
  host_name: string;
  status: 'scheduled' | 'live' | 'ended';
  scheduled_at: string;
  viewer_count: number;
  products: StreamProduct[];
  stream_url?: string;
  chat_enabled: boolean;
}

export interface StreamProduct {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image: string;
  description: string;
  stock: number;
  is_featured: boolean;
  discount_percentage?: number;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: 'customer' | 'admin';
  avatar_url?: string;
  created_at: string;
}

export interface DashboardStats {
  total_products: number;
  total_orders: number;
  total_customers: number;
  total_revenue: number;
  recent_orders: Order[];
}
