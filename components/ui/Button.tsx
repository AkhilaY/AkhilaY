"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "icon";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", children, ...props }, ref) => {
    const base = "inline-flex items-center justify-center font-sans transition-all duration-200 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed";

    const variants = {
      primary: "bg-charcoal text-white hover:bg-charcoal/80 border border-charcoal",
      ghost: "bg-transparent text-charcoal border border-gold hover:bg-gold/10",
      icon: "bg-transparent text-muted hover:text-charcoal",
    };

    const sizes = {
      sm: "px-4 py-2 text-xs tracking-widest uppercase",
      md: "px-6 py-3 text-xs tracking-widest uppercase",
      lg: "px-8 py-4 text-sm tracking-widest uppercase",
    };

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${variant !== "icon" ? sizes[size] : ""} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
