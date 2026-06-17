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

function App() {
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
