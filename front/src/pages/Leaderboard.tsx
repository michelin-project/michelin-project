import { PodiumItem } from "../lib/shared-components";

export function Leaderboard({ onBack }: { onBack: () => void }) {
  const rows = [
    { rank: 1, name: "Léa Bertin", km: 412, you: false },
    { rank: 2, name: "Tom Riva", km: 388, you: false },
    { rank: 3, name: "Marc V. (vous)", km: 327, you: true },
    { rank: 4, name: "Sami N.", km: 301, you: false },
    { rank: 5, name: "Inès D.", km: 270, you: false },
    { rank: 6, name: "Paul C.", km: 244, you: false },
  ];
  return (
    <div className="px-6 pt-4 pb-10">
      <button onClick={onBack} className="text-sm text-muted-foreground mb-4 flex items-center gap-1.5">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M15 18l-6-6 6-6"/></svg>
        Retour
      </button>

      <h1 className="text-[30px] font-black tracking-tight">Classement</h1>
      <p className="text-sm text-muted-foreground mt-1">Vos amis cyclistes — Challenge 200 km</p>

      <div className="mt-5 flex rounded-full bg-surface p-1 text-xs font-semibold">
        <button className="flex-1 h-9 rounded-full bg-background shadow-sm">Amis</button>
        <button className="flex-1 h-9 rounded-full text-muted-foreground">Global</button>
        <button className="flex-1 h-9 rounded-full text-muted-foreground">Club</button>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 items-end">
        <PodiumItem rank={2} name="Tom" km={388} h="h-20" />
        <PodiumItem rank={1} name="Léa" km={412} h="h-28" gold />
        <PodiumItem rank={3} name="Marc" km={327} h="h-16" />
      </div>

      <div className="mt-6 rounded-2xl border border-border divide-y divide-border overflow-hidden">
        {rows.map(r => (
          <div key={r.rank} className={`flex items-center gap-3 px-4 py-3 ${r.you ? "bg-primary/5" : ""}`}>
            <div className={`w-7 h-7 rounded-full grid place-items-center text-[11px] font-bold ${r.rank <= 3 ? "bg-michelin-yellow text-ink" : "bg-surface text-ink-soft"}`}>{r.rank}</div>
            <div className="flex-1">
              <div className="font-semibold text-sm">{r.name}</div>
              <div className="text-[11px] text-muted-foreground">{r.km} km · {Math.floor(r.km / 30)} sorties</div>
            </div>
            <button className="text-[11px] font-semibold text-muted-foreground">Partager</button>
          </div>
        ))}
      </div>
    </div>
  );
}
