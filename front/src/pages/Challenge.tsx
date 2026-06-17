export function Challenge({
  authed, stravaLinked, onLink, onJoin, onBack,
}: { authed: boolean; stravaLinked: boolean; onLink: () => void; onJoin: () => void; onBack: () => void; }) {
  const ready = authed && stravaLinked;
  return (
    <div className="px-6 pt-4 pb-10">
      <button onClick={onBack} className="text-sm text-muted-foreground mb-4 flex items-center gap-1.5">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M15 18l-6-6 6-6"/></svg>
        Retour
      </button>

      <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Challenge du mois</div>
      <h1 className="mt-1 text-[30px] font-black tracking-tight leading-tight">Roulez 200 km en mai</h1>

      <div className="mt-5 rounded-3xl border border-border overflow-hidden">
        <div className="p-5 bg-gradient-to-br from-michelin-yellow/40 to-michelin-yellow/10">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-wider font-bold text-ink">Récompense</div>
              <div className="text-xl font-black tracking-tight mt-0.5">−15% sur Michelin Power Cup</div>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-ink text-michelin-yellow grid place-items-center font-black text-lg">
              %
            </div>
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-black tracking-tight">0<span className="text-base text-muted-foreground">/200 km</span></div>
              <div className="text-[11px] text-muted-foreground mt-1">Démarre dès votre première sortie</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Participants</div>
              <div className="text-lg font-bold">12 487</div>
            </div>
          </div>
          <div className="mt-4 h-2 rounded-full bg-surface overflow-hidden">
            <div className="h-full bg-primary" style={{ width: "0%" }} />
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            {[
              { k: "Durée", v: "30 jours" },
              { k: "Effort", v: "~50 km/sem" },
              { k: "Bonus", v: "Badge XP" },
            ].map(s => (
              <div key={s.k} className="rounded-xl bg-surface py-3">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.k}</div>
                <div className="font-bold text-sm mt-1">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FC4C02] grid place-items-center text-white font-black">S</div>
          <div className="flex-1">
            <div className="font-semibold text-sm">Connexion Strava</div>
            <div className="text-[11px] text-muted-foreground">
              {ready ? "Compte lié — prêt à rouler" : "Requis pour rejoindre le challenge"}
            </div>
          </div>
          {ready ? (
            <span className="text-[11px] font-bold text-primary">✓ Lié</span>
          ) : (
            <button onClick={onLink} className="rounded-full bg-[#FC4C02] text-white text-xs font-semibold px-3 py-2">Connecter</button>
          )}
        </div>
      </div>

      <button
        onClick={onJoin}
        disabled={!ready}
        className="mt-6 w-full h-14 rounded-2xl bg-primary text-primary-foreground font-semibold text-[15px] shadow-[var(--shadow-elevated)] disabled:opacity-40 disabled:shadow-none"
      >
        {ready ? "Rejoindre le challenge" : "Connectez Strava pour continuer"}
      </button>
    </div>
  );
}
