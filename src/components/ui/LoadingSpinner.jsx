import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Full-page or inline loading state.
 */
const LoadingSpinner = ({ message = 'Loading...', fullPage = false, size = 'md' }) => {
  const sizeMap = { sm: 20, md: 32, lg: 48 };
  const iconSize = sizeMap[size] ?? 32;

  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={iconSize} className="animate-spin text-primary-600" />
          <p className="text-neutral-500 text-sm">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={iconSize} className="animate-spin text-primary-600" />
        <p className="text-neutral-400 text-sm">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
