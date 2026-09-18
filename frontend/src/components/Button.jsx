const VARIANTS = {
  primary: 'bg-ink text-chalk border-ink hover:-translate-y-0.5 hover:shadow-stub-sm',
  secondary: 'bg-sunbeam text-ink border-transparent hover:-translate-y-0.5 hover:shadow-stub-sm',
  outline: 'bg-white/70 text-ink border-ink/10 hover:bg-white hover:border-ink/20 hover:-translate-y-0.5',
  ghost: 'bg-transparent text-ink border-transparent hover:bg-paper',
  danger: 'bg-transparent text-flare border-flare/30 hover:bg-flare hover:text-white hover:border-flare',
};

export default function Button({
  children, variant = 'primary', type = 'button', onClick, disabled = false,
  loading = false, full = false, className = '', ...rest
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-body text-sm font-semibold
        border transition-all duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-50
        ${full ? 'w-full' : ''} ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
      {children}
    </button>
  );
}
