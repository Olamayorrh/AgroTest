import React from 'react';
import { PackageSearch } from 'lucide-react';
import Button from './Button';

/**
 * Empty state component for lists, dashboards, and search results.
 */
const EmptyState = ({
  icon: Icon = PackageSearch,
  title = 'Nothing here yet',
  description,
  action,
  actionLabel,
  actionVariant = 'primary',
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mb-4">
        <Icon size={28} className="text-neutral-400" />
      </div>
      <h3 className="text-base font-semibold text-neutral-700 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-neutral-400 max-w-xs leading-relaxed mb-6">{description}</p>
      )}
      {action && actionLabel && (
        <Button variant={actionVariant} onClick={action} size="md">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
