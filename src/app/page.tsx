"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Bot, Zap, Brain, MessageSquare, Shield, TrendingUp, ArrowRight, Factory, Clock, FileText } from "lucide-react";
import { MarvinLogo, ImnooWordmark } from "@/components/landing/marvin-logo";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const features = [
  {
    icon: FileText,
    title: "Automated RFQ Processing",
    description: "Upload customer RFQs and Marvin extracts parts, materials, tolerances, and calculates machining times and costs instantly.",
  },
  {
    icon: Brain,
    title: "Intelligent Quoting",
    description: "AI-powered price optimization based on customer history, market rates, and your target margins. Generate professional quotes in seconds.",
  },
  {
    icon: Factory,
    title: "Supplier Orchestration",
    description: "Automated material sourcing, subcontractor management, and supply chain coordination. Marvin handles the logistics.",
  },
  {
    icon: MessageSquare,
    title: "Unified Communications",
    description: "Every customer email, supplier response, and internal notification in one intelligent inbox. Marvin triages and suggests responses.",
  },
  {
    icon: Clock,
    title: "Proactive Follow-ups",
    description: "Never miss a deadline. Marvin tracks every open quote, pending order, and material delivery — and alerts you before things slip.",
  },
  {
    icon: Shield,
    title: "Human-in-the-Loop",
    description: "You stay in control. Marvin prepares everything but critical decisions — quotes, orders, payments — always require your approval.",
  },
];

const stats = [
  { value: "85%", label: "Less time on admin" },
  { value: "3x", label: "Faster quote turnaround" },
  { value: "12%", label: "Higher win rate" },
  { value: "24/7", label: "Always monitoring" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-darkest text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-bg-darkest/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MarvinLogo className="w-9 h-9" />
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white">Marvin</span>
              <span className="text-xs text-text-muted">by</span>
              <ImnooWordmark className="text-sm" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-sm text-text-muted-light hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/onboarding"
              className="text-sm bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light transition-colors font-medium"
            >
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 grid-pattern" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-primary/3 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8"
          >
            <Bot className="w-4 h-4" />
            AI-Native Operating System for CNC Shops
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-5xl md:text-7xl font-bold leading-tight tracking-tight"
          >
            Your CNC shop runs on
            <span className="block text-primary mt-2">autopilot.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-6 text-lg md:text-xl text-text-muted-light max-w-2xl mx-auto leading-relaxed"
          >
            Marvin is the agentic brain that handles quoting, supplier orchestration,
            fulfillment, and customer communication — so you can focus on what you do best:
            making precision parts.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/onboarding"
              className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-primary-light transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5"
            >
              Start Onboarding
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-white/10 transition-all"
            >
              Try the Demo
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-text-muted mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            
            transition={{ duration: 0.8 }}
            className="relative rounded-2xl border border-white/10 bg-bg-dark/80 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/40"
          >
            {/* Mock dashboard */}
            <div className="flex">
              {/* Sidebar mock */}
              <div className="hidden md:flex w-56 border-r border-white/5 bg-bg-darker/50 flex-col p-4 gap-1">
                <div className="flex items-center gap-2 p-2 mb-4">
                  <MarvinLogo className="w-7 h-7" />
                  <span className="text-sm font-bold">Marvin</span>
                </div>
                {["Dashboard", "RFQ Pipeline", "Chat", "Inbox", "Suppliers", "Settings"].map((item, i) => (
                  <div
                    key={item}
                    className={`text-xs px-3 py-2 rounded-lg ${i === 0 ? "bg-primary/10 text-primary" : "text-text-muted"}`}
                  >
                    {item}
                  </div>
                ))}
              </div>
              {/* Main area mock */}
              <div className="flex-1 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-sm text-text-muted">Welcome back, Pascal</div>
                    <div className="text-lg font-semibold">Precision CNC AG</div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-20 h-8 bg-primary/10 rounded-lg" />
                    <div className="w-8 h-8 bg-bg-card rounded-lg" />
                  </div>
                </div>
                {/* Metric cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {[
                    { label: "Open RFQs", value: "4", color: "text-primary" },
                    { label: "Quoted", value: "2", color: "text-warning" },
                    { label: "Won", value: "2", color: "text-success" },
                    { label: "Pipeline Value", value: "CHF 180K", color: "text-white" },
                  ].map((m) => (
                    <div key={m.label} className="bg-bg-card/50 border border-white/5 rounded-xl p-4">
                      <div className="text-xs text-text-muted">{m.label}</div>
                      <div className={`text-xl font-bold mt-1 ${m.color}`}>{m.value}</div>
                    </div>
                  ))}
                </div>
                {/* RFQ rows mock */}
                <div className="space-y-2">
                  {[
                    { title: "Titanium Surgical Housings", company: "MedTech Solutions", value: "CHF 18,750", status: "New", statusColor: "bg-primary" },
                    { title: "Avionics Enclosure Set", company: "Aeroparts Zürich", value: "CHF 32,400", status: "Analysis", statusColor: "bg-warning" },
                    { title: "Transmission Brackets", company: "Fischer Automotive", value: "CHF 8,960", status: "Quoted", statusColor: "bg-blue-500" },
                  ].map((rfq) => (
                    <div key={rfq.title} className="flex items-center justify-between bg-bg-card/30 border border-white/5 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${rfq.statusColor}`} />
                        <div>
                          <div className="text-sm font-medium">{rfq.title}</div>
                          <div className="text-xs text-text-muted">{rfq.company}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{rfq.value}</div>
                        <div className="text-xs text-text-muted">{rfq.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              Everything your shop needs.{" "}
              <span className="text-primary">Automated.</span>
            </h2>
            <p className="mt-4 text-text-muted-light text-lg max-w-2xl mx-auto">
              From the moment an RFQ hits your inbox to the day the parts ship,
              Marvin orchestrates every step.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                custom={i}
                initial="hidden"
                animate="visible"
                
                variants={fadeUp}
                className="group bg-bg-dark/50 border border-white/5 rounded-2xl p-6 hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-text-muted-light leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-bg-darker/50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              Up and running in <span className="text-primary">10 minutes</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: Zap,
                title: "Connect your shop",
                description: "Enter your website URL. Marvin scrapes it and learns about your capabilities, materials, and certifications. Then answer a few questions to fine-tune.",
              },
              {
                step: "02",
                icon: Bot,
                title: "Let Marvin work",
                description: "Forward your RFQs. Marvin analyzes parts, calculates costs, optimizes margins, and drafts professional quotes. You just approve.",
              },
              {
                step: "03",
                icon: TrendingUp,
                title: "Grow your business",
                description: "With admin overhead eliminated, you respond faster, win more, and Marvin continuously learns your preferences to get even better.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                custom={i}
                initial="hidden"
                animate="visible"
                
                variants={fadeUp}
                className="relative"
              >
                <div className="text-6xl font-bold text-primary/10 mb-4">{item.step}</div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-text-muted-light leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Telegram section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-4">
                <MessageSquare className="w-4 h-4" />
                Telegram Integration
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Manage your shop from <span className="text-primary">Telegram</span>
              </h2>
              <p className="text-text-muted-light mb-6">
                Get instant RFQ notifications, approve quotes with a tap, check order status,
                and ask Marvin anything — all from your favorite messenger.
              </p>
              <div className="space-y-3">
                {[
                  "New RFQ alerts with instant approve/reject",
                  "Daily business summary every morning",
                  "Natural language queries about your shop",
                  "Proactive alerts for material shortages",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-sm text-text-muted-light">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              
              className="bg-bg-dark border border-white/10 rounded-2xl p-6"
            >
              {/* Telegram chat mock */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/5">
                <MarvinLogo className="w-8 h-8" />
                <div>
                  <div className="text-sm font-semibold">Marvin CNC Bot</div>
                  <div className="text-xs text-success">online</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-bg-card rounded-xl rounded-tl-sm p-3 max-w-[80%]">
                  <p className="text-sm">New RFQ from <span className="text-primary font-medium">MedTech Solutions</span></p>
                  <p className="text-xs text-text-muted mt-1">Titanium Surgical Instrument Housings</p>
                  <p className="text-xs text-text-muted">25 parts &middot; Est. CHF 18,750</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-success/20 text-success px-2 py-1 rounded">Review</span>
                    <span className="text-xs bg-warning/20 text-warning px-2 py-1 rounded">Remind Later</span>
                  </div>
                </div>
                <div className="bg-primary/20 rounded-xl rounded-tr-sm p-3 max-w-[70%] ml-auto">
                  <p className="text-sm">What&apos;s our current margin on titanium parts?</p>
                </div>
                <div className="bg-bg-card rounded-xl rounded-tl-sm p-3 max-w-[80%]">
                  <p className="text-sm">Your average margin on titanium parts this quarter is <span className="text-primary font-medium">26.3%</span>, up from 22.1% last quarter. Top performer: NeuroDevice AG at 35.7% margin.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          
          className="max-w-3xl mx-auto text-center bg-gradient-to-b from-primary/10 to-transparent border border-primary/20 rounded-3xl p-12"
        >
          <MarvinLogo className="w-16 h-16 mx-auto mb-6 animate-pulse-glow rounded-2xl" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to meet your new shop assistant?
          </h2>
          <p className="text-text-muted-light mb-8 max-w-lg mx-auto">
            Join the next generation of CNC manufacturing. Let Marvin handle the admin
            while you focus on precision.
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-primary-light transition-all shadow-lg shadow-primary/25 hover:-translate-y-0.5"
          >
            Start Onboarding
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <MarvinLogo className="w-6 h-6" />
            <span className="text-sm text-text-muted">
              Marvin by <span className="text-primary">Imnoo AG</span>
            </span>
          </div>
          <p className="text-xs text-text-muted">
            &copy; 2026 Imnoo AG. All rights reserved. Made in Switzerland.
          </p>
        </div>
      </footer>
    </div>
  );
}
