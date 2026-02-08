import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Checkout from "@/pages/checkout";
import Subscribe from "@/pages/subscribe";
import ClientsPage from "@/pages/clients";
import AIStudio from "@/pages/ai-studio";
import ContentCalendar from "@/pages/calendar";
import AnalyticsPage from "@/pages/analytics";
import CreatePost from "@/pages/create-post";
import Templates from "@/pages/templates";
import Hashtags from "@/pages/hashtags";
import Captions from "@/pages/captions";
import Scheduler from "@/pages/scheduler";
import AutoEngage from "@/pages/auto-engage";
import DMAutomation from "@/pages/dm-automation";
import Accounts from "@/pages/accounts";
import Competitors from "@/pages/competitors";
import Trends from "@/pages/trends";
import Audience from "@/pages/audience";
import Performance from "@/pages/performance";
import Marketplace from "@/pages/marketplace";
import SettingsPage from "@/pages/settings";
import HelpCenter from "@/pages/help";
import Tutorials from "@/pages/tutorials";
import Support from "@/pages/support";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/clients" component={ClientsPage} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/subscribe" component={Subscribe} />
      <Route path="/ai-studio" component={AIStudio} />
      <Route path="/calendar" component={ContentCalendar} />
      <Route path="/analytics" component={AnalyticsPage} />
      <Route path="/create" component={CreatePost} />
      <Route path="/templates" component={Templates} />
      <Route path="/hashtags" component={Hashtags} />
      <Route path="/captions" component={Captions} />
      <Route path="/scheduler" component={Scheduler} />
      <Route path="/auto-engage" component={AutoEngage} />
      <Route path="/dm-automation" component={DMAutomation} />
      <Route path="/accounts" component={Accounts} />
      <Route path="/competitors" component={Competitors} />
      <Route path="/trends" component={Trends} />
      <Route path="/audience" component={Audience} />
      <Route path="/performance" component={Performance} />
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/settings" component={SettingsPage} />
      <Route path="/help" component={HelpCenter} />
      <Route path="/tutorials" component={Tutorials} />
      <Route path="/support" component={Support} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-primary-black text-white">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
