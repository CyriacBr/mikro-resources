import {
  IdEntity,
  PrimaryKey,
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

export enum BookType {
  'drama',
  'action',
  'sci-fi',
}

@Entity()
export class Book extends BaseEntity {
  @Property()
  name!: string;

  @Property()
  onSale!: boolean;

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
