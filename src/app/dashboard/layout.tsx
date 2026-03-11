"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [shopName, setShopName] = useState("");
  const [userName, setUserName] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => {
        if (!data.authenticated) {
          router.push("/auth/login");
        } else {
          setShopName(data.user.shopName);
          setUserName(data.user.name);
          setLoading(false);
        }
      })
      .catch(() => router.push("/auth/login"));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-darkest flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-darkest flex">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-40 bg-bg-darkest/80 backdrop-blur-xl border-b border-border-dark px-8 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-text-muted">Welcome back, {userName}</p>
            <h2 className="text-lg font-semibold text-white">{shopName}</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
              {userName.charAt(0)}
            </div>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
