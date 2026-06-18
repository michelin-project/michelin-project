import type { Tire } from "../types/index";
import { RETAILERS } from "../data/index";

export function Recommendation({
  tire,
  promoActive,
  onActivatePromo,
  onBuy,
}: {
  tire: Tire;
  promoActive: boolean;
  onActivatePromo: () => void;
  onBuy: () => void;
}) {
  const discount = promoActive ? 0.15 : 0;
  const finalPrice = tire.price * (1 - discount);

  return (
    <div className="pb-10">
      <div className="px-6 pt-6">
        <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
          Boutique
        </div>
        <h1 className="mt-1 text-[28px] font-black tracking-tight">
          Acheter en 1 clic
        </h1>
      </div>

      <div className="mt-5 mx-4 rounded-3xl border border-border overflow-hidden">
        <div className="h-48 bg-surface flex items-center justify-center">
          <img
            src={tire.image}
            alt={tire.name}
            className="h-full w-auto object-contain"
            width={1024}
            height={1024}
            loading="lazy"
          />
        </div>
        <div className="p-5">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
            {tire.family}
          </div>
          <div className="font-black text-xl tracking-tight mt-0.5">
            Michelin {tire.name}
          </div>

          <div className="mt-4 flex items-end gap-3">
            <div className="text-3xl font-black tracking-tight">
              {finalPrice.toFixed(2)} €
            </div>
            {promoActive && (
              <>
                <div className="text-base text-muted-foreground line-through">
                  {tire.price.toFixed(2)} €
                </div>
                <div className="rounded-full bg-michelin-yellow text-ink text-[11px] font-bold px-2 py-0.5">
                  −15%
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {!promoActive && (
        <div className="mx-4 mt-4 rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground grid place-items-center font-black">
              %
            </div>
            <div className="flex-1">
              <div className="font-bold text-sm">
                Économisez 15% supplémentaires
              </div>
              <p className="mt-0.5 text-[12px] text-ink-soft leading-snug">
                Rejoignez le challenge Strava « 200 km en mai » et débloquez
                votre code promo Michelin.
              </p>
              <button
                onClick={onActivatePromo}
                className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold px-4 py-2"
              >
                Rejoindre & débloquer −15%
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-4 mt-6">
        <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
          Choisissez votre revendeur
        </div>
        <div className="space-y-2">
          {RETAILERS.map((r, i) => (
            <button
              key={r.name}
              onClick={onBuy}
              className={`w-full flex items-center justify-between rounded-2xl border p-4 transition
                ${i === 0 ? "border-primary bg-primary/5" : "border-border bg-background"}`}
            >
              <div className="text-left">
                <div className="font-bold text-sm">{r.name}</div>
                <div className="text-[11px] text-muted-foreground">
                  {r.delivery} · {r.note}
                </div>
              </div>
              <div className="text-right">
                <div className="font-black text-sm">
                  {finalPrice.toFixed(2)} €
                </div>
                <div className="text-[11px] text-primary font-semibold">
                  Acheter →
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onBuy}
        className="mx-4 mt-6 w-[calc(100%-2rem)] h-14 rounded-2xl bg-primary text-primary-foreground font-semibold text-[15px] shadow-[var(--shadow-elevated)]"
      >
        Acheter maintenant — {finalPrice.toFixed(2)} €
      </button>
      <p className="text-center text-[11px] text-muted-foreground mt-3 px-6">
        Paiement sécurisé via le revendeur. Garantie Michelin 2 ans.
      </p>
    </div>
  );
}
