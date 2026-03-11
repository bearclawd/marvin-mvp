"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  TrendingUp,
  Clock,
  DollarSign,
  ArrowRight,
  CheckCircle,
  Search,
  Send,
  Truck,
  Package,
  FileInput,
  Activity,
} from "lucide-react";
import type { Rfq, Activity as ActivityType } from "@/lib/types";

const iconMap: Record<string, React.ElementType> = {
  "file-input": FileInput,
  "search": Search,
  "send": Send,
  "check-circle": CheckCircle,
  "truck": Truck,
  "package": Package,
  "trending-up": TrendingUp,
  "activity": Activity,
};

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

export default function DashboardPage() {
  const [rfqs, setRfqs] = useState<Rfq[]>([]);
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/rfq").then((r) => r.json()),
      fetch("/api/dashboard/activities").then((r) => r.json()),
    ]).then(([rfqData, actData]) => {
      setRfqs(rfqData.rfqs || []);
      setActivities(actData.activities || []);
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

  const incoming = rfqs.filter((r) => r.status === "incoming").length;
  const inAnalysis = rfqs.filter((r) => r.status === "analysis").length;
  const quoted = rfqs.filter((r) => r.status === "quoted").length;
  const won = rfqs.filter((r) => r.status === "won").length;
  const totalPipeline = rfqs.reduce((s, r) => s + r.total_value, 0);
  const avgMargin = rfqs.length > 0 ? rfqs.reduce((s, r) => s + r.margin_pct, 0) / rfqs.length : 0;
  const wonValue = rfqs.filter((r) => r.status === "won").reduce((s, r) => s + r.total_value, 0);

  const metrics = [
    { label: "Incoming RFQs", value: incoming.toString(), icon: FileText, color: "text-primary", bg: "bg-primary/10" },
    { label: "In Analysis", value: inAnalysis.toString(), icon: Search, color: "text-warning", bg: "bg-warning/10" },
    { label: "Quoted", value: quoted.toString(), icon: Clock, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Won", value: won.toString(), icon: CheckCircle, color: "text-success", bg: "bg-success/10" },
    { label: "Pipeline Value", value: formatCHF(totalPipeline), icon: DollarSign, color: "text-white", bg: "bg-white/5" },
    { label: "Avg Margin", value: `${avgMargin.toFixed(1)}%`, icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
  ];

  return (
    <div className="space-y-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metrics.map((m) => (
          <Card key={m.label} className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-7 h-7 rounded-lg ${m.bg} flex items-center justify-center`}>
                <m.icon className={`w-3.5 h-3.5 ${m.color}`} />
              </div>
            </div>
            <div className={`text-xl font-bold ${m.color}`}>{m.value}</div>
            <div className="text-xs text-text-muted mt-0.5">{m.label}</div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* RFQ Pipeline */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <CardTitle>RFQ Pipeline</CardTitle>
              <Link href="/dashboard/rfq" className="text-xs text-primary hover:text-primary-light flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {rfqs.slice(0, 6).map((rfq) => {
                const config = statusConfig[rfq.status] || statusConfig.incoming;
                return (
                  <Link
                    key={rfq.id}
                    href={`/dashboard/rfq/${rfq.id}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-bg-darker/50 border border-border-dark/50 hover:border-primary/30 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white truncate group-hover:text-primary transition-colors">
                          {rfq.title}
                        </span>
                        <Badge variant={config.variant}>{config.label}</Badge>
                      </div>
                      <p className="text-xs text-text-muted mt-0.5">{rfq.customer_company}</p>
                    </div>
                    <div className="text-right ml-4 shrink-0">
                      <div className="text-sm font-semibold text-white">{formatCHF(rfq.total_value)}</div>
                      <div className="text-xs text-text-muted">{rfq.margin_pct}% margin</div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pipeline bar */}
            <div className="mt-4 pt-4 border-t border-border-dark">
              <div className="flex items-center gap-1 h-3 rounded-full overflow-hidden bg-bg-darker">
                {incoming > 0 && <div className="h-full bg-primary" style={{ width: `${(incoming / rfqs.length) * 100}%` }} />}
                {inAnalysis > 0 && <div className="h-full bg-warning" style={{ width: `${(inAnalysis / rfqs.length) * 100}%` }} />}
                {quoted > 0 && <div className="h-full bg-blue-400" style={{ width: `${(quoted / rfqs.length) * 100}%` }} />}
                {won > 0 && <div className="h-full bg-success" style={{ width: `${(won / rfqs.length) * 100}%` }} />}
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs text-text-muted">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" /> New ({incoming})</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-warning" /> Analysis ({inAnalysis})</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400" /> Quoted ({quoted})</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success" /> Won ({won})</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Activity Feed */}
        <div>
          <Card>
            <CardTitle className="mb-4">Recent Activity</CardTitle>
            <div className="space-y-4">
              {activities.slice(0, 8).map((a) => {
                const IconComp = iconMap[a.icon] || Activity;
                return (
                  <div key={a.id} className="flex gap-3">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <IconComp className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white">{a.title}</p>
                      <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{a.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardTitle className="mb-3">Today&apos;s Actions</CardTitle>
          <div className="space-y-2">
            {[
              { text: "Review new RFQ: Titanium Surgical Instrument Housings", urgent: true },
              { text: "Review new RFQ: Titanium Neurostimulator Enclosures", urgent: true },
              { text: "Follow up on quoted RFQ: PEEK Measurement Device Components", urgent: false },
              { text: "Pick up anodized parts from Galvaswiss", urgent: false },
            ].map((action, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-bg-darker/50">
                <div className={`w-2 h-2 rounded-full shrink-0 ${action.urgent ? "bg-danger" : "bg-warning"}`} />
                <span className="text-sm text-text-muted-light">{action.text}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardTitle className="mb-3">Performance Summary</CardTitle>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-muted-light">Win Rate</span>
              <span className="text-sm font-semibold text-success">
                {rfqs.length > 0 ? `${((won / rfqs.length) * 100).toFixed(0)}%` : "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-muted-light">Won Value (MTD)</span>
              <span className="text-sm font-semibold text-white">{formatCHF(wonValue)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-muted-light">Avg Quote Turnaround</span>
              <span className="text-sm font-semibold text-primary">1.2 hours</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-muted-light">Supplier Response Time</span>
              <span className="text-sm font-semibold text-white">4.5 hours avg</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
