"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function Sheet({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    // Achtergrond niet mee laten scrollen zolang het paneel open staat.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        aria-label="Sluiten"
        onClick={onClose}
        className="hb-fade absolute inset-0 h-full w-full cursor-default bg-black/70 backdrop-blur-sm"
      />
      <div
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        className="hb-sheet relative flex max-h-[88dvh] w-full flex-col rounded-t-3xl border border-line bg-panel shadow-2xl outline-none sm:max-w-lg sm:rounded-3xl"
      >
        <div className="flex items-start gap-3 border-b border-line px-5 pt-5 pb-4">
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-lg font-extrabold tracking-tight">{title}</h2>
            {subtitle ? <p className="mt-0.5 text-sm text-muted">{subtitle}</p> : null}
          </div>
          <button
            onClick={onClose}
            aria-label="Sluiten"
            className="-mt-1 -mr-1 grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted transition hover:bg-raised hover:text-cream"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4">{children}</div>

        {footer ? (
          <div className="border-t border-line px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">{footer}</div>
        ) : (
          <div className="pb-[env(safe-area-inset-bottom)]" />
        )}
      </div>
    </div>
  );
}

export function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold tracking-[0.12em] text-muted uppercase">
        {label}
      </span>
      <input
        {...props}
        className={`w-full rounded-xl border border-line bg-night px-3.5 py-2.5 text-sm outline-none transition placeholder:text-muted/60 focus:border-clay ${props.className ?? ""}`}
      />
    </label>
  );
}

export function Stepper({
  value,
  onChange,
  unit,
  min = 1,
  max = 99,
}: {
  value: number;
  onChange: (next: number) => void;
  unit?: string;
  min?: number;
  max?: number;
}) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  const noun = unit ? (value === 1 ? unit : `${unit}s`) : value === 1 ? "keer" : "keer";

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= min}
        aria-label="Eén minder"
        className="grid h-11 w-11 place-items-center rounded-full border border-line bg-raised text-xl font-bold transition disabled:opacity-30 enabled:active:scale-95"
      >
        −
      </button>
      <div className="min-w-20 text-center">
        <div className="text-2xl font-extrabold tabular-nums">{value}</div>
        <div className="text-[11px] text-muted">{noun}</div>
      </div>
      <button
        type="button"
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
        aria-label="Eén meer"
        className="grid h-11 w-11 place-items-center rounded-full border border-line bg-raised text-xl font-bold transition disabled:opacity-30 enabled:active:scale-95"
      >
        +
      </button>
    </div>
  );
}

export function PrimaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`w-full rounded-xl bg-clay px-4 py-3.5 text-sm font-bold text-white transition active:scale-[0.99] disabled:opacity-40 ${props.className ?? ""}`}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`rounded-xl border border-line bg-raised px-4 py-2.5 text-sm font-semibold transition active:scale-[0.99] disabled:opacity-40 ${props.className ?? ""}`}
    >
      {children}
    </button>
  );
}
