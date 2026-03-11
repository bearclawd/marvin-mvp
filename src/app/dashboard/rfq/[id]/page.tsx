"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Search,
  Trophy,
  Clock,
  Package,
  Ruler,
  Paintbrush,
  Timer,
  DollarSign,
  User,
  Mail,
  TrendingUp,
} from "lucide-react";
import type { Rfq, RfqPart } from "@/lib/types";

const statusConfig: Record<string, { label: string; variant: "info" | "warning" | "success" | "danger" | "default" }> = {
  incoming: { label: "New", variant: "info" },
  analysis: { label: "Analysis", variant: "warning" },
  quoted: { label: "Quoted", variant: "default" },
  won: { label: "Won", variant: "success" },
  lost: { label: "Lost", variant: "danger" },
};

function formatCHF(value: number) {
  return `CHF ${value.toLocaleString("de-CH", { minimumFractionDigits: 2 })}`;
}

export default function RfqDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [rfq, setRfq] = useState<Rfq & { customer_name?: string; customer_email?: string; customer_avg_margin?: number } | null>(null);
  const [parts, setParts] = useState<RfqPart[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/rfq/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setRfq(data.rfq);
        setParts(data.parts || []);
        setLoading(false);
      });
  }, [params.id]);

  async function handleAction(action: string) {
    setActionLoading(action);
    try {
      const res = await fetch("/api/rfq/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rfqId: Number(params.id), action }),
      });
      const data = await res.json();
      if (data.success && rfq) {
        setRfq({ ...rfq, status: data.newStatus });
      }
    } finally {
      setActionLoading(null);
    }
  }

  if (loading || !rfq) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const config = statusConfig[rfq.status] || statusConfig.incoming;
  const totalMaterialCost = parts.reduce((s, p) => s + p.material_cost * p.quantity, 0);
  const totalMachiningMin = parts.reduce((s, p) => s + p.machining_time_min * p.quantity, 0);
  const totalPartsValue = parts.reduce((s, p) => s + p.unit_price * p.quantity, 0);

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => router.push("/dashboard/rfq")}
        className="flex items-center gap-2 text-sm text-text-muted-light hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Pipeline
      </button>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-white">{rfq.title}</h1>
            <Badge variant={config.variant}>{config.label}</Badge>
          </div>
          <p className="text-sm text-text-muted">{rfq.customer_company} &middot; Due {new Date(rfq.due_date).toLocaleDateString("de-CH")}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{formatCHF(rfq.total_value)}</div>
          <div className="text-sm text-primary font-medium">{rfq.margin_pct}% margin</div>
        </div>
      </div>

      {/* Action Buttons */}
      {(rfq.status === "incoming" || rfq.status === "analysis") && (
        <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl">
          <div className="flex-1">
            <p className="text-sm font-medium text-white">
              {rfq.status === "incoming" ? "Marvin has analyzed this RFQ. Ready for your review." : "Analysis complete. Approve to generate quote."}
            </p>
            <p className="text-xs text-text-muted mt-1">
              {rfq.customer_avg_margin ? `This customer typically accepts ${rfq.customer_avg_margin}% margins.` : "Review the breakdown below and take action."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {rfq.status === "incoming" && (
              <Button size="sm" variant="secondary" onClick={() => handleAction("analyze")} disabled={!!actionLoading}>
                <Search className="w-3.5 h-3.5 mr-1" />
                {actionLoading === "analyze" ? "..." : "Analyze"}
              </Button>
            )}
            <Button size="sm" onClick={() => handleAction("approve")} disabled={!!actionLoading}>
              <CheckCircle className="w-3.5 h-3.5 mr-1" />
              {actionLoading === "approve" ? "..." : "Approve Quote"}
            </Button>
            <Button size="sm" variant="danger" onClick={() => handleAction("reject")} disabled={!!actionLoading}>
              <XCircle className="w-3.5 h-3.5 mr-1" />
              {actionLoading === "reject" ? "..." : "Reject"}
            </Button>
          </div>
        </div>
      )}

      {rfq.status === "quoted" && (
        <div className="flex items-center gap-3 p-4 bg-success/5 border border-success/20 rounded-xl">
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Quote sent to {rfq.customer_company}. Awaiting response.</p>
          </div>
          <Button size="sm" onClick={() => handleAction("win")} disabled={!!actionLoading}>
            <Trophy className="w-3.5 h-3.5 mr-1" />
            {actionLoading === "win" ? "..." : "Mark as Won"}
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleAction("reject")} disabled={!!actionLoading}>
            <XCircle className="w-3.5 h-3.5 mr-1" />
            {actionLoading === "reject" ? "..." : "Lost"}
          </Button>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Parts Table */}
        <div className="lg:col-span-2">
          <Card>
            <CardTitle>Parts Breakdown ({parts.length} parts)</CardTitle>
            <CardDescription>Marvin&apos;s analysis of machining requirements and cost estimation</CardDescription>
            <div className="mt-4 space-y-4">
              {parts.map((part) => (
                <div key={part.id} className="bg-bg-darker/50 border border-border-dark/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-white">{part.name}</h4>
                    <span className="text-sm font-bold text-primary">{formatCHF(part.unit_price * part.quantity)}</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="flex items-center gap-2">
                      <Package className="w-3.5 h-3.5 text-text-muted" />
                      <span className="text-xs text-text-muted-light">{part.material}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Ruler className="w-3.5 h-3.5 text-text-muted" />
                      <span className="text-xs text-text-muted-light">{part.tolerance}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Paintbrush className="w-3.5 h-3.5 text-text-muted" />
                      <span className="text-xs text-text-muted-light">{part.surface_finish}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Timer className="w-3.5 h-3.5 text-text-muted" />
                      <span className="text-xs text-text-muted-light">{part.machining_time_min} min/pc</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-3.5 h-3.5 text-text-muted" />
                      <span className="text-xs text-text-muted-light">{formatCHF(part.material_cost)}/pc material</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-text-muted-light">Qty: {part.quantity} &middot; {formatCHF(part.unit_price)}/pc</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card>
            <CardTitle>Cost Summary</CardTitle>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted-light">Material Cost</span>
                <span className="text-white">{formatCHF(totalMaterialCost)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted-light">Machining Time</span>
                <span className="text-white">{Math.round(totalMachiningMin / 60)} hours</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted-light">Parts Total</span>
                <span className="text-white">{formatCHF(totalPartsValue)}</span>
              </div>
              <hr className="border-border-dark" />
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-white">Quote Total</span>
                <span className="text-primary">{formatCHF(rfq.total_value)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted-light">Target Margin</span>
                <span className="text-success">{rfq.margin_pct}%</span>
              </div>
            </div>
          </Card>

          <Card>
            <CardTitle>Customer Info</CardTitle>
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-text-muted" />
                <span className="text-sm text-text-muted-light">{rfq.customer_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-text-muted" />
                <span className="text-sm text-text-muted-light">{rfq.customer_email}</span>
              </div>
              {rfq.customer_avg_margin && (
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-text-muted" />
                  <span className="text-sm text-text-muted-light">Avg margin: {rfq.customer_avg_margin}%</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-text-muted" />
                <span className="text-sm text-text-muted-light">Due: {new Date(rfq.due_date).toLocaleDateString("de-CH")}</span>
              </div>
            </div>
          </Card>

          {rfq.notes && (
            <Card>
              <CardTitle>Notes</CardTitle>
              <p className="mt-3 text-sm text-text-muted-light leading-relaxed">{rfq.notes}</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
