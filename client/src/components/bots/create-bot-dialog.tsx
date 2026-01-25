import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bot, Plus, Sparkles, AlertCircle, Link } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertBotSchema } from "@shared/schema";
import { useSocialAccountsByPlatform, type SocialAccount } from "@/hooks/useSocialAccounts";

interface CreateBotDialogProps {
  isPremium: boolean;
  botCount: number;
  children?: React.ReactNode;
}

const platforms = [
  { value: "tiktok", label: "TikTok" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "twitter", label: "Twitter" },
  { value: "youtube", label: "YouTube" }
];

const ecommercePresets = [
  {
    id: "product-showcase",
    name: "Product Showcase",
    description: "Highlight product features with engaging visuals",
    config: { postType: "showcase", autoHashtags: true, productFocus: true }
  },
  {
    id: "sale-announcements",
    name: "Sale Announcements",
    description: "Create urgency with flash sales and limited offers",
    config: { postType: "sale", urgencyMarketing: true, countdownTimers: true }
  },
  {
    id: "customer-testimonials",
    name: "Customer Testimonials",
    description: "Share authentic customer reviews and success stories",
    config: { postType: "testimonial", socialProof: true, customerStories: true }
  },
  {
    id: "behind-scenes",
    name: "Behind the Scenes",
    description: "Show product creation and company culture",
    config: { postType: "bts", authentic: true, storytelling: true }
  }
];

export default function CreateBotDialog({ isPremium, botCount, children }: CreateBotDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    platform: "",
    preset: "",
    clientId: "",
    socialAccountId: ""
  });
  const toast = useToast();
  const queryClient = useQueryClient();

  // Fetch clients for the dropdown
  const { data: clients = [] } = useQuery({
    queryKey: ["/api/clients"],
    enabled: open,
  });

  // Fetch social accounts for the selected platform
  const { data: platformAccounts = [], isLoading: accountsLoading } = useSocialAccountsByPlatform(
    formData.platform || undefined
  );

  // Reset social account when platform changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, socialAccountId: "" }));
  }, [formData.platform]);

  const createBotMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/bots", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bots"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/status"] });
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      toast.toastSuccess(
        "Bot Created Successfully!",
        "Your new SmartFlow AI bot is ready to start generating sales!"
      );
      setOpen(false);
      setFormData({ name: "", description: "", platform: "", preset: "", clientId: "", socialAccountId: "" });
    },
    onError: (error: any) => {
      toast.toast({
        title: "Creation Failed",
        description: error.message || "Failed to create bot. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check bot limits for free users
    if (!isPremium && botCount >= 3) {
      toast.toastPremium(
        "Upgrade to SmartFlow Pro",
        "Free plan is limited to 3 bots. Upgrade to Pro for unlimited AI automation!"
      );
      return;
    }

    const selectedPreset = ecommercePresets.find(p => p.id === formData.preset);
    const config = selectedPreset ? selectedPreset.config : {};

    try {
      const botData = insertBotSchema.parse({
        name: formData.name,
        description: formData.description,
        platform: formData.platform,
        clientId: formData.clientId ? parseInt(formData.clientId) : undefined,
        socialAccountId: formData.socialAccountId ? parseInt(formData.socialAccountId) : undefined,
        config,
        userId: 1 // Will be replaced by server with authenticated user
      });

      createBotMutation.mutate(botData);
    } catch (error) {
      toast.toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
    }
  };

  const canCreateBot = isPremium || botCount < 3;
  const hasAccountsForPlatform = platformAccounts.length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            className="bg-accent-gold text-primary-black font-semibold gold-glow-hover"
            disabled={!canCreateBot}
          >
            <Bot className="w-4 h-4 mr-2" />
            Create New Bot
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-card-bg border-secondary-brown max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center">
            <Sparkles className="text-accent-gold w-6 h-6 mr-2" />
            Create E-Commerce Bot
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Bot Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="My Product Bot"
                className="bg-secondary-brown border-secondary-brown focus:border-accent-gold"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select value={formData.platform} onValueChange={(value) => setFormData({ ...formData, platform: value })}>
                <SelectTrigger className="bg-secondary-brown border-secondary-brown focus:border-accent-gold">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent className="bg-card-bg border-secondary-brown">
                  {platforms.map((platform) => (
                    <SelectItem key={platform.value} value={platform.value}>
                      {platform.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Social Account Selector - Shows after platform is selected */}
          {formData.platform && (
            <div className="space-y-2">
              <Label htmlFor="socialAccount" className="flex items-center">
                <Link className="w-4 h-4 mr-2 text-accent-gold" />
                Link to Social Account
              </Label>

              {accountsLoading ? (
                <div className="h-10 bg-secondary-brown rounded animate-pulse" />
              ) : hasAccountsForPlatform ? (
                <Select
                  value={formData.socialAccountId}
                  onValueChange={(value) => setFormData({ ...formData, socialAccountId: value })}
                >
                  <SelectTrigger className="bg-secondary-brown border-secondary-brown focus:border-accent-gold">
                    <SelectValue placeholder="Select account (optional)" />
                  </SelectTrigger>
                  <SelectContent className="bg-card-bg border-secondary-brown">
                    <SelectItem value="">No account linked</SelectItem>
                    {platformAccounts.map((account: SocialAccount) => (
                      <SelectItem key={account.id} value={account.id.toString()}>
                        <div className="flex items-center">
                          <span>{account.accountName}</span>
                          {account.accountHandle && (
                            <span className="text-neutral-gray ml-2 text-sm">
                              {account.accountHandle}
                            </span>
                          )}
                          {account.status === "active" && (
                            <Badge className="ml-2 bg-green-500 text-xs">Active</Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="bg-secondary-brown rounded-lg p-4 border border-dashed border-accent-gold">
                  <div className="flex items-center text-yellow-400">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    <span className="text-sm">No {formData.platform} accounts connected</span>
                  </div>
                  <p className="text-xs text-neutral-gray mt-2">
                    Go to the Integrations page to connect your {formData.platform} account first.
                    You can still create the bot without linking an account.
                  </p>
                </div>
              )}
              <p className="text-xs text-neutral-gray">
                Linking an account allows the bot to use its credentials for posting
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="client">Assign to Client (Optional)</Label>
            <Select value={formData.clientId} onValueChange={(value) => setFormData({ ...formData, clientId: value })}>
              <SelectTrigger className="bg-secondary-brown border-secondary-brown focus:border-accent-gold">
                <SelectValue placeholder="Select client (optional)" />
              </SelectTrigger>
              <SelectContent className="bg-card-bg border-secondary-brown">
                <SelectItem value="">No Client</SelectItem>
                {clients.map((client: any) => (
                  <SelectItem key={client.id} value={client.id.toString()}>
                    {client.businessName || client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-neutral-gray">Link this bot to a specific client for better tracking</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what this bot will do for your e-commerce business..."
              className="bg-secondary-brown border-secondary-brown focus:border-accent-gold"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>E-Commerce Preset</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ecommercePresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, preset: preset.id })}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    formData.preset === preset.id
                      ? 'border-accent-gold bg-accent-gold/10'
                      : 'border-secondary-brown hover:border-accent-gold'
                  }`}
                >
                  <h4 className="font-semibold text-sm mb-1">{preset.name}</h4>
                  <p className="text-xs text-neutral-gray">{preset.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 border-secondary-brown text-neutral-gray"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createBotMutation.isPending}
              className="flex-1 bg-accent-gold text-primary-black font-bold gold-glow-hover"
            >
              {createBotMutation.isPending ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-primary-black border-t-transparent rounded-full mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Bot
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
