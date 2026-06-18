import { WEAR_COLOR, type WearTone } from "@/lib/tyre-wear";
import { cn } from "@/lib/utils";

// Tons de fond/texte des badges d'état, alignés sur WEAR_COLOR.
// Fonds clairs + textes des couleurs fonctionnelles MICHELIN (charte).
const BADGE_STYLE: Record<WearTone, { bg: string; fg: string }> = {
  good: { bg: "var(--color-michelin-green-light)", fg: "var(--color-michelin-green)" }, // Valide
  watch: { bg: "var(--color-michelin-warning-light)", fg: "#8A5A00" }, // Avertissement (contraste AA renforcé)
  replace: { bg: "var(--color-michelin-danger-light)", fg: "var(--color-michelin-danger)" }, // Danger
  none: { bg: "var(--color-muted)", fg: "var(--color-muted-foreground)" }, // Gris charte
};

export function StatusBadge({
  label,
  tone,
  className,
}: {
  label: string;
  tone: WearTone;
  className?: string;
}) {
  const s = BADGE_STYLE[tone];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-3 py-1 text-sm font-semibold whitespace-nowrap",
        className
      )}
      style={{ backgroundColor: s.bg, color: s.fg }}
    >
      {label}
    </span>
  );
}

/** Colonne d'usure d'un pneu : position, %, barre de progression, modèle. */
export function WearColumn({
  position,
  pct,
  tone,
  model,
}: {
  position: string;
  pct: number;
  tone: WearTone;
  model: string;
}) {
  const color = WEAR_COLOR[tone];
  return (
    <div className="min-w-0">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs font-semibold tracking-wide text-muted-foreground">
          {position}
        </span>
        <span className="text-sm font-bold" style={{ color }}>
          {pct}%
        </span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full"
          style={{ width: `${Math.min(100, Math.max(0, pct))}%`, backgroundColor: color }}
        />
      </div>
      <p className="mt-1.5 truncate text-sm text-muted-foreground">{model}</p>
    </div>
  );
}

/** Jauge circulaire d'usure (page détail). */
export function WearGauge({
  pct,
  tone,
  size = 96,
}: {
  pct: number;
  tone: WearTone;
  size?: number;
}) {
  const stroke = 9;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (Math.min(100, Math.max(0, pct)) / 100) * c;
  const color = WEAR_COLOR[tone];
  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Usure ${pct}%`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-muted)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold leading-none">{pct}%</span>
        <span className="text-[11px] text-muted-foreground">usure</span>
      </div>
    </div>
  );
}

/** Vignette photo de vélo (placeholder hachuré tant qu'il n'y a pas d'image). */
export function BikeThumb({
  label = "vélo",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-xl border border-dashed border-border bg-muted/40 text-xs text-muted-foreground",
        className
      )}
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, transparent, transparent 7px, rgba(0,0,0,0.04) 7px, rgba(0,0,0,0.04) 8px)",
      }}
      aria-hidden
    >
      {label}
    </div>
  );
}
