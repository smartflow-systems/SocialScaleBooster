import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/ui/navigation";
import GitHubSidebar from "@/components/Dashboard/GitHubSidebar";
import {
  BarChart3, Store, Wand2, Play, Rocket, TrendingUp, Users, Zap,
  Check, Star, ArrowRight, Sparkles, Bot, Calendar, Crown, Shield,
  Globe, Cpu, Target, DollarSign, Clock, Award
} from "lucide-react";
import { useLocation } from "wouter";

export default function Landing() {
  const [, setLocation] = useLocation();
  const [stats, setStats] = useState({ users: 0, bots: 0, revenue: 0, engagement: 0 });

  // Animate stats counter on mount
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    const targets = { users: 50000, bots: 125000, revenue: 2.4, engagement: 850 };
    let current = { users: 0, bots: 0, revenue: 0, engagement: 0 };

    const timer = setInterval(() => {
      current = {
        users: Math.min(current.users + targets.users / steps, targets.users),
        bots: Math.min(current.bots + targets.bots / steps, targets.bots),
        revenue: Math.min(current.revenue + targets.revenue / steps, targets.revenue),
        engagement: Math.min(current.engagement + targets.engagement / steps, targets.engagement),
      };
      setStats(current);

      if (current.users >= targets.users) {
        clearInterval(timer);
        setStats(targets);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const handleStartFree = () => {
    setLocation("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F5F5DC] relative overflow-x-hidden">
      <GitHubSidebar />
      <Navigation />

      {/* Hero Section - ABSOLUTELY SICK */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-96 h-96 bg-[#FFD700] rounded-full filter blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-[#3B2F2F] rounded-full filter blur-[150px] animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#FFD700] rounded-full filter blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[rgba(255,215,0,0.1)] border border-[rgba(255,215,0,0.3)] rounded-full mb-8 animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-[#FFD700]" />
            <span className="text-sm font-semibold text-[#FFD700]">AI-Powered Social Commerce Platform</span>
            <Award className="w-4 h-4 text-[#FFD700]" />
          </div>

          {/* Main headline with gradient */}
          <h1 className="text-6xl md:text-8xl font-extrabold mb-8 leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <span className="bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] bg-clip-text text-transparent inline-block animate-gradient-x">
              10x Your Sales
            </span>
            <br />
            <span className="text-[#F5F5DC]">with AI Social Bots</span>
          </h1>

          <p className="text-xl md:text-2xl text-[#F5F5DC]/80 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Premium no-code platform for e-commerce automation. Boost revenue, engagement, and conversions across <span className="text-[#FFD700] font-semibold">TikTok, Instagram, Facebook</span>, and more with intelligent AI-powered bots.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Button
              onClick={handleStartFree}
              className="group bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#0D0D0D] px-10 py-6 text-lg font-bold rounded-2xl shadow-[0_20px_60px_rgba(255,215,0,0.4)] hover:shadow-[0_25px_80px_rgba(255,215,0,0.6)] hover:scale-105 transition-all duration-300"
              size="lg"
            >
              <Rocket className="w-6 h-6 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              Start Free - No Credit Card
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            <Button
              variant="outline"
              className="border-2 border-[#FFD700] bg-[rgba(255,215,0,0.05)] text-[#FFD700] px-10 py-6 text-lg font-semibold rounded-2xl hover:bg-[rgba(255,215,0,0.15)] backdrop-blur-sm transition-all duration-300"
              size="lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Floating Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto mb-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            {[
              { label: 'Active Users', value: Math.round(stats.users).toLocaleString(), icon: Users, suffix: '+' },
              { label: 'Bots Created', value: Math.round(stats.bots).toLocaleString(), icon: Bot, suffix: '+' },
              { label: 'Revenue Generated', value: `£${stats.revenue.toFixed(1)}M`, icon: DollarSign, suffix: '' },
              { label: 'Avg Engagement', value: `${Math.round(stats.engagement)}%`, icon: TrendingUp, suffix: '+' },
            ].map((stat, index) => (
              <div
                key={index}
                className="
                  p-6 rounded-2xl
                  bg-[rgba(59,47,47,0.4)] backdrop-blur-xl
                  border border-[rgba(255,215,0,0.2)]
                  hover:border-[rgba(255,215,0,0.5)]
                  hover:bg-[rgba(59,47,47,0.6)]
                  transition-all duration-300
                  hover:scale-105 hover:-translate-y-1
                  shadow-lg hover:shadow-2xl
                "
              >
                <stat.icon className="w-8 h-8 text-[#FFD700] mb-3 mx-auto" />
                <div className="text-3xl md:text-4xl font-bold text-[#FFD700] mb-1">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-sm text-[#F5F5DC]/70 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center items-center gap-8 pt-8 border-t border-[rgba(255,215,0,0.1)] animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center gap-2 text-[#F5F5DC]/70">
              <Shield className="w-5 h-5 text-[#FFD700]" />
              <span className="text-sm font-medium">Bank-Grade Security</span>
            </div>
            <div className="flex items-center gap-2 text-[#F5F5DC]/70">
              <Star className="w-5 h-5 text-[#FFD700]" />
              <span className="text-sm font-medium">4.9/5 Rating</span>
            </div>
            <div className="flex items-center gap-2 text-[#F5F5DC]/70">
              <Globe className="w-5 h-5 text-[#FFD700]" />
              <span className="text-sm font-medium">50K+ Businesses</span>
            </div>
            <div className="flex items-center gap-2 text-[#F5F5DC]/70">
              <Clock className="w-5 h-5 text-[#FFD700]" />
              <span className="text-sm font-medium">24/7 Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - PREMIUM */}
      <section id="features" className="py-24 bg-gradient-to-br from-[rgba(13,13,13,0.8)] to-[rgba(59,47,47,0.4)] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-2 bg-[rgba(255,215,0,0.1)] border border-[rgba(255,215,0,0.3)] rounded-full mb-6">
              <span className="text-sm font-semibold text-[#FFD700]">POWERFUL FEATURES</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Everything You Need to
              <br />
              <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
                Dominate Social Commerce
              </span>
            </h2>
            <p className="text-xl text-[#F5F5DC]/70 max-w-3xl mx-auto">
              From AI content generation to advanced analytics, we've got you covered
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: 'Advanced Analytics',
                description: 'Real-time revenue tracking, ROI calculations, engagement metrics, and platform performance with beautiful Chart.js visualizations.',
                color: 'from-purple-500 to-purple-600',
              },
              {
                icon: Bot,
                title: 'AI-Powered Bots',
                description: 'Intelligent automation that learns from your best-performing content and optimizes engagement strategies.',
                color: 'from-[#FFD700] to-[#E6C200]',
              },
              {
                icon: Calendar,
                title: 'Smart Scheduling',
                description: 'Advanced cron UI with if-then automation rules, peak hours optimization, and engagement threshold posting.',
                color: 'from-emerald-500 to-emerald-600',
              },
              {
                icon: Store,
                title: 'Bot Marketplace',
                description: 'Access premium templates for beauty, fashion, tech, and e-commerce with category filtering and instant deployment.',
                color: 'from-amber-500 to-orange-500',
              },
              {
                icon: Cpu,
                title: 'Multi-Platform Support',
                description: 'Seamlessly automate across TikTok, Instagram, Facebook, Twitter, and YouTube from one dashboard.',
                color: 'from-cyan-500 to-blue-500',
              },
              {
                icon: Target,
                title: 'Audience Targeting',
                description: 'Precision targeting with demographics, interests, behaviors, and custom audience creation tools.',
                color: 'from-rose-500 to-pink-500',
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="
                  group relative
                  bg-[rgba(59,47,47,0.4)] backdrop-blur-xl
                  border border-[rgba(255,215,0,0.2)]
                  hover:border-[rgba(255,215,0,0.5)]
                  hover:bg-[rgba(59,47,47,0.6)]
                  transition-all duration-500
                  hover:scale-105 hover:-translate-y-2
                  overflow-hidden
                  rounded-3xl
                  shadow-lg hover:shadow-2xl
                "
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,215,0,0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <CardContent className="relative p-8">
                  {/* Icon */}
                  <div className={`
                    inline-flex p-4 rounded-2xl mb-6
                    bg-gradient-to-br ${feature.color}
                    shadow-xl group-hover:scale-110 group-hover:rotate-3
                    transition-all duration-500
                  `}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold mb-4 text-[#F5F5DC] group-hover:text-[#FFD700] transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-[#F5F5DC]/70 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Bottom glow */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section - STUNNING */}
      <section id="pricing" className="py-24 bg-[#0D0D0D] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-2 bg-[rgba(255,215,0,0.1)] border border-[rgba(255,215,0,0.3)] rounded-full mb-6">
              <span className="text-sm font-semibold text-[#FFD700]">PRICING</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
                Simple Pricing
              </span>
              <br />
              for Every Business
            </h2>
            <p className="text-xl text-[#F5F5DC]/70 max-w-3xl mx-auto">
              Start free, upgrade when you're ready to scale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="
              bg-[rgba(59,47,47,0.4)] backdrop-blur-xl
              border border-[rgba(255,215,0,0.2)]
              hover:border-[rgba(255,215,0,0.5)]
              hover:bg-[rgba(59,47,47,0.6)]
              transition-all duration-300
              hover:scale-105
              rounded-3xl
              shadow-lg hover:shadow-2xl
            ">
              <CardContent className="p-10 text-center">
                <h3 className="text-3xl font-bold mb-2 text-[#F5F5DC]">Free Plan</h3>
                <p className="text-[#F5F5DC]/60 mb-6">Perfect for getting started</p>
                <div className="mb-8">
                  <span className="text-6xl font-bold text-[#FFD700]">£0</span>
                  <span className="text-[#F5F5DC]/60 text-lg">/month</span>
                </div>
                <ul className="text-left space-y-4 mb-10">
                  {['Up to 3 bots', 'Basic analytics', 'Free templates', 'Community support', '1 social platform'].map((feature, i) => (
                    <li key={i} className="flex items-center text-[#F5F5DC]/80">
                      <Check className="w-5 h-5 text-[#FFD700] mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => setLocation("/dashboard")}
                  className="w-full bg-[rgba(255,215,0,0.1)] text-[#FFD700] border-2 border-[#FFD700] hover:bg-[#FFD700] hover:text-[#0D0D0D] py-6 text-lg font-semibold rounded-xl transition-all duration-300"
                >
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan - PREMIUM */}
            <Card className="
              relative
              bg-gradient-to-br from-[#FFD700] to-[#FFA500]
              border-2 border-[#FFD700]
              hover:shadow-[0_30px_90px_rgba(255,215,0,0.5)]
              transition-all duration-300
              hover:scale-105
              rounded-3xl
              shadow-2xl
              overflow-hidden
            ">
              {/* Best Value Badge */}
              <div className="absolute top-6 right-6 px-4 py-2 bg-[#0D0D0D] rounded-full flex items-center gap-2 shadow-lg">
                <Crown className="w-4 h-4 text-[#FFD700]" />
                <span className="text-xs font-bold text-[#FFD700]">BEST VALUE</span>
              </div>

              <CardContent className="p-10 text-center">
                <h3 className="text-3xl font-bold mb-2 text-[#0D0D0D]">Pro Plan</h3>
                <p className="text-[#0D0D0D]/70 mb-6 font-medium">For serious businesses</p>
                <div className="mb-8">
                  <span className="text-6xl font-bold text-[#0D0D0D]">£49</span>
                  <span className="text-[#0D0D0D]/70 text-lg">/month</span>
                </div>
                <ul className="text-left space-y-4 mb-10">
                  {[
                    'Unlimited bots',
                    'Advanced analytics & ROI tracking',
                    'Premium templates library',
                    'Priority support (24/7)',
                    'All social platforms',
                    'AI content generation',
                    'Custom branding',
                    'Team collaboration'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center text-[#0D0D0D] font-medium">
                      <Check className="w-5 h-5 text-[#0D0D0D] mr-3 flex-shrink-0 font-bold" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => setLocation("/subscribe")}
                  className="w-full bg-[#0D0D0D] text-[#FFD700] hover:bg-[#0D0D0D]/90 py-6 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  Upgrade to Pro
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section - SOCIAL PROOF */}
      <section className="py-24 bg-gradient-to-br from-[rgba(59,47,47,0.4)] to-[rgba(13,13,13,0.8)] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-2 bg-[rgba(255,215,0,0.1)] border border-[rgba(255,215,0,0.3)] rounded-full mb-6">
              <span className="text-sm font-semibold text-[#FFD700]">TESTIMONIALS</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Loved by
              <br />
              <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
                50,000+ Businesses
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Beauty Brand Owner',
                company: 'GlowUp Cosmetics',
                quote: 'SmartFlow AI increased our TikTok sales by 400% in just 2 months. The AI bots are absolutely game-changing!',
                rating: 5,
              },
              {
                name: 'Marcus Chen',
                role: 'E-Commerce Director',
                company: 'TechGear Pro',
                quote: 'We went from manually posting to fully automated campaigns. Revenue up 10x, time spent down 90%. Incredible ROI.',
                rating: 5,
              },
              {
                name: 'Emily Rodriguez',
                role: 'Fashion Entrepreneur',
                company: 'StyleVibe',
                quote: 'The analytics alone are worth the price. We now know exactly what works and can scale profitable campaigns instantly.',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card
                key={index}
                className="
                  bg-[rgba(59,47,47,0.4)] backdrop-blur-xl
                  border border-[rgba(255,215,0,0.2)]
                  hover:border-[rgba(255,215,0,0.5)]
                  hover:bg-[rgba(59,47,47,0.6)]
                  transition-all duration-300
                  hover:scale-105 hover:-translate-y-2
                  rounded-3xl
                  shadow-lg hover:shadow-2xl
                "
              >
                <CardContent className="p-8">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-[#FFD700] fill-[#FFD700]" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-[#F5F5DC]/90 text-lg leading-relaxed mb-6 italic">
                    "{testimonial.quote}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4 pt-4 border-t border-[rgba(255,215,0,0.1)]">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center text-[#0D0D0D] font-bold text-xl">
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <div className="font-bold text-[#F5F5DC]">{testimonial.name}</div>
                      <div className="text-sm text-[#FFD700]">{testimonial.role}</div>
                      <div className="text-xs text-[#F5F5DC]/60">{testimonial.company}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace Section */}
      <section id="marketplace" className="py-24 bg-[#0D0D0D] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-2 bg-[rgba(255,215,0,0.1)] border border-[rgba(255,215,0,0.3)] rounded-full mb-6">
              <span className="text-sm font-semibold text-[#FFD700]">MARKETPLACE</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
                125,000+ Templates
              </span>
              <br />
              Ready to Deploy
            </h2>
            <p className="text-xl text-[#F5F5DC]/70 max-w-3xl mx-auto">
              Pre-built bots for every niche, platform, and use case
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { emoji: '🛍️', title: 'E-Commerce', count: '45K', desc: 'Product showcases, flash sales' },
              { emoji: '💄', title: 'Beauty', count: '32K', desc: 'Makeup tutorials, reviews' },
              { emoji: '👗', title: 'Fashion', count: '28K', desc: 'Style guides, trends' },
              { emoji: '⚡', title: 'Technology', count: '20K', desc: 'Product reviews, demos' },
            ].map((category, index) => (
              <Card
                key={index}
                className="
                  group
                  bg-[rgba(59,47,47,0.4)] backdrop-blur-xl
                  border border-[rgba(255,215,0,0.2)]
                  hover:border-[rgba(255,215,0,0.5)]
                  hover:bg-[rgba(59,47,47,0.6)]
                  transition-all duration-300
                  hover:scale-105
                  rounded-2xl
                  shadow-lg hover:shadow-2xl
                  cursor-pointer
                "
              >
                <CardContent className="p-8 text-center">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {category.emoji}
                  </div>
                  <h3 className="text-xl font-bold mb-1 text-[#F5F5DC] group-hover:text-[#FFD700] transition-colors duration-300">
                    {category.title}
                  </h3>
                  <div className="text-2xl font-bold text-[#FFD700] mb-2">{category.count}+</div>
                  <p className="text-sm text-[#F5F5DC]/70">{category.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button
              onClick={() => setLocation("/dashboard")}
              className="group bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#0D0D0D] px-10 py-6 text-lg font-bold rounded-2xl shadow-[0_20px_60px_rgba(255,215,0,0.4)] hover:shadow-[0_25px_80px_rgba(255,215,0,0.6)] hover:scale-105 transition-all duration-300"
            >
              <Store className="w-6 h-6 mr-2" />
              Explore All Templates
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA Section - POWERFUL */}
      <section className="py-24 bg-gradient-to-br from-[#FFD700] to-[#FFA500] relative overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#0D0D0D] rounded-full filter blur-[120px]"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#0D0D0D] rounded-full filter blur-[120px]"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl md:text-7xl font-extrabold mb-6 text-[#0D0D0D] leading-tight">
            Ready to 10x Your Sales?
          </h2>
          <p className="text-xl md:text-2xl text-[#0D0D0D]/80 mb-10 font-medium">
            Join 50,000+ businesses using SmartFlow AI to dominate social commerce
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={handleStartFree}
              className="group bg-[#0D0D0D] text-[#FFD700] px-10 py-6 text-lg font-bold rounded-2xl shadow-2xl hover:shadow-[0_30px_90px_rgba(0,0,0,0.6)] hover:scale-105 transition-all duration-300"
              size="lg"
            >
              <Rocket className="w-6 h-6 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              Start Free Today
            </Button>
            <div className="flex items-center gap-2 text-[#0D0D0D]">
              <Check className="w-5 h-5" />
              <span className="font-semibold">No credit card required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Add animations */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
