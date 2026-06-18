import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: MongoRepository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async create(userData: Partial<User>): Promise<User> {
    const newUser = this.usersRepository.create({
      ...userData,
      scores: 0, // Force l'initialisation de la distance à 0 (écrase ce que le front envoie)
    });
    return this.usersRepository.save(newUser);
  }

  async updateScore(email: string, scores: number): Promise<User | null> {
    const user = await this.findOne(email);
    if (user) {
      user.scores = scores;
      return this.usersRepository.save(user);
    }
    return null;
  }
}
