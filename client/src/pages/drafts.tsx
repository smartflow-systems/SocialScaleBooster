import { useState } from "react";
import { useLocation } from "wouter";
import {
  BookmarkPlus, Trash2, Loader2, FileText, ArrowUpRight, Pencil,
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Draft } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PLATFORM_LABELS: Record<string, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  twitter: "Twitter / X",
  tiktok: "TikTok",
  linkedin: "LinkedIn",
};

const TONE_LABELS: Record<string, string> = {
  professional: "Professional",
  friendly: "Friendly",
  playful: "Playful",
  luxury: "Luxury",
};

interface EditForm {
  topic: string;
  platform: string;
  tone: string;
  content: string;
}

export default function DraftsPage() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [editingDraft, setEditingDraft] = useState<Draft | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({ topic: "", platform: "", tone: "", content: "" });

  const { data: drafts = [], isLoading } = useQuery<Draft[]>({
    queryKey: ["/api/drafts"],
  });

  const deleteDraftMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/drafts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/drafts"] });
      toast({ title: "Draft deleted" });
    },
    onError: (err: any) => {
      toast({ title: "Failed to delete draft", description: err.message, variant: "destructive" });
    },
  });

  const updateDraftMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: EditForm }) => {
      return await apiRequest("PUT", `/api/drafts/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/drafts"] });
      setEditingDraft(null);
      toast({ title: "Draft saved" });
    },
    onError: (err: any) => {
      toast({ title: "Failed to save draft", description: err.message, variant: "destructive" });
    },
  });

  const handleLoad = (draft: Draft) => {
    navigate(`/create?draftId=${draft.id}`);
  };

  const openEdit = (draft: Draft) => {
    setEditForm({
      topic: draft.topic,
      platform: draft.platform,
      tone: draft.tone,
      content: draft.content,
    });
    setEditingDraft(draft);
  };

  const handleSave = () => {
    if (!editingDraft) return;
    if (!editForm.topic.trim() || !editForm.content.trim()) {
      toast({ title: "Topic and content are required", variant: "destructive" });
      return;
    }
    updateDraftMutation.mutate({ id: editingDraft.id, data: editForm });
  };

  return (
    <div className="min-h-screen bg-primary-black">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-accent-gold to-gold-trim rounded-xl flex items-center justify-center shadow-lg shadow-accent-gold/20">
            <BookmarkPlus className="w-6 h-6 text-primary-black" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Drafts</h1>
            <p className="text-neutral-gray text-sm">Your saved post drafts — edit inline or load into the editor to continue</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-accent-gold animate-spin" />
          </div>
        ) : drafts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <FileText className="w-16 h-16 text-accent-gold/20 mb-4" />
            <p className="text-white font-semibold text-lg mb-1">No drafts yet</p>
            <p className="text-neutral-gray text-sm max-w-xs">
              Generate a post on the Create Post page and hit "Save Draft" to store it here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="border border-accent-gold/20 rounded-xl p-5 bg-rich-brown/10 flex flex-col gap-3 hover:border-accent-gold/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-white font-semibold text-sm leading-snug line-clamp-2 flex-1">
                    {draft.topic}
                  </p>
                  <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
                    <button
                      onClick={() => openEdit(draft)}
                      className="text-neutral-gray hover:text-accent-gold transition-colors"
                      title="Edit draft"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteDraftMutation.mutate(draft.id)}
                      disabled={deleteDraftMutation.isPending}
                      className="text-neutral-gray hover:text-red-400 transition-colors"
                      title="Delete draft"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-medium bg-accent-gold/10 text-accent-gold border border-accent-gold/20 rounded px-2 py-0.5">
                    {PLATFORM_LABELS[draft.platform] ?? draft.platform}
                  </span>
                  <span className="text-[10px] font-medium bg-white/5 text-neutral-gray border border-white/10 rounded px-2 py-0.5">
                    {TONE_LABELS[draft.tone] ?? draft.tone}
                  </span>
                </div>

                <p className="text-neutral-gray/70 text-xs leading-relaxed line-clamp-4 flex-1">
                  {draft.content}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-accent-gold/10">
                  <span className="text-[10px] text-neutral-gray/50">
                    {new Date(draft.createdAt!).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <button
                    onClick={() => handleLoad(draft)}
                    className="flex items-center gap-1 text-xs text-accent-gold hover:text-gold-trim transition-colors font-medium"
                  >
                    Load draft
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!editingDraft} onOpenChange={(open) => { if (!open) setEditingDraft(null); }}>
        <DialogContent className="bg-[#1a1410] border border-accent-gold/20 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white text-lg font-semibold">Edit Draft</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label className="text-neutral-gray text-sm">Topic</Label>
              <Input
                value={editForm.topic}
                onChange={(e) => setEditForm((f) => ({ ...f, topic: e.target.value }))}
                placeholder="Post topic or title"
                disabled={updateDraftMutation.isPending}
                className="bg-white/5 border-white/10 text-white placeholder:text-neutral-gray/50 focus-visible:ring-accent-gold/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-neutral-gray text-sm">Platform</Label>
                <Select value={editForm.platform} onValueChange={(v) => setEditForm((f) => ({ ...f, platform: v }))} disabled={updateDraftMutation.isPending}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white focus:ring-accent-gold/50">
                    <SelectValue placeholder="Platform" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1410] border-white/10 text-white">
                    {Object.entries(PLATFORM_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value} className="focus:bg-accent-gold/10 focus:text-white">{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-neutral-gray text-sm">Tone</Label>
                <Select value={editForm.tone} onValueChange={(v) => setEditForm((f) => ({ ...f, tone: v }))} disabled={updateDraftMutation.isPending}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white focus:ring-accent-gold/50">
                    <SelectValue placeholder="Tone" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1410] border-white/10 text-white">
                    {Object.entries(TONE_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value} className="focus:bg-accent-gold/10 focus:text-white">{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-neutral-gray text-sm">Content</Label>
              <Textarea
                value={editForm.content}
                onChange={(e) => setEditForm((f) => ({ ...f, content: e.target.value }))}
                placeholder="Post content..."
                rows={6}
                disabled={updateDraftMutation.isPending}
                className="bg-white/5 border-white/10 text-white placeholder:text-neutral-gray/50 focus-visible:ring-accent-gold/50 resize-none"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setEditingDraft(null)}
              disabled={updateDraftMutation.isPending}
              className="border-white/10 text-neutral-gray hover:text-white hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={updateDraftMutation.isPending}
              className="bg-accent-gold hover:bg-gold-trim text-primary-black font-semibold"
            >
              {updateDraftMutation.isPending ? (
                <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Saving…</>
              ) : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
