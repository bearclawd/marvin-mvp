"use client";

import { cn } from "@/lib/cn";
import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-text-muted-light">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full bg-bg-darker border border-border-dark rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-text-muted transition-colors focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50",
            error && "border-danger focus:border-danger focus:ring-danger/50",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input };
