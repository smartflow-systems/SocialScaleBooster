/**
 * A/B Testing Service for Campaign Optimization
 * Enables split testing of content, timing, and strategies
 */

export interface ABTestVariant {
  id: string;
  name: string;
  content: string;
  config: Record<string, any>;
}

export interface ABTestResults {
  variantA: {
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
    engagementRate: number;
    conversionRate: number;
  };
  variantB: {
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
    engagementRate: number;
    conversionRate: number;
  };
  winner?: 'A' | 'B' | 'tie';
  confidence: number;
  recommendation: string;
}

export class ABTestingService {
  /**
   * Create a new A/B test
   */
  createTest(params: {
    name: string;
    variantA: ABTestVariant;
    variantB: ABTestVariant;
    duration: number; // in days
    sampleSize?: number;
  }): any {
    return {
      id: this.generateTestId(),
      name: params.name,
      variantA: params.variantA,
      variantB: params.variantB,
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + params.duration * 24 * 60 * 60 * 1000),
      results: this.initializeResults(),
    };
  }

  /**
   * Analyze A/B test results and determine winner
   */
  analyzeResults(testData: any): ABTestResults {
    const { variantA, variantB } = testData.results;

    // Calculate engagement rates
    variantA.engagementRate = this.calculateEngagementRate(
      variantA.clicks,
      variantA.impressions
    );
    variantB.engagementRate = this.calculateEngagementRate(
      variantB.clicks,
      variantB.impressions
    );

    // Calculate conversion rates
    variantA.conversionRate = this.calculateConversionRate(
      variantA.conversions,
      variantA.clicks
    );
    variantB.conversionRate = this.calculateConversionRate(
      variantB.conversions,
      variantB.clicks
    );

    // Determine statistical significance
    const significance = this.calculateSignificance(variantA, variantB);

    let winner: 'A' | 'B' | 'tie' | undefined = undefined;
    let recommendation = '';

    if (significance.confidence > 95) {
      if (variantA.conversionRate > variantB.conversionRate) {
        winner = 'A';
        recommendation = `Variant A outperformed Variant B with ${significance.confidence.toFixed(
          1
        )}% confidence. Implement Variant A for better results.`;
      } else if (variantB.conversionRate > variantA.conversionRate) {
        winner = 'B';
        recommendation = `Variant B outperformed Variant A with ${significance.confidence.toFixed(
          1
        )}% confidence. Implement Variant B for better results.`;
      } else {
        winner = 'tie';
        recommendation = 'Both variants performed similarly. Consider testing different variables.';
      }
    } else {
      recommendation = `Not enough data for conclusive results (${significance.confidence.toFixed(
        1
      )}% confidence). Continue testing for better insights.`;
    }

    return {
      variantA,
      variantB,
      winner,
      confidence: significance.confidence,
      recommendation,
    };
  }

  /**
   * Generate insights and recommendations
   */
  generateInsights(results: ABTestResults): string[] {
    const insights: string[] = [];

    const aDiff = results.variantA.conversionRate - results.variantB.conversionRate;
    const improvementPercent = Math.abs((aDiff / results.variantB.conversionRate) * 100);

    if (results.winner === 'A') {
      insights.push(
        `Variant A improved conversion rate by ${improvementPercent.toFixed(1)}%`
      );
      if (results.variantA.revenue > results.variantB.revenue) {
        const revenueDiff = results.variantA.revenue - results.variantB.revenue;
        insights.push(
          `Variant A generated $${revenueDiff.toFixed(2)} more revenue`
        );
      }
    } else if (results.winner === 'B') {
      insights.push(
        `Variant B improved conversion rate by ${improvementPercent.toFixed(1)}%`
      );
      if (results.variantB.revenue > results.variantA.revenue) {
        const revenueDiff = results.variantB.revenue - results.variantA.revenue;
        insights.push(
          `Variant B generated $${revenueDiff.toFixed(2)} more revenue`
        );
      }
    }

    // Engagement insights
    if (results.variantA.engagementRate > results.variantB.engagementRate * 1.2) {
      insights.push('Variant A had significantly higher engagement');
    } else if (results.variantB.engagementRate > results.variantA.engagementRate * 1.2) {
      insights.push('Variant B had significantly higher engagement');
    }

    // Sample size insights
    const totalSample = results.variantA.impressions + results.variantB.impressions;
    if (totalSample < 1000) {
      insights.push('Consider extending the test for more reliable data (sample size < 1000)');
    }

    return insights;
  }

  /**
   * Recommend which variant to use going forward
   */
  getRecommendation(results: ABTestResults): {
    variant: 'A' | 'B' | 'continue_testing';
    reason: string;
    projectedImprovement?: number;
  } {
    if (results.confidence < 90) {
      return {
        variant: 'continue_testing',
        reason: 'Insufficient data for confident decision. Continue testing.',
      };
    }

    if (!results.winner || results.winner === 'tie') {
      return {
        variant: 'continue_testing',
        reason: 'Variants performed similarly. Try testing different variables.',
      };
    }

    const winner = results.winner;
    const winnerData = winner === 'A' ? results.variantA : results.variantB;
    const loserData = winner === 'A' ? results.variantB : results.variantA;

    const improvement =
      ((winnerData.conversionRate - loserData.conversionRate) /
        loserData.conversionRate) *
      100;

    return {
      variant: winner,
      reason: `Variant ${winner} shows ${improvement.toFixed(
        1
      )}% better conversion rate with ${results.confidence.toFixed(1)}% confidence`,
      projectedImprovement: improvement,
    };
  }

  /**
   * Simulate test results for development/demo
   */
  simulateTestResults(testId: string, duration: number): ABTestResults {
    const variantA = {
      impressions: Math.floor(Math.random() * 5000) + 5000,
      clicks: Math.floor(Math.random() * 500) + 300,
      conversions: Math.floor(Math.random() * 50) + 20,
      revenue: Math.random() * 1000 + 500,
      engagementRate: 0,
      conversionRate: 0,
    };

    const variantB = {
      impressions: Math.floor(Math.random() * 5000) + 5000,
      clicks: Math.floor(Math.random() * 600) + 350,
      conversions: Math.floor(Math.random() * 60) + 30,
      revenue: Math.random() * 1200 + 600,
      engagementRate: 0,
      conversionRate: 0,
    };

    // Calculate rates
    variantA.engagementRate = this.calculateEngagementRate(variantA.clicks, variantA.impressions);
    variantB.engagementRate = this.calculateEngagementRate(variantB.clicks, variantB.impressions);
    variantA.conversionRate = this.calculateConversionRate(variantA.conversions, variantA.clicks);
    variantB.conversionRate = this.calculateConversionRate(variantB.conversions, variantB.clicks);

    const significance = this.calculateSignificance(variantA, variantB);
    let winner: 'A' | 'B' | 'tie' | undefined = undefined;

    if (variantB.conversionRate > variantA.conversionRate * 1.1) {
      winner = 'B';
    } else if (variantA.conversionRate > variantB.conversionRate * 1.1) {
      winner = 'A';
    } else {
      winner = 'tie';
    }

    return {
      variantA,
      variantB,
      winner,
      confidence: significance.confidence,
      recommendation: winner === 'tie'
        ? 'Continue testing - results are too close to call'
        : `Variant ${winner} is the winner with ${significance.confidence.toFixed(1)}% confidence`,
    };
  }

  // Private helper methods

  private generateTestId(): string {
    return `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeResults() {
    return {
      variantA: {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        revenue: 0,
        engagementRate: 0,
        conversionRate: 0,
      },
      variantB: {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        revenue: 0,
        engagementRate: 0,
        conversionRate: 0,
      },
    };
  }

  private calculateEngagementRate(clicks: number, impressions: number): number {
    if (impressions === 0) return 0;
    return Number(((clicks / impressions) * 100).toFixed(2));
  }

  private calculateConversionRate(conversions: number, clicks: number): number {
    if (clicks === 0) return 0;
    return Number(((conversions / clicks) * 100).toFixed(2));
  }

  private calculateSignificance(variantA: any, variantB: any): { confidence: number } {
    // Simplified statistical significance calculation
    // In production, use proper statistical tests (Chi-square, etc.)

    const totalSample = variantA.impressions + variantB.impressions;
    const sampleSizeScore = Math.min(totalSample / 10000, 1) * 30;

    const rateA = variantA.conversionRate;
    const rateB = variantB.conversionRate;
    const difference = Math.abs(rateA - rateB);

    // Higher difference = higher confidence
    const differenceScore = Math.min(difference * 5, 50);

    // Combine factors
    const confidence = Math.min(sampleSizeScore + differenceScore + 20, 99.9);

    return { confidence };
  }
}

export const abTestingService = new ABTestingService();
