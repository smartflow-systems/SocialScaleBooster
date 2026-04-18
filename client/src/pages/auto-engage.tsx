import { useState } from "react";
import { Link } from "wouter";
import { Zap, ArrowLeft, Heart, MessageSquare, UserPlus } from "lucide-react";
import { GlassCard, GoldButton, GhostButton, GoldHeading, SfsContainer, FadeInUp, type FadeStagger } from "@/components/sfs";
import { useToast } from "@/hooks/use-toast";

const RULES = [
  { id: "like", name: "Auto-Like", description: "React to posts with relevant hashtags in your niche.", Icon: Heart },
  { id: "comment", name: "Auto-Comment", description: "Drop friendly, brand-voiced comments on target posts.", Icon: MessageSquare },
  { id: "follow", name: "Auto-Follow", description: "Follow accounts that match your audience profile.", Icon: UserPlus },
];

export default function AutoEngage() {
  const { toast } = useToast();
  const [enabled, setEnabled] = useState<Record<string, boolean>>({ like: true, comment: false, follow: false });

  const toggle = (id: string, on: boolean) => {
    setEnabled((s) => ({ ...s, [id]: on }));
    toast({ title: `${on ? "Enabled" : "Disabled"} ${id}`, description: `The ${id} rule is now ${on ? "active" : "paused"}.` });
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
            <Zap className="w-6 h-6 text-[var(--sf-black)]" />
          </div>
          <div>
            <GoldHeading level={1} className="text-2xl font-bold">Auto Engagement</GoldHeading>
            <p className="text-neutral-400 text-sm">Automate likes, comments, and follows to grow your audience</p>
          </div>
        </div>
        <div className="space-y-4">
          {RULES.map((r, i) => {
            const stagger = (Math.min(i + 1, 6) as FadeStagger);
            const Icon = r.Icon;
            const isOn = enabled[r.id];
            return (
              <FadeInUp key={r.id} stagger={stagger}>
                <GlassCard className="p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-[var(--sf-gold)]/15 border border-[var(--sf-gold)]/30 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-[var(--sf-gold)]" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-semibold text-white">{r.name}</h3>
                        <p className="text-sm text-neutral-400">{r.description}</p>
                      </div>
                    </div>
                    {isOn ? (
                      <GhostButton onClick={() => toggle(r.id, false)}>Disable</GhostButton>
                    ) : (
                      <GoldButton onClick={() => toggle(r.id, true)}>Enable</GoldButton>
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
