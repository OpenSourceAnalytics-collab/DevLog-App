/**
 * Type definitions for DevLog application
 * Using JSDoc for type documentation in JavaScript
 */

/**
 * @typedef {Object} LogEntry
 * @property {string} id - Unique identifier for the entry
 * @property {string} message - The log entry message
 * @property {string[]} tags - Array of tags associated with the entry
 * @property {string} [category] - Optional category for the entry
 * @property {Date} timestamp - Timestamp when the entry was created
 */

/**
 * @typedef {Object} LogEntryFormData
 * @property {string} message - The log entry message
 * @property {string[]} tags - Array of tags associated with the entry
 * @property {string} category - Category for the entry
 */

/**
 * @typedef {Object} Statistics
 * @property {number} totalEntries - Total number of entries
 * @property {number} totalTags - Total number of unique tags
 * @property {number} totalCategories - Total number of unique categories
 * @property {Array<[string, number]>} mostUsedTags - Array of [tag, count] tuples
 * @property {Array<[string, number]>} mostUsedCategories - Array of [category, count] tuples
 */

export {};
