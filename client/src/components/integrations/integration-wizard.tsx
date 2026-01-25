import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Check, AlertCircle, Zap, Link, Key, Shield, RefreshCw, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useSocialAccounts,
  useCreateSocialAccount,
  useDeleteSocialAccount,
  useVerifySocialAccount,
  platformInfo,
  type SocialAccount
} from "@/hooks/useSocialAccounts";

const platforms = [
  {
    name: 'Instagram',
    value: 'instagram',
    description: 'Connect Instagram Business Account for automated posting and engagement',
    icon: '📸',
    features: ['Auto-posting', 'Story scheduling', 'Engagement tracking', 'Hashtag optimization']
  },
  {
    name: 'TikTok',
    value: 'tiktok',
    description: 'Integrate TikTok for Business to leverage viral content opportunities',
    icon: '🎵',
    features: ['Video scheduling', 'Trend analysis', 'Viral optimization', 'Performance analytics']
  },
  {
    name: 'Facebook',
    value: 'facebook',
    description: 'Connect Facebook Pages for comprehensive social media management',
    icon: '👥',
    features: ['Page management', 'Ad automation', 'Audience insights', 'Cross-posting']
  },
  {
    name: 'Twitter',
    value: 'twitter',
    description: 'Automate Twitter engagement and content distribution',
    icon: '🐦',
    features: ['Tweet scheduling', 'Thread creation', 'Engagement automation', 'Trend monitoring']
  },
  {
    name: 'YouTube',
    value: 'youtube',
    description: 'Manage YouTube content and optimize video performance',
    icon: '📺',
    features: ['Video optimization', 'Thumbnail testing', 'Analytics tracking', 'Comment management']
  }
];

export default function IntegrationWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountHandle, setAccountHandle] = useState('');
  const [apiKey, setApiKey] = useState('');
  const toast = useToast();

  // Use real data from API
  const { data: accounts = [], isLoading } = useSocialAccounts();
  const createAccount = useCreateSocialAccount();
  const deleteAccount = useDeleteSocialAccount();
  const verifyAccount = useVerifySocialAccount();

  // Group accounts by platform for display
  const accountsByPlatform = accounts.reduce((acc, account) => {
    if (!acc[account.platform]) {
      acc[account.platform] = [];
    }
    acc[account.platform].push(account);
    return acc;
  }, {} as Record<string, SocialAccount[]>);

  // Get connection status for each platform
  const getPlatformStatus = (platformValue: string): { status: 'connected' | 'disconnected' | 'error'; count: number; accounts: SocialAccount[] } => {
    const platformAccounts = accountsByPlatform[platformValue] || [];
    if (platformAccounts.length === 0) {
      return { status: 'disconnected', count: 0, accounts: [] };
    }
    const hasError = platformAccounts.some(a => a.status === 'error');
    return {
      status: hasError ? 'error' : 'connected',
      count: platformAccounts.length,
      accounts: platformAccounts
    };
  };

  const connectPlatform = async () => {
    if (!selectedPlatform || !apiKey || !accountName) {
      toast.toast({
        title: "Missing Information",
        description: "Please enter account name and API key",
        variant: "destructive"
      });
      return;
    }

    try {
      await createAccount.mutateAsync({
        platform: selectedPlatform,
        accountName,
        accountHandle: accountHandle || undefined,
        apiKey,
      });

      const platformLabel = platforms.find(p => p.value === selectedPlatform)?.name || selectedPlatform;
      toast.toastSuccess("Account Connected", `${accountName} (${platformLabel}) is now connected`);

      // Reset form
      setCurrentStep(1);
      setSelectedPlatform('');
      setAccountName('');
      setAccountHandle('');
      setApiKey('');
    } catch (error: any) {
      toast.toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect account. Please try again.",
        variant: "destructive"
      });
    }
  };

  const disconnectAccount = async (account: SocialAccount) => {
    try {
      await deleteAccount.mutateAsync(account.id);
      toast.toastSuccess("Account Disconnected", `${account.accountName} has been removed`);
    } catch (error: any) {
      toast.toast({
        title: "Error",
        description: error.message || "Failed to disconnect account",
        variant: "destructive"
      });
    }
  };

  const testConnection = async (account: SocialAccount) => {
    try {
      await verifyAccount.mutateAsync(account.id);
      toast.toastSuccess("Connection Verified", `${account.accountName} is working correctly`);
    } catch (error: any) {
      toast.toast({
        title: "Verification Failed",
        description: error.message || "Connection test failed",
        variant: "destructive"
      });
    }
  };

  const stepperSteps = [
    { number: 1, title: "Select Platform", description: "Choose social media platform" },
    { number: 2, title: "API Configuration", description: "Enter authentication details" },
    { number: 3, title: "Test Connection", description: "Verify integration works" }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-card-bg border-secondary-brown">
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-secondary-brown rounded w-1/3"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-32 bg-secondary-brown rounded"></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Integration Overview */}
      <Card className="bg-card-bg border-secondary-brown">
        <CardHeader>
          <CardTitle className="text-accent-gold flex items-center">
            <Link className="w-5 h-5 mr-2" />
            Platform Integrations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {platforms.map((platform) => {
              const { status, count, accounts: platformAccounts } = getPlatformStatus(platform.value);
              return (
                <div key={platform.value} className="border border-secondary-brown rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <span className="text-xl mr-2">{platform.icon}</span>
                      <h4 className="font-semibold text-white">{platform.name}</h4>
                    </div>
                    <Badge
                      className={
                        status === 'connected'
                          ? 'bg-green-500 text-white'
                          : status === 'error'
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-500 text-white'
                      }
                    >
                      {status === 'connected' ? (
                        <><Check className="w-3 h-3 mr-1" /> {count} Connected</>
                      ) : status === 'error' ? (
                        <><AlertCircle className="w-3 h-3 mr-1" /> Error</>
                      ) : (
                        'Not Connected'
                      )}
                    </Badge>
                  </div>

                  {/* Show connected accounts */}
                  {platformAccounts.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {platformAccounts.map((account) => (
                        <div key={account.id} className="bg-secondary-brown rounded p-2 text-sm">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-white">{account.accountName}</span>
                              {account.accountHandle && (
                                <span className="text-neutral-gray ml-1">({account.accountHandle})</span>
                              )}
                            </div>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 text-neutral-gray hover:text-accent-gold"
                                onClick={() => testConnection(account)}
                                disabled={verifyAccount.isPending}
                              >
                                <RefreshCw className={`w-3 h-3 ${verifyAccount.isPending ? 'animate-spin' : ''}`} />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 text-red-400 hover:text-red-500"
                                onClick={() => disconnectAccount(account)}
                                disabled={deleteAccount.isPending}
                              >
                                ×
                              </Button>
                            </div>
                          </div>
                          {account.lastVerified && (
                            <p className="text-xs text-neutral-gray mt-1">
                              Verified: {new Date(account.lastVerified).toLocaleDateString()}
                            </p>
                          )}
                          {account.lastError && (
                            <p className="text-xs text-red-400 mt-1">{account.lastError}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <Button
                    size="sm"
                    className="w-full bg-accent-gold text-primary-black hover:bg-yellow-500"
                    onClick={() => {
                      setSelectedPlatform(platform.value);
                      setCurrentStep(2);
                    }}
                  >
                    {count > 0 ? 'Add Another Account' : 'Connect'}
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Integration Wizard */}
      <Card className="bg-card-bg border-secondary-brown">
        <CardHeader>
          <CardTitle className="text-accent-gold flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Integration Setup Wizard
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Progress Stepper */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              {stepperSteps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentStep >= step.number
                      ? 'bg-accent-gold text-primary-black'
                      : 'bg-secondary-brown text-neutral-gray'
                  }`}>
                    {currentStep > step.number ? <Check className="w-4 h-4" /> : step.number}
                  </div>
                  {index < stepperSteps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${
                      currentStep > step.number ? 'bg-accent-gold' : 'bg-secondary-brown'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <h3 className="text-white font-semibold">{stepperSteps[currentStep - 1]?.title}</h3>
              <p className="text-neutral-gray text-sm">{stepperSteps[currentStep - 1]?.description}</p>
            </div>
          </div>

          {/* Step Content */}
          <Tabs value={currentStep.toString()} className="w-full">
            <TabsContent value="1" className="mt-0">
              <div className="space-y-4">
                <h4 className="text-white font-semibold mb-4">Choose Platform to Connect</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {platforms.map((platform) => (
                    <div
                      key={platform.value}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedPlatform === platform.value
                          ? 'border-accent-gold bg-accent-gold bg-opacity-10'
                          : 'border-secondary-brown hover:border-accent-gold'
                      }`}
                      onClick={() => setSelectedPlatform(platform.value)}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{platform.icon}</span>
                        <div className="flex-1">
                          <h5 className="text-white font-semibold">{platform.name}</h5>
                          <p className="text-sm text-neutral-gray mb-2">{platform.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {platform.features.map((feature, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs bg-secondary-brown text-accent-gold">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  className="w-full bg-accent-gold text-primary-black hover:bg-yellow-500"
                  disabled={!selectedPlatform}
                  onClick={() => setCurrentStep(2)}
                >
                  Continue to API Setup
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="2" className="mt-0">
              <div className="space-y-4">
                <h4 className="text-white font-semibold mb-4">
                  Configure {platforms.find(p => p.value === selectedPlatform)?.name || selectedPlatform} Integration
                </h4>

                {/* Account Details */}
                <div className="space-y-3">
                  <div>
                    <Label className="text-white">Account Name *</Label>
                    <Input
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      placeholder="e.g., Main Store, Personal Brand"
                      className="bg-secondary-brown border-secondary-brown text-white"
                    />
                    <p className="text-xs text-neutral-gray mt-1">A friendly name to identify this account</p>
                  </div>

                  <div>
                    <Label className="text-white">Handle/Username (Optional)</Label>
                    <Input
                      value={accountHandle}
                      onChange={(e) => setAccountHandle(e.target.value)}
                      placeholder="@username"
                      className="bg-secondary-brown border-secondary-brown text-white"
                    />
                  </div>
                </div>

                {/* API Authentication */}
                <div className="bg-secondary-brown rounded-lg p-4 border border-accent-gold">
                  <div className="flex items-center space-x-2 mb-3">
                    <Shield className="w-5 h-5 text-accent-gold" />
                    <h5 className="text-white font-semibold">API Authentication</h5>
                  </div>
                  <p className="text-sm text-neutral-gray mb-4">
                    Your API keys are encrypted using AES-256 and stored securely. SmartFlow AI will never share your credentials.
                  </p>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-neutral-gray">API Key / Access Token *</Label>
                      <Input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your API key"
                        className="bg-primary-black border-secondary-brown text-white"
                      />
                    </div>
                    <div className="text-xs text-neutral-gray">
                      <p>• Go to {platforms.find(p => p.value === selectedPlatform)?.name} Developer Portal</p>
                      <p>• Create a new application</p>
                      <p>• Copy the API key/access token</p>
                      <p>• Paste it above</p>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-secondary-brown text-neutral-gray"
                    onClick={() => setCurrentStep(1)}
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1 bg-accent-gold text-primary-black hover:bg-yellow-500"
                    disabled={!apiKey || !accountName || createAccount.isPending}
                    onClick={connectPlatform}
                  >
                    {createAccount.isPending ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Key className="w-4 h-4 mr-2" />
                        Connect Account
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Connected Platforms Features */}
      <Card className="bg-card-bg border-secondary-brown">
        <CardHeader>
          <CardTitle className="text-accent-gold">Integration Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-gold rounded-lg flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-primary-black" />
              </div>
              <h5 className="text-white font-semibold mb-2">Automated Posting</h5>
              <p className="text-sm text-neutral-gray">Schedule and publish content across all connected platforms simultaneously</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-gold rounded-lg flex items-center justify-center mx-auto mb-3">
                <Link className="w-6 h-6 text-primary-black" />
              </div>
              <h5 className="text-white font-semibold mb-2">Cross-Platform Sync</h5>
              <p className="text-sm text-neutral-gray">Maintain consistent branding and messaging across all social channels</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-gold rounded-lg flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-primary-black" />
              </div>
              <h5 className="text-white font-semibold mb-2">Secure Connection</h5>
              <p className="text-sm text-neutral-gray">Enterprise-grade AES-256 encryption protects all your API keys and data</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
