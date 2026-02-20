/**
 * Comprehensive input validation and sanitization utilities
 * Implements zero-trust validation for all user inputs
 */

import { config } from '../config/index.js';

// Maximum lengths to prevent DoS attacks
export const MAX_LENGTHS = {
  MESSAGE: config.maxMessageLength,
  TAG: config.maxTagLength,
  CATEGORY: config.maxCategoryLength,
  MAX_TAGS: config.maxTagsPerEntry,
};

// Allowed characters patterns
const TAG_PATTERN = /^[a-zA-Z0-9_-]+$/;
const CATEGORY_PATTERN = /^[a-zA-Z0-9\s_-]+$/;
const ID_PATTERN = /^[a-zA-Z0-9_-]+$/;

/**
 * Sanitizes HTML to prevent XSS attacks
 * Server-side sanitization using string replacement
 */
export function sanitizeHtml(input) {
  if (typeof input !== 'string') return '';
  
  // Remove HTML tags and encode special characters
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validates and sanitizes text input
 */
export function validateAndSanitizeText(input, maxLength = MAX_LENGTHS.MESSAGE) {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string');
  }

  // Trim whitespace
  let sanitized = input.trim();

  // Check length
  if (sanitized.length > maxLength) {
    throw new Error(`Input exceeds maximum length of ${maxLength} characters`);
  }

  if (sanitized.length === 0) {
    throw new Error('Input cannot be empty');
  }

  // Basic XSS prevention - remove script tags and event handlers
  sanitized = sanitized
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:text\/html/gi, '');

  // Additional XSS prevention
  sanitized = sanitized
    .replace(/<iframe/gi, '')
    .replace(/<object/gi, '')
    .replace(/<embed/gi, '')
    .replace(/<link/gi, '')
    .replace(/<meta/gi, '');

  return sanitizeHtml(sanitized);
}

/**
 * Validates and sanitizes tag input
 */
export function validateAndSanitizeTag(input) {
  if (typeof input !== 'string') {
    throw new Error('Tag must be a string');
  }

  const trimmed = input.trim();

  if (trimmed.length === 0) {
    throw new Error('Tag cannot be empty');
  }

  if (trimmed.length > MAX_LENGTHS.TAG) {
    throw new Error(`Tag exceeds maximum length of ${MAX_LENGTHS.TAG} characters`);
  }

  if (!TAG_PATTERN.test(trimmed)) {
    throw new Error('Tag contains invalid characters. Only letters, numbers, hyphens, and underscores are allowed');
  }

  return trimmed.toLowerCase();
}

/**
 * Validates and sanitizes category input
 */
export function validateAndSanitizeCategory(input) {
  if (typeof input !== 'string') {
    throw new Error('Category must be a string');
  }

  const trimmed = input.trim();

  if (trimmed.length === 0) {
    throw new Error('Category cannot be empty');
  }

  if (trimmed.length > MAX_LENGTHS.CATEGORY) {
    throw new Error(`Category exceeds maximum length of ${MAX_LENGTHS.CATEGORY} characters`);
  }

  if (!CATEGORY_PATTERN.test(trimmed)) {
    throw new Error('Category contains invalid characters');
  }

  return trimmed;
}

/**
 * Validates array of tags
 */
export function validateTags(tags) {
  if (!Array.isArray(tags)) {
    throw new Error('Tags must be an array');
  }

  if (tags.length > MAX_LENGTHS.MAX_TAGS) {
    throw new Error(`Maximum ${MAX_LENGTHS.MAX_TAGS} tags allowed`);
  }

  return tags.map((tag, index) => {
    try {
      return validateAndSanitizeTag(tag);
    } catch (error) {
      throw new Error(`Tag at index ${index} is invalid: ${error.message}`);
    }
  });
}

/**
 * Validates entry ID format
 */
export function validateEntryId(id) {
  if (typeof id !== 'string') {
    throw new Error('Entry ID must be a string');
  }

  if (!ID_PATTERN.test(id)) {
    throw new Error('Invalid entry ID format');
  }

  if (id.length > 100) {
    throw new Error('Entry ID is too long');
  }

  return id;
}

/**
 * Validates date/timestamp
 */
export function validateTimestamp(timestamp) {
  if (!(timestamp instanceof Date) && typeof timestamp !== 'string' && typeof timestamp !== 'number') {
    throw new Error('Timestamp must be a Date, string, or number');
  }

  const date = timestamp instanceof Date 
    ? timestamp 
    : new Date(timestamp);

  if (isNaN(date.getTime())) {
    throw new Error('Invalid timestamp');
  }

  // Prevent future dates (with small tolerance for clock skew)
  const now = new Date();
  const maxFuture = new Date(now.getTime() + 60000); // 1 minute tolerance
  if (date > maxFuture) {
    throw new Error('Timestamp cannot be in the future');
  }

  return date;
}

/**
 * Validates complete entry object
 */
export function validateEntry(entry) {
  if (!entry || typeof entry !== 'object') {
    throw new Error('Entry must be an object');
  }

  const validated = {
    message: validateAndSanitizeText(entry.message),
    tags: entry.tags ? validateTags(entry.tags) : [],
    category: entry.category ? validateAndSanitizeCategory(entry.category) : undefined,
  };

  return validated;
}
