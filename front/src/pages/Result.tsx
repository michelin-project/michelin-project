import type { Answers } from "../types/index";
import { deriveArchetype } from "../lib/app-utils";
import { Tag, RadarChart } from "../lib/shared-components";

export function Result({
  archetype,
  onNext,
  answers,
}: {
  archetype: ReturnType<typeof deriveArchetype>;
  onNext: () => void;
  answers: Answers;
}) {
  const scores = [
    { k: "Performance", v: archetype.scores.perf },
    { k: "Endurance", v: archetype.scores.end },
    { k: "Aventure", v: archetype.scores.adv },
    { k: "Contrôle", v: archetype.scores.ctrl },
  ];
  return (
    <div className="px-6 pt-6 pb-10">
      <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
        Votre Ride DNA
      </div>
      <h1 className="mt-2 text-[34px] leading-[1.05] font-black tracking-tight">
        {archetype.name}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{archetype.tagline}</p>

      <div
        className="mt-6 rounded-3xl p-6 text-white relative overflow-hidden shadow-[var(--shadow-elevated)]"
        style={{ background: "var(--gradient-blue)" }}
      >
        <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-michelin-yellow/20 blur-2xl" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.2em] opacity-80">
              Profil
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] opacity-80">
              2025
            </span>
          </div>
          <div className="mt-6">
            <RadarChart scores={archetype.scores} />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {scores.map((s) => (
              <div key={s.k}>
                <div className="flex items-end justify-between">
                  <span className="text-[11px] uppercase tracking-wider opacity-80">
                    {s.k}
                  </span>
                  <span className="text-sm font-bold">{s.v}</span>
                </div>
                <div className="mt-1 h-1 rounded-full bg-white/15 overflow-hidden">
                  <div
                    className="h-full bg-michelin-yellow"
                    style={{ width: `${s.v}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-border p-4">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">
          Votre profil en bref
        </div>
        <div className="flex flex-wrap gap-2">
          {answers.bike && <Tag>Vélo · {answers.bike}</Tag>}
          {answers.priority && <Tag>Priorité · {answers.priority}</Tag>}
          {answers.weekly && <Tag>~{answers.weekly} km/sem</Tag>}
          {answers.terrain && <Tag>Terrain · {answers.terrain}</Tag>}
        </div>
      </div>

      <button
        onClick={onNext}
        className="mt-8 w-full h-14 rounded-2xl bg-primary text-primary-foreground font-semibold text-[15px] shadow-[var(--shadow-elevated)] flex items-center justify-center gap-2"
      >
        Voir mon pneu Michelin
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          className="w-4 h-4"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  );
}
