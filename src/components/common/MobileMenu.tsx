import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import '../../styles/brand.css';

interface MobileMenuProps {
  isLoggedIn?: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isLoggedIn = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('sfs-mobile-menu-open');
    } else {
      document.body.classList.remove('sfs-mobile-menu-open');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('sfs-mobile-menu-open');
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      {/* Menu Button */}
      <button
        onClick={toggleMenu}
        className="p-2 rounded-lg text-sfs-text-light hover:text-sfs-text hover:bg-gray-100 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <Bars3Icon className="w-6 h-6" />
        )}
      </button>

      {/* Mobile Menu Slide-Out */}
      <div className={`sfs-mobile-menu fixed top-0 right-0 h-full w-80 bg-white shadow-2xl sfs-mobile-menu-slide ${
        isOpen ? 'open' : ''
      }`}>
        <div className="h-full flex flex-col"
             onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="sfs-flex sfs-flex-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-sfs-background to-sfs-gold-light">
            <div className="sfs-flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-sfs-gold to-sfs-gold-dark rounded-lg sfs-flex sfs-flex-center shadow-md">
                <span className="text-lg font-bold text-sfs-black">SFS</span>
              </div>
              <div>
                <span className="font-bold text-sfs-text">SocialScale</span>
                <div className="text-xs text-sfs-text-muted">Booster</div>
              </div>
            </div>
            <button
              onClick={closeMenu}
              className="p-2 rounded-full text-sfs-text-light hover:text-sfs-text hover:bg-white hover:shadow-md transition-all duration-200"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto py-4">
              {isLoggedIn ? (
                // Logged in menu
                <nav className="px-2">
                  <div className="space-y-1">
                    <Link
                      to="/dashboard"
                      className="sfs-mobile-menu-item block py-4 px-6 text-sfs-text hover:bg-sfs-gold-light rounded-xl transition-all duration-200 font-medium"
                      onClick={closeMenu}
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-lg">📊</span>
                        Dashboard
                      </span>
                    </Link>
                    <Link
                      to="/posts"
                      className="sfs-mobile-menu-item block py-4 px-6 text-sfs-text hover:bg-sfs-gold-light rounded-xl transition-all duration-200 font-medium"
                      onClick={closeMenu}
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-lg">📝</span>
                        Posts
                      </span>
                    </Link>
                    <Link
                      to="/accounts"
                      className="sfs-mobile-menu-item block py-4 px-6 text-sfs-text hover:bg-sfs-gold-light rounded-xl transition-all duration-200 font-medium"
                      onClick={closeMenu}
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-lg">📱</span>
                        Social Accounts
                      </span>
                    </Link>
                    <Link
                      to="/analytics"
                      className="sfs-mobile-menu-item block py-4 px-6 text-sfs-text hover:bg-sfs-gold-light rounded-xl transition-all duration-200 font-medium"
                      onClick={closeMenu}
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-lg">📈</span>
                        Analytics
                      </span>
                    </Link>
                    <Link
                      to="/team"
                      className="sfs-mobile-menu-item block py-4 px-6 text-sfs-text hover:bg-sfs-gold-light rounded-xl transition-all duration-200 font-medium"
                      onClick={closeMenu}
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-lg">👥</span>
                        Team
                      </span>
                    </Link>
                    <Link
                      to="/billing"
                      className="sfs-mobile-menu-item block py-4 px-6 text-sfs-text hover:bg-sfs-gold-light rounded-xl transition-all duration-200 font-medium"
                      onClick={closeMenu}
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-lg">💳</span>
                        Billing
                      </span>
                    </Link>
                    <Link
                      to="/settings"
                      className="sfs-mobile-menu-item block py-4 px-6 text-sfs-text hover:bg-sfs-gold-light rounded-xl transition-all duration-200 font-medium"
                      onClick={closeMenu}
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-lg">⚙️</span>
                        Settings
                      </span>
                    </Link>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => {
                        localStorage.removeItem('auth_token');
                        localStorage.removeItem('user_data');
                        closeMenu();
                        window.location.href = '/';
                      }}
                      className="sfs-mobile-menu-item block w-full text-left py-4 px-6 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium"
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-lg">🚪</span>
                        Sign Out
                      </span>
                    </button>
                  </div>
                </nav>
              ) : (
                // Public menu
                <nav className="px-2">
                  <div className="space-y-1">
                    <Link
                      to="/features"
                      className="sfs-mobile-menu-item block py-4 px-6 text-sfs-text hover:bg-sfs-gold-light rounded-xl transition-all duration-200 font-medium"
                      onClick={closeMenu}
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-lg">✨</span>
                        Features
                      </span>
                    </Link>
                    <Link
                      to="/pricing"
                      className="sfs-mobile-menu-item block py-4 px-6 text-sfs-text hover:bg-sfs-gold-light rounded-xl transition-all duration-200 font-medium"
                      onClick={closeMenu}
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-lg">💰</span>
                        Pricing
                      </span>
                    </Link>
                    <Link
                      to="/demo"
                      className="sfs-mobile-menu-item block py-4 px-6 text-sfs-text hover:bg-sfs-gold-light rounded-xl transition-all duration-200 font-medium"
                      onClick={closeMenu}
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-lg">🎬</span>
                        Demo
                      </span>
                    </Link>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-200 space-y-3">
                    <Link
                      to="/login"
                      className="block py-4 px-6 text-center text-sfs-text hover:bg-gray-100 rounded-xl transition-all duration-200 border-2 border-gray-300 font-medium"
                      onClick={closeMenu}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="block py-4 px-6 text-center bg-gradient-to-r from-sfs-primary to-sfs-gold-dark text-sfs-black hover:shadow-lg rounded-xl transition-all duration-200 font-bold shadow-md"
                      onClick={closeMenu}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <span className="text-lg">🚀</span>
                        Start Free Trial
                      </span>
                    </Link>
                  </div>
                </nav>
              )}
            </div>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-40 sfs-mobile-menu-backdrop z-40 transition-all duration-300"
          onClick={closeMenu}
        />
      )}
    </div>
  );
};

export default MobileMenu;