import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Check, AlertCircle, Plus, Trash2, RefreshCw, Edit, Users, Shield, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useSocialAccounts,
  useCreateSocialAccount,
  useDeleteSocialAccount,
  useVerifySocialAccount,
  useUpdateSocialAccount,
  platformInfo,
  type SocialAccount
} from "@/hooks/useSocialAccounts";

const platforms = [
  { value: "instagram", label: "Instagram", icon: "camera" },
  { value: "tiktok", label: "TikTok", icon: "music" },
  { value: "facebook", label: "Facebook", icon: "facebook" },
  { value: "twitter", label: "Twitter/X", icon: "twitter" },
  { value: "youtube", label: "YouTube", icon: "youtube" },
];

export default function AccountManager() {
  const { data: accounts = [], isLoading } = useSocialAccounts();
  const createAccount = useCreateSocialAccount();
  const deleteAccount = useDeleteSocialAccount();
  const verifyAccount = useVerifySocialAccount();
  const updateAccount = useUpdateSocialAccount();
  const toast = useToast();

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<SocialAccount | null>(null);
  const [newAccount, setNewAccount] = useState({
    platform: "",
    accountName: "",
    accountHandle: "",
    apiKey: "",
  });

  // Group accounts by platform
  const accountsByPlatform = accounts.reduce((acc, account) => {
    if (!acc[account.platform]) {
      acc[account.platform] = [];
    }
    acc[account.platform].push(account);
    return acc;
  }, {} as Record<string, SocialAccount[]>);

  const handleAddAccount = async () => {
    if (!newAccount.platform || !newAccount.accountName || !newAccount.apiKey) {
      toast.toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await createAccount.mutateAsync({
        platform: newAccount.platform,
        accountName: newAccount.accountName,
        accountHandle: newAccount.accountHandle || undefined,
        apiKey: newAccount.apiKey,
      });

      toast.toastSuccess("Account Connected", `${newAccount.accountName} has been connected successfully`);
      setAddDialogOpen(false);
      setNewAccount({ platform: "", accountName: "", accountHandle: "", apiKey: "" });
    } catch (error: any) {
      toast.toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect account",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = async (account: SocialAccount) => {
    try {
      await deleteAccount.mutateAsync(account.id);
      toast.toastSuccess("Account Removed", `${account.accountName} has been disconnected`);
    } catch (error: any) {
      toast.toast({
        title: "Error",
        description: error.message || "Failed to remove account",
        variant: "destructive",
      });
    }
  };

  const handleVerifyAccount = async (account: SocialAccount) => {
    try {
      await verifyAccount.mutateAsync(account.id);
      toast.toastSuccess("Connection Verified", `${account.accountName} connection is working`);
    } catch (error: any) {
      toast.toast({
        title: "Verification Failed",
        description: error.message || "Connection test failed",
        variant: "destructive",
      });
    }
  };

  const handleEditAccount = async () => {
    if (!selectedAccount) return;

    try {
      await updateAccount.mutateAsync({
        id: selectedAccount.id,
        data: {
          accountName: selectedAccount.accountName,
          accountHandle: selectedAccount.accountHandle || undefined,
        },
      });

      toast.toastSuccess("Account Updated", "Account details have been updated");
      setEditDialogOpen(false);
      setSelectedAccount(null);
    } catch (error: any) {
      toast.toast({
        title: "Update Failed",
        description: error.message || "Failed to update account",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-500 text-white">
            <Check className="w-3 h-3 mr-1" /> Active
          </Badge>
        );
      case "error":
        return (
          <Badge className="bg-red-500 text-white">
            <AlertCircle className="w-3 h-3 mr-1" /> Error
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-500 text-white">Disconnected</Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-card-bg border-secondary-brown">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-secondary-brown rounded w-1/3"></div>
            <div className="h-24 bg-secondary-brown rounded"></div>
            <div className="h-24 bg-secondary-brown rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-accent-gold flex items-center">
            <Users className="w-6 h-6 mr-2" />
            Connected Accounts
          </h2>
          <p className="text-neutral-gray text-sm mt-1">
            Manage your social media accounts across all platforms
          </p>
        </div>

        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent-gold text-primary-black hover:bg-yellow-500">
              <Plus className="w-4 h-4 mr-2" />
              Connect Account
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card-bg border-secondary-brown">
            <DialogHeader>
              <DialogTitle className="text-accent-gold">Connect New Account</DialogTitle>
              <DialogDescription className="text-neutral-gray">
                Add a new social media account to your SmartFlow dashboard
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div>
                <Label className="text-white">Platform</Label>
                <Select
                  value={newAccount.platform}
                  onValueChange={(value) => setNewAccount({ ...newAccount, platform: value })}
                >
                  <SelectTrigger className="bg-secondary-brown border-secondary-brown text-white">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent className="bg-card-bg border-secondary-brown">
                    {platforms.map((platform) => (
                      <SelectItem key={platform.value} value={platform.value} className="text-white">
                        {platform.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white">Account Name</Label>
                <Input
                  value={newAccount.accountName}
                  onChange={(e) => setNewAccount({ ...newAccount, accountName: e.target.value })}
                  placeholder="e.g., Main Store, Personal Brand"
                  className="bg-secondary-brown border-secondary-brown text-white"
                />
                <p className="text-xs text-neutral-gray mt-1">A friendly name to identify this account</p>
              </div>

              <div>
                <Label className="text-white">Handle/Username (Optional)</Label>
                <Input
                  value={newAccount.accountHandle}
                  onChange={(e) => setNewAccount({ ...newAccount, accountHandle: e.target.value })}
                  placeholder="@username"
                  className="bg-secondary-brown border-secondary-brown text-white"
                />
              </div>

              <div className="bg-secondary-brown rounded-lg p-4 border border-accent-gold">
                <div className="flex items-center space-x-2 mb-3">
                  <Shield className="w-5 h-5 text-accent-gold" />
                  <h5 className="text-white font-semibold">API Credentials</h5>
                </div>
                <p className="text-sm text-neutral-gray mb-3">
                  Your credentials are encrypted and stored securely using AES-256 encryption.
                </p>
                <div>
                  <Label className="text-white">API Key / Access Token</Label>
                  <Input
                    type="password"
                    value={newAccount.apiKey}
                    onChange={(e) => setNewAccount({ ...newAccount, apiKey: e.target.value })}
                    placeholder="Enter your API key"
                    className="bg-primary-black border-secondary-brown text-white"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1 border-secondary-brown text-neutral-gray"
                  onClick={() => setAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-accent-gold text-primary-black hover:bg-yellow-500"
                  onClick={handleAddAccount}
                  disabled={createAccount.isPending}
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
          </DialogContent>
        </Dialog>
      </div>

      {/* Accounts List by Platform */}
      {accounts.length === 0 ? (
        <Card className="bg-card-bg border-secondary-brown">
          <CardContent className="p-8 text-center">
            <Users className="w-12 h-12 text-neutral-gray mx-auto mb-4" />
            <h3 className="text-white font-semibold text-lg mb-2">No Accounts Connected</h3>
            <p className="text-neutral-gray mb-4">
              Connect your social media accounts to start creating bots and automating your content.
            </p>
            <Button
              className="bg-accent-gold text-primary-black hover:bg-yellow-500"
              onClick={() => setAddDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Connect Your First Account
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(accountsByPlatform).map(([platform, platformAccounts]) => (
            <Card key={platform} className="bg-card-bg border-secondary-brown">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center text-lg">
                  <span className="mr-2">{platformInfo[platform]?.name || platform}</span>
                  <Badge variant="secondary" className="bg-secondary-brown text-accent-gold">
                    {platformAccounts.length} account{platformAccounts.length !== 1 ? "s" : ""}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {platformAccounts.map((account) => (
                  <div
                    key={account.id}
                    className="border border-secondary-brown rounded-lg p-4 hover:border-accent-gold transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-semibold">{account.accountName}</h4>
                        {account.accountHandle && (
                          <p className="text-neutral-gray text-sm">{account.accountHandle}</p>
                        )}
                        {account.lastVerified && (
                          <p className="text-xs text-neutral-gray mt-1">
                            Last verified: {new Date(account.lastVerified).toLocaleDateString()}
                          </p>
                        )}
                        {account.lastError && (
                          <p className="text-xs text-red-400 mt-1">{account.lastError}</p>
                        )}
                      </div>
                      {getStatusBadge(account.status)}
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-secondary-brown text-neutral-gray hover:bg-secondary-brown"
                        onClick={() => handleVerifyAccount(account)}
                        disabled={verifyAccount.isPending}
                      >
                        <RefreshCw className={`w-3 h-3 mr-1 ${verifyAccount.isPending ? "animate-spin" : ""}`} />
                        Verify
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        className="border-secondary-brown text-neutral-gray hover:bg-secondary-brown"
                        onClick={() => {
                          setSelectedAccount(account);
                          setEditDialogOpen(true);
                        }}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Remove
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-card-bg border-secondary-brown">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">Remove Account?</AlertDialogTitle>
                            <AlertDialogDescription className="text-neutral-gray">
                              This will disconnect "{account.accountName}" and unlink it from any bots using this account.
                              The bots will continue to work but won't have account credentials attached.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-secondary-brown border-secondary-brown text-white">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-500 text-white hover:bg-red-600"
                              onClick={() => handleDeleteAccount(account)}
                            >
                              Remove Account
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-card-bg border-secondary-brown">
          <DialogHeader>
            <DialogTitle className="text-accent-gold">Edit Account</DialogTitle>
            <DialogDescription className="text-neutral-gray">
              Update account details
            </DialogDescription>
          </DialogHeader>

          {selectedAccount && (
            <div className="space-y-4 mt-4">
              <div>
                <Label className="text-white">Account Name</Label>
                <Input
                  value={selectedAccount.accountName}
                  onChange={(e) => setSelectedAccount({ ...selectedAccount, accountName: e.target.value })}
                  className="bg-secondary-brown border-secondary-brown text-white"
                />
              </div>

              <div>
                <Label className="text-white">Handle/Username</Label>
                <Input
                  value={selectedAccount.accountHandle || ""}
                  onChange={(e) => setSelectedAccount({ ...selectedAccount, accountHandle: e.target.value })}
                  placeholder="@username"
                  className="bg-secondary-brown border-secondary-brown text-white"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1 border-secondary-brown text-neutral-gray"
                  onClick={() => {
                    setEditDialogOpen(false);
                    setSelectedAccount(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-accent-gold text-primary-black hover:bg-yellow-500"
                  onClick={handleEditAccount}
                  disabled={updateAccount.isPending}
                >
                  {updateAccount.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
