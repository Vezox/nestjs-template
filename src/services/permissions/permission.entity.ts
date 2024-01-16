import { Entity, Column, Unique } from 'typeorm';
import { BaseEntity } from 'src/common/entity/base';

@Entity()
@Unique(['key'])
export class Permission extends BaseEntity {
  @Column()
  key: string;

  @Column()
  description: string;
}
