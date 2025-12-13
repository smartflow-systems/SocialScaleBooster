import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown, Bot, BarChart3, Store, File, Search, Calendar, Users, Zap, Settings, Sparkles, LogOut } from "lucide-react";
import BotCard from "@/components/bots/bot-card";
import CreateBotDialog from "@/components/bots/create-bot-dialog";
import BotStatsDialog from "@/components/bots/bot-stats-dialog";
import TemplateCard from "@/components/marketplace/template-card";
import AnalyticsCharts from "@/components/analytics/charts";
import CategoryFilter from "@/components/marketplace/category-filter";
import EngagementMetrics from "@/components/analytics/engagement-metrics";
import AdvancedMetrics from "@/components/analytics/advanced-metrics";
import RealtimeDashboard from "@/components/analytics/realtime-dashboard";
import SchedulerInterface from "@/components/scheduling/scheduler-interface";
import PersonalityDesigner from "@/components/personality/personality-designer";
import IntegrationWizard from "@/components/integrations/integration-wizard";
import EnhancedMarketplace from "@/components/marketplace/enhanced-marketplace";
import UpgradeCard from "@/components/subscription/upgrade-card";
import SubscriptionStatus from "@/components/subscription/subscription-status";
import PaymentSuccess from "@/components/subscription/payment-success";
import { analyticsService } from "@/services/analytics";
import GitHubSidebar from "@/components/Dashboard/GitHubSidebar";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import QuickActionsPanel from "@/components/quick-actions/QuickActionsPanel";
import CommandPalette from "@/components/command-palette/CommandPalette";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("bots");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successType, setSuccessType] = useState<"subscription" | "payment">("subscription");

  // Check for success parameters and tab from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const upgradeSuccess = urlParams.get('upgrade');
    const paymentSuccess = urlParams.get('payment');
    const tabParam = urlParams.get('tab');

    if (tabParam) {
      setActiveTab(tabParam);
    }

    if (upgradeSuccess === 'success') {
      setSuccessType('subscription');
      setShowSuccess(true);
      window.history.replaceState({}, '', '/dashboard');
    } else if (paymentSuccess === 'success') {
      setSuccessType('payment');
      setShowSuccess(true);
      window.history.replaceState({}, '', '/dashboard');
    }
  }, []);

  const { data: userStatus } = useQuery({
    queryKey: ["/api/user/status"],
  });

  const { data: bots } = useQuery({
    queryKey: ["/api/bots"],
  });

  const { data: templates } = useQuery({
    queryKey: ["/api/templates"],
  });

  const { data: analyticsMetrics } = useQuery({
    queryKey: ["/api/analytics/metrics"],
  });

  const { data: engagementMetrics } = useQuery({
    queryKey: ["engagement-metrics"],
    queryFn: () => analyticsService.getEngagementByPlatform(),
  });

  // Filter templates based on category and search
  const filteredTemplates = templates?.filter((template: any) => {
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    const matchesSearch = searchQuery === "" ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Show success modal if needed
  if (showSuccess) {
    return (
      <PaymentSuccess
        type={successType}
        onContinue={() => setShowSuccess(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] relative">
      {/* GitHub Sidebar */}
      <GitHubSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userStatus={userStatus}
      />

      {/* Command Palette */}
      <CommandPalette />

      {/* Quick Actions Panel */}
      <QuickActionsPanel />

      {/* Dashboard Header - PREMIUM */}
      <header className="
        bg-[rgba(59,47,47,0.6)] backdrop-blur-xl
        border-b border-[rgba(255,215,0,0.2)]
        sticky top-0 z-30
        shadow-lg
      ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.location.href = "/"}>
                <div className="p-2.5 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Bot className="text-[#0D0D0D] w-6 h-6" />
                </div>
                <div className="hidden sm:block">
                  <div className="text-xl font-bold text-[#F5F5DC]">Dashboard</div>
                  <div className="text-xs text-[#FFD700]">SmartFlow AI</div>
                </div>
              </div>

              <Badge className={`
                px-3 py-1.5 font-semibold text-sm
                ${userStatus?.isPremium
                  ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#0D0D0D] border-0 shadow-lg'
                  : 'bg-[rgba(255,215,0,0.1)] text-[#FFD700] border border-[rgba(255,215,0,0.3)]'
                }
              `}>
                {userStatus?.isPremium ? (
                  <span className="flex items-center gap-1.5">
                    <Crown className="w-4 h-4" />
                    Pro Plan
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Free ({userStatus?.botCount || 0}/3 bots)
                  </span>
                )}
              </Badge>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Notification Center */}
              <NotificationCenter />

              {/* Upgrade Button */}
              {!userStatus?.isPremium && (
                <Button
                  onClick={() => window.location.href = "/subscribe"}
                  className="
                    hidden sm:flex
                    bg-gradient-to-r from-[#FFD700] to-[#FFA500]
                    text-[#0D0D0D]
                    px-5 py-2.5
                    font-bold
                    rounded-xl
                    shadow-lg hover:shadow-[0_10px_40px_rgba(255,215,0,0.4)]
                    hover:scale-105
                    transition-all duration-300
                  "
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade Pro
                </Button>
              )}

              {/* Settings */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:flex hover:bg-[rgba(255,215,0,0.08)] text-[#FFD700] rounded-lg"
                onClick={() => alert('Settings coming soon!')}
              >
                <Settings className="w-5 h-5" />
              </Button>

              {/* User Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center text-[#0D0D0D] font-bold cursor-pointer hover:scale-110 transition-transform duration-300 shadow-lg">
                {userStatus?.username?.[0]?.toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation - STUNNING */}
      <div className="bg-[rgba(59,47,47,0.4)] backdrop-blur-lg border-b border-[rgba(255,215,0,0.15)] sticky top-20 z-20">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-transparent h-auto p-2 flex gap-1 sm:gap-2 w-full overflow-x-auto">
              {[
                { value: 'bots', icon: Bot, label: 'My Bots', shortLabel: 'Bots' },
                { value: 'analytics', icon: BarChart3, label: 'Analytics', shortLabel: 'Stats' },
                { value: 'marketplace', icon: Store, label: 'Marketplace', shortLabel: 'Store' },
                { value: 'scheduling', icon: Calendar, label: 'Scheduling', shortLabel: 'Time' },
                { value: 'personality', icon: Users, label: 'Personality', shortLabel: 'Style' },
                { value: 'integrations', icon: Zap, label: 'Integrations', shortLabel: 'Apps' },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={`
                    data-[state=active]:bg-[rgba(255,215,0,0.15)]
                    data-[state=active]:text-[#FFD700]
                    data-[state=active]:border data-[state=active]:border-[rgba(255,215,0,0.3)]
                    text-[#F5F5DC]/70
                    hover:text-[#FFD700]
                    hover:bg-[rgba(255,215,0,0.05)]
                    py-3 px-3 sm:px-5
                    font-semibold
                    rounded-xl
                    transition-all duration-300
                    text-xs sm:text-sm
                    flex items-center gap-2
                    whitespace-nowrap
                  `}
                >
                  <tab.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.shortLabel}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Tab Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <TabsContent value="bots" className="mt-0">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-4xl font-bold text-[#F5F5DC] mb-2">My Bots</h2>
                    <p className="text-[#F5F5DC]/60">Manage your AI-powered social media automation</p>
                  </div>
                  <CreateBotDialog
                    isPremium={userStatus?.isPremium || false}
                    botCount={userStatus?.botCount || 0}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bots?.map((bot: any) => (
                    <BotCard key={bot.id} bot={bot} />
                  ))}

                  {/* Upgrade prompt card - STUNNING */}
                  {!userStatus?.isPremium && (
                    <div className="
                      relative
                      bg-gradient-to-br from-[#FFD700] to-[#FFA500]
                      rounded-3xl p-8 text-[#0D0D0D]
                      shadow-2xl
                      hover:scale-105
                      transition-all duration-300
                      overflow-hidden
                      group
                    ">
                      {/* Animated background */}
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#0D0D0D] rounded-full filter blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#0D0D0D] rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                      </div>

                      <div className="relative text-center">
                        <div className="w-20 h-20 bg-[#0D0D0D] rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                          <Crown className="w-12 h-12 text-[#FFD700]" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">Create More Bots</h3>
                        <p className="mb-6 text-sm font-medium opacity-90">
                          Upgrade to Pro for unlimited bot creation and advanced features
                        </p>
                        <Button
                          onClick={() => window.location.href = "/subscribe"}
                          className="w-full bg-[#0D0D0D] text-[#FFD700] hover:bg-[#0D0D0D]/90 font-bold py-6 rounded-xl shadow-xl"
                        >
                          Unlock Pro Features
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Subscription Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                  <UpgradeCard />
                  <SubscriptionStatus />
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="mt-0">
                <div className="mb-8">
                  <h2 className="text-4xl font-bold text-[#F5F5DC] mb-2">Real-Time Analytics & ROI</h2>
                  <p className="text-[#F5F5DC]/60">Track performance, engagement, and revenue across all platforms</p>
                </div>
                <div className="space-y-8">
                  <RealtimeDashboard />
                  <AdvancedMetrics metrics={analyticsMetrics} />
                </div>
              </TabsContent>

              <TabsContent value="marketplace" className="mt-0">
                <div className="mb-8">
                  <h2 className="text-4xl font-bold text-[#F5F5DC] mb-2">
                    Premium Bot <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">Marketplace</span>
                  </h2>
                  <p className="text-[#F5F5DC]/60">125,000+ pre-built templates for every niche and platform</p>
                </div>
                <EnhancedMarketplace userStatus={userStatus} />
              </TabsContent>

              <TabsContent value="templates" className="mt-0">
                <div className="mb-8">
                  <h2 className="text-4xl font-bold text-[#F5F5DC] mb-2">E-Commerce Bot Presets</h2>
                  <p className="text-[#F5F5DC]/60">Ready-to-use templates optimized for e-commerce success</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { icon: Store, title: 'Product Showcase Bot', desc: 'Highlight product features with engaging visuals and automatic hashtag optimization', color: 'from-purple-500 to-purple-600' },
                    { icon: Crown, title: 'Flash Sale Announcer', desc: 'Create urgency with flash sales, countdown timers, and limited-time offers', color: 'from-[#FFD700] to-[#FFA500]' },
                    { icon: BarChart3, title: 'Customer Testimonial Bot', desc: 'Share authentic customer reviews and success stories to build social proof', color: 'from-emerald-500 to-emerald-600' },
                    { icon: Bot, title: 'Behind the Scenes Bot', desc: 'Show product creation process and company culture to build authentic connections', color: 'from-cyan-500 to-blue-500' },
                    { icon: File, title: 'Trend Tracker Bot', desc: 'AI-powered trend analysis to create viral content that drives maximum engagement', color: 'from-rose-500 to-pink-500' },
                    { icon: Zap, title: 'Multi-Platform Scheduler', desc: 'Coordinate campaigns across TikTok, Instagram, Facebook, and Twitter simultaneously', color: 'from-amber-500 to-orange-500' },
                  ].map((preset, index) => (
                    <div
                      key={index}
                      className="
                        group
                        bg-[rgba(59,47,47,0.4)] backdrop-blur-xl
                        border border-[rgba(255,215,0,0.2)]
                        hover:border-[rgba(255,215,0,0.5)]
                        rounded-3xl p-6
                        hover:scale-105 hover:-translate-y-1
                        transition-all duration-300
                        shadow-lg hover:shadow-2xl
                      "
                    >
                      <div className={`
                        w-14 h-14 rounded-2xl flex items-center justify-center mb-4
                        bg-gradient-to-br ${preset.color}
                        shadow-xl
                        group-hover:scale-110 group-hover:rotate-3
                        transition-all duration-300
                      `}>
                        <preset.icon className="text-white w-7 h-7" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-[#F5F5DC] group-hover:text-[#FFD700] transition-colors duration-300">
                        {preset.title}
                      </h3>
                      <p className="text-[#F5F5DC]/70 mb-6 text-sm leading-relaxed">
                        {preset.desc}
                      </p>
                      <CreateBotDialog
                        isPremium={userStatus?.isPremium || false}
                        botCount={userStatus?.botCount || 0}
                      >
                        <Button className="
                          w-full
                          bg-[rgba(255,215,0,0.1)]
                          text-[#FFD700]
                          border border-[rgba(255,215,0,0.3)]
                          hover:bg-[rgba(255,215,0,0.2)]
                          hover:border-[rgba(255,215,0,0.5)]
                          font-semibold
                          py-6
                          rounded-xl
                          transition-all duration-300
                        ">
                          Create Bot
                        </Button>
                      </CreateBotDialog>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="scheduling" className="mt-0">
                <div className="mb-8">
                  <h2 className="text-4xl font-bold text-[#F5F5DC] mb-2">
                    Smart <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">Scheduling</span> & Automation
                  </h2>
                  <p className="text-[#F5F5DC]/60">Schedule posts at optimal times for maximum engagement</p>
                </div>
                <SchedulerInterface />
              </TabsContent>

              <TabsContent value="personality" className="mt-0">
                <div className="mb-8">
                  <h2 className="text-4xl font-bold text-[#F5F5DC] mb-2">
                    Bot <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">Personality</span> Designer
                  </h2>
                  <p className="text-[#F5F5DC]/60">Customize your bot's voice, tone, and behavior</p>
                </div>
                <PersonalityDesigner />
              </TabsContent>

              <TabsContent value="integrations" className="mt-0">
                <div className="mb-8">
                  <h2 className="text-4xl font-bold text-[#F5F5DC] mb-2">
                    Platform <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">Integrations</span>
                  </h2>
                  <p className="text-[#F5F5DC]/60">Connect your social media accounts and e-commerce platforms</p>
                </div>
                <IntegrationWizard />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
