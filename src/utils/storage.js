// Storage utilities for localStorage persistence
// These helpers wrap localStorage operations with error handling

const STORAGE_PREFIX = 'agroshare_';

export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key);
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } catch (err) {
      console.warn(`[AgroShare] Failed to read "${key}" from localStorage:`, err);
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.warn(`[AgroShare] Failed to write "${key}" to localStorage:`, err);
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key);
      return true;
    } catch (err) {
      return false;
    }
  },

  clear: () => {
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith(STORAGE_PREFIX))
        .forEach((k) => localStorage.removeItem(k));
      return true;
    } catch (err) {
      return false;
    }
  },

  // Get all keys with the prefix
  keys: () => {
    try {
      return Object.keys(localStorage)
        .filter((k) => k.startsWith(STORAGE_PREFIX))
        .map((k) => k.replace(STORAGE_PREFIX, ''));
    } catch (err) {
      return [];
    }
  },
};

export default storage;
