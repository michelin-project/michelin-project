import { useState, useEffect } from "react";

export function Reward({ onSee }: { onSee: () => void }) {
  const [secs, setSecs] = useState(48 * 3600);
  useEffect(() => {
    const t = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = Math.floor(secs / 3600).toString().padStart(2, "0");
  const m = Math.floor((secs % 3600) / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");

  const colors = ["#0055A4", "#FFD100", "#ffffff", "#ff5d5d"];
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 0.6,
    duration: 2 + Math.random() * 1.5,
    color: colors[i % colors.length],
    rot: Math.random() * 360,
  }));

  return (
    <div className="relative px-6 pt-10 pb-10 min-h-full">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {pieces.map((p, i) => (
          <span
            key={i}
            className="confetti-piece"
            style={{
              left: `${p.left}%`,
              background: p.color,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              transform: `rotate(${p.rot}deg)`,
            }}
          />
        ))}
      </div>

      <div className="relative text-center">
        <div className="relative mx-auto w-32 h-32 grid place-items-center">
          <span className="absolute inset-0 rounded-full bg-michelin-yellow/30 pulse-ring" />
          <span className="absolute inset-3 rounded-full bg-michelin-yellow/40 pulse-ring" style={{ animationDelay: "0.4s" }} />
          <div className="w-24 h-24 rounded-full bg-michelin-yellow grid place-items-center text-4xl font-black text-ink shadow-[var(--shadow-elevated)]">
            %
          </div>
        </div>
        <div className="mt-6 text-[11px] uppercase tracking-[0.2em] font-bold text-primary">Récompense débloquée</div>
        <h1 className="mt-2 text-[34px] font-black leading-tight tracking-tight">Félicitations !</h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-[280px] mx-auto">
          Vous avez débloqué <span className="text-ink font-bold">−15%</span> sur les pneus Michelin Power Cup.
        </p>

        <div className="mt-6 inline-flex gap-2 rounded-2xl bg-ink text-white px-5 py-4">
          {[["HRS", h], ["MIN", m], ["SEC", s]].map(([k, v]) => (
            <div key={k} className="text-center min-w-[44px]">
              <div className="text-2xl font-black tracking-tight tabular-nums">{v}</div>
              <div className="text-[10px] opacity-70 tracking-wider">{k}</div>
            </div>
          ))}
        </div>
        <div className="mt-2 text-[11px] text-muted-foreground">Offre valable 48h</div>

        <button onClick={onSee} className="mt-8 w-full h-14 rounded-2xl bg-primary text-primary-foreground font-semibold text-[15px] shadow-[var(--shadow-elevated)]">
          Voir mon offre
        </button>
      </div>
    </div>
  );
}
