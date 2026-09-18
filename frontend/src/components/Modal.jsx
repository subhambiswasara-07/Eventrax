import { useEffect } from 'react';

export default function Modal({ title, children, onClose }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md animate-popIn rounded-2xl border-2 border-ink bg-chalk p-6 shadow-stub"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <h2 className="font-display text-2xl text-ink">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full border-2 border-ink px-2.5 py-1 font-body text-sm font-bold hover:bg-ink hover:text-chalk"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
