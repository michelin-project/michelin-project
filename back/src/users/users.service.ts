import { Injectable } from '@nestjs/common';

export type User = any;

@Injectable()
export class UsersService {
  // Faux utilisateur pour simuler la base de données
  private readonly users = [
    {
      userId: 1,
      email: 'vous@exemple.fr',
      password: 'password123', // En production, on utilisera bcrypt pour hasher le mot de passe
      name: 'Marc V.',
    },
  ];

  async findOne(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  async create(user: any): Promise<User> {
    const newUser = { userId: this.users.length + 1, ...user };
    this.users.push(newUser);
    return newUser;
  }
}