import { IdEntity, PrimaryKey, Property, ManyToOne, Enum, Entity } from "mikro-orm";
import { Author } from './author.entity';
import { BaseEntity } from './base.entity';

export enum BookType {
  "drama",
  "action",
  "sci-fi"
}

@Entity()
export class Book extends BaseEntity {
  @Property()
  name!: string;

  @ManyToOne()
  author!: Author;

  @Enum()
  type!: BookType;
}