import {
  Property,
  OneToMany,
  Collection,
  Entity,
  OneToOne,
  Enum,
} from '@mikro-orm/core';
import { Book } from './book.entity';
import { BaseEntity } from './base.entity';
import { Address } from './address.entity';
import { Fixture } from 'class-fixtures-factory';

export enum Mood {
  GOOD = 'good',
  BAD = 'bad',
  NEUTRAL = 'neutral',
}

@Entity()
export class Author extends BaseEntity {
  @Property()
  name!: string;

  @Property()
  age!: number;

  @Enum()
  mood!: Mood;

  @Fixture({ min: 3, max: 3 })
  @OneToMany(
    () => Book,
    book => book.author
  )
  books = new Collection<Book>(this);

  @OneToOne(
    () => Address,
    addr => addr.author
  )
  address!: Address;
}
