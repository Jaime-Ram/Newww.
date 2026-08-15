"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function Sheet({
  open,
  onClose,
  title,
  subtitle,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
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
        className="hb-fade absolute inset-0 h-full w-full cursor-default bg-black/60"
      />
      <div
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        className="hb-sheet relative flex max-h-[88dvh] w-full flex-col rounded-t-2xl bg-paper shadow-xl outline-none sm:max-w-md sm:rounded-2xl"
      >
        <div className="flex items-start gap-3 border-b border-rule px-4 pt-4 pb-3">
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-lg font-bold">{title}</h2>
            {subtitle ? <p className="text-sm text-soft">{subtitle}</p> : null}
          </div>
          <button
            onClick={onClose}
            aria-label="Sluiten"
            className="-mt-0.5 -mr-1 grid h-9 w-9 shrink-0 place-items-center rounded-full text-soft hover:bg-canvas hover:text-ink"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {children}
        </div>
      </div>
    </div>
  );
}

/** Kroontje voor de coaches. */
export function Kroon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M3 8l4.2 3.2L12 4.5l4.8 6.7L21 8l-1.7 10H4.7L3 8zm2.9 8h12.2l.8-4.6-3.3 2.5L12 8.2l-3.6 5.7-3.3-2.5L5.9 16z" />
    </svg>
  );
}

export function Prullenbak({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className} aria-hidden="true">
      <path d="M4 7h16M9 7V5h6v2M7 7l1 13h8l1-13" />
    </svg>
  );
}

export function KnopZwart({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`w-full rounded-lg bg-ink px-4 py-3 text-sm font-bold text-paper active:opacity-90 disabled:opacity-35 ${props.className ?? ""}`}
    >
      {children}
    </button>
  );
}

export function KnopLijn({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`rounded-lg border border-rule bg-paper px-4 py-2.5 text-sm font-semibold active:bg-canvas disabled:opacity-35 ${props.className ?? ""}`}
    >
      {children}
    </button>
  );
}
