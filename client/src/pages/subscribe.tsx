import { useState } from "react";
import { Check, Crown, Zap, Bot, BarChart3, Infinity, ArrowLeft, Star, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

const plans = [
  {
    id: "free",
    name: "Starter",
    price: "£0",
    period: "/month",
    badge: null,
    description: "Get started with essential tools — no card required.",
    color: "border-white/10",
    titleColor: "text-white",
    features: [
      { text: "Up to 3 AI generations/day", icon: Bot },
      { text: "Caption & hashtag generator", icon: BarChart3 },
      { text: "Community templates", icon: Star },
      { text: "Email support", icon: Check },
    ],
    cta: "Current Plan",
    ctaDisabled: true,
    ctaStyle: "bg-white/5 text-neutral-500 border border-white/10 cursor-default",
    stripePlan: null,
  },
  {
    id: "pro",
    name: "Pro",
    price: "£49",
    period: "/month",
    badge: "MOST POPULAR",
    description: "Unlimited AI content, scheduling & automation. 14-day free trial.",
    color: "border-[#FFD700]/40",
    titleColor: "text-[#FFD700]",
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
    ctaStyle: "bg-[#FFD700] text-[#0D0D0D] hover:bg-[#E6C200] font-bold",
    stripePlan: "pro",
  },
  {
    id: "agency",
    name: "Agency",
    price: "£149",
    period: "/month",
    badge: "BEST VALUE",
    description: "Full-service automation for agencies managing multiple clients.",
    color: "border-white/10",
    titleColor: "text-white",
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
    ctaStyle: "bg-white/5 text-white border border-white/20 hover:bg-white/10 font-semibold",
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
    <div className="min-h-screen bg-[#0D0D0D]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-6xl mx-auto px-4 py-12">

        <div className="mb-10">
          <Button
            onClick={() => setLocation(user ? "/dashboard" : "/")}
            variant="ghost"
            className="text-[#FFD700] hover:text-[#FFD700] hover:bg-[#FFD700]/10 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {user ? "Back to Dashboard" : "Back to Home"}
          </Button>
        </div>

        <div className="text-center mb-14">
          <Badge className="bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/30 mb-4">
            Simple, Transparent Pricing
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Choose Your <span className="text-[#FFD700]">Plan</span>
          </h1>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Start free, scale as you grow. All paid plans include a 14-day free trial — no card charged upfront.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`bg-[#111] ${plan.color} border relative flex flex-col transition-shadow ${
                plan.badge === "MOST POPULAR"
                  ? "ring-1 ring-[#FFD700]/40 shadow-[0_0_40px_rgba(255,215,0,0.1)]"
                  : ""
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-0 right-0 flex justify-center">
                  <Badge className="bg-[#FFD700] text-[#0D0D0D] font-bold px-4 py-1 text-xs">
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <CardHeader className="pt-8 pb-4">
                <CardTitle className={`${plan.titleColor} text-xl flex items-center gap-2 mb-1`}>
                  <Crown className="w-5 h-5" />
                  {plan.name}
                </CardTitle>
                <div className="flex items-end gap-1 mt-2">
                  <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                  <span className="text-neutral-500 mb-1">{plan.period}</span>
                </div>
                <p className="text-neutral-400 text-sm mt-2">{plan.description}</p>
              </CardHeader>

              <CardContent className="flex flex-col flex-1 gap-6 pt-0">
                <ul className="space-y-3 flex-1">
                  {plan.features.map(({ text, icon: Icon }) => (
                    <li key={text} className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-[#FFD700] flex-shrink-0" />
                      <span className="text-neutral-300 text-sm">{text}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleCta(plan)}
                  disabled={plan.ctaDisabled || loadingPlan !== null}
                  className={`w-full py-6 text-base ${plan.ctaStyle}`}
                >
                  {loadingPlan === plan.id ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Redirecting...</>
                  ) : (
                    plan.cta
                  )}
                </Button>
              </CardContent>
            </Card>
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
              className="text-[#FFD700]/70 underline hover:no-underline hover:text-[#FFD700] transition-colors"
            >
              Talk to us
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
