import React from 'react';

/**
 * Stat card for dashboard metrics.
 */
const StatCard = ({
  label,
  value,
  icon: Icon,
  iconBg = 'bg-primary-100',
  iconColor = 'text-primary-700',
  trend,
  trendLabel,
  className = '',
}) => {
  return (
    <div className={`card card-body ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-neutral-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-neutral-900">{value}</p>
          {trend !== undefined && (
            <p
              className={`text-xs mt-1 font-medium ${
                trend > 0 ? 'text-primary-600' : trend < 0 ? 'text-red-500' : 'text-neutral-400'
              }`}
            >
              {trend > 0 ? '+' : ''}
              {trend}% {trendLabel || ''}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
            <Icon size={22} className={iconColor} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
