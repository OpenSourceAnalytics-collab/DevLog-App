import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/utils/api.js';

/**
 * @typedef {Object} LogContextType
 * @property {Array} entries - Array of log entries
 * @property {Function} addEntry - Function to add a new entry
 * @property {Function} deleteEntry - Function to delete an entry
 * @property {Function} updateEntry - Function to update an entry
 * @property {Function} refreshEntries - Function to refresh entries from API
 */

const LogContext = createContext(undefined);

export const LogProvider = ({ children }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getEntries();
      setEntries(data);
    } catch (err) {
      console.error('Failed to load entries:', err);
      setError(err.message || 'Failed to load entries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshEntries();
  }, []);

  const addEntry = async (entry) => {
    try {
      setError(null);
      const newEntry = await api.addEntry(entry);
      await refreshEntries();
      return newEntry;
    } catch (err) {
      console.error('Failed to add entry:', err);
      setError(err.message || 'Failed to add entry');
      throw err;
    }
  };

  const deleteEntry = async (id) => {
    try {
      setError(null);
      await api.deleteEntry(id);
      await refreshEntries();
    } catch (err) {
      console.error('Failed to delete entry:', err);
      setError(err.message || 'Failed to delete entry');
      throw err;
    }
  };

  const updateEntry = async (id, updates) => {
    try {
      setError(null);
      await api.updateEntry(id, updates);
      await refreshEntries();
    } catch (err) {
      console.error('Failed to update entry:', err);
      setError(err.message || 'Failed to update entry');
      throw err;
    }
  };

  return (
    <LogContext.Provider
      value={{
        entries,
        addEntry,
        deleteEntry,
        updateEntry,
        refreshEntries,
        loading,
        error,
      }}
    >
      {children}
    </LogContext.Provider>
  );
};

export const useLogs = () => {
  const context = useContext(LogContext);
  if (!context) {
    throw new Error('useLogs must be used within a LogProvider');
  }
  return context;
};
