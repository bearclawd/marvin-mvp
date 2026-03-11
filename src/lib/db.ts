import { hashSync, compareSync } from "bcryptjs";

// ---- In-memory store for prototype ----
// All demo data lives here. No external DB needed.

export interface Shop {
  id: number; name: string; website: string; email: string; phone: string;
  address: string; specializations: string; materials: string; certifications: string;
  erp_system: string; weekly_rfqs: number; turnaround_days: number;
  pain_points: string; outsourced_processes: string; suppliers_info: string;
  onboarding_complete: number;
}

export interface User {
  id: number; shop_id: number; email: string; password_hash: string; name: string; role: string;
}

export interface Customer {
  id: number; shop_id: number; name: string; company: string; email: string;
  phone: string; notes: string; avg_margin: number; total_orders: number;
}

export interface RFQ {
  id: number; shop_id: number; customer_id: number; title: string; status: string;
  total_value: number; margin_pct: number; due_date: string; notes: string;
  created_at: string; updated_at: string;
}

export interface RFQPart {
  id: number; rfq_id: number; name: string; material: string; quantity: number;
  tolerance: string; surface_finish: string; machining_time_min: number;
  material_cost: number; unit_price: number; notes: string;
}

export interface Supplier {
  id: number; shop_id: number; name: string; category: string; materials: string;
  lead_time_days: number; rating: number; contact_email: string; contact_phone: string;
  location: string; notes: string;
}

export interface Message {
  id: number; shop_id: number; direction: string; channel: string; from_name: string;
  subject: string; body: string; category: string; is_read: number; rfq_id: number | null;
  created_at: string;
}

export interface Activity {
  id: number; shop_id: number; type: string; title: string; description: string;
  icon: string; created_at: string;
}

class InMemoryDB {
  shops: Shop[] = [];
  users: User[] = [];
  customers: Customer[] = [];
  rfqs: RFQ[] = [];
  rfq_parts: RFQPart[] = [];
  suppliers: Supplier[] = [];
  messages: Message[] = [];
  activities: Activity[] = [];
  private seeded = false;

  seed() {
    if (this.seeded) return;
    this.seeded = true;

    // Shop
    this.shops.push({
      id: 1, name: "Precision CNC AG", website: "https://precision-cnc.ch",
      email: "info@precision-cnc.ch", phone: "+41 52 214 7800",
      address: "Industriestrasse 42, 8400 Winterthur, Switzerland",
      specializations: "Medical devices, Aerospace components, Precision instruments",
      materials: "Aluminum (6061, 7075), Titanium (Ti6Al4V), Stainless Steel (316L), PEEK, Brass",
      certifications: "ISO 9001:2015, ISO 13485 (Medical), AS9100D (Aerospace)",
      erp_system: "None", weekly_rfqs: 20, turnaround_days: 5,
      pain_points: "Manual quoting takes too long, inconsistent pricing, knowledge loss when employees leave",
      outsourced_processes: "Anodizing, Black oxide, Electropolishing, Heat treatment",
      suppliers_info: "3 main material suppliers, 2 surface treatment partners",
      onboarding_complete: 1,
    });

    // User
    this.users.push({
      id: 1, shop_id: 1, email: "pascal@precision-cnc.ch",
      password_hash: hashSync("demo1234", 10),
      name: "Pascal Behr", role: "admin",
    });

    // Customers
    const customersData = [
      { id: 1, name: "Thomas Müller", company: "MedTech Solutions GmbH", email: "t.mueller@medtech-solutions.de", avg_margin: 15.2, total_orders: 23 },
      { id: 2, name: "Andrea Frei", company: "Aeroparts Zürich AG", email: "a.frei@aeroparts-zh.ch", avg_margin: 22.5, total_orders: 15 },
      { id: 3, name: "Kurt Fischer", company: "Fischer Automotive GmbH", email: "k.fischer@fischer-auto.de", avg_margin: 8.8, total_orders: 45 },
      { id: 4, name: "Claudia Wenger", company: "SwissInstruments AG", email: "c.wenger@swissinstruments.ch", avg_margin: 28.0, total_orders: 12 },
      { id: 5, name: "Markus Steiner", company: "Robotix Engineering GmbH", email: "m.steiner@robotix-eng.de", avg_margin: 18.7, total_orders: 8 },
      { id: 6, name: "Sarah Brunner", company: "OptikTech Basel AG", email: "s.brunner@optiktech.ch", avg_margin: 31.5, total_orders: 19 },
      { id: 7, name: "Hans Weber", company: "BauMasch Luzern GmbH", email: "h.weber@baumasch.ch", avg_margin: 11.2, total_orders: 32 },
      { id: 8, name: "Lena Hofmann", company: "NeuroDevice AG", email: "l.hofmann@neurodevice.ch", avg_margin: 35.7, total_orders: 6 },
    ];
    this.customers = customersData.map(c => ({ ...c, shop_id: 1, phone: "", notes: "" }));

    // RFQs
    this.rfqs = [
      { id: 1, shop_id: 1, customer_id: 1, title: "Titanium Surgical Instrument Housings", status: "new", total_value: 18750, margin_pct: 16.5, due_date: "2026-03-28", notes: "Rush order. Patient-specific implant housings. Full ISO 13485 documentation required.", created_at: "2026-03-10", updated_at: "2026-03-10" },
      { id: 2, shop_id: 1, customer_id: 2, title: "Aluminum Avionics Enclosure Set", status: "analysis", total_value: 32400, margin_pct: 23.8, due_date: "2026-04-15", notes: "AS9100D compliant. First article inspection required.", created_at: "2026-03-08", updated_at: "2026-03-10" },
      { id: 3, shop_id: 1, customer_id: 3, title: "Steel Transmission Brackets (Series)", status: "quoted", total_value: 8960, margin_pct: 9.2, due_date: "2026-04-02", notes: "Repeat order. Same specs as last batch.", created_at: "2026-03-05", updated_at: "2026-03-09" },
      { id: 4, shop_id: 1, customer_id: 4, title: "PEEK Measurement Device Components", status: "quoted", total_value: 14200, margin_pct: 29.5, due_date: "2026-04-10", notes: "High-precision PEEK parts. ±0.005mm on critical dims.", created_at: "2026-03-06", updated_at: "2026-03-09" },
      { id: 5, shop_id: 1, customer_id: 5, title: "Stainless Steel Robot Joint Assemblies", status: "analysis", total_value: 22100, margin_pct: 19.4, due_date: "2026-04-22", notes: "Complex 5-axis geometry. Surface finish critical for bearing contact.", created_at: "2026-03-09", updated_at: "2026-03-10" },
      { id: 6, shop_id: 1, customer_id: 6, title: "Aluminum Optical Lens Mount Assembly", status: "won", total_value: 9800, margin_pct: 33.2, due_date: "2026-03-20", notes: "Ultra-precision. Thermal stability critical.", created_at: "2026-02-28", updated_at: "2026-03-08" },
      { id: 7, shop_id: 1, customer_id: 7, title: "Hydraulic Manifold Blocks (Batch Order)", status: "won", total_value: 45600, margin_pct: 12.1, due_date: "2026-04-30", notes: "120 pieces. Standard production run.", created_at: "2026-03-01", updated_at: "2026-03-07" },
      { id: 8, shop_id: 1, customer_id: 8, title: "Titanium Neurostimulator Enclosures", status: "new", total_value: 28500, margin_pct: 36.8, due_date: "2026-05-01", notes: "Medical grade Ti. Biocompatibility cert required.", created_at: "2026-03-10", updated_at: "2026-03-10" },
    ];

    // RFQ Parts (for RFQ #1 — Titanium Surgical)
    this.rfq_parts = [
      { id: 1, rfq_id: 1, name: "Instrument Housing Upper", material: "Ti6Al4V", quantity: 25, tolerance: "±0.01mm", surface_finish: "Ra 0.4μm", machining_time_min: 145, material_cost: 85, unit_price: 420, notes: "" },
      { id: 2, rfq_id: 1, name: "Instrument Housing Lower", material: "Ti6Al4V", quantity: 25, tolerance: "±0.01mm", surface_finish: "Ra 0.4μm", machining_time_min: 130, material_cost: 78, unit_price: 380, notes: "" },
      { id: 3, rfq_id: 1, name: "Locking Pin", material: "Ti6Al4V", quantity: 50, tolerance: "±0.005mm", surface_finish: "Electropolished", machining_time_min: 22, material_cost: 12, unit_price: 55, notes: "" },
      // Parts for RFQ #2 — Avionics
      { id: 4, rfq_id: 2, name: "Main Enclosure Body", material: "AL 7075-T6", quantity: 10, tolerance: "±0.02mm", surface_finish: "Chromate conversion", machining_time_min: 280, material_cost: 145, unit_price: 1850, notes: "" },
      { id: 5, rfq_id: 2, name: "EMI Shield Plate", material: "AL 6061-T6", quantity: 10, tolerance: "±0.05mm", surface_finish: "Nickel plated", machining_time_min: 85, material_cost: 42, unit_price: 620, notes: "" },
      { id: 6, rfq_id: 2, name: "Connector Panel", material: "AL 7075-T6", quantity: 10, tolerance: "±0.01mm", surface_finish: "Hard anodized", machining_time_min: 120, material_cost: 68, unit_price: 770, notes: "" },
      // Parts for RFQ #3 — Brackets
      { id: 7, rfq_id: 3, name: "Transmission Bracket Left", material: "Steel 4140", quantity: 100, tolerance: "±0.05mm", surface_finish: "Black oxide", machining_time_min: 18, material_cost: 8.5, unit_price: 44.8, notes: "" },
      { id: 8, rfq_id: 3, name: "Transmission Bracket Right", material: "Steel 4140", quantity: 100, tolerance: "±0.05mm", surface_finish: "Black oxide", machining_time_min: 18, material_cost: 8.5, unit_price: 44.8, notes: "" },
    ];

    // Suppliers
    this.suppliers = [
      { id: 1, shop_id: 1, name: "Almetall AG", category: "Raw Materials", materials: "Aluminum 6061, 7075, 2024", lead_time_days: 3, rating: 4.8, contact_email: "orders@almetall.ch", contact_phone: "+41 44 312 5500", location: "Dietikon, ZH", notes: "Primary aluminum supplier" },
      { id: 2, shop_id: 1, name: "TitanSource GmbH", category: "Raw Materials", materials: "Titanium Ti6Al4V, CP Grade 2", lead_time_days: 7, rating: 4.5, contact_email: "sales@titansource.de", contact_phone: "+49 711 234 5600", location: "Stuttgart, DE", notes: "Medical-grade titanium specialist" },
      { id: 3, shop_id: 1, name: "Galvaswiss AG", category: "Surface Treatment", materials: "Anodizing, Hard anodizing, Chromate", lead_time_days: 5, rating: 4.6, contact_email: "info@galvaswiss.ch", contact_phone: "+41 52 233 4400", location: "Winterthur, ZH", notes: "Our go-to for anodizing" },
      { id: 4, shop_id: 1, name: "Härterei Gerster AG", category: "Heat Treatment", materials: "Hardening, Tempering, Case hardening", lead_time_days: 4, rating: 4.3, contact_email: "auftraege@gerster.ch", contact_phone: "+41 62 887 2222", location: "Egerkingen, SO", notes: "" },
      { id: 5, shop_id: 1, name: "Stahl Schweiz AG", category: "Raw Materials", materials: "Steel 4140, 316L, 304, 17-4PH", lead_time_days: 2, rating: 4.7, contact_email: "verkauf@stahl-schweiz.ch", contact_phone: "+41 44 456 7890", location: "Kloten, ZH", notes: "Fast delivery, good pricing" },
      { id: 6, shop_id: 1, name: "PolymerParts GmbH", category: "Raw Materials", materials: "PEEK, Delrin, PTFE, Ultem", lead_time_days: 5, rating: 4.2, contact_email: "info@polymerparts.de", contact_phone: "+49 89 555 1234", location: "Munich, DE", notes: "Engineering plastics" },
      { id: 7, shop_id: 1, name: "Electroswiss AG", category: "Surface Treatment", materials: "Electropolishing, Passivation", lead_time_days: 6, rating: 4.4, contact_email: "orders@electroswiss.ch", contact_phone: "+41 56 437 2200", location: "Baden, AG", notes: "Medical-grade electropolishing" },
      { id: 8, shop_id: 1, name: "SwissExpress Logistics", category: "Fulfillment", materials: "Domestic & international shipping", lead_time_days: 1, rating: 4.9, contact_email: "business@swissexpress.ch", contact_phone: "+41 58 668 0000", location: "Zürich, ZH", notes: "Priority shipping partner" },
    ];

    // Messages
    this.messages = [
      { id: 1, shop_id: 1, direction: "inbound", channel: "email", from_name: "Thomas Müller", subject: "New RFQ: Titanium Surgical Instrument Housings", body: "Dear Precision CNC team, please find attached our latest RFQ for titanium surgical instrument housings. We need 25 units with ISO 13485 documentation. Rush delivery requested by March 28.", category: "rfq", is_read: 0, rfq_id: 1, created_at: "2026-03-10T14:30:00" },
      { id: 2, shop_id: 1, direction: "inbound", channel: "email", from_name: "Lena Hofmann", subject: "RFQ: Titanium Neurostimulator Enclosures", body: "Hi, we have a new project requiring titanium enclosures for our neurostimulator device. Medical grade Ti required with biocompatibility certification. Please quote for 15 units.", category: "rfq", is_read: 0, rfq_id: 8, created_at: "2026-03-10T16:15:00" },
      { id: 3, shop_id: 1, direction: "inbound", channel: "email", from_name: "Almetall AG", subject: "RE: Quote for AL 7075-T6 plate", body: "Dear valued customer, we can deliver 10 sheets of AL 7075-T6 (25x500x1000mm) at CHF 185/sheet. Delivery in 5 days. Please confirm.", category: "supplier", is_read: 1, rfq_id: null, created_at: "2026-03-09T09:00:00" },
      { id: 4, shop_id: 1, direction: "outbound", channel: "email", from_name: "Marvin (Precision CNC)", subject: "Quote: Steel Transmission Brackets", body: "Dear Herr Fischer, please find attached our quote for the steel transmission brackets series order. 200 pieces at CHF 44.80/pc. Delivery by April 2.", category: "quote", is_read: 1, rfq_id: 3, created_at: "2026-03-09T11:30:00" },
      { id: 5, shop_id: 1, direction: "inbound", channel: "email", from_name: "Galvaswiss AG", subject: "Pickup ready: Black anodizing batch", body: "Your anodizing order (Ref: GS-2026-0847) is complete and ready for pickup. 120 aluminum parts, black anodize Type II.", category: "supplier", is_read: 0, rfq_id: null, created_at: "2026-03-10T08:45:00" },
    ];

    // Activities  
    this.activities = [
      { id: 1, shop_id: 1, type: "rfq", title: "New RFQ received", description: "Titanium Surgical Instrument Housings from MedTech Solutions GmbH — CHF 18,750", icon: "inbox", created_at: "2026-03-10T14:30:00" },
      { id: 2, shop_id: 1, type: "rfq", title: "New RFQ received", description: "Titanium Neurostimulator Enclosures from NeuroDevice AG — CHF 28,500", icon: "inbox", created_at: "2026-03-10T16:15:00" },
      { id: 3, shop_id: 1, type: "analysis", title: "RFQ analysis complete", description: "Aluminum Avionics Enclosure Set — 4 parts identified, estimated margin 23.8%", icon: "search", created_at: "2026-03-10T10:20:00" },
      { id: 4, shop_id: 1, type: "quote", title: "Quote sent automatically", description: "Steel Transmission Brackets to Fischer Automotive GmbH — CHF 8,960", icon: "send", created_at: "2026-03-09T11:30:00" },
      { id: 5, shop_id: 1, type: "order", title: "Order confirmed", description: "Aluminum Optical Lens Mount Assembly from OptikTech Basel — CHF 9,800", icon: "check", created_at: "2026-03-08T15:45:00" },
      { id: 6, shop_id: 1, type: "order", title: "Order confirmed", description: "Hydraulic Manifold Blocks from BauMasch Luzern — CHF 45,600", icon: "check", created_at: "2026-03-07T09:10:00" },
      { id: 7, shop_id: 1, type: "material", title: "Material ordered", description: "Al 7075-T6 plate from Almetall — delivery in 5 days", icon: "package", created_at: "2026-03-09T09:30:00" },
      { id: 8, shop_id: 1, type: "supplier", title: "Surface finishing complete", description: "Galvaswiss: Black anodizing batch for OptikTech order ready for pickup", icon: "truck", created_at: "2026-03-10T08:45:00" },
    ];
  }

  // Query helpers
  getUserByEmail(email: string): (User & { shop_name: string }) | undefined {
    this.seed();
    const user = this.users.find(u => u.email === email);
    if (!user) return undefined;
    const shop = this.shops.find(s => s.id === user.shop_id);
    return { ...user, shop_name: shop?.name || "" };
  }

  getUserById(id: number): (User & { shop_name: string }) | undefined {
    this.seed();
    const user = this.users.find(u => u.id === id);
    if (!user) return undefined;
    const shop = this.shops.find(s => s.id === user.shop_id);
    return { ...user, shop_name: shop?.name || "" };
  }

  getShop(id: number): Shop | undefined {
    this.seed();
    return this.shops.find(s => s.id === id);
  }

  getRFQs(shopId: number): (RFQ & { customer_company: string })[] {
    this.seed();
    return this.rfqs.filter(r => r.shop_id === shopId).map(r => {
      const customer = this.customers.find(c => c.id === r.customer_id);
      return { ...r, customer_company: customer?.company || "" };
    });
  }

  getRFQ(id: number): (RFQ & { customer_company: string; customer_name: string; customer_email: string; customer_avg_margin: number }) | undefined {
    this.seed();
    const rfq = this.rfqs.find(r => r.id === id);
    if (!rfq) return undefined;
    const customer = this.customers.find(c => c.id === rfq.customer_id);
    return {
      ...rfq,
      customer_company: customer?.company || "",
      customer_name: customer?.name || "",
      customer_email: customer?.email || "",
      customer_avg_margin: customer?.avg_margin || 0,
    };
  }

  getRFQParts(rfqId: number): RFQPart[] {
    this.seed();
    return this.rfq_parts.filter(p => p.rfq_id === rfqId);
  }

  getSuppliers(shopId: number): Supplier[] {
    this.seed();
    return this.suppliers.filter(s => s.shop_id === shopId);
  }

  getMessages(shopId: number): Message[] {
    this.seed();
    return this.messages.filter(m => m.shop_id === shopId).sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  getActivities(shopId: number): Activity[] {
    this.seed();
    return this.activities.filter(a => a.shop_id === shopId).sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  createUser(shopId: number, email: string, password: string, name: string): User {
    this.seed();
    const id = this.users.length + 1;
    const user: User = { id, shop_id: shopId, email, password_hash: hashSync(password, 10), name, role: "admin" };
    this.users.push(user);
    return user;
  }

  createShop(data: Partial<Shop>): Shop {
    this.seed();
    const id = this.shops.length + 1;
    const shop: Shop = {
      id, name: data.name || "", website: data.website || "", email: data.email || "",
      phone: data.phone || "", address: data.address || "", specializations: data.specializations || "",
      materials: data.materials || "", certifications: data.certifications || "",
      erp_system: data.erp_system || "", weekly_rfqs: data.weekly_rfqs || 0,
      turnaround_days: data.turnaround_days || 5, pain_points: data.pain_points || "",
      outsourced_processes: data.outsourced_processes || "", suppliers_info: data.suppliers_info || "",
      onboarding_complete: data.onboarding_complete || 0,
    };
    this.shops.push(shop);
    return shop;
  }

  updateRFQStatus(id: number, status: string) {
    const rfq = this.rfqs.find(r => r.id === id);
    if (rfq) rfq.status = status;
  }

  verifyPassword(hash: string, password: string): boolean {
    return compareSync(password, hash);
  }
}

const db = new InMemoryDB();
export default function getDb() { return db; }
