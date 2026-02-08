import React, { useState } from 'react';
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

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={closeMenu}>
          <div 
            className="absolute right-0 top-0 h-full w-64 bg-white shadow-xl transform transition-transform"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sfs-flex sfs-flex-between items-center p-6 border-b border-gray-200">
              <div className="sfs-flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-sfs-gold to-sfs-gold-dark rounded-lg sfs-flex sfs-flex-center">
                  <span className="text-sm font-bold text-sfs-black">SFS</span>
                </div>
                <span className="font-bold text-sfs-text text-sm">SocialScale</span>
              </div>
              <button
                onClick={closeMenu}
                className="p-2 rounded-lg text-sfs-text-light hover:text-sfs-text hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="p-6">
              {isLoggedIn ? (
                // Logged in menu
                <nav className="space-y-4">
                  <Link
                    to="/dashboard"
                    className="block py-3 px-4 text-sfs-text hover:bg-sfs-gold-light rounded-lg transition-colors"
                    onClick={closeMenu}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/posts"
                    className="block py-3 px-4 text-sfs-text hover:bg-sfs-gold-light rounded-lg transition-colors"
                    onClick={closeMenu}
                  >
                    Posts
                  </Link>
                  <Link
                    to="/accounts"
                    className="block py-3 px-4 text-sfs-text hover:bg-sfs-gold-light rounded-lg transition-colors"
                    onClick={closeMenu}
                  >
                    Social Accounts
                  </Link>
                  <Link
                    to="/analytics"
                    className="block py-3 px-4 text-sfs-text hover:bg-sfs-gold-light rounded-lg transition-colors"
                    onClick={closeMenu}
                  >
                    Analytics
                  </Link>
                  <Link
                    to="/team"
                    className="block py-3 px-4 text-sfs-text hover:bg-sfs-gold-light rounded-lg transition-colors"
                    onClick={closeMenu}
                  >
                    Team
                  </Link>
                  <Link
                    to="/billing"
                    className="block py-3 px-4 text-sfs-text hover:bg-sfs-gold-light rounded-lg transition-colors"
                    onClick={closeMenu}
                  >
                    Billing
                  </Link>
                  <Link
                    to="/settings"
                    className="block py-3 px-4 text-sfs-text hover:bg-sfs-gold-light rounded-lg transition-colors"
                    onClick={closeMenu}
                  >
                    Settings
                  </Link>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        localStorage.removeItem('auth_token');
                        localStorage.removeItem('user_data');
                        closeMenu();
                        window.location.href = '/';
                      }}
                      className="block w-full text-left py-3 px-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </nav>
              ) : (
                // Public menu
                <nav className="space-y-4">
                  <Link
                    to="/features"
                    className="block py-3 px-4 text-sfs-text hover:bg-sfs-gold-light rounded-lg transition-colors"
                    onClick={closeMenu}
                  >
                    Features
                  </Link>
                  <Link
                    to="/pricing"
                    className="block py-3 px-4 text-sfs-text hover:bg-sfs-gold-light rounded-lg transition-colors"
                    onClick={closeMenu}
                  >
                    Pricing
                  </Link>
                  <Link
                    to="/demo"
                    className="block py-3 px-4 text-sfs-text hover:bg-sfs-gold-light rounded-lg transition-colors"
                    onClick={closeMenu}
                  >
                    Demo
                  </Link>
                  
                  <div className="pt-4 space-y-3">
                    <Link
                      to="/login"
                      className="block py-3 px-4 text-center text-sfs-text hover:bg-gray-100 rounded-lg transition-colors border border-gray-300"
                      onClick={closeMenu}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="block py-3 px-4 text-center bg-sfs-primary text-sfs-black hover:bg-sfs-primary-hover rounded-lg transition-colors font-semibold"
                      onClick={closeMenu}
                    >
                      Start Free Trial
                    </Link>
                  </div>
                </nav>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;