"use client";

import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings, Building, Bell, Globe, Shield, Bot } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-text-muted mt-1">Manage your shop and Marvin configuration</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="group hover:border-primary/30 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Building className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>Shop Profile</CardTitle>
              <CardDescription>Company details, capabilities, certifications</CardDescription>
            </div>
          </div>
          <div className="space-y-2 text-sm text-text-muted-light">
            <div className="flex justify-between"><span>Company</span><span className="text-white">Precision CNC AG</span></div>
            <div className="flex justify-between"><span>Location</span><span className="text-white">Winterthur, CH</span></div>
            <div className="flex justify-between"><span>Certifications</span><span className="text-white">ISO 9001, 13485, AS9100D</span></div>
          </div>
        </Card>

        <Card className="group hover:border-primary/30 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>Marvin AI</CardTitle>
              <CardDescription>AI behavior, auto-responses, analysis preferences</CardDescription>
            </div>
          </div>
          <div className="space-y-2 text-sm text-text-muted-light">
            <div className="flex justify-between"><span>Auto-analyze RFQs</span><span className="text-success">Enabled</span></div>
            <div className="flex justify-between"><span>Auto-send quotes</span><span className="text-warning">Approval required</span></div>
            <div className="flex justify-between"><span>Daily summary</span><span className="text-success">Enabled</span></div>
          </div>
        </Card>

        <Card className="group hover:border-primary/30 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Email, Telegram, and in-app notification preferences</CardDescription>
            </div>
          </div>
          <div className="space-y-2 text-sm text-text-muted-light">
            <div className="flex justify-between"><span>New RFQ alerts</span><span className="text-success">Email + Telegram</span></div>
            <div className="flex justify-between"><span>Quote approvals</span><span className="text-success">All channels</span></div>
            <div className="flex justify-between"><span>Supplier updates</span><span className="text-white">Email only</span></div>
          </div>
        </Card>

        <Card className="group hover:border-primary/30 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>Telegram, ERP, email, and other connections</CardDescription>
            </div>
          </div>
          <div className="space-y-2 text-sm text-text-muted-light">
            <div className="flex justify-between"><span>Telegram Bot</span><span className="text-success">Connected</span></div>
            <div className="flex justify-between"><span>ERP (AXAPTA)</span><span className="text-warning">Planned</span></div>
            <div className="flex justify-between"><span>Email forwarding</span><span className="text-success">Active</span></div>
          </div>
        </Card>

        <Card className="group hover:border-primary/30 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>Security</CardTitle>
              <CardDescription>Account security, sessions, and access control</CardDescription>
            </div>
          </div>
          <div className="space-y-2 text-sm text-text-muted-light">
            <div className="flex justify-between"><span>Two-factor auth</span><span className="text-text-muted">Not configured</span></div>
            <div className="flex justify-between"><span>API keys</span><span className="text-white">1 active</span></div>
            <div className="flex justify-between"><span>Sessions</span><span className="text-white">1 active</span></div>
          </div>
        </Card>

        <Card className="group hover:border-primary/30 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Settings className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>General</CardTitle>
              <CardDescription>Language, currency, timezone, and display preferences</CardDescription>
            </div>
          </div>
          <div className="space-y-2 text-sm text-text-muted-light">
            <div className="flex justify-between"><span>Language</span><span className="text-white">Deutsch</span></div>
            <div className="flex justify-between"><span>Currency</span><span className="text-white">CHF</span></div>
            <div className="flex justify-between"><span>Timezone</span><span className="text-white">Europe/Zurich</span></div>
          </div>
        </Card>
      </div>
    </div>
  );
}
