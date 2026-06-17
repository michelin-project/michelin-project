import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService],
  exports: [UsersService], // On l'exporte pour que l'AuthModule puisse s'en servir
})
export class UsersModule {}