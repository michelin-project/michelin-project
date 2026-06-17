import tirePower from "../assets/tire-power.jpg";
import tireGravel from "../assets/tire-gravel.jpg";
import tireMtb from "../assets/tire-mtb.jpg";
import tireUrban from "../assets/tire-urban.jpg";
import type { Tire } from "../types/index";

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

export const RETAILERS = [
  { name: "Alltricks", delivery: "Livraison 24h", note: "Stock dispo" },
  { name: "Bike24", delivery: "2-4 jours", note: "Best price" },
  { name: "Mantel", delivery: "3-5 jours", note: "Premium" },
];
