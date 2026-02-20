import { Link, useLocation } from "wouter";
import {
  X,
  Home,
  Bot,
  Calendar,
  BarChart3,
  FileText,
  Hash,
  Users,
  Zap,
  TrendingUp,
  Settings,
  CreditCard,
  HelpCircle,
  MessageSquare,
  Mail,
  BookOpen,
  Target,
  Activity,
  Share2,
  Globe,
  type LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const menuSections: MenuSection[] = [
  {
    title: "MAIN",
    items: [
      { id: "home", label: "Home", href: "/", icon: Home },
      { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: BarChart3 },
      { id: "ai-studio", label: "AI Studio", href: "/ai-studio", icon: Bot },
      { id: "calendar", label: "Content Calendar", href: "/calendar", icon: Calendar },
      { id: "analytics", label: "Analytics", href: "/analytics", icon: Activity },
    ]
  },
  {
    title: "CONTENT & CREATION",
    items: [
      { id: "create", label: "Create Post", href: "/create", icon: FileText },
      { id: "templates", label: "Templates", href: "/templates", icon: FileText },
      { id: "hashtags", label: "Hashtag Research", href: "/hashtags", icon: Hash },
      { id: "captions", label: "Caption Generator", href: "/captions", icon: MessageSquare },
    ]
  },
  {
    title: "SOCIAL AUTOMATION",
    items: [
      { id: "scheduler", label: "Post Scheduler", href: "/scheduler", icon: Calendar },
      { id: "auto-engage", label: "Auto Engagement", href: "/auto-engage", icon: Zap },
      { id: "dm-automation", label: "DM Automation", href: "/dm-automation", icon: MessageSquare },
      { id: "social-accounts", label: "Connected Accounts", href: "/accounts", icon: Globe },
    ]
  },
  {
    title: "GROWTH & INSIGHTS",
    items: [
      { id: "competitors", label: "Competitor Tracker", href: "/competitors", icon: Target },
      { id: "trends", label: "Trending Topics", href: "/trends", icon: TrendingUp },
      { id: "audience", label: "Audience Builder", href: "/audience", icon: Users },
      { id: "performance", label: "Performance Score", href: "/performance", icon: BarChart3 },
    ]
  },
  {
    title: "MARKETPLACE",
    items: [
      { id: "marketplace", label: "Browse Marketplace", href: "/marketplace", icon: Share2 },
      { id: "subscribe", label: "Subscription Plans", href: "/subscribe", icon: CreditCard },
      { id: "checkout", label: "Checkout", href: "/checkout", icon: CreditCard },
    ]
  },
  {
    title: "SETTINGS & SUPPORT",
    items: [
      { id: "settings", label: "Settings", href: "/settings", icon: Settings },
      { id: "help", label: "Help Center", href: "/help", icon: HelpCircle },
      { id: "tutorials", label: "Tutorials", href: "/tutorials", icon: BookOpen },
      { id: "support", label: "Contact Support", href: "/support", icon: Mail },
    ]
  }
];

interface HamburgerMenuSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HamburgerMenuSidebar({ isOpen, onClose }: HamburgerMenuSidebarProps) {
  const [location] = useLocation();

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href === "/dashboard" && location === "/dashboard") return true;
    return location.startsWith(href) && href !== "/";
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={onClose}
          className="fixed top-4 left-4 z-50 p-2 text-accent-gold hover:text-gold-trim transition-colors focus:outline-none focus:ring-2 focus:ring-accent-gold rounded-md bg-black/40 backdrop-blur-sm border border-accent-gold/30"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      )}
      <div
        className={cn(
          "h-screen w-72 flex-shrink-0 transition-transform duration-300 ease-in-out",
          "bg-primary-black border-r border-accent-gold/30",
          "shadow-2xl shadow-accent-gold/10",
          "sticky top-0",
          !isOpen && "-translate-x-full"
        )}
      >
      <div className="flex items-center justify-between p-4 border-b border-accent-gold/20 bg-gradient-to-r from-rich-brown to-primary-black">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-accent-gold to-gold-trim rounded-lg flex items-center justify-center shadow-lg shadow-accent-gold/30">
            <Bot className="w-6 h-6 text-primary-black" />
          </div>
          <div>
            <h1 className="text-accent-gold font-bold text-sm">SmartFlow AI</h1>
            <p className="text-xs text-neutral-gray">Social Automation</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-accent-gold/70 hover:text-accent-gold transition-colors rounded-md"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <ScrollArea className="h-[calc(100vh-140px)]">
        <div className="py-4">
          {menuSections.map((section, sectionIndex) => (
            <div key={section.title} className={sectionIndex > 0 ? "mt-6" : ""}>
              <div className="px-4 mb-2">
                <h3 className="text-accent-gold/60 text-xs font-bold uppercase tracking-wider">
                  {section.title}
                </h3>
              </div>
              <div className="space-y-1 px-2">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={onClose}
                    >
                      <div
                        className={cn(
                          "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all group relative overflow-hidden cursor-pointer",
                          active
                            ? "bg-accent-gold/20 text-accent-gold border-l-2 border-accent-gold"
                            : "text-neutral-gray hover:bg-accent-gold/10 hover:text-accent-gold"
                        )}
                      >
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-accent-gold/10 to-transparent" />
                        <Icon className={cn("h-5 w-5 flex-shrink-0", active ? "text-accent-gold" : "")} />
                        <span className="font-medium text-sm relative z-10">{item.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-accent-gold/20 bg-gradient-to-r from-rich-brown to-primary-black">
        <div className="text-xs text-neutral-gray text-center">
          <p className="font-semibold text-accent-gold">SmartFlow Systems</p>
          <p>© 2025 Social Automation</p>
        </div>
      </div>
    </div>
  );
}
import { Menu } from "lucide-react";
