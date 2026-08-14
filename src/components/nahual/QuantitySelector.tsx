import { Minus, Plus } from "lucide-react";

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  compact = false,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  compact?: boolean;
}) {
  const btn = `flex items-center justify-center text-muted-foreground outline-none transition-colors hover:bg-secondary hover:text-primary focus-visible:ring-2 focus-visible:ring-ring/60 disabled:opacity-40 disabled:pointer-events-none ${
    compact ? "h-8 w-8" : "h-11 w-11"
  }`;

  return (
    <div className="inline-flex items-center overflow-hidden rounded-xl border border-border bg-card">
      <button
        type="button"
        aria-label="Disminuir cantidad"
        className={btn}
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <Minus size={compact ? 13 : 16} />
      </button>
      <span
        className={`border-x border-border text-center font-semibold text-foreground ${
          compact ? "h-8 w-9 text-sm leading-8" : "h-11 w-14 leading-[2.75rem]"
        }`}
      >
        {value}
      </span>
      <button
        type="button"
        aria-label="Aumentar cantidad"
        className={btn}
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        <Plus size={compact ? 13 : 16} />
      </button>
    </div>
  );
}
