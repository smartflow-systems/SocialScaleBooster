import { useState } from "react";
import { Check, Crown, Zap, Bot, BarChart3, Infinity, ArrowLeft, Star, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { GlassCard, GoldButton, GhostButton, GoldHeading, GoldText, SfsContainer, SfsSection } from "@/components/sfs";

const plans = [
  {
    id: "free",
    name: "Starter",
    price: "£0",
    period: "/month",
    badge: null,
    description: "Get started with essential tools — no card required.",
    highlight: false,
    titleGold: false,
    features: [
      { text: "Up to 3 AI generations/day", icon: Bot },
      { text: "Caption & hashtag generator", icon: BarChart3 },
      { text: "Community templates", icon: Star },
      { text: "Email support", icon: Check },
    ],
    cta: "Current Plan",
    ctaDisabled: true,
    stripePlan: null,
  },
  {
    id: "pro",
    name: "Pro",
    price: "£49",
    period: "/month",
    badge: "MOST POPULAR",
    description: "Unlimited AI content, scheduling & automation. 14-day free trial.",
    highlight: true,
    titleGold: true,
    features: [
      { text: "Unlimited AI generations", icon: Infinity },
      { text: "Full post builder & scheduler", icon: Zap },
      { text: "Advanced analytics", icon: BarChart3 },
      { text: "Premium templates", icon: Crown },
      { text: "Multi-platform posting", icon: Check },
      { text: "Priority support", icon: Check },
    ],
    cta: "Start 14-Day Free Trial",
    ctaDisabled: false,
    stripePlan: "pro",
  },
  {
    id: "agency",
    name: "Agency",
    price: "£149",
    period: "/month",
    badge: "BEST VALUE",
    description: "Full-service automation for agencies managing multiple clients.",
    highlight: false,
    titleGold: false,
    features: [
      { text: "Everything in Pro", icon: Crown },
      { text: "Up to 20 client workspaces", icon: Bot },
      { text: "White-label dashboard", icon: Star },
      { text: "Dedicated account manager", icon: Check },
      { text: "Custom integrations", icon: Zap },
      { text: "SLA support", icon: Check },
    ],
    cta: "Start 14-Day Free Trial",
    ctaDisabled: false,
    stripePlan: "agency",
  },
];

export default function Subscribe() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleCta = async (plan: typeof plans[0]) => {
    if (!plan.stripePlan || plan.ctaDisabled) return;

    setLoadingPlan(plan.id);
    try {
      const res = await fetch("/api/billing/simple/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: plan.stripePlan,
          email: user?.email || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start checkout");
      window.location.href = data.url;
    } catch (err: any) {
      toast({ title: "Checkout failed", description: err.message, variant: "destructive" });
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SfsSection>
        <SfsContainer className="max-w-6xl">

          <div className="mb-10">
            <GhostButton
              onClick={() => setLocation(user ? "/dashboard" : "/")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {user ? "Back to Dashboard" : "Back to Home"}
            </GhostButton>
          </div>

          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-[var(--sf-gold)]/10 text-[var(--sf-gold)] border border-[var(--sf-gold)]/30 rounded-full px-4 py-1.5 mb-4 text-xs font-semibold uppercase tracking-widest">
              Simple, Transparent Pricing
            </div>
            <GoldHeading level={1} className="text-4xl sm:text-5xl mb-4">
              Choose Your <GoldText>Plan</GoldText>
            </GoldHeading>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              Start free, scale as you grow. All paid plans include a 14-day free trial — no card charged upfront.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <GlassCard
                key={plan.name}
                className={`relative flex flex-col ${
                  plan.highlight
                    ? "ring-1 ring-[var(--sf-gold)]/40 shadow-[0_0_40px_rgba(255,215,0,0.1)] border-[var(--sf-gold)]/40"
                    : ""
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-0 right-0 flex justify-center">
                    <span className="bg-[var(--sf-gold)] text-[var(--sf-black)] font-bold px-4 py-1 text-xs rounded-full">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="pt-4 pb-4">
                  <h3 className={`${plan.titleGold ? "text-[var(--sf-gold)]" : "text-white"} text-xl flex items-center gap-2 mb-1 font-bold`}>
                    <Crown className="w-5 h-5" />
                    {plan.name}
                  </h3>
                  <div className="flex items-end gap-1 mt-2">
                    <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                    <span className="text-neutral-500 mb-1">{plan.period}</span>
                  </div>
                  <p className="text-neutral-400 text-sm mt-2">{plan.description}</p>
                </div>

                <div className="flex flex-col flex-1 gap-6">
                  <ul className="space-y-3 flex-1">
                    {plan.features.map(({ text, icon: Icon }) => (
                      <li key={text} className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-[var(--sf-gold)] flex-shrink-0" />
                        <span className="text-neutral-300 text-sm">{text}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.ctaDisabled ? (
                    <button
                      disabled
                      className="w-full py-4 text-base bg-white/5 text-neutral-500 border border-white/10 rounded-xl cursor-default"
                    >
                      {plan.cta}
                    </button>
                  ) : plan.highlight ? (
                    <GoldButton
                      onClick={() => handleCta(plan)}
                      disabled={loadingPlan !== null}
                      className="w-full py-4 text-base disabled:opacity-60"
                    >
                      {loadingPlan === plan.id ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Redirecting...</>
                      ) : (
                        plan.cta
                      )}
                    </GoldButton>
                  ) : (
                    <GhostButton
                      onClick={() => handleCta(plan)}
                      disabled={loadingPlan !== null}
                      className="w-full py-4 text-base disabled:opacity-60"
                    >
                      {loadingPlan === plan.id ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Redirecting...</>
                      ) : (
                        plan.cta
                      )}
                    </GhostButton>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>

          <div className="mt-12 text-center space-y-2">
            <p className="text-neutral-500 text-sm">
              Secured by Stripe. SSL-encrypted billing. Cancel anytime.
            </p>
            <p className="text-neutral-600 text-sm">
              Need a custom quote?{" "}
              <button
                onClick={() => {
                  setLocation("/");
                  setTimeout(() => {
                    const el = document.getElementById("contact");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
                className="text-[var(--sf-gold)]/70 underline hover:no-underline hover:text-[var(--sf-gold)] transition-colors"
              >
                Talk to us
              </button>
            </p>
          </div>
        </SfsContainer>
      </SfsSection>
    </div>
  );
}
