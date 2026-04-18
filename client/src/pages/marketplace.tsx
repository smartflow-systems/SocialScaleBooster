import { Link } from "wouter";
import { Share2, ArrowLeft, Bot, Heart, MessageSquare, Megaphone, ShoppingBag, Sparkles, Star } from "lucide-react";
import { GlassCard, GoldButton, GoldHeading, SfsContainer, FadeInUp, type FadeStagger } from "@/components/sfs";
import { useToast } from "@/hooks/use-toast";

const TEMPLATES = [
  { id: "engage", name: "Engagement Booster", description: "Auto-react to followers and grow reach with safe, throttled likes.", category: "Engagement", price: "Free", rating: 4.8, Icon: Heart },
  { id: "dm", name: "Smart DM Replies", description: "Reply to DMs with AI-generated answers tailored to your brand voice.", category: "Messaging", price: "£9 / mo", rating: 4.9, Icon: MessageSquare },
  { id: "promo", name: "Drop Announcer", description: "Announce product drops across all platforms on a single click.", category: "Marketing", price: "£12 / mo", rating: 4.6, Icon: Megaphone },
  { id: "sales", name: "Sales Funnel Bot", description: "Capture leads from comments and route them to your store.", category: "Sales", price: "£19 / mo", rating: 4.7, Icon: ShoppingBag },
  { id: "content", name: "Content Idea Generator", description: "Daily fresh post ideas based on what's trending in your niche.", category: "Content", price: "Free", rating: 4.5, Icon: Sparkles },
  { id: "growth", name: "Follow-Back Pro", description: "Smart follow / unfollow strategy that grows your audience safely.", category: "Growth", price: "£7 / mo", rating: 4.4, Icon: Bot },
];

export default function Marketplace() {
  const { toast } = useToast();
  const handleInstall = (name: string) =>
    toast({ title: "Bot installed", description: `${name} has been added to your bots.` });

  return (
    <div className="min-h-screen bg-[var(--sf-black)] text-white">
      <SfsContainer className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-[var(--sf-gold)] hover:text-[var(--sf-gold-2)] transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-[var(--sf-gold)] to-[var(--sf-gold-2)] rounded-xl flex items-center justify-center shadow-[var(--sf-glow-gold-sm)]">
            <Share2 className="w-6 h-6 text-[var(--sf-black)]" />
          </div>
          <div>
            <GoldHeading level={1} className="text-2xl font-bold">Marketplace</GoldHeading>
            <p className="text-neutral-400 text-sm">Browse premium bot templates and automation tools</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEMPLATES.map((t, i) => {
            const stagger = (Math.min(i + 1, 6) as FadeStagger);
            const Icon = t.Icon;
            return (
              <FadeInUp key={t.id} stagger={stagger}>
                <GlassCard className="p-5 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--sf-gold)]/15 border border-[var(--sf-gold)]/30 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[var(--sf-gold)]" />
                    </div>
                    <span className="text-xs font-medium text-neutral-400">{t.category}</span>
                  </div>
                  <h3 className="text-base font-semibold text-white mb-1">{t.name}</h3>
                  <p className="text-sm text-neutral-400 flex-1 mb-4">{t.description}</p>
                  <div className="flex items-center justify-between mb-4 text-xs">
                    <span className="text-[var(--sf-gold)] font-semibold">{t.price}</span>
                    <span className="inline-flex items-center gap-1 text-neutral-400">
                      <Star className="w-3.5 h-3.5 fill-[var(--sf-gold)] text-[var(--sf-gold)]" />
                      {t.rating}
                    </span>
                  </div>
                  <GoldButton onClick={() => handleInstall(t.name)} className="w-full inline-flex items-center justify-center">
                    Install
                  </GoldButton>
                </GlassCard>
              </FadeInUp>
            );
          })}
        </div>
      </SfsContainer>
    </div>
  );
}
