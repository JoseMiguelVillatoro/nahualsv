export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <svg
        width="38"
        height="38"
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect
          x="2"
          y="2"
          width="44"
          height="44"
          rx="12"
          stroke="currentColor"
          strokeWidth="3"
          className="text-primary"
        />
        <path
          d="M16 33V15l16 18V15"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
        />
      </svg>
      <div className="leading-none">
        <span
          className={`block font-display text-xl font-bold tracking-tight ${
            inverted ? "text-navy-foreground" : "text-foreground"
          }`}
        >
          NAHUAL
        </span>
        <span className="block text-[0.65rem] font-semibold tracking-[0.35em] text-primary">
          AUTO
        </span>
      </div>
    </div>
  );
}
