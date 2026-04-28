import { useEffect } from "react";
import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { NotificationPrefsProvider } from "@/hooks/use-notification-prefs";
import AppSidebar from "@/components/AppSidebar";
import { usePostPublishedNotifications } from "@/hooks/usePostPublishedNotifications";
// Sanity import: ensures the SFS primitives module is in the build graph
// (no real pages are retrofitted yet — that ships in tasks #80–#83).
import { GlassCard as _SfsGlassCardSmoke } from "@/components/sfs";
void _SfsGlassCardSmoke;

declare global {
  interface Window {
    initSFSCircuitFlow?: () => (() => void) | null;
    __sfsCircuitCleanup?: (() => void) | null;
  }
}

function SFSCircuitBackground() {
  useEffect(() => {
    let cleanup: (() => void) | null = null;
    let cancelled = false;

    const start = () => {
      if (cancelled) return;
      if (typeof window.initSFSCircuitFlow === "function") {
        const result = window.initSFSCircuitFlow();
        if (typeof result === "function") cleanup = result;
        return;
      }
      const existing = document.querySelector<HTMLScriptElement>(
        'script[data-sfs-circuit="true"]'
      );
      if (existing) {
        existing.addEventListener("load", start, { once: true });
        return;
      }
      const script = document.createElement("script");
      script.src = "/sfs-circuit-flow.js";
      script.async = true;
      script.dataset.sfsCircuit = "true";
      script.addEventListener("load", start, { once: true });
      document.body.appendChild(script);
    };

    start();

    return () => {
      cancelled = true;
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <canvas
      id="circuit-canvas"
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        opacity: 0.4,
        pointerEvents: "none",
      }}
    />
  );
}

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
import AdminTemplates from "@/pages/admin-templates";
import SettingsPage from "@/pages/settings";
import HelpCenter from "@/pages/help";
import Tutorials from "@/pages/tutorials";
import Support from "@/pages/support";

const APP_PATHS = [
  "/dashboard", "/ai-studio", "/calendar", "/analytics", "/create",
  "/drafts", "/templates", "/hashtags", "/captions", "/scheduler", "/auto-engage",
  "/dm-automation", "/accounts", "/competitors", "/trends", "/audience",
  "/performance", "/marketplace", "/clients", "/settings", "/help",
  "/tutorials", "/support", "/subscribe", "/checkout", "/admin/templates",
];

function isAppPath(path: string) {
  return APP_PATHS.some((p) => path === p || path.startsWith(p + "/"));
}

function PostPublishedNotifier({ userId, token }: { userId: number; token: string }) {
  usePostPublishedNotifications({ userId, token });
  return null;
}

function AppRoutes() {
  const { user, token, isLoading } = useAuth();
  const [location] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FFD700]/30 border-t-[#FFD700] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen bg-[#0D0D0D]">
      {/* Animated SFS circuit background — only on authenticated app pages */}
      {user && isAppPath(location) && <SFSCircuitBackground />}
      {/* Sidebar only for authenticated app pages */}
      {user && isAppPath(location) && <AppSidebar />}
      {/* Global post-published notification listener */}
      {user && token && <PostPublishedNotifier userId={user.id} token={token} />}

      <div className="relative z-[1] flex-1 min-w-0 overflow-x-hidden">
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
          <Route path="/admin/templates">
            {user ? <AdminTemplates /> : <Redirect to="/login" />}
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
          <NotificationPrefsProvider>
            <AppRoutes />
          </NotificationPrefsProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
