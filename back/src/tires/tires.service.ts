import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tire } from './tire.entity';

@Injectable()
export class TiresService {
  constructor(
    @InjectRepository(Tire)
    private tiresRepository: Repository<Tire>,
  ) {}

  async findAll(): Promise<Tire[]> {
    return this.tiresRepository.find();
  }

  async findOne(id: string): Promise<Tire | null> {
    return this.tiresRepository.findOneBy({ id });
  }
}
