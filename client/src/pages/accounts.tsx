import { useState } from "react";
import { Link } from "wouter";
import {
  Globe, ArrowLeft, Plus, CheckCircle2, XCircle, AlertCircle,
  Trash2, RefreshCw, Loader2, ChevronDown, ChevronUp, KeyRound, AtSign, Linkedin,
} from "lucide-react";
import { SiInstagram, SiTiktok, SiFacebook, SiX, SiYoutube } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { SocialAccount } from "@shared/schema";

const PLATFORMS = [
  { value: "instagram", label: "Instagram", Icon: SiInstagram, color: "#E1306C" },
  { value: "tiktok", label: "TikTok", Icon: SiTiktok, color: "#ffffff" },
  { value: "facebook", label: "Facebook", Icon: SiFacebook, color: "#1877F2" },
  { value: "twitter", label: "Twitter / X", Icon: SiX, color: "#ffffff" },
  { value: "youtube", label: "YouTube", Icon: SiYoutube, color: "#FF0000" },
  { value: "linkedin", label: "LinkedIn", Icon: Linkedin, color: "#0A66C2" },
];

function getPlatform(value: string) {
  return PLATFORMS.find((p) => p.value === value) ?? {
    value,
    label: value,
    Icon: Globe,
    color: "#FFD700",
  };
}

type SafeAccount = SocialAccount & { hasCredentials?: boolean };

function StatusBadge({ status }: { status: string | null }) {
  if (status === "active") {
    return (
      <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
        <CheckCircle2 className="w-3.5 h-3.5" /> Connected
      </span>
    );
  }
  if (status === "error") {
    return (
      <span className="flex items-center gap-1.5 text-xs font-medium text-red-400">
        <XCircle className="w-3.5 h-3.5" /> Error
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 text-xs font-medium text-neutral-400">
      <AlertCircle className="w-3.5 h-3.5" /> Disconnected
    </span>
  );
}

function AddAccountModal({ onClose }: { onClose: () => void }) {
  const { toast } = useToast();
  const [platform, setPlatform] = useState("instagram");
  const [accountName, setAccountName] = useState("");
  const [accountHandle, setAccountHandle] = useState("");
  const [credentialType, setCredentialType] = useState("api_key");
  const [apiKey, setApiKey] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [showCreds, setShowCreds] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/social-accounts", {
        platform,
        accountName,
        accountHandle: accountHandle || undefined,
        credentialType,
        apiKey: credentialType === "api_key" ? apiKey : undefined,
        accessToken: credentialType === "access_token" ? accessToken : undefined,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/social-accounts"] });
      toast({ title: "Account connected!", description: `${getPlatform(platform).label} account added successfully.` });
      onClose();
    },
    onError: (err: any) => {
      toast({ title: "Failed to add account", description: err.message, variant: "destructive" });
    },
  });

  const canSubmit = accountName.trim() && (credentialType === "api_key" ? apiKey.trim() : accessToken.trim());

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#111] border border-accent-gold/20 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent-gold/10 border border-accent-gold/30 flex items-center justify-center">
              <Globe className="w-4 h-4 text-accent-gold" />
            </div>
            <h2 className="text-white font-semibold text-lg">Connect Account</h2>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors text-xl leading-none">&times;</button>
        </div>

        <div className="space-y-4">
          {/* Platform */}
          <div>
            <label className="text-xs text-neutral-gray uppercase tracking-wider mb-2 block">Platform</label>
            <div className="grid grid-cols-3 gap-2">
              {PLATFORMS.map(({ value, label, Icon, color }) => (
                <button
                  key={value}
                  onClick={() => setPlatform(value)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all text-xs font-medium ${
                    platform === value
                      ? "border-accent-gold/60 bg-accent-gold/10 text-white"
                      : "border-white/10 text-neutral-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  <Icon size={18} style={{ color: platform === value ? color : undefined }} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Account name */}
          <div>
            <label className="text-sm text-neutral-gray mb-1.5 block">Account Label *</label>
            <input
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="e.g. Main Store, Personal Brand"
              className="w-full bg-primary-black border border-accent-gold/20 rounded-lg px-4 py-2.5 text-white placeholder:text-neutral-gray/50 focus:outline-none focus:border-accent-gold/50"
            />
          </div>

          {/* Handle */}
          <div>
            <label className="text-sm text-neutral-gray mb-1.5 flex items-center gap-1.5">
              <AtSign className="w-3.5 h-3.5" /> Username / Handle <span className="text-neutral-gray/50 text-xs">(optional)</span>
            </label>
            <input
              value={accountHandle}
              onChange={(e) => setAccountHandle(e.target.value)}
              placeholder="@yourbrand"
              className="w-full bg-primary-black border border-accent-gold/20 rounded-lg px-4 py-2.5 text-white placeholder:text-neutral-gray/50 focus:outline-none focus:border-accent-gold/50"
            />
          </div>

          {/* Credentials */}
          <div>
            <button
              onClick={() => setShowCreds((v) => !v)}
              className="flex items-center gap-2 text-sm text-accent-gold hover:text-gold-trim transition-colors mb-2"
            >
              <KeyRound className="w-4 h-4" />
              API Credentials
              {showCreds ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {showCreds && (
              <div className="space-y-3 bg-primary-black/50 border border-accent-gold/10 rounded-xl p-4">
                <div>
                  <label className="text-sm text-neutral-gray mb-1.5 block">Credential Type</label>
                  <select
                    value={credentialType}
                    onChange={(e) => setCredentialType(e.target.value)}
                    className="w-full bg-primary-black border border-accent-gold/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-accent-gold/50"
                  >
                    <option value="api_key">API Key</option>
                    <option value="access_token">Access Token</option>
                    <option value="oauth">OAuth</option>
                  </select>
                </div>
                {credentialType === "api_key" && (
                  <div>
                    <label className="text-sm text-neutral-gray mb-1.5 block">API Key *</label>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Paste your API key here"
                      className="w-full bg-primary-black border border-accent-gold/20 rounded-lg px-4 py-2.5 text-white placeholder:text-neutral-gray/50 focus:outline-none focus:border-accent-gold/50 font-mono text-sm"
                    />
                  </div>
                )}
                {credentialType === "access_token" && (
                  <div>
                    <label className="text-sm text-neutral-gray mb-1.5 block">Access Token *</label>
                    <input
                      type="password"
                      value={accessToken}
                      onChange={(e) => setAccessToken(e.target.value)}
                      placeholder="Paste your access token here"
                      className="w-full bg-primary-black border border-accent-gold/20 rounded-lg px-4 py-2.5 text-white placeholder:text-neutral-gray/50 focus:outline-none focus:border-accent-gold/50 font-mono text-sm"
                    />
                  </div>
                )}
                {credentialType === "oauth" && (
                  <p className="text-xs text-neutral-gray bg-neutral-900/60 rounded-lg px-4 py-3">
                    OAuth connections will be set up via the platform's authorisation flow. Credentials will be stored securely after you complete the flow.
                  </p>
                )}
                <p className="text-[10px] text-neutral-gray/50">
                  Credentials are encrypted with AES-256-GCM before storage and never exposed in plain text.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-white/10 text-neutral-gray hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || !canSubmit}
            className="flex-1 bg-gradient-to-r from-accent-gold to-gold-trim text-primary-black font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Connect Account"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function AccountCard({ account }: { account: SafeAccount }) {
  const { toast } = useToast();
  const plat = getPlatform(account.platform);
  const { Icon, color } = plat;

  const verifyMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/social-accounts/${account.id}/verify`);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/social-accounts"] });
      toast({ title: data.status === "active" ? "Connection verified!" : "Verification failed", description: data.message, variant: data.status === "active" ? "default" : "destructive" });
    },
    onError: (err: any) => {
      toast({ title: "Verification failed", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/social-accounts/${account.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/social-accounts"] });
      toast({ title: "Account disconnected" });
    },
    onError: (err: any) => {
      toast({ title: "Failed to disconnect", description: err.message, variant: "destructive" });
    },
  });

  return (
    <div className="border border-accent-gold/15 rounded-xl p-5 bg-rich-brown/10 hover:border-accent-gold/30 transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center flex-shrink-0">
            <Icon size={22} style={{ color }} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white font-semibold text-sm truncate">{account.accountName}</p>
            {account.accountHandle && (
              <p className="text-neutral-gray text-xs mt-0.5 truncate">@{account.accountHandle.replace(/^@/, "")}</p>
            )}
            <div className="flex items-center gap-3 mt-1.5">
              <StatusBadge status={account.status} />
              <span className="text-neutral-gray/50 text-xs">{plat.label}</span>
              {account.lastVerified && (
                <span className="text-neutral-gray/40 text-xs hidden sm:block">
                  Verified {new Date(account.lastVerified).toLocaleDateString()}
                </span>
              )}
            </div>
            {account.lastError && account.status === "error" && (
              <p className="text-red-400/80 text-xs mt-1.5 bg-red-500/5 border border-red-500/10 rounded px-2 py-1">{account.lastError}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            onClick={() => verifyMutation.mutate()}
            disabled={verifyMutation.isPending}
            variant="outline"
            size="sm"
            className="border-accent-gold/30 text-accent-gold hover:bg-accent-gold/10 hover:text-gold-trim text-xs px-3"
          >
            {verifyMutation.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            <span className="ml-1.5 hidden sm:inline">Test</span>
          </Button>
          <Button
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
            variant="outline"
            size="sm"
            className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 text-xs px-3"
          >
            {deleteMutation.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
            <span className="ml-1.5 hidden sm:inline">Remove</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Accounts() {
  const [showAdd, setShowAdd] = useState(false);

  const { data: accounts = [], isLoading } = useQuery<SafeAccount[]>({
    queryKey: ["/api/social-accounts"],
  });

  const byPlatform: Record<string, SafeAccount[]> = {};
  for (const acct of accounts) {
    if (!byPlatform[acct.platform]) byPlatform[acct.platform] = [];
    byPlatform[acct.platform].push(acct);
  }

  const activeCount = accounts.filter((a) => a.status === "active").length;

  return (
    <div className="min-h-screen bg-primary-black">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/dashboard">
          <a className="inline-flex items-center gap-2 text-accent-gold hover:text-gold-trim transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </a>
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-accent-gold to-gold-trim rounded-xl flex items-center justify-center shadow-lg shadow-accent-gold/20">
              <Globe className="w-6 h-6 text-primary-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Connected Accounts</h1>
              <p className="text-neutral-gray text-sm">
                {accounts.length > 0
                  ? `${accounts.length} account${accounts.length !== 1 ? "s" : ""} · ${activeCount} active`
                  : "Link your social media profiles to get started"}
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowAdd(true)}
            className="bg-gradient-to-r from-accent-gold to-gold-trim text-primary-black font-semibold hover:opacity-90 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Connect Account</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>

        {/* Stats row */}
        {accounts.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "Total Accounts", value: accounts.length },
              { label: "Active", value: accounts.filter((a) => a.status === "active").length },
              { label: "Platforms", value: Object.keys(byPlatform).length },
            ].map(({ label, value }) => (
              <div key={label} className="border border-accent-gold/15 rounded-xl p-4 bg-rich-brown/10 text-center">
                <p className="text-2xl font-bold text-accent-gold">{value}</p>
                <p className="text-neutral-gray text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Account list */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-accent-gold animate-spin" />
          </div>
        ) : accounts.length === 0 ? (
          <div className="border border-accent-gold/20 rounded-xl p-12 bg-rich-brown/10 text-center">
            <div className="flex justify-center gap-3 mb-5">
              {[SiInstagram, SiTiktok, SiFacebook, SiX].map((Icon, i) => (
                <div key={i} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Icon size={18} className="text-neutral-500" />
                </div>
              ))}
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">No accounts connected yet</h2>
            <p className="text-neutral-gray max-w-sm mx-auto mb-6 text-sm">
              Connect your social media profiles to start automating posts, scheduling content, and tracking performance.
            </p>
            <Button
              onClick={() => setShowAdd(true)}
              className="bg-gradient-to-r from-accent-gold to-gold-trim text-primary-black font-semibold hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Connect Your First Account
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {accounts.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
          </div>
        )}

        {/* Platform tiles */}
        {accounts.length > 0 && (
          <div className="mt-10">
            <h2 className="text-white font-semibold mb-4">Add More Platforms</h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {PLATFORMS.map(({ value, label, Icon, color }) => {
                const connected = byPlatform[value]?.length ?? 0;
                return (
                  <button
                    key={value}
                    onClick={() => setShowAdd(true)}
                    className="flex flex-col items-center gap-2 p-4 border border-white/10 rounded-xl hover:border-accent-gold/30 hover:bg-accent-gold/5 transition-all group"
                  >
                    <Icon size={24} style={{ color }} className="opacity-80 group-hover:opacity-100 transition-opacity" />
                    <span className="text-xs text-neutral-gray group-hover:text-white transition-colors">{label}</span>
                    {connected > 0 && (
                      <span className="text-[10px] text-emerald-400 font-medium">{connected} linked</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {showAdd && <AddAccountModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
