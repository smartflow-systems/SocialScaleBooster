import { Link } from "wouter";
import { Settings, ArrowLeft, Bell, Zap } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useNotificationPrefs } from "@/hooks/use-notification-prefs";

export default function SettingsPage() {
  const { prefs, update } = useNotificationPrefs();

  return (
    <div className="min-h-screen bg-primary-black">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-accent-gold hover:text-gold-trim transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-accent-gold to-gold-trim rounded-xl flex items-center justify-center shadow-lg shadow-accent-gold/20">
            <Settings className="w-6 h-6 text-primary-black" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <p className="text-neutral-gray text-sm">Manage your account settings and preferences</p>
          </div>
        </div>

        <div className="space-y-6">
          <section className="border border-accent-gold/20 rounded-xl bg-rich-brown/20">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-accent-gold/10">
              <Bell className="w-5 h-5 text-accent-gold" />
              <div>
                <h2 className="text-base font-semibold text-white">Notification Preferences</h2>
                <p className="text-neutral-gray text-xs mt-0.5">Choose which events trigger badge and toast notifications</p>
              </div>
            </div>
            <div className="divide-y divide-accent-gold/10">
              <div className="flex items-center justify-between px-6 py-5">
                <div className="flex items-start gap-3">
                  <Zap className="w-4 h-4 text-accent-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-white">Badge pulse animation</p>
                    <p className="text-xs text-neutral-gray mt-0.5">
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
                  <Bell className="w-4 h-4 text-accent-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-white">Toast notifications</p>
                    <p className="text-xs text-neutral-gray mt-0.5">
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
          </section>
        </div>
      </div>
    </div>
  );
}
