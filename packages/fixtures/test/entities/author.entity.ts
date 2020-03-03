import {
  IdEntity,
  PrimaryKey,
  Property,
  OneToMany,
  Collection,
} from 'mikro-orm';
import { Book } from './book.entity';
import { BaseEntity } from './base.entity';

export class Author extends BaseEntity {
  @Property()
  name!: string;

  @OneToMany(
    () => Book,
    book => book.author
  )
  books = new Collection<Book>(this);
}
