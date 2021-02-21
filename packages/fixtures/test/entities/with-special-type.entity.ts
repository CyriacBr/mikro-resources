import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';

@Entity()
export class WithSpecialType extends BaseEntity {
  @Property()
  weirdScalar!: 'a' | 'b' | 'c';
}
