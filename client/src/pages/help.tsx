import { Link } from "wouter";
import { HelpCircle, ArrowLeft, ChevronDown } from "lucide-react";
import { GlassCard, GoldHeading, SfsContainer, FadeInUp, type FadeStagger } from "@/components/sfs";

const FAQS = [
  {
    q: "How do I connect my social accounts?",
    a: "Open Connected Accounts and use 'Connect with Meta' for Facebook & Instagram, or add other platforms manually with API credentials.",
  },
  {
    q: "Can I schedule posts in advance?",
    a: "Yes. Use the Scheduler page to pick a date, time and platforms. Posts auto-publish when due.",
  },
  {
    q: "What does the AI Studio do?",
    a: "It drafts captions, hashtag sets, and image prompts using your brand tone. You can edit before scheduling.",
  },
  {
    q: "Is my data secure?",
    a: "Credentials are encrypted at rest, OAuth tokens are scoped to the minimum required, and we never share your data with third parties.",
  },
  {
    q: "How do I cancel my subscription?",
    a: "Go to Settings → Billing and click 'Cancel plan'. Your access continues until the end of the current billing period.",
  },
];

export default function HelpCenter() {
  return (
    <div className="min-h-screen bg-[var(--sf-black)] text-white">
      <SfsContainer className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-[var(--sf-gold)] hover:text-[var(--sf-gold-2)] transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-[var(--sf-gold)] to-[var(--sf-gold-2)] rounded-xl flex items-center justify-center shadow-[var(--sf-glow-gold-sm)]">
            <HelpCircle className="w-6 h-6 text-[var(--sf-black)]" />
          </div>
          <div>
            <GoldHeading level={1} className="text-2xl font-bold">Help Center</GoldHeading>
            <p className="text-neutral-400 text-sm">Find answers to common questions and get support</p>
          </div>
        </div>
        <div className="space-y-3">
          {FAQS.map((f, i) => {
            const stagger = (Math.min(i + 1, 6) as FadeStagger);
            return (
              <FadeInUp key={f.q} stagger={stagger}>
                <GlassCard className="p-0 overflow-hidden">
                  <details className="group">
                    <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none">
                      <span className="text-sm font-semibold text-white">{f.q}</span>
                      <ChevronDown className="w-4 h-4 text-[var(--sf-gold)] transition-transform group-open:rotate-180 flex-shrink-0" />
                    </summary>
                    <div className="px-5 pb-5 text-sm text-neutral-400">{f.a}</div>
                  </details>
                </GlassCard>
              </FadeInUp>
            );
          })}
        </div>
      </SfsContainer>
    </div>
  );
}
