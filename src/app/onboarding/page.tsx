"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MarvinLogo } from "@/components/landing/marvin-logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Globe,
  ArrowRight,
  Loader2,
  CheckCircle,
  Building,
  Wrench,
  Award,
  Bot,
  Send,
  User,
} from "lucide-react";

type Step = "url" | "analyzing" | "results" | "interview" | "account" | "complete";

interface Analysis {
  companyName: string;
  services: string[];
  materials: string[];
  certifications: string[];
  contactInfo: { email: string; phone: string; address: string };
  specializations: string[];
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("url");
  const [url, setUrl] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [accountLoading, setAccountLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Initialize welcome message when entering interview step
  useEffect(() => {
    if (step === "interview" && chatMessages.length === 0) {
      const welcomeMsg = analysis
        ? `Great, I've analyzed your website! I can see that ${analysis.companyName} offers ${analysis.services.slice(0, 2).join(" and ")}${analysis.services.length > 2 ? ` and ${analysis.services.length - 2} more services` : ""}. You work with ${analysis.materials.slice(0, 3).join(", ")}.\n\nNow I'd like to learn more about your day-to-day operations. Let's start: **What materials do you primarily work with, and which ones make up the bulk of your orders?**`
        : "Hi! I'm Marvin, your CNC shop AI assistant. I'd love to learn about your operations so I can help you most effectively.\n\nLet's start: **What materials do you primarily work with, and which ones make up the bulk of your orders?**";

      setChatMessages([{ id: "welcome", role: "assistant", content: welcomeMsg }]);
    }
  }, [step, analysis, chatMessages.length]);

  const sendChatMessage = useCallback(async (text: string) => {
    if (!text.trim() || chatLoading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: text };
    const newMessages = [...chatMessages, userMsg];
    setChatMessages(newMessages);
    setChatInput("");
    setChatLoading(true);

    try {
      const res = await fetch("/api/onboarding/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          shopContext: analysis,
        }),
      });

      if (!res.ok) throw new Error("Failed");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      const assistantId = (Date.now() + 1).toString();

      setChatMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }]);

      if (reader) {
        let done = false;
        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            setChatMessages((prev) =>
              prev.map((m) => (m.id === assistantId ? { ...m, content: m.content + chunk } : m))
            );
          }
        }
      }
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "assistant", content: "Sorry, I encountered an error. Please ensure OPENAI_API_KEY is set and try again." },
      ]);
    } finally {
      setChatLoading(false);
    }
  }, [chatMessages, chatLoading, analysis]);

  function handleChatSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendChatMessage(chatInput);
  }

  async function handleUrlSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url) return;

    setStep("analyzing");

    try {
      let formattedUrl = url;
      if (!url.startsWith("http")) {
        formattedUrl = `https://${url}`;
      }

      const res = await fetch("/api/onboarding/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: formattedUrl }),
      });

      const data = await res.json();
      if (data.analysis) {
        setAnalysis(data.analysis);
        setStep("results");
      } else {
        setError("Could not analyze website. Please try again.");
        setStep("url");
      }
    } catch {
      setError("Failed to connect. Please check the URL.");
      setStep("url");
    }
  }

  async function handleCreateAccount(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setAccountLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          shopName: analysis?.companyName || "My CNC Shop",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStep("complete");
        setTimeout(() => router.push("/dashboard"), 2000);
      } else {
        setError(data.error || "Registration failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setAccountLoading(false);
    }
  }

  const canFinishInterview = chatMessages.length >= 5;

  return (
    <div className="min-h-screen bg-bg-darkest">
      {/* Progress header */}
      <div className="sticky top-0 z-50 bg-bg-darkest/80 backdrop-blur-xl border-b border-border-dark">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3 mb-3">
            <MarvinLogo className="w-8 h-8" />
            <span className="text-sm font-semibold text-white">Marvin Onboarding</span>
          </div>
          <div className="flex gap-2">
            {["url", "analyzing", "results", "interview", "account"].map((s, i) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  ["url", "analyzing", "results", "interview", "account", "complete"].indexOf(step) >= i
                    ? "bg-primary"
                    : "bg-border-dark"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Step 1: URL Input */}
        {step === "url" && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-white">Let&apos;s get to know your shop</h1>
              <p className="text-text-muted-light mt-2">
                Enter your company website and Marvin will learn about your capabilities
              </p>
            </div>

            <form onSubmit={handleUrlSubmit} className="max-w-md mx-auto space-y-4">
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="yourcompany.ch"
                className="text-center text-lg"
              />
              {error && (
                <p className="text-sm text-danger text-center">{error}</p>
              )}
              <Button type="submit" className="w-full" size="lg">
                Analyze Website <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <p className="text-xs text-text-muted text-center">
                Or{" "}
                <button type="button" onClick={() => { setAnalysis(null); setStep("interview"); }} className="text-primary hover:text-primary-light">
                  skip and start the interview directly
                </button>
              </p>
            </form>
          </div>
        )}

        {/* Step 2: Analyzing */}
        {step === "analyzing" && (
          <div className="animate-fade-in text-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white">Analyzing your website...</h2>
            <p className="text-text-muted-light mt-2">Marvin is reading your website and extracting key information</p>
          </div>
        )}

        {/* Step 3: Results */}
        {step === "results" && analysis && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <h1 className="text-3xl font-bold text-white">Here&apos;s what I found</h1>
              <p className="text-text-muted-light mt-2">Review the information below and then we&apos;ll continue the interview</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="bg-bg-card border border-border-dark rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Building className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-white">Company</span>
                </div>
                <p className="text-text-muted-light">{analysis.companyName}</p>
              </div>

              <div className="bg-bg-card border border-border-dark rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Wrench className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-white">Services</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.services.map((s) => (
                    <span key={s} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-lg">{s}</span>
                  ))}
                </div>
              </div>

              <div className="bg-bg-card border border-border-dark rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-white">Materials & Certifications</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[...analysis.materials, ...analysis.certifications].map((m) => (
                    <span key={m} className="text-xs bg-bg-darker text-text-muted-light px-2 py-1 rounded-lg border border-border-dark">{m}</span>
                  ))}
                </div>
              </div>
            </div>

            <Button onClick={() => setStep("interview")} className="w-full" size="lg">
              Continue with Interview <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Step 4: Interview */}
        {step === "interview" && (
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Interview with Marvin</h2>
                <p className="text-xs text-text-muted">Tell Marvin about your operations</p>
              </div>
            </div>

            {/* Chat messages */}
            <div className="space-y-4 mb-4 max-h-[50vh] overflow-y-auto">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-xl p-4 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary/20 text-white"
                      : "bg-bg-card border border-border-dark text-text-muted-light"
                  }`}>
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {chatLoading && (chatMessages.length === 0 || chatMessages[chatMessages.length - 1]?.content === "") && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-bg-card border border-border-dark rounded-xl p-4">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleChatSubmit} className="flex items-center gap-3 p-3 bg-bg-card border border-border-dark rounded-xl mb-4">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your answer..."
                className="flex-1 bg-transparent text-white text-sm placeholder:text-text-muted outline-none"
                disabled={chatLoading}
              />
              <button
                type="submit"
                disabled={chatLoading || !chatInput.trim()}
                className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center hover:bg-primary-light transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </form>

            {canFinishInterview && (
              <Button onClick={() => setStep("account")} className="w-full" variant="secondary">
                Finish Interview & Create Account <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        )}

        {/* Step 5: Account Creation */}
        {step === "account" && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-white">Almost there!</h1>
              <p className="text-text-muted-light mt-2">Create your account to access the dashboard</p>
            </div>

            <form onSubmit={handleCreateAccount} className="max-w-sm mx-auto space-y-4">
              <Input
                label="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Pascal Behr"
                required
              />
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.ch"
                required
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                minLength={6}
                required
              />

              {error && (
                <p className="text-sm text-danger bg-danger/10 border border-danger/20 rounded-lg px-3 py-2">{error}</p>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={accountLoading}>
                {accountLoading ? "Creating..." : "Create Account & Enter Dashboard"}
              </Button>
            </form>
          </div>
        )}

        {/* Step 6: Complete */}
        {step === "complete" && (
          <div className="animate-fade-in text-center py-20">
            <MarvinLogo className="w-20 h-20 mx-auto mb-6 animate-pulse-glow rounded-2xl" />
            <h1 className="text-3xl font-bold text-white mb-2">Welcome aboard!</h1>
            <p className="text-text-muted-light">Redirecting you to your dashboard...</p>
          </div>
        )}
      </div>
    </div>
  );
}
