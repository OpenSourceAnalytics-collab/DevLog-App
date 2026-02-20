/**
 * API client for communicating with the backend
 * Implements secure request handling and error management
 */

const API_BASE_URL = import.meta.env.VITE_API_URL
  ?? (import.meta.env.PROD ? '/api' : 'http://localhost:3000/api');

/**
 * Secure fetch wrapper with error handling
 */
async function secureFetch(url, options = {}) {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'omit', // Don't send cookies unless needed
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, mergedOptions);

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return null;
    }

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || data.error || 'Request failed');
      error.status = response.status;
      error.details = data.details;
      throw error;
    }

    return data;
  } catch (error) {
    // Network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server');
    }
    throw error;
  }
}

export const api = {
  /**
   * Get all entries
   */
  async getEntries() {
    const entries = await secureFetch('/entries');
    // Convert timestamp strings back to Date objects
    return entries.map(entry => ({
      ...entry,
      timestamp: new Date(entry.timestamp),
    }));
  },

  /**
   * Get entry by ID
   */
  async getEntryById(id) {
    const entry = await secureFetch(`/entries/${id}`);
    return {
      ...entry,
      timestamp: new Date(entry.timestamp),
    };
  },

  /**
   * Add a new entry
   */
  async addEntry(entry) {
    const newEntry = await secureFetch('/entries', {
      method: 'POST',
      body: JSON.stringify(entry),
    });
    return {
      ...newEntry,
      timestamp: new Date(newEntry.timestamp),
    };
  },

  /**
   * Update an entry
   */
  async updateEntry(id, updates) {
    const updatedEntry = await secureFetch(`/entries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return {
      ...updatedEntry,
      timestamp: new Date(updatedEntry.timestamp),
    };
  },

  /**
   * Delete an entry
   */
  async deleteEntry(id) {
    await secureFetch(`/entries/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get statistics
   */
  async getStatistics() {
    return secureFetch('/entries/stats');
  },
};
