import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  RecommendationsService,
  type RecommendationAnswers,
  type RecommendationTire,
} from './recommendations.service';

/**
 * `POST /recommendations` — body = réponses du quiz (`Answers` du front).
 * Renvoie une liste classée de pneus : le 1er = pneu mis en avant,
 * les suivants = carrousel « autres pneus compatibles ».
 */
@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly recommendations: RecommendationsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  recommend(
    @Body() body?: RecommendationAnswers,
  ): Promise<RecommendationTire[]> {
    return this.recommendations.recommend(body ?? {});
  }
}
