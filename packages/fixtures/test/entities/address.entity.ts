import { Property, Entity, OneToOne } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { Author } from './author.entity';

@Entity()
export class Address extends BaseEntity {
  @Property()
  city!: string;

  @OneToOne()
  author!: Author;
}
