"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "@/services/auth";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await authService.register(email, password, fullName);
      toast.success("Registration successful! Please check your email.");
      router.push("/auth/login");
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-hima-main">
      {/* Back to Home Button */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-slate-300 hover:text-white transition-colors group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        <span className="text-sm font-medium">Back to Home</span>
      </Link>

      {/* Background Decoratives */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-hima-secondary/20 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-hima-main/50 via-hima-main to-hima-main" />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 transform transition-all hover:scale-[1.01] duration-500">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="relative w-20 h-20 bg-white/10 rounded-full p-3 shadow-lg ring-1 ring-white/20 backdrop-blur-md flex items-center justify-center">
                <img
                  src="/himaskom-logo.png"
                  alt="HIMASKOM Logo"
                  className="w-full h-full object-contain drop-shadow-md"
                />
              </div>
            </div>
            <h1 className="text-3xl text-white mb-2">
              Create Account
            </h1>
            <p className="text-slate-300 text-xs tracking-wide uppercase">
              Begin your premium experience
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-4">
              {/* Full Name Input */}
              <div className="relative group">
                <input
                  id="register-name"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  value={fullName}
                  onFocus={() => setActiveField('name')}
                  onBlur={() => setActiveField(null)}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-950/30 text-slate-100 border border-slate-600 rounded-xl px-4 pb-2.5 pt-5 focus:outline-none focus:border-hima-secondary focus:ring-1 focus:ring-hima-secondary/50 transition-all font-sans peer text-sm"
                  required
                />
                <label
                  htmlFor="register-name"
                  className={`absolute left-4 transition-all duration-300 pointer-events-none transform origin-top-left ${activeField === 'name' || fullName
                    ? 'top-1.5 text-[10px] text-hima-secondary font-bold uppercase tracking-widest'
                    : 'top-3.5 text-slate-400 text-sm'
                    }`}
                >
                  Full Name
                </label>
              </div>

              {/* Email Input */}
              <div className="relative group">
                <input
                  id="register-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onFocus={() => setActiveField('email')}
                  onBlur={() => setActiveField(null)}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950/30 text-slate-100 border border-slate-600 rounded-xl px-4 pb-2.5 pt-5 focus:outline-none focus:border-hima-secondary focus:ring-1 focus:ring-hima-secondary/50 transition-all font-sans peer text-sm"
                  required
                />
                <label
                  htmlFor="register-email"
                  className={`absolute left-4 transition-all duration-300 pointer-events-none transform origin-top-left ${activeField === 'email' || email
                    ? 'top-1.5 text-[10px] text-hima-secondary font-bold uppercase tracking-widest'
                    : 'top-3.5 text-slate-400 text-sm'
                    }`}
                >
                  Email Address
                </label>
              </div>

              {/* Password Input */}
              <div className="relative group">
                <input
                  id="register-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onFocus={() => setActiveField('password')}
                  onBlur={() => setActiveField(null)}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/30 text-slate-100 border border-slate-600 rounded-xl px-4 pb-2.5 pt-5 focus:outline-none focus:border-hima-secondary focus:ring-1 focus:ring-hima-secondary/50 transition-all font-sans peer text-sm"
                  required
                />
                <label
                  htmlFor="register-password"
                  className={`absolute left-4 transition-all duration-300 pointer-events-none transform origin-top-left ${activeField === 'password' || password
                    ? 'top-1.5 text-[10px] text-hima-secondary font-bold uppercase tracking-widest'
                    : 'top-3.5 text-slate-400 text-sm'
                    }`}
                >
                  Password
                </label>
              </div>

              {/* Confirm Password Input */}
              <div className="relative group">
                <input
                  id="register-confirm"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onFocus={() => setActiveField('confirm')}
                  onBlur={() => setActiveField(null)}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-950/30 text-slate-100 border border-slate-600 rounded-xl px-4 pb-2.5 pt-5 focus:outline-none focus:border-hima-secondary focus:ring-1 focus:ring-hima-secondary/50 transition-all font-sans peer text-sm"
                  required
                />
                <label
                  htmlFor="register-confirm"
                  className={`absolute left-4 transition-all duration-300 pointer-events-none transform origin-top-left ${activeField === 'confirm' || confirmPassword
                    ? 'top-1.5 text-[10px] text-hima-secondary font-bold uppercase tracking-widest'
                    : 'top-3.5 text-slate-400 text-sm'
                    }`}
                >
                  Confirm Password
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-hima-secondary hover:bg-hima-secondary/90 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-black/20 hover:shadow-black/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2 text-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-300 text-xs">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-hima-link hover:text-white font-medium transition-colors hover:underline decoration-hima-link/30 underline-offset-4">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
