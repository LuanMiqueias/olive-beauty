// User
export interface User {
  id: string
  email: string
  name?: string
  role: 'ADMIN' | 'USER'
  createdAt: string
  updatedAt: string
}

// Category
export interface Category {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
  products?: Product[]
}

// Product
export interface Product {
  id: string
  name: string
  description?: string
  basePrice: number
  brand?: string
  categoryId: string
  category?: Category
  variants?: ProductVariant[]
  images?: ProductImage[]
  createdAt: string
  updatedAt: string
}

// ProductVariant
export interface ProductVariant {
  id: string
  productId: string
  attributes: string // JSON string: {"color": "red", "size": "50ml"}
  price: number
  stock: number
  createdAt: string
  updatedAt: string
}

// ProductImage
export interface ProductImage {
  id: string
  productId: string
  url: string
  isCover: boolean
  createdAt: string
}

// Cart
export interface Cart {
  id: string
  userId: string
  items: CartItem[]
  createdAt: string
  updatedAt: string
}

// CartItem
export interface CartItem {
  id: string
  cartId: string
  productId: string
  productVariantId?: string
  quantity: number
  product?: Product
  productVariant?: ProductVariant
  createdAt: string
  updatedAt: string
}

// Order
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SENT' | 'DELIVERED' | 'CANCELLED'

export interface Order {
  id: string
  userId: string
  status: OrderStatus
  total: number
  shippingAddress: string
  shippingName: string
  shippingPhone?: string
  items: OrderItem[]
  createdAt: string
  updatedAt: string
}

// OrderItem
export interface OrderItem {
  id: string
  orderId: string
  productId: string
  productVariantId?: string
  quantity: number
  price: number
  product?: Product
  productVariant?: ProductVariant
  createdAt: string
}

// Favorite
export interface Favorite {
  id: string
  userId: string
  productId: string
  product?: Product
  createdAt: string
}

// Dashboard Stats
export interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  totalUsers: number
}

// Top Product
export interface TopProduct {
  product: Product
  totalSold: number
  revenue: number
}

// Revenue/Orders Over Time
export interface TimeSeriesData {
  date: string
  revenue?: number
  count?: number
}

// Orders By Status
export interface OrdersByStatus {
  status: OrderStatus
  count: number
}

// Sales By Category
export interface SalesByCategory {
  category: Category
  revenue: number
  count: number
}

// API Response Types
export interface ApiResponse<T> {
  status: 'success' | 'error'
  data?: T
  message?: string
  errors?: unknown
}

// Auth Response
export interface AuthResponse {
  user: User
  token: string
}

// Login/Register DTOs
export interface LoginDTO {
  email: string
  password: string
}

export interface RegisterDTO {
  email: string
  password: string
  name?: string
}

// Add to Cart DTO
export interface AddToCartDTO {
  productId: string
  productVariantId?: string
  quantity: number
}

// Update Cart Item DTO
export interface UpdateCartItemDTO {
  quantity: number
}

// Create Order DTO
export interface CreateOrderDTO {
  shippingAddress: string
  shippingName: string
  shippingPhone?: string
}

// Update Order Status DTO
export interface UpdateOrderStatusDTO {
  status: OrderStatus
}

