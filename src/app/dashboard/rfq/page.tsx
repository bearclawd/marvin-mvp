"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, ArrowRight, Filter } from "lucide-react";
import type { Rfq } from "@/lib/types";

const statusConfig: Record<string, { label: string; variant: "info" | "warning" | "success" | "danger" | "default" }> = {
  incoming: { label: "New", variant: "info" },
  analysis: { label: "Analysis", variant: "warning" },
  quoted: { label: "Quoted", variant: "default" },
  won: { label: "Won", variant: "success" },
  lost: { label: "Lost", variant: "danger" },
};

function formatCHF(value: number) {
  return `CHF ${value.toLocaleString("de-CH", { minimumFractionDigits: 0 })}`;
}

export default function RfqListPage() {
  const [rfqs, setRfqs] = useState<Rfq[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/rfq")
      .then((r) => r.json())
      .then((data) => {
        setRfqs(data.rfqs || []);
        setLoading(false);
      });
  }, []);

  const filtered = filter === "all" ? rfqs : rfqs.filter((r) => r.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">RFQ Pipeline</h1>
          <p className="text-sm text-text-muted mt-1">{rfqs.length} total requests for quotation</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-text-muted" />
        {[
          { key: "all", label: "All" },
          { key: "incoming", label: "New" },
          { key: "analysis", label: "Analysis" },
          { key: "quoted", label: "Quoted" },
          { key: "won", label: "Won" },
          { key: "lost", label: "Lost" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === f.key
                ? "bg-primary/10 text-primary"
                : "text-text-muted-light hover:text-white hover:bg-white/5"
            }`}
          >
            {f.label}
            {f.key !== "all" && (
              <span className="ml-1 opacity-60">
                ({rfqs.filter((r) => r.status === f.key).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* RFQ Cards */}
      <div className="space-y-3">
        {filtered.map((rfq) => {
          const config = statusConfig[rfq.status] || statusConfig.incoming;
          return (
            <Link key={rfq.id} href={`/dashboard/rfq/${rfq.id}`}>
              <Card className="hover:border-primary/30 transition-colors cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-semibold text-white group-hover:text-primary transition-colors truncate">
                          {rfq.title}
                        </span>
                        <Badge variant={config.variant}>{config.label}</Badge>
                      </div>
                      <p className="text-sm text-text-muted mt-0.5">{rfq.customer_company}</p>
                      <p className="text-xs text-text-muted mt-1">Due: {new Date(rfq.due_date).toLocaleDateString("de-CH")}</p>
                    </div>
                  </div>
                  <div className="text-right ml-4 shrink-0 flex items-center gap-4">
                    <div>
                      <div className="text-lg font-bold text-white">{formatCHF(rfq.total_value)}</div>
                      <div className="text-xs text-text-muted">{rfq.margin_pct}% margin</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-text-muted mx-auto mb-3" />
          <p className="text-text-muted">No RFQs found with this filter</p>
        </div>
      )}
    </div>
  );
}
