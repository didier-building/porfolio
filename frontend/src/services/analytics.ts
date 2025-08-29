/**
 * Analytics service for recruiter microsite
 * Tracks user interactions and events
 */

import { recruiterApi } from './recruiterApi';

export enum AnalyticsEvents {
  JD_PASTED = 'JD_PASTED',
  MATCH_GENERATED = 'MATCH_GENERATED',
  CONTACT_CLICKED = 'CONTACT_CLICKED',
  RESUME_DOWNLOADED = 'RESUME_DOWNLOADED',
  CASE_STUDY_VIEWED = 'CASE_STUDY_VIEWED',
  DEMO_PLAYED = 'DEMO_PLAYED',
  CHAT_STARTED = 'CHAT_STARTED',
  BOOK_CALL_CLICKED = 'BOOK_CALL_CLICKED',
}

class AnalyticsService {
  private isEnabled: boolean;

  constructor() {
    // Enable analytics in production or when explicitly enabled
    this.isEnabled = import.meta.env.PROD || 
                     import.meta.env.VITE_ANALYTICS_ENABLED === 'true';
  }

  /**
   * Track an analytics event
   */
  async track(event: AnalyticsEvents, metadata?: Record<string, any>): Promise<void> {
    if (!this.isEnabled) {
      console.log(`[Analytics] ${event}`, metadata);
      return;
    }

    try {
      await recruiterApi.trackEvent(event, {
        ...metadata,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      });
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  }

  /**
   * Track page view
   */
  async trackPageView(page: string): Promise<void> {
    await this.track(AnalyticsEvents.CASE_STUDY_VIEWED, {
      page,
      referrer: document.referrer
    });
  }

  /**
   * Track job description analysis
   */
  async trackJobAnalysis(jdLength: number, score?: number, cached?: boolean): Promise<void> {
    await this.track(AnalyticsEvents.JD_PASTED, { jd_length: jdLength });
    
    if (score !== undefined) {
      await this.track(AnalyticsEvents.MATCH_GENERATED, {
        score,
        cache_hit: cached || false
      });
    }
  }

  /**
   * Track contact interaction
   */
  async trackContact(method: string, source?: string): Promise<void> {
    await this.track(AnalyticsEvents.CONTACT_CLICKED, {
      method,
      source: source || 'unknown'
    });
  }

  /**
   * Track CV download
   */
  async trackCVDownload(hasJobDescription: boolean, source?: string): Promise<void> {
    await this.track(AnalyticsEvents.RESUME_DOWNLOADED, {
      has_jd: hasJobDescription,
      source: source || 'unknown'
    });
  }

  /**
   * Track chat interaction
   */
  async trackChat(messageLength: number): Promise<void> {
    await this.track(AnalyticsEvents.CHAT_STARTED, {
      message_length: messageLength
    });
  }

  /**
   * Track call booking
   */
  async trackBookCall(source: string): Promise<void> {
    await this.track(AnalyticsEvents.BOOK_CALL_CLICKED, {
      source
    });
  }

  /**
   * Track demo video play
   */
  async trackDemoPlay(projectName: string, duration?: number): Promise<void> {
    await this.track(AnalyticsEvents.DEMO_PLAYED, {
      project: projectName,
      duration: duration || 0
    });
  }
}

export const analytics = new AnalyticsService();
export default analytics;
