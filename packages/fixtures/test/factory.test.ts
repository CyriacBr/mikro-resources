import { MikroORM, FileCacheAdapter, wrap, Utils, Collection } from 'mikro-orm';
import ormConfig from './mikro-orm.config';
import { join } from 'path';
import { Author } from './entities/author.entity';
import { FixturesFactory } from '../src/factory';
import { WithBadEnum } from './entities/with-bad-enum.entity';
import { Address } from './entities/address.entity';
import { Book } from './entities/book.entity';

describe(`Factory`, () => {
  let orm: MikroORM;
  let factory: FixturesFactory;

  beforeAll(async () => {
    orm = await MikroORM.init(ormConfig);
    await orm.getSchemaGenerator().dropSchema();
    await orm.getSchemaGenerator().createSchema();
    factory = new FixturesFactory(orm);
  });

  afterAll(() => orm.close());

  it(`orm exists`, () => {
    expect(orm).toBeDefined();
  });

  it(`make().one()`, () => {
    const result = factory.make(Author);
    expect(result.one).toBeInstanceOf(Function);

    const author = result.one();
    expect(author).toBeInstanceOf(Author);
  });

  it(`make().many()`, () => {
    const result = factory.make(Author);
    expect(result.many).toBeInstanceOf(Function);

    const authors = result.many(3);
    expect(authors).toBeInstanceOf(Array);
    expect(authors.length).toBe(3);
    expect(authors[0]).toBeInstanceOf(Author);
  });

  describe(`scalar properties`, () => {
    let author: Author;

    beforeAll(() => {
      author = factory.make(Author).one();
    });

    it(`string`, () => {
      expect(author.name).toBeDefined();
      expect(typeof author.name === 'string').toBe(true);
    });

    it(`number`, () => {
      expect(author.age).toBeDefined();
      expect(typeof author.age === 'number').toBe(true);
    });

    it(`date`, () => {
      expect(author.createdAt).toBeInstanceOf(Date);
    });

    it(`enum`, () => {
      expect(
        ['GOOD', 'BAD', 'NEUTRAL'].includes(
          author.mood.toString().toUpperCase()
        )
      ).toBe(true);
    });
  });

  describe(`relations`, () => {
    let author: Author;

    beforeAll(() => {
      author = factory.make(Author).one();
    });

    it(`1:1`, () => {
      expect(author.address).toBeInstanceOf(Address);
    });

    it(`1:m`, () => {
      expect(author.books).toBeInstanceOf(Collection);
      expect(author.books.length).toBe(3);
    });

    it(`m:1`, () => {
      const book = factory.make(Book).one();

      expect(book.author).toBeInstanceOf(Author);
    });

    it(`m:n`, () => {
      const book = factory.make(Book).one();
      expect(book.tags).toBeInstanceOf(Collection);
    });
  });
});
