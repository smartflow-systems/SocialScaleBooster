import { useLocation } from "wouter";
import {
  BookmarkPlus, Trash2, Loader2, FileText, ArrowUpRight,
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Draft } from "@shared/schema";

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

export default function DraftsPage() {
  const { toast } = useToast();
  const [, navigate] = useLocation();

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

  const handleLoad = (draft: Draft) => {
    navigate(`/create?draftId=${draft.id}`);
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
            <p className="text-neutral-gray text-sm">Your saved post drafts — load them into the editor to continue</p>
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
                  <button
                    onClick={() => deleteDraftMutation.mutate(draft.id)}
                    disabled={deleteDraftMutation.isPending}
                    className="text-neutral-gray hover:text-red-400 transition-colors flex-shrink-0 mt-0.5"
                    title="Delete draft"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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
    </div>
  );
}
