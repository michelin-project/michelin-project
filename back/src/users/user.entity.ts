import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  name!: string;

  @Column({ nullable: true })
  archetypeName!: string;

  @Column('json', { nullable: true })
  scores!: any;

  @Column('json', { nullable: true })
  answers!: any;
}