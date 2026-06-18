import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

/**
 * Entité mappée sur la collection `products` (catalogue Michelin, 441 docs).
 *
 * ⚠️ RÈGLE TypeORM Mongo 1.0.0 : `_id` DOIT utiliser `@ObjectIdColumn()`
 * (PAS `@PrimaryGeneratedColumn` / `@PrimaryColumn`) — convention validée sur
 * l'entité `User` du projet ; ces décorateurs cassent la construction des
 * métadonnées Mongo. On la respecte par cohérence avec le code existant.
 *
 * Note : dans ce catalogue, `_id` est stocké sous forme de NOMBRE (le code CAI,
 * ex. 421152) et non d'ObjectId. On n'hydrate JAMAIS les `Product` via le
 * repository (le service de recommandation utilise une agrégation brute), donc
 * le type déclaré reste fidèle à la convention projet. Les accès typés aux
 * champs du catalogue se font via l'interface `RawProduct` côté service.
 */
@Entity('products')
export class Product {
  @ObjectIdColumn()
  _id!: ObjectId;

  /** Champs plats du catalogue (alias sûrs -> nom réel en base via `name`). */
  @Column({ name: 'Product Type', nullable: true })
  productType?: string;

  @Column({ name: 'CYCLE TYPE WEB', nullable: true })
  cycleTypeWeb?: string;

  @Column({ nullable: true })
  Segment?: string;

  @Column({ name: 'Range (Internal)', nullable: true })
  rangeInternal?: string;

  @Column({ name: 'Web Range Name', nullable: true })
  webRangeName?: string;

  @Column({ name: 'Web Product Designation', nullable: true })
  webProductDesignation?: string;

  @Column('json', { name: 'Terrain Types', nullable: true })
  terrainTypes?: string[];

  @Column('json', { nullable: true })
  Use?: string[];

  @Column('json', { name: 'Rubber Technologies', nullable: true })
  rubberTechnologies?: string[];

  /** Objets imbriqués (Mongo schéma-less : typage seul, pas de @Column). */
  sizing?: { width_mm?: number | null; diameter_mm?: number | null };
  pressure?: {
    min_bar?: number | null;
    max_bar?: number | null;
    min_psi?: number | null;
    max_psi?: number | null;
  };
  weights?: { tyre_g?: number | null; total_g?: number | null };
  tech?: { tpi?: number | null; bead?: string | null; sealing?: string | null };

  @Column('json', { nullable: true })
  pricing?: { currency?: string; msrp_eur?: number; cost_eur?: number | null };
}
