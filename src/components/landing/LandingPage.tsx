import React from 'react';
import { Link } from 'react-router-dom';
import { CheckIcon, StarIcon } from '@heroicons/react/24/solid';
import MobileMenu from '../common/MobileMenu';
import '../../styles/brand.css';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sfs-background via-white to-sfs-gold-light">
      {/* Header */}
      <header className="sfs-container py-6">
        <nav className="sfs-flex sfs-flex-between">
          <div className="sfs-flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-sfs-gold to-sfs-gold-dark rounded-lg sfs-flex sfs-flex-center">
              <span className="text-xl font-bold text-sfs-black">SFS</span>
            </div>
            <span className="text-xl font-bold text-sfs-text">SocialScaleBooster</span>
          </div>
          
          <div className="sfs-flex items-center gap-6">
            <div className="hidden md:sfs-flex items-center gap-6">
              <Link to="/features" className="text-sfs-text-light hover:text-sfs-text transition-colors">
                Features
              </Link>
              <Link to="/pricing" className="text-sfs-text-light hover:text-sfs-text transition-colors">
                Pricing
              </Link>
              <Link to="/login" className="text-sfs-text-light hover:text-sfs-text transition-colors">
                Sign In
              </Link>
              <Link to="/signup" className="sfs-btn sfs-btn-primary">
                Start Free Trial
              </Link>
            </div>
            <MobileMenu isLoggedIn={false} />
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="sfs-container py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-sfs-gold-light px-4 py-2 rounded-full mb-6">
            <StarIcon className="w-5 h-5 text-sfs-gold-dark" />
            <span className="text-sfs-gold-dark font-semibold text-sm">Trusted by 1000+ businesses</span>
          </div>
          
          <h1 className="sfs-heading-1 mb-6 leading-tight">
            Scale Your Social Media Like a{' '}
            <span className="text-transparent bg-gradient-to-r from-sfs-gold to-sfs-gold-dark bg-clip-text">
              Pro
            </span>
          </h1>
          
          <p className="sfs-text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Automate your social media strategy with AI-powered content creation, 
            smart scheduling, and advanced analytics. Grow your audience faster 
            than ever before.
          </p>
          
          <div className="sfs-flex sfs-flex-center gap-4 mb-12">
            <Link to="/signup" className="sfs-btn sfs-btn-primary sfs-btn-lg">
              Start 14-Day Free Trial
            </Link>
            <Link to="/demo" className="sfs-btn sfs-btn-outline sfs-btn-lg">
              Watch Demo
            </Link>
          </div>
          
          <div className="sfs-text-muted text-sm">
            ✨ No credit card required • Cancel anytime • 5-minute setup
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="sfs-container py-20">
        <div className="text-center mb-16">
          <h2 className="sfs-heading-2 mb-4">Everything You Need to Dominate Social Media</h2>
          <p className="sfs-text-lg text-sfs-text-light">
            From content creation to analytics, we've got your entire social media workflow covered.
          </p>
        </div>
        
        <div className="sfs-grid sfs-grid-3">
          <div className="sfs-card text-center">
            <div className="sfs-card-body">
              <div className="w-16 h-16 bg-gradient-to-r from-sfs-gold to-sfs-gold-dark rounded-xl mx-auto mb-4 sfs-flex sfs-flex-center">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="sfs-heading-3 mb-3">AI Content Generation</h3>
              <p className="sfs-text-muted">
                Generate engaging posts, captions, and hashtags with our advanced AI. 
                Save hours every week.
              </p>
            </div>
          </div>
          
          <div className="sfs-card text-center">
            <div className="sfs-card-body">
              <div className="w-16 h-16 bg-gradient-to-r from-sfs-brown to-sfs-brown-light rounded-xl mx-auto mb-4 sfs-flex sfs-flex-center">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="sfs-heading-3 mb-3">Smart Scheduling</h3>
              <p className="sfs-text-muted">
                Post at the perfect time for maximum engagement. Our AI finds your 
                audience's most active hours.
              </p>
            </div>
          </div>
          
          <div className="sfs-card text-center">
            <div className="sfs-card-body">
              <div className="w-16 h-16 bg-gradient-to-r from-sfs-info to-blue-600 rounded-xl mx-auto mb-4 sfs-flex sfs-flex-center">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="sfs-heading-3 mb-3">Advanced Analytics</h3>
              <p className="sfs-text-muted">
                Track what works with detailed insights. Understand your audience 
                and optimize your strategy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="sfs-container py-20" id="pricing">
        <div className="text-center mb-16">
          <h2 className="sfs-heading-2 mb-4">Simple, Transparent Pricing</h2>
          <p className="sfs-text-lg text-sfs-text-light">
            Choose the plan that fits your business. Scale up as you grow.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto sfs-grid sfs-grid-2 gap-8">
          {/* Starter Plan */}
          <div className="sfs-card hover:border-sfs-primary transition-colors">
            <div className="sfs-card-body">
              <div className="text-center mb-6">
                <h3 className="sfs-heading-3 mb-2">Starter</h3>
                <div className="sfs-flex sfs-flex-center items-baseline gap-1">
                  <span className="text-4xl font-bold text-sfs-text">£29</span>
                  <span className="text-sfs-text-light">/month</span>
                </div>
                <p className="sfs-text-muted mt-2">Perfect for small businesses</p>
              </div>
              
              <ul className="space-y-4 mb-8">
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
                  <span>AI content generation</span>
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
              
              <Link to="/signup?plan=starter" className="sfs-btn sfs-btn-primary w-full">
                Start Free Trial
              </Link>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="sfs-card border-2 border-sfs-gold relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="sfs-badge sfs-badge-gold px-4 py-2">Most Popular</span>
            </div>
            
            <div className="sfs-card-body">
              <div className="text-center mb-6">
                <h3 className="sfs-heading-3 mb-2">Pro</h3>
                <div className="sfs-flex sfs-flex-center items-baseline gap-1">
                  <span className="text-4xl font-bold text-sfs-text">£99</span>
                  <span className="text-sfs-text-light">/month</span>
                </div>
                <p className="sfs-text-muted mt-2">For growing agencies</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="sfs-flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-sfs-success mt-0.5 flex-shrink-0" />
                  <span>10 social media accounts</span>
                </li>
                <li className="sfs-flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-sfs-success mt-0.5 flex-shrink-0" />
                  <span>Unlimited posts</span>
                </li>
                <li className="sfs-flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-sfs-success mt-0.5 flex-shrink-0" />
                  <span>Advanced AI features</span>
                </li>
                <li className="sfs-flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-sfs-success mt-0.5 flex-shrink-0" />
                  <span>Team collaboration (5 users)</span>
                </li>
                <li className="sfs-flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-sfs-success mt-0.5 flex-shrink-0" />
                  <span>Advanced analytics & reports</span>
                </li>
                <li className="sfs-flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-sfs-success mt-0.5 flex-shrink-0" />
                  <span>Priority support</span>
                </li>
              </ul>
              
              <Link to="/signup?plan=pro" className="sfs-btn sfs-btn-primary w-full">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <p className="sfs-text-muted">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-sfs-surface py-20">
        <div className="sfs-container text-center">
          <h2 className="sfs-heading-2 mb-12">Trusted by Growing Businesses</h2>
          
          <div className="sfs-grid sfs-grid-3 mb-12">
            <div className="sfs-card">
              <div className="sfs-card-body text-left">
                <div className="sfs-flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
                  ))}
                </div>
                <p className="mb-4 italic">
                  "SocialScaleBooster transformed our social media presence. 
                  We're getting 3x more engagement and saving 10 hours per week."
                </p>
                <div>
                  <div className="font-semibold">Sarah Johnson</div>
                  <div className="text-sfs-text-muted text-sm">Marketing Director, TechStart</div>
                </div>
              </div>
            </div>
            
            <div className="sfs-card">
              <div className="sfs-card-body text-left">
                <div className="sfs-flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
                  ))}
                </div>
                <p className="mb-4 italic">
                  "The AI content generation is incredible. It's like having 
                  a social media expert on our team 24/7."
                </p>
                <div>
                  <div className="font-semibold">Mike Chen</div>
                  <div className="text-sfs-text-muted text-sm">Founder, LocalBiz</div>
                </div>
              </div>
            </div>
            
            <div className="sfs-card">
              <div className="sfs-card-body text-left">
                <div className="sfs-flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
                  ))}
                </div>
                <p className="mb-4 italic">
                  "Finally, analytics that actually help us understand our audience. 
                  Our ROI has doubled since switching."
                </p>
                <div>
                  <div className="font-semibold">Emma Rodriguez</div>
                  <div className="text-sfs-text-muted text-sm">Agency Owner, GrowthCo</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="sfs-flex sfs-flex-center gap-8 opacity-60">
            <span className="text-lg font-semibold">TechCrunch</span>
            <span className="text-lg font-semibold">Forbes</span>
            <span className="text-lg font-semibold">Entrepreneur</span>
            <span className="text-lg font-semibold">Inc.</span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-sfs-black via-sfs-brown to-sfs-black py-20">
        <div className="sfs-container text-center">
          <h2 className="sfs-heading-1 text-white mb-6">
            Ready to Scale Your Social Media?
          </h2>
          <p className="sfs-text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses already using SocialScaleBooster to 
            grow their social media presence and drive real results.
          </p>
          
          <Link to="/signup" className="sfs-btn sfs-btn-primary sfs-btn-lg">
            Start Your Free Trial Today
          </Link>
          
          <p className="text-gray-400 text-sm mt-4">
            14-day free trial • No credit card required • Setup in 5 minutes
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sfs-black text-white py-12">
        <div className="sfs-container">
          <div className="sfs-grid sfs-grid-3 mb-8">
            <div>
              <div className="sfs-flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-sfs-gold rounded-lg sfs-flex sfs-flex-center">
                  <span className="text-sm font-bold text-sfs-black">SFS</span>
                </div>
                <span className="font-bold">SocialScaleBooster</span>
              </div>
              <p className="text-gray-400 text-sm">
                The ultimate social media automation platform for growing businesses.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/integrations" className="hover:text-white transition-colors">Integrations</Link></li>
                <li><Link to="/api" className="hover:text-white transition-colors">API</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            © 2026 SmartFlow Systems. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;