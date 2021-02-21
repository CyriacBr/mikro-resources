import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';

@Entity()
export class WithSpecialTypeFixed extends BaseEntity {
  @Property({ type: 'string' })
  weirdScalar!: 'a' | 'b' | 'c';
}
