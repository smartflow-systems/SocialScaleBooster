import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { Bot, Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    const body = isLogin
      ? { username: form.username, password: form.password }
      : { username: form.username, email: form.email, password: form.password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || data.error || "Something went wrong. Please try again.");
      } else {
        login(data.token, data.user);
        if (!data.user?.onboardingComplete) {
          setLocation("/onboarding");
        } else {
          setLocation("/dashboard");
        }
      }
    } catch {
      setError("Unable to connect. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <button onClick={() => setLocation("/")} className="inline-flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/30 flex items-center justify-center">
              <Bot className="w-6 h-6 text-[#FFD700]" />
            </div>
            <span className="text-xl font-bold text-[#FFD700]">SmartFlow Systems</span>
          </button>
          <p className="text-neutral-500 text-sm mt-2">
            {isLogin ? "Welcome back. Sign in to your account." : "Create your account and get started in minutes."}
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#111] border border-white/8 rounded-2xl p-8">
          {/* Tab toggle */}
          <div className="flex bg-[#0D0D0D] rounded-xl p-1 mb-7">
            {["Sign In", "Create Account"].map((label, i) => (
              <button
                key={label}
                onClick={() => { setIsLogin(i === 0); setError(""); }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  (i === 0) === isLogin
                    ? "bg-[#FFD700] text-[#0D0D0D]"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-neutral-400 font-medium uppercase tracking-widest mb-1.5">
                Username
              </label>
              <input
                type="text"
                required
                autoComplete="username"
                placeholder="yourname"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full bg-[#0D0D0D] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#FFD700]/50 transition-colors"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-xs text-neutral-400 font-medium uppercase tracking-widest mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-[#0D0D0D] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#FFD700]/50 transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-xs text-neutral-400 font-medium uppercase tracking-widest mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-[#0D0D0D] border border-white/10 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#FFD700]/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FFD700] text-[#0D0D0D] hover:bg-[#E6C200] font-bold py-3 h-auto text-base mt-2"
            >
              {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
              {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
            </Button>
          </form>

          {!isLogin && (
            <div className="mt-5 space-y-2">
              {["No credit card required", "Free to get started", "Cancel any time"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-xs text-neutral-500">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FFD700]" />
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="text-center text-xs text-neutral-600 mt-6">
          By continuing you agree to our{" "}
          <span className="text-neutral-400 hover:text-[#FFD700] cursor-pointer transition-colors">Terms of Service</span>{" "}
          and{" "}
          <span className="text-neutral-400 hover:text-[#FFD700] cursor-pointer transition-colors">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}
