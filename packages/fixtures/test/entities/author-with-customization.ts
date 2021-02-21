import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  Property,
} from '@mikro-orm/core';
import { Fixture } from '../../src';
import { BaseEntity } from './base.entity';

@Entity()
export class AuthorWithCustomization extends BaseEntity {
  @Fixture(faker => faker.name.firstName())
  @Property()
  firstName!: number;

  @Fixture('{{name.lastName}}')
  @Property()
  lastName!: number;

  @Fixture({ type: () => String })
  @Property()
  fullName!: number;

  @Fixture(() => 24)
  @Property()
  age!: number;

  @Fixture({ min: 5, max: 5 })
  @OneToMany(
    () => Book2,
    book => book.author
  )
  books = new Collection<Book2>(this);

  @Fixture({ ignore: true })
  @OneToOne(
    () => Address2,
    addr => addr.author
  )
  address!: Address2;
}

@Entity()
export class Book2 extends BaseEntity {
  @ManyToOne()
  author!: AuthorWithCustomization;
}

@Entity()
export class Address2 extends BaseEntity {
  @OneToOne()
  author!: AuthorWithCustomization;
}
