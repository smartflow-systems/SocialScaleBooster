import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, DollarSign, TrendingUp, Bot, Plus, Trash2, Edit, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";

interface Client {
  id: number;
  businessName: string;
  contactEmail: string | null;
  contactPhone: string | null;
  monthlyFee: string;
  status: string;
  createdAt: Date;
  botCount?: number;
  totalRevenue?: number;
}

export default function ClientsPage() {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    businessName: "",
    contactEmail: "",
    contactPhone: "",
    monthlyFee: ""
  });

  // Fetch clients
  const { data: clients = [], isLoading } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  // Create client mutation
  const createClientMutation = useMutation({
    mutationFn: async (clientData: typeof formData) => {
      return await apiRequest("POST", "/api/clients", clientData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      setIsAddDialogOpen(false);
      setFormData({ businessName: "", contactEmail: "", contactPhone: "", monthlyFee: "" });
    },
  });

  // Delete client mutation
  const deleteClientMutation = useMutation({
    mutationFn: async (clientId: number) => {
      return await apiRequest("DELETE", `/api/clients/${clientId}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
    },
  });

  // Calculate summary stats
  const totalClients = clients.length;
  const totalMonthlyRevenue = clients.reduce((sum, client) => sum + parseFloat(client.monthlyFee || "0"), 0);
  const totalBotRevenue = clients.reduce((sum, client) => sum + (client.totalRevenue || 0), 0);
  const totalActiveBots = clients.reduce((sum, client) => sum + (client.botCount || 0), 0);

  const handleAddClient = () => {
    createClientMutation.mutate(formData);
  };

  const handleDeleteClient = (clientId: number) => {
    if (confirm("Are you sure you want to delete this client? This will also delete all their bots.")) {
      deleteClientMutation.mutate(clientId);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="bg-card-bg border-b border-secondary-brown">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.href = "/dashboard"}
                className="text-text-secondary hover:text-accent-gold"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Users className="text-accent-gold w-8 h-8" />
              <span className="text-xl font-bold text-text-primary">Client Management</span>
            </div>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-accent-gold text-dark-bg hover:bg-gold-dark font-bold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Client
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card-bg border-secondary-brown">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text-secondary">Total Clients</CardTitle>
              <Users className="h-4 w-4 text-accent-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text-primary">{totalClients}</div>
            </CardContent>
          </Card>

          <Card className="bg-card-bg border-secondary-brown">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text-secondary">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-accent-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text-primary">£{totalMonthlyRevenue.toFixed(2)}</div>
              <p className="text-xs text-text-secondary mt-1">From client fees</p>
            </CardContent>
          </Card>

          <Card className="bg-card-bg border-secondary-brown">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text-secondary">Bot Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-accent-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text-primary">£{totalBotRevenue.toFixed(2)}</div>
              <p className="text-xs text-text-secondary mt-1">Generated by bots</p>
            </CardContent>
          </Card>

          <Card className="bg-card-bg border-secondary-brown">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text-secondary">Active Bots</CardTitle>
              <Bot className="h-4 w-4 text-accent-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text-primary">{totalActiveBots}</div>
            </CardContent>
          </Card>
        </div>

        {/* Client List */}
        <Card className="bg-card-bg border-secondary-brown">
          <CardHeader>
            <CardTitle className="text-text-primary">Your Clients</CardTitle>
            <CardDescription className="text-text-secondary">
              Manage your e-commerce clients and their social media bots
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-text-secondary">Loading clients...</div>
            ) : clients.length === 0 ? (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-text-secondary mb-4" />
                <h3 className="text-lg font-medium text-text-primary mb-2">No clients yet</h3>
                <p className="text-text-secondary mb-4">Add your first client to start managing their social media bots</p>
                <Button
                  onClick={() => setIsAddDialogOpen(true)}
                  className="bg-accent-gold text-dark-bg hover:bg-gold-dark font-bold"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Client
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {clients.map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between p-4 bg-dark-bg border border-secondary-brown rounded-lg hover:border-accent-gold transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-text-primary">{client.businessName}</h3>
                        <Badge className={client.status === "active" ? "bg-green-900 text-green-300" : "bg-gray-700 text-gray-300"}>
                          {client.status}
                        </Badge>
                      </div>
                      {client.contactEmail && (
                        <p className="text-sm text-text-secondary">{client.contactEmail}</p>
                      )}
                      <div className="flex items-center space-x-6 mt-2">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-accent-gold" />
                          <span className="text-sm text-text-primary font-semibold">£{client.monthlyFee}/mo</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Bot className="w-4 h-4 text-accent-gold" />
                          <span className="text-sm text-text-secondary">{client.botCount || 0} bots</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="w-4 h-4 text-accent-gold" />
                          <span className="text-sm text-text-secondary">£{(client.totalRevenue || 0).toFixed(2)} revenue</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.location.href = `/clients/${client.id}`}
                        className="text-text-secondary hover:text-accent-gold"
                      >
                        View Details
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClient(client.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Add Client Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-card-bg border-secondary-brown text-text-primary">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription className="text-text-secondary">
              Add a new e-commerce business to manage their social media bots
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name *</Label>
              <Input
                id="businessName"
                placeholder="Joe's Sneakers"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="bg-dark-bg border-secondary-brown text-text-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="joe@sneakers.com"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="bg-dark-bg border-secondary-brown text-text-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                placeholder="+44 7700 900000"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="bg-dark-bg border-secondary-brown text-text-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthlyFee">Monthly Fee (£) *</Label>
              <Input
                id="monthlyFee"
                type="number"
                placeholder="200"
                value={formData.monthlyFee}
                onChange={(e) => setFormData({ ...formData, monthlyFee: e.target.value })}
                className="bg-dark-bg border-secondary-brown text-text-primary"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsAddDialogOpen(false)}
              className="text-text-secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddClient}
              disabled={!formData.businessName || !formData.monthlyFee || createClientMutation.isPending}
              className="bg-accent-gold text-dark-bg hover:bg-gold-dark font-bold"
            >
              {createClientMutation.isPending ? "Creating..." : "Create Client"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
