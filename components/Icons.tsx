// Thin-lined icons matching the V1.5 icon style (1.6px stroke, currentColor),
// same convention as the link.com.au set.
type P = { className?: string };
const S = ({ children, className = "h-6 w-6" }: P & { children: React.ReactNode }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {children}
  </svg>
);

export const Icon = {
  bolt: (p: P) => (
    <S {...p}>
      <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
    </S>
  ),
  shieldCheck: (p: P) => (
    <S {...p}>
      <path d="M12 2 4 5v6c0 5 3.4 8.6 8 11 4.6-2.4 8-6 8-11V5l-8-3z" />
      <path d="m8.5 11.5 2.5 2.5 4.5-4.5" />
    </S>
  ),
  lifebuoy: (p: P) => (
    <S {...p}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
      <path d="m5.6 5.6 3.6 3.6M18.4 5.6l-3.6 3.6M18.4 18.4l-3.6-3.6M5.6 18.4l3.6-3.6" />
    </S>
  ),
  compass: (p: P) => (
    <S {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2z" />
    </S>
  ),
  clipboardCheck: (p: P) => (
    <S {...p}>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
      <path d="m9 13 2.2 2.2L15.5 11" />
    </S>
  ),
  phone: (p: P) => (
    <S {...p}>
      <path d="M5 3h4l2 5-2.5 1.5a12 12 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z" />
    </S>
  ),
  alert: (p: P) => (
    <S {...p}>
      <path d="M12 3 2.5 20h19L12 3z" />
      <path d="M12 10v4M12 17.2v.3" />
    </S>
  ),
  clock: (p: P) => (
    <S {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </S>
  ),
  lock: (p: P) => (
    <S {...p}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </S>
  ),
  doc: (p: P) => (
    <S {...p}>
      <path d="M6 2h9l4 4v16H6V2z" />
      <path d="M15 2v4h4M9 12h6M9 16h6" />
    </S>
  ),
  trendingUp: (p: P) => (
    <S {...p}>
      <path d="M3 17l6-6 4 4 7-7" />
      <path d="M17 8h4v4" />
    </S>
  ),
  scales: (p: P) => (
    <S {...p}>
      <path d="M12 3v18M4 21h16M12 6H5M12 6h7" />
      <path d="M5 6 2.5 12a2.9 2.9 0 0 0 5 0L5 6zM19 6l-2.5 6a2.9 2.9 0 0 0 5 0L19 6z" />
    </S>
  ),
  users: (p: P) => (
    <S {...p}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20a6 6 0 0 1 12 0" />
      <path d="M16 5a3 3 0 0 1 0 6M21 20a6 6 0 0 0-4-5.7" />
    </S>
  ),
};
