import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = "", ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1.5 w-full">
                {label && (
                    <label className="text-sm font-semibold text-slate-700 ml-1">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={`
                        w-full px-4 py-3 rounded-xl border transition-all duration-300
                        bg-white/50 backdrop-blur-sm
                        focus:outline-none focus:ring-4
                        ${error
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                            : "border-slate-200 focus:border-primary focus:ring-primary/10"
                        }
                        ${className}
                    `}
                    {...props}
                />
                {error && (
                    <p className="text-xs font-medium text-red-500 ml-1 animate-in fade-in slide-in-from-top-1">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export default Input;
