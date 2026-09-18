export default function Logo({ className = '', dark = false }) {
  const textColor = dark ? 'text-white' : 'text-ink';
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="1" y="1" width="32" height="32" rx="10" fill={dark ? "#6D5DFB" : "#EEF2FF"} stroke={dark ? "#FFFFFF" : "#111827"} strokeOpacity=".16" />
        <path d="M10 11.5h13M10 17h9M10 22.5h13" stroke={dark ? "#FFFFFF" : "#111827"} strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="25.5" cy="22.5" r="2.8" fill="#12B8A6" />
      </svg>
      <span className={`font-display text-xl font-bold tracking-[-.03em] ${textColor}`}>
        EVENTRA<span className="text-flare">X</span>
      </span>
    </div>
  );
}
