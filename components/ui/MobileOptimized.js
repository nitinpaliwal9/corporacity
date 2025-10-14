// components/ui/MobileOptimized.js - Mobile optimization utilities
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function MobileOptimized({ children, className = '' }) {
  const [isMobile, setIsMobile] = useState(false)
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div 
      className={`${className} ${isMobile ? 'mobile-optimized' : ''} ${isTouch ? 'touch-optimized' : ''}`}
      style={{
        // Mobile-specific optimizations
        ...(isMobile && {
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain'
        })
      }}
    >
      {children}
    </div>
  )
}

// Hook for mobile detection
export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

// Hook for touch detection
export function useTouch() {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  return isTouch
}

// Mobile-friendly button component
export function MobileButton({ children, className = '', ...props }) {
  const isTouch = useTouch()
  
  return (
    <motion.button
      className={`${className} ${isTouch ? 'touch-button' : ''}`}
      whileTap={isTouch ? { scale: 0.95 } : {}}
      style={{
        minHeight: isTouch ? '44px' : 'auto', // iOS recommended touch target size
        minWidth: isTouch ? '44px' : 'auto',
        touchAction: 'manipulation' // Disable double-tap zoom
      }}
      {...props}
    >
      {children}
    </motion.button>
  )
}

// Mobile-friendly input component
export function MobileInput({ className = '', ...props }) {
  const isMobile = useMobile()
  
  return (
    <input
      className={`${className} ${isMobile ? 'mobile-input' : ''}`}
      style={{
        fontSize: isMobile ? '16px' : 'inherit', // Prevent zoom on iOS
        touchAction: 'manipulation'
      }}
      {...props}
    />
  )
}

// Mobile-optimized card component
export function MobileCard({ children, className = '', ...props }) {
  const isMobile = useMobile()
  
  return (
    <motion.div
      className={`${className} ${isMobile ? 'mobile-card' : ''}`}
      style={{
        borderRadius: isMobile ? '12px' : '8px',
        margin: isMobile ? '8px' : '16px',
        padding: isMobile ? '16px' : '24px'
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
