import { useEffect, useState } from "react";

export function Progress({
  onLeaderboard,
  onReward,
}: {
  onLeaderboard: () => void;
  onReward: () => void;
}) {
  const [distance, setDistance] = useState(0);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("michelin_token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setEmail(payload.email);
        fetch(`http://localhost:3000/users/${payload.email}`)
          .then((r) => r.json())
          .then((data) => {
            if (data) {
              if (data.scores !== undefined) setDistance(data.scores);
              if (data.name) setName(data.name);
            }
          });
      } catch (e) {
        console.error("Token decoding failed", e);
      }
    }
  }, []);

  const handleSimulate = async () => {
    if (!email) return;
    try {
      const res = await fetch("http://localhost:3000/users/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, distance: 200 }),
      });
      if (res.ok) {
        const data = await res.json();
        setDistance(data.scores);
        onReward();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const percentage = Math.min(100, Math.round((distance / 200) * 100));

  return (
    <div className="px-6 pt-6 pb-10">
      <div className="flex items-baseline justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
            Cette semaine
          </div>
          <h1 className="text-[30px] font-black tracking-tight leading-tight">
            Bonne cadence 💪
          </h1>
        </div>
        <button
          onClick={onLeaderboard}
          className="text-xs font-semibold text-primary"
        >
          Classement →
        </button>
      </div>

      <div
        className="mt-5 rounded-3xl p-6 text-white relative overflow-hidden shadow-[var(--shadow-elevated)]"
        style={{ background: "var(--gradient-blue)" }}
      >
        <div className="text-[11px] uppercase tracking-wider opacity-80">
          Distance cette semaine
        </div>
        <div className="mt-1 flex items-end gap-2">
          <div className="text-6xl font-black tracking-tight">{distance}</div>
          <div className="pb-2 text-sm opacity-80">km</div>
        </div>
        <div className="mt-4 flex gap-1.5 h-16 items-end">
          {[40, 65, 50, 80, 92, 60, 70].map((v, i) => (
            <div
              key={i}
              className="flex-1 rounded-md bg-white/20 relative overflow-hidden"
            >
              <div
                className="absolute inset-x-0 bottom-0 bg-michelin-yellow rounded-md"
                style={{ height: `${v}%` }}
              />
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[10px] opacity-70">
          {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-border p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
              Challenge 200 km
            </div>
            <div className="text-xl font-black tracking-tight mt-0.5">
              {distance} / 200 km
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-muted-foreground">Reste</div>
            <div className="font-bold">{Math.max(0, 200 - distance)} km</div>
          </div>
        </div>
        <div className="mt-3 h-2 rounded-full bg-surface overflow-hidden">
          <div
            className="h-full bg-primary"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <button
          onClick={handleSimulate}
          className="mt-4 w-full h-11 rounded-xl bg-michelin-yellow text-ink font-semibold text-sm"
        >
          Simuler 200 km atteints
        </button>
      </div>

      <div className="mt-6">
        <h3 className="text-[13px] font-bold uppercase tracking-wider mb-3">
          Badges débloqués
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { e: "🔥", t: "Streak 7j" },
            { e: "🏔️", t: "Grimpeur" },
            { e: "⚡", t: "Sprint +35" },
          ].map((b) => (
            <div key={b.t} className="rounded-2xl bg-surface p-4 text-center">
              <div className="text-3xl">{b.e}</div>
              <div className="mt-1 text-[11px] font-semibold">{b.t}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border p-4 bg-surface">
        <div className="text-sm leading-snug">
          <span className="font-bold">Allez {name || "Cycliste"}, </span>
          encore 2 sorties pour décrocher votre coupon{" "}
          <span className="font-bold text-primary">−15%</span> sur Michelin
          Power Cup.
        </div>
      </div>
    </div>
  );
}
