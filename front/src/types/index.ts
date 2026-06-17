export type ScreenKey =
  | "home" | "login" | "register" | "quiz" | "result" | "reco"
  | "challenge" | "progress" | "leaderboard"
  | "reward" | "recommendation" | "shop" | "confirm" | "checkoutInfos" | "checkoutPayment";

export type Answers = {
  bike?: "route" | "gravel" | "vtt" | "urbain";
  priority?: "vitesse" | "adherence" | "durabilite" | "confort";
  weekly?: 50 | 100 | 200 | 300;
  terrain?: "asphalte" | "mixte" | "sentiers" | "ville";
};

export type Tire = {
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
