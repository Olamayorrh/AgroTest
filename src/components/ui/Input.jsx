import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

/**
 * Reusable Input component with label, error, helper text, and password toggle.
 */
const Input = forwardRef(
  (
    {
      label,
      id,
      type = 'text',
      error,
      helperText,
      required,
      className = '',
      labelClassName = '',
      containerClassName = '',
      leftIcon,
      rightElement,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label htmlFor={id} className={`form-label ${labelClassName}`}>
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            type={inputType}
            aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
            aria-invalid={!!error}
            className={`
              form-input
              ${leftIcon ? 'pl-10' : ''}
              ${isPassword || rightElement ? 'pr-12' : ''}
              ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : ''}
              ${className}
            `.trim()}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-600"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
          {!isPassword && rightElement && (
            <div className="absolute inset-y-0 right-0 flex items-center">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <p id={`${id}-error`} className="form-error" role="alert">
            <AlertCircle size={12} />
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${id}-helper`} className="form-helper">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
