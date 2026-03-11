export interface Shop {
  id: number;
  name: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  specializations: string;
  materials: string;
  certifications: string;
  erp_system: string;
  weekly_rfqs: number;
  turnaround_days: number;
  pain_points: string;
  outsourced_processes: string;
  suppliers_info: string;
  onboarding_complete: number;
  created_at: string;
}

export interface User {
  id: number;
  shop_id: number;
  email: string;
  password_hash: string;
  name: string;
  role: string;
  created_at: string;
}

export interface Customer {
  id: number;
  shop_id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  notes: string;
  avg_margin: number;
  total_orders: number;
  created_at: string;
}

export type RfqStatus = "incoming" | "analysis" | "quoted" | "won" | "lost";

export interface Rfq {
  id: number;
  shop_id: number;
  customer_id: number;
  title: string;
  status: RfqStatus;
  total_value: number;
  margin_pct: number;
  due_date: string;
  notes: string;
  customer_company?: string;
  created_at: string;
  updated_at: string;
}

export interface RfqPart {
  id: number;
  rfq_id: number;
  name: string;
  material: string;
  quantity: number;
  tolerance: string;
  surface_finish: string;
  machining_time_min: number;
  material_cost: number;
  unit_price: number;
  notes: string;
}

export interface Supplier {
  id: number;
  shop_id: number;
  name: string;
  category: string;
  materials: string;
  lead_time_days: number;
  rating: number;
  contact_email: string;
  contact_phone: string;
  location: string;
  notes: string;
}

export interface Message {
  id: number;
  shop_id: number;
  direction: "inbound" | "outbound";
  channel: string;
  from_name: string;
  subject: string;
  body: string;
  category: string;
  is_read: number;
  rfq_id: number | null;
  created_at: string;
}

export interface Activity {
  id: number;
  shop_id: number;
  type: string;
  title: string;
  description: string;
  icon: string;
  created_at: string;
}

export interface SessionData {
  userId?: number;
  shopId?: number;
  email?: string;
  name?: string;
}
