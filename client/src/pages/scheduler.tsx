import { useState, useEffect, useRef } from "react";
import { Link, useSearch } from "wouter";
import { Calendar, ArrowLeft, Plus, Trash2, Clock, Instagram, Twitter, Facebook, Youtube, Music, Pencil, X, Check, ChevronUp, ChevronDown, GripVertical, ArrowUpDown, CheckCircle2, RotateCcw, AlertCircle } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { baseInsertScheduledPostSchema, type ScheduledPost } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlassCard, GoldHeading, SfsContainer } from "@/components/sfs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type DragCancelEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const platforms = [
  { value: "instagram", label: "Instagram", icon: Instagram, color: "text-pink-400" },
  { value: "twitter", label: "Twitter / X", icon: Twitter, color: "text-blue-400" },
  { value: "facebook", label: "Facebook", icon: Facebook, color: "text-blue-600" },
  { value: "youtube", label: "YouTube", icon: Youtube, color: "text-red-500" },
  { value: "tiktok", label: "TikTok", icon: Music, color: "text-cyan-400" },
];

const formSchema = baseInsertScheduledPostSchema.omit({ userId: true, status: true, sortOrder: true }).extend({
  scheduledAt: z.string().min(1, "Please select a date and time"),
  content: z.string().min(1, "Content is required").max(2200, "Content is too long"),
  platform: z.string().min(1, "Please select a platform"),
}).refine(
  (data) => !data.scheduledAt || new Date(data.scheduledAt) > new Date(),
  { message: "Scheduled time must be in the future", path: ["scheduledAt"] }
);

type FormData = z.infer<typeof formSchema>;

function PlatformIcon({ platform, className }: { platform: string; className?: string }) {
  const found = platforms.find(p => p.value === platform);
  if (!found) return null;
  const Icon = found.icon;
  return <Icon className={`w-4 h-4 ${found.color} ${className ?? ""}`} />;
}

function formatScheduledAt(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

function toDatetimeLocalValue(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function nowDatetimeLocalValue() {
  return toDatetimeLocalValue(new Date().toISOString());
}

function EditPostForm({
  post,
  onCancel,
  onSaved,
}: {
  post: ScheduledPost;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const { toast } = useToast();

  const editForm = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platform: post.platform,
      content: post.content,
      scheduledAt: toDatetimeLocalValue(post.scheduledAt),
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: FormData) => apiRequest("PATCH", `/api/scheduled-posts/${post.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/scheduled-posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/scheduled-posts/count"] });
      toast({ title: "Post updated", description: "Your scheduled post has been updated." });
      onSaved();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update post. Please try again.", variant: "destructive" });
    },
  });

  return (
    <GlassCard className="p-5 mt-2 !border-[var(--sf-gold)]/40">
      <h3 className="text-sm font-semibold text-white mb-4">Edit Scheduled Post</h3>
      <Form {...editForm}>
        <form onSubmit={editForm.handleSubmit(data => updateMutation.mutate(data))} className="space-y-4">
          <FormField
            control={editForm.control}
            name="platform"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-neutral-400">Platform</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-[var(--sf-black)] border-[var(--sf-gold)]/20 text-white">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-[var(--sf-black)] border-[var(--sf-gold)]/20">
                    {platforms.map(p => (
                      <SelectItem key={p.value} value={p.value} className="text-white focus:bg-white/5">
                        <div className="flex items-center gap-2">
                          <p.icon className={`w-4 h-4 ${p.color}`} />
                          {p.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={editForm.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-neutral-400">Post Content</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Write your post content here..."
                    className="bg-[var(--sf-black)] border-[var(--sf-gold)]/20 text-white placeholder:text-neutral-400/50 min-h-[100px] resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={editForm.control}
            name="scheduledAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-neutral-400">Schedule Date & Time</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="datetime-local"
                    className="bg-[var(--sf-black)] border-[var(--sf-gold)]/20 text-white"
                    min={nowDatetimeLocalValue()}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-3 pt-1">
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="bg-[var(--sf-gold)] hover:bg-[var(--sf-gold-2)] text-[var(--sf-black)] font-semibold gap-2"
            >
              <Check className="w-4 h-4" />
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-[var(--sf-gold)]/30 text-neutral-400 hover:text-white hover:bg-white/5 gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </GlassCard>
  );
}

const retrySchema = z.object({
  scheduledAt: z.string().min(1, "Please select a date and time"),
}).refine(
  (data) => new Date(data.scheduledAt) > new Date(),
  { message: "Scheduled time must be in the future", path: ["scheduledAt"] }
);
type RetryFormData = z.infer<typeof retrySchema>;

function RetryRescheduleForm({
  post,
  onCancel,
  onRetried,
}: {
  post: ScheduledPost;
  onCancel: () => void;
  onRetried: () => void;
}) {
  const { toast } = useToast();
  const platformInfo = platforms.find(p => p.value === post.platform);

  const defaultRetryAt = (() => {
    const d = new Date(Date.now() + 15 * 60 * 1000);
    return toDatetimeLocalValue(d.toISOString());
  })();

  const retryForm = useForm<RetryFormData>({
    resolver: zodResolver(retrySchema),
    defaultValues: {
      scheduledAt: defaultRetryAt,
    },
  });

  const retryWithRescheduleMutation = useMutation({
    mutationFn: (data: RetryFormData) =>
      apiRequest("POST", `/api/scheduled-posts/${post.id}/retry`, { scheduledAt: new Date(data.scheduledAt).toISOString() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/scheduled-posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/scheduled-posts/count"] });
      toast({ title: "Post rescheduled", description: "The post has been rescheduled and queued for publishing." });
      onRetried();
    },
    onError: () => {
      toast({ title: "Error", description: "Could not reschedule the post. Please try again.", variant: "destructive" });
    },
  });

  return (
    <GlassCard className="p-5 mt-2 !border-blue-500/40">
      <h3 className="text-sm font-semibold text-white mb-1">Reschedule & Retry</h3>
      <p className="text-xs text-neutral-400 mb-4">Pick a new time in the future to re-queue this post. Content and platform stay the same.</p>

      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500 w-16 shrink-0">Platform</span>
          <div className="flex items-center gap-1.5 text-xs text-neutral-300">
            {platformInfo && <platformInfo.icon className={`w-3.5 h-3.5 ${platformInfo.color}`} />}
            <span className="capitalize">{platformInfo?.label ?? post.platform}</span>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-xs text-neutral-500 w-16 shrink-0 pt-0.5">Content</span>
          <p className="text-xs text-neutral-300 line-clamp-3 leading-relaxed">{post.content}</p>
        </div>
      </div>

      <Form {...retryForm}>
        <form onSubmit={retryForm.handleSubmit(data => retryWithRescheduleMutation.mutate(data))} className="space-y-4">
          <FormField
            control={retryForm.control}
            name="scheduledAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-neutral-400">New Scheduled Date & Time</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="datetime-local"
                    className="bg-[var(--sf-black)] border-[var(--sf-gold)]/20 text-white"
                    min={nowDatetimeLocalValue()}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-3 pt-1">
            <Button
              type="submit"
              disabled={retryWithRescheduleMutation.isPending}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              {retryWithRescheduleMutation.isPending ? "Rescheduling..." : "Reschedule & Retry"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-[var(--sf-gold)]/30 text-neutral-400 hover:text-white hover:bg-white/5 gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </GlassCard>
  );
}

function SortablePostCard({
  post,
  index,
  total,
  isReordering,
  editingPostId,
  retryingPostId,
  isHighlighted,
  onMovePost,
  onSetEditingPostId,
  onSetRetryingPostId,
  onDelete,
  deletePending,
}: {
  post: ScheduledPost;
  index: number;
  total: number;
  isReordering: boolean;
  editingPostId: number | null;
  retryingPostId: number | null;
  isHighlighted: boolean;
  onMovePost: (index: number, direction: "up" | "down") => void;
  onSetEditingPostId: (id: number | null) => void;
  onSetRetryingPostId: (id: number | null) => void;
  onDelete: (id: number) => void;
  deletePending: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: post.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isEditing = editingPostId === post.id;
  const isRetrying = retryingPostId === post.id;

  const isFailed = post.status === "failed";

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        data-post-id={post.id}
        className="rounded-xl border-2 border-dashed border-[var(--sf-gold)]/40 bg-[var(--sf-gold)]/5 h-[72px]"
      />
    );
  }

  return (
    <GlassCard
      ref={setNodeRef}
      style={style}
      data-post-id={post.id}
      className={`overflow-hidden p-0 ${isFailed ? "!border-red-500/30 !bg-red-500/5" : ""} ${isHighlighted ? "post-highlight" : ""}`}
    >
      <div className="flex items-start gap-3 p-4">
        <div className="flex flex-col items-center gap-0.5 flex-shrink-0 mt-0.5">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-0.5 text-neutral-400/50 hover:text-[var(--sf-gold)] transition-colors rounded"
            title="Drag to reorder"
            aria-label="Drag to reorder"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onMovePost(index, "up")}
            disabled={index === 0 || isReordering}
            className="h-5 w-5 text-neutral-400 hover:text-[var(--sf-gold)] hover:bg-[var(--sf-gold)]/10 disabled:opacity-20"
            title="Move up"
          >
            <ChevronUp className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onMovePost(index, "down")}
            disabled={index === total - 1 || isReordering}
            className="h-5 w-5 text-neutral-400 hover:text-[var(--sf-gold)] hover:bg-[var(--sf-gold)]/10 disabled:opacity-20"
            title="Move down"
          >
            <ChevronDown className="w-3 h-3" />
          </Button>
        </div>
        <div className="w-9 h-9 rounded-lg bg-[var(--sf-black)] border border-[var(--sf-gold)]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <PlatformIcon platform={post.platform} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm line-clamp-2 mb-2">{post.content}</p>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1 text-xs text-neutral-400">
              <Clock className="w-3 h-3" />
              {formatScheduledAt(post.scheduledAt)}
            </span>
            {isFailed ? (
              <Badge
                variant="outline"
                className="text-xs capitalize border-0 px-2 py-0.5 bg-red-500/10 text-red-400 flex items-center gap-1"
              >
                <AlertCircle className="w-3 h-3" />
                Failed
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-xs capitalize border-0 px-2 py-0.5 bg-[var(--sf-gold)]/10 text-[var(--sf-gold)]"
              >
                {post.status}
              </Badge>
            )}
            <span className="text-xs text-neutral-400 capitalize">
              {platforms.find(p => p.value === post.platform)?.label ?? post.platform}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {isFailed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                onSetEditingPostId(null);
                onSetRetryingPostId(isRetrying ? null : post.id);
              }}
              className={`flex-shrink-0 ${isRetrying ? "text-blue-400 bg-blue-400/10" : "text-neutral-400 hover:text-blue-400 hover:bg-blue-400/10"}`}
              title="Reschedule & retry"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              onSetRetryingPostId(null);
              onSetEditingPostId(isEditing ? null : post.id);
            }}
            className={`hover:bg-[var(--sf-gold)]/10 flex-shrink-0 ${isEditing ? "text-[var(--sf-gold)]" : "text-neutral-400 hover:text-[var(--sf-gold)]"}`}
            title="Edit post"
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(post.id)}
            disabled={deletePending}
            className="text-neutral-400 hover:text-red-400 hover:bg-red-400/10 flex-shrink-0"
            title="Delete post"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {isEditing && (
        <div className="px-4 pb-4">
          <EditPostForm
            post={post}
            onCancel={() => onSetEditingPostId(null)}
            onSaved={() => onSetEditingPostId(null)}
          />
        </div>
      )}

      {isRetrying && (
        <div className="px-4 pb-4">
          <RetryRescheduleForm
            post={post}
            onCancel={() => onSetRetryingPostId(null)}
            onRetried={() => onSetRetryingPostId(null)}
          />
        </div>
      )}
    </GlassCard>
  );
}

function DragOverlayCard({ post }: { post: ScheduledPost }) {
  const isFailed = post.status === "failed";
  return (
    <GlassCard
      className={`overflow-hidden p-0 shadow-2xl ring-2 ring-[var(--sf-gold)]/60 ${isFailed ? "!border-red-500/30 !bg-red-500/5" : ""}`}
      style={{ cursor: "grabbing" }}
    >
      <div className="flex items-start gap-3 p-4">
        <div className="flex flex-col items-center gap-0.5 flex-shrink-0 mt-0.5">
          <span className="p-0.5 text-[var(--sf-gold)]">
            <GripVertical className="w-4 h-4" />
          </span>
        </div>
        <div className="w-9 h-9 rounded-lg bg-[var(--sf-black)] border border-[var(--sf-gold)]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <PlatformIcon platform={post.platform} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm line-clamp-2 mb-2">{post.content}</p>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1 text-xs text-neutral-400">
              <Clock className="w-3 h-3" />
              {formatScheduledAt(post.scheduledAt)}
            </span>
            {isFailed ? (
              <Badge
                variant="outline"
                className="text-xs capitalize border-0 px-2 py-0.5 bg-red-500/10 text-red-400 flex items-center gap-1"
              >
                <AlertCircle className="w-3 h-3" />
                Failed
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-xs capitalize border-0 px-2 py-0.5 bg-[var(--sf-gold)]/10 text-[var(--sf-gold)]"
              >
                {post.status}
              </Badge>
            )}
            <span className="text-xs text-neutral-400 capitalize">
              {platforms.find(p => p.value === post.platform)?.label ?? post.platform}
            </span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

function PublishedPostCard({
  post,
  onDelete,
  deletePending,
}: {
  post: ScheduledPost;
  onDelete: (id: number) => void;
  deletePending: boolean;
}) {
  return (
    <GlassCard className="overflow-hidden p-0 !border-green-500/20 !bg-green-500/5">
      <div className="flex items-start gap-3 p-4">
        <div className="w-9 h-9 rounded-lg bg-[var(--sf-black)] border border-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <PlatformIcon platform={post.platform} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm line-clamp-2 mb-2">{post.content}</p>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1 text-xs text-neutral-400">
              <CheckCircle2 className="w-3 h-3 text-green-400" />
              Published {formatScheduledAt(post.scheduledAt)}
            </span>
            <span className="text-xs text-neutral-400 capitalize">
              {platforms.find(p => p.value === post.platform)?.label ?? post.platform}
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(post.id)}
          disabled={deletePending}
          className="text-neutral-400 hover:text-red-400 hover:bg-red-400/10 flex-shrink-0"
          title="Remove from history"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </GlassCard>
  );
}

export default function Scheduler() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [retryingPostId, setRetryingPostId] = useState<number | null>(null);
  const [activePost, setActivePost] = useState<ScheduledPost | null>(null);
  const [showSortConfirm, setShowSortConfirm] = useState(false);
  const [showClearHistoryConfirm, setShowClearHistoryConfirm] = useState(false);

  const searchStr = useSearch();
  const highlightId = (() => {
    const params = new URLSearchParams(searchStr);
    const val = params.get("highlight");
    return val ? Number(val) : null;
  })();

  const [activeHighlightId, setActiveHighlightId] = useState<number | null>(null);
  const [publishedPlatformFilter, setPublishedPlatformFilter] = useState<string>("all");
  const scrolledRef = useRef(false);

  const { data: posts = [], isLoading } = useQuery<ScheduledPost[]>({
    queryKey: ["/api/scheduled-posts"],
  });

  useEffect(() => {
    if (!highlightId || isLoading || scrolledRef.current) return;
    const el = document.querySelector(`[data-post-id="${highlightId}"]`);
    if (!el) return;
    scrolledRef.current = true;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    setActiveHighlightId(highlightId);
    const timer = setTimeout(() => setActiveHighlightId(null), 2400);
    return () => clearTimeout(timer);
  }, [highlightId, isLoading, posts]);

  const upcomingPosts = posts.filter(p => p.status === "scheduled" || p.status === "failed");
  const publishedPosts = posts.filter(p => p.status === "published")
    .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platform: "",
      content: "",
      scheduledAt: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: FormData) => apiRequest("POST", "/api/scheduled-posts", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/scheduled-posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/scheduled-posts/count"] });
      form.reset();
      setShowForm(false);
      toast({ title: "Post scheduled", description: "Your post has been added to the queue." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to schedule post. Please try again.", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/scheduled-posts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/scheduled-posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/scheduled-posts/count"] });
      toast({ title: "Post removed", description: "The scheduled post has been deleted." });
    },
  });

  const clearHistoryMutation = useMutation({
    mutationFn: () => apiRequest("DELETE", "/api/scheduled-posts/published"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/scheduled-posts"] });
      setShowClearHistoryConfirm(false);
      toast({ title: "History cleared", description: "All published posts have been removed." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to clear history. Please try again.", variant: "destructive" });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: (orderedIds: number[]) =>
      apiRequest("PATCH", "/api/scheduled-posts/reorder", { orderedIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/scheduled-posts"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to reorder posts. Please try again.", variant: "destructive" });
      queryClient.invalidateQueries({ queryKey: ["/api/scheduled-posts"] });
    },
  });

  const sortByDateMutation = useMutation({
    mutationFn: (orderedIds: number[]) =>
      apiRequest("PATCH", "/api/scheduled-posts/reorder", { orderedIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/scheduled-posts"] });
      toast({ title: "Queue sorted", description: "Posts have been reset to chronological order." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to sort posts. Please try again.", variant: "destructive" });
      queryClient.invalidateQueries({ queryKey: ["/api/scheduled-posts"] });
    },
  });

  const resetToChronological = () => {
    const sorted = [...upcomingPosts].sort(
      (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    );
    sortByDateMutation.mutate(sorted.map(p => p.id));
  };

  const onSubmit = (data: FormData) => {
    createMutation.mutate(data);
  };

  const movePost = (index: number, direction: "up" | "down") => {
    const newPosts = [...upcomingPosts];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newPosts.length) return;
    [newPosts[index], newPosts[targetIndex]] = [newPosts[targetIndex], newPosts[index]];
    reorderMutation.mutate(newPosts.map(p => p.id));
  };

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const post = upcomingPosts.find(p => p.id === event.active.id);
    setActivePost(post ?? null);
  };

  const handleDragCancel = (_event: DragCancelEvent) => {
    setActivePost(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActivePost(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = upcomingPosts.findIndex(p => p.id === active.id);
    const newIndex = upcomingPosts.findIndex(p => p.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const reordered = arrayMove(upcomingPosts, oldIndex, newIndex);
    reorderMutation.mutate(reordered.map(p => p.id));
  };

  return (
    <div className="min-h-screen bg-[var(--sf-black)] text-white">
      <SfsContainer className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-[var(--sf-gold)] hover:text-[var(--sf-gold-2)] transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[var(--sf-gold)] to-[var(--sf-gold-2)] rounded-xl flex items-center justify-center shadow-[var(--sf-glow-gold-sm)]">
              <Calendar className="w-6 h-6 text-[var(--sf-black)]" />
            </div>
            <div>
              <GoldHeading level={1} className="text-2xl font-bold">Post Scheduler</GoldHeading>
              <p className="text-neutral-400 text-sm">Schedule posts for optimal engagement times</p>
            </div>
          </div>
          <Button
            onClick={() => { setShowForm(v => !v); setEditingPostId(null); }}
            className="bg-[var(--sf-gold)] hover:bg-[var(--sf-gold-2)] text-[var(--sf-black)] font-semibold gap-2"
          >
            <Plus className="w-4 h-4" />
            Schedule Post
          </Button>
        </div>

        {showForm && (
          <GlassCard className="p-6 mb-8 !border-[var(--sf-gold)]/30">
            <h2 className="text-lg font-semibold text-white mb-4">New Scheduled Post</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-400">Platform</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-[var(--sf-black)] border-[var(--sf-gold)]/20 text-white">
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[var(--sf-black)] border-[var(--sf-gold)]/20">
                          {platforms.map(p => (
                            <SelectItem key={p.value} value={p.value} className="text-white focus:bg-white/5">
                              <div className="flex items-center gap-2">
                                <p.icon className={`w-4 h-4 ${p.color}`} />
                                {p.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-400">Post Content</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Write your post content here..."
                          className="bg-[var(--sf-black)] border-[var(--sf-gold)]/20 text-white placeholder:text-neutral-400/50 min-h-[100px] resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="scheduledAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-400">Schedule Date & Time</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="datetime-local"
                          className="bg-[var(--sf-black)] border-[var(--sf-gold)]/20 text-white"
                          min={nowDatetimeLocalValue()}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3 pt-2">
                  <Button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="bg-[var(--sf-gold)] hover:bg-[var(--sf-gold-2)] text-[var(--sf-black)] font-semibold"
                  >
                    {createMutation.isPending ? "Scheduling..." : "Schedule Post"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => { setShowForm(false); form.reset(); }}
                    className="border-[var(--sf-gold)]/30 text-neutral-400 hover:text-white hover:bg-white/5"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </GlassCard>
        )}

        <Tabs defaultValue="upcoming">
          <TabsList className="bg-white/5 border border-[var(--sf-gold)]/20 mb-6 w-full sm:w-auto">
            <TabsTrigger
              value="upcoming"
              className="data-[state=active]:bg-[var(--sf-gold)] data-[state=active]:text-[var(--sf-black)] text-neutral-400 flex-1 sm:flex-none gap-2"
            >
              <Clock className="w-4 h-4" />
              Upcoming
              {upcomingPosts.length > 0 && (
                <span className="ml-1 rounded-full bg-[var(--sf-gold)]/20 data-[state=active]:bg-[var(--sf-black)]/20 px-1.5 py-0.5 text-xs leading-none">
                  {upcomingPosts.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="published"
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white text-neutral-400 flex-1 sm:flex-none gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Published
              {publishedPosts.length > 0 && (
                <span className="ml-1 rounded-full bg-green-500/20 data-[state=active]:bg-white/20 px-1.5 py-0.5 text-xs leading-none">
                  {publishedPosts.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">
                  Scheduled Queue
                  <span className="ml-2 text-sm font-normal text-neutral-400">({upcomingPosts.length} post{upcomingPosts.length !== 1 ? "s" : ""})</span>
                </h2>
                {upcomingPosts.length > 1 && (
                  <div className="flex items-center gap-3">
                    <p className="text-xs text-neutral-400 hidden sm:block">Drag or use arrows to reorder</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSortConfirm(true)}
                      disabled={sortByDateMutation.isPending || reorderMutation.isPending}
                      className="border-[var(--sf-gold)]/30 text-neutral-400 hover:text-[var(--sf-gold)] hover:border-[var(--sf-gold)]/60 hover:bg-[var(--sf-gold)]/5 gap-1.5 text-xs h-7 px-3"
                      title="Reset to chronological order"
                    >
                      <ArrowUpDown className="w-3 h-3" />
                      Sort by date
                    </Button>
                  </div>
                )}
              </div>

              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="border border-[var(--sf-gold)]/10 rounded-xl p-4 bg-white/5 animate-pulse h-24" />
                  ))}
                </div>
              ) : upcomingPosts.length === 0 ? (
                <GlassCard className="p-10 text-center">
                  <Clock className="w-12 h-12 text-[var(--sf-gold)]/30 mx-auto mb-3" />
                  <p className="text-neutral-400">No posts scheduled yet. Click "Schedule Post" to add one.</p>
                </GlassCard>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDragCancel={handleDragCancel}
                >
                  <SortableContext
                    items={upcomingPosts.map(p => p.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3">
                      {upcomingPosts.map((post, index) => (
                        <SortablePostCard
                          key={post.id}
                          post={post}
                          index={index}
                          total={upcomingPosts.length}
                          isReordering={reorderMutation.isPending}
                          editingPostId={editingPostId}
                          retryingPostId={retryingPostId}
                          isHighlighted={activeHighlightId === post.id}
                          onMovePost={movePost}
                          onSetEditingPostId={setEditingPostId}
                          onSetRetryingPostId={setRetryingPostId}
                          onDelete={(id) => deleteMutation.mutate(id)}
                          deletePending={deleteMutation.isPending}
                        />
                      ))}
                    </div>
                  </SortableContext>
                  <DragOverlay dropAnimation={null}>
                    {activePost ? <DragOverlayCard post={activePost} /> : null}
                  </DragOverlay>
                </DndContext>
              )}
            </div>
          </TabsContent>

          <TabsContent value="published">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">
                  Published History
                  <span className="ml-2 text-sm font-normal text-neutral-400">({publishedPosts.length} post{publishedPosts.length !== 1 ? "s" : ""})</span>
                </h2>
                {!isLoading && publishedPosts.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowClearHistoryConfirm(true)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/30"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                    Clear History
                  </Button>
                )}
              </div>

              {!isLoading && publishedPosts.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    onClick={() => setPublishedPlatformFilter("all")}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors border ${
                      publishedPlatformFilter === "all"
                        ? "bg-white/10 border-white/30 text-white"
                        : "bg-transparent border-white/10 text-neutral-400 hover:border-white/20 hover:text-neutral-300"
                    }`}
                  >
                    All
                  </button>
                  {platforms
                    .filter(p => publishedPosts.some(post => post.platform === p.value))
                    .map(p => {
                      const Icon = p.icon;
                      const isActive = publishedPlatformFilter === p.value;
                      return (
                        <button
                          key={p.value}
                          onClick={() => setPublishedPlatformFilter(p.value)}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium transition-colors border ${
                            isActive
                              ? "bg-white/10 border-white/30 text-white"
                              : "bg-transparent border-white/10 text-neutral-400 hover:border-white/20 hover:text-neutral-300"
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 ${p.color}`} />
                          {p.label}
                        </button>
                      );
                    })}
                </div>
              )}

              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2].map(i => (
                    <div key={i} className="border border-green-500/10 rounded-xl p-4 bg-green-500/5 animate-pulse h-20" />
                  ))}
                </div>
              ) : publishedPosts.length === 0 ? (
                <GlassCard className="p-10 text-center !border-green-500/20 !bg-green-500/5">
                  <CheckCircle2 className="w-12 h-12 text-green-400/30 mx-auto mb-3" />
                  <p className="text-neutral-400">No posts published yet.</p>
                  <p className="text-neutral-500 text-sm mt-1">Posts will appear here once they go live automatically.</p>
                </GlassCard>
              ) : (
                <div className="space-y-3">
                  {publishedPosts
                    .filter(post => publishedPlatformFilter === "all" || post.platform === publishedPlatformFilter)
                    .map(post => (
                      <PublishedPostCard
                        key={post.id}
                        post={post}
                        onDelete={(id) => deleteMutation.mutate(id)}
                        deletePending={deleteMutation.isPending}
                      />
                    ))}
                  {publishedPosts.filter(post => publishedPlatformFilter !== "all" && post.platform === publishedPlatformFilter).length === 0 && publishedPlatformFilter !== "all" && (
                    <GlassCard className="p-10 text-center !border-green-500/20 !bg-green-500/5">
                      <CheckCircle2 className="w-12 h-12 text-green-400/30 mx-auto mb-3" />
                      <p className="text-neutral-400">No published posts for this platform.</p>
                    </GlassCard>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </SfsContainer>

      <AlertDialog open={showSortConfirm} onOpenChange={setShowSortConfirm}>
        <AlertDialogContent className="bg-[var(--sf-black)] border border-[var(--sf-gold)]/30 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Reset to chronological order?</AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-400">
              This will sort all queued posts by their scheduled date, overwriting your current manual arrangement. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[var(--sf-gold)]/30 text-neutral-400 hover:text-white hover:bg-white/5 bg-transparent">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={resetToChronological}
              className="bg-[var(--sf-gold)] hover:bg-[var(--sf-gold-2)] text-[var(--sf-black)] font-semibold"
            >
              Sort by date
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showClearHistoryConfirm} onOpenChange={setShowClearHistoryConfirm}>
        <AlertDialogContent className="bg-[var(--sf-black)] border border-red-500/30 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Clear all published history?</AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-400">
              This will permanently delete all {publishedPosts.length} published post{publishedPosts.length !== 1 ? "s" : ""} from your history. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10 text-neutral-400 hover:text-white hover:bg-white/5 bg-transparent">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => clearHistoryMutation.mutate()}
              disabled={clearHistoryMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              {clearHistoryMutation.isPending ? "Clearing..." : "Clear History"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
