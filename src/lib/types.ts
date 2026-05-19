export type Product = {
  id: string
  name: string
  description: string
  price: number
  category: string
  stock: number
  image_url: string
  specs: Record<string, string>
  created_at: string
}

export type Order = {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  type: 'shop' | 'custom_pc' | 'service'
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  total: number
  notes: string
  created_at: string
}

export type OrderItem = {
  id: string
  order_id: string
  product_id: string
  product_name: string
  quantity: number
  price: number
}

export type ContactMessage = {
  id: string
  name: string
  email: string
  subject: string
  message: string
  created_at: string
}

export type CartItem = {
  product: Product
  quantity: number
}