import type { Tire } from "../types/index";
import type { ReturnType } from "../lib/app-utils";
import { deriveArchetype } from "../lib/app-utils";
import { TIRES } from "../data/index";

export function Reco({
  tire, onSelect, selectedId, archetype, onJoin, onSkipBuy,
}: {
  tire: Tire; onSelect: (id: string) => void; selectedId: string; archetype: ReturnType<typeof deriveArchetype>;
  onJoin: () => void; onSkipBuy: () => void;
}) {
  return (
    <div className="pb-10">
      <div className="px-6 pt-6">
        <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Recommandation</div>
        <h1 className="mt-1 text-[26px] font-black tracking-tight leading-tight">
          Le pneu fait pour <span className="text-primary">{archetype.name}</span>
        </h1>
      </div>

      <div className="mt-5 mx-4 rounded-3xl bg-gradient-to-b from-surface to-background border border-border overflow-hidden shadow-[var(--shadow-card)]">
        <div className="relative h-56 bg-surface flex items-center justify-center">
          <img src={tire.image} alt={tire.name} className="h-full w-auto object-contain" width={1024} height={1024} loading="lazy" />
          <div className="absolute top-4 left-4 rounded-full bg-michelin-yellow px-3 py-1 text-[11px] font-bold tracking-tight text-ink">
            {tire.match}% match
          </div>
          <div className="absolute top-4 right-4 rounded-full bg-background/80 backdrop-blur px-3 py-1 text-[11px] font-semibold text-ink border border-border">
            MICHELIN
          </div>
        </div>
        <div className="p-5">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{tire.family}</div>
          <div className="flex items-baseline justify-between mt-1">
            <div className="text-2xl font-black tracking-tight">{tire.name}</div>
            <div className="text-base font-semibold">{tire.price.toFixed(2)} €</div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {tire.highlights.map(h => (
              <div key={h.label} className="rounded-xl bg-surface p-3">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{h.label}</div>
                <div className="mt-2 flex items-end gap-1">
                  <div className="text-lg font-bold leading-none">{h.value}</div>
                  <div className="text-[10px] text-muted-foreground mb-0.5">/100</div>
                </div>
                <div className="mt-2 h-1 rounded-full bg-border overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${h.value}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl bg-surface p-4 border border-border">
            <div className="text-[11px] uppercase tracking-wider text-primary font-bold">Pourquoi ce pneu</div>
            <p className="mt-1.5 text-sm leading-snug text-ink-soft">{tire.why}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 px-6">
        <div className="flex items-baseline justify-between">
          <h3 className="text-[13px] font-bold uppercase tracking-wider">Autres pneus compatibles</h3>
          <span className="text-[11px] text-muted-foreground">{TIRES.length} modèles</span>
        </div>
      </div>

      <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar px-6 pb-1 snap-x snap-mandatory">
        {TIRES.map(t => {
          const active = selectedId === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onSelect(t.id)}
              className={`snap-start shrink-0 w-44 rounded-2xl border text-left overflow-hidden transition
                ${active ? "border-primary shadow-[var(--shadow-card)]" : "border-border bg-background"}`}
            >
              <div className="h-28 bg-surface flex items-center justify-center">
                <img src={t.image} alt={t.name} className="h-24 w-auto object-contain" width={1024} height={1024} loading="lazy" />
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-bold text-primary">{t.match}%</div>
                  <div className="text-[11px] font-semibold">{t.price.toFixed(0)} €</div>
                </div>
                <div className="mt-1 font-bold text-sm tracking-tight">{t.name}</div>
                <div className="text-[10px] text-muted-foreground truncate">{t.family}</div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="px-6 mt-6 space-y-3">
        <button onClick={onJoin} className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-semibold text-[15px] shadow-[var(--shadow-elevated)] flex items-center justify-center gap-2">
          Rejoindre le challenge — débloquer −15%
        </button>
        <button onClick={onSkipBuy} className="w-full h-12 rounded-2xl bg-background border border-border font-medium text-sm">
          Acheter au prix affiché
        </button>
      </div>
    </div>
  );
}
