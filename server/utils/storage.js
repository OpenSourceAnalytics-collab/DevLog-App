/**
 * In-memory storage for entries (no database)
 * Designed to be easily replaceable with database storage
 */

import { config } from '../config/index.js';
import { validateEntry, validateEntryId, validateTimestamp, validateAndSanitizeText, validateTags, validateAndSanitizeCategory } from './validation.js';
import { generateSecureId } from './security.js';

// In-memory storage
let entries = [];

/**
 * Load entries from memory
 */
export function getEntries() {
  return [...entries];
}

/**
 * Save entries to memory
 */
export function saveEntries(newEntries) {
  // Validate all entries before saving
  const validatedEntries = newEntries.map(entry => {
    const validated = validateEntry(entry);
    return {
      ...validated,
      id: validateEntryId(entry.id),
      timestamp: validateTimestamp(entry.timestamp),
    };
  });

  entries = validatedEntries;
  return entries;
}

/**
 * Add a new entry
 */
export function addEntry(entryData) {
  // Validate input
  const validatedEntry = validateEntry(entryData);

  // Check storage limits (prevent DoS)
  if (entries.length >= config.maxEntries) {
    throw new Error('Maximum number of entries reached');
  }

  // Use secure ID generation
  const id = generateSecureId();

  const newEntry = {
    ...validatedEntry,
    id,
    timestamp: new Date(),
  };

  entries.push(newEntry);
  return newEntry;
}

/**
 * Delete an entry
 */
export function deleteEntry(id) {
  const validatedId = validateEntryId(id);
  const index = entries.findIndex((entry) => entry.id === validatedId);

  if (index === -1) {
    throw new Error('Entry not found');
  }

  entries.splice(index, 1);
  return true;
}

/**
 * Update an entry
 */
export function updateEntry(id, updates) {
  const validatedId = validateEntryId(id);
  const index = entries.findIndex((entry) => entry.id === validatedId);

  if (index === -1) {
    throw new Error('Entry not found');
  }

  // Validate updates
  const validatedUpdates = {};
  if (updates.message !== undefined) {
    validatedUpdates.message = validateAndSanitizeText(updates.message);
  }
  if (updates.tags !== undefined) {
    validatedUpdates.tags = validateTags(updates.tags);
  }
  if (updates.category !== undefined) {
    validatedUpdates.category = updates.category 
      ? validateAndSanitizeCategory(updates.category) 
      : undefined;
  }

  entries[index] = { ...entries[index], ...validatedUpdates };
  return entries[index];
}

/**
 * Get entry by ID
 */
export function getEntryById(id) {
  const validatedId = validateEntryId(id);
  const entry = entries.find((e) => e.id === validatedId);

  if (!entry) {
    throw new Error('Entry not found');
  }

  return entry;
}

/**
 * Get statistics
 */
export function getStatistics() {
  const tagCounts = {};
  const categoryCounts = {};

  entries.forEach((entry) => {
    entry.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
    if (entry.category) {
      categoryCounts[entry.category] = (categoryCounts[entry.category] || 0) + 1;
    }
  });

  const mostUsedTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  const mostUsedCategories = Object.entries(categoryCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  return {
    totalEntries: entries.length,
    totalTags: Object.keys(tagCounts).length,
    totalCategories: Object.keys(categoryCounts).length,
    mostUsedTags,
    mostUsedCategories,
  };
}
