/**
 * Input validation and sanitization utilities (client-side)
 * Implements zero-trust validation for all user inputs
 */

// Maximum lengths to prevent DoS attacks
export const MAX_LENGTHS = {
  MESSAGE: 10000, // 10KB max
  TAG: 50,
  CATEGORY: 100,
  MAX_TAGS: 20,
};

// Allowed characters patterns
const TAG_PATTERN = /^[a-zA-Z0-9_-]+$/;
const CATEGORY_PATTERN = /^[a-zA-Z0-9\s_-]+$/;

/**
 * Sanitizes HTML to prevent XSS attacks
 */
export function sanitizeHtml(input) {
  if (typeof input !== 'string') return '';
  
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

/**
 * Validates and sanitizes text input (client-side validation)
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
      throw new Error(`Tag at index ${index} is invalid: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

  // ID should be alphanumeric with optional hyphens/underscores
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
    throw new Error('Invalid entry ID format');
  }

  if (id.length > 100) {
    throw new Error('Entry ID is too long');
  }

  return id;
}
