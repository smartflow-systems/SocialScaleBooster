import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusIcon, 
  ChartBarIcon, 
  CalendarIcon, 
  UserGroupIcon, 
  CogIcon,
  BellIcon,
  MegaphoneIcon,
  TrendingUpIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import MobileMenu from '../common/MobileMenu';
import '../../styles/brand.css';

interface DashboardData {
  stats: {
    socialAccountsCount: number;
    botsCount: number;
    clientsCount: number;
  };
  recentPosts: Array<{
    id: string;
    content: string;
    platform: string;
    status: string;
    scheduledFor?: string;
    publishedAt?: string;
    createdAt: string;
  }>;
  organization: {
    id: string;
    name: string;
    plan: string;
    planLimits: {
      socialAccounts: number;
      postsPerMonth: number;
      users: number;
    };
    currentUsage: {
      socialAccounts: number;
      postsThisMonth: number;
      users: number;
    };
  };
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const dashboardData = await response.json();
        setData(dashboardData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUsagePercentage = (current: number, limit: number) => {
    if (limit === -1) return 0; // Unlimited
    return Math.min((current / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-sfs-error';
    if (percentage >= 70) return 'text-sfs-warning';
    return 'text-sfs-success';
  };

  const getPlatformIcon = (platform: string) => {
    const icons: { [key: string]: string } = {
      instagram: '📸',
      twitter: '🐦',
      facebook: '📘',
      linkedin: '💼',
      tiktok: '🎵',
      youtube: '📺'
    };
    return icons[platform.toLowerCase()] || '📱';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sfs-background sfs-flex sfs-flex-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sfs-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sfs-text-light">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-sfs-background sfs-flex sfs-flex-center">
        <div className="text-center">
          <p className="text-sfs-error">Failed to load dashboard</p>
          <button onClick={fetchDashboardData} className="sfs-btn sfs-btn-primary mt-4">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sfs-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="sfs-container py-4">
          <div className="sfs-flex sfs-flex-between">
            <div className="sfs-flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-sfs-gold to-sfs-gold-dark rounded-lg sfs-flex sfs-flex-center">
                <span className="text-xl font-bold text-sfs-black">SFS</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-sfs-text">{data.organization.name}</h1>
                <p className="text-sm text-sfs-text-muted">
                  {data.organization.plan === 'trial' ? 'Free Trial' : 
                   data.organization.plan === 'starter' ? 'Starter Plan' : 'Pro Plan'}
                </p>
              </div>
            </div>
            
            <div className="sfs-flex items-center gap-3">
              <div className="hidden md:sfs-flex items-center gap-3">
                <button className="p-2 text-sfs-text-light hover:text-sfs-text rounded-lg hover:bg-gray-100 transition-colors">
                  <BellIcon className="w-6 h-6" />
                </button>
                
                <Link to="/settings" className="p-2 text-sfs-text-light hover:text-sfs-text rounded-lg hover:bg-gray-100 transition-colors">
                  <CogIcon className="w-6 h-6" />
                </Link>
                
                <Link to="/billing" className="sfs-btn sfs-btn-primary sfs-btn-sm">
                  {data.organization.plan === 'trial' ? 'Upgrade' : 'Billing'}
                </Link>
              </div>
              <MobileMenu isLoggedIn={true} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="sfs-container py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="sfs-heading-2 mb-2">Welcome back! 👋</h2>
          <p className="text-sfs-text-light">
            Here's what's happening with your social media today.
          </p>
        </div>

        {/* Usage Overview */}
        <div className="sfs-card mb-8">
          <div className="sfs-card-header">
            <h3 className="sfs-heading-3">Plan Usage</h3>
          </div>
          <div className="sfs-card-body">
            <div className="sfs-grid sfs-grid-3 gap-6">
              {/* Social Accounts */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl mx-auto mb-3 sfs-flex sfs-flex-center">
                  <span className="text-2xl text-white">📱</span>
                </div>
                <div className="mb-2">
                  <span className="text-2xl font-bold text-sfs-text">
                    {data.organization.currentUsage.socialAccounts}
                  </span>
                  <span className="text-sfs-text-muted">
                    /{data.organization.planLimits.socialAccounts === -1 ? '∞' : data.organization.planLimits.socialAccounts}
                  </span>
                </div>
                <p className="text-sm text-sfs-text-muted">Social Accounts</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${getUsagePercentage(data.organization.currentUsage.socialAccounts, data.organization.planLimits.socialAccounts)}%` }}
                  />
                </div>
              </div>

              {/* Posts This Month */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-sfs-gold to-sfs-gold-dark rounded-xl mx-auto mb-3 sfs-flex sfs-flex-center">
                  <span className="text-2xl text-sfs-black">📝</span>
                </div>
                <div className="mb-2">
                  <span className="text-2xl font-bold text-sfs-text">
                    {data.organization.currentUsage.postsThisMonth}
                  </span>
                  <span className="text-sfs-text-muted">
                    /{data.organization.planLimits.postsPerMonth === -1 ? '∞' : data.organization.planLimits.postsPerMonth}
                  </span>
                </div>
                <p className="text-sm text-sfs-text-muted">Posts This Month</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-sfs-gold-dark h-2 rounded-full transition-all"
                    style={{ width: `${getUsagePercentage(data.organization.currentUsage.postsThisMonth, data.organization.planLimits.postsPerMonth)}%` }}
                  />
                </div>
              </div>

              {/* Team Members */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-sfs-brown to-sfs-brown-light rounded-xl mx-auto mb-3 sfs-flex sfs-flex-center">
                  <span className="text-2xl text-white">👥</span>
                </div>
                <div className="mb-2">
                  <span className="text-2xl font-bold text-sfs-text">
                    {data.organization.currentUsage.users}
                  </span>
                  <span className="text-sfs-text-muted">
                    /{data.organization.planLimits.users === -1 ? '∞' : data.organization.planLimits.users}
                  </span>
                </div>
                <p className="text-sm text-sfs-text-muted">Team Members</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-sfs-brown h-2 rounded-full transition-all"
                    style={{ width: `${getUsagePercentage(data.organization.currentUsage.users, data.organization.planLimits.users)}%` }}
                  />
                </div>
              </div>
            </div>

            {data.organization.plan === 'trial' && (
              <div className="mt-6 p-4 bg-gradient-to-r from-sfs-gold-light to-yellow-50 rounded-lg border border-sfs-gold">
                <div className="sfs-flex items-center gap-3">
                  <TrendingUpIcon className="w-8 h-8 text-sfs-gold-dark" />
                  <div>
                    <h4 className="font-semibold text-sfs-text">Upgrade to unlock unlimited potential</h4>
                    <p className="text-sm text-sfs-text-muted">Get more accounts, unlimited posts, and advanced features.</p>
                  </div>
                  <Link to="/billing" className="sfs-btn sfs-btn-primary ml-auto">
                    Upgrade Now
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="sfs-grid sfs-grid-2 gap-8">
          {/* Quick Actions */}
          <div className="sfs-card">
            <div className="sfs-card-header">
              <h3 className="sfs-heading-3">Quick Actions</h3>
            </div>
            <div className="sfs-card-body">
              <div className="space-y-4">
                <Link to="/posts/create" className="sfs-flex items-center p-4 bg-gradient-to-r from-sfs-gold-light to-yellow-50 rounded-lg hover:shadow-md transition-all group">
                  <div className="w-12 h-12 bg-sfs-gold rounded-lg sfs-flex sfs-flex-center mr-4">
                    <PlusIcon className="w-6 h-6 text-sfs-black" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sfs-text group-hover:text-sfs-gold-dark transition-colors">Create Post</h4>
                    <p className="text-sm text-sfs-text-muted">Generate AI-powered content</p>
                  </div>
                </Link>

                <Link to="/accounts" className="sfs-flex items-center p-4 bg-blue-50 rounded-lg hover:shadow-md transition-all group">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg sfs-flex sfs-flex-center mr-4">
                    <MegaphoneIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sfs-text group-hover:text-blue-600 transition-colors">Connect Account</h4>
                    <p className="text-sm text-sfs-text-muted">Link your social profiles</p>
                  </div>
                </Link>

                <Link to="/analytics" className="sfs-flex items-center p-4 bg-green-50 rounded-lg hover:shadow-md transition-all group">
                  <div className="w-12 h-12 bg-green-500 rounded-lg sfs-flex sfs-flex-center mr-4">
                    <ChartBarIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sfs-text group-hover:text-green-600 transition-colors">View Analytics</h4>
                    <p className="text-sm text-sfs-text-muted">Track your performance</p>
                  </div>
                </Link>

                <Link to="/team" className="sfs-flex items-center p-4 bg-purple-50 rounded-lg hover:shadow-md transition-all group">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg sfs-flex sfs-flex-center mr-4">
                    <UserGroupIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sfs-text group-hover:text-purple-600 transition-colors">Invite Team</h4>
                    <p className="text-sm text-sfs-text-muted">Collaborate with your team</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="sfs-card">
            <div className="sfs-card-header sfs-flex sfs-flex-between">
              <h3 className="sfs-heading-3">Recent Posts</h3>
              <Link to="/posts" className="text-sfs-primary hover:text-sfs-primary-hover text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="sfs-card-body">
              {data.recentPosts.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="font-medium text-sfs-text mb-2">No posts yet</h4>
                  <p className="text-sfs-text-muted text-sm mb-4">Create your first post to get started</p>
                  <Link to="/posts/create" className="sfs-btn sfs-btn-primary sfs-btn-sm">
                    Create Post
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.recentPosts.slice(0, 5).map((post) => (
                    <div key={post.id} className="sfs-flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl">{getPlatformIcon(post.platform)}</div>
                      <div className="flex-1">
                        <p className="text-sm text-sfs-text line-clamp-2 mb-1">
                          {post.content.substring(0, 100)}...
                        </p>
                        <div className="sfs-flex items-center gap-4 text-xs text-sfs-text-muted">
                          <span className="capitalize">{post.platform}</span>
                          <span className="sfs-flex items-center gap-1">
                            {post.status === 'published' ? (
                              <CheckCircleIcon className="w-4 h-4 text-sfs-success" />
                            ) : (
                              <ClockIcon className="w-4 h-4 text-sfs-warning" />
                            )}
                            {post.status === 'published' ? 'Published' : 'Scheduled'}
                          </span>
                          <span>
                            {post.status === 'published' 
                              ? new Date(post.publishedAt!).toLocaleDateString()
                              : post.scheduledFor 
                                ? new Date(post.scheduledFor).toLocaleDateString()
                                : new Date(post.createdAt).toLocaleDateString()
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="sfs-grid sfs-grid-3 gap-6 mt-8">
          <div className="sfs-card text-center">
            <div className="sfs-card-body">
              <ChartBarIcon className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-sfs-text mb-1">{data.stats.botsCount}</div>
              <div className="text-sfs-text-muted text-sm">Active Bots</div>
            </div>
          </div>

          <div className="sfs-card text-center">
            <div className="sfs-card-body">
              <UserGroupIcon className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-sfs-text mb-1">{data.stats.clientsCount}</div>
              <div className="text-sfs-text-muted text-sm">Clients</div>
            </div>
          </div>

          <div className="sfs-card text-center">
            <div className="sfs-card-body">
              <TrendingUpIcon className="w-8 h-8 text-sfs-gold-dark mx-auto mb-3" />
              <div className="text-2xl font-bold text-sfs-text mb-1">
                {Math.round((data.stats.socialAccountsCount + data.stats.botsCount) / 2 * 100) / 10}%
              </div>
              <div className="text-sfs-text-muted text-sm">Growth Rate</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;