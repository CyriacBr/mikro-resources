import { Entity, Enum } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';

export enum FooEnum {
  A,
  B,
  C,
}

@Entity()
export class WithBadEnum extends BaseEntity {
  @Enum()
  enum!: FooEnum;
}
