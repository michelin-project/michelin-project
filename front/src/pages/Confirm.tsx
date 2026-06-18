export function Confirm({
  onRestart,
  onAccount,
}: {
  onRestart: () => void;
  onAccount: () => void;
}) {
  return (
    <div className="px-6 pt-10 pb-10 text-center">
      <div className="mx-auto w-20 h-20 rounded-full bg-primary text-primary-foreground grid place-items-center shadow-[var(--shadow-elevated)]">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          className="w-8 h-8"
        >
          <path d="M5 12l5 5L20 7" />
        </svg>
      </div>
      <div className="mt-5 text-[11px] uppercase tracking-[0.2em] font-bold text-primary">
        Commande confirmée
      </div>
      <h1 className="mt-2 text-[30px] font-black tracking-tight leading-tight">
        À vous la route 🚴
      </h1>
      <p className="mt-3 text-sm text-muted-foreground max-w-[300px] mx-auto">
        Vos Michelin Power Cup arrivent sous 48h. Préparez votre vélo, le
        challenge continue.
      </p>

      <div className="mt-6 rounded-2xl border border-border text-left p-4 mx-auto">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Commande</span>
          <span className="font-semibold">#MRD-48217</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-muted-foreground">Livraison</span>
          <span className="font-semibold">2 jours · Alltricks</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-muted-foreground">Total</span>
          <span className="font-bold">55,17 €</span>
        </div>
      </div>

      <div
        className="mt-6 rounded-3xl p-5 text-left text-white"
        style={{ background: "var(--gradient-blue)" }}
      >
        <div className="text-[11px] uppercase tracking-wider opacity-80 font-bold">
          Michelin Smart Follow-up
        </div>
        <div className="mt-1 text-lg font-black tracking-tight leading-snug">
          Suivez l'usure de vos pneus et gagnez +500 XP fidélité
        </div>
        <p className="mt-2 text-[12px] opacity-80">
          Conseils d'entretien, rappels intelligents, prochains challenges.
        </p>
        <button className="mt-4 w-full h-11 rounded-xl bg-michelin-yellow text-ink font-semibold text-sm">
          Activer le suivi intelligent
        </button>
      </div>

      <button
        onClick={onAccount}
        className="mt-6 w-full h-12 rounded-2xl bg-primary border border-border font-medium text-sm text-white"
      >
        Mon compte
      </button>

      <button
        onClick={onRestart}
        className="mt-6 w-full h-12 rounded-2xl bg-surface border border-border font-medium text-sm"
      >
        Continuer mes challenges
      </button>
    </div>
  );
}
