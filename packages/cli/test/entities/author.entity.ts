import {
  IdEntity,
  PrimaryKey,
  Property,
  OneToMany,
  Collection,
  Entity,
  OneToOne,
  Enum,
} from 'mikro-orm';
import { Book } from './book.entity';
import { BaseEntity } from './base.entity';
import { Address } from './address.entity';

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
