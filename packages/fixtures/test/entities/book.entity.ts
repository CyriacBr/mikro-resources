import {
  Property,
  ManyToOne,
  Enum,
  Entity,
  ManyToMany,
  Collection,
} from '@mikro-orm/core';
import { Author } from './author.entity';
import { BaseEntity } from './base.entity';
import { BookTag } from './book-tag.entity';
import { Fixture } from 'class-fixtures-factory';

export enum BookType {
  DRAMA = 'drama',
  ACTION = 'action',
  SCI_FI = 'sci-fi',
}

@Entity()
export class Book extends BaseEntity {
  @Property()
  name!: string;

  @Property()
  onSale!: boolean;

  @Fixture({ enum: BookType })
  @Enum()
  type!: BookType;

  @ManyToOne()
  author!: Author;

  @ManyToMany(
    () => BookTag,
    tag => tag.books,
    { owner: true }
  )
  tags: Collection<BookTag> = new Collection<BookTag>(this);
}
