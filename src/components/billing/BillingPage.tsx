import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckIcon, 
  CreditCardIcon, 
  ArrowPathIcon, 
  ExclamationTriangleIcon,
  SparklesIcon,
  TrophyIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import '../../styles/brand.css';

interface BillingData {
  organization: {
    id: string;
    name: string;
    plan: string;
    planLimits: any;
    currentUsage: any;
    status: string;
  };
  subscription?: {
    id: string;
    status: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
  };
  plans: any;
  usage: {
    socialAccounts: { current: number; limit: number; allowed: boolean };
    postsPerMonth: { current: number; limit: number; allowed: boolean };
    users: { current: number; limit: number; allowed: boolean };
  };
}

const BillingPage: React.FC = () => {
  const [data, setData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/billing/info', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const billingData = await response.json();
        setData(billingData);
      }
    } catch (error) {
      console.error('Error fetching billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planType: 'starter' | 'pro') => {
    setActionLoading(planType);
    
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          plan: planType,
          successUrl: `${window.location.origin}/billing?success=true`,
          cancelUrl: `${window.location.origin}/billing`
        })
      });

      const data = await response.json();
      if (response.ok) {
        window.location.href = data.url;
      } else {
        alert('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleManageSubscription = async () => {
    setActionLoading('portal');
    
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/billing/portal', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          returnUrl: window.location.href
        })
      });

      const data = await response.json();
      if (response.ok) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error opening portal:', error);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sfs-background sfs-flex sfs-flex-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sfs-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sfs-text-light">Loading billing information...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const currentPlan = data.organization.plan;
  const isTrialUser = currentPlan === 'trial';
  const hasActiveSubscription = data.subscription?.status === 'active';

  return (
    <div className="min-h-screen bg-gradient-to-br from-sfs-background via-white to-sfs-gold-light">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="sfs-container py-4">
          <div className="sfs-flex sfs-flex-between">
            <div className="sfs-flex items-center gap-4">
              <Link to="/dashboard" className="w-10 h-10 bg-gradient-to-r from-sfs-gold to-sfs-gold-dark rounded-lg sfs-flex sfs-flex-center">
                <span className="text-xl font-bold text-sfs-black">SFS</span>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-sfs-text">Billing & Plans</h1>
                <p className="text-sm text-sfs-text-muted">{data.organization.name}</p>
              </div>
            </div>
            <Link to="/dashboard" className="sfs-btn sfs-btn-outline">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="sfs-container py-12">
        {/* Current Plan Status */}
        <div className="max-w-4xl mx-auto">
          {isTrialUser && (
            <div className="sfs-card mb-8 border-2 border-sfs-warning">
              <div className="sfs-card-body">
                <div className="sfs-flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-sfs-warning to-orange-500 rounded-xl sfs-flex sfs-flex-center">
                    <ExclamationTriangleIcon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="sfs-heading-3 mb-2">You're on a free trial</h3>
                    <p className="text-sfs-text-light mb-4">
                      Upgrade to unlock unlimited potential and continue using SocialScaleBooster after your trial ends.
                    </p>
                    <div className="sfs-flex gap-3">
                      <button 
                        onClick={() => handleUpgrade('starter')}
                        className="sfs-btn sfs-btn-primary"
                        disabled={actionLoading === 'starter'}
                      >
                        {actionLoading === 'starter' ? (
                          <div className="sfs-flex items-center gap-2">
                            <ArrowPathIcon className="w-5 h-5 animate-spin" />
                            Processing...
                          </div>
                        ) : (
                          'Upgrade to Starter - £29/month'
                        )}
                      </button>
                      <button 
                        onClick={() => handleUpgrade('pro')}
                        className="sfs-btn sfs-btn-secondary"
                        disabled={actionLoading === 'pro'}
                      >
                        {actionLoading === 'pro' ? (
                          <div className="sfs-flex items-center gap-2">
                            <ArrowPathIcon className="w-5 h-5 animate-spin" />
                            Processing...
                          </div>
                        ) : (
                          'Upgrade to Pro - £99/month'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {hasActiveSubscription && (
            <div className="sfs-card mb-8 border-2 border-sfs-success">
              <div className="sfs-card-body">
                <div className="sfs-flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-sfs-success to-green-600 rounded-xl sfs-flex sfs-flex-center">
                    <ShieldCheckIcon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="sfs-heading-3 mb-2">
                      Active Subscription - {currentPlan === 'starter' ? 'Starter Plan' : 'Pro Plan'}
                    </h3>
                    <p className="text-sfs-text-light mb-2">
                      Next billing date: {new Date(data.subscription!.currentPeriodEnd).toLocaleDateString()}
                    </p>
                    {data.subscription!.cancelAtPeriodEnd && (
                      <p className="text-sfs-warning text-sm mb-4">
                        Your subscription will cancel at the end of this billing period.
                      </p>
                    )}
                    <button 
                      onClick={handleManageSubscription}
                      className="sfs-btn sfs-btn-outline sfs-btn-sm"
                      disabled={actionLoading === 'portal'}
                    >
                      {actionLoading === 'portal' ? (
                        <div className="sfs-flex items-center gap-2">
                          <ArrowPathIcon className="w-4 h-4 animate-spin" />
                          Opening...
                        </div>
                      ) : (
                        <div className="sfs-flex items-center gap-2">
                          <CreditCardIcon className="w-4 h-4" />
                          Manage Subscription
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Usage Overview */}
          <div className="sfs-card mb-12">
            <div className="sfs-card-header">
              <h3 className="sfs-heading-3">Current Usage</h3>
            </div>
            <div className="sfs-card-body">
              <div className="sfs-grid sfs-grid-3 gap-6">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full sfs-flex sfs-flex-center">
                    <span className="text-2xl text-white">📱</span>
                  </div>
                  <div className="mb-2">
                    <span className="text-3xl font-bold text-sfs-text">{data.usage.socialAccounts.current}</span>
                    <span className="text-sfs-text-muted text-lg">
                      /{data.usage.socialAccounts.limit === -1 ? '∞' : data.usage.socialAccounts.limit}
                    </span>
                  </div>
                  <p className="text-sfs-text-muted font-medium">Social Accounts</p>
                  <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                    <div 
                      className={`h-3 rounded-full transition-all ${
                        data.usage.socialAccounts.allowed ? 'bg-blue-500' : 'bg-red-500'
                      }`}
                      style={{ 
                        width: `${Math.min((data.usage.socialAccounts.current / (data.usage.socialAccounts.limit || 1)) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-sfs-gold to-sfs-gold-dark rounded-full sfs-flex sfs-flex-center">
                    <span className="text-2xl text-sfs-black">📝</span>
                  </div>
                  <div className="mb-2">
                    <span className="text-3xl font-bold text-sfs-text">{data.usage.postsPerMonth.current}</span>
                    <span className="text-sfs-text-muted text-lg">
                      /{data.usage.postsPerMonth.limit === -1 ? '∞' : data.usage.postsPerMonth.limit}
                    </span>
                  </div>
                  <p className="text-sfs-text-muted font-medium">Posts This Month</p>
                  <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                    <div 
                      className={`h-3 rounded-full transition-all ${
                        data.usage.postsPerMonth.allowed ? 'bg-sfs-gold-dark' : 'bg-red-500'
                      }`}
                      style={{ 
                        width: `${data.usage.postsPerMonth.limit === -1 ? 30 : Math.min((data.usage.postsPerMonth.current / data.usage.postsPerMonth.limit) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-sfs-brown to-sfs-brown-light rounded-full sfs-flex sfs-flex-center">
                    <span className="text-2xl text-white">👥</span>
                  </div>
                  <div className="mb-2">
                    <span className="text-3xl font-bold text-sfs-text">{data.usage.users.current}</span>
                    <span className="text-sfs-text-muted text-lg">
                      /{data.usage.users.limit === -1 ? '∞' : data.usage.users.limit}
                    </span>
                  </div>
                  <p className="text-sfs-text-muted font-medium">Team Members</p>
                  <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                    <div 
                      className={`h-3 rounded-full transition-all ${
                        data.usage.users.allowed ? 'bg-sfs-brown' : 'bg-red-500'
                      }`}
                      style={{ 
                        width: `${Math.min((data.usage.users.current / (data.usage.users.limit || 1)) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Plans */}
          <div className="text-center mb-12">
            <h2 className="sfs-heading-2 mb-4">Choose Your Plan</h2>
            <p className="sfs-text-lg text-sfs-text-light max-w-2xl mx-auto">
              Scale your social media presence with the perfect plan for your needs.
            </p>
          </div>

          <div className="sfs-grid sfs-grid-3 gap-8 max-w-6xl mx-auto">
            {/* Trial Plan */}
            <div className={`sfs-card ${currentPlan === 'trial' ? 'border-2 border-gray-400' : ''}`}>
              <div className="sfs-card-body text-center relative">
                {currentPlan === 'trial' && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gray-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Current Plan
                    </span>
                  </div>
                )}
                
                <h3 className="sfs-heading-3 mb-3">Free Trial</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-sfs-text">£0</span>
                  <span className="text-sfs-text-muted">/14 days</span>
                </div>
                
                <ul className="text-left space-y-3 mb-8">
                  <li className="sfs-flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-sfs-success mt-0.5 flex-shrink-0" />
                    <span>1 social media account</span>
                  </li>
                  <li className="sfs-flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-sfs-success mt-0.5 flex-shrink-0" />
                    <span>10 posts per month</span>
                  </li>
                  <li className="sfs-flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-sfs-success mt-0.5 flex-shrink-0" />
                    <span>Basic AI content generation</span>
                  </li>
                  <li className="sfs-flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-sfs-success mt-0.5 flex-shrink-0" />
                    <span>Smart scheduling</span>
                  </li>
                  <li className="sfs-flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-sfs-success mt-0.5 flex-shrink-0" />
                    <span>Basic analytics</span>
                  </li>
                </ul>
                
                <div className="text-center">
                  <span className="text-sfs-text-muted text-sm">Perfect for testing our platform</span>
                </div>
              </div>
            </div>

            {/* Starter Plan */}
            <div className={`sfs-card ${currentPlan === 'starter' ? 'border-2 border-sfs-gold' : 'hover:border-sfs-gold'} transition-colors`}>
              <div className="sfs-card-body text-center relative">
                {currentPlan === 'starter' && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-sfs-gold text-sfs-black px-4 py-1 rounded-full text-sm font-medium">
                      Current Plan
                    </span>
                  </div>
                )}
                
                <div className="sfs-flex sfs-flex-center gap-2 mb-3">
                  <SparklesIcon className="w-6 h-6 text-sfs-gold-dark" />
                  <h3 className="sfs-heading-3">Starter</h3>
                </div>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-sfs-text">£29</span>
                  <span className="text-sfs-text-muted">/month</span>
                </div>
                
                <ul className="text-left space-y-3 mb-8">
                  <li className="sfs-flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-sfs-success mt-0.5 flex-shrink-0" />
                    <span>3 social media accounts</span>
                  </li>
                  <li className="sfs-flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-sfs-success mt-0.5 flex-shrink-0" />
                    <span>100 posts per month</span>
                  </li>
                  <li className="sfs-flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-sfs-success mt-0.5 flex-shrink-0" />
                    <span>Advanced AI content generation</span>
                  </li>
                  <li className="sfs-flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-sfs-success mt-0.5 flex-shrink-0" />
                    <span>Smart scheduling & automation</span>
                  </li>
                  <li className="sfs-flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-sfs-success mt-0.5 flex-shrink-0" />
                    <span>Advanced analytics & reports</span>
                  </li>
                  <li className="sfs-flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-sfs-success mt-0.5 flex-shrink-0" />
                    <span>Email support</span>
                  </li>
                </ul>
                
                {currentPlan !== 'starter' && (
                  <button 
                    onClick={() => handleUpgrade('starter')}
                    className="sfs-btn sfs-btn-primary w-full"
                    disabled={!!actionLoading}
                  >
                    {actionLoading === 'starter' ? (
                      <div className="sfs-flex sfs-flex-center gap-2">
                        <ArrowPathIcon className="w-5 h-5 animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      'Upgrade to Starter'
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Pro Plan */}
            <div className={`sfs-card ${currentPlan === 'pro' ? 'border-2 border-purple-500' : 'hover:border-purple-500'} transition-colors relative`}>
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  {currentPlan === 'pro' ? 'Current Plan' : 'Most Popular'}
                </span>
              </div>
              
              <div className="sfs-card-body text-center">
                <div className="sfs-flex sfs-flex-center gap-2 mb-3">
                  <TrophyIcon className="w-6 h-6 text-purple-500" />
                  <h3 className="sfs-heading-3">Pro</h3>
                </div>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-sfs-text">£99</span>
                  <span className="text-sfs-text-muted">/month</span>
                </div>
                
                <ul className="text-left space-y-3 mb-8">
                  <li className="sfs-flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-sfs-success mt-0.5 flex-shrink-0" />
                    <span>10 social media accounts</span>
                  </li>
                  <li className="sfs-flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-sfs-success mt-0.5 flex-shrink-0" />
                    <span className="font-semibold">Unlimited posts</span>
                  </li>
                  <li className="sfs-flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-sfs-success mt-0.5 flex-shrink-0" />
                    <span>Premium AI features</span>
                  </li>
                  <li className="sfs-flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-sfs-success mt-0.5 flex-shrink-0" />
                    <span className="font-semibold">Team collaboration (5 users)</span>
                  </li>
                  <li className="sfs-flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-sfs-success mt-0.5 flex-shrink-0" />
                    <span>Advanced analytics & white-label reports</span>
                  </li>
                  <li className="sfs-flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-sfs-success mt-0.5 flex-shrink-0" />
                    <span>Priority support & phone support</span>
                  </li>
                  <li className="sfs-flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-sfs-success mt-0.5 flex-shrink-0" />
                    <span>API access</span>
                  </li>
                </ul>
                
                {currentPlan !== 'pro' && (
                  <button 
                    onClick={() => handleUpgrade('pro')}
                    className="sfs-btn sfs-btn-secondary w-full"
                    disabled={!!actionLoading}
                  >
                    {actionLoading === 'pro' ? (
                      <div className="sfs-flex sfs-flex-center gap-2">
                        <ArrowPathIcon className="w-5 h-5 animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      'Upgrade to Pro'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-16 text-center">
            <h3 className="sfs-heading-3 mb-6">Frequently Asked Questions</h3>
            <div className="max-w-3xl mx-auto text-left space-y-4">
              <div className="sfs-card">
                <div className="sfs-card-body">
                  <h4 className="font-semibold text-sfs-text mb-2">Can I change my plan anytime?</h4>
                  <p className="text-sfs-text-light">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing is prorated.</p>
                </div>
              </div>
              
              <div className="sfs-card">
                <div className="sfs-card-body">
                  <h4 className="font-semibold text-sfs-text mb-2">What happens when I reach my usage limits?</h4>
                  <p className="text-sfs-text-light">When you reach your monthly limits, you'll be prompted to upgrade. Your existing content and data remain safe.</p>
                </div>
              </div>
              
              <div className="sfs-card">
                <div className="sfs-card-body">
                  <h4 className="font-semibold text-sfs-text mb-2">Do you offer refunds?</h4>
                  <p className="text-sfs-text-light">We offer a 30-day money-back guarantee for all paid plans. No questions asked.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BillingPage;