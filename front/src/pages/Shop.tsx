import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import { resolveTireImage } from "../data/index";

export function Shop({
  promoActive,
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
  const [selected, setSelected] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    fetch("http://localhost:3000/products")
      .then(async (res) => {
        if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setProducts(data);
        else if (data && Array.isArray(data.data)) setProducts(data.data);
        else setProducts([]);
      })
      .catch((err) => console.error("Erreur chargement produits:", err));
  }, []);

  const items = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return products.filter((p) => {
      if (!ql) return true;
      const name = p.webProductDesignation || p.webRangeName || p.rangeInternal || p["Web Product Designation"] || "";
      const hay = `${name} ${p.cycleTypeWeb || p["CYCLE TYPE WEB"] || ""} ${p.segment || p.Segment || ""}`.toLowerCase();
      return hay.includes(ql);
    }).sort((a, b) => {
      const pA = a.pricing?.msrp_eur || 0;
      const pB = b.pricing?.msrp_eur || 0;
      return sort === "asc" ? pA - pB : pB - pA;
    });
  }, [q, sort, products]);

  // On réinitialise à 10 éléments affichés si on change la recherche ou le tri
  useEffect(() => {
    setVisibleCount(10);
  }, [q, sort]);

  const handleSelect = (id: string) => {
    setSelected(id);
    onSelect(id);
  };

  return (
    <div className="flex flex-col gap-4 px-5 pt-3 pb-10">
      {/* Barre de recherche */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-white">
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
          Prix {sort === "asc" ? "↑" : "↓"}
        </button>

        <div className="ml-auto text-xs text-muted-foreground">
          {items.length} résultats
        </div>
      </div>

      {/* Liste des pneus */}
      <div className="grid grid-cols-2 gap-3">
        {items.slice(0, visibleCount).map((t) => {
            const id = String(t._id);
            const isActive = selected === id;
            const name = t.webProductDesignation || t.webRangeName || t.rangeInternal || t["Web Product Designation"] || "Pneu Michelin";
            const family = t.cycleTypeWeb || t["CYCLE TYPE WEB"] || "MICHELIN";
            const price = t.pricing?.msrp_eur || 0;
            const image = resolveTireImage({ id: "power-cup", family } as any, "route");

          return (
            <button
                key={id}
                onClick={() => handleSelect(id)}
              className={`
                rounded-xl overflow-hidden border transition-all text-left
                ${isActive ? "border-michelin-blue shadow-lg" : "border-border"}
                `}
            >
              {/* IMAGE */}
              <div className="bg-white h-36 w-full flex items-center justify-center p-3">
                <img
                    src={image}
                    alt={name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* INFOS */}
              <div className="bg-white p-3 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-michelin-blue">
                    {family}
                  </span>
                </div>

                <div className="text-[11px] font-bold leading-tight line-clamp-3 h-10">{name}</div>

                <div className="text-sm font-black text-michelin-blue">
                    {price.toFixed(2)} €
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bouton Voir + */}
      {visibleCount < items.length && (
        <button
          onClick={() => setVisibleCount((prev) => prev + 10)}
          className="w-full h-12 mt-2 rounded-xl font-bold text-sm bg-surface border border-border text-michelin-blue transition-colors hover:bg-michelin-blue/5"
        >
          Voir +
        </button>
      )}

      {items.length === 0 && (
        <div className="m-card p-8 text-center text-sm text-muted-foreground">
          Aucun pneu ne correspond à ces critères.
        </div>
      )}

      {/* Bouton Acheter */}
      <button
        onClick={() => selected && onBuy()}
        disabled={!selected}
        className={`
          w-full h-12 rounded-xl font-bold mt-4 transition-all
          ${
            selected
              ? "bg-michelin-blue text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
          }
        `}
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
