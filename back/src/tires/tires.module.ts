import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiresController } from './tires.controller';
import { TiresService } from './tires.service';
import { Tire } from './tire.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tire])],
  controllers: [TiresController],
  providers: [TiresService],
})
export class TiresModule {}
