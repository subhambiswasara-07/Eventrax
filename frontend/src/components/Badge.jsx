export default function Badge({ children, className = '' }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${className}`}>
      {children}
    </span>
  );
}
