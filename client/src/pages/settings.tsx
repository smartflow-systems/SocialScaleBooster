import { useState } from "react";
import { Link } from "wouter";
import { Settings, ArrowLeft, User, Bell, CreditCard, Shield, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const settingsSections = [
  {
    icon: User,
    title: "Profile",
    description: "Your name, email and niche",
    available: true,
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Email and in-app alerts",
    available: false,
  },
  {
    icon: CreditCard,
    title: "Billing",
    description: "Plan, usage and invoices",
    available: false,
  },
  {
    icon: Shield,
    title: "Security",
    description: "Password and account access",
    available: false,
  },
];

const NICHES = ["Barber", "Salon / Hair", "Gym / Fitness", "Beauty / Skincare", "Tattoo Studio", "Other"];

export default function SettingsPage() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [niche, setNiche] = useState("");
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState("Profile");

  const handleSave = () => {
    setSaved(true);
    toast({ title: "Settings saved" });
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-primary-black">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/dashboard">
          <a className="inline-flex items-center gap-2 text-accent-gold hover:text-gold-trim transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </a>
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-accent-gold to-gold-trim rounded-xl flex items-center justify-center shadow-lg shadow-accent-gold/20">
            <Settings className="w-6 h-6 text-primary-black" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <p className="text-neutral-gray text-sm">Manage your account and preferences</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar nav */}
          <div className="space-y-1">
            {settingsSections.map(({ icon: Icon, title, description, available }) => (
              <button
                key={title}
                onClick={() => available && setActiveSection(title)}
                className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeSection === title
                    ? "bg-accent-gold/10 border border-accent-gold/30 text-accent-gold"
                    : available
                    ? "text-neutral-gray hover:bg-rich-brown/20 hover:text-white"
                    : "text-neutral-gray/40 cursor-not-allowed"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-none">{title}</p>
                  <p className="text-xs mt-0.5 opacity-60 truncate">{description}</p>
                </div>
                {!available && (
                  <span className="text-xs bg-rich-brown/30 text-neutral-gray/50 px-2 py-0.5 rounded-full flex-shrink-0">
                    Soon
                  </span>
                )}
                {available && activeSection !== title && (
                  <ChevronRight className="w-3 h-3 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>

          {/* Content panel */}
          <div className="md:col-span-2 border border-accent-gold/20 rounded-xl p-6 bg-rich-brown/10">
            {activeSection === "Profile" && (
              <div className="space-y-5">
                <h2 className="text-white font-bold text-lg">Profile</h2>

                <div>
                  <label className="text-sm text-neutral-gray mb-1.5 block">Your name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Danny R."
                    className="w-full bg-primary-black border border-accent-gold/20 rounded-lg px-4 py-2.5 text-white placeholder:text-neutral-gray/40 focus:outline-none focus:border-accent-gold/50"
                  />
                </div>

                <div>
                  <label className="text-sm text-neutral-gray mb-1.5 block">Email address</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="you@example.com"
                    className="w-full bg-primary-black border border-accent-gold/20 rounded-lg px-4 py-2.5 text-white placeholder:text-neutral-gray/40 focus:outline-none focus:border-accent-gold/50"
                  />
                </div>

                <div>
                  <label className="text-sm text-neutral-gray mb-1.5 block">Your niche</label>
                  <select
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    className="w-full bg-primary-black border border-accent-gold/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-accent-gold/50"
                  >
                    <option value="">Select your niche...</option>
                    {NICHES.map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                  <p className="text-xs text-neutral-gray/60 mt-1">
                    We use this to tailor your AI-generated content
                  </p>
                </div>

                <Button
                  onClick={handleSave}
                  className="bg-accent-gold text-primary-black font-bold hover:opacity-90 transition-opacity"
                >
                  {saved ? "✓ Saved" : "Save Changes"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
