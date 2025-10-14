// Performance optimization utilities

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Execute immediately
 * @returns {Function} - Debounced function
 */
export function debounce(func, wait, immediate = false) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}

/**
 * Throttle function to limit function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} - Throttled function
 */
export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Memoization utility for expensive computations
 * @param {Function} fn - Function to memoize
 * @param {Function} getKey - Function to generate cache key
 * @returns {Function} - Memoized function
 */
export function memoize(fn, getKey = (...args) => JSON.stringify(args)) {
  const cache = new Map();
  return function(...args) {
    const key = getKey(...args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

/**
 * Lazy loading utility for components
 * @param {Function} importFunc - Dynamic import function
 * @returns {Promise} - Promise resolving to component
 */
export function lazyLoad(importFunc) {
  return importFunc().then(module => module.default);
}

/**
 * Image optimization utility
 * @param {string} src - Image source
 * @param {object} options - Optimization options
 * @returns {string} - Optimized image URL
 */
export function optimizeImage(src, options = {}) {
  const {
    width = 800,
    height = 600,
    quality = 75,
    format = 'webp'
  } = options;

  // For external images, you might want to use a service like Cloudinary
  // For now, we'll return the original src
  return src;
}

/**
 * Preload critical resources
 * @param {Array} resources - Array of resource URLs
 */
export function preloadResources(resources) {
  if (typeof window === 'undefined') return;

  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.url;
    link.as = resource.type || 'script';
    if (resource.crossOrigin) {
      link.crossOrigin = resource.crossOrigin;
    }
    document.head.appendChild(link);
  });
}

/**
 * Intersection Observer for lazy loading
 * @param {Element} element - Element to observe
 * @param {Function} callback - Callback function
 * @param {object} options - Observer options
 */
export function observeElement(element, callback, options = {}) {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    // Fallback for browsers without IntersectionObserver
    callback();
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback();
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  });

  observer.observe(element);
  return observer;
}

/**
 * Virtual scrolling utility
 * @param {Array} items - Array of items
 * @param {number} itemHeight - Height of each item
 * @param {number} containerHeight - Height of container
 * @param {number} scrollTop - Current scroll position
 * @returns {object} - Visible items and offsets
 */
export function getVisibleItems(items, itemHeight, containerHeight, scrollTop) {
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );

  return {
    startIndex,
    endIndex,
    visibleItems: items.slice(startIndex, endIndex),
    offsetY: startIndex * itemHeight,
    totalHeight: items.length * itemHeight
  };
}

/**
 * Bundle size analyzer
 * @param {string} bundleName - Name of the bundle
 * @param {number} size - Size in bytes
 */
export function analyzeBundleSize(bundleName, size) {
  const sizeKB = (size / 1024).toFixed(2);
  const sizeMB = (size / (1024 * 1024)).toFixed(2);
  
  console.log(`Bundle: ${bundleName}`);
  console.log(`Size: ${sizeKB} KB (${sizeMB} MB)`);
  
  // Warn if bundle is too large
  if (size > 250 * 1024) { // 250KB
    console.warn(`Bundle ${bundleName} is larger than recommended (250KB)`);
  }
}

/**
 * Performance metrics collector
 */
export class PerformanceMetrics {
  constructor() {
    this.metrics = new Map();
    this.observers = new Map();
  }

  /**
   * Start measuring performance
   * @param {string} name - Metric name
   */
  start(name) {
    this.metrics.set(name, {
      startTime: performance.now(),
      endTime: null,
      duration: null
    });
  }

  /**
   * End measuring performance
   * @param {string} name - Metric name
   * @returns {number} - Duration in milliseconds
   */
  end(name) {
    const metric = this.metrics.get(name);
    if (!metric) {
      console.warn(`No metric found for ${name}`);
      return 0;
    }

    metric.endTime = performance.now();
    metric.duration = metric.endTime - metric.startTime;
    
    return metric.duration;
  }

  /**
   * Get all metrics
   * @returns {object} - All collected metrics
   */
  getAll() {
    return Object.fromEntries(this.metrics);
  }

  /**
   * Clear all metrics
   */
  clear() {
    this.metrics.clear();
  }

  /**
   * Observe Web Vitals
   */
  observeWebVitals() {
    if (typeof window === 'undefined') return;

    // Observe Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.metrics.set('LCP', {
            value: lastEntry.startTime,
            timestamp: Date.now()
          });
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.set('LCP', lcpObserver);
      } catch (e) {
        console.warn('LCP observation not supported');
      }

      // Observe First Input Delay
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            this.metrics.set('FID', {
              value: entry.processingStart - entry.startTime,
              timestamp: Date.now()
            });
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.set('FID', fidObserver);
      } catch (e) {
        console.warn('FID observation not supported');
      }

      // Observe Cumulative Layout Shift
      try {
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          this.metrics.set('CLS', {
            value: clsValue,
            timestamp: Date.now()
          });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.set('CLS', clsObserver);
      } catch (e) {
        console.warn('CLS observation not supported');
      }
    }
  }

  /**
   * Disconnect all observers
   */
  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

// Global performance metrics instance
export const performanceMetrics = new PerformanceMetrics();

/**
 * Cache management utility
 */
export class CacheManager {
  constructor(maxSize = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  /**
   * Get value from cache
   * @param {string} key - Cache key
   * @returns {any} - Cached value
   */
  get(key) {
    const item = this.cache.get(key);
    if (item) {
      // Move to end (LRU)
      this.cache.delete(key);
      this.cache.set(key, item);
      return item.value;
    }
    return null;
  }

  /**
   * Set value in cache
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - Time to live in milliseconds
   */
  set(key, value, ttl = 300000) { // 5 minutes default
    // Remove expired items
    this.cleanup();

    // Remove oldest items if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      value,
      expires: Date.now() + ttl
    });
  }

  /**
   * Remove expired items
   */
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (item.expires < now) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all cache
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Get cache size
   * @returns {number} - Number of items in cache
   */
  size() {
    return this.cache.size;
  }
}

// Global cache manager instance
export const cacheManager = new CacheManager();

/**
 * Initialize performance monitoring
 */
export function initializePerformanceMonitoring() {
  if (typeof window === 'undefined') return;

  // Start performance metrics collection
  performanceMetrics.observeWebVitals();

  // Monitor page load performance
  window.addEventListener('load', () => {
    setTimeout(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      if (navigation) {
        performanceMetrics.metrics.set('pageLoad', {
          value: navigation.loadEventEnd - navigation.fetchStart,
          timestamp: Date.now()
        });
      }
    }, 0);
  });

  // Monitor memory usage (if available)
  if ('memory' in performance) {
    setInterval(() => {
      const memory = performance.memory;
      performanceMetrics.metrics.set('memoryUsage', {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
        timestamp: Date.now()
      });
    }, 30000); // Every 30 seconds
  }
}
