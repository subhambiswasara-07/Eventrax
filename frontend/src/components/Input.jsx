import { useId, useState } from 'react';

export default function Input({ label, type = 'text', error, hint, rightElement, className = '', ...rest }) {
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const resolvedType = isPassword && showPassword ? 'text' : type;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label htmlFor={id} className="text-sm font-semibold text-ink">{label}</label>}
      <div className="relative">
        <input
          id={id}
          type={resolvedType}
          className={`w-full rounded-xl border bg-white px-4 py-3 font-body text-sm text-ink shadow-sm
            placeholder:text-ink/35 transition-all duration-200
            focus:border-flare/50 focus:ring-4 focus:ring-flare/10 focus:outline-none
            ${error ? 'border-flare ring-4 ring-flare/10' : 'border-ink/10'}
            ${isPassword || rightElement ? 'pr-16' : ''}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          {...rest}
        />
        {isPassword && (
          <button type="button" onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-semibold text-ink/50 hover:bg-paper hover:text-ink"
            tabIndex={-1}>
            {showPassword ? 'Hide' : 'Show'}
          </button>
        )}
        {!isPassword && rightElement && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>}
      </div>
      {error && <p id={`${id}-error`} className="text-sm font-medium text-flare">{error}</p>}
      {!error && hint && <p className="text-sm text-ink/45">{hint}</p>}
    </div>
  );
}
