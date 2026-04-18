import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import AppSidebar from "@/components/AppSidebar";

import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Onboarding from "@/pages/onboarding";
import Dashboard from "@/pages/dashboard";
import Checkout from "@/pages/checkout";
import Subscribe from "@/pages/subscribe";
import ClientsPage from "@/pages/clients";
import AIStudio from "@/pages/ai-studio";
import ContentCalendar from "@/pages/calendar";
import AnalyticsPage from "@/pages/analytics";
import CreatePost from "@/pages/create-post";
import DraftsPage from "@/pages/drafts";
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

const APP_PATHS = [
  "/dashboard", "/ai-studio", "/calendar", "/analytics", "/create",
  "/drafts", "/templates", "/hashtags", "/captions", "/scheduler", "/auto-engage",
  "/dm-automation", "/accounts", "/competitors", "/trends", "/audience",
  "/performance", "/marketplace", "/clients", "/settings", "/help",
  "/tutorials", "/support", "/subscribe", "/checkout",
];

function isAppPath(path: string) {
  return APP_PATHS.some((p) => path === p || path.startsWith(p + "/"));
}

function AppRoutes() {
  const { user, isLoading } = useAuth();
  const [location] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FFD700]/30 border-t-[#FFD700] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0D0D0D]">
      {/* Sidebar only for authenticated app pages */}
      {user && isAppPath(location) && <AppSidebar />}

      <div className="flex-1 min-w-0 overflow-x-hidden">
        <Toaster />
        <Switch>
          {/* Public pages */}
          <Route path="/" component={Landing} />
          <Route path="/login" component={Login} />
          <Route path="/onboarding" component={Onboarding} />

          {/* App pages — redirect to login if not authenticated */}
          <Route path="/dashboard">
            {user ? <Dashboard /> : <Redirect to="/login" />}
          </Route>
          <Route path="/clients">
            {user ? <ClientsPage /> : <Redirect to="/login" />}
          </Route>
          <Route path="/ai-studio">
            {user ? <AIStudio /> : <Redirect to="/login" />}
          </Route>
          <Route path="/calendar">
            {user ? <ContentCalendar /> : <Redirect to="/login" />}
          </Route>
          <Route path="/analytics">
            {user ? <AnalyticsPage /> : <Redirect to="/login" />}
          </Route>
          <Route path="/create">
            {user ? <CreatePost /> : <Redirect to="/login" />}
          </Route>
          <Route path="/drafts">
            {user ? <DraftsPage /> : <Redirect to="/login" />}
          </Route>
          <Route path="/templates">
            {user ? <Templates /> : <Redirect to="/login" />}
          </Route>
          <Route path="/hashtags">
            {user ? <Hashtags /> : <Redirect to="/login" />}
          </Route>
          <Route path="/captions">
            {user ? <Captions /> : <Redirect to="/login" />}
          </Route>
          <Route path="/scheduler">
            {user ? <Scheduler /> : <Redirect to="/login" />}
          </Route>
          <Route path="/auto-engage">
            {user ? <AutoEngage /> : <Redirect to="/login" />}
          </Route>
          <Route path="/dm-automation">
            {user ? <DMAutomation /> : <Redirect to="/login" />}
          </Route>
          <Route path="/accounts">
            {user ? <Accounts /> : <Redirect to="/login" />}
          </Route>
          <Route path="/competitors">
            {user ? <Competitors /> : <Redirect to="/login" />}
          </Route>
          <Route path="/trends">
            {user ? <Trends /> : <Redirect to="/login" />}
          </Route>
          <Route path="/audience">
            {user ? <Audience /> : <Redirect to="/login" />}
          </Route>
          <Route path="/performance">
            {user ? <Performance /> : <Redirect to="/login" />}
          </Route>
          <Route path="/marketplace">
            {user ? <Marketplace /> : <Redirect to="/login" />}
          </Route>
          <Route path="/settings">
            {user ? <SettingsPage /> : <Redirect to="/login" />}
          </Route>
          <Route path="/help">
            {user ? <HelpCenter /> : <Redirect to="/login" />}
          </Route>
          <Route path="/tutorials">
            {user ? <Tutorials /> : <Redirect to="/login" />}
          </Route>
          <Route path="/support">
            {user ? <Support /> : <Redirect to="/login" />}
          </Route>
          <Route path="/subscribe" component={Subscribe} />
          <Route path="/checkout" component={Checkout} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
