import { useState } from "react";
import { Link } from "wouter";
import { MessageSquare, ArrowLeft, Send, Copy, Loader2, Sparkles } from "lucide-react";
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

export default function Captions() {
  const { toast } = useToast();
  const [description, setDescription] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [tone, setTone] = useState("friendly");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokensUsed, setTokensUsed] = useState(0);

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast({ title: "Please describe your content", variant: "destructive" });
      return;
    }
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/ai/simple/generate-caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, platform, tone }),
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

  return (
    <div className="min-h-screen bg-[var(--sf-black)] text-white">
      <SfsContainer className="max-w-5xl mx-auto px-4 py-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-[var(--sf-gold)] hover:text-[var(--sf-gold-2)] transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-[var(--sf-gold)] to-[var(--sf-gold-2)] rounded-xl flex items-center justify-center shadow-[var(--sf-glow-gold-sm)]">
            <MessageSquare className="w-6 h-6 text-[var(--sf-black)]" />
          </div>
          <div>
            <GoldHeading level={1} className="text-2xl font-bold">Caption Generator</GoldHeading>
            <p className="text-neutral-400 text-sm">Create engaging captions powered by AI</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard className="p-6">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--sf-gold)]" />
              Describe Your Content
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-neutral-400 mb-1 block">What is this caption for?</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your photo, video, or product... e.g. 'A flat-lay photo of our new organic skincare line with roses and candles'"
                  className="w-full bg-[var(--sf-black)] border border-[var(--sf-gold)]/20 rounded-lg px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:border-[var(--sf-gold)]/50 resize-none h-32"
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

              <GoldButton
                onClick={handleGenerate}
                disabled={loading || !description.trim()}
                className="w-full py-3 disabled:opacity-50"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</>
                ) : (
                  <><Send className="w-4 h-4 mr-2" /> Generate Caption</>
                )}
              </GoldButton>
            </div>
          </GlassCard>

          <GlassCard className="p-6 min-h-[350px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold">Your Caption</h2>
              {result && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400">✓ Generated</span>
                  <GhostButton onClick={handleGenerate} disabled={loading} className="!py-1.5 !px-3 text-xs">↻ Redo</GhostButton>
                  <GhostButton onClick={copyToClipboard} className="!py-1.5 !px-3 text-xs">
                    <Copy className="w-3.5 h-3.5 mr-1" /> Copy
                  </GhostButton>
                </div>
              )}
            </div>

            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 text-[var(--sf-gold)] animate-spin mx-auto mb-3" />
                  <p className="text-neutral-400 text-sm">Crafting your perfect caption...</p>
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
                  <MessageSquare className="w-12 h-12 text-[var(--sf-gold)]/30 mx-auto mb-3" />
                  <p className="text-neutral-400 text-sm">Your caption will appear here</p>
                  <p className="text-neutral-500 text-xs mt-1">Describe your content and click Generate</p>
                </div>
              </div>
            )}
          </GlassCard>
        </div>
      </SfsContainer>
    </div>
  );
}
