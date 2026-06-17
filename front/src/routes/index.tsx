import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import type { ScreenKey, Answers } from "../types/index";
import { deriveArchetype } from "../lib/app-utils";
import { TIRES } from "../data/index";
import { BottomNav } from "../lib/shared-components";

import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { Quiz } from "../pages/Quiz";
import { Result } from "../pages/Result";
import { Reco } from "../pages/Reco";
import { Challenge } from "../pages/Challenge";
import { Progress } from "../pages/Progress";
import { Leaderboard } from "../pages/Leaderboard";
import { Reward } from "../pages/Reward";
import { Recommendation } from "../pages/Recommendation";
import { Confirm } from "../pages/Confirm";
import { CheckoutInfosScreen } from "../pages/CheckoutInfosScreen";
import { CheckoutPaymentScreen } from "../pages/CheckoutPaymentScreen";
import { Shop } from "../pages/Shop";
import { Account } from "../pages/Account";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Michelin Ride DNA Challenge" },
      {
        name: "description",
        content:
          "Découvrez votre Ride DNA et trouvez le pneu Michelin parfaitement adapté à votre style de cyclisme.",
      },
      { property: "og:title", content: "Michelin Ride DNA Challenge" },
      {
        property: "og:description",
        content:
          "Quiz, challenges Strava et recommandations Michelin personnalisées.",
      },
    ],
  }),
  component: App,
});

export function App() {
  const [screen, setScreen] = useState<ScreenKey>("home");
  const [answers, setAnswers] = useState<Answers>({});
  const [selectedTireId, setSelectedTireId] = useState<string>(TIRES[0].id);
  const [authed, setAuthed] = useState(false);
  const [stravaLinked, setStravaLinked] = useState(false);
  const [challengeJoined, setChallengeJoined] = useState(false);
  const [recommendationPromo, setRecommendationPromo] = useState(false);
  const [loginRedirect, setLoginRedirect] = useState<ScreenKey>("home");

  const archetype = useMemo(() => deriveArchetype(answers), [answers]);
  const selectedTire = TIRES.find((t) => t.id === selectedTireId) ?? TIRES[0];

    const [orders, setOrders] = useState<
      { id: string; date: string; tire: string; price: number }[]
    >([]);
    
  useEffect(() => {
    if (screen === "result" || screen === "reco") {
      const id =
        answers.bike === "gravel"
          ? "power-gravel"
          : answers.bike === "vtt"
          ? "wild-enduro"
          : answers.bike === "urbain"
          ? "protek-urban"
          : "power-cup";
      setSelectedTireId(id);
    }
  }, [screen, answers.bike]);

  return (
    <div className="min-h-dvh w-full flex justify-center bg-surface-2">
      <div className="w-full max-w-md bg-background flex flex-col shadow-[var(--shadow-elevated)] border-x border-border">
        <div className="flex-1 scroll-area">

          {/* HOME */}
          {screen === "home" && (
            <Home
              onStart={() => setScreen("quiz")}
              onLogin={() => {
                setLoginRedirect("home");
                setScreen("login");
              }}
              authed={authed}
            />
          )}

          {/* LOGIN */}
          {screen === "login" && (
            <Login
              onBack={() => setScreen("home")}
              onSkip={() => setScreen(loginRedirect)}
              onDone={() => {
                setAuthed(true);
                setScreen(loginRedirect);
              }}
              onSwitch={() => setScreen("register")}
            />
          )}

          {/* REGISTER */}
          {screen === "register" && (
            <Register
              onBack={() => setScreen("login")}
              onDone={() => {
                setAuthed(true);
                setScreen(loginRedirect);
              }}
              onSwitch={() => setScreen("login")}
            />
          )}

          {/* QUIZ */}
          {screen === "quiz" && (
            <Quiz
              onDone={(a) => {
                setAnswers(a);
                setScreen("result");
              }}
              onBack={() => setScreen("home")}
            />
          )}

          {/* RESULT */}
          {screen === "result" && (
            <Result
              archetype={archetype}
              answers={answers}
              onNext={() => setScreen("reco")}
            />
          )}

          {/* RECO */}
          {screen === "reco" && (
            <Reco
              tire={selectedTire}
              onSelect={setSelectedTireId}
              selectedId={selectedTireId}
              archetype={archetype}
              onJoin={() => setScreen("challenge")}
              onSkipBuy={() => setScreen("recommendation")}
            />
          )}

          {/* CHALLENGE */}
          {screen === "challenge" && (
            <Challenge
              authed={authed}
              stravaLinked={stravaLinked}
              onLink={() => {
                setAuthed(true);
                setStravaLinked(true);
              }}
              onJoin={() => {
                setChallengeJoined(true);
                setScreen("progress");
              }}
              onBack={() => setScreen("reco")}
            />
          )}

          {/* PROGRESS */}
          {screen === "progress" && (
            <Progress
              onLeaderboard={() => setScreen("leaderboard")}
              onReward={() => setScreen("reward")}
            />
          )}

          {/* LEADERBOARD */}
          {screen === "leaderboard" && (
            <Leaderboard onBack={() => setScreen("progress")} />
          )}

          {/* REWARD */}
          {screen === "reward" && (
            <Reward
              onSee={() => {
                setRecommendationPromo(true);
                setScreen("recommendation");
              }}
            />
          )}

          {/* RECOMMENDATION */}
          {screen === "recommendation" && (
            <Recommendation
              tire={selectedTire}
              promoActive={recommendationPromo || challengeJoined}
              onActivatePromo={() => {
                setScreen("challenge");
              }}
              onBuy={() => {
                if (!authed) {
                  setLoginRedirect("checkoutInfos");
                  setScreen("login");
                } else {
                  setScreen("checkoutInfos");
                }
              }}
            />
          )}

          {/* SHOP */}
          {screen === "shop" && (
            <Shop
              tire={selectedTire}
              promoActive={recommendationPromo || challengeJoined}
              onActivatePromo={() => setScreen("challenge")}
              onSelect={(id) => setSelectedTireId(id)}
              onBuy={() => {
                if (!authed) {
                  setLoginRedirect("checkoutInfos");
                  setScreen("login");
                } else {
                  setScreen("checkoutInfos");
                }
              }}
            />
          )}


          {/* CHECKOUT INFOS */}
          {screen === "checkoutInfos" && (
            <CheckoutInfosScreen
              onContinue={() => setScreen("checkoutPayment")}
              onBack={() => setScreen("recommendation")}
            />
          )}

          {/* CHECKOUT PAYMENT */}
          {screen === "checkoutPayment" && (
            <CheckoutPaymentScreen
              onPay={() => {
                setOrders((prev) => [
                  ...prev,
                  {
                    id: crypto.randomUUID(),
                    date: new Date().toLocaleDateString("fr-FR"),
                    tire: selectedTire.name,
                    price: selectedTire.price,
                  },
                ]);
                setScreen("confirm");
              }}

              onBack={() => setScreen("checkoutInfos")}
            />
          )}

          {/* CONFIRM */}
          {screen === "confirm" && (
            <Confirm
              onRestart={() => setScreen("progress")}
              onAccount={() => setScreen("account")}
            />
          )}

          {/* ACCOUNT */}
          {screen === "account" && (
            <Account
              onBack={() => setScreen("home")}
              orders={orders}
            />
          )}


        </div>

        {/* BOTTOM NAV */}
        {!["home", "login", "register", "quiz"].includes(screen) && (
          <BottomNav current={screen} onNav={setScreen} />
        )}
      </div>
    </div>
  );
}
