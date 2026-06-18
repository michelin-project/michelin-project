import type { ScreenKey } from "../types/index";

export function PhoneFrame({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-8 px-4">
      <div
        className="relative bg-card rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden"
        style={{ width: 390, minHeight: 844, maxWidth: "100%" }}
      >
        {children}
      </div>
    </div>
  );
}

export function StatusBar() {
  return (
    <div className="h-10 bg-foreground/5 border-b border-border flex items-center justify-between px-5 flex-shrink-0 text-[10px] font-semibold">
      <span>9:41</span>
      <span className="flex gap-1">📶 📡 🔋</span>
    </div>
  );
}

export function CheckoutStepper({ step }: { step: 1 | 2 }) {
  return (
    <div className="flex items-center gap-3 px-5 py-4 border-b border-border flex-shrink-0">
      <div className="flex items-center gap-2 flex-1">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 1 ? "bg-blue-600 text-white" : "bg-muted text-muted-foreground"}`}>
          1
        </div>
        <div className={`flex-1 h-1 rounded-full transition-colors ${step >= 2 ? "bg-blue-600" : "bg-muted"}`} />
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 2 ? "bg-blue-600 text-white" : "bg-muted text-muted-foreground"}`}>
          2
        </div>
      </div>
    </div>
  );
}

export function MichelinMark({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-black text-[10px] tracking-tight">M</div>
      <div className="leading-none">
        <div className="text-[15px] font-black tracking-tight">MICHELIN</div>
        <div className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground">Ride DNA</div>
      </div>
    </div>
  );
}

export function BottomNav({ current, onNav }: { current: ScreenKey; onNav: (s: ScreenKey) => void }) {
  const items: { key: ScreenKey; label: string; icon: string }[] = [
    { key: "reco", label: "Accueil", icon: "M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" },
    { key: "challenge", label: "Challenge", icon: "M12 2 14.39 8.26 21 9l-5 4.87L17.18 21 12 17.77 6.82 21 8 13.87 3 9l6.61-.74z" },
    { key: "progress", label: "Progression", icon: "M3 17 9 11l4 4 8-8" },
    { key: "shop", label: "Boutique", icon: "M6 6h15l-1.5 9h-12zM6 6 5 3H2m4 17a1 1 0 1 0 0-2 1 1 0 0 0 0 2m11 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2" },
  ];
  return (
    <nav className="border-t border-border bg-background px-3 pt-2 pb-3 flex justify-around">
      {items.map(i => {
        const active = current === i.key;
        return (
          <button
            key={i.key}
            onClick={() => onNav(i.key)}
            className="flex flex-col items-center gap-1 px-3 py-1 min-w-0"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={`w-5 h-5 ${active ? "text-primary" : "text-muted-foreground"}`}>
              <path d={i.icon} />
            </svg>
            <span className={`text-[10px] font-medium ${active ? "text-primary" : "text-muted-foreground"}`}>{i.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export function Tag({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-surface px-3 py-1 text-[11px] font-medium text-ink-soft capitalize">{children}</span>;
}

export function RadarChart({ scores }: { scores: { perf: number; end: number; adv: number; ctrl: number } }) {
  const size = 180;
  const cx = size / 2, cy = size / 2, r = 70;
  const angles = [-90, 0, 90, 180].map(a => (a * Math.PI) / 180);
  const vals = [scores.perf, scores.end, scores.adv, scores.ctrl];
  const points = vals.map((v, i) => {
    const rr = (v / 100) * r;
    return [cx + rr * Math.cos(angles[i]), cy + rr * Math.sin(angles[i])];
  });
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ") + " Z";
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-44">
      {[0.33, 0.66, 1].map(t => (
        <polygon
          key={t}
          points={angles.map(a => `${cx + r * t * Math.cos(a)},${cy + r * t * Math.sin(a)}`).join(" ")}
          fill="none" stroke="white" strokeOpacity={0.15} strokeWidth={1}
        />
      ))}
      {angles.map((a, i) => (
        <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(a)} y2={cy + r * Math.sin(a)} stroke="white" strokeOpacity={0.1} />
      ))}
      <path d={path} fill="oklch(0.89 0.18 95 / 0.4)" stroke="oklch(0.89 0.18 95)" strokeWidth={2} />
      {points.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={3} fill="oklch(0.89 0.18 95)" />
      ))}
    </svg>
  );
}

export function PodiumItem({ rank, name, km, h, gold }: { rank: number; name: string; km: number; h: string; gold?: boolean }) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-2 w-12 h-12 rounded-full bg-surface grid place-items-center font-bold">{name[0]}</div>
      <div className="text-[11px] font-semibold">{name}</div>
      <div className="text-[10px] text-muted-foreground">{km} km</div>
      <div className={`${h} mt-2 rounded-t-xl ${gold ? "bg-michelin-yellow" : "bg-surface"} flex items-start justify-center pt-2 font-black`}>{rank}</div>
    </div>
  );
}
