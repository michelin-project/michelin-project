import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class LeaderboardService {
  constructor(private readonly usersService: UsersService) {}

  async findAll() {
    const users = await this.usersService.findAll();
    const sorted = users.sort((a, b) => (b.scores || 0) - (a.scores || 0));
    return sorted.map((user, index) => ({
      rank: index + 1,
      name: user.name || user.email.split('@')[0], // Utilise le début de l'email si pas de nom
      km: user.scores || 0,
      email: user.email, // L'email permettra au front de savoir qui est "vous"
    }));
  }
}
