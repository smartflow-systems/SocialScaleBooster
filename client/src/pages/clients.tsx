import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, DollarSign, TrendingUp, Bot, Plus, Trash2, Edit, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/api";

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
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bot, Users, DollarSign, Plus, ArrowLeft, Building2, Mail, Phone, TrendingUp, MoreVertical, Trash2, Edit } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";

interface Client {
  id: number;
  name: string;
  businessName: string | null;
  email: string | null;
  phone: string | null;
  industry: string | null;
  monthlyFee: string;
  status: string;
  notes: string | null;
  createdAt: string;
  totalRevenue: number;
  botCount: number;
}

export default function Clients() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    email: "",
    phone: "",
    industry: "",
    monthlyFee: "",
    notes: ""
  });
  const { toast } = useToast();

  const { data: clients = [], isLoading } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  // Create client mutation
  const createClientMutation = useMutation({
    mutationFn: async (clientData: typeof formData) => {
      return await apiRequest("POST", "/api/clients", clientData);
  const createClientMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/clients", data);
      return response.json();
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
      setFormData({ name: "", businessName: "", email: "", phone: "", industry: "", monthlyFee: "", notes: "" });
      toast({ title: "Client added!", description: "Your new client has been added successfully." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const deleteClientMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/clients/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      toast({ title: "Client deleted", description: "The client and their bots have been removed." });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({ title: "Error", description: "Client name is required", variant: "destructive" });
      return;
    }
    createClientMutation.mutate(formData);
  };

  const totalMonthlyRevenue = clients.reduce((sum, client) => sum + parseFloat(client.monthlyFee || "0"), 0);
  const totalBotRevenue = clients.reduce((sum, client) => sum + (client.totalRevenue || 0), 0);
  const totalBots = clients.reduce((sum, client) => sum + (client.botCount || 0), 0);

  const industries = ["E-commerce", "Beauty", "Fashion", "Technology", "Food & Beverage", "Health & Fitness", "Real Estate", "Other"];

  return (
    <div className="min-h-screen bg-dark-bg">
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
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-neutral-gray hover:text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Users className="text-accent-gold w-8 h-8" />
              <span className="text-xl font-bold">Client Management</span>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-accent-gold text-primary-black hover:bg-gold-trim font-semibold">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Client
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card-bg border-secondary-brown text-white max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-accent-gold">Add New Client</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Client Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-dark-bg border-secondary-brown"
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      className="bg-dark-bg border-secondary-brown"
                      placeholder="Smith's Online Store"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-dark-bg border-secondary-brown"
                        placeholder="john@store.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="bg-dark-bg border-secondary-brown"
                        placeholder="+1 234 567 890"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="industry">Industry</Label>
                      <Select value={formData.industry} onValueChange={(value) => setFormData({ ...formData, industry: value })}>
                        <SelectTrigger className="bg-dark-bg border-secondary-brown">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent className="bg-card-bg border-secondary-brown">
                          {industries.map((ind) => (
                            <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="monthlyFee">Monthly Fee (£)</Label>
                      <Input
                        id="monthlyFee"
                        type="number"
                        value={formData.monthlyFee}
                        onChange={(e) => setFormData({ ...formData, monthlyFee: e.target.value })}
                        className="bg-dark-bg border-secondary-brown"
                        placeholder="500"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Input
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="bg-dark-bg border-secondary-brown"
                      placeholder="Any additional notes..."
                    />
                  </div>
                  <Button type="submit" className="w-full bg-accent-gold text-primary-black hover:bg-gold-trim font-semibold" disabled={createClientMutation.isPending}>
                    {createClientMutation.isPending ? "Adding..." : "Add Client"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card-bg border-secondary-brown">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-gray text-sm">Total Clients</p>
                  <p className="text-3xl font-bold text-white">{clients.length}</p>
                </div>
                <Users className="w-10 h-10 text-accent-gold" />
              </div>
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
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-gray text-sm">Monthly Revenue</p>
                  <p className="text-3xl font-bold text-accent-gold">£{totalMonthlyRevenue.toFixed(2)}</p>
                </div>
                <DollarSign className="w-10 h-10 text-accent-gold" />
              </div>
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
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-gray text-sm">Bot Revenue</p>
                  <p className="text-3xl font-bold text-green-500">£{totalBotRevenue.toFixed(2)}</p>
                </div>
                <TrendingUp className="w-10 h-10 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card-bg border-secondary-brown">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text-secondary">Active Bots</CardTitle>
              <Bot className="h-4 w-4 text-accent-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text-primary">{totalActiveBots}</div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-gray text-sm">Active Bots</p>
                  <p className="text-3xl font-bold text-white">{totalBots}</p>
                </div>
                <Bot className="w-10 h-10 text-accent-gold" />
              </div>
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
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-gold"></div>
          </div>
        ) : clients.length === 0 ? (
          <Card className="bg-card-bg border-secondary-brown">
            <CardContent className="p-12 text-center">
              <Users className="w-16 h-16 text-neutral-gray mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No clients yet</h3>
              <p className="text-neutral-gray mb-6">Add your first client to start managing their social media bots and track their revenue.</p>
              <Button onClick={() => setIsAddDialogOpen(true)} className="bg-accent-gold text-primary-black hover:bg-gold-trim font-semibold">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Client
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client) => (
              <Card key={client.id} className="bg-card-bg border-secondary-brown hover:border-accent-gold transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white text-lg">{client.name}</CardTitle>
                      {client.businessName && (
                        <p className="text-neutral-gray text-sm flex items-center mt-1">
                          <Building2 className="w-3 h-3 mr-1" />
                          {client.businessName}
                        </p>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-neutral-gray hover:text-white">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-card-bg border-secondary-brown">
                        <DropdownMenuItem className="text-white hover:bg-secondary-brown cursor-pointer">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-500 hover:bg-secondary-brown cursor-pointer"
                          onClick={() => deleteClientMutation.mutate(client.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {client.industry && (
                      <Badge className="bg-rich-brown text-gold-trim border border-accent-gold text-xs">
                        {client.industry}
                      </Badge>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4 py-3 border-t border-secondary-brown">
                      <div>
                        <p className="text-neutral-gray text-xs">Monthly Fee</p>
                        <p className="text-accent-gold font-bold">£{parseFloat(client.monthlyFee || "0").toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-neutral-gray text-xs">Bot Revenue</p>
                        <p className="text-green-500 font-bold">£{(client.totalRevenue || 0).toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-3 border-t border-secondary-brown">
                      <div className="flex items-center text-neutral-gray text-sm">
                        <Bot className="w-4 h-4 mr-1 text-accent-gold" />
                        {client.botCount || 0} bots
                      </div>
                      <Badge className={client.status === "active" ? "bg-green-600" : "bg-gray-600"}>
                        {client.status}
                      </Badge>
                    </div>

                    {(client.email || client.phone) && (
                      <div className="pt-3 border-t border-secondary-brown space-y-1">
                        {client.email && (
                          <p className="text-neutral-gray text-xs flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {client.email}
                          </p>
                        )}
                        {client.phone && (
                          <p className="text-neutral-gray text-xs flex items-center">
                            <Phone className="w-3 h-3 mr-1" />
                            {client.phone}
                          </p>
                        )}
                      </div>
                    )}

                    <Link href={`/dashboard?client=${client.id}`}>
                      <Button className="w-full bg-secondary-brown hover:bg-accent-gold hover:text-primary-black mt-2">
                        <Bot className="w-4 h-4 mr-2" />
                        Manage Bots
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
