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
  images?: ProductImage[] // Images specific to this variant
  createdAt: string
  updatedAt: string
}

// ProductImage
export interface ProductImage {
  id: string
  productId: string
  productVariantId?: string | null // Optional: associates image with specific variant
  url: string
  isCover: boolean
  createdAt: string
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
  user?: User
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
  revenue?: number // Optional since backend might not return it
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

// Login DTO
export interface LoginDTO {
  email: string
  password: string
}

// Create Category DTO
export interface CreateCategoryDTO {
  name: string
  description?: string
}

// Update Category DTO
export interface UpdateCategoryDTO {
  name?: string
  description?: string
}

// Create Product DTO
export interface CreateProductDTO {
  name: string
  description?: string
  basePrice: number
  brand?: string
  categoryId: string
  variants?: Array<{
    attributes: Record<string, string>
    price: number
    stock: number
    images?: Array<{ url: string; isCover?: boolean }> // Images for this variant
  }>
  images?: string[] // General product images (not associated with any variant)
}

// Update Product DTO
export interface UpdateProductDTO {
  name?: string
  description?: string
  basePrice?: number
  brand?: string
  categoryId?: string
  variants?: Array<{
    attributes: Record<string, string>
    price: number
    stock: number
    images?: Array<{ url: string; isCover?: boolean }> // Images for this variant
  }>
  images?: string[] // General product images (not associated with any variant)
}

// Update Order Status DTO
export interface UpdateOrderStatusDTO {
  status: OrderStatus
}

