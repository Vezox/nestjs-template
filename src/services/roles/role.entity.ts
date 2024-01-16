import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { Permission } from '../permissions/permission.entity';
import { BaseEntity } from 'src/common/entity/base';

@Entity()
export class Role extends BaseEntity {
  @Column()
  name: string;

  @ManyToMany(() => Permission)
  @JoinTable()
  permissions: Permission[];
}
