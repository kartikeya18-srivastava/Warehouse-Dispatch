import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = "", variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
        const variants = {
            primary: "btn-primary",
            secondary: "bg-slate-900 text-white hover:bg-slate-800",
            outline: "border-2 border-slate-200 hover:border-primary hover:text-primary bg-transparent",
            ghost: "hover:bg-slate-100 text-slate-600",
        };

        const sizes = {
            sm: "px-4 py-2 text-sm",
            md: "px-6 py-3 text-base",
            lg: "px-8 py-4 text-lg",
        };

        return (
            <button
                ref={ref}
                disabled={isLoading}
                className={`btn-premium relative flex items-center justify-center gap-2 ${variants[variant]} ${sizes[size]} ${className}`}
                {...props}
            >
                {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : null}
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";

export default Button;
