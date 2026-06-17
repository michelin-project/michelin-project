import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    // On s'attend à recevoir { "email": "...", "password": "..." }
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Post('register')
  signUp(@Body() signUpDto: Record<string, any>) {
    const { email, password, ...extraData } = signUpDto;
    return this.authService.signUp(email, password, extraData);
  }
}