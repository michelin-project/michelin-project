import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import type { ScreenKey, Answers } from "../types/index";
import { deriveArchetype } from "../lib/app-utils";
import { TIRES } from "../data/index";
import { BottomNav } from "../lib/shared-components";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { Quiz } from "../pages/Quiz";
import { Result } from "../pages/Result";
import { Reco } from "../pages/Reco";
import { Challenge } from "../pages/Challenge";
import { Progress } from "../pages/Progress";
import { Leaderboard } from "../pages/Leaderboard";
import { Reward } from "../pages/Reward";
import { Shop } from "../pages/Shop";
import { Confirm } from "../pages/Confirm";
import { CheckoutInfosScreen } from "../pages/CheckoutInfosScreen";
import { CheckoutPaymentScreen } from "../pages/CheckoutPaymentScreen";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Michelin Ride DNA Challenge" },
      { name: "description", content: "Découvrez votre Ride DNA et trouvez le pneu Michelin parfaitement adapté à votre style de cyclisme." },
      { property: "og:title", content: "Michelin Ride DNA Challenge" },
      { property: "og:description", content: "Quiz, challenges Strava et recommandations Michelin personnalisées." },
    ],
  }),
  component: App,
});

type ScreenKey =
  | "home" | "login" | "quiz" | "result" | "reco"
  | "challenge" | "progress" | "leaderboard"
  | "reward" | "shop" | "confirm";

type Answers = {
  bike?: "route" | "gravel" | "vtt" | "urbain";
  priority?: "vitesse" | "adherence" | "durabilite" | "confort";
  weekly?: 50 | 100 | 200 | 300;
  terrain?: "asphalte" | "mixte" | "sentiers" | "ville";
};

type Tire = {
  id: string;
  name: string;
  family: string;
  match: number;
  price: number;
  image: string;
  highlights: { label: string; value: number }[];
  why: string;
  tag: string;
};

const TIRES: Tire[] = [
  {
    id: "power-cup",
    name: "Power Cup",
    family: "Route — Performance",
    match: 96,
    price: 64.9,
    image: tirePower,
    highlights: [
      { label: "Vitesse", value: 95 },
      { label: "Adhérence", value: 88 },
      { label: "Durabilité", value: 72 },
    ],
    why: "Composé Gum-X et carcasse 4×120 TPI : un rendement de course taillé pour vos sorties rapides sur route sèche.",
    tag: "Le Performeur",
  },
  {
    id: "power-gravel",
    name: "Power Gravel",
    family: "Gravel — Polyvalence",
    match: 91,
    price: 58.0,
    image: tireGravel,
    highlights: [
      { label: "Adhérence", value: 92 },
      { label: "Confort", value: 86 },
      { label: "Durabilité", value: 81 },
    ],
    why: "Crampons bas-profil et flancs renforcés : la confiance sur le mixte, le rendement sur l'asphalte.",
    tag: "L’Explorateur",
  },
  {
    id: "wild-enduro",
    name: "Wild Enduro",
    family: "VTT — Aventure",
    match: 88,
    price: 72.0,
    image: tireMtb,
    highlights: [
      { label: "Grip", value: 96 },
      { label: "Robustesse", value: 92 },
      { label: "Contrôle", value: 90 },
    ],
    why: "Carcasse Gravity Shield et crampons agressifs : maîtrise totale en descente technique.",
    tag: "Aventurier",
  },
  {
    id: "protek-urban",
    name: "Protek Urban",
    family: "Urbain — Confort",
    match: 84,
    price: 39.0,
    image: tireUrban,
    highlights: [
      { label: "Anti-crevaison", value: 94 },
      { label: "Confort", value: 90 },
      { label: "Durabilité", value: 92 },
    ],
    why: "Renfort Protek et bande réfléchissante : sérénité quotidienne en ville, par tous les temps.",
    tag: "Le Cycliste Contrôle",
  },
];

const RETAILERS = [
  { name: "Alltricks", delivery: "Livraison 24h", note: "Stock dispo" },
  { name: "Bike24", delivery: "2-4 jours", note: "Best price" },
  { name: "Mantel", delivery: "3-5 jours", note: "Premium" },
];

export function App() {
  const [screen, setScreen] = useState<ScreenKey>("home");
  const [answers, setAnswers] = useState<Answers>({});
  const [selectedTireId, setSelectedTireId] = useState<string>(TIRES[0].id);
  const [authed, setAuthed] = useState(false);
  const [stravaLinked, setStravaLinked] = useState(false);
  const [challengeJoined, setChallengeJoined] = useState(false);
  const [shopPromo, setShopPromo] = useState(false);
  const [loginRedirect, setLoginRedirect] = useState<ScreenKey>("home");

  const archetype = useMemo(() => deriveArchetype(answers), [answers]);
  const selectedTire = TIRES.find(t => t.id === selectedTireId) ?? TIRES[0];

  useEffect(() => {
    if (screen === "result" || screen === "reco") {
      const id =
        answers.bike === "gravel" ? "power-gravel" :
        answers.bike === "vtt" ? "wild-enduro" :
        answers.bike === "urbain" ? "protek-urban" : "power-cup";
      setSelectedTireId(id);
    }
  }, [screen, answers.bike]);

  return (
    <div className="min-h-dvh w-full flex justify-center bg-surface-2">
      <div className="w-full max-w-md bg-background flex flex-col shadow-[var(--shadow-elevated)] border-x border-border">
        <div className="flex-1 scroll-area">
          {screen === "home" && <Home onStart={() => setScreen("quiz")} onLogin={() => { setLoginRedirect("home"); setScreen("login"); }} authed={authed} />}
          {screen === "login" && <Login onBack={() => setScreen("home")} onSkip={() => setScreen(loginRedirect)} onDone={() => { setAuthed(true); setScreen(loginRedirect); }} />}
          {screen === "quiz" && <Quiz onDone={(a) => { setAnswers(a); if (authed) { setScreen("result"); } else { setLoginRedirect("result"); setScreen("login"); } }} onBack={() => setScreen("home")} />}
          {screen === "result" && <Result archetype={archetype} answers={answers} onNext={() => setScreen("reco")} />}
          {screen === "reco" && (
            <Reco
              tire={selectedTire}
              onSelect={setSelectedTireId}
              selectedId={selectedTireId}
              archetype={archetype}
              onJoin={() => setScreen("challenge")}
              onSkipBuy={() => setScreen("shop")}
            />
          )}
          {screen === "challenge" && (
            <Challenge
              authed={authed}
              stravaLinked={stravaLinked}
              onLink={() => { setAuthed(true); setStravaLinked(true); }}
              onJoin={() => { setChallengeJoined(true); setScreen("progress"); }}
              onBack={() => setScreen("reco")}
            />
          )}
          {screen === "progress" && (
            <Progress onLeaderboard={() => setScreen("leaderboard")} onReward={() => setScreen("reward")} />
          )}
          {screen === "leaderboard" && <Leaderboard onBack={() => setScreen("progress")} />}
          {screen === "reward" && <Reward onSee={() => { setShopPromo(true); setScreen("shop"); }} />}
          {screen === "shop" && (
            <Shop
              tire={selectedTire}
              promoActive={shopPromo || challengeJoined}
              onActivatePromo={() => { setScreen("challenge"); }}
              onBuy={() => setScreen("checkoutInfos")}
            />
          )}
          {screen === "checkoutInfos" && (
            <CheckoutInfosScreen
              onContinue={() => setScreen("checkoutPayment")}
              onBack={() => setScreen("shop")}
            />
          )}
          {screen === "checkoutPayment" && (
            <CheckoutPaymentScreen
              onPay={() => setScreen("confirm")}
              onBack={() => setScreen("checkoutInfos")}
            />
          )}
          {screen === "confirm" && <Confirm onRestart={() => setScreen("progress")} />}
        </div>
        {!["home", "login", "quiz"].includes(screen) && <BottomNav current={screen} onNav={setScreen} />}
      </div>
    </div>
  );
}

function BottomNav({ current, onNav }: { current: ScreenKey; onNav: (s: ScreenKey) => void }) {
  const items: { key: ScreenKey; label: string; icon: string }[] = [
    { key: "home", label: "Accueil", icon: "M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" },
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

function MichelinMark({ className = "" }: { className?: string }) {
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

function Home({ onStart, onLogin, authed }: { onStart: () => void; onLogin: () => void; authed: boolean }) {
  return (
    <div className="relative">
      <div className="relative h-[560px]">
        <img src={heroCyclist} alt="Cycliste en action" className="absolute inset-0 w-full h-full object-cover" width={896} height={1440} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-background" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-4">
          <MichelinMark className="text-white [&_.text-muted-foreground]:text-white/70 [&_.bg-primary]:bg-white [&_.text-primary-foreground]:text-primary" />
          <button
            onClick={onLogin}
            className="flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md border border-white/30 px-3.5 py-2 text-xs font-semibold text-white hover:bg-white/25 transition"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>
            {authed ? "Mon compte" : "Se connecter"}
          </button>
        </div>
      </div>

      <div className="-mt-40 relative px-6 pb-8 fade-up">
        <div className="inline-flex items-center gap-2 rounded-full bg-michelin-yellow px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-ink mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-ink" /> Nouveau · Saison 2025
        </div>
        <h1 className="text-[40px] leading-[1.02] font-black tracking-tight text-white drop-shadow-lg">
          Découvrez<br/>votre Ride DNA
        </h1>
        <p className="mt-4 text-white/90 text-[15px] leading-snug max-w-[300px] drop-shadow">
          Trouvez le pneu Michelin parfaitement adapté à votre style de cyclisme.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={onStart}
            className="group w-full h-14 rounded-2xl bg-primary text-primary-foreground font-semibold text-[15px] tracking-tight shadow-[var(--shadow-elevated)] hover:translate-y-[-1px] transition flex items-center justify-center gap-2"
          >
            Commencer l’analyse
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="w-4 h-4 transition-transform group-hover:translate-x-0.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </button>
          <p className="text-center text-[11px] text-muted-foreground">
            Sans création de compte · 30 secondes
          </p>
        </div>
      </div>
    </div>
  );
}

function Login({ onBack, onSkip, onDone }: { onBack: () => void; onSkip: () => void; onDone: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const res = await fetch(`http://localhost:3000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Une erreur est survenue");
      }

      const data = await res.json();
      // Stocker le jeton de sécurité localement
      if (data.access_token) {
        localStorage.setItem("michelin_token", data.access_token);
      }
      onDone();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 pt-4 pb-10">
      <button type="button" onClick={onBack} className="text-sm text-muted-foreground mb-6 flex items-center gap-1.5">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M15 18l-6-6 6-6"/></svg>
        Retour
      </button>
      <MichelinMark />
      <h1 className="mt-8 text-3xl font-black tracking-tight">{isLogin ? "Connexion" : "Inscription"}</h1>
      <p className="mt-2 text-sm text-muted-foreground">La création de compte est optionnelle. Elle est requise pour rejoindre les challenges Strava.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-3">
        {error && (
          <div className="p-3 text-[13px] font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-xl">
            {error}
          </div>
        )}
        <label className="block">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Email</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.fr" className="mt-1 w-full h-12 rounded-xl border border-border bg-surface px-4 text-sm focus:outline-none focus:border-primary" />
        </label>
        <label className="block">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Mot de passe</span>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="mt-1 w-full h-12 rounded-xl border border-border bg-surface px-4 text-sm focus:outline-none focus:border-primary" />
        </label>
        <button type="submit" disabled={loading} className="w-full mt-3 h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-50">
          {loading ? "Chargement..." : (isLogin ? "Se connecter" : "S'inscrire")}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button type="button" onClick={() => { setIsLogin(!isLogin); setError(""); }} className="text-sm text-primary font-medium">
          {isLogin ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
        </button>
      </div>

      <div className="my-6 flex items-center gap-3 text-[11px] uppercase tracking-wider text-muted-foreground">
        <span className="flex-1 h-px bg-border" />ou<span className="flex-1 h-px bg-border" />
      </div>

      <div className="space-y-2">
        <button type="button" onClick={onDone} className="w-full h-12 rounded-xl border border-border bg-background font-medium text-sm flex items-center justify-center gap-2">
          <span className="w-4 h-4 rounded-sm bg-[oklch(0.65_0.18_30)]" /> Continuer avec Apple
        </button>
        <button type="button" onClick={onDone} className="w-full h-12 rounded-xl bg-[#FC4C02] text-white font-semibold text-sm flex items-center justify-center gap-2">
          Connecter avec Strava
        </button>
      </div>

      <button type="button" onClick={onSkip} className="block mx-auto mt-8 text-sm text-primary font-medium">
        Continuer sans compte
      </button>
    </div>
  );
}

const QUIZ_STEPS = [
  {
    key: "bike" as const,
    title: "Quel est votre vélo ?",
    sub: "Sélectionnez votre monture principale",
    options: [
      { v: "route", label: "Route", icon: "🚴" },
      { v: "gravel", label: "Gravel", icon: "🪨" },
      { v: "vtt", label: "VTT", icon: "⛰️" },
      { v: "urbain", label: "Urbain", icon: "🏙️" },
    ],
  },
  {
    key: "priority" as const,
    title: "Votre priorité ?",
    sub: "Ce qui compte le plus à vos yeux",
    options: [
      { v: "vitesse", label: "Vitesse", icon: "⚡" },
      { v: "adherence", label: "Adhérence", icon: "🎯" },
      { v: "durabilite", label: "Durabilité", icon: "🛡️" },
      { v: "confort", label: "Confort", icon: "☁️" },
    ],
  },
  {
    key: "weekly" as const,
    title: "Kilométrage hebdo ?",
    sub: "Votre volume moyen par semaine",
    options: [
      { v: 50, label: "< 50 km", icon: "🌱" },
      { v: 100, label: "50–100 km", icon: "🔥" },
      { v: 200, label: "100–200 km", icon: "💪" },
      { v: 300, label: "200 km +", icon: "🚀" },
    ],
  },
  {
    key: "terrain" as const,
    title: "Type de terrain ?",
    sub: "Où roulez-vous le plus souvent",
    options: [
      { v: "asphalte", label: "Asphalte", icon: "🛣️" },
      { v: "mixte", label: "Mixte", icon: "🌍" },
      { v: "sentiers", label: "Sentiers", icon: "🌲" },
      { v: "ville", label: "Ville", icon: "🏙️" },
    ],
  },
];

function Quiz({ onDone, onBack }: { onDone: (a: Answers) => void; onBack: () => void }) {
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Answers>({});
  const current = QUIZ_STEPS[step];

  function pick(v: any) {
    const next: Answers = { ...a, [current.key]: v };
    setA(next);
    setTimeout(() => {
      if (step === QUIZ_STEPS.length - 1) onDone(next);
      else setStep(step + 1);
    }, 180);
  }

  return (
    <div className="px-6 pt-4 pb-10 min-h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => step === 0 ? onBack() : setStep(step - 1)} className="w-9 h-9 rounded-full bg-surface flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div className="text-[11px] font-semibold text-muted-foreground tracking-wider uppercase">
          Étape {step + 1} / {QUIZ_STEPS.length}
        </div>
        <div className="w-9" />
      </div>

      <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden mb-10">
        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${((step + 1) / QUIZ_STEPS.length) * 100}%` }} />
      </div>

      <div key={step} className="fade-up flex-1 flex flex-col">
        <h2 className="text-[28px] font-black leading-tight tracking-tight">{current.title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{current.sub}</p>

        <div className="mt-8 grid grid-cols-2 gap-3">
          {current.options.map((o: any) => {
            const active = (a as any)[current.key] === o.v;
            return (
              <button
                key={String(o.v)}
                onClick={() => pick(o.v)}
                className={`aspect-square rounded-2xl border text-left p-4 flex flex-col justify-between transition
                  ${active ? "bg-primary text-primary-foreground border-primary shadow-[var(--shadow-elevated)]" : "bg-surface border-border hover:border-primary/40"}`}
              >
                <div className="text-3xl">{o.icon}</div>
                <div className="font-semibold text-[15px] tracking-tight">{o.label}</div>
              </button>
            );
          })}
        </div>

        <div className="mt-auto pt-8 text-center text-[11px] text-muted-foreground">
          Sélectionnez pour continuer · ⏱ 30 sec
        </div>
      </div>
    </div>
  );
}

/* ---------- Result ---------- */

function deriveArchetype(a: Answers) {
  const name =
    a.priority === "vitesse" ? "Le Performeur" :
    a.priority === "adherence" ? "L’Aventurier" :
    a.priority === "durabilite" ? "Le Rouleur Endurant" :
    a.priority === "confort" ? "Le Cycliste Contrôle" :
    "Le Performeur";

  const base = {
    "Le Performeur": { perf: 92, end: 70, adv: 50, ctrl: 65 },
    "L’Aventurier": { perf: 65, end: 78, adv: 94, ctrl: 72 },
    "Le Rouleur Endurant": { perf: 70, end: 95, adv: 60, ctrl: 75 },
    "Le Cycliste Contrôle": { perf: 60, end: 70, adv: 55, ctrl: 92 },
  }[name]!;

  const tagline =
    name === "Le Performeur" ? "Vitesse pure, ligne droite, watts maîtrisés." :
    name === "L’Aventurier" ? "Hors des sentiers battus, là où l’asphalte s’efface." :
    name === "Le Rouleur Endurant" ? "Des kilomètres réguliers, une cadence sereine." :
    "Maîtrise totale, fiabilité au quotidien.";

  return { name, scores: base, tagline };
}

function Result({ archetype, onNext, answers }: { archetype: ReturnType<typeof deriveArchetype>; onNext: () => void; answers: Answers }) {
  const scores = [
    { k: "Performance", v: archetype.scores.perf },
    { k: "Endurance", v: archetype.scores.end },
    { k: "Aventure", v: archetype.scores.adv },
    { k: "Contrôle", v: archetype.scores.ctrl },
  ];
  return (
    <div className="px-6 pt-6 pb-10">
      <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Votre Ride DNA</div>
      <h1 className="mt-2 text-[34px] leading-[1.05] font-black tracking-tight">
        {archetype.name}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{archetype.tagline}</p>

      <div className="mt-6 rounded-3xl p-6 text-white relative overflow-hidden shadow-[var(--shadow-elevated)]" style={{ background: "var(--gradient-blue)" }}>
        <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-michelin-yellow/20 blur-2xl" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.2em] opacity-80">Profil</span>
            <span className="text-[10px] uppercase tracking-[0.2em] opacity-80">2025</span>
          </div>
          <div className="mt-6">
            <RadarChart scores={archetype.scores} />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {scores.map(s => (
              <div key={s.k}>
                <div className="flex items-end justify-between">
                  <span className="text-[11px] uppercase tracking-wider opacity-80">{s.k}</span>
                  <span className="text-sm font-bold">{s.v}</span>
                </div>
                <div className="mt-1 h-1 rounded-full bg-white/15 overflow-hidden">
                  <div className="h-full bg-michelin-yellow" style={{ width: `${s.v}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-border p-4">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Votre profil en bref</div>
        <div className="flex flex-wrap gap-2">
          {answers.bike && <Tag>Vélo · {answers.bike}</Tag>}
          {answers.priority && <Tag>Priorité · {answers.priority}</Tag>}
          {answers.weekly && <Tag>~{answers.weekly} km/sem</Tag>}
          {answers.terrain && <Tag>Terrain · {answers.terrain}</Tag>}
        </div>
      </div>

      <button onClick={onNext} className="mt-8 w-full h-14 rounded-2xl bg-primary text-primary-foreground font-semibold text-[15px] shadow-[var(--shadow-elevated)] flex items-center justify-center gap-2">
        Voir mon pneu Michelin
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="w-4 h-4"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </button>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-surface px-3 py-1 text-[11px] font-medium text-ink-soft capitalize">{children}</span>;
}

function RadarChart({ scores }: { scores: { perf: number; end: number; adv: number; ctrl: number } }) {
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

/* ---------- Reco ---------- */

function Reco({
  tire, onSelect, selectedId, archetype, onJoin, onSkipBuy,
}: {
  tire: Tire; onSelect: (id: string) => void; selectedId: string; archetype: ReturnType<typeof deriveArchetype>;
  onJoin: () => void; onSkipBuy: () => void;
}) {
  return (
    <div className="pb-10">
      <div className="px-6 pt-6">
        <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Recommandation</div>
        <h1 className="mt-1 text-[26px] font-black tracking-tight leading-tight">
          Le pneu fait pour <span className="text-primary">{archetype.name}</span>
        </h1>
      </div>

      <div className="mt-5 mx-4 rounded-3xl bg-gradient-to-b from-surface to-background border border-border overflow-hidden shadow-[var(--shadow-card)]">
        <div className="relative h-56 bg-surface flex items-center justify-center">
          <img src={tire.image} alt={tire.name} className="h-full w-auto object-contain" width={1024} height={1024} loading="lazy" />
          <div className="absolute top-4 left-4 rounded-full bg-michelin-yellow px-3 py-1 text-[11px] font-bold tracking-tight text-ink">
            {tire.match}% match
          </div>
          <div className="absolute top-4 right-4 rounded-full bg-background/80 backdrop-blur px-3 py-1 text-[11px] font-semibold text-ink border border-border">
            MICHELIN
          </div>
        </div>
        <div className="p-5">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{tire.family}</div>
          <div className="flex items-baseline justify-between mt-1">
            <div className="text-2xl font-black tracking-tight">{tire.name}</div>
            <div className="text-base font-semibold">{tire.price.toFixed(2)} €</div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {tire.highlights.map(h => (
              <div key={h.label} className="rounded-xl bg-surface p-3">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{h.label}</div>
                <div className="mt-2 flex items-end gap-1">
                  <div className="text-lg font-bold leading-none">{h.value}</div>
                  <div className="text-[10px] text-muted-foreground mb-0.5">/100</div>
                </div>
                <div className="mt-2 h-1 rounded-full bg-border overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${h.value}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl bg-surface p-4 border border-border">
            <div className="text-[11px] uppercase tracking-wider text-primary font-bold">Pourquoi ce pneu</div>
            <p className="mt-1.5 text-sm leading-snug text-ink-soft">{tire.why}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 px-6">
        <div className="flex items-baseline justify-between">
          <h3 className="text-[13px] font-bold uppercase tracking-wider">Autres pneus compatibles</h3>
          <span className="text-[11px] text-muted-foreground">{TIRES.length} modèles</span>
        </div>
      </div>

      <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar px-6 pb-1 snap-x snap-mandatory">
        {TIRES.map(t => {
          const active = selectedId === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onSelect(t.id)}
              className={`snap-start shrink-0 w-44 rounded-2xl border text-left overflow-hidden transition
                ${active ? "border-primary shadow-[var(--shadow-card)]" : "border-border bg-background"}`}
            >
              <div className="h-28 bg-surface flex items-center justify-center">
                <img src={t.image} alt={t.name} className="h-24 w-auto object-contain" width={1024} height={1024} loading="lazy" />
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-bold text-primary">{t.match}%</div>
                  <div className="text-[11px] font-semibold">{t.price.toFixed(0)} €</div>
                </div>
                <div className="mt-1 font-bold text-sm tracking-tight">{t.name}</div>
                <div className="text-[10px] text-muted-foreground truncate">{t.family}</div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="px-6 mt-6 space-y-3">
        <button onClick={onJoin} className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-semibold text-[15px] shadow-[var(--shadow-elevated)] flex items-center justify-center gap-2">
          Rejoindre le challenge — débloquer −15%
        </button>
        <button onClick={onSkipBuy} className="w-full h-12 rounded-2xl bg-background border border-border font-medium text-sm">
          Acheter au prix affiché
        </button>
      </div>
    </div>
  );
}

/* ---------- Challenge ---------- */

function Challenge({
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

/* ---------- Progress ---------- */

function Progress({ onLeaderboard, onReward }: { onLeaderboard: () => void; onReward: () => void }) {
  return (
    <div className="px-6 pt-6 pb-10">
      <div className="flex items-baseline justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Cette semaine</div>
          <h1 className="text-[30px] font-black tracking-tight leading-tight">Bonne cadence 💪</h1>
        </div>
        <button onClick={onLeaderboard} className="text-xs font-semibold text-primary">Classement →</button>
      </div>

      <div className="mt-5 rounded-3xl p-6 text-white relative overflow-hidden shadow-[var(--shadow-elevated)]" style={{ background: "var(--gradient-blue)" }}>
        <div className="text-[11px] uppercase tracking-wider opacity-80">Distance cette semaine</div>
        <div className="mt-1 flex items-end gap-2">
          <div className="text-6xl font-black tracking-tight">127</div>
          <div className="pb-2 text-sm opacity-80">km</div>
        </div>
        <div className="mt-4 flex gap-1.5 h-16 items-end">
          {[40, 65, 50, 80, 92, 60, 70].map((v, i) => (
            <div key={i} className="flex-1 rounded-md bg-white/20 relative overflow-hidden">
              <div className="absolute inset-x-0 bottom-0 bg-michelin-yellow rounded-md" style={{ height: `${v}%` }} />
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[10px] opacity-70">
          {["L","M","M","J","V","S","D"].map((d, i) => <span key={i}>{d}</span>)}
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-border p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Challenge 200 km</div>
            <div className="text-xl font-black tracking-tight mt-0.5">142 / 200 km</div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-muted-foreground">Reste</div>
            <div className="font-bold">58 km</div>
          </div>
        </div>
        <div className="mt-3 h-2 rounded-full bg-surface overflow-hidden">
          <div className="h-full bg-primary" style={{ width: "71%" }} />
        </div>
        <button onClick={onReward} className="mt-4 w-full h-11 rounded-xl bg-michelin-yellow text-ink font-semibold text-sm">
          Simuler 200 km atteints
        </button>
      </div>

      <div className="mt-6">
        <h3 className="text-[13px] font-bold uppercase tracking-wider mb-3">Badges débloqués</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { e: "🔥", t: "Streak 7j" },
            { e: "🏔️", t: "Grimpeur" },
            { e: "⚡", t: "Sprint +35" },
          ].map(b => (
            <div key={b.t} className="rounded-2xl bg-surface p-4 text-center">
              <div className="text-3xl">{b.e}</div>
              <div className="mt-1 text-[11px] font-semibold">{b.t}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border p-4 bg-surface">
        <div className="text-sm leading-snug">
          <span className="font-bold">Allez Marc, </span>
          encore 2 sorties pour décrocher votre coupon <span className="font-bold text-primary">−15%</span> sur Michelin Power Cup.
        </div>
      </div>
    </div>
  );
}

/* ---------- Leaderboard ---------- */

function Leaderboard({ onBack }: { onBack: () => void }) {
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

function PodiumItem({ rank, name, km, h, gold }: { rank: number; name: string; km: number; h: string; gold?: boolean }) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-2 w-12 h-12 rounded-full bg-surface grid place-items-center font-bold">{name[0]}</div>
      <div className="text-[11px] font-semibold">{name}</div>
      <div className="text-[10px] text-muted-foreground">{km} km</div>
      <div className={`${h} mt-2 rounded-t-xl ${gold ? "bg-michelin-yellow" : "bg-surface"} flex items-start justify-center pt-2 font-black`}>{rank}</div>
    </div>
  );
}

/* ---------- Reward ---------- */

function Reward({ onSee }: { onSee: () => void }) {
  const [secs, setSecs] = useState(48 * 3600);
  useEffect(() => {
    const t = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = Math.floor(secs / 3600).toString().padStart(2, "0");
  const m = Math.floor((secs % 3600) / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");

  const colors = ["#0055A4", "#FFD100", "#ffffff", "#ff5d5d"];
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 0.6,
    duration: 2 + Math.random() * 1.5,
    color: colors[i % colors.length],
    rot: Math.random() * 360,
  }));

  return (
    <div className="relative px-6 pt-10 pb-10 min-h-full">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {pieces.map((p, i) => (
          <span
            key={i}
            className="confetti-piece"
            style={{
              left: `${p.left}%`,
              background: p.color,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              transform: `rotate(${p.rot}deg)`,
            }}
          />
        ))}
      </div>

      <div className="relative text-center">
        <div className="relative mx-auto w-32 h-32 grid place-items-center">
          <span className="absolute inset-0 rounded-full bg-michelin-yellow/30 pulse-ring" />
          <span className="absolute inset-3 rounded-full bg-michelin-yellow/40 pulse-ring" style={{ animationDelay: "0.4s" }} />
          <div className="w-24 h-24 rounded-full bg-michelin-yellow grid place-items-center text-4xl font-black text-ink shadow-[var(--shadow-elevated)]">
            %
          </div>
        </div>
        <div className="mt-6 text-[11px] uppercase tracking-[0.2em] font-bold text-primary">Récompense débloquée</div>
        <h1 className="mt-2 text-[34px] font-black leading-tight tracking-tight">Félicitations !</h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-[280px] mx-auto">
          Vous avez débloqué <span className="text-ink font-bold">−15%</span> sur les pneus Michelin Power Cup.
        </p>

        <div className="mt-6 inline-flex gap-2 rounded-2xl bg-ink text-white px-5 py-4">
          {[["HRS", h], ["MIN", m], ["SEC", s]].map(([k, v]) => (
            <div key={k} className="text-center min-w-[44px]">
              <div className="text-2xl font-black tracking-tight tabular-nums">{v}</div>
              <div className="text-[10px] opacity-70 tracking-wider">{k}</div>
            </div>
          ))}
        </div>
        <div className="mt-2 text-[11px] text-muted-foreground">Offre valable 48h</div>

        <button onClick={onSee} className="mt-8 w-full h-14 rounded-2xl bg-primary text-primary-foreground font-semibold text-[15px] shadow-[var(--shadow-elevated)]">
          Voir mon offre
        </button>
      </div>
    </div>
  );
}

/* ---------- Shop ---------- */

function Shop({
  tire, promoActive, onActivatePromo, onBuy,
}: { tire: Tire; promoActive: boolean; onActivatePromo: () => void; onBuy: () => void }) {
  const discount = promoActive ? 0.15 : 0;
  const finalPrice = tire.price * (1 - discount);

  return (
    <div className="pb-10">
      <div className="px-6 pt-6">
        <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Boutique</div>
        <h1 className="mt-1 text-[28px] font-black tracking-tight">Acheter en 1 clic</h1>
      </div>

      <div className="mt-5 mx-4 rounded-3xl border border-border overflow-hidden">
        <div className="h-48 bg-surface flex items-center justify-center">
          <img src={tire.image} alt={tire.name} className="h-full w-auto object-contain" width={1024} height={1024} loading="lazy" />
        </div>
        <div className="p-5">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{tire.family}</div>
          <div className="font-black text-xl tracking-tight mt-0.5">Michelin {tire.name}</div>

          <div className="mt-4 flex items-end gap-3">
            <div className="text-3xl font-black tracking-tight">{finalPrice.toFixed(2)} €</div>
            {promoActive && (
              <>
                <div className="text-base text-muted-foreground line-through">{tire.price.toFixed(2)} €</div>
                <div className="rounded-full bg-michelin-yellow text-ink text-[11px] font-bold px-2 py-0.5">−15%</div>
              </>
            )}
          </div>
        </div>
      </div>

      {!promoActive && (
        <div className="mx-4 mt-4 rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground grid place-items-center font-black">%</div>
            <div className="flex-1">
              <div className="font-bold text-sm">Économisez 15% supplémentaires</div>
              <p className="mt-0.5 text-[12px] text-ink-soft leading-snug">
                Rejoignez le challenge Strava « 200 km en mai » et débloquez votre code promo Michelin.
              </p>
              <button onClick={onActivatePromo} className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold px-4 py-2">
                Rejoindre & débloquer −15%
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-4 mt-6">
        <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Choisissez votre revendeur</div>
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
                <div className="text-[11px] text-muted-foreground">{r.delivery} · {r.note}</div>
              </div>
              <div className="text-right">
                <div className="font-black text-sm">{finalPrice.toFixed(2)} €</div>
                <div className="text-[11px] text-primary font-semibold">Acheter →</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <button onClick={onBuy} className="mx-4 mt-6 w-[calc(100%-2rem)] h-14 rounded-2xl bg-primary text-primary-foreground font-semibold text-[15px] shadow-[var(--shadow-elevated)]">
        Acheter maintenant — {finalPrice.toFixed(2)} €
      </button>
      <p className="text-center text-[11px] text-muted-foreground mt-3 px-6">
        Paiement sécurisé via le revendeur. Garantie Michelin 2 ans.
      </p>
    </div>
  );
}

/* ---------- Confirm ---------- */

function Confirm({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="px-6 pt-10 pb-10 text-center">
      <div className="mx-auto w-20 h-20 rounded-full bg-primary text-primary-foreground grid place-items-center shadow-[var(--shadow-elevated)]">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="w-8 h-8"><path d="M5 12l5 5L20 7"/></svg>
      </div>
      <div className="mt-5 text-[11px] uppercase tracking-[0.2em] font-bold text-primary">Commande confirmée</div>
      <h1 className="mt-2 text-[30px] font-black tracking-tight leading-tight">À vous la route 🚴</h1>
      <p className="mt-3 text-sm text-muted-foreground max-w-[300px] mx-auto">
        Vos Michelin Power Cup arrivent sous 48h. Préparez votre vélo, le challenge continue.
      </p>

      <div className="mt-6 rounded-2xl border border-border text-left p-4 mx-auto">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Commande</span><span className="font-semibold">#MRD-48217</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-muted-foreground">Livraison</span><span className="font-semibold">2 jours · Alltricks</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-muted-foreground">Total</span><span className="font-bold">55,17 €</span>
        </div>
      </div>

      <div className="mt-6 rounded-3xl p-5 text-left text-white" style={{ background: "var(--gradient-blue)" }}>
        <div className="text-[11px] uppercase tracking-wider opacity-80 font-bold">Michelin Smart Follow-up</div>
        <div className="mt-1 text-lg font-black tracking-tight leading-snug">Suivez l’usure de vos pneus et gagnez +500 XP fidélité</div>
        <p className="mt-2 text-[12px] opacity-80">Conseils d’entretien, rappels intelligents, prochains challenges.</p>
        <button className="mt-4 w-full h-11 rounded-xl bg-michelin-yellow text-ink font-semibold text-sm">
          Activer le suivi intelligent
        </button>
      </div>

      <button onClick={onRestart} className="mt-6 w-full h-12 rounded-2xl bg-surface border border-border font-medium text-sm">
        Continuer mes challenges
      </button>
    </div>
  );
}
