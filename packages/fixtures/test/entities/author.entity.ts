import {
  IdEntity,
  PrimaryKey,
  Property,
  OneToMany,
  Collection,
  Entity,
  OneToOne,
} from 'mikro-orm';
import { Book } from './book.entity';
import { BaseEntity } from './base.entity';
import { Address } from './address.entity';

@Entity()
export class Author extends BaseEntity {
  @Property()
  name!: string;

  @OneToMany(
    () => Book,
    book => book.author
  )
  books = new Collection<Book>(this);

  @OneToOne(() => Address, addr => addr.author)
  address!: Address;
}
