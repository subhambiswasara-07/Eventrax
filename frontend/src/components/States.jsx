export function Loader({ label = 'Loading' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink">
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-ink/15 border-t-flare" />
      <p className="font-body text-sm font-medium text-ink/60">{label}…</p>
    </div>
  );
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="ticket-stub mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl px-8 py-12 text-center">
      <h3 className="font-display text-xl text-ink">{title}</h3>
      {description && <p className="font-body text-sm text-ink/60">{description}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ title = 'That didn\u2019t work', message, onRetry }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border-2 border-flare bg-flare/10 px-8 py-10 text-center">
      <h3 className="font-display text-xl text-flare">{title}</h3>
      <p className="font-body text-sm text-ink/70">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 rounded-full border-2 border-ink bg-chalk px-5 py-2 text-sm font-semibold text-ink hover:bg-ink hover:text-chalk"
        >
          Try again
        </button>
      )}
    </div>
  );
}
