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
      type: 'mariadb',
      host: 'localhost',
      port: 3306,
      username: 'root', // Mettez votre utilisateur MariaDB
      password: '',     // Mettez votre mot de passe MariaDB
      database: 'michelin',
      autoLoadEntities: true, // Charge automatiquement les entités comme Tire
      synchronize: true, // Va créer la table automatiquement (à désactiver en production)
    }),
    AuthModule,
    UsersModule,
    TiresModule,
    LeaderboardModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}