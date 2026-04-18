import { useState } from "react";
import { Link } from "wouter";
import { Calendar, ArrowLeft, Plus, Trash2, Clock, Instagram, Twitter, Facebook, Youtube, Music, Pencil, X, Check } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { insertScheduledPostSchema, type ScheduledPost } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const platforms = [
  { value: "instagram", label: "Instagram", icon: Instagram, color: "text-pink-400" },
  { value: "twitter", label: "Twitter / X", icon: Twitter, color: "text-blue-400" },
  { value: "facebook", label: "Facebook", icon: Facebook, color: "text-blue-600" },
  { value: "youtube", label: "YouTube", icon: Youtube, color: "text-red-500" },
  { value: "tiktok", label: "TikTok", icon: Music, color: "text-cyan-400" },
];

const formSchema = insertScheduledPostSchema.omit({ userId: true, status: true }).extend({
  scheduledAt: z.string().min(1, "Please select a date and time"),
  content: z.string().min(1, "Content is required").max(2200, "Content is too long"),
  platform: z.string().min(1, "Please select a platform"),
});

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
    <div className="border border-accent-gold/40 rounded-xl p-5 bg-rich-brown/20 mt-2">
      <h3 className="text-sm font-semibold text-white mb-4">Edit Scheduled Post</h3>
      <Form {...editForm}>
        <form onSubmit={editForm.handleSubmit(data => updateMutation.mutate(data))} className="space-y-4">
          <FormField
            control={editForm.control}
            name="platform"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-neutral-gray">Platform</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-primary-black border-accent-gold/20 text-white">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-primary-black border-accent-gold/20">
                    {platforms.map(p => (
                      <SelectItem key={p.value} value={p.value} className="text-white focus:bg-rich-brown/40">
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
                <FormLabel className="text-neutral-gray">Post Content</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Write your post content here..."
                    className="bg-primary-black border-accent-gold/20 text-white placeholder:text-neutral-gray/50 min-h-[100px] resize-none"
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
                <FormLabel className="text-neutral-gray">Schedule Date & Time</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="datetime-local"
                    className="bg-primary-black border-accent-gold/20 text-white"
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
              className="bg-accent-gold hover:bg-gold-trim text-primary-black font-semibold gap-2"
            >
              <Check className="w-4 h-4" />
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-accent-gold/30 text-neutral-gray hover:text-white hover:bg-rich-brown/30 gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default function Scheduler() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);

  const { data: posts = [], isLoading } = useQuery<ScheduledPost[]>({
    queryKey: ["/api/scheduled-posts"],
  });

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

  const onSubmit = (data: FormData) => {
    createMutation.mutate(data);
  };

  const sortedPosts = [...posts].sort(
    (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
  );

  return (
    <div className="min-h-screen bg-primary-black">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/dashboard">
          <a className="inline-flex items-center gap-2 text-accent-gold hover:text-gold-trim transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </a>
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-accent-gold to-gold-trim rounded-xl flex items-center justify-center shadow-lg shadow-accent-gold/20">
              <Calendar className="w-6 h-6 text-primary-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Post Scheduler</h1>
              <p className="text-neutral-gray text-sm">Schedule posts for optimal engagement times</p>
            </div>
          </div>
          <Button
            onClick={() => { setShowForm(v => !v); setEditingPostId(null); }}
            className="bg-accent-gold hover:bg-gold-trim text-primary-black font-semibold gap-2"
          >
            <Plus className="w-4 h-4" />
            Schedule Post
          </Button>
        </div>

        {showForm && (
          <div className="border border-accent-gold/30 rounded-xl p-6 bg-rich-brown/20 mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">New Scheduled Post</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-gray">Platform</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-primary-black border-accent-gold/20 text-white">
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-primary-black border-accent-gold/20">
                          {platforms.map(p => (
                            <SelectItem key={p.value} value={p.value} className="text-white focus:bg-rich-brown/40">
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
                      <FormLabel className="text-neutral-gray">Post Content</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Write your post content here..."
                          className="bg-primary-black border-accent-gold/20 text-white placeholder:text-neutral-gray/50 min-h-[100px] resize-none"
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
                      <FormLabel className="text-neutral-gray">Schedule Date & Time</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="datetime-local"
                          className="bg-primary-black border-accent-gold/20 text-white"
                          min={new Date().toISOString().slice(0, 16)}
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
                    className="bg-accent-gold hover:bg-gold-trim text-primary-black font-semibold"
                  >
                    {createMutation.isPending ? "Scheduling..." : "Schedule Post"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => { setShowForm(false); form.reset(); }}
                    className="border-accent-gold/30 text-neutral-gray hover:text-white hover:bg-rich-brown/30"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}

        <div>
          <h2 className="text-lg font-semibold text-white mb-4">
            Scheduled Queue
            <span className="ml-2 text-sm font-normal text-neutral-gray">({posts.length} post{posts.length !== 1 ? "s" : ""})</span>
          </h2>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="border border-accent-gold/10 rounded-xl p-4 bg-rich-brown/10 animate-pulse h-24" />
              ))}
            </div>
          ) : sortedPosts.length === 0 ? (
            <div className="border border-accent-gold/20 rounded-xl p-10 bg-rich-brown/10 text-center">
              <Clock className="w-12 h-12 text-accent-gold/30 mx-auto mb-3" />
              <p className="text-neutral-gray">No posts scheduled yet. Click "Schedule Post" to add one.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedPosts.map(post => {
                const isPast = new Date(post.scheduledAt) < new Date();
                const isEditing = editingPostId === post.id;
                return (
                  <div key={post.id} className="border border-accent-gold/20 rounded-xl bg-rich-brown/10 overflow-hidden">
                    <div className="flex items-start gap-4 p-4">
                      <div className="w-9 h-9 rounded-lg bg-primary-black border border-accent-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <PlatformIcon platform={post.platform} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm line-clamp-2 mb-2">{post.content}</p>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="flex items-center gap-1 text-xs text-neutral-gray">
                            <Clock className="w-3 h-3" />
                            {formatScheduledAt(post.scheduledAt)}
                          </span>
                          <Badge
                            variant="outline"
                            className={`text-xs capitalize border-0 px-2 py-0.5 ${
                              isPast
                                ? "bg-neutral-gray/20 text-neutral-gray"
                                : "bg-accent-gold/10 text-accent-gold"
                            }`}
                          >
                            {isPast ? "past" : post.status}
                          </Badge>
                          <span className="text-xs text-neutral-gray capitalize">
                            {platforms.find(p => p.value === post.platform)?.label ?? post.platform}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingPostId(isEditing ? null : post.id)}
                          className={`hover:bg-accent-gold/10 flex-shrink-0 ${isEditing ? "text-accent-gold" : "text-neutral-gray hover:text-accent-gold"}`}
                          title="Edit post"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMutation.mutate(post.id)}
                          disabled={deleteMutation.isPending}
                          className="text-neutral-gray hover:text-red-400 hover:bg-red-400/10 flex-shrink-0"
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
                          onCancel={() => setEditingPostId(null)}
                          onSaved={() => setEditingPostId(null)}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
