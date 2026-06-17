import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(email);
    if (user?.password !== pass) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }
    const payload = { sub: user.userId, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(email: string, pass: string): Promise<{ access_token: string }> {
    const existingUser = await this.usersService.findOne(email);
    if (existingUser) {
      throw new UnauthorizedException('Cet email est déjà utilisé');
    }
    const newUser = await this.usersService.create({ email, password: pass, name: 'Nouveau Cycliste' });
    const payload = { sub: newUser.userId, email: newUser.email };
    return { access_token: await this.jwtService.signAsync(payload) };
  }
}