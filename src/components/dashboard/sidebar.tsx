"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { MarvinLogo } from "@/components/landing/marvin-logo";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Inbox,
  Truck,
  Settings,
  LogOut,
  Bot,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/rfq", label: "RFQ Pipeline", icon: FileText },
  { href: "/dashboard/chat", label: "Chat with Marvin", icon: MessageSquare },
  { href: "/dashboard/inbox", label: "Inbox", icon: Inbox },
  { href: "/dashboard/suppliers", label: "Suppliers", icon: Truck },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  return (
    <aside className="w-60 bg-bg-darker border-r border-border-dark flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-5 flex items-center gap-3 border-b border-border-dark">
        <MarvinLogo className="w-8 h-8" />
        <div>
          <span className="text-base font-bold text-white">Marvin</span>
          <div className="flex items-center gap-1">
            <Bot className="w-3 h-3 text-primary" />
            <span className="text-[10px] text-primary font-medium">AI Assistant</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-text-muted-light hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border-dark">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-muted-light hover:text-white hover:bg-white/5 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
