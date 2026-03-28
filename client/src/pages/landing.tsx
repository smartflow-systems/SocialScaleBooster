import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/ui/navigation";
import { BarChart3, Store, Wand2, Play, Rocket, Target, Sparkles, ShieldCheck, Gauge } from "lucide-react";
import { useLocation } from "wouter";

export default function Landing() {
  const [, setLocation] = useLocation();

  const handleStartFree = () => {
    setLocation("/dashboard");
  };

  return (
    <div className="min-h-screen bg-primary-black text-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-black to-dark-bg overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-accent-gold rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary-brown rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-accent-gold">SmartFlow AI</span>
            <span className="text-white"> Growth OS</span>
            <br />
            <span className="text-white">Automate, Measure,</span>
            <br />
            <span className="text-accent-gold">Scale E-Commerce Revenue</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-neutral-gray mb-8 max-w-3xl mx-auto leading-relaxed">
            Premium no-code platform that turns social automation into measurable revenue. Launch smarter campaigns, track ROI in real time, and scale across every channel with AI-powered bots.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              onClick={handleStartFree}
              className="bg-accent-gold text-primary-black px-8 py-4 text-lg font-bold gold-glow gold-glow-hover hover:scale-105 transition-all"
              size="lg"
            >
              <Rocket className="w-5 h-5 mr-2" />
              Start Free
            </Button>
            <Button
              variant="outline"
              className="border-accent-gold text-accent-gold px-8 py-4 text-lg font-semibold hover:bg-accent-gold hover:text-primary-black transition-all"
              size="lg"
              aria-label="Watch demo video"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="border border-secondary-brown bg-card-bg/70 rounded-xl px-6 py-4">
              <p className="text-2xl font-bold text-accent-gold">Up to +32%</p>
              <p className="text-sm text-neutral-gray">Revenue lift in 30 days</p>
            </div>
            <div className="border border-secondary-brown bg-card-bg/70 rounded-xl px-6 py-4">
              <p className="text-2xl font-bold text-accent-gold">5 mins</p>
              <p className="text-sm text-neutral-gray">Launch a bot with templates</p>
            </div>
            <div className="border border-secondary-brown bg-card-bg/70 rounded-xl px-6 py-4">
              <p className="text-2xl font-bold text-accent-gold">24/7</p>
              <p className="text-sm text-neutral-gray">Live ROI and engagement signals</p>
            </div>
          </div>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <Card className="bg-card-bg border-secondary-brown hover:border-accent-gold transition-colors">
              <CardContent className="p-6">
                <BarChart3 className="text-accent-gold w-12 h-12 mb-4 mx-auto" />
                <h3 className="text-xl font-bold mb-2">Analytics & ROI</h3>
                <p className="text-neutral-gray">Track engagement, sales, and revenue metrics in real-time</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card-bg border-secondary-brown hover:border-accent-gold transition-colors">
              <CardContent className="p-6">
                <Store className="text-accent-gold w-12 h-12 mb-4 mx-auto" />
                <h3 className="text-xl font-bold mb-2">Bot Marketplace</h3>
                <p className="text-neutral-gray">Access pre-built templates for every e-commerce niche</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card-bg border-secondary-brown hover:border-accent-gold transition-colors">
              <CardContent className="p-6">
                <Wand2 className="text-accent-gold w-12 h-12 mb-4 mx-auto" />
                <h3 className="text-xl font-bold mb-2">No-Code Builder</h3>
                <p className="text-neutral-gray">Drag-and-drop interface for creating powerful automation</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trusted Section */}
      <section className="py-16 bg-primary-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-neutral-gray">Trusted by growth teams</p>
              <h2 className="text-3xl md:text-4xl font-bold mt-3">
                <span className="text-accent-gold">SmartFlow</span> powers always-on revenue engines
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {["Luxe DTC", "Pulse Beauty", "Nova Retail", "Cartflow"].map((label) => (
                <div
                  key={label}
                  className="border border-secondary-brown bg-card-bg/70 rounded-xl px-4 py-3 text-center text-sm text-neutral-gray"
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-dark-bg to-card-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-accent-gold">Powerful Features</span> for E-Commerce Success
            </h2>
            <p className="text-xl text-neutral-gray max-w-3xl mx-auto">
              Everything you need to automate social media sales and scale your e-commerce business
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-card-bg border-secondary-brown hover:border-accent-gold transition-all hover:shadow-lg">
              <CardContent className="p-8">
                <BarChart3 className="text-accent-gold w-16 h-16 mb-6" />
                <h3 className="text-2xl font-bold mb-4">Advanced Analytics</h3>
                <p className="text-neutral-gray">Real-time revenue tracking, ROI calculations, engagement metrics, and platform performance analytics with live signals.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card-bg border-secondary-brown hover:border-accent-gold transition-all hover:shadow-lg">
              <CardContent className="p-8">
                <Store className="text-accent-gold w-16 h-16 mb-6" />
                <h3 className="text-2xl font-bold mb-4">Bot Marketplace</h3>
                <p className="text-neutral-gray">Access premium templates for beauty, fashion, tech, and e-commerce with category filtering and instant deployment.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card-bg border-secondary-brown hover:border-accent-gold transition-all hover:shadow-lg">
              <CardContent className="p-8">
                <Wand2 className="text-accent-gold w-16 h-16 mb-6" />
                <h3 className="text-2xl font-bold mb-4">Smart Scheduling</h3>
                <p className="text-neutral-gray">Advanced automation rules, peak hours optimization, and engagement threshold posting built for growth teams.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Outcome Engine Section */}
      <section className="py-20 bg-primary-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-accent-gold">Outcome Engine</span> for E-Commerce Teams
            </h2>
            <p className="text-xl text-neutral-gray max-w-3xl mx-auto">
              Every workflow is mapped to revenue, retention, and repeat purchases so teams can see wins fast.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-card-bg border-secondary-brown hover:border-accent-gold transition-all">
              <CardContent className="p-8">
                <Target className="text-accent-gold w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold mb-3">Revenue First</h3>
                <p className="text-neutral-gray">Automations prioritize high-converting posts and attribution paths for clean ROI reporting.</p>
              </CardContent>
            </Card>
            <Card className="bg-card-bg border-secondary-brown hover:border-accent-gold transition-all">
              <CardContent className="p-8">
                <Gauge className="text-accent-gold w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold mb-3">Live Feedback Loop</h3>
                <p className="text-neutral-gray">Realtime engagement signals tune cadence, formats, and channel priority on the fly.</p>
              </CardContent>
            </Card>
            <Card className="bg-card-bg border-secondary-brown hover:border-accent-gold transition-all">
              <CardContent className="p-8">
                <ShieldCheck className="text-accent-gold w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold mb-3">Enterprise Ready</h3>
                <p className="text-neutral-gray">Secure JWT auth, team-ready workflows, and premium support for serious operators.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Launch Section */}
      <section className="py-20 bg-gradient-to-br from-dark-bg to-card-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Launch in <span className="text-accent-gold">5 Minutes</span>
            </h2>
            <p className="text-xl text-neutral-gray max-w-3xl mx-auto">
              Guided onboarding helps you go from zero to revenue in a single session.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-card-bg border-secondary-brown hover:border-accent-gold transition-all">
              <CardContent className="p-8">
                <Sparkles className="text-accent-gold w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold mb-3">Pick a Playbook</h3>
                <p className="text-neutral-gray">Choose a curated template for your niche and let SmartFlow preconfigure the stack.</p>
              </CardContent>
            </Card>
            <Card className="bg-card-bg border-secondary-brown hover:border-accent-gold transition-all">
              <CardContent className="p-8">
                <Store className="text-accent-gold w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold mb-3">Connect Your Store</h3>
                <p className="text-neutral-gray">Sync products, campaigns, and audiences to power channel-specific automation.</p>
              </CardContent>
            </Card>
            <Card className="bg-card-bg border-secondary-brown hover:border-accent-gold transition-all">
              <CardContent className="p-8">
                <BarChart3 className="text-accent-gold w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold mb-3">Track the Win</h3>
                <p className="text-neutral-gray">Monitor ROI and engagement live, then auto-optimize from the analytics hub.</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleStartFree}
              className="bg-accent-gold text-primary-black px-8 py-4 text-lg font-bold gold-glow gold-glow-hover"
              size="lg"
            >
              Start Your First Playbook
            </Button>
            <Button
              variant="outline"
              onClick={() => setLocation("/dashboard")}
              className="border-accent-gold text-accent-gold px-8 py-4 text-lg font-semibold hover:bg-accent-gold hover:text-primary-black"
              size="lg"
            >
              See Live Dashboard
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-primary-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-accent-gold">Simple Pricing</span> for Every Business
            </h2>
            <p className="text-xl text-neutral-gray max-w-3xl mx-auto">
              Start free, upgrade when you're ready to scale
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-card-bg border-secondary-brown hover:border-accent-gold transition-all">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Free Plan</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-accent-gold">£0</span>
                  <span className="text-neutral-gray">/month</span>
                </div>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-accent-gold rounded-full mr-3"></span>
                    Up to 3 bots
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-accent-gold rounded-full mr-3"></span>
                    Basic analytics
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-accent-gold rounded-full mr-3"></span>
                    Free templates
                  </li>
                </ul>
                <Button 
                  onClick={() => setLocation("/dashboard")}
                  className="w-full bg-secondary-brown text-accent-gold border border-accent-gold hover:bg-accent-gold hover:text-primary-black"
                >
                  Get Started Free
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-rich-brown to-accent-gold border-2 border-accent-gold hover:shadow-xl transition-all">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4 text-primary-black">Pro Plan</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-primary-black">£49</span>
                  <span className="text-primary-black/80">/month</span>
                </div>
                <ul className="text-left space-y-3 mb-8 text-primary-black">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary-black rounded-full mr-3"></span>
                    Unlimited bots
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary-black rounded-full mr-3"></span>
                    Advanced analytics
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary-black rounded-full mr-3"></span>
                    Premium templates
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary-black rounded-full mr-3"></span>
                    Priority support
                  </li>
                </ul>
                <Button 
                  onClick={() => setLocation("/subscribe")}
                  className="w-full bg-primary-black text-accent-gold hover:bg-primary-black/90"
                >
                  Upgrade to Pro
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Marketplace Section */}
      <section id="marketplace" className="py-20 bg-gradient-to-br from-card-bg to-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-accent-gold">Bot Marketplace</span> Templates
            </h2>
            <p className="text-xl text-neutral-gray max-w-3xl mx-auto">
              Ready-to-use templates for every e-commerce niche and social platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-card-bg border-secondary-brown hover:border-accent-gold transition-all">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-accent-gold rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-black">E</span>
                </div>
                <h3 className="text-lg font-bold mb-2">E-Commerce</h3>
                <p className="text-sm text-neutral-gray">Product showcases, flash sales, testimonials</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card-bg border-secondary-brown hover:border-accent-gold transition-all">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-accent-gold rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-black">B</span>
                </div>
                <h3 className="text-lg font-bold mb-2">Beauty</h3>
                <p className="text-sm text-neutral-gray">Makeup tutorials, skincare routines, reviews</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card-bg border-secondary-brown hover:border-accent-gold transition-all">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-accent-gold rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-black">F</span>
                </div>
                <h3 className="text-lg font-bold mb-2">Fashion</h3>
                <p className="text-sm text-neutral-gray">Style guides, outfit inspiration, trends</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card-bg border-secondary-brown hover:border-accent-gold transition-all">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-accent-gold rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-black">T</span>
                </div>
                <h3 className="text-lg font-bold mb-2">Technology</h3>
                <p className="text-sm text-neutral-gray">Product reviews, comparisons, demos</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <Button 
              onClick={() => setLocation("/dashboard")}
              className="bg-accent-gold text-primary-black font-bold px-8 py-4 text-lg hover:shadow-lg transition-all"
            >
              Explore All Templates
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
