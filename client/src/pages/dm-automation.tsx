import { Link } from "wouter";
import { MessageSquare, ArrowLeft } from "lucide-react";
import { GlassCard, GoldHeading, SfsContainer } from "@/components/sfs";

export default function DMAutomation() {
  return (
    <div className="min-h-screen bg-[var(--sf-black)] text-white">
      <SfsContainer className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-[var(--sf-gold)] hover:text-[var(--sf-gold-2)] transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-[var(--sf-gold)] to-[var(--sf-gold-2)] rounded-xl flex items-center justify-center shadow-[var(--sf-glow-gold-sm)]">
            <MessageSquare className="w-6 h-6 text-[var(--sf-black)]" />
          </div>
          <div>
            <GoldHeading level={1} className="text-2xl font-bold">DM Automation</GoldHeading>
            <p className="text-neutral-400 text-sm">Automate direct messages for lead generation and customer support</p>
          </div>
        </div>
        <GlassCard className="p-8 text-center">
          <MessageSquare className="w-16 h-16 text-[var(--sf-gold)]/40 mx-auto mb-4" />
          <GoldHeading level={2} className="text-xl font-semibold mb-2">Coming Soon</GoldHeading>
          <p className="text-neutral-400 max-w-md mx-auto">
            This feature is under development. Automate direct messages for lead generation and customer support will be available soon.
          </p>
        </GlassCard>
      </SfsContainer>
    </div>
  );
}
