import { Link } from "wouter";
import { Settings, ArrowLeft, Bell, Zap } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useNotificationPrefs } from "@/hooks/use-notification-prefs";
import { GlassCard, GoldHeading, SfsContainer } from "@/components/sfs";

export default function SettingsPage() {
  const { prefs, update } = useNotificationPrefs();

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

        <div className="space-y-6">
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
          </GlassCard>
        </div>
      </SfsContainer>
    </div>
  );
}
