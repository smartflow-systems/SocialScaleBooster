import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  PlusIcon,
  ChartBarIcon,
  CalendarIcon,
  UserGroupIcon,
  CogIcon,
  BellIcon,
  MegaphoneIcon,
  ArrowTrendingUpIcon as TrendingUpIcon,
  ClockIcon,
  CheckCircleIcon,
  HomeIcon,
  PhotoIcon,
  CreditCardIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
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

const NAV_SECTIONS = [
  {
    label: 'Overview',
    links: [
      { to: '/dashboard', label: 'Dashboard', icon: HomeIcon },
      { to: '/analytics', label: 'Analytics', icon: ChartBarIcon },
    ],
  },
  {
    label: 'Content',
    links: [
      { to: '/posts/create', label: 'Create Post', icon: PlusIcon },
      { to: '/posts', label: 'All Posts', icon: PhotoIcon },
      { to: '/schedule', label: 'Schedule', icon: CalendarIcon },
    ],
  },
  {
    label: 'Manage',
    links: [
      { to: '/accounts', label: 'Social Accounts', icon: MegaphoneIcon },
      { to: '/team', label: 'Team', icon: UserGroupIcon },
      { to: '/billing', label: 'Billing', icon: CreditCardIcon },
    ],
  },
  {
    label: 'System',
    links: [
      { to: '/settings', label: 'Settings', icon: CogIcon },
    ],
  },
];

const PlatformIcon: React.FC<{ platform: string }> = ({ platform }) => {
  const p = platform.toLowerCase();
  const colors: Record<string, string> = {
    instagram: '#E1306C',
    twitter: '#1DA1F2',
    facebook: '#1877F2',
    linkedin: '#0A66C2',
    tiktok: '#69C9D0',
    youtube: '#FF0000',
  };
  const color = colors[p] || '#D4AF37';
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        background: `${color}22`,
        border: `1px solid ${color}44`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <span style={{ fontSize: 14, fontWeight: 700, color }}>{platform[0]?.toUpperCase()}</span>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setData(await response.json());
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUsagePct = (current: number, limit: number) =>
    limit === -1 ? 0 : Math.min((current / limit) * 100, 100);

  if (loading) {
    return (
      <div className="min-h-screen sfs-flex sfs-flex-center" style={{ background: 'var(--sfs-background)' }}>
        <div className="text-center">
          <div
            style={{
              width: 48,
              height: 48,
              border: '3px solid rgba(212,175,55,0.2)',
              borderTop: '3px solid var(--sfs-gold)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 1rem',
            }}
          />
          <p style={{ color: 'var(--sfs-text-muted)' }}>Loading dashboard…</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen sfs-flex sfs-flex-center" style={{ background: 'var(--sfs-background)' }}>
        <div className="text-center">
          <p className="text-sfs-error" style={{ marginBottom: '1rem' }}>Failed to load dashboard</p>
          <button onClick={fetchDashboardData} className="sfs-btn sfs-btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const planLabel =
    data.organization.plan === 'trial' ? 'Free Trial' :
    data.organization.plan === 'starter' ? 'Starter' : 'Pro';

  const Sidebar = (
    <aside className="sfs-sidebar">
      <div className="sfs-sidebar-logo">
        <div className="sfs-sidebar-logo-icon">SFS</div>
        <div>
          <div className="sfs-sidebar-logo-text">SocialScale</div>
          <div className="sfs-sidebar-logo-sub">{planLabel} Plan</div>
        </div>
      </div>

      <nav className="sfs-sidebar-nav">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="sfs-sidebar-section">
            <div className="sfs-sidebar-section-label">{section.label}</div>
            {section.links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`sfs-sidebar-link${location.pathname === to ? ' active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon />
                {label}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <div className="sfs-sidebar-footer">
        <div style={{ fontSize: '0.75rem', color: 'var(--sfs-text-muted)', marginBottom: '0.5rem' }}>
          {data.organization.name}
        </div>
        <Link to="/billing" className="sfs-btn sfs-btn-primary" style={{ width: '100%', fontSize: '0.8rem', padding: '0.5rem 1rem', minHeight: 36 }}>
          {data.organization.plan === 'trial' ? 'Upgrade Plan' : 'Manage Billing'}
        </Link>
      </div>
    </aside>
  );

  return (
    <div className="sfs-app-layout">
      {/* Sidebar — desktop */}
      {Sidebar}

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 99 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {sidebarOpen && (
        <aside className="sfs-sidebar" style={{ zIndex: 200, display: 'flex' }}>
          {Sidebar.props.children}
        </aside>
      )}

      {/* Main content */}
      <div className="sfs-main-content">
        {/* Top bar */}
        <header className="sfs-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              className="md:hidden"
              onClick={() => setSidebarOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--sfs-text-light)', padding: 4 }}
            >
              <Bars3Icon style={{ width: 22, height: 22 }} />
            </button>
            <div>
              <h1 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--sfs-text)', margin: 0 }}>
                Dashboard
              </h1>
              <p style={{ fontSize: '0.75rem', color: 'var(--sfs-text-muted)', margin: 0 }}>
                {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              style={{ background: 'var(--sfs-surface-2)', border: '1px solid var(--sfs-dark-border)', borderRadius: 8, padding: '0.4rem', cursor: 'pointer', color: 'var(--sfs-text-light)' }}
            >
              <BellIcon style={{ width: 18, height: 18 }} />
            </button>
            <Link
              to="/settings"
              style={{ background: 'var(--sfs-surface-2)', border: '1px solid var(--sfs-dark-border)', borderRadius: 8, padding: '0.4rem', cursor: 'pointer', color: 'var(--sfs-text-light)', display: 'flex' }}
            >
              <CogIcon style={{ width: 18, height: 18 }} />
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main style={{ padding: '1.5rem', flex: 1 }}>
          {/* Welcome */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--sfs-text)', margin: '0 0 0.25rem' }}>
              Welcome back
            </h2>
            <p style={{ color: 'var(--sfs-text-muted)', margin: 0, fontSize: '0.875rem' }}>
              Here's what's happening with {data.organization.name} today.
            </p>
          </div>

          {/* KPI Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {[
              { label: 'Social Accounts', value: data.stats.socialAccountsCount, icon: MegaphoneIcon, color: 'var(--sfs-gold)' },
              { label: 'Active Bots', value: data.stats.botsCount, icon: ChartBarIcon, color: '#22C55E' },
              { label: 'Clients', value: data.stats.clientsCount, icon: UserGroupIcon, color: 'var(--sfs-gold-dark)' },
              {
                label: 'Posts This Month',
                value: data.organization.currentUsage.postsThisMonth,
                icon: PhotoIcon,
                color: '#B8960C',
              },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="sfs-stat-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--sfs-text-muted)', fontWeight: 500 }}>{label}</span>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon style={{ width: 16, height: 16, color }} />
                  </div>
                </div>
                <div className="sfs-stat-number">{value}</div>
              </div>
            ))}
          </div>

          {/* Plan Usage + Quick Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            {/* Plan Usage */}
            <div className="sfs-card">
              <div className="sfs-card-header">
                <h3 className="sfs-heading-3" style={{ fontSize: '0.9375rem' }}>Plan Usage</h3>
              </div>
              <div className="sfs-card-body">
                {[
                  {
                    label: 'Social Accounts',
                    current: data.organization.currentUsage.socialAccounts,
                    limit: data.organization.planLimits.socialAccounts,
                  },
                  {
                    label: 'Posts This Month',
                    current: data.organization.currentUsage.postsThisMonth,
                    limit: data.organization.planLimits.postsPerMonth,
                  },
                  {
                    label: 'Team Members',
                    current: data.organization.currentUsage.users,
                    limit: data.organization.planLimits.users,
                  },
                ].map(({ label, current, limit }) => (
                  <div key={label} style={{ marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--sfs-text-light)' }}>{label}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--sfs-text-muted)' }}>
                        {current} / {limit === -1 ? '∞' : limit}
                      </span>
                    </div>
                    <div className="sfs-usage-bar">
                      <div
                        className="sfs-usage-fill"
                        style={{ width: `${getUsagePct(current, limit)}%` }}
                      />
                    </div>
                  </div>
                ))}

                {data.organization.plan === 'trial' && (
                  <div className="sfs-upgrade-banner">
                    <TrendingUpIcon style={{ width: 20, height: 20, color: 'var(--sfs-gold)', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--sfs-text)', marginBottom: '0.15rem' }}>
                        Unlock unlimited potential
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--sfs-text-muted)' }}>
                        More accounts, unlimited posts, priority support.
                      </div>
                    </div>
                    <Link to="/billing" className="sfs-btn sfs-btn-primary" style={{ fontSize: '0.75rem', padding: '0.4rem 0.875rem', minHeight: 32 }}>
                      Upgrade
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="sfs-card">
              <div className="sfs-card-header">
                <h3 className="sfs-heading-3" style={{ fontSize: '0.9375rem' }}>Quick Actions</h3>
              </div>
              <div className="sfs-card-body">
                {[
                  { to: '/posts/create', label: 'Create Post', sub: 'AI-powered content generation', icon: PlusIcon, iconClass: 'sfs-action-icon-gold' },
                  { to: '/accounts', label: 'Connect Account', sub: 'Link your social profiles', icon: MegaphoneIcon, iconClass: 'sfs-action-icon-brown' },
                  { to: '/analytics', label: 'View Analytics', sub: 'Track your performance', icon: ChartBarIcon, iconClass: 'sfs-action-icon-gold' },
                  { to: '/team', label: 'Invite Team', sub: 'Collaborate with your team', icon: UserGroupIcon, iconClass: 'sfs-action-icon-brown' },
                ].map(({ to, label, sub, icon: Icon, iconClass }) => (
                  <Link key={to} to={to} className="sfs-action-row">
                    <div className={`sfs-action-icon ${iconClass}`}>
                      <Icon style={{ width: 18, height: 18, color: iconClass === 'sfs-action-icon-gold' ? '#0D0D0D' : '#E9E6DF' }} />
                    </div>
                    <div>
                      <div className="sfs-action-title">{label}</div>
                      <div className="sfs-action-sub">{sub}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Posts */}
          <div className="sfs-card">
            <div className="sfs-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="sfs-heading-3" style={{ fontSize: '0.9375rem' }}>Recent Posts</h3>
              <Link to="/posts" style={{ fontSize: '0.8rem', color: 'var(--sfs-gold)', textDecoration: 'none', fontWeight: 500 }}>
                View All →
              </Link>
            </div>
            <div className="sfs-card-body">
              {data.recentPosts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <CalendarIcon style={{ width: 40, height: 40, color: 'var(--sfs-text-muted)', margin: '0 auto 1rem' }} />
                  <p style={{ color: 'var(--sfs-text-muted)', marginBottom: '1rem', fontSize: '0.875rem' }}>
                    No posts yet. Create your first to get started.
                  </p>
                  <Link to="/posts/create" className="sfs-btn sfs-btn-primary" style={{ fontSize: '0.8rem', padding: '0.5rem 1.25rem', minHeight: 36 }}>
                    Create Post
                  </Link>
                </div>
              ) : (
                <div>
                  {data.recentPosts.slice(0, 5).map((post) => (
                    <div key={post.id} className="sfs-post-row">
                      <PlatformIcon platform={post.platform} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--sfs-text)', margin: '0 0 0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {post.content.substring(0, 120)}
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.72rem', color: 'var(--sfs-text-muted)', alignItems: 'center' }}>
                          <span style={{ textTransform: 'capitalize' }}>{post.platform}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            {post.status === 'published' ? (
                              <CheckCircleIcon style={{ width: 13, height: 13, color: 'var(--sfs-success)' }} />
                            ) : (
                              <ClockIcon style={{ width: 13, height: 13, color: 'var(--sfs-warning)' }} />
                            )}
                            {post.status === 'published' ? 'Published' : 'Scheduled'}
                          </span>
                          <span>
                            {new Date(post.publishedAt || post.scheduledFor || post.createdAt).toLocaleDateString('en-GB')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
