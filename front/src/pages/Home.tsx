import heroCyclist from "../assets/hero-cyclist.jpg";
import { MichelinMark } from "../lib/shared-components";

export function Home({ onStart, onLogin, authed }: { onStart: () => void; onLogin: () => void; authed: boolean }) {
  return (
    <div className="relative">
      <div className="relative h-[560px]">
        <img src={heroCyclist} alt="Cycliste en action" className="absolute inset-0 w-full h-full object-cover" width={896} height={1440} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-background" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-4">
          <MichelinMark className="text-white [&_.text-muted-foreground]:text-white/70 [&_.bg-primary]:bg-white [&_.text-primary-foreground]:text-primary" />
          <button
            onClick={onLogin}
            className="flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md border border-white/30 px-3.5 py-2 text-xs font-semibold text-white hover:bg-white/25 transition"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>
            {authed ? "Mon compte" : "Se connecter"}
          </button>
        </div>
      </div>

      <div className="-mt-40 relative px-6 pb-8 fade-up">
        <div className="inline-flex items-center gap-2 rounded-full bg-michelin-yellow px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-ink mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-ink" /> Nouveau · Saison 2025
        </div>
        <h1 className="text-[40px] leading-[1.02] font-black tracking-tight text-white drop-shadow-lg">
          Découvrez<br/>votre Ride DNA
        </h1>
        <p className="mt-4 text-white/90 text-[15px] leading-snug max-w-[300px] drop-shadow">
          Trouvez le pneu Michelin parfaitement adapté à votre style de cyclisme.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={onStart}
            className="group w-full h-14 rounded-2xl bg-primary text-primary-foreground font-semibold text-[15px] tracking-tight shadow-[var(--shadow-elevated)] hover:translate-y-[-1px] transition flex items-center justify-center gap-2"
          >
            Commencer l'analyse
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="w-4 h-4 transition-transform group-hover:translate-x-0.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </button>
          <p className="text-center text-[11px] text-muted-foreground">
            Sans création de compte · 30 secondes
          </p>
        </div>
      </div>
    </div>
  );
}
