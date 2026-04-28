import { useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/ui/navigation";
import SpaceBackground from "@/components/SpaceBackground";
import { useLocation } from "wouter";
import { GlassCard, GoldButton, GhostButton, FadeInUp, GoldHeading, SfsSection, SfsContainer } from "@/components/sfs";
import {
  Monitor, Bot, TrendingUp, ArrowRight, X, Check,
  Clock, Users, Star, Zap, Globe, BarChart3,
  Mail, Phone, MapPin, ChevronRight, Code, ExternalLink,
  Sparkles, CalendarDays, LayoutDashboard, Send, ImageIcon,
  Instagram, Twitter, Linkedin, Facebook, Play,
} from "lucide-react";

/* ─── SERVICES ──────────────────────────────────────────────────── */
const services = [
  {
    id: "web-dev",
    icon: Monitor,
    title: "App & Website Development",
    tagline: "Pixel-perfect digital products built to convert.",
    summary: "From MVPs to enterprise platforms — fast, scalable apps and websites your users love.",
    featured: true,
    bullets: ["Custom web & mobile app development", "UI/UX design & prototyping", "Performance optimisation & SEO"],
    whatsIncluded: [
      "Custom web & mobile app development",
      "UI/UX design & prototyping",
      "API integration & third-party services",
      "Performance optimisation & SEO",
      "Ongoing maintenance & support",
      "Hosting & infrastructure setup",
    ],
    howItWorks: [
      { step: "Discovery", desc: "We map your goals, users, and technical requirements." },
      { step: "Design", desc: "High-fidelity wireframes and brand-aligned visuals." },
      { step: "Build", desc: "Agile sprints with regular client reviews and demos." },
      { step: "Launch", desc: "QA, deployment, and handover with full documentation." },
    ],
    delivery: "4–12 weeks",
    idealFor: "Startups, SMEs, and enterprises needing a reliable digital product.",
  },
  {
    id: "ai-automation",
    icon: Bot,
    title: "Business AI Automation",
    tagline: "Replace hours of manual work with intelligent systems.",
    summary: "AI workflows that handle repetitive tasks, generate insights, and scale your operations without extra headcount.",
    featured: false,
    bullets: ["Custom AI workflow & pipeline design", "CRM & tool integrations", "AI chatbots & virtual assistants"],
    whatsIncluded: [
      "Custom AI workflow design",
      "CRM & tool integrations",
      "Document & data processing automation",
      "AI chatbots & virtual assistants",
      "Reporting & insight dashboards",
      "Team training & handover",
    ],
    howItWorks: [
      { step: "Audit", desc: "Identify your highest-impact automation opportunities." },
      { step: "Design", desc: "Map out the AI workflow architecture end to end." },
      { step: "Build", desc: "Deploy integrations, models, and automations." },
      { step: "Optimise", desc: "Monitor, tune, and expand as your business grows." },
    ],
    delivery: "2–6 weeks",
    idealFor: "Businesses spending hours on repeatable manual processes.",
  },
  {
    id: "digital-marketing",
    icon: TrendingUp,
    title: "Digital Marketing Services",
    tagline: "Data-driven campaigns that generate real revenue.",
    summary: "SEO, paid ads, social, and content strategy — aligned to your growth goals and tracked to the pound.",
    featured: false,
    bullets: ["SEO strategy & technical audit", "Google & Meta paid advertising", "Social media management"],
    whatsIncluded: [
      "SEO strategy & technical audit",
      "Google & Meta paid advertising",
      "Social media management",
      "Content creation & copywriting",
      "Email marketing campaigns",
      "Monthly analytics reporting",
    ],
    howItWorks: [
      { step: "Research", desc: "Competitor analysis, keyword mapping, and audience profiling." },
      { step: "Strategy", desc: "A tailored growth plan with measurable KPIs." },
      { step: "Execute", desc: "Campaigns launch across agreed channels on schedule." },
      { step: "Report", desc: "Monthly performance reviews with clear ROI tracking." },
    ],
    delivery: "Ongoing monthly retainer",
    idealFor: "Brands looking to grow their audience and online revenue.",
  },
  {
    id: "ecom",
    icon: Globe,
    title: "E-Commerce Solutions",
    tagline: "Stores that sell while you sleep.",
    summary: "Shopify, WooCommerce, or custom — conversion-focused e-commerce experiences from day one.",
    featured: false,
    bullets: ["Store design & development", "Payment & fulfilment integration", "Conversion rate optimisation"],
    whatsIncluded: [
      "Store design & development",
      "Payment gateway setup",
      "Inventory & order management",
      "Conversion rate optimisation",
      "Product photography direction",
      "Post-launch analytics setup",
    ],
    howItWorks: [
      { step: "Platform", desc: "Choose the right stack for your catalogue and volume." },
      { step: "Design", desc: "Brand-aligned storefront built to convert browsers to buyers." },
      { step: "Integrate", desc: "Payments, shipping, and fulfilment wired up end to end." },
      { step: "Grow", desc: "Ongoing CRO and marketing support post-launch." },
    ],
    delivery: "3–8 weeks",
    idealFor: "Retailers and DTC brands moving or scaling online.",
  },
  {
    id: "analytics",
    icon: BarChart3,
    title: "Data & Analytics",
    tagline: "Turn your data into decisions.",
    summary: "Custom dashboards, BI integrations, and predictive models that deliver actionable business intelligence.",
    featured: false,
    bullets: ["BI dashboard design & build", "Data pipeline & source integration", "Predictive modelling"],
    whatsIncluded: [
      "BI dashboard design & build",
      "Data pipeline setup",
      "Google Analytics 4 implementation",
      "Custom KPI tracking",
      "Predictive modelling",
      "Team training & documentation",
    ],
    howItWorks: [
      { step: "Audit", desc: "Assess your current data infrastructure and gaps." },
      { step: "Design", desc: "Architect the metrics, sources, and dashboard layout." },
      { step: "Build", desc: "Implement pipelines, connectors, and visualisations." },
      { step: "Train", desc: "Handover with documentation and team enablement." },
    ],
    delivery: "2–5 weeks",
    idealFor: "Teams flying blind on performance and wanting clarity fast.",
  },
  {
    id: "branding",
    icon: Star,
    title: "Branding & Strategy",
    tagline: "Look like the business you want to become.",
    summary: "Brand identity, positioning, and go-to-market strategy that makes you memorable and market-ready.",
    featured: false,
    bullets: ["Brand identity design & guidelines", "Messaging & positioning framework", "Go-to-market strategy"],
    whatsIncluded: [
      "Brand identity design (logo, colours, type)",
      "Brand guidelines document",
      "Messaging & positioning framework",
      "Competitor landscape analysis",
      "Go-to-market strategy",
      "Pitch deck & sales materials",
    ],
    howItWorks: [
      { step: "Discover", desc: "Deep-dive workshops on your vision, values, and market." },
      { step: "Define", desc: "Positioning strategy and brand architecture." },
      { step: "Design", desc: "Visual identity that embodies who you are." },
      { step: "Deliver", desc: "Full asset pack and brand guidelines." },
    ],
    delivery: "2–4 weeks",
    idealFor: "New businesses and companies rebranding for growth.",
  },
];

/* ─── PORTFOLIO ──────────────────────────────────────────────────── */
const portfolio = [
  {
    title: "NexaTrade Platform",
    category: "App Development",
    result: "3× faster order processing",
    desc: "End-to-end trading platform with real-time data feeds, custom dashboards, and a companion mobile app.",
    tags: ["React", "Node.js", "WebSockets", "AWS"],
    dark: true,
  },
  {
    title: "AutoFlow CRM",
    category: "AI Automation",
    result: "80% less manual data entry",
    desc: "AI-driven CRM automation syncing leads, sending follow-ups, and updating records with zero human input.",
    tags: ["GPT-4", "Zapier", "HubSpot", "Python"],
    dark: false,
  },
  {
    title: "VerdantShop",
    category: "E-Commerce",
    result: "£2.1M revenue in Year 1",
    desc: "Shopify Plus store with custom product configurator, subscription model, and automated fulfilment.",
    tags: ["Shopify Plus", "React", "Klaviyo", "Stripe"],
    dark: true,
  },
  {
    title: "PulseHealth App",
    category: "App Development",
    result: "50K users in 6 months",
    desc: "Healthcare platform connecting patients and clinicians with AI triage, booking, and video consultations.",
    tags: ["React Native", "GraphQL", "Twilio", "Firebase"],
    dark: false,
  },
  {
    title: "Crestline Finance",
    category: "Digital Marketing",
    result: "4.2× ROAS on paid campaigns",
    desc: "Full-funnel paid media strategy across Google and Meta with conversion-optimised landing pages.",
    tags: ["Google Ads", "Meta", "GA4", "Unbounce"],
    dark: true,
  },
  {
    title: "OrbitSaaS Dashboard",
    category: "Data & Analytics",
    result: "Decisions from days to minutes",
    desc: "Real-time analytics integrating 12 data sources with predictive churn modelling built in.",
    tags: ["Tableau", "BigQuery", "dbt", "Python"],
    dark: false,
  },
];

/* ─── PROCESS ────────────────────────────────────────────────────── */
const steps = [
  { n: "01", title: "Discovery Call", desc: "We learn your goals, challenges, and vision in a focused 30-minute session." },
  { n: "02", title: "Strategy & Proposal", desc: "A clear scope, timeline, and investment — no fluff, no surprises." },
  { n: "03", title: "Build & Iterate", desc: "Agile delivery with regular check-ins so you're always in the loop." },
  { n: "04", title: "Launch & Support", desc: "Go live with confidence — we stay by your side post-launch." },
];

const heroStats = [
  { value: "150+", label: "Projects Delivered" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "12+", label: "Industries Served" },
  { value: "< 24 hrs", label: "Response Time" },
];

const tickerItems = [
  "App Development", "AI Automation", "Digital Marketing", "E-Commerce",
  "Brand Strategy", "Data & Analytics", "SEO", "Paid Ads", "Web Design",
  "Mobile Apps", "CRM Automation", "Content Strategy",
];

const pillars = [
  { icon: Monitor, label: "Build" },
  { icon: Bot, label: "Automate" },
  { icon: TrendingUp, label: "Grow" },
  { icon: BarChart3, label: "Analyse" },
];

/* ─── SERVICE MODAL ──────────────────────────────────────────────── */
function ServiceModal({ service, onClose }: { service: typeof services[0]; onClose: () => void }) {
  const [, setLocation] = useLocation();
  const handleGetStarted = () => {
    onClose();
    setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full md:max-w-2xl bg-[var(--sf-surface)] border border-[var(--sf-gold)]/20 rounded-t-3xl md:rounded-2xl overflow-y-auto max-h-[90vh] md:max-h-[85vh]">
        <div className="sticky top-0 bg-[var(--sf-surface)] border-b border-[var(--sf-gold)]/10 px-6 py-4 flex items-start justify-between">
          <div>
            <p className="text-[var(--sf-gold)] text-xs font-semibold uppercase tracking-widest mb-1">{service.tagline}</p>
            <h2 className="text-xl font-bold text-white">{service.title}</h2>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white ml-4 mt-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-6">
          <p className="text-neutral-300 leading-relaxed">{service.summary}</p>
          <div>
            <h3 className="text-[var(--sf-gold)] text-xs font-semibold uppercase tracking-widest mb-3">What's Included</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {service.whatsIncluded.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-neutral-300">
                  <Check className="w-4 h-4 text-[var(--sf-gold)] flex-shrink-0 mt-0.5" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-[var(--sf-gold)] text-xs font-semibold uppercase tracking-widest mb-3">How It Works</h3>
            <ol className="space-y-3">
              {service.howItWorks.map((s, i) => (
                <li key={s.step} className="flex gap-3 text-sm">
                  <span className="text-[var(--sf-gold)] font-bold w-5 flex-shrink-0">{i + 1}.</span>
                  <span className="text-neutral-300"><span className="text-white font-medium">{s.step}:</span> {s.desc}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 text-neutral-400">
              <Clock className="w-4 h-4 text-[var(--sf-gold)]" />
              <span><span className="text-white font-medium">Delivery:</span> {service.delivery}</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-400">
              <Users className="w-4 h-4 text-[var(--sf-gold)]" />
              <span><span className="text-white font-medium">Ideal for:</span> {service.idealFor}</span>
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 bg-[var(--sf-surface)] border-t border-[var(--sf-gold)]/10 px-6 py-4 flex gap-3">
          <GoldButton onClick={handleGetStarted} className="flex-1">
            Get Started
          </GoldButton>
          <GhostButton
            onClick={() => { onClose(); setLocation("/subscribe"); }}
            className="flex-1"
          >
            View Pricing
          </GhostButton>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN ───────────────────────────────────────────────────────── */
export default function Landing() {
  const [activeModal, setActiveModal] = useState<typeof services[0] | null>(null);
  const [demoTab, setDemoTab] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const [formSent, setFormSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
    formRef.current?.reset();
    setTimeout(() => setFormSent(false), 4000);
  };

  return (
    <>
    <SpaceBackground />
    <div className="relative z-[1] min-h-screen text-white overflow-x-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navigation />

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <SfsSection className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 py-24 overflow-hidden">
        <SfsContainer className="relative z-10 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight text-white">
            Systems that sell while you sleep
          </h1>

          <p className="text-base md:text-lg text-neutral-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            AI social bots, one-click booking, conversion-ready shops, and slick websites — all prebuilt, branded, and fast.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <GoldButton
              onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8 py-4 text-base rounded-full"
            >
              See the 30 Systems
            </GoldButton>
            <GhostButton
              onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8 py-4 text-base rounded-full"
            >
              Pricing
            </GhostButton>
          </div>
        </SfsContainer>
      </SfsSection>

      {/* ── TICKER ────────────────────────────────────────────────── */}
      <div className="border-y border-[var(--sf-gold)]/15 bg-[var(--sf-black)] py-3 overflow-hidden">
        <div className="sfs-ticker flex items-center whitespace-nowrap">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-4 px-6 text-sm text-neutral-400 font-medium">
              <span className="text-[var(--sf-gold)]">✦</span>{item}
            </span>
          ))}
        </div>
      </div>

      {/* ── PRODUCT DEMO ──────────────────────────────────────────── */}
      <SfsSection id="platform" className="py-24 px-4 bg-[var(--sf-black)] relative overflow-hidden">
        {/* subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[var(--sf-gold)]/3 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-[var(--sf-gold)] text-xs font-bold uppercase tracking-widest mb-4 bg-[var(--sf-gold)]/10 border border-[var(--sf-gold)]/20 px-4 py-1.5 rounded-full">
              <Play className="w-3 h-3" /> Live Platform Demo
            </span>
            <GoldHeading level={2} className="text-4xl md:text-5xl font-extrabold mb-4">
              <span className="text-plain-white">Everything your business needs,</span><br />
              in one place.
            </GoldHeading>
            <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
              SmartFlow gives your team AI-powered content creation, automated social scheduling, and a full agency CRM — all under one dashboard.
            </p>
          </div>

          {/* Tab selector */}
          <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
            {[
              { icon: Sparkles, label: "AI Content Studio" },
              { icon: CalendarDays, label: "Social Scheduler" },
              { icon: LayoutDashboard, label: "Agency Dashboard" },
            ].map(({ icon: Icon, label }, i) => (
              <button
                key={label}
                onClick={() => setDemoTab(i)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  demoTab === i
                    ? "bg-[var(--sf-gold)] text-[var(--sf-black)]"
                    : "border border-white/10 text-neutral-400 hover:border-[var(--sf-gold)]/30 hover:text-white bg-white/3"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Demo panel */}
          <GlassCard className="!bg-[var(--sf-surface-3)] !border-[var(--sf-gold)]/15 overflow-hidden shadow-[var(--sf-glow-gold-xl)] !p-0">
            {/* Browser chrome bar */}
            <div className="flex items-center gap-2 px-5 py-3 bg-[var(--sf-surface-2)] border-b border-white/5">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-[var(--sf-surface)] rounded-md px-3 py-1 text-xs text-neutral-500 font-mono w-64 mx-auto text-center">
                  app.smartflowsystems.co.uk
                </div>
              </div>
              <div className="w-16" />
            </div>

            {/* Tab 0 — AI Content Studio */}
            {demoTab === 0 && (
              <div className="grid md:grid-cols-5 min-h-[520px]">
                {/* Left sidebar */}
                <div className="md:col-span-2 border-r border-white/5 p-6 flex flex-col gap-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--sf-gold)] mb-2">Generate Content</p>

                  <div>
                    <label className="text-xs text-neutral-500 mb-1.5 block">Platform</label>
                    <div className="flex gap-2">
                      {[
                        { Icon: Instagram, active: true },
                        { Icon: Twitter, active: false },
                        { Icon: Linkedin, active: false },
                        { Icon: Facebook, active: false },
                      ].map(({ Icon, active }, i) => (
                        <div key={i} className={`w-9 h-9 rounded-lg flex items-center justify-center border cursor-pointer ${active ? "border-[var(--sf-gold)]/60 bg-[var(--sf-gold)]/15 text-[var(--sf-gold)]" : "border-white/10 text-neutral-500"}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-neutral-500 mb-1.5 block">Tone</label>
                    <div className="flex flex-wrap gap-1.5">
                      {["Professional", "Casual", "Bold", "Inspiring"].map((t, i) => (
                        <span key={t} className={`text-xs px-2.5 py-1 rounded-lg border cursor-pointer ${i === 0 ? "border-[var(--sf-gold)]/50 bg-[var(--sf-gold)]/10 text-[var(--sf-gold)]" : "border-white/8 text-neutral-500"}`}>{t}</span>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1">
                    <label className="text-xs text-neutral-500 mb-1.5 block">Topic / Brief</label>
                    <div className="bg-[var(--sf-black)] border border-white/8 rounded-xl p-3 text-sm text-neutral-300 leading-relaxed min-h-[100px]">
                      Announcing our new AI automation service for SMEs — highlight time savings and ROI.
                    </div>
                  </div>

                  <button className="w-full bg-[var(--sf-gold)] text-[var(--sf-black)] font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm hover:bg-[var(--sf-gold-2)] transition-colors">
                    <Sparkles className="w-4 h-4" /> Generate with AI
                  </button>
                </div>

                {/* Right — Generated output */}
                <div className="md:col-span-3 p-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--sf-gold)]">Generated Posts</p>
                    <span className="text-xs text-neutral-500 bg-[var(--sf-gold)]/10 border border-[var(--sf-gold)]/20 px-2 py-0.5 rounded-full">3 variants</span>
                  </div>

                  {[
                    {
                      text: "🚀 Stop wasting hours on repetitive tasks. Our AI automation cuts manual work by 80% — so your team focuses on growth, not admin. Book a free discovery call today. #AIAutomation #SME #Productivity",
                      score: 94,
                      active: true,
                    },
                    {
                      text: "What if your CRM updated itself? Our AI automation handles lead routing, follow-ups, and reporting — automatically. Clients save an average of 15 hours per week. Let's talk. 💡",
                      score: 88,
                      active: false,
                    },
                    {
                      text: "The businesses winning in 2025 aren't working harder — they're working smarter. We help SMEs deploy AI that actually saves money and drives revenue. Results guaranteed. 📈",
                      score: 91,
                      active: false,
                    },
                  ].map((post, i) => (
                    <div key={i} className={`rounded-xl border p-4 cursor-pointer transition-all ${post.active ? "border-[var(--sf-gold)]/40 bg-[var(--sf-gold)]/5" : "border-white/5 bg-[var(--sf-surface)] hover:border-[var(--sf-gold)]/20"}`}>
                      <p className="text-sm text-neutral-200 leading-relaxed mb-3">{post.text}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-[var(--sf-gold)]" />
                          <span className="text-xs text-[var(--sf-gold)] font-semibold">Engagement Score: {post.score}</span>
                        </div>
                        <div className="flex gap-2">
                          <button className="text-xs text-neutral-500 hover:text-white border border-white/8 px-2.5 py-1 rounded-lg transition-colors">Edit</button>
                          <button className="text-xs bg-[var(--sf-gold)] text-[var(--sf-black)] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1">
                            <Send className="w-3 h-3" /> Schedule
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 1 — Social Scheduler */}
            {demoTab === 1 && (
              <div className="grid md:grid-cols-5 min-h-[520px]">
                {/* Queue sidebar */}
                <div className="md:col-span-2 border-r border-white/5 p-6 flex flex-col gap-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--sf-gold)] mb-2">Upcoming Queue</p>
                  {[
                    { platform: Instagram, time: "Today, 9:00 AM", text: "🚀 Stop wasting hours on repetitive tasks...", status: "Scheduled" },
                    { platform: Twitter, time: "Today, 12:30 PM", text: "What if your CRM updated itself?...", status: "Scheduled" },
                    { platform: Linkedin, time: "Tomorrow, 8:00 AM", text: "The businesses winning in 2025...", status: "Draft" },
                    { platform: Facebook, time: "Wed, 10:00 AM", text: "Introducing our AI automation suite...", status: "Scheduled" },
                    { platform: Instagram, time: "Thu, 2:00 PM", text: "Client spotlight: AutoFlow CRM saves...", status: "Scheduled" },
                  ].map((post, i) => {
                    const PIcon = post.platform;
                    return (
                      <div key={i} className="flex items-start gap-3 bg-[var(--sf-surface)] rounded-xl p-3.5 border border-white/5 hover:border-[var(--sf-gold)]/20 transition-all cursor-pointer">
                        <div className="w-8 h-8 rounded-lg bg-[var(--sf-gold)]/10 border border-[var(--sf-gold)]/20 flex items-center justify-center flex-shrink-0">
                          <PIcon className="w-4 h-4 text-[var(--sf-gold)]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-neutral-500 mb-0.5">{post.time}</p>
                          <p className="text-xs text-neutral-300 truncate">{post.text}</p>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${post.status === "Scheduled" ? "bg-green-500/15 text-green-400 border border-green-500/20" : "bg-neutral-700/40 text-neutral-500 border border-white/8"}`}>
                          {post.status}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Right — weekly calendar */}
                <div className="md:col-span-3 p-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--sf-gold)] mb-4">This Week</p>
                  <div className="grid grid-cols-7 gap-1.5 mb-3">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                      <div key={d} className="text-center text-[10px] font-semibold text-neutral-600 uppercase">{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1.5">
                    {Array.from({ length: 7 }, (_, i) => {
                      const posts = [2, 0, 1, 2, 1, 0, 0][i];
                      const isToday = i === 0;
                      return (
                        <div key={i} className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-1 border cursor-pointer transition-all ${isToday ? "border-[var(--sf-gold)]/50 bg-[var(--sf-gold)]/10" : posts > 0 ? "border-white/10 bg-[var(--sf-surface)] hover:border-[var(--sf-gold)]/25" : "border-white/5 bg-[var(--sf-surface-deep)]"}`}>
                          <span className={`text-sm font-bold ${isToday ? "text-[var(--sf-gold)]" : "text-neutral-300"}`}>{14 + i}</span>
                          {posts > 0 && (
                            <div className="flex gap-0.5">
                              {Array.from({ length: posts }, (_, j) => (
                                <div key={j} className="w-1.5 h-1.5 rounded-full bg-[var(--sf-gold)]/70" />
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4">
                    {[
                      { label: "Posts this week", value: "6", icon: Send },
                      { label: "Avg. engagement", value: "4.8%", icon: TrendingUp },
                      { label: "Reach this month", value: "24.3K", icon: Globe },
                      { label: "Best time to post", value: "9 AM", icon: Clock },
                    ].map(({ label, value, icon: Icon }) => (
                      <div key={label} className="bg-[var(--sf-surface)] border border-white/5 rounded-xl p-4">
                        <Icon className="w-4 h-4 text-[var(--sf-gold)] mb-2" />
                        <p className="text-xl font-extrabold text-white">{value}</p>
                        <p className="text-xs text-neutral-500 mt-0.5">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2 — Agency Dashboard */}
            {demoTab === 2 && (
              <div className="p-6 min-h-[520px]">
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Active Clients", value: "14", icon: Users, change: "+2 this month" },
                    { label: "MRR", value: "£18,400", icon: TrendingUp, change: "+12% vs last month" },
                    { label: "Tasks Due", value: "7", icon: Clock, change: "3 overdue" },
                    { label: "Avg. Satisfaction", value: "98%", icon: Star, change: "↑ from 96%" },
                  ].map(({ label, value, icon: Icon, change }) => (
                    <div key={label} className="bg-[var(--sf-surface)] border border-white/5 rounded-xl p-5 hover:border-[var(--sf-gold)]/20 transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs text-neutral-500 uppercase tracking-widest">{label}</p>
                        <Icon className="w-4 h-4 text-[var(--sf-gold)]" />
                      </div>
                      <p className="text-2xl font-extrabold text-white mb-1">{value}</p>
                      <p className="text-xs text-neutral-600">{change}</p>
                    </div>
                  ))}
                </div>

                <p className="text-xs font-bold uppercase tracking-widest text-[var(--sf-gold)] mb-4">Client Accounts</p>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    { name: "NexaTrade Ltd", type: "App Development", status: "Active", spend: "£4,200/mo", health: "On Track", avatar: "NT" },
                    { name: "VerdantShop", type: "E-Commerce + Marketing", status: "Active", spend: "£2,800/mo", health: "Attention", avatar: "VS" },
                    { name: "PulseHealth", type: "AI Automation", status: "Active", spend: "£3,600/mo", health: "On Track", avatar: "PH" },
                    { name: "Crestline Finance", type: "Digital Marketing", status: "Onboarding", spend: "£1,500/mo", health: "New", avatar: "CF" },
                  ].map((client) => (
                    <div key={client.name} className="flex items-center gap-4 bg-[var(--sf-surface)] border border-white/5 rounded-xl p-4 hover:border-[var(--sf-gold)]/20 transition-all cursor-pointer">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--sf-gold)]/30 to-[var(--sf-gold)]/10 border border-[var(--sf-gold)]/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-[var(--sf-gold)]">{client.avatar}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{client.name}</p>
                        <p className="text-xs text-neutral-500 truncate">{client.type}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-[var(--sf-gold)]">{client.spend}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          client.health === "On Track" ? "bg-green-500/15 text-green-400 border border-green-500/20" :
                          client.health === "Attention" ? "bg-amber-500/15 text-amber-400 border border-amber-500/20" :
                          "bg-blue-500/15 text-blue-400 border border-blue-500/20"
                        }`}>{client.health}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </GlassCard>

          {/* CTA below demo */}
          <div className="mt-10 text-center">
            <p className="text-neutral-400 mb-5 text-lg">Ready to see this running for your business?</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <GoldButton
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="px-8 py-4 text-base"
              >
                Book a Free Demo <ArrowRight className="ml-2 w-4 h-4" />
              </GoldButton>
              <GhostButton
                className="px-8 py-4 text-base"
                onClick={() => {
                  window.location.href = "/auth";
                }}
              >
                Start Free Trial
              </GhostButton>
            </div>
          </div>
        </div>
      </SfsSection>

      {/* ── SERVICES ──────────────────────────────────────────────── */}
      <SfsSection id="services" className="py-24 px-4 bg-[var(--sf-black)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[var(--sf-gold)] text-xs font-semibold uppercase tracking-widest mb-3">What We Do</p>
            <GoldHeading level={2} className="text-4xl md:text-5xl font-extrabold mb-4">Our Services</GoldHeading>
            <p className="text-neutral-400 max-w-xl mx-auto">Three core disciplines. One agency. Everything you need to build, automate, and grow.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((svc) => {
              const Icon = svc.icon;
              return (
                <button
                  key={svc.id}
                  onClick={() => setActiveModal(svc)}
                  className={`glass-card group text-left p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--sf-glow-gold-md)] focus:outline-none ${
                    svc.featured
                      ? "!border-[var(--sf-gold)]/40 bg-gradient-to-br from-[var(--sf-gold)]/10 to-[var(--sf-black)]"
                      : "hover:!border-[var(--sf-gold)]/25"
                  }`}
                >
                  {svc.featured && (
                    <span className="inline-block mb-3 text-[10px] font-bold uppercase tracking-widest text-[var(--sf-black)] bg-[var(--sf-gold)] px-2.5 py-1 rounded-full">
                      Most Popular
                    </span>
                  )}
                  <Icon className="w-8 h-8 text-[var(--sf-gold)] mb-4" />
                  <h3 className="text-lg font-bold mb-2">{svc.title}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed mb-4">{svc.summary}</p>
                  <ul className="space-y-1.5 mb-5">
                    {svc.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-2 text-xs text-neutral-300">
                        <span className="w-1 h-1 rounded-full bg-[var(--sf-gold)] flex-shrink-0" />{b}
                      </li>
                    ))}
                  </ul>
                  <span className="inline-flex items-center text-[var(--sf-gold)] text-sm font-medium gap-1 group-hover:gap-2 transition-all">
                    Learn more <ChevronRight className="w-4 h-4" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </SfsSection>

      {/* ── WORK ──────────────────────────────────────────────────── */}
      <SfsSection id="work" className="py-24 px-4 bg-[var(--sf-surface-deep)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[var(--sf-gold)] text-xs font-semibold uppercase tracking-widest mb-3">Case Studies</p>
            <GoldHeading level={2} className="text-4xl md:text-5xl font-extrabold mb-4">Our Work</GoldHeading>
            <p className="text-neutral-400 max-w-xl mx-auto">Real projects. Real results. Delivered on time, every time.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {portfolio.map((p, i) => (
              <GlassCard
                key={i}
                className={`group p-7 hover:-translate-y-1 transition-all duration-300 hover:shadow-[var(--sf-glow-gold-sm)] flex flex-col ${
                  p.dark
                    ? "hover:!border-[var(--sf-gold)]/25"
                    : "!border-[var(--sf-gold)]/20 hover:!border-[var(--sf-gold)]/40"
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--sf-gold)] bg-[var(--sf-gold)]/10 border border-[var(--sf-gold)]/20 px-2.5 py-1 rounded-full self-start">
                  {p.category}
                </span>
                <h3 className="text-xl font-bold mt-4 mb-2">{p.title}</h3>
                <p className="text-sm text-neutral-400 mb-3 leading-relaxed flex-1">{p.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {p.tags.map((tag) => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-neutral-400 border border-white/10">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[var(--sf-gold)]">
                    <Zap className="w-4 h-4" />{p.result}
                  </div>
                  <button
                    onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                    className="text-xs text-neutral-500 hover:text-[var(--sf-gold)] flex items-center gap-1 transition-colors"
                  >
                    View Case Study <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </SfsSection>

      {/* ── ABOUT ─────────────────────────────────────────────────── */}
      <SfsSection id="about" className="py-24 px-4 bg-[var(--sf-black)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            {/* Left */}
            <div>
              <p className="text-[var(--sf-gold)] text-xs font-semibold uppercase tracking-widest mb-4">Who We Are</p>
              <GoldHeading level={2} className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                <span className="text-plain-white">A team obsessed with</span><br />your results.
              </GoldHeading>
              <p className="text-neutral-400 leading-relaxed mb-5">
                SmartFlow Systems gives ambitious businesses access to the digital expertise typically reserved for large corporations — combining strategy, technology, and creativity under one roof.
              </p>
              <p className="text-neutral-400 leading-relaxed mb-8">
                From solo founders to scale-ups, we've built products used by hundreds of thousands of people worldwide.
              </p>

              {/* 4 pillar pills */}
              <div className="flex flex-wrap gap-2 mb-8">
                {pillars.map(({ icon: Icon, label }) => (
                  <span key={label} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--sf-gold)] bg-[var(--sf-gold)]/10 border border-[var(--sf-gold)]/20 px-3 py-1.5 rounded-full">
                    <Icon className="w-3 h-3" />{label}
                  </span>
                ))}
              </div>

              <GoldButton
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="px-6 py-3"
              >
                Work With Us <ArrowRight className="ml-2 w-4 h-4" />
              </GoldButton>
            </div>

            {/* Right — 3 overlapping floating stat cards + glow */}
            <div className="relative h-72 md:h-80">
              <div className="absolute inset-8 bg-[var(--sf-gold)]/8 rounded-full blur-3xl pointer-events-none" />
              {[
                { value: "150+", label: "Projects Delivered", Icon: Code, pos: "top-0 left-0 w-48" },
                { value: "98%", label: "Client Satisfaction", Icon: Star, pos: "top-8 right-0 w-48" },
                { value: "£8M+", label: "Revenue Generated", Icon: TrendingUp, pos: "bottom-0 left-1/2 -translate-x-1/2 w-52" },
              ].map(({ value, label, Icon, pos }) => (
                <GlassCard
                  key={label}
                  className={`absolute ${pos} !border-[var(--sf-gold)]/20 p-5 shadow-[var(--sf-glow-gold-sm)] hover:shadow-[var(--sf-glow-gold-lg)] transition-all`}
                >
                  <Icon className="w-4 h-4 text-[var(--sf-gold)] mb-2" />
                  <p className="text-2xl font-extrabold text-[var(--sf-gold)]">{value}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">{label}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </SfsSection>

      {/* ── PROCESS ───────────────────────────────────────────────── */}
      <SfsSection className="py-24 px-4 bg-[var(--sf-surface-deep)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[var(--sf-gold)] text-xs font-semibold uppercase tracking-widest mb-3">How We Work</p>
            <GoldHeading level={2} className="text-4xl md:text-5xl font-extrabold mb-4">Our Process</GoldHeading>
            <p className="text-neutral-400 max-w-xl mx-auto">Simple, transparent, and built around you.</p>
          </div>

          {/* Desktop: horizontal with → arrows */}
          <div className="hidden lg:flex items-start gap-0">
            {steps.map((step, i) => (
              <div key={step.n} className="flex items-start flex-1">
                <GlassCard className="p-7 flex-1 hover:!border-[var(--sf-gold)]/25 transition-all hover:shadow-[var(--sf-glow-gold-sm)]">
                  <span className="text-3xl font-extrabold text-[var(--sf-gold)]/25 block mb-3">{step.n}</span>
                  <h3 className="text-base font-bold mb-2">{step.title}</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">{step.desc}</p>
                </GlassCard>
                {i < steps.length - 1 && (
                  <div className="flex items-center px-2 pt-10 flex-shrink-0 text-[var(--sf-gold)]/40 text-2xl font-bold select-none">→</div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile: vertical with ↓ arrows */}
          <div className="lg:hidden flex flex-col items-center gap-0">
            {steps.map((step, i) => (
              <div key={step.n} className="flex flex-col items-center w-full max-w-md">
                <GlassCard className="p-7 w-full hover:!border-[var(--sf-gold)]/25 transition-all">
                  <span className="text-3xl font-extrabold text-[var(--sf-gold)]/25 block mb-3">{step.n}</span>
                  <h3 className="text-base font-bold mb-2">{step.title}</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">{step.desc}</p>
                </GlassCard>
                {i < steps.length - 1 && (
                  <div className="py-1 text-[var(--sf-gold)]/40 text-2xl font-bold select-none">↓</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </SfsSection>

      {/* ── CONTACT ───────────────────────────────────────────────── */}
      <SfsSection id="contact" className="py-24 px-4 bg-[var(--sf-black)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-14 items-start">
            <div>
              <p className="text-[var(--sf-gold)] text-xs font-semibold uppercase tracking-widest mb-4">Get In Touch</p>
              <GoldHeading level={2} className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                <span className="text-plain-white">Ready to build</span><br />something great?
              </GoldHeading>
              <p className="text-neutral-400 leading-relaxed mb-10">
                Tell us about your project and we'll get back to you within one business day. No sales pressure — just an honest conversation.
              </p>
              <div className="space-y-5">
                {[
                  { Icon: Mail, label: "Email", value: "hello@smartflowsystems.co.uk" },
                  { Icon: Phone, label: "Phone", value: "+44 20 1234 5678" },
                  { Icon: MapPin, label: "Based in", value: "London, United Kingdom" },
                ].map(({ Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--sf-gold)]/10 border border-[var(--sf-gold)]/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-[var(--sf-gold)]" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 uppercase tracking-widest">{label}</p>
                      <p className="text-sm text-white font-medium">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <GlassCard className="!bg-[var(--sf-surface)] !border-white/5 p-8">
              {formSent ? (
                <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                  <div className="w-14 h-14 rounded-full bg-[var(--sf-gold)]/10 border border-[var(--sf-gold)]/30 flex items-center justify-center mb-4">
                    <Check className="w-7 h-7 text-[var(--sf-gold)]" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-neutral-400 text-sm">We'll be in touch within one business day.</p>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs text-neutral-400 font-medium mb-1.5 uppercase tracking-widest">Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Your full name"
                      className="w-full bg-[var(--sf-black)] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[var(--sf-gold)]/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-400 font-medium mb-1.5 uppercase tracking-widest">Email</label>
                    <input
                      type="email"
                      required
                      placeholder="you@company.com"
                      className="w-full bg-[var(--sf-black)] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[var(--sf-gold)]/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-400 font-medium mb-1.5 uppercase tracking-widest">Message</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Tell us about your project..."
                      className="w-full bg-[var(--sf-black)] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[var(--sf-gold)]/50 transition-colors resize-none"
                    />
                  </div>
                  <GoldButton type="submit" className="w-full py-4 text-base">
                    Send Message <ArrowRight className="ml-2 w-4 h-4" />
                  </GoldButton>
                </form>
              )}
            </GlassCard>
          </div>
        </div>
      </SfsSection>

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 bg-[var(--sf-surface-deep)] py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <p className="font-bold text-[var(--sf-gold)]">SmartFlow Systems</p>
            <p className="text-neutral-600 text-xs hidden sm:block">·</p>
            <p className="text-neutral-600 text-xs">© {new Date().getFullYear()} SmartFlow Systems Ltd. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-5 text-neutral-500 text-xs">
            {[
              { label: "Services", id: "services" },
              { label: "Work", id: "work" },
              { label: "About", id: "about" },
              { label: "Contact", id: "contact" },
            ].map(({ label, id }) => (
              <button key={label} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })} className="hover:text-[var(--sf-gold)] transition-colors">
                {label}
              </button>
            ))}
            <a href="/subscribe" className="hover:text-[var(--sf-gold)] transition-colors">Pricing</a>
          </div>
        </div>
      </footer>

      {/* ── MODAL ─────────────────────────────────────────────────── */}
      {activeModal && <ServiceModal service={activeModal} onClose={() => setActiveModal(null)} />}

      {/* ── ANIMATIONS ────────────────────────────────────────────── */}
      <style>{`
        .sfs-dot-grid {
          background-image: radial-gradient(circle, var(--sf-gold) 1px, transparent 1px);
          background-size: 32px 32px;
          animation: sfs-dot-drift 20s linear infinite;
        }
        @keyframes sfs-dot-drift {
          0%   { background-position: 0 0; }
          100% { background-position: 32px 32px; }
        }
        .sfs-ticker {
          width: max-content;
          animation: sfs-ticker-move 30s linear infinite;
        }
        @keyframes sfs-ticker-move {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
    </>
  );
}
