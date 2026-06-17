import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';

/**
 * Possède l'entité `Product` (collection `products`) et partage le repository
 * associé avec `RecommendationsModule` via le re-export de `TypeOrmModule`.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  exports: [TypeOrmModule],
})
export class ProductsModule {}
