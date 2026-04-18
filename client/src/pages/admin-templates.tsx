import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, Redirect } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Plus, Pencil, Trash2, ShieldAlert, ShieldCheck, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { BotTemplate } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GlassCard, GoldHeading, SfsContainer } from "@/components/sfs";

const PLATFORMS = ["instagram", "twitter", "linkedin", "tiktok", "facebook", "youtube"] as const;
const CATEGORIES = ["growth", "engagement", "leads", "content", "analytics", "automation"] as const;

const templateFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  platform: z.string().min(1, "Platform is required"),
  isPremium: z.boolean().default(false),
  price: z.string().optional().nullable(),
  imageUrl: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  config: z.string().optional(),
});

type TemplateFormValues = z.infer<typeof templateFormSchema>;

function TemplateForm({
  defaultValues,
  onSubmit,
  isPending,
}: {
  defaultValues?: Partial<TemplateFormValues>;
  onSubmit: (data: TemplateFormValues) => void;
  isPending: boolean;
}) {
  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      platform: "",
      isPremium: false,
      price: "",
      imageUrl: "",
      config: "",
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Name</FormLabel>
              <FormControl>
                <Input {...field} className="bg-[var(--sf-black)] border-white/10 text-white" placeholder="Instagram Growth Bot" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  className="bg-[var(--sf-black)] border-white/10 text-white resize-none"
                  placeholder="Describe what this template does..."
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="platform"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Platform</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-[var(--sf-black)] border-white/10 text-white">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-[var(--sf-black)] border-white/10">
                    {PLATFORMS.map((p) => (
                      <SelectItem key={p} value={p} className="text-white capitalize">
                        {p.charAt(0).toUpperCase() + p.slice(1)}
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
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-[var(--sf-black)] border-white/10 text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-[var(--sf-black)] border-white/10">
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c} className="text-white capitalize">
                        {c.charAt(0).toUpperCase() + c.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="isPremium"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/10 p-3">
                <FormLabel className="text-white cursor-pointer">Premium template</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Price (USD, optional)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    className="bg-[var(--sf-black)] border-white/10 text-white"
                    placeholder="29.00"
                    type="number"
                    step="0.01"
                    min="0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Image URL (optional)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  className="bg-[var(--sf-black)] border-white/10 text-white"
                  placeholder="https://images.unsplash.com/..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="config"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Config JSON (optional)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  className="bg-[var(--sf-black)] border-white/10 text-white font-mono text-sm resize-none"
                  placeholder='{"engageFrequency": "high", "targetHashtags": ["growth"]}'
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button
            type="submit"
            disabled={isPending}
            className="bg-[var(--sf-gold)] text-black hover:bg-[var(--sf-gold)]/90 font-semibold"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Save Template
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

function AdminClaimSection({ onSuccess }: { onSuccess: (token: string) => void }) {
  const { toast } = useToast();
  const [secret, setSecret] = useState("");

  const claimMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/claim", { secret });
      return res.json();
    },
    onSuccess: (data: any) => {
      toast({ title: "Admin access granted", description: "You now have admin privileges." });
      onSuccess(data.token);
    },
    onError: (err: any) => {
      toast({ title: "Failed", description: err.message || "Invalid admin secret", variant: "destructive" });
    },
  });

  return (
    <GlassCard className="p-8 text-center max-w-md mx-auto">
      <ShieldAlert className="w-16 h-16 text-[var(--sf-gold)]/40 mx-auto mb-4" />
      <GoldHeading level={2} className="text-xl font-semibold mb-2">Admin Access Required</GoldHeading>
      <p className="text-neutral-400 mb-6 text-sm">
        Enter the admin secret to claim admin privileges for your account.
        The secret must be configured in your Replit Secrets panel as{" "}
        <code className="text-[var(--sf-gold)] bg-black/30 px-1 rounded">ADMIN_SECRET</code> — never share or commit it.
      </p>
      <div className="flex gap-2">
        <Input
          type="password"
          placeholder="Enter admin secret..."
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          className="bg-[var(--sf-black)] border-white/10 text-white flex-1"
          onKeyDown={(e) => e.key === "Enter" && claimMutation.mutate()}
        />
        <Button
          onClick={() => claimMutation.mutate()}
          disabled={claimMutation.isPending || !secret}
          className="bg-[var(--sf-gold)] text-black hover:bg-[var(--sf-gold)]/90 font-semibold"
        >
          {claimMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Claim"}
        </Button>
      </div>
    </GlassCard>
  );
}

function parseConfigString(configStr: string | undefined | null): Record<string, unknown> | null {
  if (!configStr || configStr.trim() === "") return null;
  try {
    return JSON.parse(configStr);
  } catch {
    return null;
  }
}

export default function AdminTemplates() {
  const { user, updateUser, login } = useAuth();
  const { toast } = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [editTemplate, setEditTemplate] = useState<BotTemplate | null>(null);
  const [deleteTemplate, setDeleteTemplate] = useState<BotTemplate | null>(null);

  const { data: templates = [], isLoading } = useQuery<BotTemplate[]>({
    queryKey: ["/api/templates"],
  });

  const createMutation = useMutation({
    mutationFn: (data: TemplateFormValues) => {
      const config = parseConfigString(data.config);
      return apiRequest("POST", "/api/templates", {
        ...data,
        price: data.price || null,
        imageUrl: data.imageUrl || null,
        config,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      setCreateOpen(false);
      toast({ title: "Template created successfully" });
    },
    onError: (err: any) => {
      toast({ title: "Failed to create template", description: err.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: TemplateFormValues }) => {
      const config = parseConfigString(data.config);
      return apiRequest("PUT", `/api/templates/${id}`, {
        ...data,
        price: data.price || null,
        imageUrl: data.imageUrl || null,
        config,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      setEditTemplate(null);
      toast({ title: "Template updated successfully" });
    },
    onError: (err: any) => {
      toast({ title: "Failed to update template", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/templates/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      setDeleteTemplate(null);
      toast({ title: "Template deleted" });
    },
    onError: (err: any) => {
      toast({ title: "Failed to delete template", description: err.message, variant: "destructive" });
    },
  });

  if (!user) return <Redirect to="/login" />;

  if (!user.isAdmin) {
    return (
      <div className="min-h-screen bg-[var(--sf-black)] text-white">
        <SfsContainer className="max-w-4xl mx-auto px-4 py-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-[var(--sf-gold)] hover:text-[var(--sf-gold-2)] transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-gradient-to-br from-[var(--sf-gold)] to-[var(--sf-gold-2)] rounded-xl flex items-center justify-center shadow-[var(--sf-glow-gold-sm)]">
              <ShieldCheck className="w-6 h-6 text-[var(--sf-black)]" />
            </div>
            <div>
              <GoldHeading level={1} className="text-2xl font-bold">Admin — Template Manager</GoldHeading>
              <p className="text-neutral-400 text-sm">Manage marketplace bot templates</p>
            </div>
          </div>
          <AdminClaimSection onSuccess={(newToken: string) => {
            login(newToken, { ...user!, isAdmin: true });
          }} />
        </SfsContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--sf-black)] text-white">
      <SfsContainer className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-[var(--sf-gold)] hover:text-[var(--sf-gold-2)] transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[var(--sf-gold)] to-[var(--sf-gold-2)] rounded-xl flex items-center justify-center shadow-[var(--sf-glow-gold-sm)]">
              <ShieldCheck className="w-6 h-6 text-[var(--sf-black)]" />
            </div>
            <div>
              <GoldHeading level={1} className="text-2xl font-bold">Admin — Template Manager</GoldHeading>
              <p className="text-neutral-400 text-sm">{templates.length} template{templates.length !== 1 ? "s" : ""} in marketplace</p>
            </div>
          </div>
          <Button
            onClick={() => setCreateOpen(true)}
            className="bg-[var(--sf-gold)] text-black hover:bg-[var(--sf-gold)]/90 font-semibold gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Template
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[var(--sf-gold)]/50 animate-spin" />
          </div>
        ) : templates.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <p className="text-neutral-400 mb-4">No templates yet. Add the first one!</p>
            <Button onClick={() => setCreateOpen(true)} className="bg-[var(--sf-gold)] text-[var(--sf-black)] hover:bg-[var(--sf-gold-2)] gap-2">
              <Plus className="w-4 h-4" /> Add Template
            </Button>
          </GlassCard>
        ) : (
          <GlassCard className="overflow-hidden p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="text-left px-4 py-3 text-[#A0A0A0] font-medium">Name</th>
                  <th className="text-left px-4 py-3 text-[#A0A0A0] font-medium">Platform</th>
                  <th className="text-left px-4 py-3 text-[#A0A0A0] font-medium">Category</th>
                  <th className="text-left px-4 py-3 text-[#A0A0A0] font-medium">Tier</th>
                  <th className="text-left px-4 py-3 text-[#A0A0A0] font-medium">Price</th>
                  <th className="text-right px-4 py-3 text-[#A0A0A0] font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {templates.map((template) => (
                  <tr key={template.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-white font-medium">{template.name}</p>
                        {template.description && (
                          <p className="text-[#A0A0A0] text-xs mt-0.5 line-clamp-1">{template.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-white capitalize">{template.platform}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-white capitalize">{template.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      {template.isPremium ? (
                        <Badge className="bg-[var(--sf-gold)]/20 text-[var(--sf-gold)] border-[var(--sf-gold)]/30 text-xs">Premium</Badge>
                      ) : (
                        <Badge className="bg-white/10 text-[#A0A0A0] border-white/10 text-xs">Free</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-white">
                      {template.price ? `$${template.price}` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditTemplate(template)}
                          className="text-[#A0A0A0] hover:text-white hover:bg-white/10 h-8 w-8 p-0"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteTemplate(template)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-400/10 h-8 w-8 p-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>
        )}
      </SfsContainer>

      {/* Create dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="bg-[var(--sf-black)] border-white/10 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Add New Template</DialogTitle>
          </DialogHeader>
          <TemplateForm
            onSubmit={(data) => createMutation.mutate(data)}
            isPending={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={!!editTemplate} onOpenChange={(open) => !open && setEditTemplate(null)}>
        <DialogContent className="bg-[var(--sf-black)] border-white/10 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Template</DialogTitle>
          </DialogHeader>
          {editTemplate && (
            <TemplateForm
              defaultValues={{
                name: editTemplate.name,
                description: editTemplate.description ?? "",
                category: editTemplate.category,
                platform: editTemplate.platform,
                isPremium: editTemplate.isPremium ?? false,
                price: editTemplate.price ?? "",
                imageUrl: editTemplate.imageUrl ?? "",
                config: editTemplate.config ? JSON.stringify(editTemplate.config, null, 2) : "",
              }}
              onSubmit={(data) => updateMutation.mutate({ id: editTemplate.id, data })}
              isPending={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTemplate} onOpenChange={(open) => !open && setDeleteTemplate(null)}>
        <AlertDialogContent className="bg-[var(--sf-black)] border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Template</AlertDialogTitle>
            <AlertDialogDescription className="text-[#A0A0A0]">
              Are you sure you want to delete <strong className="text-white">{deleteTemplate?.name}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/10 border-white/10 text-white hover:bg-white/20">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTemplate && deleteMutation.mutate(deleteTemplate.id)}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

