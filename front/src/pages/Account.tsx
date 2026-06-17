export function Account({
  onBack,
  orders,
}: {
  onBack: () => void;
  orders: { id: string; date: string; tire: string; price: number }[];
}) {
  return (
    <div className="px-6 pt-4 pb-10">
      <button
        type="button"
        onClick={onBack}
        className="text-sm text-muted-foreground mb-6 flex items-center gap-1.5"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="w-4 h-4"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Retour
      </button>

      <h1 className="text-3xl font-black tracking-tight">Mon compte</h1>

      <p className="mt-2 text-sm text-muted-foreground">
        Historique de vos commandes
      </p>

      <div className="mt-6 flex flex-col gap-3">
        {orders.length === 0 && (
          <div className="text-sm text-muted-foreground">
            Vous n’avez pas encore passé de commande.
          </div>
        )}

        {orders.map((o) => (
          <div
            key={o.id}
            className="m-card p-4 rounded-xl border border-border flex flex-col gap-1"
          >
            <div className="text-sm font-bold">{o.tire}</div>
            <div className="text-xs text-muted-foreground">
              Commandé le {o.date}
            </div>
            <div className="text-sm font-black text-michelin-blue">
              {o.price.toFixed(2)} €
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
