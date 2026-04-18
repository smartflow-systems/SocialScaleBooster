import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Share2, ArrowLeft, Bot, Sparkles, Crown, Star, Search, Zap, X } from "lucide-react";
import { GlassCard, GoldButton, GoldHeading, SfsContainer, FadeInUp, type FadeStagger } from "@/components/sfs";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { BotTemplate } from "@shared/schema";

const PLATFORM_LABELS: Record<string, string> = {
  tiktok: "TikTok",
  instagram: "Instagram",
  facebook: "Facebook",
  twitter: "Twitter",
  youtube: "YouTube",
  multi: "Multi-Platform",
};

function TemplateCard({
  template,
  index,
  onUse,
}: {
  template: BotTemplate;
  index: number;
  onUse: (t: BotTemplate) => void;
}) {
  const stagger = (Math.min(index + 1, 6) as FadeStagger);

  return (
    <FadeInUp stagger={stagger}>
      <GlassCard className="p-5 h-full flex flex-col group hover:border-[var(--sf-gold)]/60 transition-colors">
        <div className="flex items-start justify-between mb-3">
          <div className="flex gap-2 flex-wrap">
            {template.category && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--sf-gold)]/10 text-[var(--sf-gold)] border border-[var(--sf-gold)]/20">
                {template.category}
              </span>
            )}
            {template.platform && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/5 text-neutral-300 border border-white/10">
                {PLATFORM_LABELS[template.platform] ?? template.platform}
              </span>
            )}
          </div>
          {template.isPremium && (
            <Crown className="w-4 h-4 text-[var(--sf-gold)] shrink-0 ml-2" />
          )}
        </div>

        <h3 className="text-base font-semibold text-white mb-1">{template.name}</h3>
        <p className="text-sm text-neutral-400 flex-1 mb-4 line-clamp-3">
          {template.description}
        </p>

        {template.config && typeof template.config === "object" && Object.keys(template.config).length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {Object.keys(template.config as object).slice(0, 3).map((key) => (
              <span
                key={key}
                className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--sf-gold)]/10 text-[var(--sf-gold)]/80 border border-[var(--sf-gold)]/15"
              >
                {key.replace(/([A-Z])/g, " $1").trim()}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mb-4 text-xs">
          <span className="text-[var(--sf-gold)] font-semibold">
            {template.isPremium && template.price ? `£${template.price}` : "Free"}
          </span>
          {template.rating && parseFloat(template.rating) > 0 && (
            <span className="inline-flex items-center gap-1 text-neutral-400">
              <Star className="w-3.5 h-3.5 fill-[var(--sf-gold)] text-[var(--sf-gold)]" />
              {parseFloat(template.rating).toFixed(1)}
              {template.reviewCount ? ` (${template.reviewCount})` : ""}
            </span>
          )}
        </div>

        <GoldButton
          onClick={() => onUse(template)}
          className="w-full inline-flex items-center justify-center gap-2"
        >
          <Zap className="w-4 h-4" />
          Use Template
        </GoldButton>
      </GlassCard>
    </FadeInUp>
  );
}

function UseTemplateModal({
  template,
  onClose,
}: {
  template: BotTemplate;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  const [name, setName] = useState(template.name);

  const createBot = useMutation({
    mutationFn: async () =>
      apiRequest("POST", "/api/bots", {
        name: name.trim() || template.name,
        description: template.description ?? "",
        platform: template.platform,
        config: template.config ?? {},
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bots"] });
      toast({
        title: "Bot created",
        description: `Your new bot "${name || template.name}" has been set up from this template.`,
      });
      onClose();
      navigate("/dashboard");
    },
    onError: (err: unknown) => {
      toast({
        title: "Failed to create bot",
        description: err instanceof Error ? err.message : "Something went wrong.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <GlassCard className="w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[var(--sf-gold)]/15 border border-[var(--sf-gold)]/30 flex items-center justify-center">
            <Bot className="w-5 h-5 text-[var(--sf-gold)]" />
          </div>
          <div>
            <GoldHeading level={2} className="text-lg font-semibold">
              Use Template
            </GoldHeading>
            <p className="text-xs text-neutral-400">{template.name}</p>
          </div>
        </div>

        <p className="text-sm text-neutral-400 mb-5">{template.description}</p>

        <div className="mb-5">
          <label className="block text-sm font-medium text-neutral-300 mb-1.5">
            Bot name
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter a name for your bot"
            className="bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus:border-[var(--sf-gold)]/50"
          />
        </div>

        <div className="flex gap-2 flex-wrap text-xs text-neutral-400 mb-5">
          {template.platform && (
            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
              {PLATFORM_LABELS[template.platform] ?? template.platform}
            </span>
          )}
          {template.category && (
            <span className="px-2 py-0.5 rounded-full bg-[var(--sf-gold)]/10 border border-[var(--sf-gold)]/20 text-[var(--sf-gold)]">
              {template.category}
            </span>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border border-white/10 text-neutral-400 hover:text-white hover:border-white/20 transition-colors text-sm"
          >
            Cancel
          </button>
          <GoldButton
            onClick={() => createBot.mutate()}
            disabled={createBot.isPending}
            className="flex-1 inline-flex items-center justify-center gap-2"
          >
            {createBot.isPending ? (
              "Creating..."
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Create Bot
              </>
            )}
          </GoldButton>
        </div>
      </GlassCard>
    </div>
  );
}

export default function Marketplace() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [platform, setPlatform] = useState("all");
  const [premiumOnly, setPremiumOnly] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<BotTemplate | null>(null);

  const { data: templates = [], isLoading } = useQuery<BotTemplate[]>({
    queryKey: ["/api/templates"],
  });

  const { data: userStatus } = useQuery<{ isPremium?: boolean }>({
    queryKey: ["/api/user/status"],
  });

  const handleUseTemplate = (t: BotTemplate) => {
    if (t.isPremium && !userStatus?.isPremium) {
      toast({
        title: "Premium template",
        description: "Upgrade to SmartFlow Pro to unlock premium bot templates.",
        variant: "destructive",
      });
      return;
    }
    setSelectedTemplate(t);
  };

  const categories = ["all", ...Array.from(new Set(templates.map((t) => t.category).filter(Boolean)))];
  const platforms = ["all", ...Array.from(new Set(templates.map((t) => t.platform).filter(Boolean)))];

  const filtered = templates.filter((t) => {
    const matchSearch =
      !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      (t.description ?? "").toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "all" || t.category === category;
    const matchPlatform = platform === "all" || t.platform === platform;
    const matchPremium = !premiumOnly || t.isPremium;
    return matchSearch && matchCategory && matchPlatform && matchPremium;
  });

  return (
    <div className="min-h-screen bg-[var(--sf-black)] text-white">
      <SfsContainer className="max-w-6xl mx-auto px-4 py-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-[var(--sf-gold)] hover:text-[var(--sf-gold-2)] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-[var(--sf-gold)] to-[var(--sf-gold-2)] rounded-xl flex items-center justify-center shadow-[var(--sf-glow-gold-sm)]">
            <Share2 className="w-6 h-6 text-[var(--sf-black)]" />
          </div>
          <div>
            <GoldHeading level={1} className="text-2xl font-bold">
              Marketplace
            </GoldHeading>
            <p className="text-neutral-400 text-sm">
              Browse bot templates and apply them instantly
            </p>
          </div>
        </div>

        {/* Filters */}
        <GlassCard className="p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search templates..."
                className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus:border-[var(--sf-gold)]/50"
              />
            </div>

            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c === "all" ? "All Categories" : c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                {platforms.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p === "all" ? "All Platforms" : (PLATFORM_LABELS[p] ?? p)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <button
              onClick={() => setPremiumOnly((v) => !v)}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                premiumOnly
                  ? "bg-[var(--sf-gold)] text-[var(--sf-black)] border-[var(--sf-gold)]"
                  : "bg-white/5 text-neutral-300 border-white/10 hover:border-[var(--sf-gold)]/40 hover:text-[var(--sf-gold)]"
              }`}
            >
              <Crown className="w-4 h-4" />
              Premium Only
            </button>
          </div>
        </GlassCard>

        {/* Stats */}
        {templates.length > 0 && (
          <div className="flex flex-wrap gap-4 mb-6 text-sm text-neutral-400">
            <span>
              <span className="text-[var(--sf-gold)] font-semibold">{templates.length}</span> total templates
            </span>
            <span>
              <span className="text-[var(--sf-gold)] font-semibold">
                {templates.filter((t) => t.isPremium).length}
              </span>{" "}
              premium
            </span>
            {filtered.length !== templates.length && (
              <span>
                <span className="text-white font-semibold">{filtered.length}</span> matching filters
              </span>
            )}
          </div>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <GlassCard key={i} className="p-5 h-48 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <Bot className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-400">
              {templates.length === 0
                ? "No templates available yet. Check back soon."
                : "No templates match your filters."}
            </p>
            {templates.length > 0 && (
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("all");
                  setPlatform("all");
                  setPremiumOnly(false);
                }}
                className="mt-4 text-sm text-[var(--sf-gold)] hover:underline"
              >
                Clear filters
              </button>
            )}
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((t, i) => (
              <TemplateCard key={t.id} template={t} index={i} onUse={handleUseTemplate} />
            ))}
          </div>
        )}
      </SfsContainer>

      {selectedTemplate && (
        <UseTemplateModal
          template={selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
        />
      )}
    </div>
  );
}
