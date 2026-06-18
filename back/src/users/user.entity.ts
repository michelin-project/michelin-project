import { Entity, Column, ObjectIdColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity('users')
export class User {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  name!: string;

  @Column({ nullable: true })
  archetypeName!: string;

  @Column({ default: 0 })
  scores: number = 0;

  @Column('json', { nullable: true })
  answers!: any;
}
