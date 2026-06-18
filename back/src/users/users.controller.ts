import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':email')
  async getProfile(@Param('email') email: string) {
    return this.usersService.findOne(email);
  }

  @Post('simulate')
  async simulate(@Body() body: { email: string; distance: number }) {
    return this.usersService.updateScore(body.email, body.distance);
  }
}
