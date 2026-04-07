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
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-sfs-gold-light px-4 py-2 rounded-full mb-6">
            <StarIcon className="w-5 h-5 text-sfs-gold-dark" />
            <span className="text-sfs-gold-dark font-semibold text-sm">Trusted by 2,500+ agencies & businesses</span>
          </div>
          
          <h1 className="sfs-heading-1 mb-6 leading-tight">
            Turn Social Media Into Your{' '}
            <span className="text-transparent bg-gradient-to-r from-sfs-gold to-sfs-gold-dark bg-clip-text">
              #1 Sales Channel
            </span>
          </h1>
          
          <p className="sfs-text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
            Stop wasting hours on social media that doesn't convert. Our AI-powered platform 
            creates industry-specific content, automates your posting, and tracks real ROI. 
            <strong className="text-sfs-text">Get 3x more leads in 30 days or we'll refund your money.</strong>
          </p>
          
          <div className="sfs-flex sfs-flex-center gap-4 mb-8">
            <Link to="/signup" className="sfs-btn sfs-btn-primary sfs-btn-lg">
              Get 3x More Leads - Start Free Trial
            </Link>
            <Link to="/roi-calculator" className="sfs-btn sfs-btn-outline sfs-btn-lg">
              📺 See ROI Calculator
            </Link>
          </div>
          
          <div className="sfs-text-muted text-sm mb-8">
            ✨ No credit card required • 15-minute setup • 30-day money-back guarantee
          </div>

          {/* Quick stats */}
          <div className="sfs-grid sfs-grid-3 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-sfs-text mb-1">312%</div>
              <div className="text-sm text-sfs-text-muted">Avg. Lead Increase</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-sfs-text mb-1">15min</div>
              <div className="text-sm text-sfs-text-muted">Setup Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-sfs-text mb-1">89%</div>
              <div className="text-sm text-sfs-text-muted">Customer Retention</div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Use Cases */}
      <section className="bg-sfs-surface py-20">
        <div className="sfs-container">
          <div className="text-center mb-16">
            <h2 className="sfs-heading-2 mb-4">Built for Your Industry</h2>
            <p className="sfs-text-lg text-sfs-text-light">
              Industry-specific templates, content, and automation flows that actually convert
            </p>
          </div>
          
          <div className="sfs-grid sfs-grid-2 gap-8 mb-16">
            {/* E-commerce */}
            <div className="sfs-card hover:shadow-lg transition-all">
              <div className="sfs-card-body">
                <div className="sfs-flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl sfs-flex sfs-flex-center flex-shrink-0">
                    <span className="text-2xl">🛍️</span>
                  </div>
                  <div>
                    <h3 className="sfs-heading-3 mb-2">E-commerce & Retail</h3>
                    <p className="text-sfs-text-muted mb-4">
                      Auto-generate product showcases, customer testimonials, and seasonal campaigns. 
                      Track sales from social posts with built-in conversion tracking.
                    </p>
                    <ul className="text-sm space-y-1">
                      <li>• Product launch sequences</li>
                      <li>• Cart abandonment recovery posts</li>
                      <li>• User-generated content campaigns</li>
                      <li>• Revenue attribution tracking</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Beauty & Wellness */}
            <div className="sfs-card hover:shadow-lg transition-all">
              <div className="sfs-card-body">
                <div className="sfs-flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl sfs-flex sfs-flex-center flex-shrink-0">
                    <span className="text-2xl">💄</span>
                  </div>
                  <div>
                    <h3 className="sfs-heading-3 mb-2">Beauty & Wellness</h3>
                    <p className="text-sfs-text-muted mb-4">
                      Share before/after transformations, tutorial content, and client spotlights. 
                      Automated booking funnels that turn followers into appointments.
                    </p>
                    <ul className="text-sm space-y-1">
                      <li>• Before/after showcase posts</li>
                      <li>• Tutorial and tip sequences</li>
                      <li>• Client testimonial automation</li>
                      <li>• Booking link optimization</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Real Estate */}
            <div className="sfs-card hover:shadow-lg transition-all">
              <div className="sfs-card-body">
                <div className="sfs-flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl sfs-flex sfs-flex-center flex-shrink-0">
                    <span className="text-2xl">🏠</span>
                  </div>
                  <div>
                    <h3 className="sfs-heading-3 mb-2">Real Estate</h3>
                    <p className="text-sfs-text-muted mb-4">
                      Showcase properties with virtual tours, market insights, and client success stories. 
                      Lead capture forms that qualify prospects automatically.
                    </p>
                    <ul className="text-sm space-y-1">
                      <li>• Property listing showcases</li>
                      <li>• Market update sequences</li>
                      <li>• Client success stories</li>
                      <li>• Lead qualification funnels</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Fitness & Health */}
            <div className="sfs-card hover:shadow-lg transition-all">
              <div className="sfs-card-body">
                <div className="sfs-flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl sfs-flex sfs-flex-center flex-shrink-0">
                    <span className="text-2xl">💪</span>
                  </div>
                  <div>
                    <h3 className="sfs-heading-3 mb-2">Fitness & Health</h3>
                    <p className="text-sfs-text-muted mb-4">
                      Share workout videos, transformation stories, and nutrition tips. 
                      Automated membership funnels and class booking integration.
                    </p>
                    <ul className="text-sm space-y-1">
                      <li>• Transformation showcases</li>
                      <li>• Daily workout content</li>
                      <li>• Nutrition tip sequences</li>
                      <li>• Class booking automation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link to="/signup" className="sfs-btn sfs-btn-primary sfs-btn-lg">
              Get Industry Templates - Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* Premium Differentiators */}
      <section className="sfs-container py-20">
        <div className="text-center mb-16">
          <h2 className="sfs-heading-2 mb-4">Why Businesses Choose SocialScaleBooster</h2>
          <p className="sfs-text-lg text-sfs-text-light">
            Premium features that actually drive revenue, not just vanity metrics
          </p>
        </div>
        
        <div className="sfs-grid sfs-grid-3 gap-8">
          <div className="sfs-card text-center hover:shadow-lg transition-all">
            <div className="sfs-card-body">
              <div className="w-16 h-16 bg-gradient-to-r from-sfs-gold to-sfs-gold-dark rounded-xl mx-auto mb-4 sfs-flex sfs-flex-center">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="sfs-heading-3 mb-3">AI Personalization Engine</h3>
              <p className="sfs-text-muted mb-4">
                Our AI learns your brand voice and creates content that sounds exactly like you. 
                No more generic, robotic posts.
              </p>
              <div className="text-sm font-medium text-sfs-success">
                ✅ Industry-specific training data<br/>
                ✅ Brand voice recognition<br/>
                ✅ Audience behavior analysis
              </div>
            </div>
          </div>
          
          <div className="sfs-card text-center hover:shadow-lg transition-all">
            <div className="sfs-card-body">
              <div className="w-16 h-16 bg-gradient-to-r from-sfs-brown to-sfs-brown-light rounded-xl mx-auto mb-4 sfs-flex sfs-flex-center">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="sfs-heading-3 mb-3">Smart Automation Flows</h3>
              <p className="sfs-text-muted mb-4">
                Pre-built workflows that nurture followers into customers automatically. 
                Set it once, profit forever.
              </p>
              <div className="text-sm font-medium text-sfs-success">
                ✅ Lead nurture sequences<br/>
                ✅ Retargeting campaigns<br/>
                ✅ Conversion tracking
              </div>
            </div>
          </div>
          
          <div className="sfs-card text-center hover:shadow-lg transition-all">
            <div className="sfs-card-body">
              <div className="w-16 h-16 bg-gradient-to-r from-sfs-info to-blue-600 rounded-xl mx-auto mb-4 sfs-flex sfs-flex-center">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="sfs-heading-3 mb-3">Revenue Attribution</h3>
              <p className="sfs-text-muted mb-4">
                See exactly which posts drive sales with our advanced tracking. 
                Prove social media ROI to stakeholders.
              </p>
              <div className="text-sm font-medium text-sfs-success">
                ✅ Sales tracking from posts<br/>
                ✅ Customer journey mapping<br/>
                ✅ ROI dashboard & reports
              </div>
            </div>
          </div>

          <div className="sfs-card text-center hover:shadow-lg transition-all">
            <div className="sfs-card-body">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl mx-auto mb-4 sfs-flex sfs-flex-center">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="sfs-heading-3 mb-3">Industry Presets</h3>
              <p className="sfs-text-muted mb-4">
                Start with proven content strategies for your specific industry. 
                No guessing, just results.
              </p>
              <div className="text-sm font-medium text-sfs-success">
                ✅ 50+ industry templates<br/>
                ✅ Competitor analysis<br/>
                ✅ Trending topic suggestions
              </div>
            </div>
          </div>

          <div className="sfs-card text-center hover:shadow-lg transition-all">
            <div className="sfs-card-body">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-xl mx-auto mb-4 sfs-flex sfs-flex-center">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="sfs-heading-3 mb-3">15-Minute Setup</h3>
              <p className="sfs-text-muted mb-4">
                Go from signup to first post in under 15 minutes. 
                Our guided setup does the heavy lifting.
              </p>
              <div className="text-sm font-medium text-sfs-success">
                ✅ One-click integrations<br/>
                ✅ Automated account setup<br/>
                ✅ Instant content library
              </div>
            </div>
          </div>

          <div className="sfs-card text-center hover:shadow-lg transition-all">
            <div className="sfs-card-body">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl mx-auto mb-4 sfs-flex sfs-flex-center">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="sfs-heading-3 mb-3">Funnel Integration</h3>
              <p className="sfs-text-muted mb-4">
                Connect social posts directly to your sales funnels. 
                Turn engagement into revenue automatically.
              </p>
              <div className="text-sm font-medium text-sfs-success">
                ✅ Landing page builder<br/>
                ✅ Lead capture forms<br/>
                ✅ CRM integrations
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-sfs-gold-light to-yellow-50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="sfs-heading-3 mb-4">🎁 Limited Time: Free Setup & Strategy Session</h3>
            <p className="sfs-text-lg mb-6">
              Our experts will set up your account AND create your first month's content calendar. 
              Normally £497, free for new customers this week only.
            </p>
            <Link to="/signup?bonus=setup" className="sfs-btn sfs-btn-primary sfs-btn-lg">
              Claim Free Setup ($497 Value)
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing - ROI Focused */}
      <section className="bg-sfs-surface py-20" id="pricing">
        <div className="sfs-container">
          <div className="text-center mb-16">
            <h2 className="sfs-heading-2 mb-4">Choose Your Revenue Growth Plan</h2>
            <p className="sfs-text-lg text-sfs-text-light">
              Our customers average 312% increase in social media leads within 90 days
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto sfs-grid sfs-grid-2 gap-8">
            {/* Growth Plan */}
            <div className="sfs-card hover:border-sfs-primary transition-all hover:shadow-lg">
              <div className="sfs-card-body">
                <div className="text-center mb-6">
                  <h3 className="sfs-heading-3 mb-2">Growth</h3>
                  <div className="sfs-flex sfs-flex-center items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold text-sfs-text">£97</span>
                    <span className="text-sfs-text-light">/month</span>
                  </div>
                  <p className="text-sfs-success font-medium">ROI: £2,910+ in new revenue</p>
                  <p className="sfs-text-muted text-sm">Perfect for small-medium businesses</p>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="text-sm font-medium text-green-800 mb-2">Typical Results in 90 Days:</div>
                  <div className="text-sm text-green-700">
                    • 150+ new qualified leads<br/>
                    • 30+ new customers<br/>
                    • £2,910+ additional revenue<br/>
                    • 20 hours/week time saved
                  </div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="sfs-flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-sfs-success mt-0.5 flex-shrink-0" />
                    <span><strong>5 social accounts</strong> (Instagram, Facebook, LinkedIn, Twitter, TikTok)</span>
                  </li>
                  <li className="sfs-flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-sfs-success mt-0.5 flex-shrink-0" />
                    <span><strong>Unlimited AI content</strong> with your brand voice</span>
                  </li>
                  <li className="sfs-flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-sfs-success mt-0.5 flex-shrink-0" />
                    <span><strong>Industry presets</strong> for your specific business</span>
                  </li>
                  <li className="sfs-flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-sfs-success mt-0.5 flex-shrink-0" />
                    <span><strong>Lead tracking & attribution</strong> (see which posts drive sales)</span>
                  </li>
                  <li className="sfs-flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-sfs-success mt-0.5 flex-shrink-0" />
                    <span><strong>Automation flows</strong> (nurture leads automatically)</span>
                  </li>
                  <li className="sfs-flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-sfs-success mt-0.5 flex-shrink-0" />
                    <span><strong>Free setup & strategy session</strong> (£497 value)</span>
                  </li>
                </ul>
                
                <Link to="/signup?plan=growth" className="sfs-btn sfs-btn-primary w-full mb-4">
                  Start Free Trial - Get 3x More Leads
                </Link>
                <div className="text-center text-sm text-sfs-text-muted">
                  30-day money-back guarantee
                </div>
              </div>
            </div>

            {/* Scale Plan */}
            <div className="sfs-card border-2 border-sfs-gold relative hover:shadow-xl transition-all">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-sfs-gold to-sfs-gold-dark text-sfs-black px-6 py-2 rounded-full font-bold text-sm">
                  🚀 RECOMMENDED
                </span>
              </div>
              
              <div className="sfs-card-body">
                <div className="text-center mb-6">
                  <h3 className="sfs-heading-3 mb-2">Scale</h3>
                  <div className="sfs-flex sfs-flex-center items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold text-sfs-text">£247</span>
                    <span className="text-sfs-text-light">/month</span>
                  </div>
                  <p className="text-sfs-success font-medium">ROI: £7,410+ in new revenue</p>
                  <p className="sfs-text-muted text-sm">For agencies & high-growth businesses</p>
                </div>
                
                <div className="bg-gradient-to-r from-sfs-gold-light to-yellow-50 border border-sfs-gold rounded-lg p-4 mb-6">
                  <div className="text-sm font-medium text-sfs-gold-dark mb-2">Typical Results in 90 Days:</div>
                  <div className="text-sm text-sfs-text">
                    • 380+ new qualified leads<br/>
                    • 76+ new customers<br/>
                    • £7,410+ additional revenue<br/>
                    • 35 hours/week time saved
                  </div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="sfs-flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-sfs-success mt-0.5 flex-shrink-0" />
                    <span><strong>Unlimited accounts</strong> across all platforms</span>
                  </li>
                  <li className="sfs-flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-sfs-success mt-0.5 flex-shrink-0" />
                    <span><strong>White-label solution</strong> (rebrand for clients)</span>
                  </li>
                  <li className="sfs-flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-sfs-success mt-0.5 flex-shrink-0" />
                    <span><strong>Team management</strong> (unlimited users)</span>
                  </li>
                  <li className="sfs-flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-sfs-success mt-0.5 flex-shrink-0" />
                    <span><strong>Advanced funnel builder</strong> + CRM integrations</span>
                  </li>
                  <li className="sfs-flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-sfs-success mt-0.5 flex-shrink-0" />
                    <span><strong>Priority support + dedicated success manager</strong></span>
                  </li>
                  <li className="sfs-flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-sfs-success mt-0.5 flex-shrink-0" />
                    <span><strong>Done-for-you setup</strong> + 3 months content planning</span>
                  </li>
                </ul>
                
                <Link to="/signup?plan=scale" className="sfs-btn sfs-btn-primary w-full mb-4">
                  Start Free Trial - Scale Your Agency
                </Link>
                <div className="text-center text-sm text-sfs-text-muted">
                  60-day money-back guarantee
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <div className="bg-white rounded-xl p-6 max-w-2xl mx-auto shadow-sm">
              <h4 className="font-bold text-sfs-text mb-3">💰 ROI Calculator</h4>
              <p className="text-sm text-sfs-text-muted mb-4">
                If our platform generates just 30 new customers per month at £97 average order value, 
                that's £2,910 in additional revenue - a 30x return on your investment.
              </p>
              <div className="text-center">
                <Link to="/roi-calculator" className="text-sfs-primary hover:text-sfs-primary-hover font-medium">
                  Calculate Your Potential ROI →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof - Industry Results */}
      <section className="sfs-container py-20">
        <div className="text-center mb-16">
          <h2 className="sfs-heading-2 mb-4">Real Results from Real Businesses</h2>
          <p className="sfs-text-lg text-sfs-text-light">
            See how businesses in your industry are driving revenue with social media
          </p>
        </div>
        
        <div className="sfs-grid sfs-grid-2 gap-8 mb-16">
          <div className="sfs-card hover:shadow-lg transition-all">
            <div className="sfs-card-body">
              <div className="sfs-flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl sfs-flex sfs-flex-center flex-shrink-0">
                  <span className="text-2xl">💄</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sfs-text">Beauty Salon Chain</h4>
                  <p className="text-sfs-text-muted text-sm">London, UK - 3 locations</p>
                </div>
              </div>
              
              <div className="sfs-grid sfs-grid-3 gap-4 mb-6">
                <div className="text-center bg-green-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-600">467%</div>
                  <div className="text-xs text-green-700">Booking Increase</div>
                </div>
                <div className="text-center bg-blue-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-600">£18k</div>
                  <div className="text-xs text-blue-700">Monthly Revenue</div>
                </div>
                <div className="text-center bg-purple-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-purple-600">25hrs</div>
                  <div className="text-xs text-purple-700">Time Saved/Week</div>
                </div>
              </div>
              
              <div className="sfs-flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-4 h-4 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-sfs-text-muted mb-4 italic">
                "We went from struggling to fill appointments to being booked solid 6 weeks out. 
                The before/after posts and client testimonials generated by the AI are incredible. 
                We've opened 2 new locations from the revenue growth."
              </p>
              <div className="text-sm">
                <div className="font-medium">Jessica Williams</div>
                <div className="text-sfs-text-muted">Owner, Glow Beauty Studios</div>
              </div>
            </div>
          </div>

          <div className="sfs-card hover:shadow-lg transition-all">
            <div className="sfs-card-body">
              <div className="sfs-flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl sfs-flex sfs-flex-center flex-shrink-0">
                  <span className="text-2xl">🛍️</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sfs-text">E-commerce Fashion Brand</h4>
                  <p className="text-sfs-text-muted text-sm">Manchester, UK - Online retailer</p>
                </div>
              </div>
              
              <div className="sfs-grid sfs-grid-3 gap-4 mb-6">
                <div className="text-center bg-green-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-600">892%</div>
                  <div className="text-xs text-green-700">Sales from Social</div>
                </div>
                <div className="text-center bg-blue-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-600">£47k</div>
                  <div className="text-xs text-blue-700">Monthly Revenue</div>
                </div>
                <div className="text-center bg-purple-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-purple-600">12%</div>
                  <div className="text-xs text-purple-700">Conversion Rate</div>
                </div>
              </div>
              
              <div className="sfs-flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-4 h-4 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-sfs-text-muted mb-4 italic">
                "The AI creates product descriptions and styling tips that convert like crazy. 
                Our Instagram posts now drive more sales than Google Ads. We've scaled from 
                £5k to £47k monthly revenue in just 4 months."
              </p>
              <div className="text-sm">
                <div className="font-medium">Marcus Thompson</div>
                <div className="text-sfs-text-muted">Founder, Urban Thread Co.</div>
              </div>
            </div>
          </div>

          <div className="sfs-card hover:shadow-lg transition-all">
            <div className="sfs-card-body">
              <div className="sfs-flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl sfs-flex sfs-flex-center flex-shrink-0">
                  <span className="text-2xl">💪</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sfs-text">Personal Training Studio</h4>
                  <p className="text-sfs-text-muted text-sm">Birmingham, UK - Fitness coaching</p>
                </div>
              </div>
              
              <div className="sfs-grid sfs-grid-3 gap-4 mb-6">
                <div className="text-center bg-green-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-600">245%</div>
                  <div className="text-xs text-green-700">Client Signups</div>
                </div>
                <div className="text-center bg-blue-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-600">£23k</div>
                  <div className="text-xs text-blue-700">Monthly Revenue</div>
                </div>
                <div className="text-center bg-purple-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-purple-600">18hrs</div>
                  <div className="text-xs text-purple-700">Time Saved/Week</div>
                </div>
              </div>
              
              <div className="sfs-flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-4 h-4 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-sfs-text-muted mb-4 italic">
                "The transformation posts and workout videos created by the AI are bringing 
                in 15-20 new clients per month. I've gone from barely breaking even to making 
                £23k/month. Finally have the business I dreamed of."
              </p>
              <div className="text-sm">
                <div className="font-medium">Sarah Mitchell</div>
                <div className="text-sfs-text-muted">Owner, FitLife Personal Training</div>
              </div>
            </div>
          </div>

          <div className="sfs-card hover:shadow-lg transition-all">
            <div className="sfs-card-body">
              <div className="sfs-flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl sfs-flex sfs-flex-center flex-shrink-0">
                  <span className="text-2xl">🏠</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sfs-text">Real Estate Agency</h4>
                  <p className="text-sfs-text-muted text-sm">Leeds, UK - Property sales</p>
                </div>
              </div>
              
              <div className="sfs-grid sfs-grid-3 gap-4 mb-6">
                <div className="text-center bg-green-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-600">189%</div>
                  <div className="text-xs text-green-700">Lead Increase</div>
                </div>
                <div className="text-center bg-blue-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-600">£85k</div>
                  <div className="text-xs text-blue-700">Monthly Commissions</div>
                </div>
                <div className="text-center bg-purple-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-purple-600">32</div>
                  <div className="text-xs text-purple-700">Properties Sold</div>
                </div>
              </div>
              
              <div className="sfs-flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-4 h-4 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-sfs-text-muted mb-4 italic">
                "The property showcase posts and market insight content generate 30-40 qualified 
                leads per month. We've doubled our sales team and I'm on track to hit £1M in 
                commissions this year. Social media is now our #1 lead source."
              </p>
              <div className="text-sm">
                <div className="font-medium">David Palmer</div>
                <div className="text-sfs-text-muted">Director, Palmer Properties</div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center bg-gradient-to-r from-sfs-gold-light to-yellow-50 rounded-2xl p-8">
          <h3 className="sfs-heading-3 mb-4">Your Industry, Your Success Story</h3>
          <p className="sfs-text-lg mb-6 max-w-3xl mx-auto">
            Ready to be our next success story? Join 2,500+ businesses already using SocialScaleBooster 
            to turn their social media into their most profitable marketing channel.
          </p>
          <Link to="/signup" className="sfs-btn sfs-btn-primary sfs-btn-lg">
            Get Your Industry Templates - Start Free Trial
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-sfs-black via-sfs-brown to-sfs-black py-20">
        <div className="sfs-container text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="sfs-heading-1 text-white mb-4">
              Stop Losing Money on Social Media
            </h2>
            <h3 className="text-2xl text-sfs-gold mb-6">
              Start Converting Followers Into Customers
            </h3>
            <p className="sfs-text-lg text-gray-300 mb-8 max-w-3xl mx-auto">
              Every day you wait is another day your competitors are stealing your customers. 
              <strong className="text-white">Get 3x more leads in 30 days or we'll refund every penny.</strong>
            </p>
            
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-8 max-w-2xl mx-auto">
              <div className="sfs-flex items-center justify-center gap-4 mb-4">
                <span className="text-white font-medium">⏰ Limited Time:</span>
                <span className="bg-sfs-gold text-sfs-black px-3 py-1 rounded-full font-bold text-sm">
                  FREE Setup Worth £497
                </span>
              </div>
              <p className="text-gray-300 text-sm">
                Our experts will set up your account, create your content strategy, and 
                build your first month's posts. Normally £497, free for new customers this week only.
              </p>
            </div>
            
            <div className="sfs-flex sfs-flex-center gap-4 mb-6">
              <Link to="/signup" className="sfs-btn sfs-btn-primary sfs-btn-lg bg-sfs-gold text-sfs-black hover:bg-sfs-gold-dark">
                🚀 Get 3x More Leads - Start Free Trial
              </Link>
            </div>
            
            <div className="sfs-flex sfs-flex-center gap-6 text-gray-400 text-sm">
              <span>✅ 30-day money-back guarantee</span>
              <span>✅ No setup fees</span>
              <span>✅ Cancel anytime</span>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-300 text-sm">
                <strong>Limited spots available:</strong> We can only onboard 50 new businesses this month 
                to ensure quality service. <span className="text-sfs-gold">42 spots remaining.</span>
              </p>
            </div>
          </div>
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