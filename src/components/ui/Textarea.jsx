import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Reusable Textarea component.
 */
const Textarea = forwardRef(
  (
    {
      label,
      id,
      error,
      helperText,
      required,
      rows = 4,
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
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={!!error}
          className={`
            form-input resize-y min-h-[80px]
            ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : ''}
            ${className}
          `.trim()}
          {...props}
        />
        {error && (
          <p id={`${id}-error`} className="form-error" role="alert">
            <AlertCircle size={12} />
            {error}
          </p>
        )}
        {helperText && !error && <p className="form-helper">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
export default Textarea;
