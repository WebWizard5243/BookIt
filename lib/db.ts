import { Pool } from "pg"

const pool = new Pool({
    connectionString : process.env.DATABASE_URL,
});


export interface Experience {
  id: number
  name: string
  description: string
  price: number
  image_url: string
  location: string
  minAge: number
}

export interface Slot {
  id: number
  date: string
  time: string
  totalCapacity: number
  bookedCount: number
  available: number
}

export interface ExperienceWithSlots extends Experience {
  slots: Slot[]
}

export interface Booking {
  id: number
  referenceId: string
  slotId: number
  fullName: string
  email: string
  quantity: number
  promoCode?: string | null
  subtotal: number
  taxes: number
  total: number
  createdAt: Date
}

export interface promoCode {
  discountValue: any;
  discountType: string;
  id : number,
  code : string,
  discount_type : string,
  discount_value : number,
  active : boolean,
}

export default pool;