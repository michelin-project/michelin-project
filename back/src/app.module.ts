import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { TiresModule } from './tires/tires.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb://michelin:michelin_dev_pwd@localhost:27017/michelin_catalog?authSource=admin',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    TiresModule,
    LeaderboardModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
