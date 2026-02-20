/**
 * Security wrapper component for zero-trust architecture
 * Implements security checks and monitoring
 */

import { useEffect } from 'react';

export default function SecurityWrapper({ children }) {
  useEffect(() => {
    // Check for Web Crypto API availability
    if (!window.crypto || !window.crypto.getRandomValues) {
      console.error('Web Crypto API not available - security features disabled');
    }

    // Monitor for suspicious activity
    const handleStorageChange = (e) => {
      // Log storage changes from other tabs/windows for security monitoring
      if (e.key && e.key.startsWith('devlog_')) {
        console.warn('Storage modified from external source:', e.key);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return <>{children}</>;
}
