import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { TiresModule } from './tires/tires.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { ProductsModule } from './products/products.module';
import { RecommendationsModule } from './recommendations/recommendations.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGODB_URL,
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    TiresModule,
    LeaderboardModule,
    ProductsModule,
    RecommendationsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
