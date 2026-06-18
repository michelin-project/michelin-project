import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { type ObjectLiteral, MongoRepository } from 'typeorm';
import { Product } from '../products/product.entity';

/* ------------------------------------------------------------------ */
/* DTO — miroir des types front `Answers` / `Tire` (front/src/types)   */
/* ------------------------------------------------------------------ */
export type BikeAnswer = 'route' | 'gravel' | 'vtt' | 'urbain';
export type PriorityAnswer = 'vitesse' | 'adherence' | 'durabilite' | 'confort';
export type WeeklyAnswer = 50 | 100 | 200 | 300;
export type TerrainAnswer = 'asphalte' | 'mixte' | 'sentiers' | 'ville';

export interface RecommendationAnswers {
  bike?: BikeAnswer;
  priority?: PriorityAnswer;
  weekly?: WeeklyAnswer;
  terrain?: TerrainAnswer;
}

export interface RecommendationHighlight {
  label: string;
  value: number;
}

export interface RecommendationTire {
  id: string;
  name: string;
  family: string;
  match: number;
  price: number;
  image: string;
  highlights: RecommendationHighlight[];
  why: string;
  tag: string;
}

/**
 * Document brut renvoyé par l'aggrégation Mongo (clés = noms réels catalogue).
 * L'aggrégation n'hydrate PAS l'entité : on type donc le résultat « à plat ».
 */
interface RawProduct {
  _id: unknown;
  'Product Type'?: string;
  'CYCLE TYPE WEB'?: string;
  Segment?: string;
  'Range (Internal)'?: string;
  'Web Range Name'?: string;
  'Web Product Designation'?: string;
  'Terrain Types'?: string[] | null;
  Use?: string[] | null;
  'Rubber Technologies'?: string[] | null;
  sizing?: { width_mm?: number | null } | null;
  weights?: { tyre_g?: number | null } | null;
  tech?: {
    tpi?: number | null;
    bead?: string | null;
    sealing?: string | null;
  } | null;
  pricing?: { msrp_eur?: number } | null;
  // Champs ajoutés par le pipeline
  total?: number;
}

/* ------------------------------------------------------------------ */
/* Tables de mapping quiz -> catalogue                                 */
/* ------------------------------------------------------------------ */
const BIKE_TOKEN: Record<BikeAnswer, string> = {
  route: 'ROAD',
  gravel: 'GRAVEL',
  vtt: 'MTB',
  urbain: 'COMMUTING',
};

const TERRAIN_SET: Record<TerrainAnswer, string[]> = {
  asphalte: ['ASPHALT', 'HARD/DRY', 'HARD PACKED'],
  mixte: ['MIXED', 'OFFROAD MIXED', 'HARD PACKED'],
  sentiers: ['OFFROAD MIXED', 'OFFROAD SOFT', 'OFFROAD MUD', 'MUD'],
  ville: ['ASPHALT', 'HARD/DRY'],
};

const PRIORITY_RULE: Record<
  PriorityAnswer,
  { segRe: string | null; use: string[] }
> = {
  vitesse: { segRe: 'RACING|COMPETITION', use: ['RACING', 'SPEED'] },
  adherence: {
    segRe: null,
    use: ['CYCLOCROSS', 'ENDURO', 'ALL MOUNTAIN/TRAIL', 'TRAIL'],
  },
  durabilite: { segRe: 'PERFORMANCE|ACCESS', use: ['TOURING', 'TREKKING'] },
  confort: { segRe: null, use: ['LEISURE', 'ENDURANCE', 'URBAN'] },
};

const WEEKLY_TOKEN: Record<WeeklyAnswer, string> = {
  50: 'ACCESS',
  100: 'PERFORMANCE',
  200: 'COMPETITION',
  300: 'RACING',
};

const BIKE_LABEL: Record<BikeAnswer, string> = {
  route: 'Route',
  gravel: 'Gravel',
  vtt: 'VTT',
  urbain: 'Urbain',
};

const SEGMENT_LABEL: Record<string, string> = {
  'PREMIUM RACING LINE': 'Racing',
  'PREMIUM COMPETITION LINE': 'Competition',
  'PREMIUM PERFORMANCE LINE': 'Performance',
  'ACCESS LINE': 'Access',
};

const TERRAIN_LABEL: Record<TerrainAnswer, string> = {
  asphalte: 'le rendement sur asphalte',
  mixte: 'la polyvalence sur terrains mixtes',
  sentiers: "l'accroche en hors-piste",
  ville: 'la régularité urbaine',
};

const PRIORITY_LABEL: Record<PriorityAnswer, string> = {
  vitesse: 'la vitesse',
  adherence: "l'adhérence",
  durabilite: 'la longévité',
  confort: 'le confort',
};

const DEFAULTS: Required<RecommendationAnswers> = {
  bike: 'route',
  priority: 'vitesse',
  weekly: 100,
  terrain: 'asphalte',
};

/** Somme max des scores bruts : 30 (terrain) + 30 (priorité) + 20 (volume). */
const MAX_RAW_SCORE = 80;

type BaseScoreKey = 'leger' | 'souple' | 'robuste' | 'adherence';

const SCORE_LABEL: Record<BaseScoreKey, string> = {
  leger: 'Légèreté',
  souple: 'Souplesse',
  robuste: 'Robustesse',
  adherence: 'Adhérence',
};

/**
 * Recommande jusqu'à 6 pneus Michelin à partir des réponses du quiz.
 *
 * Stratégie « filtrer dur, puis scorer » :
 *  1. filtre dur sur le type de vélo (`CYCLE TYPE WEB`) ;
 *  2. score terrain (30) + priorité (30) + volume/gamme (20) ;
 *  3. dédoublonnage par famille (`Range (Internal)`) -> 1 variant par famille ;
 *  4. tie-break déterministe (prix croissant) -> mis en avant stable ;
 *  5. limit 6 (1 mis en avant + 5 carrousel).
 */
@Injectable()
export class RecommendationsService {
  private readonly logger = new Logger(RecommendationsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly products: MongoRepository<Product>,
  ) {}

  async recommend(
    input?: RecommendationAnswers | null,
  ): Promise<RecommendationTire[]> {
    const answers = this.withDefaults(input);
    const pipeline = this.buildPipeline(answers);
    try {
      const docs = await this.products
        .aggregate<RawProduct>(pipeline)
        .toArray();
      return docs.map((d) => this.toTire(d, answers));
    } catch (err) {
      this.logger.error(`Aggregation échouée : ${(err as Error).message}`);
      return [];
    }
  }

  private withDefaults(
    input?: RecommendationAnswers | null,
  ): Required<RecommendationAnswers> {
    const a = input ?? {};
    // `in` matcherait aussi les clés héritées du prototype (__proto__,
    // constructor...) ; on utilise hasOwnProperty pour un allowlist strict.
    const has = (o: object, k: string) =>
      Object.prototype.hasOwnProperty.call(o, k);
    const weekly = a.weekly;
    return {
      bike: a.bike && has(BIKE_TOKEN, a.bike) ? a.bike : DEFAULTS.bike,
      priority:
        a.priority && has(PRIORITY_RULE, a.priority)
          ? a.priority
          : DEFAULTS.priority,
      weekly:
        weekly && ([50, 100, 200, 300] as WeeklyAnswer[]).includes(weekly)
          ? weekly
          : DEFAULTS.weekly,
      terrain:
        a.terrain && has(TERRAIN_SET, a.terrain) ? a.terrain : DEFAULTS.terrain,
    };
  }

  private buildPipeline(a: Required<RecommendationAnswers>): ObjectLiteral[] {
    const token = BIKE_TOKEN[a.bike];
    const terrainSet = TERRAIN_SET[a.terrain];
    const prio = PRIORITY_RULE[a.priority];
    const volTok = WEEKLY_TOKEN[a.weekly];

    // Priorité : segment (regex) OU usage (intersection).
    const useIntersect = {
      $gt: [
        { $size: { $setIntersection: [{ $ifNull: ['$Use', []] }, prio.use] } },
        0,
      ],
    };
    const priorityScore =
      prio.segRe === null
        ? { $cond: [useIntersect, 30, 0] }
        : {
            $cond: [
              {
                $or: [
                  {
                    $regexMatch: {
                      input: { $ifNull: ['$Segment', ''] },
                      regex: prio.segRe,
                      options: 'i',
                    },
                  },
                  useIntersect,
                ],
              },
              30,
              0,
            ],
          };

    return [
      // 1. Filtre dur : TYRE uniquement + type de vélo sur le champ web.
      {
        $match: {
          'Product Type': 'TYRE',
          'CYCLE TYPE WEB': { $regex: token, $options: 'i' },
        },
      },
      // 2. Score.
      {
        $addFields: {
          terrainScore: {
            $cond: [
              {
                $gt: [
                  {
                    $size: {
                      $setIntersection: [
                        { $ifNull: ['$Terrain Types', []] },
                        terrainSet,
                      ],
                    },
                  },
                  0,
                ],
              },
              30,
              0,
            ],
          },
          priorityScore,
          volumeScore: {
            $cond: [
              {
                $regexMatch: {
                  input: { $ifNull: ['$Segment', ''] },
                  regex: volTok,
                  options: 'i',
                },
              },
              20,
              0,
            ],
          },
        },
      },
      {
        $addFields: {
          total: { $add: ['$terrainScore', '$priorityScore', '$volumeScore'] },
        },
      },
      // 3. Tri + dédoublonnage par famille (Range Internal) + re-tri stable.
      { $sort: { total: -1, 'pricing.msrp_eur': 1, _id: 1 } },
      { $group: { _id: '$Range (Internal)', doc: { $first: '$$ROOT' } } },
      { $replaceRoot: { newRoot: '$doc' } },
      { $sort: { total: -1, 'pricing.msrp_eur': 1, _id: 1 } },
      // 4. 1 mis en avant + 5 carrousel.
      { $limit: 6 },
    ];
  }

  private toTire(
    d: RawProduct,
    a: Required<RecommendationAnswers>,
  ): RecommendationTire {
    const total = typeof d.total === 'number' ? d.total : 0;
    // Normalisation 0..80 -> 50..100 : tout pneu compatible (filtre dur passé)
    // affiche au minimum 50 %, le meilleur atteint 100 %.
    const match = Math.round(50 + (total / MAX_RAW_SCORE) * 50);
    const segment = d.Segment ?? '';
    const rangeInternal = d['Range (Internal)'] ?? '';
    const name = (
      d['Web Range Name'] ??
      d['Web Product Designation'] ??
      rangeInternal
    )
      .replace(/^MICHELIN\s+/i, '')
      .trim();

    return {
      id: String(d._id ?? ''),
      name: name || rangeInternal || 'Pneu Michelin',
      family: `${BIKE_LABEL[a.bike]} — ${SEGMENT_LABEL[segment] ?? 'Michelin'}`,
      match,
      price: d.pricing?.msrp_eur ?? 0,
      image: '', // résolu côté front (assets bundlés) cf. data/index.ts
      highlights: this.highlights(d, a),
      why: this.why(d, a),
      tag: segment,
    };
  }

  /** 3 métriques /100 distinctes, choisies selon la priorité du quiz. */
  private highlights(
    d: RawProduct,
    a: Required<RecommendationAnswers>,
  ): RecommendationHighlight[] {
    const scores = this.baseScores(d);
    const picks: Record<
      PriorityAnswer,
      [BaseScoreKey, BaseScoreKey, BaseScoreKey]
    > = {
      vitesse: ['leger', 'souple', 'adherence'],
      adherence: ['adherence', 'souple', 'robuste'],
      durabilite: ['robuste', 'leger', 'adherence'],
      confort: ['souple', 'robuste', 'adherence'],
    };
    return picks[a.priority].map((k) => ({
      label: SCORE_LABEL[k],
      value: scores[k],
    }));
  }

  /** Scores de base 0..100 dérivés des métriques catalogue (heuristique). */
  private baseScores(d: RawProduct): Record<BaseScoreKey, number> {
    const clamp = (n: number) => Math.max(10, Math.min(100, Math.round(n)));
    const g = d.weights?.tyre_g ?? null;
    const segment = d.Segment ?? '';
    const terrain = d['Terrain Types'] ?? [];
    const rubber = (d['Rubber Technologies'] ?? []).join('|');
    const bead = d.tech?.bead ?? '';
    const sealing = d.tech?.sealing ?? '';

    const leger = g == null ? 60 : clamp(100 - ((g - 180) / (900 - 180)) * 100);
    // Le TPI est toujours null dans ce catalogue : la souplesse est dérivée de
    // la tringle (foldable), du montage (tubeless) et du segment de gamme.
    const souple = clamp(
      50 +
        (/FOLDABLE/i.test(bead) ? 20 : 0) +
        (/TUBELESS/i.test(sealing) ? 15 : 0) +
        (/RACING|COMPETITION/i.test(segment)
          ? 15
          : /PERFORMANCE/i.test(segment)
            ? 5
            : /ACCESS/i.test(segment)
              ? -10
              : 0),
    );
    const robuste = clamp(
      /ACCESS/i.test(segment)
        ? 95
        : /PERFORMANCE/i.test(segment)
          ? 80
          : /COMPETITION/i.test(segment)
            ? 62
            : /RACING/i.test(segment)
              ? 48
              : 70,
    );
    const offroad = terrain.some((t) => /OFFROAD|MUD|SOFT/i.test(t));
    const gripBonus = /MAGI|GUM|GRIP/i.test(rubber) ? 18 : 0;
    const adherence = clamp(60 + (offroad ? 18 : 0) + gripBonus);

    return { leger, souple, robuste, adherence };
  }

  /** Phrase « Pourquoi ce pneu » dérivée des dimensions matchées. */
  private why(d: RawProduct, a: Required<RecommendationAnswers>): string {
    const seg = SEGMENT_LABEL[d.Segment ?? ''];
    const segLine = seg ? `de la ligne ${seg}` : 'Michelin';
    const g = d.weights?.tyre_g ?? null;
    const bead = d.tech?.bead ?? '';
    const sealing = d.tech?.sealing ?? '';
    const techBits: string[] = [];
    if (/TUBELESS/i.test(sealing)) techBits.push('monte tubeless');
    if (/FOLDABLE/i.test(bead)) techBits.push('tringle souple');
    let s = `Conçu pour ${TERRAIN_LABEL[a.terrain]} et ${PRIORITY_LABEL[a.priority]}, ce pneu ${segLine}`;
    s += techBits.length
      ? ` (${techBits.join(', ')})`
      : ' offre un bon compromis';
    s += g != null ? ` pour seulement ${g} g` : '';
    s += '.';
    return s;
  }
}
