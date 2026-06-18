import type { Answers } from "../types/index";

export function deriveArchetype(a: Answers) {
  const name =
    a.priority === "vitesse"
      ? "Le Performeur"
      : a.priority === "adherence"
        ? "L'Aventurier"
        : a.priority === "durabilite"
          ? "Le Rouleur Endurant"
          : a.priority === "confort"
            ? "Le Cycliste Contrôle"
            : "Le Performeur";

  const base = {
    "Le Performeur": { perf: 92, end: 70, adv: 50, ctrl: 65 },
    "L'Aventurier": { perf: 65, end: 78, adv: 94, ctrl: 72 },
    "Le Rouleur Endurant": { perf: 70, end: 95, adv: 60, ctrl: 75 },
    "Le Cycliste Contrôle": { perf: 60, end: 70, adv: 55, ctrl: 92 },
  }[name]!;

  const tagline =
    name === "Le Performeur"
      ? "Vitesse pure, ligne droite, watts maîtrisés."
      : name === "L'Aventurier"
        ? "Hors des sentiers battus, là où l'asphalte s'efface."
        : name === "Le Rouleur Endurant"
          ? "Des kilomètres réguliers, une cadence sereine."
          : "Maîtrise totale, fiabilité au quotidien.";

  return { name, scores: base, tagline };
}

export const QUIZ_STEPS = [
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
