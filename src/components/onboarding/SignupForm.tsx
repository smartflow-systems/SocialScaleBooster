import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import '../../styles/brand.css';

interface SignupFormData {
  organizationName: string;
  organizationSlug: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const SignupForm: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedPlan = searchParams.get('plan') || 'starter';
  
  const [formData, setFormData] = useState<SignupFormData>({
    organizationName: '',
    organizationSlug: '',
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState<Partial<SignupFormData>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [checkingSlug, setCheckingSlug] = useState(false);

  // Auto-generate slug from organization name
  useEffect(() => {
    const generateSlug = (name: string) => {
      return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    };

    if (formData.organizationName && !formData.organizationSlug) {
      const slug = generateSlug(formData.organizationName);
      setFormData(prev => ({ ...prev, organizationSlug: slug }));
    }
  }, [formData.organizationName]);

  // Check slug availability
  useEffect(() => {
    const checkSlugAvailability = async () => {
      if (!formData.organizationSlug || formData.organizationSlug.length < 3) {
        setSlugAvailable(null);
        return;
      }

      setCheckingSlug(true);
      try {
        const response = await fetch(`/api/onboarding/check-slug/${formData.organizationSlug}`);
        const data = await response.json();
        setSlugAvailable(data.available);
      } catch (error) {
        console.error('Error checking slug:', error);
        setSlugAvailable(null);
      } finally {
        setCheckingSlug(false);
      }
    };

    const timeoutId = setTimeout(checkSlugAvailability, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.organizationSlug]);

  const validateForm = () => {
    const newErrors: Partial<SignupFormData> = {};

    if (!formData.organizationName.trim()) {
      newErrors.organizationName = 'Organization name is required';
    }

    if (!formData.organizationSlug.trim()) {
      newErrors.organizationSlug = 'Organization URL is required';
    } else if (formData.organizationSlug.length < 3) {
      newErrors.organizationSlug = 'URL must be at least 3 characters';
    } else if (!/^[a-z0-9-]+$/.test(formData.organizationSlug)) {
      newErrors.organizationSlug = 'URL can only contain letters, numbers, and hyphens';
    } else if (slugAvailable === false) {
      newErrors.organizationSlug = 'This URL is already taken';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const response = await fetch('/api/onboarding/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user info
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user_data', JSON.stringify({
          user: data.user,
          organization: data.organization
        }));

        // Redirect to guided onboarding wizard
        navigate(`/onboarding?plan=${selectedPlan}`);
      } else {
        setErrors({ email: data.error || 'Registration failed' });
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ email: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof SignupFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sfs-background via-white to-sfs-gold-light sfs-flex sfs-flex-center">
      <div className="w-full max-w-2xl mx-auto p-6">
        <div className="sfs-card">
          <div className="sfs-card-body">
            {/* Header */}
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-sfs-gold to-sfs-gold-dark rounded-lg sfs-flex sfs-flex-center">
                  <span className="text-xl font-bold text-sfs-black">SFS</span>
                </div>
                <span className="text-xl font-bold text-sfs-text">SocialScaleBooster</span>
              </Link>
              
              <h1 className="sfs-heading-2 mb-2">Create Your Account</h1>
              <p className="sfs-text-muted">
                Start your 14-day free trial. No credit card required.
              </p>
            </div>

            {/* Plan Selection Indicator */}
            <div className="bg-sfs-gold-light rounded-lg p-4 mb-6 text-center">
              <div className="sfs-flex sfs-flex-center gap-2 mb-2">
                <CheckCircleIcon className="w-5 h-5 text-sfs-success" />
                <span className="font-semibold">
                  {selectedPlan === 'starter' ? 'Starter Plan' : 
                   selectedPlan === 'pro' ? 'Pro Plan' : 'Free Trial'} Selected
                </span>
              </div>
              <p className="text-sm text-sfs-text-muted">
                {selectedPlan === 'starter' ? '£29/month after trial' :
                 selectedPlan === 'pro' ? '£99/month after trial' :
                 'Upgrade anytime during your trial'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Organization Info */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-sfs-text mb-4">Organization Details</h3>
                
                <div className="sfs-grid sfs-grid-2 gap-4">
                  <div className="col-span-2">
                    <label className="sfs-label">
                      Organization Name *
                    </label>
                    <input
                      type="text"
                      className={`sfs-input ${errors.organizationName ? 'sfs-input-error' : ''}`}
                      placeholder="Acme Corporation"
                      value={formData.organizationName}
                      onChange={(e) => handleInputChange('organizationName', e.target.value)}
                    />
                    {errors.organizationName && (
                      <p className="sfs-error-message">{errors.organizationName}</p>
                    )}
                  </div>
                  
                  <div className="col-span-2">
                    <label className="sfs-label">
                      Organization URL *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        className={`sfs-input pr-10 ${errors.organizationSlug ? 'sfs-input-error' : ''}`}
                        placeholder="acme-corp"
                        value={formData.organizationSlug}
                        onChange={(e) => handleInputChange('organizationSlug', e.target.value)}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {checkingSlug ? (
                          <div className="w-5 h-5 border-2 border-sfs-primary border-t-transparent rounded-full animate-spin" />
                        ) : slugAvailable === true ? (
                          <CheckCircleIcon className="w-5 h-5 text-sfs-success" />
                        ) : slugAvailable === false ? (
                          <XCircleIcon className="w-5 h-5 text-sfs-error" />
                        ) : null}
                      </div>
                    </div>
                    {formData.organizationSlug && (
                      <p className="text-sm text-sfs-text-muted mt-1">
                        Your URL: {formData.organizationSlug}.socialscale.com
                      </p>
                    )}
                    {errors.organizationSlug && (
                      <p className="sfs-error-message">{errors.organizationSlug}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Personal Info */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-sfs-text mb-4">Your Details</h3>
                
                <div className="sfs-grid sfs-grid-2 gap-4">
                  <div>
                    <label className="sfs-label">
                      First Name *
                    </label>
                    <input
                      type="text"
                      className={`sfs-input ${errors.firstName ? 'sfs-input-error' : ''}`}
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                    />
                    {errors.firstName && (
                      <p className="sfs-error-message">{errors.firstName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="sfs-label">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      className={`sfs-input ${errors.lastName ? 'sfs-input-error' : ''}`}
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                    />
                    {errors.lastName && (
                      <p className="sfs-error-message">{errors.lastName}</p>
                    )}
                  </div>
                  
                  <div className="col-span-2">
                    <label className="sfs-label">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      className={`sfs-input ${errors.email ? 'sfs-input-error' : ''}`}
                      placeholder="john@acme.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                    {errors.email && (
                      <p className="sfs-error-message">{errors.email}</p>
                    )}
                  </div>
                  
                  <div className="col-span-2">
                    <label className="sfs-label">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className={`sfs-input pr-10 ${errors.password ? 'sfs-input-error' : ''}`}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sfs-text-muted hover:text-sfs-text"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="sfs-error-message">{errors.password}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={loading || checkingSlug || slugAvailable === false}
                  className="sfs-btn sfs-btn-primary w-full sfs-btn-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="sfs-flex sfs-flex-center gap-2">
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Creating Account...
                    </div>
                  ) : (
                    'Start Free Trial'
                  )}
                </button>

                <p className="text-xs text-sfs-text-muted text-center">
                  By creating an account, you agree to our{' '}
                  <Link to="/terms" className="text-sfs-primary hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-sfs-primary hover:underline">Privacy Policy</Link>
                </p>
              </div>
            </form>

            {/* Footer */}
            <div className="text-center mt-8 pt-8 border-t border-gray-200">
              <p className="text-sfs-text-muted">
                Already have an account?{' '}
                <Link to="/login" className="text-sfs-primary hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;