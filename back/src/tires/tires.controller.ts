import { Controller, Get, Param } from '@nestjs/common';
import { TiresService } from './tires.service';

@Controller('tires')
export class TiresController {
  constructor(private readonly tiresService: TiresService) {}

  @Get()
  findAll() {
    return this.tiresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tiresService.findOne(id);
  }
}