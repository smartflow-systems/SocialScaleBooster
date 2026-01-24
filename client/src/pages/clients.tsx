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

  const createClientMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/clients", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      setIsAddDialogOpen(false);
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
