
export interface WaitlistEntry {
  id: string;
  name: string;
  email: string;
  pharmacyName: string;
  province: string;
  phone?: string;
  signupDate: string;
  position: number;
}

class WaitlistService {
  private storageKey = 'pharmassess_waitlist';

  getWaitlist(): WaitlistEntry[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading waitlist:', error);
      return [];
    }
  }

  addToWaitlist(entry: Omit<WaitlistEntry, 'id' | 'signupDate' | 'position'>): { success: boolean; position?: number; error?: string } {
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
        position: waitlist.length + 1
      };

      const updatedWaitlist = [...waitlist, newEntry];
      localStorage.setItem(this.storageKey, JSON.stringify(updatedWaitlist));

      // Track signup event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'waitlist_signup', {
          event_category: 'conversion',
          event_label: entry.province
        });
      }

      return { success: true, position: newEntry.position };
    } catch (error) {
      console.error('Error adding to waitlist:', error);
      return { success: false, error: 'Failed to save registration' };
    }
  }

  exportToCSV(): string {
    const waitlist = this.getWaitlist();
    const headers = ['Position', 'Name', 'Email', 'Pharmacy Name', 'Province', 'Phone', 'Signup Date'];
    
    const csvContent = [
      headers.join(','),
      ...waitlist.map(entry => [
        entry.position,
        `"${entry.name}"`,
        entry.email,
        `"${entry.pharmacyName}"`,
        entry.province,
        entry.phone || '',
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

  // Email integration placeholder
  // TODO: Replace with actual email service (Resend, SendGrid, etc.)
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
