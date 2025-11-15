import { useState, useEffect } from 'react';
import { X, Menu, Home, Bot, BarChart3, Store, Calendar, Users, Zap, Crown, Settings, LogOut, HelpCircle, FileText } from 'lucide-react';
import { useLocation } from 'wouter';

interface GitHubSidebarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  userStatus?: {
    isPremium?: boolean;
    botCount?: number;
    username?: string;
  };
}

export default function GitHubSidebar({ activeTab, setActiveTab, userStatus }: GitHubSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [location, navigate] = useLocation();

  // Determine if we're on the dashboard
  const isDashboard = location === '/dashboard';

  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Dashboard navigation items
  const dashboardItems = [
    { label: 'My Bots', icon: Bot, tab: 'bots' },
    { label: 'Analytics', icon: BarChart3, tab: 'analytics' },
    { label: 'Marketplace', icon: Store, tab: 'marketplace' },
    { label: 'Scheduling', icon: Calendar, tab: 'scheduling' },
    { label: 'Personality', icon: Users, tab: 'personality' },
    { label: 'Integrations', icon: Zap, tab: 'integrations' },
  ];

  // Landing page navigation items
  const landingItems = [
    { label: 'Home', icon: Home, href: '/' },
    { label: 'Features', icon: Zap, href: '/#features' },
    { label: 'Pricing', icon: Crown, href: '/#pricing' },
    { label: 'Marketplace', icon: Store, href: '/#marketplace' },
  ];

  // Common items
  const commonItems = [
    { label: 'Documentation', icon: FileText, href: '/docs', external: false },
    { label: 'Help & Support', icon: HelpCircle, href: '/support', external: false },
  ];

  const handleNavigation = (item: any) => {
    if (isDashboard && item.tab && setActiveTab) {
      // Dashboard tab navigation
      setActiveTab(item.tab);
      setIsOpen(false);
    } else if (item.href) {
      // Page navigation
      if (item.href.startsWith('/#')) {
        // Scroll to section on landing page
        if (location !== '/') {
          navigate('/');
          setTimeout(() => {
            const element = document.querySelector(item.href.substring(1));
            element?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        } else {
          const element = document.querySelector(item.href.substring(1));
          element?.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        navigate(item.href);
      }
      setIsOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      navigate('/');
      setIsOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const menuItems = isDashboard ? dashboardItems : landingItems;

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-5 left-5 z-50 p-2.5 bg-[#0D0D0D] rounded-lg hover:bg-[#3B2F2F] transition-all duration-200 shadow-lg hover:shadow-xl"
        aria-label="Toggle Menu"
      >
        <Menu className="w-6 h-6 text-[#FFD700]" />
      </button>

      {/* Overlay */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      />

      {/* Sidebar */}
      <nav
        className={`fixed top-0 left-0 h-screen w-[300px] bg-[#0D0D0D] text-[#F5F5DC] z-50 flex flex-col overflow-y-auto transition-transform duration-300 shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-[#FFD700] hover:text-[#E6C200] transition-colors hover:rotate-90 duration-200"
          aria-label="Close Menu"
        >
          <X className="w-8 h-8" />
        </button>

        {/* Header */}
        <div className="pt-16 px-5 pb-5 border-b border-[#3B2F2F]">
          <h2 className="text-[#FFD700] text-xl font-semibold">
            SocialScaleBooster
          </h2>
          {isDashboard && userStatus && (
            <div className="mt-2 text-sm text-[#F5F5DC]/80">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-pulse"></div>
                {userStatus.isPremium ? (
                  <span className="text-[#FFD700]">Pro Plan</span>
                ) : (
                  <span>Free Plan ({userStatus.botCount || 0}/3 bots)</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <div className="flex-grow overflow-y-auto">
          {/* Primary Menu */}
          <ul className="py-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = isDashboard && item.tab === activeTab;

              return (
                <li key={item.label}>
                  <button
                    onClick={() => handleNavigation(item)}
                    className={`w-full flex items-center gap-3 py-4 px-5 text-[#F5F5DC] hover:bg-[#3B2F2F] border-l-[3px] transition-all duration-200 ${
                      isActive
                        ? 'border-[#FFD700] bg-[#3B2F2F] text-[#FFD700]'
                        : 'border-transparent hover:border-[#FFD700] hover:pl-6'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Divider */}
          <div className="border-t border-[#3B2F2F] my-2"></div>

          {/* Common Items */}
          <ul className="py-3">
            {commonItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <button
                    onClick={() => handleNavigation(item)}
                    className="w-full flex items-center gap-3 py-3 px-5 text-[#F5F5DC]/80 hover:text-[#F5F5DC] hover:bg-[#3B2F2F] border-l-[3px] border-transparent hover:border-[#FFD700] transition-all duration-200 hover:pl-6"
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Page Switch */}
          {isDashboard && (
            <>
              <div className="border-t border-[#3B2F2F] my-2"></div>
              <ul className="py-3">
                <li>
                  <button
                    onClick={() => {
                      navigate('/');
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 py-3 px-5 text-[#F5F5DC]/80 hover:text-[#F5F5DC] hover:bg-[#3B2F2F] border-l-[3px] border-transparent hover:border-[#FFD700] transition-all duration-200 hover:pl-6"
                  >
                    <Home className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">Back to Home</span>
                  </button>
                </li>
              </ul>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#3B2F2F] p-5 space-y-3">
          {/* CTA Button */}
          {!isDashboard && (
            <button
              onClick={() => {
                navigate('/dashboard');
                setIsOpen(false);
              }}
              className="w-full py-3 px-4 bg-[#FFD700] text-[#0D0D0D] text-center font-semibold rounded-lg hover:bg-[#E6C200] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Go to Dashboard
            </button>
          )}

          {isDashboard && !userStatus?.isPremium && (
            <button
              onClick={() => {
                navigate('/subscribe');
                setIsOpen(false);
              }}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#0D0D0D] text-center font-semibold rounded-lg hover:from-[#E6C200] hover:to-[#FF8C00] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <Crown className="w-5 h-5" />
              Upgrade to Pro
            </button>
          )}

          {/* User Actions */}
          {isDashboard && (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  // Navigate to settings (can be implemented as a tab or modal)
                  if (setActiveTab) {
                    // For now, we can show it as a future feature
                    alert('Settings feature coming soon!');
                  }
                  setIsOpen(false);
                }}
                className="flex-1 py-2 px-3 bg-[#3B2F2F] text-[#F5F5DC] text-center text-sm font-medium rounded-lg hover:bg-[#4B3F3F] transition-colors flex items-center justify-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2 px-3 bg-[#3B2F2F] text-[#F5F5DC] text-center text-sm font-medium rounded-lg hover:bg-red-900/30 hover:text-red-400 transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
