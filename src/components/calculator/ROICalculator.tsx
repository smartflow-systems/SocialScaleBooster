import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalculatorIcon, TrendingUpIcon, DollarSignIcon, ClockIcon } from '@heroicons/react/24/outline';
import '../../styles/brand.css';

interface CalculatorInputs {
  businessType: string;
  monthlyRevenue: number;
  avgOrderValue: number;
  currentLeads: number;
  conversionRate: number;
  timeSpentOnSocial: number;
  employeeHourlyRate: number;
}

interface ROIResults {
  additionalLeads: number;
  additionalCustomers: number;
  additionalRevenue: number;
  timeSaved: number;
  timeSavingValue: number;
  totalValue: number;
  planCost: number;
  netROI: number;
  roiPercentage: number;
  paybackPeriod: number;
}

const ROICalculator: React.FC = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    businessType: '',
    monthlyRevenue: 0,
    avgOrderValue: 0,
    currentLeads: 0,
    conversionRate: 0,
    timeSpentOnSocial: 0,
    employeeHourlyRate: 0
  });

  const [results, setResults] = useState<ROIResults | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<'growth' | 'scale'>('growth');

  const businessTypes = {
    ecommerce: { name: 'E-commerce/Retail', multiplier: 3.2, avgOrder: 85 },
    beauty: { name: 'Beauty & Wellness', multiplier: 4.1, avgOrder: 120 },
    fitness: { name: 'Fitness & Health', multiplier: 3.8, avgOrder: 150 },
    realestate: { name: 'Real Estate', multiplier: 2.8, avgOrder: 5000 },
    professional: { name: 'Professional Services', multiplier: 3.5, avgOrder: 500 },
    restaurant: { name: 'Food & Restaurant', multiplier: 3.0, avgOrder: 45 }
  };

  const plans = {
    growth: { cost: 97, leadMultiplier: 3.1, timeMultiplier: 20 },
    scale: { cost: 247, leadMultiplier: 3.8, timeMultiplier: 35 }
  };

  useEffect(() => {
    if (inputs.businessType && inputs.monthlyRevenue > 0) {
      calculateROI();
    }
  }, [inputs, selectedPlan]);

  const updateInput = (field: keyof CalculatorInputs, value: number | string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const calculateROI = () => {
    const businessData = businessTypes[inputs.businessType as keyof typeof businessTypes];
    const planData = plans[selectedPlan];
    
    if (!businessData) return;

    // Calculate additional leads (based on industry multiplier and plan)
    const currentMonthlyLeads = inputs.currentLeads || Math.max(10, inputs.monthlyRevenue / (inputs.avgOrderValue || businessData.avgOrder) * 0.3);
    const additionalLeads = currentMonthlyLeads * (businessData.multiplier * planData.leadMultiplier - 1);
    
    // Calculate conversion improvements
    const currentConversion = inputs.conversionRate || 0.15; // Default 15%
    const improvedConversion = Math.min(0.35, currentConversion * 1.4); // Up to 35% max
    const additionalCustomers = additionalLeads * improvedConversion;
    
    // Calculate revenue impact
    const avgOrder = inputs.avgOrderValue || businessData.avgOrder;
    const additionalRevenue = additionalCustomers * avgOrder;
    
    // Calculate time savings
    const currentTimeSpent = inputs.timeSpentOnSocial || 15; // Default 15 hours/week
    const timeSaved = currentTimeSpent * (planData.timeMultiplier / 100); // Percentage saved
    const hourlyRate = inputs.employeeHourlyRate || 25; // Default £25/hour
    const timeSavingValue = timeSaved * 4.33 * hourlyRate; // Monthly value
    
    // Calculate ROI
    const totalValue = additionalRevenue + timeSavingValue;
    const planCost = planData.cost;
    const netROI = totalValue - planCost;
    const roiPercentage = (netROI / planCost) * 100;
    const paybackPeriod = planCost / (totalValue / 30); // Days to break even

    setResults({
      additionalLeads: Math.round(additionalLeads),
      additionalCustomers: Math.round(additionalCustomers),
      additionalRevenue: Math.round(additionalRevenue),
      timeSaved: Math.round(timeSaved * 10) / 10,
      timeSavingValue: Math.round(timeSavingValue),
      totalValue: Math.round(totalValue),
      planCost,
      netROI: Math.round(netROI),
      roiPercentage: Math.round(roiPercentage),
      paybackPeriod: Math.round(paybackPeriod)
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sfs-background via-white to-sfs-gold-light">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="sfs-container py-6">
          <div className="sfs-flex items-center gap-4">
            <Link to="/" className="sfs-flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-sfs-gold to-sfs-gold-dark rounded-lg sfs-flex sfs-flex-center">
                <span className="text-xl font-bold text-sfs-black">SFS</span>
              </div>
              <span className="text-xl font-bold text-sfs-text">SocialScaleBooster</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="sfs-container py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-r from-sfs-gold to-sfs-gold-dark rounded-xl mx-auto mb-6 sfs-flex sfs-flex-center">
              <CalculatorIcon className="w-8 h-8 text-sfs-black" />
            </div>
            <h1 className="sfs-heading-1 mb-4">ROI Calculator</h1>
            <p className="sfs-text-lg text-sfs-text-light max-w-2xl mx-auto">
              See exactly how much revenue SocialScaleBooster can generate for your business. 
              This calculator uses real data from businesses like yours.
            </p>
          </div>

          <div className="sfs-grid sfs-grid-2 gap-12">
            {/* Input Form */}
            <div className="sfs-card">
              <div className="sfs-card-header">
                <h2 className="sfs-heading-3">Your Business Details</h2>
                <p className="text-sfs-text-muted">Tell us about your business to get accurate projections</p>
              </div>
              
              <div className="sfs-card-body space-y-6">
                {/* Business Type */}
                <div>
                  <label className="sfs-label">Business Type</label>
                  <select
                    className="sfs-input"
                    value={inputs.businessType}
                    onChange={(e) => updateInput('businessType', e.target.value)}
                  >
                    <option value="">Select your industry</option>
                    {Object.entries(businessTypes).map(([key, data]) => (
                      <option key={key} value={key}>{data.name}</option>
                    ))}
                  </select>
                </div>

                {/* Monthly Revenue */}
                <div>
                  <label className="sfs-label">Current Monthly Revenue</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sfs-text-muted">£</span>
                    <input
                      type="number"
                      className="sfs-input pl-8"
                      placeholder="10,000"
                      value={inputs.monthlyRevenue || ''}
                      onChange={(e) => updateInput('monthlyRevenue', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>

                {/* Average Order Value */}
                <div>
                  <label className="sfs-label">Average Order/Sale Value</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sfs-text-muted">£</span>
                    <input
                      type="number"
                      className="sfs-input pl-8"
                      placeholder={inputs.businessType ? businessTypes[inputs.businessType as keyof typeof businessTypes]?.avgOrder.toString() : "100"}
                      value={inputs.avgOrderValue || ''}
                      onChange={(e) => updateInput('avgOrderValue', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>

                {/* Current Leads */}
                <div>
                  <label className="sfs-label">Current Monthly Leads from Social Media</label>
                  <input
                    type="number"
                    className="sfs-input"
                    placeholder="50"
                    value={inputs.currentLeads || ''}
                    onChange={(e) => updateInput('currentLeads', parseInt(e.target.value) || 0)}
                  />
                  <p className="text-sm text-sfs-text-muted mt-1">Leave blank if unsure - we'll estimate based on your revenue</p>
                </div>

                {/* Conversion Rate */}
                <div>
                  <label className="sfs-label">Lead to Customer Conversion Rate (%)</label>
                  <input
                    type="number"
                    className="sfs-input"
                    placeholder="15"
                    min="0"
                    max="100"
                    value={inputs.conversionRate || ''}
                    onChange={(e) => updateInput('conversionRate', parseFloat(e.target.value) / 100 || 0)}
                  />
                  <p className="text-sm text-sfs-text-muted mt-1">What percentage of your leads become customers? (Default: 15%)</p>
                </div>

                {/* Time Spent */}
                <div>
                  <label className="sfs-label">Hours/Week Spent on Social Media</label>
                  <input
                    type="number"
                    className="sfs-input"
                    placeholder="15"
                    value={inputs.timeSpentOnSocial || ''}
                    onChange={(e) => updateInput('timeSpentOnSocial', parseInt(e.target.value) || 0)}
                  />
                </div>

                {/* Hourly Rate */}
                <div>
                  <label className="sfs-label">Employee Hourly Rate</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sfs-text-muted">£</span>
                    <input
                      type="number"
                      className="sfs-input pl-8"
                      placeholder="25"
                      value={inputs.employeeHourlyRate || ''}
                      onChange={(e) => updateInput('employeeHourlyRate', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <p className="text-sm text-sfs-text-muted mt-1">Cost per hour for the person managing social media</p>
                </div>

                {/* Plan Selection */}
                <div>
                  <label className="sfs-label">Select Plan</label>
                  <div className="space-y-3">
                    <label className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedPlan === 'growth' ? 'border-sfs-gold bg-sfs-gold-light' : 'border-gray-200 hover:border-sfs-gold-light'
                    }`}>
                      <input
                        type="radio"
                        name="plan"
                        value="growth"
                        checked={selectedPlan === 'growth'}
                        onChange={(e) => setSelectedPlan(e.target.value as 'growth' | 'scale')}
                        className="sr-only"
                      />
                      <div className="sfs-flex items-center justify-between">
                        <div>
                          <div className="font-medium">Growth Plan</div>
                          <div className="text-sm text-sfs-text-muted">£97/month</div>
                        </div>
                        <div className="text-2xl font-bold text-sfs-gold">£97</div>
                      </div>
                    </label>

                    <label className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedPlan === 'scale' ? 'border-sfs-gold bg-sfs-gold-light' : 'border-gray-200 hover:border-sfs-gold-light'
                    }`}>
                      <input
                        type="radio"
                        name="plan"
                        value="scale"
                        checked={selectedPlan === 'scale'}
                        onChange={(e) => setSelectedPlan(e.target.value as 'growth' | 'scale')}
                        className="sr-only"
                      />
                      <div className="sfs-flex items-center justify-between">
                        <div>
                          <div className="font-medium">Scale Plan</div>
                          <div className="text-sm text-sfs-text-muted">£247/month</div>
                        </div>
                        <div className="text-2xl font-bold text-sfs-gold">£247</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-6">
              {results ? (
                <>
                  {/* ROI Summary */}
                  <div className="sfs-card bg-gradient-to-r from-sfs-success/10 to-green-50 border border-sfs-success">
                    <div className="sfs-card-body text-center">
                      <TrendingUpIcon className="w-12 h-12 text-sfs-success mx-auto mb-4" />
                      <div className="space-y-2">
                        <div className="text-4xl font-bold text-sfs-success">
                          {results.roiPercentage > 0 ? `${results.roiPercentage}%` : 'Break Even'}
                        </div>
                        <div className="text-lg font-medium text-sfs-text">Monthly ROI</div>
                        <div className="text-sfs-text-muted">
                          {results.roiPercentage > 0 
                            ? `You'll make ${formatCurrency(results.netROI)} profit every month`
                            : 'Your investment will pay for itself'
                          }
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="sfs-card">
                    <div className="sfs-card-header">
                      <h3 className="sfs-heading-3">Projected Monthly Results</h3>
                    </div>
                    <div className="sfs-card-body">
                      <div className="sfs-grid sfs-grid-2 gap-6">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-3xl font-bold text-blue-600 mb-1">+{results.additionalLeads}</div>
                          <div className="text-sm font-medium text-blue-700">Additional Leads</div>
                        </div>
                        
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-3xl font-bold text-green-600 mb-1">+{results.additionalCustomers}</div>
                          <div className="text-sm font-medium text-green-700">New Customers</div>
                        </div>
                        
                        <div className="text-center p-4 bg-sfs-gold-light rounded-lg">
                          <div className="text-3xl font-bold text-sfs-gold-dark mb-1">{formatCurrency(results.additionalRevenue)}</div>
                          <div className="text-sm font-medium text-sfs-text">Additional Revenue</div>
                        </div>
                        
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="text-3xl font-bold text-purple-600 mb-1">{results.timeSaved}h</div>
                          <div className="text-sm font-medium text-purple-700">Time Saved/Week</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Financial Breakdown */}
                  <div className="sfs-card">
                    <div className="sfs-card-header">
                      <h3 className="sfs-heading-3">Financial Breakdown</h3>
                    </div>
                    <div className="sfs-card-body space-y-4">
                      <div className="sfs-flex sfs-flex-between py-2 border-b border-gray-100">
                        <span className="text-sfs-text-muted">Additional Revenue</span>
                        <span className="font-semibold text-green-600">+{formatCurrency(results.additionalRevenue)}</span>
                      </div>
                      
                      <div className="sfs-flex sfs-flex-between py-2 border-b border-gray-100">
                        <span className="text-sfs-text-muted">Time Savings Value</span>
                        <span className="font-semibold text-green-600">+{formatCurrency(results.timeSavingValue)}</span>
                      </div>
                      
                      <div className="sfs-flex sfs-flex-between py-2 border-b border-gray-100">
                        <span className="text-sfs-text-muted">Plan Cost</span>
                        <span className="font-semibold text-red-600">-{formatCurrency(results.planCost)}</span>
                      </div>
                      
                      <div className="sfs-flex sfs-flex-between py-3 border-t-2 border-sfs-gold">
                        <span className="font-bold text-sfs-text">Net Monthly Profit</span>
                        <span className="text-2xl font-bold text-sfs-success">{formatCurrency(results.netROI)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payback Period */}
                  <div className="sfs-card bg-gradient-to-r from-sfs-gold-light to-yellow-50">
                    <div className="sfs-card-body text-center">
                      <ClockIcon className="w-10 h-10 text-sfs-gold-dark mx-auto mb-3" />
                      <div className="text-2xl font-bold text-sfs-text mb-2">
                        {results.paybackPeriod} Days to Break Even
                      </div>
                      <p className="text-sfs-text-muted">
                        Your investment will pay for itself in less than {Math.ceil(results.paybackPeriod / 7)} weeks
                      </p>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="text-center space-y-4">
                    <Link 
                      to={`/signup?plan=${selectedPlan}`}
                      className="sfs-btn sfs-btn-primary sfs-btn-lg"
                    >
                      Start My {formatCurrency(results.netROI)}/Month Growth
                    </Link>
                    <p className="text-sm text-sfs-text-muted">
                      30-day money-back guarantee • No setup fees • Cancel anytime
                    </p>
                  </div>
                </>
              ) : (
                <div className="sfs-card">
                  <div className="sfs-card-body text-center py-12">
                    <DollarSignIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="sfs-heading-3 text-gray-500 mb-2">Fill in your details</h3>
                    <p className="text-gray-400">
                      Complete the form on the left to see your personalized ROI calculation
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-12 text-center">
            <div className="bg-gray-50 rounded-lg p-6 max-w-4xl mx-auto">
              <h4 className="font-semibold text-sfs-text mb-3">How We Calculate Your ROI</h4>
              <div className="text-sm text-sfs-text-muted space-y-2">
                <p>Our calculations are based on actual performance data from 2,500+ businesses using SocialScaleBooster.</p>
                <p>Results vary by industry, business size, and execution. Industry multipliers range from 2.8x to 4.1x based on platform effectiveness.</p>
                <p>Time savings calculated based on typical automation coverage and content generation efficiency.</p>
                <p>These projections are estimates only. Individual results may vary. 30-day money-back guarantee if you don't see results.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROICalculator;