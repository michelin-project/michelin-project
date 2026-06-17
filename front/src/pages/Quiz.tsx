import { useState } from "react";
import type { Answers } from "../types/index";
import { QUIZ_STEPS } from "../lib/app-utils";

export function Quiz({ onDone, onBack }: { onDone: (a: Answers) => void; onBack: () => void }) {
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Answers>({});
  const current = QUIZ_STEPS[step];

  function pick(v: any) {
    const next: Answers = { ...a, [current.key]: v };
    setA(next);
    setTimeout(() => {
      if (step === QUIZ_STEPS.length - 1) onDone(next);
      else setStep(step + 1);
    }, 180);
  }

  return (
    <div className="px-6 pt-4 pb-10 min-h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => step === 0 ? onBack() : setStep(step - 1)} className="w-9 h-9 rounded-full bg-surface flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div className="text-[11px] font-semibold text-muted-foreground tracking-wider uppercase">
          Étape {step + 1} / {QUIZ_STEPS.length}
        </div>
        <div className="w-9" />
      </div>

      <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden mb-10">
        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${((step + 1) / QUIZ_STEPS.length) * 100}%` }} />
      </div>

      <div key={step} className="fade-up flex-1 flex flex-col">
        <h2 className="text-[28px] font-black leading-tight tracking-tight">{current.title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{current.sub}</p>

        <div className="mt-8 grid grid-cols-2 gap-3">
          {current.options.map((o: any) => {
            const active = (a as any)[current.key] === o.v;
            return (
              <button
                key={String(o.v)}
                onClick={() => pick(o.v)}
                className={`aspect-square rounded-2xl border text-left p-4 flex flex-col justify-between transition
                  ${active ? "bg-primary text-primary-foreground border-primary shadow-[var(--shadow-elevated)]" : "bg-surface border-border hover:border-primary/40"}`}
              >
                <div className="text-3xl">{o.icon}</div>
                <div className="font-semibold text-[15px] tracking-tight">{o.label}</div>
              </button>
            );
          })}
        </div>

        <div className="mt-auto pt-8 text-center text-[11px] text-muted-foreground">
          Sélectionnez pour continuer · ⏱ 30 sec
        </div>
      </div>
    </div>
  );
}
