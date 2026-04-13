import { Check, Crown, Zap, Bot, BarChart3, Infinity, ArrowLeft, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

const plans = [
  {
    name: "Starter",
    price: "£0",
    period: "/month",
    badge: null,
    description: "Get started with essential tools — no card required.",
    color: "border-secondary-brown",
    titleColor: "text-white",
    features: [
      { text: "Up to 3 active bots", icon: Bot },
      { text: "Basic analytics dashboard", icon: BarChart3 },
      { text: "Community templates", icon: Star },
      { text: "Email support", icon: Check },
    ],
    cta: "Get Started Free",
    ctaStyle: "bg-card-bg text-accent-gold border border-accent-gold hover:bg-accent-gold hover:text-primary-black",
    href: "/#contact",
  },
  {
    name: "Pro",
    price: "£49",
    period: "/month",
    badge: "MOST POPULAR",
    description: "Everything you need to scale your social presence.",
    color: "border-accent-gold",
    titleColor: "text-accent-gold",
    features: [
      { text: "Unlimited bots", icon: Infinity },
      { text: "Advanced analytics & insights", icon: BarChart3 },
      { text: "Premium bot templates", icon: Crown },
      { text: "Advanced scheduling", icon: Zap },
      { text: "AI personality customization", icon: Star },
      { text: "Multi-platform integrations", icon: Check },
      { text: "Priority support", icon: Check },
    ],
    cta: "Get Started with Pro",
    ctaStyle: "bg-accent-gold text-primary-black hover:opacity-90 font-bold",
    href: "/#contact",
  },
  {
    name: "Agency",
    price: "£149",
    period: "/month",
    badge: "BEST VALUE",
    description: "Full-service automation for agencies managing multiple clients.",
    color: "border-secondary-brown",
    titleColor: "text-white",
    features: [
      { text: "Everything in Pro", icon: Crown },
      { text: "Up to 20 client workspaces", icon: Bot },
      { text: "White-label dashboard", icon: Star },
      { text: "Dedicated account manager", icon: Check },
      { text: "Custom integrations", icon: Zap },
      { text: "SLA support", icon: Check },
    ],
    cta: "Contact Us",
    ctaStyle: "bg-card-bg text-accent-gold border border-accent-gold hover:bg-accent-gold hover:text-primary-black",
    href: "/#contact",
  },
];

export default function Subscribe() {
  const [, setLocation] = useLocation();

  const handleCta = (href: string) => {
    if (href.startsWith("/#")) {
      setLocation("/");
      setTimeout(() => {
        const el = document.getElementById(href.slice(2));
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      setLocation(href);
    }
  };

  return (
    <div className="min-h-screen bg-primary-black">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <Button
            onClick={() => setLocation("/")}
            variant="ghost"
            className="text-accent-gold hover:text-accent-gold hover:bg-accent-gold/10 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>

        <div className="text-center mb-14">
          <Badge className="bg-accent-gold/10 text-accent-gold border border-accent-gold/30 mb-4">
            Simple, Transparent Pricing
          </Badge>
          <h1 className="text-5xl font-bold text-white mb-4">
            Choose Your <span className="text-accent-gold">Plan</span>
          </h1>
          <p className="text-xl text-neutral-gray max-w-2xl mx-auto">
            Start free, scale as you grow. All plans include a 14-day money-back guarantee.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`bg-card-bg ${plan.color} relative flex flex-col ${
                plan.badge === "MOST POPULAR" ? "ring-1 ring-accent-gold shadow-[0_0_40px_rgba(255,215,0,0.15)]" : ""
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-0 right-0 flex justify-center">
                  <Badge className="bg-accent-gold text-primary-black font-bold px-4 py-1">
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <CardHeader className="pt-8">
                <CardTitle className={`${plan.titleColor} text-xl flex items-center gap-2 mb-1`}>
                  <Crown className="w-5 h-5" />
                  {plan.name}
                </CardTitle>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-neutral-gray mb-1">{plan.period}</span>
                </div>
                <p className="text-neutral-gray text-sm">{plan.description}</p>
              </CardHeader>

              <CardContent className="flex flex-col flex-1 gap-6">
                <ul className="space-y-3 flex-1">
                  {plan.features.map(({ text, icon: Icon }) => (
                    <li key={text} className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-accent-gold flex-shrink-0" />
                      <span className="text-neutral-gray text-sm">{text}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleCta(plan.href)}
                  className={`w-full py-6 text-base ${plan.ctaStyle}`}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-neutral-gray text-sm mb-2">
            🔒 All plans include SSL-secured billing and cancel-anytime flexibility.
          </p>
          <p className="text-neutral-gray text-sm">
            Need a custom quote?{" "}
            <button
              onClick={() => handleCta("/#contact")}
              className="text-accent-gold underline hover:no-underline"
            >
              Talk to us
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
