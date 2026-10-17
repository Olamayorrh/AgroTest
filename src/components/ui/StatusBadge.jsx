import React from 'react';
import { getStatusClass, getStatusLabel } from '../../utils/formatters';

/**
 * Coloured status badge based on booking/listing status.
 */
const StatusBadge = ({ status, className = '' }) => {
  const cls = getStatusClass(status);
  const label = getStatusLabel(status);
  return (
    <span className={`${cls} ${className}`} aria-label={`Status: ${label}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {label}
    </span>
  );
};

export default StatusBadge;
