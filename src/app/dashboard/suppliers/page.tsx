"use client";

import { useEffect, useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, MapPin, Clock, Star, Mail, Phone, Package, Paintbrush, Flame, Cog } from "lucide-react";
import type { Supplier } from "@/lib/types";

const categoryIcon: Record<string, React.ElementType> = {
  "Raw Material": Package,
  "Surface Finishing": Paintbrush,
  "Heat Treatment": Flame,
  "Grinding Services": Cog,
  "Logistics": Truck,
};

const categoryColor: Record<string, string> = {
  "Raw Material": "bg-blue-400/10 text-blue-400",
  "Surface Finishing": "bg-purple-400/10 text-purple-400",
  "Heat Treatment": "bg-orange-400/10 text-orange-400",
  "Grinding Services": "bg-yellow-400/10 text-yellow-400",
  "Logistics": "bg-green-400/10 text-green-400",
};

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/suppliers")
      .then((r) => r.json())
      .then((data) => {
        setSuppliers(data.suppliers || []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const categories = [...new Set(suppliers.map((s) => s.category))];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Suppliers</h1>
        <p className="text-sm text-text-muted mt-1">{suppliers.length} suppliers &middot; {categories.length} categories</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Supplier List */}
        <div className="lg:col-span-2 space-y-3">
          {categories.map((cat) => (
            <div key={cat}>
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                {(() => {
                  const Icon = categoryIcon[cat] || Truck;
                  return <Icon className="w-3.5 h-3.5" />;
                })()}
                {cat}
              </h3>
              <div className="space-y-2 mb-6">
                {suppliers.filter((s) => s.category === cat).map((supplier) => (
                  <button
                    key={supplier.id}
                    onClick={() => setSelectedSupplier(supplier)}
                    className={`w-full text-left p-4 rounded-xl border transition-colors ${
                      selectedSupplier?.id === supplier.id
                        ? "bg-primary/5 border-primary/30"
                        : "bg-bg-card border-border-dark hover:border-primary/20"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-white">{supplier.name}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-warning fill-warning" />
                        <span className="text-xs text-warning">{supplier.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-text-muted">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {supplier.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {supplier.lead_time_days}d lead time
                      </span>
                    </div>
                    <p className="text-xs text-text-muted-light mt-1 truncate">{supplier.materials}</p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Supplier Detail */}
        <div>
          {selectedSupplier ? (
            <Card className="sticky top-24">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${categoryColor[selectedSupplier.category] || "bg-primary/10 text-primary"}`}>
                  {(() => {
                    const Icon = categoryIcon[selectedSupplier.category] || Truck;
                    return <Icon className="w-5 h-5" />;
                  })()}
                </div>
                <div>
                  <CardTitle>{selectedSupplier.name}</CardTitle>
                  <Badge variant="default" className="mt-1">{selectedSupplier.category}</Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-text-muted" />
                  <span className="text-sm text-text-muted-light">{selectedSupplier.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-text-muted" />
                  <span className="text-sm text-text-muted-light">{selectedSupplier.contact_email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-text-muted" />
                  <span className="text-sm text-text-muted-light">{selectedSupplier.contact_phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-text-muted" />
                  <span className="text-sm text-text-muted-light">{selectedSupplier.lead_time_days} days lead time</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-warning fill-warning" />
                  <span className="text-sm text-text-muted-light">{selectedSupplier.rating} / 5.0</span>
                </div>

                <hr className="border-border-dark" />

                <div>
                  <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">Materials</p>
                  <p className="text-sm text-text-muted-light">{selectedSupplier.materials}</p>
                </div>

                {selectedSupplier.notes && (
                  <div>
                    <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">Notes</p>
                    <p className="text-sm text-text-muted-light leading-relaxed">{selectedSupplier.notes}</p>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-64 text-text-muted">
              <div className="text-center">
                <Truck className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Select a supplier to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
