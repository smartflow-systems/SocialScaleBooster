import { Link } from "wouter";
import { BookOpen, ArrowLeft, Play, Clock } from "lucide-react";
import { GlassCard, GoldHeading, SfsContainer, FadeInUp, GhostButton, type FadeStagger } from "@/components/sfs";

const TUTORIALS = [
  { title: "Connect your first account", level: "Beginner", duration: "3 min", description: "Link Instagram and Facebook in under three minutes." },
  { title: "Schedule a week of posts", level: "Beginner", duration: "5 min", description: "Plan, queue, and auto-publish a week of content." },
  { title: "Generate AI captions", level: "Beginner", duration: "4 min", description: "Use AI Studio to draft captions in your brand tone." },
  { title: "Set up auto-engagement rules", level: "Intermediate", duration: "6 min", description: "Auto-like and auto-comment without getting flagged." },
  { title: "Run a multi-platform drop", level: "Advanced", duration: "8 min", description: "Coordinate a synced product launch across channels." },
  { title: "Read your analytics dashboard", level: "Intermediate", duration: "5 min", description: "Spot trends, top posts, and conversion drivers." },
];

export default function Tutorials() {
  return (
    <div className="min-h-screen bg-[var(--sf-black)] text-white">
      <SfsContainer className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-[var(--sf-gold)] hover:text-[var(--sf-gold-2)] transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-[var(--sf-gold)] to-[var(--sf-gold-2)] rounded-xl flex items-center justify-center shadow-[var(--sf-glow-gold-sm)]">
            <BookOpen className="w-6 h-6 text-[var(--sf-black)]" />
          </div>
          <div>
            <GoldHeading level={1} className="text-2xl font-bold">Tutorials</GoldHeading>
            <p className="text-neutral-400 text-sm">Learn how to get the most out of SmartFlow AI</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TUTORIALS.map((t, i) => {
            const stagger = (Math.min(i + 1, 6) as FadeStagger);
            return (
              <FadeInUp key={t.title} stagger={stagger}>
                <GlassCard className="p-5 h-full flex flex-col">
                  <div className="aspect-video rounded-lg bg-gradient-to-br from-[var(--sf-gold)]/15 to-[var(--sf-gold-2)]/5 border border-[var(--sf-gold)]/20 flex items-center justify-center mb-4">
                    <Play className="w-10 h-10 text-[var(--sf-gold)]" />
                  </div>
                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                    <span>{t.level}</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {t.duration}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-white mb-1">{t.title}</h3>
                  <p className="text-sm text-neutral-400 flex-1 mb-4">{t.description}</p>
                  <GhostButton className="w-full inline-flex items-center justify-center">Watch</GhostButton>
                </GlassCard>
              </FadeInUp>
            );
          })}
        </div>
      </SfsContainer>
    </div>
  );
}
