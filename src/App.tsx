import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {
  LandingPage,
  LoginForm,
  SignupForm,
  Dashboard,
  BillingPage
} from './components';
import './styles/brand.css';

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('auth_token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Public Route component (redirects to dashboard if already logged in)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('auth_token');
  
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/" 
            element={
              <PublicRoute>
                <LandingPage />
              </PublicRoute>
            } 
          />
          
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginForm />
              </PublicRoute>
            } 
          />
          
          <Route 
            path="/signup" 
            element={
              <PublicRoute>
                <SignupForm />
              </PublicRoute>
            } 
          />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/billing" 
            element={
              <ProtectedRoute>
                <BillingPage />
              </ProtectedRoute>
            } 
          />

          {/* AI Studio & Content */}
          <Route 
            path="/ai-studio" 
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-sfs-background sfs-flex sfs-flex-center">
                  <div className="text-center">
                    <h1 className="sfs-heading-2 mb-4">🤖 AI Studio</h1>
                    <p className="text-sfs-text-muted">AI-powered content creation suite...</p>
                    <a href="/dashboard" className="sfs-btn sfs-btn-primary mt-4">
                      Back to Dashboard
                    </a>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/content-calendar" 
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-sfs-background sfs-flex sfs-flex-center">
                  <div className="text-center">
                    <h1 className="sfs-heading-2 mb-4">📅 Content Calendar</h1>
                    <p className="text-sfs-text-muted">Plan and schedule your content...</p>
                    <a href="/dashboard" className="sfs-btn sfs-btn-primary mt-4">
                      Back to Dashboard
                    </a>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/analytics" 
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-sfs-background sfs-flex sfs-flex-center">
                  <div className="text-center">
                    <h1 className="sfs-heading-2 mb-4">📊 Analytics</h1>
                    <p className="text-sfs-text-muted">Performance insights and reporting...</p>
                    <a href="/dashboard" className="sfs-btn sfs-btn-primary mt-4">
                      Back to Dashboard
                    </a>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />

          {/* Content & Creation */}
          <Route 
            path="/posts/create" 
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-sfs-background sfs-flex sfs-flex-center">
                  <div className="text-center">
                    <h1 className="sfs-heading-2 mb-4">✨ Create Post</h1>
                    <p className="text-sfs-text-muted">AI-powered content creation...</p>
                    <a href="/dashboard" className="sfs-btn sfs-btn-primary mt-4">
                      Back to Dashboard
                    </a>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/templates" 
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-sfs-background sfs-flex sfs-flex-center">
                  <div className="text-center">
                    <h1 className="sfs-heading-2 mb-4">📝 Templates</h1>
                    <p className="text-sfs-text-muted">Pre-designed post templates...</p>
                    <a href="/dashboard" className="sfs-btn sfs-btn-primary mt-4">
                      Back to Dashboard
                    </a>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/hashtag-research" 
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-sfs-background sfs-flex sfs-flex-center">
                  <div className="text-center">
                    <h1 className="sfs-heading-2 mb-4">#️⃣ Hashtag Research</h1>
                    <p className="text-sfs-text-muted">Discover trending hashtags...</p>
                    <a href="/dashboard" className="sfs-btn sfs-btn-primary mt-4">
                      Back to Dashboard
                    </a>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/caption-generator" 
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-sfs-background sfs-flex sfs-flex-center">
                  <div className="text-center">
                    <h1 className="sfs-heading-2 mb-4">💭 Caption Generator</h1>
                    <p className="text-sfs-text-muted">AI-powered caption creation...</p>
                    <a href="/dashboard" className="sfs-btn sfs-btn-primary mt-4">
                      Back to Dashboard
                    </a>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />

          {/* Social Automation */}
          <Route 
            path="/post-scheduler" 
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-sfs-background sfs-flex sfs-flex-center">
                  <div className="text-center">
                    <h1 className="sfs-heading-2 mb-4">⏰ Post Scheduler</h1>
                    <p className="text-sfs-text-muted">Schedule your content...</p>
                    <a href="/dashboard" className="sfs-btn sfs-btn-primary mt-4">
                      Back to Dashboard
                    </a>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/auto-engagement" 
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-sfs-background sfs-flex sfs-flex-center">
                  <div className="text-center">
                    <h1 className="sfs-heading-2 mb-4">🤝 Auto Engagement</h1>
                    <p className="text-sfs-text-muted">Automated likes, follows, and comments...</p>
                    <a href="/dashboard" className="sfs-btn sfs-btn-primary mt-4">
                      Back to Dashboard
                    </a>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/dm-automation" 
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-sfs-background sfs-flex sfs-flex-center">
                  <div className="text-center">
                    <h1 className="sfs-heading-2 mb-4">💬 DM Automation</h1>
                    <p className="text-sfs-text-muted">Automated direct messaging...</p>
                    <a href="/dashboard" className="sfs-btn sfs-btn-primary mt-4">
                      Back to Dashboard
                    </a>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/connected-accounts" 
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-sfs-background sfs-flex sfs-flex-center">
                  <div className="text-center">
                    <h1 className="sfs-heading-2 mb-4">🔗 Connected Accounts</h1>
                    <p className="text-sfs-text-muted">Manage your social media accounts...</p>
                    <a href="/dashboard" className="sfs-btn sfs-btn-primary mt-4">
                      Back to Dashboard
                    </a>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />

          {/* Growth & Insights */}
          <Route 
            path="/competitor-tracker" 
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-sfs-background sfs-flex sfs-flex-center">
                  <div className="text-center">
                    <h1 className="sfs-heading-2 mb-4">🔍 Competitor Tracker</h1>
                    <p className="text-sfs-text-muted">Monitor your competition...</p>
                    <a href="/dashboard" className="sfs-btn sfs-btn-primary mt-4">
                      Back to Dashboard
                    </a>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/trending-topics" 
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-sfs-background sfs-flex sfs-flex-center">
                  <div className="text-center">
                    <h1 className="sfs-heading-2 mb-4">🔥 Trending Topics</h1>
                    <p className="text-sfs-text-muted">Discover what's trending...</p>
                    <a href="/dashboard" className="sfs-btn sfs-btn-primary mt-4">
                      Back to Dashboard
                    </a>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/audience-builder" 
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-sfs-background sfs-flex sfs-flex-center">
                  <div className="text-center">
                    <h1 className="sfs-heading-2 mb-4">👥 Audience Builder</h1>
                    <p className="text-sfs-text-muted">Grow your audience strategically...</p>
                    <a href="/dashboard" className="sfs-btn sfs-btn-primary mt-4">
                      Back to Dashboard
                    </a>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/performance-score" 
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-sfs-background sfs-flex sfs-flex-center">
                  <div className="text-center">
                    <h1 className="sfs-heading-2 mb-4">⭐ Performance Score</h1>
                    <p className="text-sfs-text-muted">Track your performance score...</p>
                    <a href="/dashboard" className="sfs-btn sfs-btn-primary mt-4">
                      Back to Dashboard
                    </a>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />

          {/* Marketplace */}
          <Route 
            path="/marketplace" 
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-sfs-background sfs-flex sfs-flex-center">
                  <div className="text-center">
                    <h1 className="sfs-heading-2 mb-4">🛒 Browse Marketplace</h1>
                    <p className="text-sfs-text-muted">Explore templates, tools, and services...</p>
                    <a href="/dashboard" className="sfs-btn sfs-btn-primary mt-4">
                      Back to Dashboard
                    </a>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/subscription-plans" 
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-sfs-background sfs-flex sfs-flex-center">
                  <div className="text-center">
                    <h1 className="sfs-heading-2 mb-4">💎 Subscription Plans</h1>
                    <p className="text-sfs-text-muted">Choose your plan...</p>
                    <a href="/dashboard" className="sfs-btn sfs-btn-primary mt-4">
                      Back to Dashboard
                    </a>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-sfs-background sfs-flex sfs-flex-center">
                  <div className="text-center">
                    <h1 className="sfs-heading-2 mb-4">💳 Checkout</h1>
                    <p className="text-sfs-text-muted">Complete your purchase...</p>
                    <a href="/dashboard" className="sfs-btn sfs-btn-primary mt-4">
                      Back to Dashboard
                    </a>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />

          {/* Settings & Support */}
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-sfs-background sfs-flex sfs-flex-center">
                  <div className="text-center">
                    <h1 className="sfs-heading-2 mb-4">⚙️ Settings</h1>
                    <p className="text-sfs-text-muted">Account and organization settings...</p>
                    <a href="/dashboard" className="sfs-btn sfs-btn-primary mt-4">
                      Back to Dashboard
                    </a>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/help-center" 
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-sfs-background sfs-flex sfs-flex-center">
                  <div className="text-center">
                    <h1 className="sfs-heading-2 mb-4">❓ Help Center</h1>
                    <p className="text-sfs-text-muted">Find answers to your questions...</p>
                    <a href="/dashboard" className="sfs-btn sfs-btn-primary mt-4">
                      Back to Dashboard
                    </a>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/tutorials" 
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-sfs-background sfs-flex sfs-flex-center">
                  <div className="text-center">
                    <h1 className="sfs-heading-2 mb-4">🎓 Tutorials</h1>
                    <p className="text-sfs-text-muted">Learn how to use our platform...</p>
                    <a href="/dashboard" className="sfs-btn sfs-btn-primary mt-4">
                      Back to Dashboard
                    </a>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/contact-support" 
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-sfs-background sfs-flex sfs-flex-center">
                  <div className="text-center">
                    <h1 className="sfs-heading-2 mb-4">📞 Contact Support</h1>
                    <p className="text-sfs-text-muted">Get help from our support team...</p>
                    <a href="/dashboard" className="sfs-btn sfs-btn-primary mt-4">
                      Back to Dashboard
                    </a>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />

          {/* Legacy routes for backwards compatibility */}
          <Route 
            path="/posts" 
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-sfs-background sfs-flex sfs-flex-center">
                  <div className="text-center">
                    <h1 className="sfs-heading-2 mb-4">📝 Posts Management</h1>
                    <p className="text-sfs-text-muted">Manage your social media posts...</p>
                    <a href="/dashboard" className="sfs-btn sfs-btn-primary mt-4">
                      Back to Dashboard
                    </a>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/accounts" 
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-sfs-background sfs-flex sfs-flex-center">
                  <div className="text-center">
                    <h1 className="sfs-heading-2 mb-4">📱 Social Accounts</h1>
                    <p className="text-sfs-text-muted">Connect your social media accounts...</p>
                    <a href="/dashboard" className="sfs-btn sfs-btn-primary mt-4">
                      Back to Dashboard
                    </a>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/team" 
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-sfs-background sfs-flex sfs-flex-center">
                  <div className="text-center">
                    <h1 className="sfs-heading-2 mb-4">👥 Team Management</h1>
                    <p className="text-sfs-text-muted">Invite and manage team members...</p>
                    <a href="/dashboard" className="sfs-btn sfs-btn-primary mt-4">
                      Back to Dashboard
                    </a>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />

          {/* Static Pages */}
          <Route 
            path="/features" 
            element={
              <div className="min-h-screen bg-sfs-background sfs-flex sfs-flex-center">
                <div className="text-center">
                  <h1 className="sfs-heading-2 mb-4">Features</h1>
                  <p className="text-sfs-text-muted">Detailed feature breakdown coming soon...</p>
                  <a href="/" className="sfs-btn sfs-btn-primary mt-4">
                    Back to Home
                  </a>
                </div>
              </div>
            } 
          />

          <Route 
            path="/pricing" 
            element={
              <div className="min-h-screen bg-sfs-background sfs-flex sfs-flex-center">
                <div className="text-center">
                  <h1 className="sfs-heading-2 mb-4">Pricing</h1>
                  <p className="text-sfs-text-muted">See pricing on the home page for now...</p>
                  <a href="/" className="sfs-btn sfs-btn-primary mt-4">
                    View Pricing
                  </a>
                </div>
              </div>
            } 
          />

          <Route 
            path="/demo" 
            element={
              <div className="min-h-screen bg-sfs-background sfs-flex sfs-flex-center">
                <div className="text-center">
                  <h1 className="sfs-heading-2 mb-4">Product Demo</h1>
                  <p className="text-sfs-text-muted">Interactive demo coming soon...</p>
                  <div className="space-x-4 mt-4">
                    <a href="/signup" className="sfs-btn sfs-btn-primary">
                      Start Free Trial
                    </a>
                    <a href="/" className="sfs-btn sfs-btn-outline">
                      Back to Home
                    </a>
                  </div>
                </div>
              </div>
            } 
          />

          {/* Error Pages */}
          <Route 
            path="*" 
            element={
              <div className="min-h-screen bg-sfs-background sfs-flex sfs-flex-center">
                <div className="text-center">
                  <h1 className="sfs-heading-1 text-6xl mb-4">404</h1>
                  <h2 className="sfs-heading-2 mb-4">Page Not Found</h2>
                  <p className="text-sfs-text-muted mb-6">
                    The page you're looking for doesn't exist.
                  </p>
                  <a href="/" className="sfs-btn sfs-btn-primary">
                    Go Home
                  </a>
                </div>
              </div>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;