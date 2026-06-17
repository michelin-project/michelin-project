import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('tires')
export class Tire {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  @Column()
  family!: string;

  @Column('int')
  match!: number;

  @Column('float')
  price!: number;

  @Column()
  image!: string;

  @Column('json')
  highlights!: { label: string; value: number }[];

  @Column('text')
  why!: string;

  @Column()
  tag!: string;
}