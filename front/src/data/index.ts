import tirePower from "../assets/tire-power.jpg";
import tireGravel from "../assets/tire-gravel.jpg";
import tireMtb from "../assets/tire-mtb.jpg";
import tireUrban from "../assets/tire-urban.jpg";
import type { Tire, Answers } from "../types/index";

export const TIRES: Tire[] = [
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
    tag: "L'Explorateur",
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

export const BIKE_IMAGE = {
  route: tirePower,
  gravel: tireGravel,
  vtt: tireMtb,
  urbain: tireUrban,
} as const;

// Le catalogue n'expose aucune URL d'image : on retombe sur les assets bundlés,
// par mot-clé de la famille/gamme puis par catégorie de vélo.
const IMAGE_BY_RANGE: { test: RegExp; src: string }[] = [
  { test: /gravel|adventure/, src: tireGravel },
  { test: /wild|country|force|jet|pilot|enduro|slope|pump|mud/, src: tireMtb },
  { test: /protek|city|dynamic|world|lithion|urban|trekking/, src: tireUrban },
  { test: /power|pro5|road|cup|season|protection|trial/, src: tirePower },
];

/** Résout l'image d'un pneu recommandé côté front (assets bundlés). */
export function resolveTireImage(
  tire: Pick<Tire, "name" | "family">,
  bike?: Answers["bike"],
): string {
  // Tous les pneus d'une même reco partagent le filtre `bike` : l'image de la
  // catégorie de vélo est donc le meilleur discriminateur (un pneu route reste
  // une image route, y compris les modèles "Lithion"/"Power" qui tomberaient
  // sinon sur l'image urbaine via les mots-clés).
  if (bike && BIKE_IMAGE[bike]) return BIKE_IMAGE[bike];
  const hay = `${tire.family} ${tire.name}`.toLowerCase();
  for (const r of IMAGE_BY_RANGE) if (r.test.test(hay)) return r.src;
  return tirePower;
}

export const RETAILERS = [
  { name: "Alltricks", delivery: "Livraison 24h", note: "Stock dispo" },
  { name: "Bike24", delivery: "2-4 jours", note: "Best price" },
  { name: "Mantel", delivery: "3-5 jours", note: "Premium" },
];
