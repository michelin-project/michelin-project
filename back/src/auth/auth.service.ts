import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(email);
    const isMatch = user ? await bcrypt.compare(pass, user.password) : false;
    if (!isMatch) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }
    const payload = { sub: String(user!._id), email: user!.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(
    email: string,
    pass: string,
    extraData: any = {},
  ): Promise<{ access_token: string }> {
    const existingUser = await this.usersService.findOne(email);
    if (existingUser) {
      throw new UnauthorizedException('Cet email est déjà utilisé');
    }
    const hashedPassword = await bcrypt.hash(pass, 10);
    const newUser = await this.usersService.create({
      email,
      password: hashedPassword,
      name: 'Nouveau Cycliste',
      ...extraData,
    });
    console.log(newUser);
    const payload = { sub: String(newUser._id), email: newUser.email };
    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
