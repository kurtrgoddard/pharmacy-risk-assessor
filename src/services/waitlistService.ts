export interface WaitlistEntry {
  id: string;
  name: string;
  email: string;
  pharmacyName: string;
  province: string;
  phone?: string;
  signupDate: string;
  position: number;
  segments: string[];
  leadScore: number;
  pharmacyType?: 'retail' | 'hospital' | 'clinic' | 'compound' | 'other';
  estimatedVolume?: 'low' | 'medium' | 'high';
  hasUsedDemo?: boolean;
}

export interface LeadScoringCriteria {
  pharmacyTypeScores: Record<string, number>;
  provinceScores: Record<string, number>;
  baseScore: number;
}

class WaitlistService {
  private storageKey = 'pharmassess_waitlist';
  private leadScoringCriteria: LeadScoringCriteria = {
    pharmacyTypeScores: {
      'hospital': 50,
      'compound': 40,
      'clinic': 30,
      'retail': 20,
      'other': 10
    },
    provinceScores: {
      'Ontario': 30,
      'Quebec': 25,
      'British Columbia': 20,
      'Alberta': 15,
      'Manitoba': 10,
      'Saskatchewan': 8,
      'Nova Scotia': 6,
      'New Brunswick': 5,
      'Newfoundland and Labrador': 4,
      'Prince Edward Island': 3,
      'Northwest Territories': 2,
      'Yukon': 2,
      'Nunavut': 1
    },
    baseScore: 10
  };

  getWaitlist(): WaitlistEntry[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      const entries = data ? JSON.parse(data) : [];
      
      // Migrate old entries to include new fields
      return entries.map((entry: any) => ({
        ...entry,
        segments: entry.segments || this.autoGenerateSegments(entry),
        leadScore: entry.leadScore || this.calculateLeadScore(entry),
        pharmacyType: entry.pharmacyType || 'other',
        estimatedVolume: entry.estimatedVolume || 'medium',
        hasUsedDemo: entry.hasUsedDemo || false
      }));
    } catch (error) {
      console.error('Error reading waitlist:', error);
      return [];
    }
  }

  addToWaitlist(entry: Omit<WaitlistEntry, 'id' | 'signupDate' | 'position' | 'segments' | 'leadScore'>): { success: boolean; position?: number; error?: string } {
    try {
      const waitlist = this.getWaitlist();
      
      // Check for duplicate email
      const existingEntry = waitlist.find(item => item.email.toLowerCase() === entry.email.toLowerCase());
      if (existingEntry) {
        return { success: false, error: 'Email already registered' };
      }

      const newEntry: WaitlistEntry = {
        ...entry,
        id: this.generateId(),
        signupDate: new Date().toISOString(),
        position: waitlist.length + 1,
        segments: this.autoGenerateSegments(entry),
        leadScore: this.calculateLeadScore(entry)
      };

      const updatedWaitlist = [...waitlist, newEntry];
      localStorage.setItem(this.storageKey, JSON.stringify(updatedWaitlist));

      // Track signup event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'waitlist_signup', {
          event_category: 'conversion',
          event_label: entry.province,
          value: newEntry.leadScore
        });
      }

      return { success: true, position: newEntry.position };
    } catch (error) {
      console.error('Error adding to waitlist:', error);
      return { success: false, error: 'Failed to save registration' };
    }
  }

  updateEntry(id: string, updates: Partial<WaitlistEntry>): boolean {
    try {
      const waitlist = this.getWaitlist();
      const index = waitlist.findIndex(entry => entry.id === id);
      
      if (index === -1) return false;
      
      waitlist[index] = { 
        ...waitlist[index], 
        ...updates,
        leadScore: this.calculateLeadScore({ ...waitlist[index], ...updates })
      };
      
      localStorage.setItem(this.storageKey, JSON.stringify(waitlist));
      return true;
    } catch (error) {
      console.error('Error updating entry:', error);
      return false;
    }
  }

  private autoGenerateSegments(entry: Partial<WaitlistEntry>): string[] {
    const segments: string[] = [];
    
    // Province segment
    if (entry.province) {
      segments.push(entry.province);
    }
    
    // High priority based on pharmacy type
    if (entry.pharmacyType === 'hospital' || entry.pharmacyType === 'compound') {
      segments.push('High Priority');
    }
    
    // Beta tester (could be set manually later)
    if (entry.estimatedVolume === 'high') {
      segments.push('Beta Tester');
    }
    
    return segments;
  }

  private calculateLeadScore(entry: Partial<WaitlistEntry>): number {
    let score = this.leadScoringCriteria.baseScore;
    
    // Pharmacy type score
    if (entry.pharmacyType) {
      score += this.leadScoringCriteria.pharmacyTypeScores[entry.pharmacyType] || 0;
    }
    
    // Province score
    if (entry.province) {
      score += this.leadScoringCriteria.provinceScores[entry.province] || 0;
    }
    
    // Demo usage bonus
    if (entry.hasUsedDemo) {
      score += 20;
    }
    
    // Volume estimation bonus
    if (entry.estimatedVolume === 'high') {
      score += 15;
    } else if (entry.estimatedVolume === 'medium') {
      score += 5;
    }
    
    return Math.min(score, 100); // Cap at 100
  }

  getSegmentedWaitlist() {
    const waitlist = this.getWaitlist();
    const segments: Record<string, WaitlistEntry[]> = {};
    
    waitlist.forEach(entry => {
      entry.segments.forEach(segment => {
        if (!segments[segment]) {
          segments[segment] = [];
        }
        segments[segment].push(entry);
      });
    });
    
    return segments;
  }

  getAnalytics() {
    const waitlist = this.getWaitlist();
    
    // Geographic distribution
    const provinceDistribution = waitlist.reduce((acc, entry) => {
      acc[entry.province] = (acc[entry.province] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Lead score distribution
    const leadScoreRanges = {
      'High (80-100)': 0,
      'Medium (50-79)': 0,
      'Low (0-49)': 0
    };
    
    waitlist.forEach(entry => {
      if (entry.leadScore >= 80) leadScoreRanges['High (80-100)']++;
      else if (entry.leadScore >= 50) leadScoreRanges['Medium (50-79)']++;
      else leadScoreRanges['Low (0-49)']++;
    });
    
    // Conversion funnel (simplified)
    const conversionFunnel = {
      'Page Views': Math.floor(waitlist.length * 10), // Estimated
      'Waitlist Signups': waitlist.length,
      'Demo Users': waitlist.filter(e => e.hasUsedDemo).length,
      'High Intent': waitlist.filter(e => e.leadScore >= 70).length
    };
    
    // Market size estimation
    const marketSize = this.calculateMarketSize(provinceDistribution);
    
    return {
      totalSignups: waitlist.length,
      averageLeadScore: waitlist.reduce((sum, e) => sum + e.leadScore, 0) / waitlist.length || 0,
      provinceDistribution,
      leadScoreRanges,
      conversionFunnel,
      marketSize,
      topSegments: this.getTopSegments()
    };
  }

  private calculateMarketSize(provinceDistribution: Record<string, number>) {
    // Rough pharmacy counts by province (simplified estimates)
    const pharmacyCounts: Record<string, number> = {
      'Ontario': 4500,
      'Quebec': 1800,
      'British Columbia': 1200,
      'Alberta': 1400,
      'Manitoba': 350,
      'Saskatchewan': 300,
      'Nova Scotia': 300,
      'New Brunswick': 200,
      'Newfoundland and Labrador': 150,
      'Prince Edward Island': 40,
      'Northwest Territories': 15,
      'Yukon': 12,
      'Nunavut': 8
    };
    
    let totalAddressableMarket = 0;
    let penetrationRate = 0;
    
    Object.entries(provinceDistribution).forEach(([province, signups]) => {
      const totalPharmacies = pharmacyCounts[province] || 0;
      totalAddressableMarket += totalPharmacies;
      if (totalPharmacies > 0) {
        penetrationRate += (signups / totalPharmacies) * 100;
      }
    });
    
    return {
      totalAddressableMarket,
      currentPenetration: penetrationRate / Object.keys(provinceDistribution).length || 0,
      estimatedRevenue: totalAddressableMarket * 0.15 * 299 // 15% adoption at $299/month
    };
  }

  private getTopSegments() {
    const segmented = this.getSegmentedWaitlist();
    return Object.entries(segmented)
      .map(([segment, entries]) => ({ segment, count: entries.length }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  exportToCSV(): string {
    const waitlist = this.getWaitlist();
    const headers = ['Position', 'Name', 'Email', 'Pharmacy Name', 'Province', 'Phone', 'Pharmacy Type', 'Lead Score', 'Segments', 'Signup Date'];
    
    const csvContent = [
      headers.join(','),
      ...waitlist.map(entry => [
        entry.position,
        `"${entry.name}"`,
        entry.email,
        `"${entry.pharmacyName}"`,
        entry.province,
        entry.phone || '',
        entry.pharmacyType || '',
        entry.leadScore,
        `"${entry.segments.join('; ')}"`,
        new Date(entry.signupDate).toLocaleDateString()
      ].join(','))
    ].join('\n');

    return csvContent;
  }

  getStats() {
    const waitlist = this.getWaitlist();
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const recentSignups = waitlist.filter(entry => 
      new Date(entry.signupDate) >= thirtyDaysAgo
    ).length;

    const weeklySignups = waitlist.filter(entry => 
      new Date(entry.signupDate) >= sevenDaysAgo
    ).length;

    const provinceBreakdown = waitlist.reduce((acc, entry) => {
      acc[entry.province] = (acc[entry.province] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: waitlist.length,
      recentSignups,
      weeklySignups,
      provinceBreakdown,
      dailySignups: this.getDailySignups(waitlist)
    };
  }

  private getDailySignups(waitlist: WaitlistEntry[]) {
    const last7Days = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const count = waitlist.filter(entry => 
        entry.signupDate.split('T')[0] === dateStr
      ).length;
      
      last7Days.push({
        date: dateStr,
        signups: count
      });
    }
    
    return last7Days;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  async sendWelcomeEmail(email: string, name: string, position: number): Promise<boolean> {
    console.log('TODO: Send welcome email to:', email);
    console.log('Email template:', this.getWelcomeEmailTemplate(name, position));
    
    // In production, integrate with email service:
    // const response = await fetch('/api/send-email', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     to: email,
    //     subject: 'Welcome to PharmAssess Waitlist!',
    //     html: this.getWelcomeEmailTemplate(name, position)
    //   })
    // });
    // return response.ok;
    
    return true;
  }

  private getWelcomeEmailTemplate(name: string, position: number): string {
    return `
      <h1>Welcome to PharmAssess, ${name}!</h1>
      <p>You're #${position} on our waitlist!</p>
      <p>We're working hard to revolutionize pharmaceutical risk assessments, and we can't wait to show you what we've built.</p>
      <p>Here's what you can expect:</p>
      <ul>
        <li>Early access when we launch</li>
        <li>Special early bird pricing</li>
        <li>Priority customer support</li>
      </ul>
      <p>We'll keep you updated on our progress. Thank you for your interest!</p>
      <p>Best regards,<br>The PharmAssess Team</p>
    `;
  }
}

export const waitlistService = new WaitlistService();
