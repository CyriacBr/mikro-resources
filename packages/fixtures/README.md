[![Actions Status](https://github.com/CyriacBr/mikro-resources/workflows/Node%20CI/badge.svg)](https://github.com/CyriacBr/mikro-resources/actions)

# @mikro-resources/fixtures

This package generates fixtures of your mikro-orm entities on the fly, using [`class-fixtures-factory`](https://github.com/CyriacBr/class-fixtures-factory).  
`@mikro-resources/fixtures` will automatically handle all fields and relations of your entities, but you can provide custom values as well.  
The API is fully typed.

## Installation

```bash
yarn add -D @mikro-resources/fixtures 
# or
npm i -D @mikro-resources/fixtures
```

## Usage

### General

```ts
import { FixturesFactory } from '@mikro-resources/fixtures';

const factory = new FixturesFactory(orm);

// Generate a fixture
let author = factory.make(Author).one();
// Generate multiple fixtures
let authors = factory.make(Author).many(10);

// Generate and persist
author = await factory.make(Author).oneAndPersist();
authors = await factory.make(Author).manyAndPersist(10);

// Ignore some properties at runtime
const partialAuthor = factory
  .make(Author)
  .ignore('address', 'age')
  .one(); // address and age are undefined

// Override properties at runtime
const agedAuthor = factory
  .make(Author)
  .with({
    age: 70,
    address: specialAddr, // any actual address entity object
  })
  .one();
```

### Customization
Using the `Fixture` decorator on your entities, you can customize generated data.
```ts
import { Fixture } from "@mikro-resources/fixtures";

export enum Mood {
  GOOD,
  BAD,
  NEUTRAL
}

@Entity()
export class Author extends BaseEntity {

  @Fixture(faker => faker.name.firstName())
  @Property()
  firstName!: string;

  @Fixture('{{name.lastName}}')
  @Property()
  lastName!: string;

  @Fixture(() => 24)
  @Property()
  age!: number;

  @Enum()
  mood!: Mood;

  @Fixture({ min: 3, max: 5})
  @OneToMany(
    () => Book,
    book => book.author
  )
  books = new Collection<Book>(this);

  @Fixture({ ignore: true })
  @OneToOne(
    () => Address,
    addr => addr.author
  )
  address!: Address;
}
```
You can learn more about the usage of class-fixtures-factory [here](https://github.com/CyriacBr/class-fixtures-factory).