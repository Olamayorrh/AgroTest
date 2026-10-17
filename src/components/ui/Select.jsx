import React, { forwardRef } from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';

/**
 * Reusable Select component with label, error, and empty option support.
 */
const Select = forwardRef(
  (
    {
      label,
      id,
      error,
      helperText,
      required,
      placeholder = 'Select an option',
      options = [],
      className = '',
      containerClassName = '',
      ...props
    },
    ref
  ) => {
    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label htmlFor={id} className="form-label">
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={id}
            aria-describedby={error ? `${id}-error` : undefined}
            aria-invalid={!!error}
            className={`
              form-input appearance-none pr-10 cursor-pointer
              ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : ''}
              ${className}
            `.trim()}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value ?? opt} value={opt.value ?? opt}>
                {opt.label ?? opt.name ?? opt}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-neutral-400">
            <ChevronDown size={18} />
          </div>
        </div>
        {error && (
          <p id={`${id}-error`} className="form-error" role="alert">
            <AlertCircle size={12} />
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="form-helper">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
