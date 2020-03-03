import {
  IdEntity,
  PrimaryKey,
  Property,
  ManyToOne,
  Enum,
  Entity,
} from 'mikro-orm';
import { Author } from './author.entity';
import { BaseEntity } from './base.entity';
import { Fixture } from '../../src/decorator';

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

  @Fixture({ enum: BookType })
  @Enum()
  type!: BookType;

  @ManyToOne()
  author!: Author;
}
