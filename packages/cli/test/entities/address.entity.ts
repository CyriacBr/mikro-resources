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
import { Author } from './author.entity';

@Entity()
export class Address extends BaseEntity {
  @Property()
  city!: string;

  @OneToOne()
  author!: Author;
}
