import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MenuProvider, useMenu } from "@/lib/menu-context";
import HamburgerMenuSidebar from "@/components/HamburgerMenu";
import SpaceBackground from "@/components/SpaceBackground";
import { Menu } from "lucide-react";
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

function AppRoutes() {
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

function AppLayout() {
  const { isMenuOpen, toggleMenu, closeMenu } = useMenu();

  return (
    <>
      <SpaceBackground />
      <div className="flex min-h-screen text-white relative z-10">
        <div
          className="flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden"
          style={{ width: isMenuOpen ? "288px" : "0px" }}
        >
          <HamburgerMenuSidebar isOpen={isMenuOpen} onClose={closeMenu} />
        </div>

        <div className="flex-1 min-w-0 relative">
          <button
            onClick={toggleMenu}
            className="sticky top-4 left-4 z-40 ml-4 mt-4 p-2 text-accent-gold hover:text-gold-trim transition-colors focus:outline-none focus:ring-2 focus:ring-accent-gold rounded-md bg-black/40 backdrop-blur-sm border border-accent-gold/30"
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <Toaster />
          <AppRoutes />
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MenuProvider>
          <AppLayout />
        </MenuProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
