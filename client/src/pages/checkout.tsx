import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { CheckCircle2, XCircle, Crown, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { GlassCard, GoldButton, GhostButton, GoldHeading, GoldText, SfsContainer } from "@/components/sfs";

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [status, setStatus] = useState<"success" | "canceled" | "loading">("loading");
  const [plan, setPlan] = useState<string>("pro");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      setStatus("success");
      setPlan(params.get("plan") || "pro");
    } else if (params.get("canceled") === "true") {
      setStatus("canceled");
    } else {
      setLocation("/subscribe");
    }
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[var(--sf-gold)] animate-spin" />
      </div>
    );
  }

  if (status === "canceled") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <SfsContainer className="max-w-md">
          <GlassCard className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
            <GoldHeading level={1} className="text-2xl mb-2">Payment Cancelled</GoldHeading>
            <p className="text-neutral-400 mb-8">
              No worries — your free plan is still active. You can upgrade whenever you're ready.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <GoldButton onClick={() => setLocation("/subscribe")}>
                View Plans <ArrowRight className="ml-2 w-4 h-4" />
              </GoldButton>
              <GhostButton onClick={() => setLocation("/dashboard")}>
                Go to Dashboard
              </GhostButton>
            </div>
          </GlassCard>
        </SfsContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <SfsContainer className="max-w-md">
        <GlassCard className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-[var(--sf-gold)]/10 border border-[var(--sf-gold)]/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-[var(--sf-gold)]" />
          </div>

          <div className="inline-flex items-center gap-2 bg-[var(--sf-gold)]/10 border border-[var(--sf-gold)]/20 rounded-full px-4 py-1.5 mb-4">
            <Crown className="w-4 h-4 text-[var(--sf-gold)]" />
            <GoldText className="text-sm font-semibold capitalize">{plan} Plan Activated</GoldText>
          </div>

          <GoldHeading level={1} className="text-3xl mb-3">You're all set!</GoldHeading>
          <p className="text-neutral-400 mb-2">
            Welcome to SmartFlow {plan.charAt(0).toUpperCase() + plan.slice(1)}.
            Your 14-day free trial has started — no charge until the trial ends.
          </p>
          <p className="text-neutral-500 text-sm mb-8">
            {user?.email ? `A confirmation will be sent to ${user.email}.` : "Check your email for a confirmation receipt."}
          </p>

          <div className="bg-black/30 border border-white/5 rounded-2xl p-6 mb-8 text-left space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">What's unlocked</p>
            {plan === "agency" ? (
              <>
                <Feature text="Up to 20 client workspaces" />
                <Feature text="White-label dashboard" />
                <Feature text="Dedicated account manager" />
                <Feature text="Unlimited AI generations" />
                <Feature text="Priority SLA support" />
              </>
            ) : (
              <>
                <Feature text="Unlimited AI content generations" />
                <Feature text="Full post builder & auto-scheduler" />
                <Feature text="Advanced analytics dashboard" />
                <Feature text="Premium content templates" />
                <Feature text="Priority customer support" />
              </>
            )}
          </div>

          <GoldButton
            onClick={() => setLocation("/dashboard")}
            className="w-full py-4 text-base"
          >
            Go to Dashboard <ArrowRight className="ml-2 w-4 h-4" />
          </GoldButton>
        </GlassCard>
      </SfsContainer>
    </div>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle2 className="w-4 h-4 text-[var(--sf-gold)] flex-shrink-0" />
      <span className="text-sm text-neutral-300">{text}</span>
    </div>
  );
}
