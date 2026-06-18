import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import type { ScreenKey, Answers, Tire } from "../types/index";
import { deriveArchetype } from "../lib/app-utils";
import { BottomNav } from "../lib/shared-components";
import { TIRES, resolveTireImage } from "../data/index";
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
  const hasToken = typeof window !== "undefined" && !!localStorage.getItem("michelin_token");
  const [screen, setScreen] = useState<ScreenKey>(hasToken ? "progress" : "home");
  const [answers, setAnswers] = useState<Answers>({});
  const [selectedTireId, setSelectedTireId] = useState<string>(TIRES[0].id);
  const [recoResults, setRecoResults] = useState<Tire[]>([]);
  const [authed, setAuthed] = useState(hasToken);
  const [stravaLinked, setStravaLinked] = useState(false);
  const [challengeJoined, setChallengeJoined] = useState(false);
  const [recommendationPromo, setRecommendationPromo] = useState(false);
  const [loginRedirect, setLoginRedirect] = useState<ScreenKey>("progress");


  const [orders, setOrders] = useState<
      { id: string; date: string; tire: string; price: number }[]
    >([]);
    
  const archetype = useMemo(() => deriveArchetype(answers), [answers]);
  // Recommandations dynamiques : on interroge POST /recommendations dès que le
  // quiz est rempli. En cas d'échec (back indisponible) ou de réponse vide, on
  // retombe sur le catalogue statique `TIRES` (recoResults reste vide).
  useEffect(() => {
    if (!answers.bike) return;
    const controller = new AbortController();
    fetch("http://localhost:3000/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(answers),
      signal: controller.signal,
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`${r.status}`))))
      .then((data: Tire[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setRecoResults(
            data.map((t) => ({ ...t, image: resolveTireImage(t, answers.bike) })),
          );
          setSelectedTireId(data[0].id); // le 1er résultat = pneu mis en avant
        }
      })
      .catch(() => {
        /* fallback silencieux sur TIRES (ou AbortError au changement de quiz) */
      });
    return () => controller.abort();
  }, [answers]);

  const pool = recoResults.length > 0 ? recoResults : TIRES;
  const selectedTire = pool.find((t) => t.id === selectedTireId) ?? pool[0];
  const others = pool.filter((t) => t.id !== selectedTire.id);

  return (
    <div className="min-h-dvh w-full flex justify-center bg-surface-2">
      <div className="w-full max-w-md bg-background flex flex-col shadow-[var(--shadow-elevated)] border-x border-border">
        <div className="flex-1 scroll-area">

          {/* HOME */}
          {screen === "home" && (
            <Home
              onStart={() => setScreen("quiz")}
              onLogin={() => {
                if (authed) {
                  setScreen("progress");
                } else {
                  setLoginRedirect("progress");
                  setScreen("login");
                }
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
                if (authed) {
                  setScreen("result");
                } else {
                  setLoginRedirect("result");
                  setScreen("login");
                }
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
              others={others}
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
                  setScreen("shop");
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
              onPay={() => setScreen("confirm")}
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
              onLogout={() => {
                setAuthed(false);
                setStravaLinked(false);
                setScreen("home");
              }}
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
