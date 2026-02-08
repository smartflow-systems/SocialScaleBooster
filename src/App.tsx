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

          {/* Placeholder routes for future features */}
          <Route 
            path="/posts" 
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-sfs-background sfs-flex sfs-flex-center">
                  <div className="text-center">
                    <h1 className="sfs-heading-2 mb-4">Posts Management</h1>
                    <p className="text-sfs-text-muted">Coming soon...</p>
                    <a href="/dashboard" className="sfs-btn sfs-btn-primary mt-4">
                      Back to Dashboard
                    </a>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/posts/create" 
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-sfs-background sfs-flex sfs-flex-center">
                  <div className="text-center">
                    <h1 className="sfs-heading-2 mb-4">Create Post</h1>
                    <p className="text-sfs-text-muted">AI-powered content creation coming soon...</p>
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
                    <h1 className="sfs-heading-2 mb-4">Social Accounts</h1>
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
            path="/analytics" 
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-sfs-background sfs-flex sfs-flex-center">
                  <div className="text-center">
                    <h1 className="sfs-heading-2 mb-4">Analytics & Reports</h1>
                    <p className="text-sfs-text-muted">Detailed insights coming soon...</p>
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
                    <h1 className="sfs-heading-2 mb-4">Team Management</h1>
                    <p className="text-sfs-text-muted">Invite and manage team members...</p>
                    <a href="/dashboard" className="sfs-btn sfs-btn-primary mt-4">
                      Back to Dashboard
                    </a>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-sfs-background sfs-flex sfs-flex-center">
                  <div className="text-center">
                    <h1 className="sfs-heading-2 mb-4">Settings</h1>
                    <p className="text-sfs-text-muted">Organization and account settings...</p>
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