"use client";

import { useEffect, useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Send, MessageSquare, Filter, Inbox, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import type { Message } from "@/lib/types";

const channelIcon: Record<string, React.ElementType> = {
  email: Mail,
  telegram: MessageSquare,
};

const categoryConfig: Record<string, { label: string; variant: "info" | "warning" | "success" | "danger" | "default" }> = {
  rfq: { label: "RFQ", variant: "info" },
  quote: { label: "Quote", variant: "default" },
  order: { label: "Order", variant: "success" },
  supplier: { label: "Supplier", variant: "warning" },
  general: { label: "General", variant: "default" },
};

export default function InboxPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [selectedMsg, setSelectedMsg] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/inbox")
      .then((r) => r.json())
      .then((data) => {
        setMessages(data.messages || []);
        setLoading(false);
      });
  }, []);

  const filtered = filter === "all" ? messages : filter === "unread" ? messages.filter((m) => !m.is_read) : messages.filter((m) => m.category === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Inbox</h1>
        <p className="text-sm text-text-muted mt-1">
          {messages.filter((m) => !m.is_read).length} unread messages &middot; {messages.length} total
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-text-muted" />
        {[
          { key: "all", label: "All" },
          { key: "unread", label: "Unread" },
          { key: "rfq", label: "RFQs" },
          { key: "order", label: "Orders" },
          { key: "supplier", label: "Suppliers" },
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
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Message List */}
        <div className="lg:col-span-2 space-y-2">
          {filtered.map((msg) => {
            const ChannelIcon = channelIcon[msg.channel] || Mail;
            const catConfig = categoryConfig[msg.category] || categoryConfig.general;
            return (
              <button
                key={msg.id}
                onClick={() => setSelectedMsg(msg)}
                className={`w-full text-left p-4 rounded-xl border transition-colors ${
                  selectedMsg?.id === msg.id
                    ? "bg-primary/5 border-primary/30"
                    : "bg-bg-card border-border-dark hover:border-primary/20"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex items-center gap-1.5">
                    {msg.direction === "inbound" ? (
                      <ArrowDownLeft className="w-3 h-3 text-primary" />
                    ) : (
                      <ArrowUpRight className="w-3 h-3 text-text-muted" />
                    )}
                    <ChannelIcon className="w-3 h-3 text-text-muted" />
                  </div>
                  <span className="text-xs text-text-muted truncate">{msg.from_name}</span>
                  {!msg.is_read && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                  <Badge variant={catConfig.variant} className="ml-auto text-[10px]">{catConfig.label}</Badge>
                </div>
                <p className={`text-sm truncate ${msg.is_read ? "text-text-muted-light" : "text-white font-medium"}`}>
                  {msg.subject}
                </p>
                <p className="text-xs text-text-muted mt-1 truncate">{msg.body.slice(0, 80)}...</p>
              </button>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <Inbox className="w-12 h-12 text-text-muted mx-auto mb-3" />
              <p className="text-text-muted">No messages found</p>
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-3">
          {selectedMsg ? (
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <CardTitle>{selectedMsg.subject}</CardTitle>
                  <p className="text-sm text-text-muted mt-1">
                    From: <span className="text-text-muted-light">{selectedMsg.from_name}</span>
                    {" "}&middot;{" "}
                    <span className="capitalize">{selectedMsg.channel}</span>
                    {" "}&middot;{" "}
                    {selectedMsg.direction === "inbound" ? "Received" : "Sent"}
                  </p>
                </div>
                <Badge variant={categoryConfig[selectedMsg.category]?.variant || "default"}>
                  {categoryConfig[selectedMsg.category]?.label || selectedMsg.category}
                </Badge>
              </div>

              <div className="bg-bg-darker/50 border border-border-dark/50 rounded-xl p-4 mb-4">
                <p className="text-sm text-text-muted-light leading-relaxed whitespace-pre-wrap">{selectedMsg.body}</p>
              </div>

              {selectedMsg.direction === "inbound" && (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Send className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-white">Marvin&apos;s Suggested Response</span>
                  </div>
                  <p className="text-sm text-text-muted-light">
                    {selectedMsg.category === "rfq"
                      ? `Thank you for your inquiry regarding ${selectedMsg.subject.replace("RFQ: ", "")}. We've received your specifications and our team is currently reviewing the requirements. We'll provide a detailed quote within 24 hours.`
                      : selectedMsg.category === "supplier"
                      ? "Thank you for the update. We've noted this in our system and will coordinate pickup/delivery accordingly."
                      : "Thank you for your message. I'll review this and get back to you shortly."}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <button className="px-3 py-1.5 text-xs font-medium bg-primary text-white rounded-lg hover:bg-primary-light transition-colors">
                      Send Response
                    </button>
                    <button className="px-3 py-1.5 text-xs font-medium text-text-muted-light hover:text-white border border-border-dark rounded-lg hover:border-primary/30 transition-colors">
                      Edit & Send
                    </button>
                  </div>
                </div>
              )}
            </Card>
          ) : (
            <div className="flex items-center justify-center h-64 text-text-muted">
              <div className="text-center">
                <Mail className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Select a message to view</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
