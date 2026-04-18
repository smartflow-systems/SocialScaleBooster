import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/ui/navigation";
import SpaceBackground from "@/components/SpaceBackground";
import { useLocation } from "wouter";
import {
  Monitor, Bot, TrendingUp, ArrowRight, X, Check,
  Clock, Users, Star, Zap, Globe, BarChart3,
  Mail, Phone, MapPin, ChevronRight, Code, ExternalLink,
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
      <div className="relative w-full md:max-w-2xl bg-[#111] border border-[#FFD700]/20 rounded-t-3xl md:rounded-2xl overflow-y-auto max-h-[90vh] md:max-h-[85vh]">
        <div className="sticky top-0 bg-[#111] border-b border-[#FFD700]/10 px-6 py-4 flex items-start justify-between">
          <div>
            <p className="text-[#FFD700] text-xs font-semibold uppercase tracking-widest mb-1">{service.tagline}</p>
            <h2 className="text-xl font-bold text-white">{service.title}</h2>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white ml-4 mt-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-6">
          <p className="text-neutral-300 leading-relaxed">{service.summary}</p>
          <div>
            <h3 className="text-[#FFD700] text-xs font-semibold uppercase tracking-widest mb-3">What's Included</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {service.whatsIncluded.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-neutral-300">
                  <Check className="w-4 h-4 text-[#FFD700] flex-shrink-0 mt-0.5" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-[#FFD700] text-xs font-semibold uppercase tracking-widest mb-3">How It Works</h3>
            <ol className="space-y-3">
              {service.howItWorks.map((s, i) => (
                <li key={s.step} className="flex gap-3 text-sm">
                  <span className="text-[#FFD700] font-bold w-5 flex-shrink-0">{i + 1}.</span>
                  <span className="text-neutral-300"><span className="text-white font-medium">{s.step}:</span> {s.desc}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 text-neutral-400">
              <Clock className="w-4 h-4 text-[#FFD700]" />
              <span><span className="text-white font-medium">Delivery:</span> {service.delivery}</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-400">
              <Users className="w-4 h-4 text-[#FFD700]" />
              <span><span className="text-white font-medium">Ideal for:</span> {service.idealFor}</span>
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 bg-[#111] border-t border-[#FFD700]/10 px-6 py-4 flex gap-3">
          <Button onClick={handleGetStarted} className="flex-1 bg-[#FFD700] text-[#0D0D0D] hover:bg-[#E6C200] font-bold">
            Get Started
          </Button>
          <Button
            onClick={() => { onClose(); setLocation("/subscribe"); }}
            variant="outline"
            className="flex-1 border-[#FFD700]/40 text-[#FFD700] hover:bg-[#FFD700]/10"
          >
            View Pricing
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN ───────────────────────────────────────────────────────── */
export default function Landing() {
  const [activeModal, setActiveModal] = useState<typeof services[0] | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [formSent, setFormSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
    formRef.current?.reset();
    setTimeout(() => setFormSent(false), 4000);
  };

  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SpaceBackground />
      <Navigation />

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 py-24 overflow-hidden">
        <div className="absolute inset-0 sfs-dot-grid opacity-20 pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#FFD700]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto">
          <Badge className="mb-6 bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/30 text-xs font-semibold px-4 py-1.5 tracking-widest uppercase">
            ✦ Now with AI Automation
          </Badge>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.05] mb-6 tracking-tight">
            We Build Digital<br />
            <span style={{ background: "linear-gradient(90deg, #FFD700 0%, #E6C200 60%, #FFD700 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Businesses That Scale.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            SmartFlow Systems is a full-service digital agency delivering world-class apps, AI automation, and marketing — all under one roof.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-[#FFD700] text-[#0D0D0D] hover:bg-[#E6C200] font-bold px-8 py-4 text-base h-auto"
            >
              Start a Project <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}
              variant="outline"
              className="border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/10 px-8 py-4 text-base h-auto"
            >
              See Our Work
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {heroStats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl md:text-4xl font-extrabold text-[#FFD700]">{s.value}</p>
                <p className="text-xs text-neutral-500 mt-1 uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TICKER ────────────────────────────────────────────────── */}
      <div className="border-y border-[#FFD700]/15 bg-[#0D0D0D] py-3 overflow-hidden">
        <div className="sfs-ticker flex items-center whitespace-nowrap">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-4 px-6 text-sm text-neutral-400 font-medium">
              <span className="text-[#FFD700]">✦</span>{item}
            </span>
          ))}
        </div>
      </div>

      {/* ── SERVICES ──────────────────────────────────────────────── */}
      <section id="services" className="py-24 px-4 bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#FFD700] text-xs font-semibold uppercase tracking-widest mb-3">What We Do</p>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">Our Services</h2>
            <p className="text-neutral-400 max-w-xl mx-auto">Three core disciplines. One agency. Everything you need to build, automate, and grow.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((svc) => {
              const Icon = svc.icon;
              return (
                <button
                  key={svc.id}
                  onClick={() => setActiveModal(svc)}
                  className={`group text-left rounded-2xl border p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(255,215,0,0.12)] focus:outline-none ${
                    svc.featured
                      ? "border-[#FFD700]/40 bg-gradient-to-br from-[#FFD700]/10 to-[#0D0D0D]"
                      : "border-white/5 bg-[#111] hover:border-[#FFD700]/25"
                  }`}
                >
                  {svc.featured && (
                    <span className="inline-block mb-3 text-[10px] font-bold uppercase tracking-widest text-[#0D0D0D] bg-[#FFD700] px-2.5 py-1 rounded-full">
                      Most Popular
                    </span>
                  )}
                  <Icon className="w-8 h-8 text-[#FFD700] mb-4" />
                  <h3 className="text-lg font-bold mb-2">{svc.title}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed mb-4">{svc.summary}</p>
                  <ul className="space-y-1.5 mb-5">
                    {svc.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-2 text-xs text-neutral-300">
                        <span className="w-1 h-1 rounded-full bg-[#FFD700] flex-shrink-0" />{b}
                      </li>
                    ))}
                  </ul>
                  <span className="inline-flex items-center text-[#FFD700] text-sm font-medium gap-1 group-hover:gap-2 transition-all">
                    Learn more <ChevronRight className="w-4 h-4" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── WORK ──────────────────────────────────────────────────── */}
      <section id="work" className="py-24 px-4 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#FFD700] text-xs font-semibold uppercase tracking-widest mb-3">Case Studies</p>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">Our Work</h2>
            <p className="text-neutral-400 max-w-xl mx-auto">Real projects. Real results. Delivered on time, every time.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {portfolio.map((p, i) => (
              <div
                key={i}
                className={`group rounded-2xl border p-7 hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,215,0,0.08)] flex flex-col ${
                  p.dark
                    ? "border-white/5 bg-[#0f0f0f] hover:border-[#FFD700]/25"
                    : "border-[#FFD700]/20 bg-[#1a1a14] hover:border-[#FFD700]/40"
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFD700] bg-[#FFD700]/10 border border-[#FFD700]/20 px-2.5 py-1 rounded-full self-start">
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
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#FFD700]">
                    <Zap className="w-4 h-4" />{p.result}
                  </div>
                  <button
                    onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                    className="text-xs text-neutral-500 hover:text-[#FFD700] flex items-center gap-1 transition-colors"
                  >
                    View Case Study <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ─────────────────────────────────────────────────── */}
      <section id="about" className="py-24 px-4 bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            {/* Left */}
            <div>
              <p className="text-[#FFD700] text-xs font-semibold uppercase tracking-widest mb-4">Who We Are</p>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                A team obsessed with<br /><span className="text-[#FFD700]">your results.</span>
              </h2>
              <p className="text-neutral-400 leading-relaxed mb-5">
                SmartFlow Systems gives ambitious businesses access to the digital expertise typically reserved for large corporations — combining strategy, technology, and creativity under one roof.
              </p>
              <p className="text-neutral-400 leading-relaxed mb-8">
                From solo founders to scale-ups, we've built products used by hundreds of thousands of people worldwide.
              </p>

              {/* 4 pillar pills */}
              <div className="flex flex-wrap gap-2 mb-8">
                {pillars.map(({ icon: Icon, label }) => (
                  <span key={label} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FFD700] bg-[#FFD700]/10 border border-[#FFD700]/20 px-3 py-1.5 rounded-full">
                    <Icon className="w-3 h-3" />{label}
                  </span>
                ))}
              </div>

              <Button
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="bg-[#FFD700] text-[#0D0D0D] hover:bg-[#E6C200] font-bold px-6"
              >
                Work With Us <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>

            {/* Right — 3 overlapping floating stat cards + glow */}
            <div className="relative h-72 md:h-80">
              <div className="absolute inset-8 bg-[#FFD700]/8 rounded-full blur-3xl pointer-events-none" />
              {[
                { value: "150+", label: "Projects Delivered", Icon: Code, pos: "top-0 left-0 w-48" },
                { value: "98%", label: "Client Satisfaction", Icon: Star, pos: "top-8 right-0 w-48" },
                { value: "£8M+", label: "Revenue Generated", Icon: TrendingUp, pos: "bottom-0 left-1/2 -translate-x-1/2 w-52" },
              ].map(({ value, label, Icon, pos }) => (
                <div
                  key={label}
                  className={`absolute ${pos} bg-[#111] border border-[#FFD700]/20 rounded-2xl p-5 shadow-[0_0_30px_rgba(255,215,0,0.08)] hover:shadow-[0_0_40px_rgba(255,215,0,0.15)] transition-all`}
                >
                  <Icon className="w-4 h-4 text-[#FFD700] mb-2" />
                  <p className="text-2xl font-extrabold text-[#FFD700]">{value}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESS ───────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#FFD700] text-xs font-semibold uppercase tracking-widest mb-3">How We Work</p>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">Our Process</h2>
            <p className="text-neutral-400 max-w-xl mx-auto">Simple, transparent, and built around you.</p>
          </div>

          {/* Desktop: horizontal with → arrows */}
          <div className="hidden lg:flex items-start gap-0">
            {steps.map((step, i) => (
              <div key={step.n} className="flex items-start flex-1">
                <div className="bg-[#111] border border-white/5 rounded-2xl p-7 flex-1 hover:border-[#FFD700]/25 transition-all hover:shadow-[0_0_30px_rgba(255,215,0,0.08)]">
                  <span className="text-3xl font-extrabold text-[#FFD700]/25 block mb-3">{step.n}</span>
                  <h3 className="text-base font-bold mb-2">{step.title}</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">{step.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex items-center px-2 pt-10 flex-shrink-0 text-[#FFD700]/40 text-2xl font-bold select-none">→</div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile: vertical with ↓ arrows */}
          <div className="lg:hidden flex flex-col items-center gap-0">
            {steps.map((step, i) => (
              <div key={step.n} className="flex flex-col items-center w-full max-w-md">
                <div className="bg-[#111] border border-white/5 rounded-2xl p-7 w-full hover:border-[#FFD700]/25 transition-all">
                  <span className="text-3xl font-extrabold text-[#FFD700]/25 block mb-3">{step.n}</span>
                  <h3 className="text-base font-bold mb-2">{step.title}</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">{step.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="py-1 text-[#FFD700]/40 text-2xl font-bold select-none">↓</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ───────────────────────────────────────────────── */}
      <section id="contact" className="py-24 px-4 bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-14 items-start">
            <div>
              <p className="text-[#FFD700] text-xs font-semibold uppercase tracking-widest mb-4">Get In Touch</p>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                Ready to build<br /><span className="text-[#FFD700]">something great?</span>
              </h2>
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
                    <div className="w-10 h-10 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-[#FFD700]" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 uppercase tracking-widest">{label}</p>
                      <p className="text-sm text-white font-medium">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#111] border border-white/5 rounded-2xl p-8">
              {formSent ? (
                <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                  <div className="w-14 h-14 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 flex items-center justify-center mb-4">
                    <Check className="w-7 h-7 text-[#FFD700]" />
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
                      className="w-full bg-[#0D0D0D] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#FFD700]/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-400 font-medium mb-1.5 uppercase tracking-widest">Email</label>
                    <input
                      type="email"
                      required
                      placeholder="you@company.com"
                      className="w-full bg-[#0D0D0D] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#FFD700]/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-400 font-medium mb-1.5 uppercase tracking-widest">Message</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Tell us about your project..."
                      className="w-full bg-[#0D0D0D] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#FFD700]/50 transition-colors resize-none"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-[#FFD700] text-[#0D0D0D] hover:bg-[#E6C200] font-bold py-4 h-auto text-base">
                    Send Message <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 bg-[#0a0a0a] py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <p className="font-bold text-[#FFD700]">SmartFlow Systems</p>
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
              <button key={label} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })} className="hover:text-[#FFD700] transition-colors">
                {label}
              </button>
            ))}
            <a href="/subscribe" className="hover:text-[#FFD700] transition-colors">Pricing</a>
          </div>
        </div>
      </footer>

      {/* ── MODAL ─────────────────────────────────────────────────── */}
      {activeModal && <ServiceModal service={activeModal} onClose={() => setActiveModal(null)} />}

      {/* ── ANIMATIONS ────────────────────────────────────────────── */}
      <style>{`
        .sfs-dot-grid {
          background-image: radial-gradient(circle, #FFD700 1px, transparent 1px);
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
  );
}
