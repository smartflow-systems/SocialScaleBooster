import { useState } from "react";
import { Link } from "wouter";
import { Bot, ArrowLeft, Send, Copy, Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GlassCard, GoldButton, GhostButton, GoldHeading, SfsContainer } from "@/components/sfs";

const PLATFORMS = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "twitter", label: "Twitter / X" },
  { value: "tiktok", label: "TikTok" },
  { value: "linkedin", label: "LinkedIn" },
];

const TONES = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "playful", label: "Playful" },
  { value: "luxury", label: "Luxury" },
];

const INDUSTRIES = [
  "E-commerce", "Beauty & Skincare", "Fashion", "Fitness & Health",
  "Technology", "Real Estate", "Food & Restaurant", "Travel",
  "Finance", "Education", "Entertainment", "Other"
];

export default function AIStudio() {
  const { toast } = useToast();
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [tone, setTone] = useState("friendly");
  const [industry, setIndustry] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokensUsed, setTokensUsed] = useState(0);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({ title: "Please enter a topic", variant: "destructive" });
      return;
    }
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/ai/simple/generate-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, platform, tone, industry: industry || undefined, targetAudience: targetAudience || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate");
      setResult(data.content);
      setTokensUsed(data.tokensUsed);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    toast({ title: "Copied to clipboard" });
  };

  const handleClear = () => {
    setResult("");
    setTokensUsed(0);
    setTopic("");
  };

  return (
    <div className="min-h-screen bg-[var(--sf-black)] text-white">
      <SfsContainer className="max-w-5xl mx-auto px-4 py-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-[var(--sf-gold)] hover:text-[var(--sf-gold-2)] transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-[var(--sf-gold)] to-[var(--sf-gold-2)] rounded-xl flex items-center justify-center shadow-[var(--sf-glow-gold-sm)]">
            <Bot className="w-6 h-6 text-[var(--sf-black)]" />
          </div>
          <div>
            <GoldHeading level={1} className="text-2xl font-bold">AI Studio</GoldHeading>
            <p className="text-neutral-400 text-sm">Generate platform-optimized social media posts with AI</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard className="p-6">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--sf-gold)]" />
              Post Generator
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-neutral-400 mb-1 block">Topic / Product</label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Describe what you want to post about... e.g. 'New summer collection launch with 20% discount'"
                  className="w-full bg-[var(--sf-black)] border border-[var(--sf-gold)]/20 rounded-lg px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:border-[var(--sf-gold)]/50 resize-none h-24"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-neutral-400 mb-1 block">Platform</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full bg-[var(--sf-black)] border border-[var(--sf-gold)]/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--sf-gold)]/50"
                  >
                    {PLATFORMS.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-neutral-400 mb-1 block">Tone</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full bg-[var(--sf-black)] border border-[var(--sf-gold)]/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--sf-gold)]/50"
                  >
                    {TONES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm text-neutral-400 mb-1 block">Industry (optional)</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-[var(--sf-black)] border border-[var(--sf-gold)]/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--sf-gold)]/50"
                >
                  <option value="">Select industry...</option>
                  {INDUSTRIES.map((i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-neutral-400 mb-1 block">Target Audience (optional)</label>
                <input
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g. Women 25-35 interested in skincare"
                  className="w-full bg-[var(--sf-black)] border border-[var(--sf-gold)]/20 rounded-lg px-4 py-2.5 text-white placeholder:text-neutral-500 focus:outline-none focus:border-[var(--sf-gold)]/50"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <GoldButton
                  onClick={handleGenerate}
                  disabled={loading || !topic.trim()}
                  className="w-full sm:flex-1 py-3 disabled:opacity-50"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</>
                  ) : (
                    <><Send className="w-4 h-4 mr-2" /> Generate Post</>
                  )}
                </GoldButton>
                {(result || topic) && (
                  <GhostButton
                    onClick={handleClear}
                    disabled={loading}
                    className="w-full sm:w-auto px-5 py-3"
                  >
                    Clear
                  </GhostButton>
                )}
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 min-h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold">Generated Content</h2>
              {result && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400">✓ Generated</span>
                  <GhostButton onClick={copyToClipboard} className="!py-1.5 !px-3 text-xs">
                    <Copy className="w-3.5 h-3.5 mr-1" /> Copy
                  </GhostButton>
                  <GhostButton onClick={handleGenerate} disabled={loading} className="!py-1.5 !px-3 text-xs">
                    Regenerate
                  </GhostButton>
                </div>
              )}
            </div>

            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 text-[var(--sf-gold)] animate-spin mx-auto mb-3" />
                  <p className="text-neutral-400 text-sm">AI is crafting your post...</p>
                </div>
              </div>
            ) : result ? (
              <div className="flex-1">
                <div className="bg-[var(--sf-black)] rounded-lg p-4 border border-[var(--sf-gold)]/10">
                  <p className="text-white whitespace-pre-wrap leading-relaxed">{result}</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Bot className="w-12 h-12 text-[var(--sf-gold)]/30 mx-auto mb-3" />
                  <p className="text-neutral-400 text-sm">Your generated post will appear here</p>
                  <p className="text-neutral-500 text-xs mt-1">Fill in the details and click Generate</p>
                </div>
              </div>
            )}
          </GlassCard>
        </div>
      </SfsContainer>
    </div>
  );
}
