import { useState, useMemo } from "react";
import { Search, ArrowUpDown, Star } from "lucide-react";
import { TIRES } from "../data/index";

export function Shop({
  tire,
  promoActive,
  onActivatePromo,
  onBuy,
  onSelect,
}: {
  tire: any;
  promoActive: boolean;
  onActivatePromo: () => void;
  onBuy: () => void;
  onSelect: (id: string) => void;
}) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("asc");

  // Filtrage simple basé sur ton format TIRES
  const items = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return TIRES.filter((t) => {
      if (!ql) return true;
      const hay = `${t.name} ${t.family} ${t.tag}`.toLowerCase();
      return hay.includes(ql);
    }).sort((a, b) => (sort === "asc" ? a.price - b.price : b.price - a.price));
  }, [q, sort]);

  return (
    <div className="flex flex-col gap-4 px-5 pt-3 pb-10">

      {/* Barre de recherche */}
      <div className="m-card flex items-center gap-2 px-4 py-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value.slice(0, 60))}
          placeholder="Nom ou référence"
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      {/* Tri */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setSort(sort === "asc" ? "desc" : "asc")}
          className="chip"
        >
          <ArrowUpDown className="h-3 w-3" />
          Prix {sort === "asc" ? "↑" : "↓"}
        </button>

        <div className="ml-auto text-xs text-muted-foreground">
          {items.length} résultats
        </div>
      </div>

      {/* Liste des pneus */}
      <div className="grid grid-cols-2 gap-3">
        {items.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            className="m-card flex flex-col overflow-hidden text-left"
          >
            <div className="grid h-32 place-items-center bg-secondary">
              <img
                src={t.image}
                alt={t.name}
                loading="lazy"
                className="h-full w-full object-contain p-2"
              />
            </div>

            <div className="flex flex-col gap-1 p-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-michelin-blue">
                  {t.family}
                </span>

                <span className="flex items-center gap-0.5 text-[10px] font-bold">
                  <Star className="h-3 w-3 fill-michelin-yellow text-michelin-yellow" />
                  {t.match}
                </span>
              </div>

              <div className="truncate text-sm font-bold">{t.name}</div>

              <div className="text-sm font-black text-michelin-blue">
                {t.price.toFixed(2)} €
              </div>
            </div>
          </button>
        ))}
      </div>

      {items.length === 0 && (
        <div className="m-card p-8 text-center text-sm text-muted-foreground">
          Aucun pneu ne correspond à ces critères.
        </div>
      )}

      {/* Bouton Acheter */}
      <button
        onClick={onBuy}
        className="w-full h-12 rounded-xl bg-michelin-blue text-white font-bold mt-4"
      >
        Acheter ce pneu
      </button>

      {/* Promo */}
      {promoActive && (
        <div className="text-center text-sm font-bold text-michelin-blue mt-2">
          Promo Challenge Strava activée !
        </div>
      )}
    </div>
  );
}
