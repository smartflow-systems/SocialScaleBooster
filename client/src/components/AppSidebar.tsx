import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Bot, Calendar, BarChart3, FileText, Hash,
  Users, Zap, TrendingUp, Settings, CreditCard, HelpCircle,
  MessageSquare, BookOpen, Target, Activity, Share2, Globe,
  Sparkles, LogOut, ChevronLeft, ChevronRight, User, BookmarkPlus,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function AppSidebar() {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [badgePulse, setBadgePulse] = useState(false);
  const prevCountRef = useRef<number | null>(null);
  const { toast } = useToast();

  const { data: countData } = useQuery<{ count: number; breakdown: Record<string, number> }>({
    queryKey: ["/api/scheduled-posts/count"],
    refetchInterval: 60_000,
  });
  const scheduledCount = countData?.count ?? 0;
  const platformBreakdown = countData?.breakdown ?? {};
  const dataLoaded = countData !== undefined;

  useEffect(() => {
    if (!dataLoaded) return;

    if (prevCountRef.current === null) {
      prevCountRef.current = scheduledCount;
      return;
    }

    const prev = prevCountRef.current;
    prevCountRef.current = scheduledCount;

    if (scheduledCount === prev) return;

    setBadgePulse(true);
    const timer = setTimeout(() => setBadgePulse(false), 1200);

    if (scheduledCount < prev) {
      const diff = prev - scheduledCount;
      toast({
        title: "Post Published",
        description: `${diff} scheduled post${diff > 1 ? "s were" : " was"} published. ${scheduledCount} remaining in queue.`,
      });
    } else {
      const diff = scheduledCount - prev;
      toast({
        title: "New Scheduled Post",
        description: `${diff} new post${diff > 1 ? "s" : ""} added to your schedule. ${scheduledCount} total queued.`,
      });
    }

    return () => clearTimeout(timer);
  }, [scheduledCount, dataLoaded]);

  const isActive = (href: string) =>
    href === "/dashboard" ? location === "/dashboard" : location.startsWith(href);

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  const sections = [
    {
      title: "Main",
      items: [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { label: "AI Studio", href: "/ai-studio", icon: Sparkles },
        { label: "Content Calendar", href: "/calendar", icon: Calendar },
        { label: "Analytics", href: "/analytics", icon: Activity },
      ],
    },
    {
      title: "Create",
      items: [
        { label: "Create Post", href: "/create", icon: FileText },
        { label: "Drafts", href: "/drafts", icon: BookmarkPlus },
        { label: "Caption Generator", href: "/captions", icon: MessageSquare },
        { label: "Hashtag Research", href: "/hashtags", icon: Hash },
        { label: "Templates", href: "/templates", icon: BookOpen },
      ],
    },
    {
      title: "Automate",
      items: [
        { label: "Post Scheduler", href: "/scheduler", icon: Zap, badge: scheduledCount > 0 ? scheduledCount : undefined, pulse: badgePulse, badgeBreakdown: scheduledCount > 0 ? platformBreakdown : undefined },
        { label: "Auto Engagement", href: "/auto-engage", icon: Bot },
        { label: "DM Automation", href: "/dm-automation", icon: MessageSquare },
        { label: "Connected Accounts", href: "/accounts", icon: Globe },
      ],
    },
    {
      title: "Grow",
      items: [
        { label: "Competitor Tracker", href: "/competitors", icon: Target },
        { label: "Trending Topics", href: "/trends", icon: TrendingUp },
        { label: "Audience Builder", href: "/audience", icon: Users },
        { label: "Performance Score", href: "/performance", icon: BarChart3 },
      ],
    },
    {
      title: "Account",
      items: [
        { label: "Clients", href: "/clients", icon: Users },
        { label: "Marketplace", href: "/marketplace", icon: Share2 },
        { label: "Subscription", href: "/subscribe", icon: CreditCard },
        { label: "Settings", href: "/settings", icon: Settings },
      ],
    },
    {
      title: "Support",
      items: [
        { label: "Help Center", href: "/help", icon: HelpCircle },
        { label: "Tutorials", href: "/tutorials", icon: BookOpen },
        { label: "Contact Support", href: "/support", icon: MessageSquare },
      ],
    },
  ];

  return (
    <div
      className={cn(
        "relative flex-shrink-0 flex flex-col bg-[#0D0D0D] border-r border-[#FFD700]/10 transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}
      style={{ minHeight: "100vh" }}
    >
      {/* Header */}
      <div className={cn("flex items-center gap-3 p-4 border-b border-[#FFD700]/10", collapsed && "justify-center")}>
        <div className="w-8 h-8 rounded-lg bg-[#FFD700]/15 border border-[#FFD700]/30 flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-[#FFD700]" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-bold text-[#FFD700] truncate">SmartFlow AI</p>
            <p className="text-xs text-neutral-500 truncate">{user?.businessName || "Your Workspace"}</p>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-14 w-6 h-6 rounded-full bg-[#111] border border-[#FFD700]/20 flex items-center justify-center text-neutral-400 hover:text-[#FFD700] transition-colors z-10"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-3 space-y-4">
        {sections.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <p className="px-4 mb-1 text-[10px] font-bold uppercase tracking-widest text-neutral-600">
                {section.title}
              </p>
            )}
            <div className="space-y-0.5 px-2">
              {section.items.map(({ label, href, icon: Icon, badge, pulse, badgeBreakdown }: any) => {
                const active = isActive(href);
                const breakdownEntries = badgeBreakdown ? Object.entries(badgeBreakdown) as [string, number][] : [];
                const tooltipText = breakdownEntries.length > 0
                  ? breakdownEntries.map(([p, c]) => `${p.charAt(0).toUpperCase() + p.slice(1)}: ${c}`).join(", ")
                  : null;
                return (
                  <Link key={href} href={href}>
                    <div
                      title={collapsed ? label : undefined}
                      className={cn(
                        "flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer",
                        collapsed && "justify-center",
                        active
                          ? "bg-[#FFD700]/15 text-[#FFD700] border-l-2 border-[#FFD700]"
                          : "text-neutral-400 hover:text-white hover:bg-white/5"
                      )}
                    >
                      <div className="relative flex-shrink-0">
                        <Icon className="w-4 h-4" />
                        {badge !== undefined && collapsed && (
                          <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-[#FFD700] text-[#0D0D0D] text-[8px] font-bold flex items-center justify-center">
                            {badge > 9 ? "9+" : badge}
                            {pulse && (
                              <span className="absolute inset-0 rounded-full bg-[#FFD700] animate-ping opacity-75" />
                            )}
                          </span>
                        )}
                      </div>
                      {!collapsed && (
                        <>
                          <span className="truncate flex-1">{label}</span>
                          {badge !== undefined && (
                            <div className="relative group/badge ml-auto">
                              <span className={cn(
                                "relative min-w-[20px] h-5 rounded-full bg-[#FFD700]/20 text-[#FFD700] text-[10px] font-bold flex items-center justify-center px-1.5 cursor-default",
                              )}>
                                {badge > 99 ? "99+" : badge}
                                {pulse && (
                                  <span className="absolute inset-0 rounded-full bg-[#FFD700]/50 animate-ping" />
                                )}
                              </span>
                              {tooltipText && (
                                <div className="absolute right-0 bottom-full mb-1.5 z-50 pointer-events-none opacity-0 group-hover/badge:opacity-100 transition-opacity duration-150">
                                  <div className="bg-[#1a1a1a] border border-[#FFD700]/20 rounded-md px-2.5 py-1.5 text-[10px] text-neutral-300 whitespace-nowrap shadow-lg">
                                    {tooltipText}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer — user + logout */}
      <div className={cn("border-t border-[#FFD700]/10 p-3", collapsed ? "flex justify-center" : "")}>
        {collapsed ? (
          <button
            onClick={handleLogout}
            className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-neutral-400 hover:text-red-400 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FFD700]/15 border border-[#FFD700]/20 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-[#FFD700]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.username || "Account"}</p>
              <p className="text-[10px] text-neutral-500 truncate">{user?.email || "Free plan"}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-neutral-500 hover:text-red-400 transition-colors flex-shrink-0"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
