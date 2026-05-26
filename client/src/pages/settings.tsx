import { Link } from "wouter";
import { Settings, ArrowLeft, Bell, Zap, User, Building2, Lock } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useNotificationPrefs } from "@/hooks/use-notification-prefs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { GlassCard, GoldButton, GhostButton, GoldHeading, SfsContainer } from "@/components/sfs";
import { useEffect } from "react";

const DEFAULT_PREFS = { badgePulse: true, toastNotifications: true };

const profileSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters").max(50),
  email: z.string().email("Invalid email address").or(z.literal("")),
  businessName: z.string().max(100).optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

interface UserProfile {
  id: number;
  username: string;
  email: string;
  businessName: string;
  isPremium: boolean;
  isAdmin: boolean;
}

export default function SettingsPage() {
  const { prefs, update } = useNotificationPrefs();
  const { toast } = useToast();
  const { updateUser } = useAuth();
  const queryClient = useQueryClient();

  const handleSave = () =>
    toast({ title: "Preferences saved", description: "Your notification settings are up to date." });

  const handleReset = () => {
    update(DEFAULT_PREFS);
    toast({ title: "Preferences reset", description: "Notification settings have been restored to defaults." });
  };

  const { data: profile, isLoading: profileLoading } = useQuery<UserProfile>({
    queryKey: ["/api/user/profile"],
  });

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      email: "",
      businessName: "",
    },
  });

  useEffect(() => {
    if (profile) {
      profileForm.reset({
        username: profile.username,
        email: profile.email ?? "",
        businessName: profile.businessName ?? "",
      });
    }
  }, [profile]);

  const profileMutation = useMutation({
    mutationFn: (values: ProfileFormValues) =>
      apiRequest("PATCH", "/api/user/profile", values),
    onSuccess: async (res) => {
      const updated = await res.json();
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
      updateUser({
        username: updated.username,
        email: updated.email,
        businessName: updated.businessName,
      });
      toast({ title: "Profile updated", description: "Your profile has been saved successfully." });
    },
    onError: (err: unknown) => {
      const raw = err instanceof Error ? err.message : "";
      const colonIdx = raw.indexOf(": ");
      const body = colonIdx >= 0 ? raw.slice(colonIdx + 2) : raw;
      let message = "Failed to update profile";
      try {
        const parsed = JSON.parse(body) as { message?: string };
        if (typeof parsed.message === "string") message = parsed.message;
      } catch {
        if (body) message = body;
      }
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const passwordMutation = useMutation({
    mutationFn: (values: PasswordFormValues) =>
      apiRequest("PATCH", "/api/user/password", {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }),
    onSuccess: () => {
      passwordForm.reset();
      toast({ title: "Password changed", description: "Your password has been updated successfully." });
    },
    onError: (err: unknown) => {
      const raw = err instanceof Error ? err.message : "";
      const colonIdx = raw.indexOf(": ");
      const body = colonIdx >= 0 ? raw.slice(colonIdx + 2) : raw;
      let message = "Failed to change password";
      try {
        const parsed = JSON.parse(body) as { message?: string };
        if (typeof parsed.message === "string") message = parsed.message;
      } catch {
        if (body) message = body;
      }
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });

  return (
    <div className="min-h-screen bg-[var(--sf-black)] text-white">
      <SfsContainer className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-[var(--sf-gold)] hover:text-[var(--sf-gold-2)] transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-[var(--sf-gold)] to-[var(--sf-gold-2)] rounded-xl flex items-center justify-center shadow-[var(--sf-glow-gold-sm)]">
            <Settings className="w-6 h-6 text-[var(--sf-black)]" />
          </div>
          <div>
            <GoldHeading level={1} className="text-2xl font-bold">Settings</GoldHeading>
            <p className="text-neutral-400 text-sm">Manage your account settings and preferences</p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <GlassCard className="p-0 overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--sf-gold)]/10">
                <User className="w-5 h-5 text-[var(--sf-gold)]" />
                <div>
                  <GoldHeading level={3} className="text-base font-semibold">Profile Information</GoldHeading>
                  <p className="text-neutral-400 text-xs mt-0.5">Update your display name, email address, and business name</p>
                </div>
              </div>
              {profileLoading ? (
                <div className="px-6 py-8 text-center text-neutral-400 text-sm">Loading profile…</div>
              ) : (
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit((v) => profileMutation.mutate(v))}>
                    <div className="px-6 py-6 space-y-5">
                      <FormField
                        control={profileForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm text-neutral-300 flex items-center gap-2">
                              <User className="w-3.5 h-3.5 text-[var(--sf-gold)]" />
                              Username
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Your username"
                                className="bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus:border-[var(--sf-gold)]/50"
                              />
                            </FormControl>
                            <FormMessage className="text-red-400 text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm text-neutral-300 flex items-center gap-2">
                              <User className="w-3.5 h-3.5 text-[var(--sf-gold)]" />
                              Email address
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                placeholder="you@example.com"
                                className="bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus:border-[var(--sf-gold)]/50"
                              />
                            </FormControl>
                            <FormMessage className="text-red-400 text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="businessName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm text-neutral-300 flex items-center gap-2">
                              <Building2 className="w-3.5 h-3.5 text-[var(--sf-gold)]" />
                              Business name
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Your business or brand name"
                                className="bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus:border-[var(--sf-gold)]/50"
                              />
                            </FormControl>
                            <FormMessage className="text-red-400 text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--sf-gold)]/10">
                      <GhostButton type="button" onClick={() => profile && profileForm.reset({
                        username: profile.username,
                        email: profile.email ?? "",
                        businessName: profile.businessName ?? "",
                      })}>
                        Reset
                      </GhostButton>
                      <GoldButton type="submit" disabled={profileMutation.isPending}>
                        {profileMutation.isPending ? "Saving…" : "Save changes"}
                      </GoldButton>
                    </div>
                  </form>
                </Form>
              )}
            </GlassCard>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <GlassCard className="p-0 overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--sf-gold)]/10">
                <Lock className="w-5 h-5 text-[var(--sf-gold)]" />
                <div>
                  <GoldHeading level={3} className="text-base font-semibold">Change Password</GoldHeading>
                  <p className="text-neutral-400 text-xs mt-0.5">Set a new password for your account</p>
                </div>
              </div>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit((v) => passwordMutation.mutate(v))}>
                  <div className="px-6 py-6 space-y-5">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm text-neutral-300">Current password</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              placeholder="Enter your current password"
                              className="bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus:border-[var(--sf-gold)]/50"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm text-neutral-300">New password</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              placeholder="At least 8 characters"
                              className="bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus:border-[var(--sf-gold)]/50"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm text-neutral-300">Confirm new password</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              placeholder="Re-enter your new password"
                              className="bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus:border-[var(--sf-gold)]/50"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--sf-gold)]/10">
                    <GhostButton type="button" onClick={() => passwordForm.reset()}>
                      Clear
                    </GhostButton>
                    <GoldButton type="submit" disabled={passwordMutation.isPending}>
                      {passwordMutation.isPending ? "Updating…" : "Update password"}
                    </GoldButton>
                  </div>
                </form>
              </Form>
            </GlassCard>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <GlassCard className="p-0 overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--sf-gold)]/10">
                <Bell className="w-5 h-5 text-[var(--sf-gold)]" />
                <div>
                  <GoldHeading level={3} className="text-base font-semibold">Notification Preferences</GoldHeading>
                  <p className="text-neutral-400 text-xs mt-0.5">Choose which events trigger badge and toast notifications</p>
                </div>
              </div>
              <div className="divide-y divide-[var(--sf-gold)]/10">
                <div className="flex items-center justify-between px-6 py-5">
                  <div className="flex items-start gap-3">
                    <Zap className="w-4 h-4 text-[var(--sf-gold)] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-white">Badge pulse animation</p>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        Animate the scheduler badge when the scheduled post count changes
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={prefs.badgePulse}
                    onCheckedChange={(checked) => update({ badgePulse: checked })}
                  />
                </div>
                <div className="flex items-center justify-between px-6 py-5">
                  <div className="flex items-start gap-3">
                    <Bell className="w-4 h-4 text-[var(--sf-gold)] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-white">Toast notifications</p>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        Show a pop-up toast when posts are published or newly scheduled
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={prefs.toastNotifications}
                    onCheckedChange={(checked) => update({ toastNotifications: checked })}
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--sf-gold)]/10">
                <GhostButton onClick={handleReset}>Reset</GhostButton>
                <GoldButton onClick={handleSave}>Save</GoldButton>
              </div>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </SfsContainer>
    </div>
  );
}
