import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import {
  Sparkles, Calendar, BarChart3, Globe, ArrowRight, CheckCircle2,
  MessageSquare, Hash, Zap, Users, Bot, TrendingUp, Crown, Bell,
} from "lucide-react";

const quickActions = [
  { label: "Generate a Caption", desc: "AI writes your post in seconds", icon: MessageSquare, href: "/captions", color: "bg-[#FFD700]/10 border-[#FFD700]/20" },
  { label: "Find Hashtags", desc: "Discover hashtags that convert", icon: Hash, href: "/hashtags", color: "bg-blue-500/10 border-blue-500/20" },
  { label: "Create a Post", desc: "Full post with image & copy", icon: Sparkles, href: "/create", color: "bg-purple-500/10 border-purple-500/20" },
  { label: "Schedule Content", desc: "Queue posts at the best times", icon: Calendar, href: "/scheduler", color: "bg-green-500/10 border-green-500/20" },
  { label: "Connect Accounts", desc: "Link Instagram, TikTok & more", icon: Globe, href: "/accounts", color: "bg-pink-500/10 border-pink-500/20" },
  { label: "View Analytics", desc: "See your growth and results", icon: BarChart3, href: "/analytics", color: "bg-orange-500/10 border-orange-500/20" },
];

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
    <div className="min-h-screen bg-[#0D0D0D] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Top bar */}
      <div className="border-b border-white/5 bg-[#0D0D0D]/80 backdrop-blur px-6 py-3.5 flex items-center justify-between sticky top-0 z-20">
        <div>
          <p className="text-sm text-neutral-400">{greeting()}, <span className="text-white font-semibold">{user?.businessName || user?.username || "there"}</span></p>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-neutral-400 hover:text-white transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          <Button
            onClick={() => setLocation("/subscribe")}
            className="bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/30 hover:bg-[#FFD700] hover:text-[#0D0D0D] text-xs font-bold px-4 py-2 h-auto"
          >
            <Crown className="w-3.5 h-3.5 mr-1.5" /> Upgrade
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">

        {/* Quick Actions */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickActions.map(({ label, desc, icon: Icon, href, color }) => (
              <button
                key={href}
                onClick={() => setLocation(href)}
                className={`group rounded-xl border p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(255,215,0,0.08)] ${color}`}
              >
                <Icon className="w-5 h-5 text-white mb-2.5" />
                <p className="text-xs font-semibold text-white leading-tight">{label}</p>
                <p className="text-[10px] text-neutral-500 mt-0.5 leading-tight">{desc}</p>
              </button>
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
              <button
                key={step}
                onClick={() => setLocation(href)}
                className="group flex items-center gap-4 bg-[#111] border border-white/5 rounded-xl p-5 text-left hover:border-[#FFD700]/25 hover:bg-[#161610] transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-[#FFD700]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-bold text-[#FFD700]/60 uppercase tracking-widest">Step {step}</span>
                  </div>
                  <p className="text-sm font-semibold text-white">{label}</p>
                  <p className="text-xs text-neutral-500">{desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-[#FFD700] transition-colors flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Stats row — placeholder / coming soon */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">Your Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Posts This Month", value: "—", note: "Connect an account to track" },
              { label: "Total Reach", value: "—", note: "Data populates after first post" },
              { label: "Followers Gained", value: "—", note: "Tracked after 7 days" },
              { label: "Engagement Rate", value: "—", note: "Avg. across platforms" },
            ].map((s) => (
              <div key={s.label} className="bg-[#111] border border-white/5 rounded-xl p-5">
                <p className="text-xs text-neutral-500 mb-1">{s.label}</p>
                <p className="text-2xl font-extrabold text-neutral-600">{s.value}</p>
                <p className="text-[10px] text-neutral-700 mt-1">{s.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Explore features */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">Explore Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {features.map(({ label, desc, href, icon: Icon }) => (
              <button
                key={href}
                onClick={() => setLocation(href)}
                className="group bg-[#111] border border-white/5 rounded-xl p-5 text-left hover:border-[#FFD700]/25 transition-all hover:-translate-y-0.5"
              >
                <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4 text-neutral-400 group-hover:text-[#FFD700] transition-colors" />
                </div>
                <p className="text-sm font-semibold text-white mb-0.5">{label}</p>
                <p className="text-xs text-neutral-500">{desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Upgrade banner */}
        <div className="rounded-2xl border border-[#FFD700]/20 bg-gradient-to-r from-[#FFD700]/8 to-[#0D0D0D] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-[#FFD700] text-xs font-bold uppercase tracking-widest mb-1">You're on the Free Plan</p>
            <h3 className="text-lg font-extrabold text-white mb-1">Unlock unlimited posts, automation & AI generation</h3>
            <p className="text-sm text-neutral-400">Upgrade to Pro — from £29/mo. Cancel any time.</p>
          </div>
          <Button
            onClick={() => setLocation("/subscribe")}
            className="bg-[#FFD700] text-[#0D0D0D] hover:bg-[#E6C200] font-bold px-6 flex-shrink-0"
          >
            See Plans <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

      </div>
    </div>
  );
}
