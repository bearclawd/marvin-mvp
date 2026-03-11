import getDb from "./db";
import { hashSync } from "bcryptjs";

export function seedDemoData() {
  const db = getDb();

  const existingShop = db.prepare("SELECT id FROM shops WHERE name = ?").get("Precision CNC AG");
  if (existingShop) return;

  // Create demo shop
  const shopResult = db.prepare(`
    INSERT INTO shops (name, website, email, phone, address, specializations, materials, certifications, erp_system, weekly_rfqs, turnaround_days, pain_points, outsourced_processes, suppliers_info, onboarding_complete)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    "Precision CNC AG",
    "https://precision-cnc.ch",
    "info@precision-cnc.ch",
    "+41 52 234 56 78",
    "Industriestrasse 42, 8400 Winterthur, Switzerland",
    "5-axis CNC milling, CNC turning, Swiss-type machining, wire EDM, micro-machining",
    "Aluminum (6061, 7075), Titanium (Ti6Al4V), Stainless Steel (316L, 304), Tool Steel, Brass, PEEK, Delrin",
    "ISO 9001:2015, ISO 13485 (Medical), AS9100D (Aerospace), IATF 16949 (Automotive)",
    "AXAPTA (Microsoft Dynamics)",
    35,
    8,
    "Manual quoting takes 2-3 hours per complex RFQ. Difficulty tracking supplier lead times. Customer follow-ups fall through cracks.",
    "Surface finishing (anodizing, plating), Heat treatment, Grinding (precision >IT5)",
    "Stahl Gerlafingen (steel), Aviometal (aluminum), Bibus Metals (titanium, specialty alloys)",
    1
  );

  const shopId = shopResult.lastInsertRowid as number;

  // Create demo user
  db.prepare(`
    INSERT INTO users (shop_id, email, password_hash, name, role)
    VALUES (?, ?, ?, ?, ?)
  `).run(shopId, "pascal@precision-cnc.ch", hashSync("demo1234", 10), "Pascal Behr", "admin");

  // Create customers
  const customerData = [
    { name: "Thomas Müller", company: "MedTech Solutions GmbH", email: "t.mueller@medtech-solutions.de", phone: "+49 89 12345678", notes: "Key medical account. High quality standards, typically accepts 12-18% margins. Prefers DIN tolerances.", avg_margin: 15.2, total_orders: 47 },
    { name: "Sarah Weber", company: "Aeroparts Zürich AG", email: "s.weber@aeroparts-zh.ch", phone: "+41 44 987 65 43", notes: "Aerospace customer, requires full traceability. AS9100 documentation mandatory. Long-term contract potential.", avg_margin: 22.5, total_orders: 31 },
    { name: "Klaus Fischer", company: "Fischer Automotive GmbH", email: "k.fischer@fischer-auto.de", phone: "+49 711 55566677", notes: "Automotive series production. Price-sensitive but loyal. 60-day payment terms.", avg_margin: 8.7, total_orders: 124 },
    { name: "Anna Berger", company: "SwissInstruments AG", email: "a.berger@swissinstruments.ch", phone: "+41 31 456 78 90", notes: "Precision instruments manufacturer. Extremely tight tolerances. Premium pricing accepted.", avg_margin: 28.4, total_orders: 19 },
    { name: "Michael Braun", company: "Robotix Engineering GmbH", email: "m.braun@robotix-eng.de", phone: "+49 30 1122334455", notes: "Robotics components. Growing account, increasingly complex parts. Good payment terms.", avg_margin: 18.9, total_orders: 22 },
    { name: "Eva Schneider", company: "OptikTech Basel AG", email: "e.schneider@optiktech.ch", phone: "+41 61 234 56 78", notes: "Optical component housings. Ultra-precision required. Small batches, high value.", avg_margin: 32.1, total_orders: 15 },
    { name: "Hans Keller", company: "BauMasch Luzern GmbH", email: "h.keller@baumasch.ch", phone: "+41 41 765 43 21", notes: "Construction machinery parts. Large batch sizes, standard tolerances. Reliable repeat orders.", avg_margin: 11.3, total_orders: 89 },
    { name: "Petra Zimmermann", company: "NeuroDevice AG", email: "p.zimmermann@neurodevice.ch", phone: "+41 44 333 22 11", notes: "Neurosurgical device components. ISO 13485 required. Highest precision, premium margins.", avg_margin: 35.7, total_orders: 8 },
  ];

  const customerIds: number[] = [];
  for (const c of customerData) {
    const result = db.prepare(`
      INSERT INTO customers (shop_id, name, company, email, phone, notes, avg_margin, total_orders)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(shopId, c.name, c.company, c.email, c.phone, c.notes, c.avg_margin, c.total_orders);
    customerIds.push(result.lastInsertRowid as number);
  }

  // Create RFQs
  const rfqData = [
    {
      customer_idx: 0, title: "Titanium Surgical Instrument Housings",
      status: "incoming", total_value: 18750, margin_pct: 16.5, due_date: "2026-03-28",
      notes: "Rush order. Patient-specific implant housings. Full ISO 13485 documentation required.",
      parts: [
        { name: "Instrument Housing Upper", material: "Ti6Al4V", quantity: 25, tolerance: "±0.01mm", surface_finish: "Ra 0.4μm", machining_time_min: 145, material_cost: 85, unit_price: 420 },
        { name: "Instrument Housing Lower", material: "Ti6Al4V", quantity: 25, tolerance: "±0.01mm", surface_finish: "Ra 0.4μm", machining_time_min: 130, material_cost: 78, unit_price: 380 },
        { name: "Locking Pin", material: "Ti6Al4V", quantity: 50, tolerance: "±0.005mm", surface_finish: "Electropolished", machining_time_min: 22, material_cost: 12, unit_price: 55 },
      ]
    },
    {
      customer_idx: 1, title: "Aluminum Avionics Enclosure Set",
      status: "analysis", total_value: 32400, margin_pct: 23.8, due_date: "2026-04-15",
      notes: "AS9100 traceability. Material certs required. First article inspection.",
      parts: [
        { name: "Main Enclosure Body", material: "Al 7075-T6", quantity: 12, tolerance: "±0.02mm", surface_finish: "Hard anodized (Type III)", machining_time_min: 280, material_cost: 120, unit_price: 1450 },
        { name: "Front Panel", material: "Al 6061-T6", quantity: 12, tolerance: "±0.05mm", surface_finish: "Chromate conversion", machining_time_min: 95, material_cost: 35, unit_price: 520 },
        { name: "EMI Shield Insert", material: "Brass CuZn39Pb3", quantity: 24, tolerance: "±0.03mm", surface_finish: "Nickel plated", machining_time_min: 45, material_cost: 18, unit_price: 185 },
        { name: "Mounting Bracket", material: "Al 7075-T6", quantity: 48, tolerance: "±0.1mm", surface_finish: "Alodine", machining_time_min: 15, material_cost: 8, unit_price: 65 },
      ]
    },
    {
      customer_idx: 2, title: "Steel Transmission Brackets (Series)",
      status: "quoted", total_value: 8960, margin_pct: 9.2, due_date: "2026-04-02",
      notes: "Repeat order from Fischer Automotive. Same specs as order #FA-2024-089. Volume discount applied.",
      parts: [
        { name: "Transmission Bracket Type A", material: "Steel 42CrMo4", quantity: 500, tolerance: "±0.05mm", surface_finish: "Zinc plated", machining_time_min: 8, material_cost: 3.2, unit_price: 11.20 },
        { name: "Transmission Bracket Type B", material: "Steel 42CrMo4", quantity: 300, tolerance: "±0.05mm", surface_finish: "Zinc plated", machining_time_min: 10, material_cost: 3.8, unit_price: 13.40 },
      ]
    },
    {
      customer_idx: 3, title: "PEEK Measurement Device Components",
      status: "quoted", total_value: 14200, margin_pct: 29.5, due_date: "2026-04-10",
      notes: "Ultra-precision components for coordinate measurement system. Temperature stability critical.",
      parts: [
        { name: "PEEK Bearing Housing", material: "PEEK GF30", quantity: 8, tolerance: "±0.005mm", surface_finish: "Ra 0.2μm", machining_time_min: 340, material_cost: 280, unit_price: 950 },
        { name: "Linear Guide Mount", material: "PEEK Natural", quantity: 16, tolerance: "±0.008mm", surface_finish: "Ra 0.4μm", machining_time_min: 120, material_cost: 95, unit_price: 410 },
      ]
    },
    {
      customer_idx: 4, title: "Stainless Steel Robot Joint Assemblies",
      status: "analysis", total_value: 22100, margin_pct: 19.4, due_date: "2026-04-22",
      notes: "New design revision. Increased load capacity. Requires 5-axis simultaneous machining.",
      parts: [
        { name: "Joint Housing", material: "SS 316L", quantity: 30, tolerance: "±0.015mm", surface_finish: "Ra 0.8μm", machining_time_min: 185, material_cost: 65, unit_price: 385 },
        { name: "Bearing Seat", material: "SS 316L", quantity: 60, tolerance: "±0.005mm", surface_finish: "Superfinished", machining_time_min: 55, material_cost: 22, unit_price: 120 },
        { name: "Shaft Adapter", material: "SS 304", quantity: 30, tolerance: "±0.01mm", surface_finish: "Ground", machining_time_min: 40, material_cost: 15, unit_price: 85 },
      ]
    },
    {
      customer_idx: 5, title: "Aluminum Optical Lens Mount Assembly",
      status: "won", total_value: 9800, margin_pct: 33.2, due_date: "2026-03-20",
      notes: "Confirmed order. Ultra-precision lens mounting system. Black anodize for stray light reduction.",
      parts: [
        { name: "Lens Cell", material: "Al 6061-T6", quantity: 6, tolerance: "±0.002mm", surface_finish: "Black anodized", machining_time_min: 420, material_cost: 45, unit_price: 890 },
        { name: "Adjustment Ring", material: "Al 6061-T6", quantity: 12, tolerance: "±0.003mm", surface_finish: "Black anodized", machining_time_min: 85, material_cost: 18, unit_price: 310 },
        { name: "Base Plate", material: "Al 7075-T6", quantity: 6, tolerance: "±0.005mm", surface_finish: "Hard anodized", machining_time_min: 150, material_cost: 55, unit_price: 420 },
      ]
    },
    {
      customer_idx: 6, title: "Hydraulic Manifold Blocks (Batch Order)",
      status: "won", total_value: 45600, margin_pct: 12.1, due_date: "2026-04-30",
      notes: "Large batch for construction season. Standard specs, repeat order. Material already reserved.",
      parts: [
        { name: "Hydraulic Manifold Block HM-200", material: "Steel S355J2", quantity: 200, tolerance: "±0.03mm", surface_finish: "Phosphated", machining_time_min: 35, material_cost: 28, unit_price: 145 },
        { name: "End Cap HM-200C", material: "Steel S355J2", quantity: 400, tolerance: "±0.1mm", surface_finish: "Zinc plated", machining_time_min: 8, material_cost: 5, unit_price: 28 },
      ]
    },
    {
      customer_idx: 7, title: "Titanium Neurostimulator Enclosures",
      status: "incoming", total_value: 28500, margin_pct: 36.8, due_date: "2026-05-01",
      notes: "Medical device enclosures for implantable neurostimulator. Full biocompatibility documentation. ISO 13485 + ISO 10993 compliance.",
      parts: [
        { name: "Stimulator Housing", material: "Ti Gr. 2 (CP)", quantity: 15, tolerance: "±0.008mm", surface_finish: "Electropolished + passivated", machining_time_min: 520, material_cost: 180, unit_price: 1250 },
        { name: "Battery Compartment Lid", material: "Ti Gr. 2 (CP)", quantity: 15, tolerance: "±0.01mm", surface_finish: "Electropolished", machining_time_min: 180, material_cost: 65, unit_price: 480 },
        { name: "Connector Feedthrough", material: "Ti6Al4V ELI", quantity: 15, tolerance: "±0.005mm", surface_finish: "Ra 0.1μm", machining_time_min: 95, material_cost: 45, unit_price: 320 },
      ]
    },
  ];

  for (const rfq of rfqData) {
    const rfqResult = db.prepare(`
      INSERT INTO rfqs (shop_id, customer_id, title, status, total_value, margin_pct, due_date, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(shopId, customerIds[rfq.customer_idx], rfq.title, rfq.status, rfq.total_value, rfq.margin_pct, rfq.due_date, rfq.notes);

    const rfqId = rfqResult.lastInsertRowid as number;
    for (const part of rfq.parts) {
      db.prepare(`
        INSERT INTO rfq_parts (rfq_id, name, material, quantity, tolerance, surface_finish, machining_time_min, material_cost, unit_price, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(rfqId, part.name, part.material, part.quantity, part.tolerance, part.surface_finish, part.machining_time_min, part.material_cost, part.unit_price, "");
    }
  }

  // Create suppliers
  const supplierData = [
    { name: "Stahl Gerlafingen AG", category: "Raw Material", materials: "Structural steel, Tool steel, Alloy steel", lead_time_days: 3, rating: 4.8, contact_email: "orders@stahl-gerlafingen.ch", contact_phone: "+41 32 674 11 11", location: "Gerlafingen, Switzerland", notes: "Primary steel supplier. Reliable delivery, competitive pricing for Swiss quality." },
    { name: "Aviometal SpA", category: "Raw Material", materials: "Aluminum 6061, 7075, 2024, Specialty alloys", lead_time_days: 5, rating: 4.5, contact_email: "sales@aviometal.it", contact_phone: "+39 011 987 6543", location: "Turin, Italy", notes: "Aerospace-grade aluminum. Full material certification. NADCAP accredited." },
    { name: "Bibus Metals AG", category: "Raw Material", materials: "Titanium, PEEK, Inconel, Hastelloy, Specialty alloys", lead_time_days: 7, rating: 4.7, contact_email: "metals@bibus.ch", contact_phone: "+41 44 877 54 00", location: "Fehraltorf, Switzerland", notes: "Specialty metals supplier. Best source for titanium in CH. Stock availability varies." },
    { name: "Alu Menziken AG", category: "Raw Material", materials: "Extruded aluminum profiles, Aluminum plates", lead_time_days: 4, rating: 4.3, contact_email: "info@alu-menziken.ch", contact_phone: "+41 62 765 21 00", location: "Menziken, Switzerland", notes: "Local aluminum supplier. Quick turnaround for standard profiles." },
    { name: "Galvaswiss AG", category: "Surface Finishing", materials: "Zinc plating, Nickel plating, Chrome plating, Anodizing", lead_time_days: 5, rating: 4.6, contact_email: "auftraege@galvaswiss.ch", contact_phone: "+41 52 320 40 00", location: "Winterthur, Switzerland", notes: "Preferred surface finishing partner. Walking distance from our facility." },
    { name: "Härte-Zentrum AG", category: "Heat Treatment", materials: "Case hardening, Nitriding, Vacuum hardening, Tempering", lead_time_days: 4, rating: 4.4, contact_email: "orders@haerte-zentrum.ch", contact_phone: "+41 56 437 28 28", location: "Baden, Switzerland", notes: "Reliable heat treatment partner. Good documentation for automotive." },
    { name: "Studer AG (Fritz Studer)", category: "Grinding Services", materials: "Cylindrical grinding, Surface grinding, Internal grinding", lead_time_days: 6, rating: 4.9, contact_email: "grinding@studer.com", contact_phone: "+41 33 439 11 11", location: "Steffisburg, Switzerland", notes: "Premium grinding services. Used for ultra-precision jobs (IT5 and tighter)." },
    { name: "SwissPost Logistics", category: "Logistics", materials: "Express, Standard, International shipping", lead_time_days: 1, rating: 4.2, contact_email: "logistics@post.ch", contact_phone: "+41 848 888 888", location: "Bern, Switzerland", notes: "Default domestic shipping. Next-day express available." },
  ];

  for (const s of supplierData) {
    db.prepare(`
      INSERT INTO suppliers (shop_id, name, category, materials, lead_time_days, rating, contact_email, contact_phone, location, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(shopId, s.name, s.category, s.materials, s.lead_time_days, s.rating, s.contact_email, s.contact_phone, s.location, s.notes);
  }

  // Create messages
  const messageData = [
    { direction: "inbound", channel: "email", from_name: "Thomas Müller", subject: "RFQ: Titanium Surgical Instrument Housings", body: "Dear Precision CNC team,\n\nPlease find attached our RFQ for titanium surgical instrument housings. This is a rush order for 25 sets. Full ISO 13485 documentation is required.\n\nPlease quote by end of week.\n\nBest regards,\nThomas Müller\nMedTech Solutions GmbH", category: "rfq", is_read: 0 },
    { direction: "inbound", channel: "email", from_name: "Petra Zimmermann", subject: "New Project: Neurostimulator Enclosures", body: "Hi Pascal,\n\nWe have a new neurostimulator project requiring titanium enclosures. I've attached the drawings and specs. This is for our next-gen implantable device.\n\nISO 13485 + ISO 10993 compliance is mandatory. Can you provide a quote within 2 weeks?\n\nBest,\nPetra Zimmermann\nNeuroDevice AG", category: "rfq", is_read: 0 },
    { direction: "inbound", channel: "email", from_name: "Sarah Weber", subject: "RE: Avionics Enclosure - Drawing Update", body: "Pascal,\n\nWe've updated the EMI shield insert drawing (Rev. C). Main change is tighter tolerance on the mounting holes. Please use the attached revision for your quote.\n\nRegards,\nSarah", category: "rfq", is_read: 1 },
    { direction: "outbound", channel: "email", from_name: "Marvin (Auto)", subject: "Quote QT-2026-003: Transmission Brackets", body: "Dear Mr. Fischer,\n\nThank you for your repeat order inquiry. Please find attached our quote for the transmission bracket series.\n\nTotal: CHF 8,960.00 (including 3% volume discount)\nDelivery: 3 weeks from order confirmation\n\nBest regards,\nPrecision CNC AG", category: "quote", is_read: 1 },
    { direction: "inbound", channel: "email", from_name: "Bibus Metals AG", subject: "Stock Availability: Ti6Al4V Ø40mm", body: "Dear Precision CNC AG,\n\nRegarding your inquiry for Ti6Al4V Ø40mm bars:\n\n- Currently 12 bars in stock (3m length)\n- Price: CHF 385/kg\n- Delivery: 2 working days\n\nWould you like to place an order?\n\nBibus Metals AG", category: "supplier", is_read: 1 },
    { direction: "inbound", channel: "telegram", from_name: "Klaus Fischer", subject: "Order Confirmation", body: "Hi Pascal, confirmed order for the transmission brackets. Please proceed as quoted. PO coming by email today. Klaus", category: "order", is_read: 0 },
    { direction: "inbound", channel: "email", from_name: "Galvaswiss AG", subject: "Anodizing Batch AN-2026-0456 Complete", body: "Dear Precision CNC AG,\n\nBatch AN-2026-0456 (6x Lens Cells, 12x Adjustment Rings for OptikTech) is complete and ready for pickup.\n\nBlack anodize Type II, 15μm thickness. All parts within spec.\n\nRegards,\nGalvaswiss AG", category: "supplier", is_read: 0 },
    { direction: "outbound", channel: "email", from_name: "Marvin (Auto)", subject: "Material Order: Al 7075-T6 Plate", body: "Dear Aviometal,\n\nPlease supply the following:\n- Al 7075-T6 Plate, 50mm x 500mm x 1000mm, Qty: 2\n- Material certificate EN 10204 3.1 required\n\nDelivery to: Industriestrasse 42, 8400 Winterthur\n\nBest regards,\nPrecision CNC AG", category: "order", is_read: 1 },
  ];

  for (const m of messageData) {
    db.prepare(`
      INSERT INTO messages (shop_id, direction, channel, from_name, subject, body, category, is_read)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(shopId, m.direction, m.channel, m.from_name, m.subject, m.body, m.category, m.is_read);
  }

  // Create activities
  const activityData = [
    { type: "rfq", title: "New RFQ received", description: "Titanium Surgical Instrument Housings from MedTech Solutions GmbH — CHF 18,750", icon: "file-input" },
    { type: "rfq", title: "New RFQ received", description: "Titanium Neurostimulator Enclosures from NeuroDevice AG — CHF 28,500", icon: "file-input" },
    { type: "analysis", title: "RFQ analysis complete", description: "Aluminum Avionics Enclosure Set — 4 parts identified, estimated margin 23.8%", icon: "search" },
    { type: "quote", title: "Quote sent automatically", description: "Steel Transmission Brackets to Fischer Automotive — CHF 8,960", icon: "send" },
    { type: "order", title: "Order confirmed", description: "Aluminum Optical Lens Mount Assembly from OptikTech Basel — CHF 9,800", icon: "check-circle" },
    { type: "order", title: "Order confirmed", description: "Hydraulic Manifold Blocks from BauMasch Luzern — CHF 45,600", icon: "check-circle" },
    { type: "supplier", title: "Material ordered", description: "Al 7075-T6 plate from Aviometal — delivery in 5 days", icon: "truck" },
    { type: "supplier", title: "Surface finishing complete", description: "Galvaswiss: Black anodizing batch for OptikTech order ready for pickup", icon: "package" },
    { type: "analysis", title: "RFQ analysis in progress", description: "Stainless Steel Robot Joint Assemblies from Robotix Engineering — 3 parts detected", icon: "search" },
    { type: "insight", title: "Weekly insight", description: "Your average quote turnaround improved by 34% this week. 5 quotes sent in avg 1.2 hours.", icon: "trending-up" },
  ];

  for (const a of activityData) {
    db.prepare(`
      INSERT INTO activities (shop_id, type, title, description, icon)
      VALUES (?, ?, ?, ?, ?)
    `).run(shopId, a.type, a.title, a.description, a.icon);
  }
}
