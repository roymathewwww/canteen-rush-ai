
export type MenuItem = {
  id: number
  name: string
  price: number
  prep_time: number
  complexity: 'low' | 'med' | 'high'
  category: string
  description?: string
  image_url?: string
  is_available?: boolean
}

export type Order = {
  id: string
  student_id: string
  vendor_id: string
  break_slot: string
  status: 'ordered' | 'preparing' | 'ready' | 'completed' | 'cancelled'
  order_time: string
  predicted_pickup?: string
  created_at?: string
  items?: OrderItem[]
}

export type OrderItem = {
  id?: number
  order_id?: string
  menu_item_id: number
  quantity: number
  price_at_time: number
  menu_item?: MenuItem // for joining
}
