"use client";

export function MarvinLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="25" width="100" height="75" rx="20" fill="#282b34" stroke="#14b0ae" strokeWidth="3" />
      <rect x="22" y="45" width="28" height="18" rx="9" fill="#14b0ae" opacity="0.9" />
      <rect x="70" y="45" width="28" height="18" rx="9" fill="#14b0ae" opacity="0.9" />
      <circle cx="36" cy="54" r="4" fill="#282b34" />
      <circle cx="84" cy="54" r="4" fill="#282b34" />
      <rect x="35" y="10" width="8" height="20" rx="4" fill="#14b0ae" />
      <rect x="77" y="10" width="8" height="20" rx="4" fill="#14b0ae" />
      <path d="M 40 75 Q 60 88 80 75" stroke="#14b0ae" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function ImnooWordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-bold tracking-tight ${className}`}>
      <span className="text-primary">imnoo</span>
    </span>
  );
}
