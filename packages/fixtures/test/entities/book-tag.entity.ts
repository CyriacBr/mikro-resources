import { Collection, ManyToMany, Entity, Property } from 'mikro-orm';
import { Book } from './book.entity';
import { BaseEntity } from './base.entity';

@Entity()
export class BookTag extends BaseEntity {
  @Property()
  label!: string;

  @ManyToMany(
    () => Book,
    book => book.tags
  )
  books = new Collection<Book>(this);
}
