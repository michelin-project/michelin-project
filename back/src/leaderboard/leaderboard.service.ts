import { Injectable } from '@nestjs/common';

@Injectable()
export class LeaderboardService {
  private readonly ranking = [
    { rank: 1, name: 'Léa Bertin', km: 412, you: false },
    { rank: 2, name: 'Tom Riva', km: 388, you: false },
    { rank: 3, name: 'Marc V. (vous)', km: 327, you: true },
    { rank: 4, name: 'Sami N.', km: 301, you: false },
    { rank: 5, name: 'Inès D.', km: 270, you: false },
    { rank: 6, name: 'Paul C.', km: 244, you: false },
  ];

  findAll() {
    // Plus tard, nous ferons ici une requête SQL TypeORM pour calculer le classement dynamique
    return this.ranking;
  }
}