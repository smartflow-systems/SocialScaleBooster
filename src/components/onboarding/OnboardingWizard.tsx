import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckIcon, ArrowRightIcon, ArrowLeftIcon, ClockIcon } from '@heroicons/react/24/outline';
import '../../styles/brand.css';

interface OnboardingData {
  businessType: string;
  industry: string;
  businessName: string;
  target_audience: string;
  goals: string[];
  socialAccounts: {
    platform: string;
    connected: boolean;
    username?: string;
  }[];
  contentPreferences: {
    tone: string;
    postFrequency: string;
    contentTypes: string[];
  };
}

interface StepProps {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
  isLastStep?: boolean;
  isFirstStep?: boolean;
}

// Step 1: Business Information
const BusinessInfoStep: React.FC<StepProps> = ({ data, updateData, onNext, isFirstStep }) => {
  const [localData, setLocalData] = useState({
    businessType: data.businessType || '',
    industry: data.industry || '',
    businessName: data.businessName || '',
    target_audience: data.target_audience || ''
  });

  const industries = [
    { id: 'ecommerce', name: 'E-commerce & Retail', icon: '🛍️' },
    { id: 'beauty', name: 'Beauty & Wellness', icon: '💄' },
    { id: 'fitness', name: 'Fitness & Health', icon: '💪' },
    { id: 'realestate', name: 'Real Estate', icon: '🏠' },
    { id: 'restaurant', name: 'Food & Restaurant', icon: '🍕' },
    { id: 'professional', name: 'Professional Services', icon: '💼' },
    { id: 'creative', name: 'Creative & Design', icon: '🎨' },
    { id: 'technology', name: 'Technology & SaaS', icon: '💻' },
    { id: 'education', name: 'Education & Training', icon: '📚' },
    { id: 'other', name: 'Other', icon: '🏢' }
  ];

  const businessTypes = [
    { id: 'small_business', name: 'Small Business (1-10 employees)' },
    { id: 'medium_business', name: 'Medium Business (11-50 employees)' },
    { id: 'agency', name: 'Marketing Agency' },
    { id: 'freelancer', name: 'Freelancer/Consultant' },
    { id: 'enterprise', name: 'Enterprise (50+ employees)' }
  ];

  const handleNext = () => {
    updateData(localData);
    onNext();
  };

  const isValid = localData.businessType && localData.industry && localData.businessName && localData.target_audience;

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="sfs-heading-2 mb-3">Tell us about your business</h2>
        <p className="text-sfs-text-muted">This helps us customize everything for your industry</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="sfs-label">Business Name</label>
          <input
            type="text"
            className="sfs-input"
            placeholder="e.g., Acme Hair Salon"
            value={localData.businessName}
            onChange={(e) => setLocalData({...localData, businessName: e.target.value})}
          />
        </div>

        <div>
          <label className="sfs-label">What type of business are you?</label>
          <div className="space-y-3">
            {businessTypes.map((type) => (
              <label key={type.id} className="sfs-flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="businessType"
                  value={type.id}
                  checked={localData.businessType === type.id}
                  onChange={(e) => setLocalData({...localData, businessType: e.target.value})}
                  className="mr-3"
                />
                <span>{type.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="sfs-label">What industry are you in?</label>
          <div className="sfs-grid sfs-grid-2 gap-3">
            {industries.map((industry) => (
              <label key={industry.id} className="sfs-flex items-center p-4 border rounded-lg cursor-pointer hover:bg-sfs-gold-light transition-colors">
                <input
                  type="radio"
                  name="industry"
                  value={industry.id}
                  checked={localData.industry === industry.id}
                  onChange={(e) => setLocalData({...localData, industry: e.target.value})}
                  className="mr-3"
                />
                <span className="text-xl mr-3">{industry.icon}</span>
                <span>{industry.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="sfs-label">Who is your target audience?</label>
          <textarea
            className="sfs-input h-24"
            placeholder="e.g., Women aged 25-45 interested in premium skincare and wellness"
            value={localData.target_audience}
            onChange={(e) => setLocalData({...localData, target_audience: e.target.value})}
          />
        </div>
      </div>

      <div className="sfs-flex sfs-flex-end">
        <button
          onClick={handleNext}
          disabled={!isValid}
          className="sfs-btn sfs-btn-primary sfs-flex items-center gap-2 disabled:opacity-50"
        >
          Continue
          <ArrowRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// Step 2: Goals & Objectives
const GoalsStep: React.FC<StepProps> = ({ data, updateData, onNext, onPrev }) => {
  const [goals, setGoals] = useState<string[]>(data.goals || []);

  const goalOptions = [
    { id: 'increase_leads', name: 'Generate more leads and customers', icon: '🎯' },
    { id: 'brand_awareness', name: 'Increase brand awareness and reach', icon: '📈' },
    { id: 'engagement', name: 'Boost social media engagement', icon: '💬' },
    { id: 'sales', name: 'Drive direct sales from social media', icon: '💰' },
    { id: 'community', name: 'Build a community around your brand', icon: '👥' },
    { id: 'content_creation', name: 'Save time on content creation', icon: '⏰' },
    { id: 'competitor_edge', name: 'Stay ahead of competitors', icon: '🚀' },
    { id: 'automation', name: 'Automate social media tasks', icon: '🤖' }
  ];

  const toggleGoal = (goalId: string) => {
    const newGoals = goals.includes(goalId) 
      ? goals.filter(g => g !== goalId)
      : [...goals, goalId];
    setGoals(newGoals);
  };

  const handleNext = () => {
    updateData({ goals });
    onNext();
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="sfs-heading-2 mb-3">What are your main goals?</h2>
        <p className="text-sfs-text-muted">Select all that apply - this helps us prioritize your content strategy</p>
      </div>

      <div className="sfs-grid sfs-grid-2 gap-4">
        {goalOptions.map((goal) => (
          <div
            key={goal.id}
            onClick={() => toggleGoal(goal.id)}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              goals.includes(goal.id) 
                ? 'border-sfs-gold bg-sfs-gold-light' 
                : 'border-gray-200 hover:border-sfs-gold-light hover:bg-gray-50'
            }`}
          >
            <div className="sfs-flex items-center gap-3">
              <span className="text-2xl">{goal.icon}</span>
              <div>
                <h4 className="font-medium text-sfs-text">{goal.name}</h4>
              </div>
              {goals.includes(goal.id) && (
                <CheckIcon className="w-5 h-5 text-sfs-success ml-auto" />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="sfs-flex sfs-flex-between">
        <button onClick={onPrev} className="sfs-btn sfs-btn-outline sfs-flex items-center gap-2">
          <ArrowLeftIcon className="w-5 h-5" />
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={goals.length === 0}
          className="sfs-btn sfs-btn-primary sfs-flex items-center gap-2 disabled:opacity-50"
        >
          Continue
          <ArrowRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// Step 3: Connect Social Accounts
const ConnectAccountsStep: React.FC<StepProps> = ({ data, updateData, onNext, onPrev }) => {
  const [accounts, setAccounts] = useState(data.socialAccounts || [
    { platform: 'instagram', connected: false },
    { platform: 'facebook', connected: false },
    { platform: 'twitter', connected: false },
    { platform: 'linkedin', connected: false },
    { platform: 'tiktok', connected: false },
    { platform: 'youtube', connected: false }
  ]);

  const platformInfo = {
    instagram: { name: 'Instagram', icon: '📸', color: 'from-pink-500 to-purple-600' },
    facebook: { name: 'Facebook', icon: '👥', color: 'from-blue-600 to-blue-700' },
    twitter: { name: 'Twitter/X', icon: '🐦', color: 'from-black to-gray-800' },
    linkedin: { name: 'LinkedIn', icon: '💼', color: 'from-blue-700 to-blue-800' },
    tiktok: { name: 'TikTok', icon: '🎵', color: 'from-black to-pink-600' },
    youtube: { name: 'YouTube', icon: '📺', color: 'from-red-600 to-red-700' }
  };

  const connectAccount = async (platform: string) => {
    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newAccounts = accounts.map(acc => 
      acc.platform === platform 
        ? { ...acc, connected: true, username: `@your${platform}handle` }
        : acc
    );
    setAccounts(newAccounts);
  };

  const handleNext = () => {
    updateData({ socialAccounts: accounts });
    onNext();
  };

  const connectedCount = accounts.filter(acc => acc.connected).length;

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="sfs-heading-2 mb-3">Connect your social accounts</h2>
        <p className="text-sfs-text-muted">
          Connect at least one account to start posting. You can add more later.
        </p>
      </div>

      <div className="space-y-4">
        {accounts.map((account) => {
          const info = platformInfo[account.platform as keyof typeof platformInfo];
          return (
            <div key={account.platform} className="sfs-card">
              <div className="sfs-card-body py-4">
                <div className="sfs-flex items-center">
                  <div className={`w-12 h-12 bg-gradient-to-r ${info.color} rounded-lg sfs-flex sfs-flex-center mr-4`}>
                    <span className="text-xl">{info.icon}</span>
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-medium text-sfs-text">{info.name}</h4>
                    {account.connected ? (
                      <p className="text-sm text-sfs-success">Connected as {account.username}</p>
                    ) : (
                      <p className="text-sm text-sfs-text-muted">Not connected</p>
                    )}
                  </div>
                  
                  {account.connected ? (
                    <div className="sfs-flex items-center gap-2 text-sfs-success">
                      <CheckIcon className="w-5 h-5" />
                      <span className="text-sm font-medium">Connected</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => connectAccount(account.platform)}
                      className="sfs-btn sfs-btn-primary sfs-btn-sm"
                    >
                      Connect
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {connectedCount > 0 && (
        <div className="bg-sfs-gold-light rounded-lg p-4">
          <div className="sfs-flex items-center gap-2">
            <CheckIcon className="w-5 h-5 text-sfs-success" />
            <span className="font-medium">
              Great! You've connected {connectedCount} account{connectedCount > 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-sm text-sfs-text-muted mt-1">
            You can connect more accounts later in your dashboard
          </p>
        </div>
      )}

      <div className="sfs-flex sfs-flex-between">
        <button onClick={onPrev} className="sfs-btn sfs-btn-outline sfs-flex items-center gap-2">
          <ArrowLeftIcon className="w-5 h-5" />
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={connectedCount === 0}
          className="sfs-btn sfs-btn-primary sfs-flex items-center gap-2 disabled:opacity-50"
        >
          Continue
          <ArrowRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// Step 4: Content Preferences
const ContentPreferencesStep: React.FC<StepProps> = ({ data, updateData, onNext, onPrev }) => {
  const [preferences, setPreferences] = useState(data.contentPreferences || {
    tone: '',
    postFrequency: '',
    contentTypes: []
  });

  const tones = [
    { id: 'professional', name: 'Professional & Authoritative', example: 'Expert insights, industry tips' },
    { id: 'friendly', name: 'Friendly & Approachable', example: 'Conversational, warm, personal' },
    { id: 'playful', name: 'Playful & Creative', example: 'Fun, energetic, entertaining' },
    { id: 'luxury', name: 'Luxury & Premium', example: 'Sophisticated, exclusive, high-end' }
  ];

  const frequencies = [
    { id: 'daily', name: 'Daily', posts: '7 posts/week' },
    { id: 'frequent', name: 'Frequent', posts: '4-5 posts/week' },
    { id: 'regular', name: 'Regular', posts: '2-3 posts/week' },
    { id: 'minimal', name: 'Minimal', posts: '1 post/week' }
  ];

  const contentTypes = [
    { id: 'educational', name: 'Educational Content', icon: '📚', desc: 'Tips, tutorials, how-tos' },
    { id: 'behind_scenes', name: 'Behind the Scenes', icon: '🎬', desc: 'Process, team, workspace' },
    { id: 'user_generated', name: 'Customer Stories', icon: '💬', desc: 'Reviews, testimonials, features' },
    { id: 'promotional', name: 'Product/Service Promotion', icon: '📢', desc: 'Features, benefits, offers' },
    { id: 'industry_news', name: 'Industry Insights', icon: '📰', desc: 'Trends, news, expert opinions' },
    { id: 'lifestyle', name: 'Lifestyle Content', icon: '🌟', desc: 'Inspiration, motivation, culture' }
  ];

  const toggleContentType = (typeId: string) => {
    const newTypes = preferences.contentTypes.includes(typeId)
      ? preferences.contentTypes.filter(t => t !== typeId)
      : [...preferences.contentTypes, typeId];
    
    setPreferences({ ...preferences, contentTypes: newTypes });
  };

  const handleNext = () => {
    updateData({ contentPreferences: preferences });
    onNext();
  };

  const isValid = preferences.tone && preferences.postFrequency && preferences.contentTypes.length > 0;

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="sfs-heading-2 mb-3">Content preferences</h2>
        <p className="text-sfs-text-muted">This helps our AI create content that matches your brand perfectly</p>
      </div>

      <div className="space-y-8">
        {/* Tone */}
        <div>
          <label className="sfs-label">What tone should your content have?</label>
          <div className="space-y-3">
            {tones.map((tone) => (
              <label
                key={tone.id}
                className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  preferences.tone === tone.id ? 'border-sfs-gold bg-sfs-gold-light' : 'border-gray-200 hover:border-sfs-gold-light'
                }`}
              >
                <input
                  type="radio"
                  name="tone"
                  value={tone.id}
                  checked={preferences.tone === tone.id}
                  onChange={(e) => setPreferences({ ...preferences, tone: e.target.value })}
                  className="sr-only"
                />
                <div>
                  <div className="font-medium text-sfs-text">{tone.name}</div>
                  <div className="text-sm text-sfs-text-muted">{tone.example}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Frequency */}
        <div>
          <label className="sfs-label">How often would you like to post?</label>
          <div className="sfs-grid sfs-grid-2 gap-3">
            {frequencies.map((freq) => (
              <label
                key={freq.id}
                className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  preferences.postFrequency === freq.id ? 'border-sfs-gold bg-sfs-gold-light' : 'border-gray-200 hover:border-sfs-gold-light'
                }`}
              >
                <input
                  type="radio"
                  name="frequency"
                  value={freq.id}
                  checked={preferences.postFrequency === freq.id}
                  onChange={(e) => setPreferences({ ...preferences, postFrequency: e.target.value })}
                  className="sr-only"
                />
                <div className="text-center">
                  <div className="font-medium text-sfs-text">{freq.name}</div>
                  <div className="text-sm text-sfs-text-muted">{freq.posts}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Content Types */}
        <div>
          <label className="sfs-label">What types of content work best for your business?</label>
          <p className="text-sm text-sfs-text-muted mb-4">Select at least 2-3 types</p>
          <div className="sfs-grid sfs-grid-2 gap-4">
            {contentTypes.map((type) => (
              <div
                key={type.id}
                onClick={() => toggleContentType(type.id)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  preferences.contentTypes.includes(type.id)
                    ? 'border-sfs-gold bg-sfs-gold-light'
                    : 'border-gray-200 hover:border-sfs-gold-light hover:bg-gray-50'
                }`}
              >
                <div className="sfs-flex items-start gap-3">
                  <span className="text-2xl">{type.icon}</span>
                  <div>
                    <h4 className="font-medium text-sfs-text">{type.name}</h4>
                    <p className="text-sm text-sfs-text-muted">{type.desc}</p>
                  </div>
                  {preferences.contentTypes.includes(type.id) && (
                    <CheckIcon className="w-5 h-5 text-sfs-success ml-auto flex-shrink-0" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="sfs-flex sfs-flex-between">
        <button onClick={onPrev} className="sfs-btn sfs-btn-outline sfs-flex items-center gap-2">
          <ArrowLeftIcon className="w-5 h-5" />
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!isValid}
          className="sfs-btn sfs-btn-primary sfs-flex items-center gap-2 disabled:opacity-50"
        >
          Generate My Content
          <ArrowRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// Step 5: Content Generation & Complete
const CompleteStep: React.FC<StepProps> = ({ data, onPrev, isLastStep }) => {
  const navigate = useNavigate();
  const [generating, setGenerating] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('');

  const tasks = [
    'Setting up your industry presets...',
    'Analyzing your target audience...',
    'Generating content ideas...',
    'Creating your first posts...',
    'Scheduling your content calendar...',
    'Finalizing your setup...'
  ];

  useEffect(() => {
    const generateContent = async () => {
      for (let i = 0; i < tasks.length; i++) {
        setCurrentTask(tasks[i]);
        setProgress(((i + 1) / tasks.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      setGenerating(false);
    };

    generateContent();
  }, []);

  const handleComplete = () => {
    navigate('/dashboard');
  };

  if (generating) {
    return (
      <div className="text-center space-y-8">
        <div className="mb-8">
          <h2 className="sfs-heading-2 mb-3">Setting up your social media automation</h2>
          <p className="text-sfs-text-muted">
            We're creating personalized content for your {data.industry} business...
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-sfs-gold-light"></div>
            <div 
              className="absolute inset-0 rounded-full border-4 border-sfs-gold border-t-transparent animate-spin"
              style={{ transform: `rotate(${progress * 3.6}deg)` }}
            ></div>
            <div className="absolute inset-0 sfs-flex sfs-flex-center">
              <span className="text-2xl font-bold text-sfs-text">{Math.round(progress)}%</span>
            </div>
          </div>

          <p className="font-medium text-sfs-text mb-2">{currentTask}</p>
          
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className="bg-sfs-gold h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-sfs-gold-light rounded-lg p-6">
          <div className="sfs-flex items-center gap-3 justify-center">
            <ClockIcon className="w-6 h-6 text-sfs-gold-dark" />
            <span className="font-medium">
              Estimated time remaining: {Math.max(1, Math.ceil((100 - progress) / 20))} minutes
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center space-y-8">
      <div className="mb-8">
        <div className="w-20 h-20 bg-sfs-success rounded-full sfs-flex sfs-flex-center mx-auto mb-6">
          <CheckIcon className="w-10 h-10 text-white" />
        </div>
        <h2 className="sfs-heading-2 mb-3">You're all set! 🎉</h2>
        <p className="text-sfs-text-muted max-w-2xl mx-auto">
          Your social media automation is ready. We've created 30 days of content tailored to your 
          {data.industry} business and scheduled your first posts.
        </p>
      </div>

      <div className="sfs-grid sfs-grid-3 gap-6 max-w-2xl mx-auto">
        <div className="text-center">
          <div className="text-3xl font-bold text-sfs-success mb-1">30</div>
          <div className="text-sm text-sfs-text-muted">Days of content<br/>ready to post</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-sfs-success mb-1">{data.socialAccounts?.filter(a => a.connected).length || 0}</div>
          <div className="text-sm text-sfs-text-muted">Social accounts<br/>connected</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-sfs-success mb-1">15</div>
          <div className="text-sm text-sfs-text-muted">Minutes total<br/>setup time</div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-sfs-gold-light to-yellow-50 rounded-lg p-6">
        <h3 className="font-semibold text-sfs-text mb-3">🚀 What happens next?</h3>
        <div className="space-y-2 text-sm text-sfs-text-muted">
          <p>• Your first posts will start publishing automatically</p>
          <p>• We'll monitor performance and optimize your content</p>
          <p>• You can review and edit posts in your dashboard</p>
          <p>• We'll send you weekly performance reports</p>
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={handleComplete}
          className="sfs-btn sfs-btn-primary sfs-btn-lg"
        >
          Go to Dashboard
        </button>
        
        <p className="text-sm text-sfs-text-muted">
          Need help? Our support team is here 24/7 to assist you.
        </p>
      </div>
    </div>
  );
};

// Main Onboarding Wizard Component
const OnboardingWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    businessType: '',
    industry: '',
    businessName: '',
    target_audience: '',
    goals: [],
    socialAccounts: [],
    contentPreferences: {
      tone: '',
      postFrequency: '',
      contentTypes: []
    }
  });

  const steps = [
    { title: 'Business Info', component: BusinessInfoStep },
    { title: 'Goals', component: GoalsStep },
    { title: 'Connect Accounts', component: ConnectAccountsStep },
    { title: 'Content Style', component: ContentPreferencesStep },
    { title: 'Generate Content', component: CompleteStep }
  ];

  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sfs-background via-white to-sfs-gold-light">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="sfs-container py-6">
          <div className="sfs-flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-sfs-gold to-sfs-gold-dark rounded-lg sfs-flex sfs-flex-center">
              <span className="text-xl font-bold text-sfs-black">SFS</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-sfs-text">Quick Setup</h1>
              <p className="text-sm text-sfs-text-muted">Step {currentStep + 1} of {steps.length}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="sfs-container">
          <div className="sfs-flex">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex-1 py-4 text-center relative ${
                  index <= currentStep ? 'text-sfs-primary' : 'text-gray-400'
                }`}
              >
                <div className="text-sm font-medium">{step.title}</div>
                {index < steps.length - 1 && (
                  <div
                    className={`absolute top-1/2 right-0 w-full h-0.5 -translate-y-1/2 ${
                      index < currentStep ? 'bg-sfs-gold' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="sfs-container py-12">
        <div className="max-w-4xl mx-auto">
          <CurrentStepComponent
            data={data}
            updateData={updateData}
            onNext={nextStep}
            onPrev={prevStep}
            isFirstStep={currentStep === 0}
            isLastStep={currentStep === steps.length - 1}
          />
        </div>
      </main>
    </div>
  );
};

export default OnboardingWizard;