import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Role } from '../roles/role.entity';
import { BaseEntity } from 'src/common/entity/base';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];

  @Column()
  hash: string;

  @Column('text', { array: true })
  refresh_tokens: string[];
}
