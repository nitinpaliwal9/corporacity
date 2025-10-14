// Analytics and monitoring utilities

/**
 * Analytics event types
 */
export const ANALYTICS_EVENTS = {
  // User events
  USER_SIGNED_IN: 'user_signed_in',
  USER_SIGNED_OUT: 'user_signed_out',
  USER_PROFILE_UPDATED: 'user_profile_updated',
  
  // Company events
  COMPANY_CREATED: 'company_created',
  COMPANY_JOINED: 'company_joined',
  COMPANY_LEFT: 'company_left',
  
  // Status events
  STATUS_UPDATED: 'status_updated',
  STATUS_VIEWED: 'status_viewed',
  
  // Join request events
  JOIN_REQUEST_SENT: 'join_request_sent',
  JOIN_REQUEST_APPROVED: 'join_request_approved',
  JOIN_REQUEST_DENIED: 'join_request_denied',
  
  // Error events
  ERROR_OCCURRED: 'error_occurred',
  API_ERROR: 'api_error',
  
  // Performance events
  PAGE_LOADED: 'page_loaded',
  API_CALL_MADE: 'api_call_made',
  API_CALL_FAILED: 'api_call_failed'
};

/**
 * Analytics service class
 */
class AnalyticsService {
  constructor() {
    this.events = [];
    this.sessionId = this.generateSessionId();
    this.userId = null;
    this.isEnabled = process.env.NODE_ENV === 'production';
  }

  /**
   * Generate a unique session ID
   */
  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Set user ID for analytics
   */
  setUserId(userId) {
    this.userId = userId;
  }

  /**
   * Track an analytics event
   */
  track(eventName, properties = {}) {
    if (!this.isEnabled) {
      console.log('Analytics (dev):', eventName, properties);
      return;
    }

    const event = {
      event: eventName,
      properties: {
        ...properties,
        sessionId: this.sessionId,
        userId: this.userId,
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : '',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        referrer: typeof document !== 'undefined' ? document.referrer : ''
      }
    };

    this.events.push(event);
    this.sendEvent(event);
  }

  /**
   * Send event to analytics service
   */
  async sendEvent(event) {
    try {
      // In a real application, you would send this to services like:
      // - Google Analytics
      // - Mixpanel
      // - Amplitude
      // - Custom analytics endpoint
      
      // For now, we'll store it locally and log it
      console.log('Analytics event:', event);
      
      // Store in localStorage for debugging
      const existingEvents = JSON.parse(localStorage.getItem('analytics_events') || '[]');
      existingEvents.push(event);
      localStorage.setItem('analytics_events', JSON.stringify(existingEvents.slice(-100))); // Keep last 100
      
    } catch (error) {
      console.error('Failed to send analytics event:', error);
    }
  }

  /**
   * Track page views
   */
  trackPageView(pageName, properties = {}) {
    this.track(ANALYTICS_EVENTS.PAGE_LOADED, {
      page: pageName,
      ...properties
    });
  }

  /**
   * Track user actions
   */
  trackUserAction(action, properties = {}) {
    this.track(action, {
      action_type: 'user_action',
      ...properties
    });
  }

  /**
   * Track errors
   */
  trackError(error, context = {}) {
    this.track(ANALYTICS_EVENTS.ERROR_OCCURRED, {
      error_message: error.message,
      error_stack: error.stack,
      error_name: error.name,
      ...context
    });
  }

  /**
   * Track API calls
   */
  trackApiCall(endpoint, method, duration, success = true, error = null) {
    this.track(success ? ANALYTICS_EVENTS.API_CALL_MADE : ANALYTICS_EVENTS.API_CALL_FAILED, {
      endpoint,
      method,
      duration,
      success,
      error: error ? error.message : null
    });
  }

  /**
   * Get analytics data
   */
  getAnalyticsData() {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      events: this.events,
      totalEvents: this.events.length
    };
  }

  /**
   * Clear analytics data
   */
  clearAnalyticsData() {
    this.events = [];
    localStorage.removeItem('analytics_events');
  }
}

// Global analytics instance
export const analytics = new AnalyticsService();

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
  }

  /**
   * Start timing an operation
   */
  startTiming(operationName) {
    this.metrics.set(operationName, {
      startTime: performance.now(),
      endTime: null,
      duration: null
    });
  }

  /**
   * End timing an operation
   */
  endTiming(operationName) {
    const metric = this.metrics.get(operationName);
    if (metric) {
      metric.endTime = performance.now();
      metric.duration = metric.endTime - metric.startTime;
      
      // Track performance in analytics
      analytics.track('performance_metric', {
        operation: operationName,
        duration: metric.duration
      });
    }
    return metric?.duration;
  }

  /**
   * Get performance metrics
   */
  getMetrics() {
    return Object.fromEntries(this.metrics);
  }

  /**
   * Clear performance metrics
   */
  clearMetrics() {
    this.metrics.clear();
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * User behavior tracking
 */
export class UserBehaviorTracker {
  constructor() {
    this.interactions = [];
    this.isTracking = false;
  }

  /**
   * Start tracking user interactions
   */
  startTracking() {
    if (typeof window === 'undefined') return;
    
    this.isTracking = true;
    
    // Track clicks
    document.addEventListener('click', this.trackClick.bind(this));
    
    // Track form submissions
    document.addEventListener('submit', this.trackFormSubmit.bind(this));
    
    // Track page visibility changes
    document.addEventListener('visibilitychange', this.trackVisibilityChange.bind(this));
  }

  /**
   * Stop tracking user interactions
   */
  stopTracking() {
    if (typeof window === 'undefined') return;
    
    this.isTracking = false;
    
    document.removeEventListener('click', this.trackClick.bind(this));
    document.removeEventListener('submit', this.trackFormSubmit.bind(this));
    document.removeEventListener('visibilitychange', this.trackVisibilityChange.bind(this));
  }

  /**
   * Track click events
   */
  trackClick(event) {
    const element = event.target;
    const interaction = {
      type: 'click',
      element: element.tagName,
      id: element.id,
      className: element.className,
      text: element.textContent?.substring(0, 100),
      timestamp: new Date().toISOString()
    };
    
    this.interactions.push(interaction);
    analytics.track('user_interaction', interaction);
  }

  /**
   * Track form submissions
   */
  trackFormSubmit(event) {
    const form = event.target;
    const interaction = {
      type: 'form_submit',
      formId: form.id,
      formAction: form.action,
      timestamp: new Date().toISOString()
    };
    
    this.interactions.push(interaction);
    analytics.track('user_interaction', interaction);
  }

  /**
   * Track page visibility changes
   */
  trackVisibilityChange() {
    const interaction = {
      type: 'visibility_change',
      visible: !document.hidden,
      timestamp: new Date().toISOString()
    };
    
    this.interactions.push(interaction);
    analytics.track('user_interaction', interaction);
  }

  /**
   * Get interaction data
   */
  getInteractions() {
    return this.interactions;
  }

  /**
   * Clear interaction data
   */
  clearInteractions() {
    this.interactions = [];
  }
}

// Global user behavior tracker instance
export const userBehaviorTracker = new UserBehaviorTracker();

/**
 * Initialize analytics and monitoring
 */
export function initializeAnalytics() {
  // Start user behavior tracking
  userBehaviorTracker.startTracking();
  
  // Track initial page load
  analytics.trackPageView('app_initialized');
  
  // Set up error tracking
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
      analytics.trackError(event.error, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });
    
    window.addEventListener('unhandledrejection', (event) => {
      analytics.trackError(new Error(event.reason), {
        type: 'unhandled_promise_rejection'
      });
    });
  }
}

/**
 * Utility functions for common analytics tracking
 */
export const trackUserSignIn = (method = 'google') => {
  analytics.track(ANALYTICS_EVENTS.USER_SIGNED_IN, { method });
};

export const trackUserSignOut = () => {
  analytics.track(ANALYTICS_EVENTS.USER_SIGNED_OUT);
};

export const trackCompanyCreated = (companyName) => {
  analytics.track(ANALYTICS_EVENTS.COMPANY_CREATED, { company_name: companyName });
};

export const trackStatusUpdate = (statusType) => {
  analytics.track(ANALYTICS_EVENTS.STATUS_UPDATED, { status_type: statusType });
};

export const trackJoinRequestSent = (companyId) => {
  analytics.track(ANALYTICS_EVENTS.JOIN_REQUEST_SENT, { company_id: companyId });
};

export const trackJoinRequestApproved = (userId, companyId) => {
  analytics.track(ANALYTICS_EVENTS.JOIN_REQUEST_APPROVED, { 
    user_id: userId, 
    company_id: companyId 
  });
};
