// Utility formatters for the AgroShare platform

/**
 * Format a number as a currency amount for a given country currency.
 * Defaults to Nigerian Naira (NGN).
 */
export const formatCurrency = (amount, currency = 'NGN') => {
  try {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    // Fallback for currencies Intl may not know
    return `${amount?.toLocaleString() ?? 0}`;
  }
};

/**
 * Format currency with the symbol directly (for non-NGN).
 */
export const formatCurrencyWithSymbol = (amount, symbol = '₦') => {
  return `${symbol}${Number(amount || 0).toLocaleString()}`;
};

/**
 * Format a date string to a readable format.
 */
export const formatDate = (dateStr, options = {}) => {
  if (!dateStr) return 'N/A';
  try {
    return new Intl.DateTimeFormat('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options,
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
};

/**
 * Format a date to a relative time string.
 */
export const formatRelativeTime = (dateStr) => {
  if (!dateStr) return '';
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateStr);
};

/**
 * Generate a unique demo ID with a prefix.
 */
export const generateId = (prefix = 'AGS') => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

/**
 * Truncate text to a maximum length.
 */
export const truncate = (text, maxLength = 100) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

/**
 * Capitalize the first letter of each word.
 */
export const titleCase = (str) => {
  if (!str) return '';
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

/**
 * Format a price with billing unit.
 */
export const formatPrice = (price, unit, symbol = '₦') => {
  return `${symbol}${Number(price || 0).toLocaleString()}/${unit}`;
};

/**
 * Get initials from a full name.
 */
export const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Format phone number for display.
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('234') && cleaned.length === 13) {
    return `+234 ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
  }
  return phone;
};

/**
 * Validate Nigerian phone number.
 */
export const isValidNigerianPhone = (phone) => {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  return /^(\+234|0)[789][01]\d{8}$/.test(cleaned);
};

/**
 * Get the status color class for a booking status.
 */
export const getStatusClass = (status) => {
  const map = {
    pending: 'badge-yellow',
    approved: 'badge-green',
    confirmed: 'badge-green',
    declined: 'badge-red',
    cancelled: 'badge-red',
    completed: 'badge-blue',
    active: 'badge-green',
    inactive: 'badge-gray',
  };
  return map[status?.toLowerCase()] || 'badge-gray';
};

/**
 * Get human-readable status label.
 */
export const getStatusLabel = (status) => {
  const map = {
    pending: 'Pending',
    approved: 'Approved',
    confirmed: 'Confirmed',
    declined: 'Declined',
    cancelled: 'Cancelled',
    completed: 'Completed',
    active: 'Active',
    inactive: 'Inactive',
  };
  return map[status?.toLowerCase()] || titleCase(status || 'Unknown');
};
