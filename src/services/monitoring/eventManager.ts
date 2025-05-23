
import { APICallEvent, AssessmentEvent, UserActionEvent, AnalyticsConfig } from './types';

export class EventManager {
  private apiCalls: APICallEvent[] = [];
  private assessments: AssessmentEvent[] = [];
  private userActions: UserActionEvent[] = [];
  private config: AnalyticsConfig;

  constructor(config: AnalyticsConfig) {
    this.config = config;
  }

  addAPICall(event: APICallEvent): void {
    this.apiCalls.push(event);
    this.pruneOldEvents();

    // Log for debugging
    if (!event.success) {
      console.error(`API call failed: ${event.api} - ${event.endpoint}`, event.error);
    } else if (event.duration > 5000) {
      console.warn(`Slow API call: ${event.api} - ${event.endpoint} took ${event.duration}ms`);
    }
  }

  addAssessment(event: AssessmentEvent): void {
    this.assessments.push(event);
    this.pruneOldEvents();

    // Log interesting assessments
    if (event.dataQuality < 0.5) {
      console.warn(`Low quality assessment for ${event.compound}: ${event.dataQuality}`);
    }
  }

  addUserAction(event: UserActionEvent): void {
    this.userActions.push(event);
    this.pruneOldEvents();
  }

  getAPICallEvents(): APICallEvent[] {
    return [...this.apiCalls];
  }

  getAssessmentEvents(): AssessmentEvent[] {
    return [...this.assessments];
  }

  getUserActionEvents(): UserActionEvent[] {
    return [...this.userActions];
  }

  private pruneOldEvents(): void {
    const cutoffTime = Date.now() - this.config.maxEventAge;

    this.apiCalls = this.apiCalls.filter(e => e.timestamp.getTime() > cutoffTime);
    this.assessments = this.assessments.filter(e => e.timestamp.getTime() > cutoffTime);
    this.userActions = this.userActions.filter(e => e.timestamp.getTime() > cutoffTime);

    // Also limit total events
    if (this.apiCalls.length > this.config.maxEvents) {
      this.apiCalls = this.apiCalls.slice(-this.config.maxEvents);
    }
    if (this.assessments.length > this.config.maxEvents) {
      this.assessments = this.assessments.slice(-this.config.maxEvents);
    }
    if (this.userActions.length > this.config.maxEvents) {
      this.userActions = this.userActions.slice(-this.config.maxEvents);
    }
  }
}
