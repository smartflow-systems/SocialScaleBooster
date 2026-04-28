import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import {
  Sparkles, Calendar, BarChart3, Globe, ArrowRight,
  MessageSquare, Hash, Zap, Users, Bot, TrendingUp, Crown, Bell,
} from "lucide-react";
import { GlassCard, GoldButton, GhostButton, GoldHeading, FadeInUp, SfsContainer } from "@/components/sfs";

const quickActions = [
  { label: "Generate a Caption", desc: "AI writes your post in seconds", icon: MessageSquare, href: "/captions", tone: "gold" },
  { label: "Find Hashtags", desc: "Discover hashtags that convert", icon: Hash, href: "/hashtags", tone: "blue" },
  { label: "Create a Post", desc: "Full post with image & copy", icon: Sparkles, href: "/create", tone: "purple" },
  { label: "Schedule Content", desc: "Queue posts at the best times", icon: Calendar, href: "/scheduler", tone: "green" },
  { label: "Connect Accounts", desc: "Link Instagram, TikTok & more", icon: Globe, href: "/accounts", tone: "pink" },
  { label: "View Analytics", desc: "See your growth and results", icon: BarChart3, href: "/analytics", tone: "orange" },
];

const toneClass: Record<string, string> = {
  gold: "!bg-[var(--sf-gold)]/10 !border-[var(--sf-gold)]/20",
  blue: "!bg-blue-500/10 !border-blue-500/20",
  purple: "!bg-purple-500/10 !border-purple-500/20",
  green: "!bg-green-500/10 !border-green-500/20",
  pink: "!bg-pink-500/10 !border-pink-500/20",
  orange: "!bg-orange-500/10 !border-orange-500/20",
};

const gettingStarted = [
  { step: 1, label: "Connect a social account", desc: "Link your Instagram, TikTok, or Facebook page.", href: "/accounts", icon: Globe },
  { step: 2, label: "Generate your first post", desc: "Use AI to create a caption and hashtags in seconds.", href: "/captions", icon: Sparkles },
  { step: 3, label: "Schedule it for posting", desc: "Set a time and let SmartFlow publish it for you.", href: "/scheduler", icon: Calendar },
  { step: 4, label: "Track your results", desc: "See impressions, clicks, and follower growth.", href: "/analytics", icon: BarChart3 },
];

const features = [
  { label: "AI Studio", desc: "Generate content in bulk", href: "/ai-studio", icon: Bot },
  { label: "Auto Engagement", desc: "Like, comment & follow automatically", href: "/auto-engage", icon: Zap },
  { label: "Competitor Tracker", desc: "See what others are posting", href: "/competitors", icon: TrendingUp },
  { label: "Client Manager", desc: "Handle multiple accounts", href: "/clients", icon: Users },
];

const stats = [
  { label: "Posts This Month", value: "—", note: "Connect an account to track" },
  { label: "Total Reach", value: "—", note: "Data populates after first post" },
  { label: "Followers Gained", value: "—", note: "Tracked after 7 days" },
  { label: "Engagement Rate", value: "—", note: "Avg. across platforms" },
];

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-[var(--sf-black)] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Top bar */}
      <div className="border-b border-white/5 bg-[var(--sf-black)]/80 backdrop-blur px-6 py-3.5 flex items-center justify-between sticky top-0 z-20">
        <div>
          <p className="text-sm text-neutral-400">
            {greeting()}, <span className="text-white font-semibold">{user?.businessName || user?.username || "there"}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-neutral-400 hover:text-white transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          <GhostButton
            onClick={() => setLocation("/subscribe")}
            className="!bg-[var(--sf-gold)]/10 !text-[var(--sf-gold)] !border-[var(--sf-gold)]/30 hover:!bg-[var(--sf-gold)] hover:!text-[var(--sf-black)] text-xs font-bold !px-4 !py-2"
          >
            <Crown className="w-3.5 h-3.5 mr-1.5" /> Upgrade
          </GhostButton>
        </div>
      </div>

      <SfsContainer className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">

        {/* Welcome heading */}
        <div>
          <GoldHeading level={1} className="text-3xl md:text-4xl font-extrabold mb-1">
            <span className="text-plain-white">{greeting()},</span> {user?.businessName || user?.username || "there"}
          </GoldHeading>
          <p className="text-neutral-400 text-sm">Here's a snapshot of what you can do today.</p>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickActions.map(({ label, desc, icon: Icon, href, tone }) => (
              <GlassCard
                key={href}
                onClick={() => setLocation(href)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setLocation(href); }}
                className={`group cursor-pointer p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-[var(--sf-glow-gold-sm)] ${toneClass[tone]}`}
              >
                <Icon className="w-5 h-5 text-white mb-2.5" />
                <p className="text-xs font-semibold text-white leading-tight">{label}</p>
                <p className="text-[10px] text-neutral-500 mt-0.5 leading-tight">{desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Getting Started checklist */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500">Getting Started</h2>
            <span className="text-xs text-neutral-600">4 steps to your first post</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {gettingStarted.map(({ step, label, desc, href, icon: Icon }) => (
              <GlassCard
                key={step}
                onClick={() => setLocation(href)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setLocation(href); }}
                className="group flex items-center gap-4 cursor-pointer p-5 hover:!border-[var(--sf-gold)]/25 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-[var(--sf-gold)]/10 border border-[var(--sf-gold)]/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-[var(--sf-gold)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-bold text-[var(--sf-gold)]/60 uppercase tracking-widest">Step {step}</span>
                  </div>
                  <p className="text-sm font-semibold text-white">{label}</p>
                  <p className="text-xs text-neutral-500">{desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-[var(--sf-gold)] transition-colors flex-shrink-0" />
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">Your Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stats.map((s, i) => (
              <FadeInUp
                key={s.label}
                stagger={(Math.min(i + 1, 4) as 1 | 2 | 3 | 4)}
              >
                <GlassCard className="p-5 h-full">
                  <p className="text-xs text-neutral-500 mb-1">{s.label}</p>
                  <p className="text-2xl font-extrabold text-neutral-500">{s.value}</p>
                  <p className="text-[10px] text-neutral-600 mt-1">{s.note}</p>
                </GlassCard>
              </FadeInUp>
            ))}
          </div>
        </div>

        {/* Explore features */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">Explore Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {features.map(({ label, desc, href, icon: Icon }) => (
              <GlassCard
                key={href}
                onClick={() => setLocation(href)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setLocation(href); }}
                className="group cursor-pointer p-5 hover:!border-[var(--sf-gold)]/25 transition-all hover:-translate-y-0.5"
              >
                <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4 text-neutral-400 group-hover:text-[var(--sf-gold)] transition-colors" />
                </div>
                <p className="text-sm font-semibold text-white mb-0.5">{label}</p>
                <p className="text-xs text-neutral-500">{desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Upgrade banner */}
        <GlassCard className="!border-[var(--sf-gold)]/20 bg-gradient-to-r from-[var(--sf-gold)]/10 to-[var(--sf-black)] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-[var(--sf-gold)] text-xs font-bold uppercase tracking-widest mb-1">You're on the Free Plan</p>
            <h3 className="text-lg font-extrabold text-white mb-1">Unlock unlimited posts, automation &amp; AI generation</h3>
            <p className="text-sm text-neutral-400">Upgrade to Pro — from £29/mo. Cancel any time.</p>
          </div>
          <GoldButton
            onClick={() => setLocation("/subscribe")}
            className="px-6 flex-shrink-0"
          >
            See Plans <ArrowRight className="ml-2 w-4 h-4" />
          </GoldButton>
        </GlassCard>

      </SfsContainer>
    </div>
  );
}
