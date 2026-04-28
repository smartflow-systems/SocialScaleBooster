import { useState, useEffect } from "react";
import { Link, useLocation, useSearch } from "wouter";
import {
  FileText, ArrowLeft, Send, Copy, Loader2, Sparkles,
  BookmarkPlus, Trash2, ChevronDown, ChevronUp, CalendarClock, Pencil, X,
} from "lucide-react";
import { ToastAction } from "@/components/ui/toast";
import { GlassCard, GoldButton, GhostButton, GoldHeading, SfsContainer } from "@/components/sfs";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Draft } from "@shared/schema";

const PLATFORMS = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "twitter", label: "Twitter / X" },
  { value: "tiktok", label: "TikTok" },
  { value: "linkedin", label: "LinkedIn" },
];

const PLATFORM_CHAR_LIMITS: Record<string, number> = {
  twitter: 280,
  instagram: 2200,
  tiktok: 2200,
  linkedin: 3000,
  facebook: 63206,
};

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

export default function CreatePost() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const search = useSearch();
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [tone, setTone] = useState("friendly");
  const [industry, setIndustry] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokensUsed, setTokensUsed] = useState(0);
  const [showDrafts, setShowDrafts] = useState(false);
  const [editingDraftId, setEditingDraftId] = useState<number | null>(null);
  const [autoLoadedDraftId, setAutoLoadedDraftId] = useState<number | null>(null);
  const [renamingDraftId, setRenamingDraftId] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState("");

  // Schedule modal state
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduling, setScheduling] = useState(false);
  const [scheduleContent, setScheduleContent] = useState("");

  const { data: drafts = [], isLoading: draftsLoading } = useQuery<Draft[]>({
    queryKey: ["/api/drafts"],
  });

  useEffect(() => {
    if (editingDraftId !== null && !draftsLoading && !drafts.some((d) => d.id === editingDraftId)) {
      setEditingDraftId(null);
      sessionStorage.removeItem("editingDraftId");
    }
  }, [drafts, draftsLoading, editingDraftId]);

  // Restore editing draft from sessionStorage on page load
  useEffect(() => {
    if (draftsLoading) return;
    const storedId = sessionStorage.getItem("editingDraftId");
    if (!storedId) return;
    const id = parseInt(storedId, 10);
    if (isNaN(id)) {
      sessionStorage.removeItem("editingDraftId");
      return;
    }
    if (id === editingDraftId) return;
    // URL-based navigation (?draftId=) takes precedence — clear stale session key
    const params = new URLSearchParams(search);
    if (params.get("draftId")) {
      sessionStorage.removeItem("editingDraftId");
      return;
    }
    const draft = drafts.find((d) => d.id === id);
    if (!draft) {
      // Draft no longer exists (including when list is empty) — clear stale reference
      sessionStorage.removeItem("editingDraftId");
      return;
    }
    setResult(draft.content);
    setPlatform(draft.platform);
    setTone(draft.tone);
    setTopic(draft.topic);
    setEditingDraftId(draft.id);
    toast({ title: "Resumed editing draft" });
  }, [drafts, draftsLoading, search]);

  // Auto-load a draft when navigated from /drafts page with ?draftId=
  useEffect(() => {
    if (draftsLoading || drafts.length === 0) return;
    const params = new URLSearchParams(search);
    const draftId = params.get("draftId");
    if (!draftId) return;
    const id = parseInt(draftId, 10);
    if (isNaN(id) || id === autoLoadedDraftId) return;
    const draft = drafts.find((d) => d.id === id);
    if (!draft) return;
    setResult(draft.content);
    setPlatform(draft.platform);
    setTone(draft.tone);
    setTopic(draft.topic);
    setAutoLoadedDraftId(id);
    toast({ title: "Draft loaded" });
  }, [drafts, draftsLoading, search]);

  const saveDraftMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/drafts", {
        topic,
        content: result,
        platform,
        tone,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/drafts"] });
      toast({ title: "Saved to drafts!" });
    },
    onError: (err: any) => {
      toast({ title: "Failed to save draft", description: err.message, variant: "destructive" });
    },
  });

  const deleteDraftMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/drafts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/drafts"] });
      toast({ title: "Draft deleted" });
    },
  });

  const updateDraftMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("PUT", `/api/drafts/${id}`, {
        topic,
        content: result,
        platform,
        tone,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/drafts"] });
      setEditingDraftId(null);
      sessionStorage.removeItem("editingDraftId");
      toast({ title: "Draft updated!" });
    },
    onError: (err: any) => {
      toast({ title: "Failed to update draft", description: err.message, variant: "destructive" });
    },
  });

  const renameDraftMutation = useMutation({
    mutationFn: async ({ id, topic }: { id: number; topic: string }) => {
      const res = await apiRequest("PUT", `/api/drafts/${id}`, { topic });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/drafts"] });
      setRenamingDraftId(null);
      setRenameValue("");
      toast({ title: "Draft renamed" });
    },
    onError: (err: any) => {
      toast({ title: "Failed to rename draft", description: err.message, variant: "destructive" });
    },
  });

  const handleRename = (draft: Draft) => {
    setRenamingDraftId(draft.id);
    setRenameValue(draft.topic);
  };

  const commitRename = (id: number) => {
    const trimmed = renameValue.trim();
    if (!trimmed) return;
    renameDraftMutation.mutate({ id, topic: trimmed });
  };

  const cancelRename = () => {
    setRenamingDraftId(null);
    setRenameValue("");
  };

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
        body: JSON.stringify({
          topic,
          platform,
          tone,
          industry: industry || undefined,
          targetAudience: targetAudience || undefined,
        }),
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
    toast({ title: "Copied to clipboard!" });
  };

  const loadDraft = (draft: Draft) => {
    setResult(draft.content);
    setPlatform(draft.platform);
    setTone(draft.tone);
    setTopic(draft.topic);
    setShowDrafts(false);
    setEditingDraftId(null);
    sessionStorage.removeItem("editingDraftId");
    toast({ title: "Draft loaded" });
  };

  const editDraft = (draft: Draft) => {
    setResult(draft.content);
    setPlatform(draft.platform);
    setTone(draft.tone);
    setTopic(draft.topic);
    setEditingDraftId(draft.id);
    sessionStorage.setItem("editingDraftId", String(draft.id));
    setShowDrafts(false);
    toast({ title: "Editing draft — modify fields then click \"Update Draft\"" });
  };

  const cancelEditDraft = () => {
    setEditingDraftId(null);
    sessionStorage.removeItem("editingDraftId");
  };

  const handleSchedule = async () => {
    if (!scheduleDate) {
      toast({ title: "Please pick a date and time", variant: "destructive" });
      return;
    }
    const scheduledAt = new Date(scheduleDate);
    if (scheduledAt <= new Date()) {
      toast({ title: "Please pick a future date and time", variant: "destructive" });
      return;
    }
    setScheduling(true);
    try {
      const res = await apiRequest("POST", "/api/scheduled-posts", {
        platform,
        content: scheduleContent,
        scheduledAt: scheduledAt.toISOString(),
        status: "scheduled",
      });
      const newPost = await res.json();
      const newPostId: number | undefined = newPost?.id;
      queryClient.invalidateQueries({ queryKey: ["/api/scheduled-posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/scheduled-posts/count"] });
      setShowSchedule(false);
      setScheduleDate("");
      toast({
        title: "Post scheduled!",
        description: `Scheduled for ${scheduledAt.toLocaleString()}.`,
        action: (
          <div className="flex gap-2">
            <ToastAction
              altText="Undo"
              onClick={async () => {
                try {
                  await apiRequest("DELETE", `/api/scheduled-posts/${newPostId}`);
                  queryClient.invalidateQueries({ queryKey: ["/api/scheduled-posts"] });
                  queryClient.invalidateQueries({ queryKey: ["/api/scheduled-posts/count"] });
                  toast({ title: "Post cancelled", description: "The scheduled post has been removed." });
                } catch (err: any) {
                  toast({ title: "Failed to undo", description: err.message, variant: "destructive" });
                }
              }}
            >
              Undo
            </ToastAction>
            <ToastAction altText="View Schedule" onClick={() => navigate(newPostId ? `/scheduler?highlight=${newPostId}` : "/scheduler")}>
              View Schedule
            </ToastAction>
          </div>
        ),
      });
    } catch (err: any) {
      toast({ title: "Failed to schedule", description: err.message, variant: "destructive" });
    } finally {
      setScheduling(false);
    }
  };

  const platformLabel = PLATFORMS.find((p) => p.value === platform)?.label ?? platform;

  const minDateTime = new Date(Date.now() + 5 * 60 * 1000).toISOString().slice(0, 16);

  return (
    <div className="min-h-screen bg-[var(--sf-black)] text-white">
      <SfsContainer className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-[var(--sf-gold)] hover:text-[var(--sf-gold-2)] transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[var(--sf-gold)] to-[var(--sf-gold-2)] rounded-xl flex items-center justify-center shadow-[var(--sf-glow-gold-sm)]">
              <FileText className="w-6 h-6 text-[var(--sf-black)]" />
            </div>
            <div>
              <GoldHeading level={1} className="text-2xl font-bold">Create Post</GoldHeading>
              <p className="text-neutral-400 text-sm">AI-powered post builder — ready to copy and publish</p>
            </div>
          </div>

          {draftsLoading ? (
            <div className="flex items-center gap-2 text-sm text-neutral-400 border border-[var(--sf-gold)]/20 rounded-lg px-3 py-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading drafts...
            </div>
          ) : drafts.length > 0 ? (
            <button
              onClick={() => setShowDrafts((v) => !v)}
              className="flex items-center gap-2 text-sm text-[var(--sf-gold)] hover:text-[var(--sf-gold-2)] transition-colors border border-[var(--sf-gold)]/30 rounded-lg px-3 py-2"
            >
              <BookmarkPlus className="w-4 h-4" />
              Drafts ({drafts.length})
              {showDrafts ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          ) : null}
        </div>

        {showDrafts && drafts.length > 0 && (
          <GlassCard className="mb-6 p-4 space-y-3">
            <h3 className="text-white font-semibold text-sm mb-3">Saved Drafts</h3>
            {drafts.map((draft) => (
              <div key={draft.id} className="flex items-start gap-3 bg-[var(--sf-black)] rounded-lg p-3 border border-[var(--sf-gold)]/10">
                <div className="flex-1 min-w-0">
                  {renamingDraftId === draft.id ? (
                    <div className="flex items-center gap-1 mb-1">
                      <input
                        autoFocus
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") commitRename(draft.id);
                          if (e.key === "Escape") cancelRename();
                        }}
                        className="flex-1 bg-white/5 border border-[var(--sf-gold)]/40 rounded px-2 py-0.5 text-white text-sm focus:outline-none focus:border-[var(--sf-gold)]/70"
                      />
                      <button
                        onClick={() => commitRename(draft.id)}
                        disabled={renameDraftMutation.isPending || !renameValue.trim()}
                        className="text-xs text-[var(--sf-gold)] hover:text-[var(--sf-gold-2)] disabled:opacity-50 transition-colors"
                        title="Save"
                      >
                        {renameDraftMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span className="font-medium">Save</span>}
                      </button>
                      <button
                        onClick={cancelRename}
                        className="text-neutral-400 hover:text-white transition-colors"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 group">
                      <p className="text-white text-sm font-medium truncate">{draft.topic}</p>
                      <button
                        onClick={() => handleRename(draft)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-neutral-400 hover:text-[var(--sf-gold)] ml-1 shrink-0"
                        title="Rename draft"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <p className="text-neutral-400 text-xs mt-0.5">
                    {draft.platform} · {draft.tone} · {new Date(draft.createdAt!).toLocaleDateString()}
                  </p>
                  <p className="text-neutral-400/70 text-xs mt-1 line-clamp-2">{draft.content}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => editDraft(draft)}
                    className="text-xs text-[var(--sf-gold)] hover:text-[var(--sf-gold-2)] transition-colors border border-[var(--sf-gold)]/30 rounded px-2 py-1"
                  >
                    <Pencil className="w-3 h-3 inline mr-0.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => loadDraft(draft)}
                    className="text-xs text-neutral-400 hover:text-white transition-colors border border-white/10 rounded px-2 py-1"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => deleteDraftMutation.mutate(draft.id)}
                    disabled={deleteDraftMutation.isPending}
                    className="text-neutral-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </GlassCard>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard className="p-6">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--sf-gold)]" />
              Post Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-neutral-400 mb-1 block">Topic / Product *</label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Describe what you want to post about… e.g. 'New summer collection launch with 20% discount'"
                  className="w-full bg-[var(--sf-black)] border border-[var(--sf-gold)]/20 rounded-lg px-4 py-3 text-white placeholder:text-neutral-400/50 focus:outline-none focus:border-[var(--sf-gold)]/50 resize-none h-24"
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
                  <option value="">Select industry…</option>
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
                  placeholder="e.g. Women 25–35 interested in skincare"
                  className="w-full bg-[var(--sf-black)] border border-[var(--sf-gold)]/20 rounded-lg px-4 py-2.5 text-white placeholder:text-neutral-400/50 focus:outline-none focus:border-[var(--sf-gold)]/50"
                />
              </div>

              <GoldButton
                onClick={handleGenerate}
                disabled={loading || !topic.trim()}
                className="w-full py-3 inline-flex items-center justify-center disabled:opacity-50"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating…</>
                ) : (
                  <><Send className="w-4 h-4 mr-2" /> Generate Post</>
                )}
              </GoldButton>
            </div>
          </GlassCard>

          <GlassCard className="p-6 flex flex-col min-h-[420px]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-white font-semibold">Generated Post</h2>
                {editingDraftId && (
                  <span className="text-xs bg-[var(--sf-gold)]/20 text-[var(--sf-gold)] border border-[var(--sf-gold)]/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Pencil className="w-3 h-3" />
                    Editing draft
                  </span>
                )}
              </div>
              {result && !editingDraftId && (
                <span className="text-xs text-neutral-400 bg-[var(--sf-black)] px-2 py-1 rounded border border-[var(--sf-gold)]/10">
                  {platformLabel} · {tokensUsed} tokens
                </span>
              )}
            </div>

            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 text-[var(--sf-gold)] animate-spin mx-auto mb-3" />
                  <p className="text-neutral-400 text-sm">AI is crafting your post…</p>
                </div>
              </div>
            ) : result ? (
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex-1 bg-[var(--sf-black)] rounded-lg p-4 border border-[var(--sf-gold)]/10">
                  <p className="text-white whitespace-pre-wrap leading-relaxed text-sm">{result}</p>
                </div>
                <div className="flex gap-2">
                  <GoldButton
                    onClick={copyToClipboard}
                    className="flex-1 inline-flex items-center justify-center text-xs px-3"
                  >
                    <Copy className="w-3.5 h-3.5 mr-1.5" />
                    Copy Post
                  </GoldButton>
                  {editingDraftId ? (
                    <>
                      <GhostButton
                        onClick={() => updateDraftMutation.mutate(editingDraftId)}
                        disabled={updateDraftMutation.isPending}
                        className="flex-1 inline-flex items-center justify-center text-xs px-3"
                      >
                        {updateDraftMutation.isPending ? (
                          <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                        ) : (
                          <Pencil className="w-3.5 h-3.5 mr-1.5" />
                        )}
                        Update Draft
                      </GhostButton>
                      <GhostButton
                        onClick={cancelEditDraft}
                        className="inline-flex items-center justify-center text-xs px-3"
                      >
                        <X className="w-3.5 h-3.5" />
                      </GhostButton>
                    </>
                  ) : (
                    <>
                      <GhostButton
                        onClick={() => saveDraftMutation.mutate()}
                        disabled={saveDraftMutation.isPending}
                        className="flex-1 inline-flex items-center justify-center text-xs px-3"
                      >
                        {saveDraftMutation.isPending ? (
                          <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                        ) : (
                          <BookmarkPlus className="w-3.5 h-3.5 mr-1.5" />
                        )}
                        Save Draft
                      </GhostButton>
                      <GoldButton
                        onClick={() => { setScheduleContent(result); setShowSchedule(true); }}
                        className="flex-1 inline-flex items-center justify-center text-xs px-3"
                      >
                        <CalendarClock className="w-3.5 h-3.5 mr-1.5" />
                        Schedule Post
                      </GoldButton>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <FileText className="w-12 h-12 text-[var(--sf-gold)]/30 mx-auto mb-3" />
                  <p className="text-neutral-400 text-sm">Your generated post will appear here</p>
                  <p className="text-neutral-400/60 text-xs mt-1">Fill in the details on the left and click Generate</p>
                </div>
              </div>
            )}
          </GlassCard>
        </div>
      </SfsContainer>

      {/* Schedule modal */}
      {showSchedule && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <GlassCard className="p-6 w-full max-w-sm shadow-2xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-[var(--sf-gold)]/10 border border-[var(--sf-gold)]/30 flex items-center justify-center">
                <CalendarClock className="w-4 h-4 text-[var(--sf-gold)]" />
              </div>
              <div>
                <h2 className="text-white font-semibold">Schedule Post</h2>
                <p className="text-xs text-neutral-400">{platformLabel}</p>
              </div>
            </div>

            <div className="mb-5">
              <label className="text-sm text-neutral-400 mb-2 block">Date &amp; Time</label>
              <input
                type="datetime-local"
                value={scheduleDate}
                min={minDateTime}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="w-full bg-[var(--sf-black)] border border-[var(--sf-gold)]/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--sf-gold)]/50 [color-scheme:dark]"
              />
            </div>

            <div className="mb-5">
              <label className="text-sm text-neutral-400 mb-2 block">Post Content</label>
              <textarea
                value={scheduleContent}
                onChange={(e) => setScheduleContent(e.target.value)}
                rows={5}
                className={`w-full bg-[var(--sf-black)] border rounded-lg px-3 py-2.5 text-white text-xs leading-relaxed resize-none focus:outline-none placeholder:text-neutral-400/40 ${scheduleContent.length > (PLATFORM_CHAR_LIMITS[platform] ?? 3000) ? "border-red-500/60 focus:border-red-500" : "border-[var(--sf-gold)]/20 focus:border-[var(--sf-gold)]/50"}`}
                placeholder="Edit your post content here…"
              />
              <div className="flex justify-end mt-1">
                <span className={`text-xs ${scheduleContent.length > (PLATFORM_CHAR_LIMITS[platform] ?? 3000) ? "text-red-400" : "text-neutral-400/60"}`}>
                  {scheduleContent.length} / {PLATFORM_CHAR_LIMITS[platform] ?? 3000}
                </span>
              </div>
              {scheduleContent.length > (PLATFORM_CHAR_LIMITS[platform] ?? 3000) && (
                <p className="text-xs text-red-400 mt-2 flex items-center gap-1.5">
                  <span className="inline-block w-3.5 h-3.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-[10px] font-bold flex items-center justify-center leading-none">!</span>
                  Content is {scheduleContent.length - (PLATFORM_CHAR_LIMITS[platform] ?? 3000)} character{scheduleContent.length - (PLATFORM_CHAR_LIMITS[platform] ?? 3000) === 1 ? "" : "s"} over the {platformLabel} limit. Trim it before scheduling.
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <GhostButton
                onClick={() => { setResult(scheduleContent); setShowSchedule(false); setScheduleDate(""); }}
                className="flex-1"
              >
                Cancel
              </GhostButton>
              <GoldButton
                onClick={handleSchedule}
                disabled={scheduling || !scheduleDate || scheduleContent.length > (PLATFORM_CHAR_LIMITS[platform] ?? 3000)}
                className="flex-1 inline-flex items-center justify-center disabled:opacity-50"
              >
                {scheduling ? <Loader2 className="w-4 h-4 animate-spin" /> : "Schedule"}
              </GoldButton>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
