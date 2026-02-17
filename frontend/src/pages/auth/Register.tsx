import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../services/authApi";
import { Icons } from "../../components/Icons";

const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["ADMIN", "DISPATCHER", "DRIVER", "WAREHOUSE_MANAGER"], {
        message: "Please select a valid role"
    }),
    zone: z.string().min(1, "Zone is required"),
    shift: z.enum(["MORNING", "AFTERNOON", "NIGHT"]).optional()
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage = () => {
    const navigate = useNavigate();
    const [register, { isLoading }] = useRegisterMutation();
    const [isRegistered, setIsRegistered] = useState(false);

    const { register: registerField, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema)
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
            await register(data).unwrap();
            setIsRegistered(true);
        } catch (err: unknown) {
            console.error("Registration failed:", err);
        }
    };

    if (isRegistered) {
        return (
            <div className="w-full animate-fade-in">
                <div className="p-12 rounded-[2.5rem] bg-white border border-border-subtle shadow-2xl shadow-slate-200/50 text-center">
                    <div className="mb-8 flex justify-center">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary shadow-lg shadow-primary/10">
                            <Icons.CheckCircle className="w-10 h-10" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-black text-txt-main mb-4 tracking-tighter">Registration Complete</h2>
                    <p className="text-sm text-txt-muted font-medium leading-relaxed mb-10 max-w-sm mx-auto uppercase tracking-widest">
                        We've sent a verification link to your terminal. Check your inbox to activate your credentials.
                    </p>
                    <button
                        onClick={() => navigate("/login")}
                        className="btn-premium btn-primary py-4 px-10 text-xs shadow-xl shadow-primary/30"
                    >
                        Return to Console
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-black text-txt-main mb-2 tracking-tighter">
                    Platform Onboarding
                </h1>
                <p className="text-sm text-txt-muted font-black uppercase tracking-[0.2em]">Deployment Protocol v1.0</p>
            </div>

            <div className="p-10 rounded-[2.5rem] bg-white border border-border-subtle shadow-2xl shadow-slate-200/50">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-txt-muted uppercase tracking-widest ml-1">
                                Operational Name
                            </label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-100 text-txt-main placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all font-bold text-sm"
                                {...registerField("name")}
                            />
                            {errors.name && (
                                <p className="text-[10px] font-black text-red-400 mt-1 ml-1 uppercase">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-txt-muted uppercase tracking-widest ml-1">
                                System Email
                            </label>
                            <input
                                type="email"
                                placeholder="john@warehouse.com"
                                className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-100 text-txt-main placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all font-bold text-sm"
                                {...registerField("email")}
                            />
                            {errors.email && (
                                <p className="text-[10px] font-black text-red-400 mt-1 ml-1 uppercase">{errors.email.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-txt-muted uppercase tracking-widest ml-1">
                            Access Key
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-100 text-txt-main placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all font-bold text-sm"
                            {...registerField("password")}
                        />
                        {errors.password && (
                            <p className="text-[10px] font-black text-red-400 mt-1 ml-1 uppercase">{errors.password.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-txt-muted uppercase tracking-widest ml-1">
                                Clearance Level
                            </label>
                            <div className="relative">
                                <select
                                    {...registerField("role")}
                                    className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-100 text-txt-main focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all font-bold text-sm appearance-none cursor-pointer"
                                >
                                    <option value="" className="text-slate-400">Select Grade</option>
                                    <option value="ADMIN">Administrator</option>
                                    <option value="DISPATCHER">Dispatcher</option>
                                    <option value="DRIVER">Driver</option>
                                    <option value="WAREHOUSE_MANAGER">Warehouse Manager</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-txt-muted">
                                    <Icons.Filter className="w-4 h-4" />
                                </div>
                            </div>
                            {errors.role && (
                                <p className="text-[10px] font-black text-red-400 mt-1 ml-1 uppercase">{errors.role.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-txt-muted uppercase tracking-widest ml-1">
                                Assigned Sector
                            </label>
                            <input
                                type="text"
                                placeholder="Sector-4 / North"
                                className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-100 text-txt-main placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all font-bold text-sm"
                                {...registerField("zone")}
                            />
                            {errors.zone && (
                                <p className="text-[10px] font-black text-red-400 mt-1 ml-1 uppercase">{errors.zone.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-txt-muted uppercase tracking-widest ml-1">
                            Operational Shift
                        </label>
                        <div className="relative">
                            <select
                                {...registerField("shift")}
                                className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-100 text-txt-main focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all font-bold text-sm appearance-none cursor-pointer"
                            >
                                <option value="MORNING">Alpha (06:00 - 14:00)</option>
                                <option value="AFTERNOON">Beta (14:00 - 22:00)</option>
                                <option value="NIGHT">Gamma (22:00 - 06:00)</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-txt-muted">
                                <Icons.Clock className="w-4 h-4" />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-4 btn-premium btn-primary py-5 text-xs shadow-xl shadow-primary/30 active:scale-95 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-3">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Provisioning Credentials...
                            </div>
                        ) : (
                            "Request Console Access"
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-border-subtle text-center">
                    <p className="text-[10px] font-black text-txt-muted uppercase tracking-[0.15em]">
                        Existing Operator?{" "}
                        <Link to="/login" className="text-primary hover:text-secondary transition-colors underline decoration-primary/20 underline-offset-4">
                            Connect Now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
