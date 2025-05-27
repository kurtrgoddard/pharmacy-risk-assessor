
interface UserSession {
  id: string;
  createdAt: number;
  lastActivity: number;
  assessments: string[];
}

class SessionManager {
  private session: UserSession | null = null;
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  initializeSession(): UserSession {
    if (!this.session || this.isSessionExpired()) {
      this.session = {
        id: this.generateSessionId(),
        createdAt: Date.now(),
        lastActivity: Date.now(),
        assessments: []
      };
    }
    return this.session;
  }

  getCurrentSession(): UserSession | null {
    if (this.isSessionExpired()) {
      this.clearSession();
      return null;
    }
    
    if (this.session) {
      this.session.lastActivity = Date.now();
    }
    
    return this.session;
  }

  addAssessmentToSession(assessmentId: string): boolean {
    const session = this.getCurrentSession();
    if (!session) return false;

    if (!session.assessments.includes(assessmentId)) {
      session.assessments.push(assessmentId);
    }
    
    return true;
  }

  canAccessAssessment(assessmentId: string): boolean {
    const session = this.getCurrentSession();
    if (!session) return false;

    return session.assessments.includes(assessmentId);
  }

  clearSession(): void {
    this.session = null;
  }

  private isSessionExpired(): boolean {
    if (!this.session) return true;
    
    return Date.now() - this.session.lastActivity > this.SESSION_TIMEOUT;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // For production, implement proper user authentication
  validateUserOwnership(userId: string, resourceId: string): boolean {
    // In a real implementation, this would check against a backend
    // For now, use session-based ownership
    return this.canAccessAssessment(resourceId);
  }
}

export const sessionManager = new SessionManager();
