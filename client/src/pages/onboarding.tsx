import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import {
  Bot, Monitor, TrendingUp, Globe, BarChart3, Star,
  Users, CheckCircle2, ArrowRight, Sparkles, Building2, User,
} from "lucide-react";

const niches = [
  { id: "barber", label: "Barber / Salon", icon: "✂️" },
  { id: "gym", label: "Gym / Fitness", icon: "🏋️" },
  { id: "restaurant", label: "Restaurant / Cafe", icon: "🍽️" },
  { id: "retail", label: "Retail / E-Commerce", icon: "🛍️" },
  { id: "agency", label: "Marketing Agency", icon: "📣" },
  { id: "saas", label: "SaaS / Tech", icon: "💻" },
  { id: "health", label: "Health & Wellness", icon: "🌿" },
  { id: "other", label: "Other Business", icon: "🏢" },
];

const goals = [
  { id: "content", label: "Generate AI Content", desc: "Captions, posts, and hashtags in seconds", icon: Sparkles },
  { id: "schedule", label: "Schedule & Automate", desc: "Post at the best times automatically", icon: Bot },
  { id: "grow", label: "Grow My Audience", desc: "Reach new followers and customers", icon: TrendingUp },
  { id: "clients", label: "Manage Clients", desc: "Handle multiple accounts as an agency", icon: Users },
];

const STEPS = ["Your Profile", "Pick Your Niche", "Your Goals"];

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const { user, updateUser } = useAuth();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    businessName: "",
    accountType: "" as "solo" | "agency" | "",
    niche: "",
    goals: [] as string[],
  });

  const canNext = () => {
    if (step === 0) return form.businessName.trim().length > 0 && form.accountType !== "";
    if (step === 1) return form.niche !== "";
    if (step === 2) return form.goals.length > 0;
    return false;
  };

  const toggleGoal = (id: string) => {
    setForm((prev) => ({
      ...prev,
      goals: prev.goals.includes(id)
        ? prev.goals.filter((g) => g !== id)
        : [...prev.goals, id],
    }));
  };

  const handleFinish = () => {
    updateUser({
      businessName: form.businessName,
      niche: form.niche,
      onboardingComplete: true,
    });
    setLocation("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center px-4 py-10" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/30 flex items-center justify-center">
              <Bot className="w-5 h-5 text-[#FFD700]" />
            </div>
            <span className="text-lg font-bold text-[#FFD700]">SmartFlow Systems</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mb-1">
            {step === 0 && "Let's set you up"}
            {step === 1 && "What's your industry?"}
            {step === 2 && "What do you want to do?"}
          </h2>
          <p className="text-sm text-neutral-500">
            Step {step + 1} of {STEPS.length} — {STEPS[step]}
          </p>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1.5 mb-8">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1 rounded-full transition-all duration-500 ${
                i <= step ? "bg-[#FFD700]" : "bg-white/10"
              }`}
            />
          ))}
        </div>

        {/* Card */}
        <div className="bg-[#111] border border-white/8 rounded-2xl p-7 mb-5">

          {/* Step 0 — Profile */}
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs text-neutral-400 font-medium uppercase tracking-widest mb-1.5">
                  Business Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. The Golden Barbers"
                  value={form.businessName}
                  onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                  className="w-full bg-[#0D0D0D] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#FFD700]/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-400 font-medium uppercase tracking-widest mb-3">
                  I'm a...
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "solo", label: "Solo / Small Business", icon: User, desc: "Managing my own brand" },
                    { id: "agency", label: "Agency / Freelancer", icon: Building2, desc: "Managing multiple clients" },
                  ].map(({ id, label, icon: Icon, desc }) => (
                    <button
                      key={id}
                      onClick={() => setForm({ ...form, accountType: id as "solo" | "agency" })}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        form.accountType === id
                          ? "border-[#FFD700]/60 bg-[#FFD700]/10"
                          : "border-white/10 bg-[#0D0D0D] hover:border-[#FFD700]/30"
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-2 ${form.accountType === id ? "text-[#FFD700]" : "text-neutral-400"}`} />
                      <p className={`text-sm font-semibold ${form.accountType === id ? "text-white" : "text-neutral-300"}`}>{label}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">{desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 1 — Niche */}
          {step === 1 && (
            <div className="grid grid-cols-2 gap-3">
              {niches.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setForm({ ...form, niche: n.id })}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    form.niche === n.id
                      ? "border-[#FFD700]/60 bg-[#FFD700]/10"
                      : "border-white/10 bg-[#0D0D0D] hover:border-[#FFD700]/30"
                  }`}
                >
                  <span className="text-2xl block mb-2">{n.icon}</span>
                  <p className={`text-sm font-semibold ${form.niche === n.id ? "text-white" : "text-neutral-300"}`}>
                    {n.label}
                  </p>
                  {form.niche === n.id && (
                    <CheckCircle2 className="w-4 h-4 text-[#FFD700] mt-1.5" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Step 2 — Goals */}
          {step === 2 && (
            <div className="space-y-3">
              <p className="text-xs text-neutral-500 mb-4">Pick everything that applies — we'll personalise your dashboard.</p>
              {goals.map(({ id, label, desc, icon: Icon }) => {
                const active = form.goals.includes(id);
                return (
                  <button
                    key={id}
                    onClick={() => toggleGoal(id)}
                    className={`w-full p-4 rounded-xl border text-left flex items-center gap-4 transition-all ${
                      active
                        ? "border-[#FFD700]/60 bg-[#FFD700]/10"
                        : "border-white/10 bg-[#0D0D0D] hover:border-[#FFD700]/30"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${active ? "bg-[#FFD700]/20" : "bg-white/5"}`}>
                      <Icon className={`w-5 h-5 ${active ? "text-[#FFD700]" : "text-neutral-400"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${active ? "text-white" : "text-neutral-300"}`}>{label}</p>
                      <p className="text-xs text-neutral-500">{desc}</p>
                    </div>
                    {active && <CheckCircle2 className="w-5 h-5 text-[#FFD700] flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {step > 0 && (
            <Button
              onClick={() => setStep(step - 1)}
              variant="outline"
              className="border-white/15 text-neutral-400 hover:text-white hover:border-white/30 flex-1"
            >
              Back
            </Button>
          )}
          {step < STEPS.length - 1 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canNext()}
              className="bg-[#FFD700] text-[#0D0D0D] hover:bg-[#E6C200] font-bold flex-1 disabled:opacity-40"
            >
              Continue <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleFinish}
              disabled={!canNext()}
              className="bg-[#FFD700] text-[#0D0D0D] hover:bg-[#E6C200] font-bold flex-1 disabled:opacity-40"
            >
              Go to Dashboard <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          )}
        </div>

        {step === 0 && (
          <button
            onClick={handleFinish}
            className="block w-full text-center text-xs text-neutral-600 hover:text-neutral-400 mt-4 transition-colors"
          >
            Skip for now →
          </button>
        )}
      </div>
    </div>
  );
}
