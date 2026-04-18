import { useState } from "react";
import { Link } from "wouter";
import { MessageSquare, ArrowLeft, MessagesSquare, Bot, HelpCircle } from "lucide-react";
import { GlassCard, GoldButton, GhostButton, GoldHeading, SfsContainer, FadeInUp, type FadeStagger } from "@/components/sfs";
import { useToast } from "@/hooks/use-toast";

const FLOWS = [
  { id: "welcome", name: "Welcome Message", description: "Send a friendly greeting to every new follower.", Icon: MessagesSquare },
  { id: "keyword", name: "Keyword Reply", description: "Auto-respond when a DM contains words like 'price' or 'order'.", Icon: Bot },
  { id: "faq", name: "FAQ Bot", description: "Answer common questions instantly using your saved replies.", Icon: HelpCircle },
];

export default function DMAutomation() {
  const { toast } = useToast();
  const [enabled, setEnabled] = useState<Record<string, boolean>>({ welcome: true, keyword: true, faq: false });

  const toggle = (id: string, on: boolean) => {
    setEnabled((s) => ({ ...s, [id]: on }));
    toast({ title: `${on ? "Enabled" : "Disabled"} ${id}`, description: `The ${id} flow is now ${on ? "active" : "paused"}.` });
  };

  return (
    <div className="min-h-screen bg-[var(--sf-black)] text-white">
      <SfsContainer className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-[var(--sf-gold)] hover:text-[var(--sf-gold-2)] transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-[var(--sf-gold)] to-[var(--sf-gold-2)] rounded-xl flex items-center justify-center shadow-[var(--sf-glow-gold-sm)]">
            <MessageSquare className="w-6 h-6 text-[var(--sf-black)]" />
          </div>
          <div>
            <GoldHeading level={1} className="text-2xl font-bold">DM Automation</GoldHeading>
            <p className="text-neutral-400 text-sm">Automate direct messages for lead generation and customer support</p>
          </div>
        </div>
        <div className="space-y-4">
          {FLOWS.map((f, i) => {
            const stagger = (Math.min(i + 1, 6) as FadeStagger);
            const Icon = f.Icon;
            const isOn = enabled[f.id];
            return (
              <FadeInUp key={f.id} stagger={stagger}>
                <GlassCard className="p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-[var(--sf-gold)]/15 border border-[var(--sf-gold)]/30 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-[var(--sf-gold)]" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-semibold text-white">{f.name}</h3>
                        <p className="text-sm text-neutral-400">{f.description}</p>
                      </div>
                    </div>
                    {isOn ? (
                      <GhostButton onClick={() => toggle(f.id, false)}>Disable</GhostButton>
                    ) : (
                      <GoldButton onClick={() => toggle(f.id, true)}>Enable</GoldButton>
                    )}
                  </div>
                </GlassCard>
              </FadeInUp>
            );
          })}
        </div>
      </SfsContainer>
    </div>
  );
}
