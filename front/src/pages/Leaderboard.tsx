import { useEffect, useState } from "react";
import { PodiumItem } from "../lib/shared-components";

export function Leaderboard({ onBack }: { onBack: () => void }) {
  const [rows, setRows] = useState<any[]>([]);
  const [myEmail, setMyEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("michelin_token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setMyEmail(payload.email);
      } catch (e) {
        console.error("Token decoding failed", e);
      }
    }

    fetch("http://localhost:3000/leaderboard")
      .then(res => res.json())
      .then(data => setRows(data))
      .catch(err => console.error(err));
  }, []);

  const first = rows.find(r => r.rank === 1);
  const second = rows.find(r => r.rank === 2);
  const third = rows.find(r => r.rank === 3);

  return (
    <div className="px-6 pt-4 pb-10">
      <button onClick={onBack} className="text-sm text-muted-foreground mb-4 flex items-center gap-1.5">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M15 18l-6-6 6-6"/></svg>
        Retour
      </button>

      <h1 className="text-[30px] font-black tracking-tight">Classement</h1>
      <p className="text-sm text-muted-foreground mt-1">Vos amis cyclistes — Challenge 200 km</p>

      <div className="mt-5 flex rounded-full bg-surface p-1 text-xs font-semibold">
        <button className="flex-1 h-9 rounded-full text-muted-foreground">Amis</button>
        <button className="flex-1 h-9 rounded-full bg-background shadow-sm">Global</button>
        <button className="flex-1 h-9 rounded-full text-muted-foreground">Club</button>
      </div>

      {rows.length > 0 && (
        <div className="mt-5 grid grid-cols-3 gap-3 items-end">
          {second ? <PodiumItem rank={2} name={second.name} km={second.km} h="h-20" /> : <div />}
          {first ? <PodiumItem rank={1} name={first.name} km={first.km} h="h-28" gold /> : <div />}
          {third ? <PodiumItem rank={3} name={third.name} km={third.km} h="h-16" /> : <div />}
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-border divide-y divide-border overflow-hidden">
        {rows.map(r => {
          const isMe = r.email === myEmail;
          return (
            <div key={r.rank} className={`flex items-center gap-3 px-4 py-3 ${isMe ? "bg-primary/5" : ""}`}>
              <div className={`w-7 h-7 rounded-full grid place-items-center text-[11px] font-bold ${r.rank <= 3 ? "bg-michelin-yellow text-ink" : "bg-surface text-ink-soft"}`}>{r.rank}</div>
              <div className="flex-1">
                <div className="font-semibold text-sm">{r.name} {isMe ? "(vous)" : ""}</div>
                <div className="text-[11px] text-muted-foreground">{r.km} km</div>
              </div>
              <button className="text-[11px] font-semibold text-muted-foreground">Partager</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
