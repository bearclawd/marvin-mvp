"use client";

import { cn } from "@/lib/cn";
import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "bg-primary text-white hover:bg-primary-light active:bg-primary-dark shadow-lg shadow-primary/20": variant === "primary",
            "bg-bg-card text-white hover:bg-border-dark border border-border-dark": variant === "secondary",
            "text-text-muted-light hover:text-white hover:bg-white/5": variant === "ghost",
            "bg-danger/10 text-danger hover:bg-danger/20 border border-danger/20": variant === "danger",
            "border border-border-dark text-text-muted-light hover:text-white hover:border-primary": variant === "outline",
          },
          {
            "text-sm px-3 py-1.5": size === "sm",
            "text-sm px-4 py-2.5": size === "md",
            "text-base px-6 py-3": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
export { Button };
