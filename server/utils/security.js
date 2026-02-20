/**
 * Security utilities for zero-trust architecture
 * Implements cryptographic functions and secure storage
 */

import crypto from 'crypto';

/**
 * Cryptographically secure random ID generation
 */
export function generateSecureId() {
  // Use Node.js crypto for cryptographically secure random values
  return crypto.randomUUID();
}

/**
 * Secure hash function for data integrity
 */
export async function hashData(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Rate limiting check (server-side)
 * Note: This is a simple implementation, production should use Redis
 */
class RateLimiter {
  constructor(maxAttempts = 10, windowMs = 60000) {
    this.attempts = new Map();
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  check(key) {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove attempts outside the time window
    const validAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (validAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    validAttempts.push(now);
    this.attempts.set(key, validAttempts);
    return true;
  }

  reset(key) {
    this.attempts.delete(key);
  }
}

export const rateLimiter = new RateLimiter(10, 60000); // 10 attempts per minute
