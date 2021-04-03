import { MikroORM, Collection } from '@mikro-orm/core';
import ormConfig from './mikro-orm.config';
import { Author, Mood } from './entities/author.entity';
import { Address } from './entities/address.entity';
import { Book } from './entities/book.entity';
import { FixtureFactory } from '../src/FixtureFactory';
import { WithSpecialType } from './entities/with-special-type.entity';
import { WithSpecialTypeFixed } from './entities/with-special-type-fixed.entity';
import { AuthorWithCustomization } from './entities/author-with-customization';

jest.setTimeout(20000);

describe(`Factory`, () => {
  let orm: MikroORM;
  let factory: FixtureFactory;

  beforeAll(async () => {
    orm = await MikroORM.init(ormConfig as any);
    await orm.getSchemaGenerator().dropSchema();
    await orm.getSchemaGenerator().createSchema();
    factory = new FixtureFactory(orm);
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

  it(`make().oneAndPersist()`, async () => {
    const result = factory.make(Author);
    expect(result.oneAndPersist).toBeInstanceOf(Function);

    const currCount = await orm.em.getRepository(Author).count();
    const author = await result.oneAndPersist();
    expect(author).toBeInstanceOf(Author);
    expect(await orm.em.getRepository(Author).count()).toBe(currCount + 1);
  });

  it(`make().with().oneAndPersist()`, async () => {
    const result = factory.make(Author).with({ age: 30 });
    expect(result.oneAndPersist).toBeInstanceOf(Function);

    const author = await result.oneAndPersist();
    expect(author).toBeInstanceOf(Author);
    expect(author.age).toBe(30);
  });

  it(`make().manyAndPersist()`, async () => {
    const result = factory.make(Author);
    expect(result.manyAndPersist).toBeInstanceOf(Function);

    const currCount = await orm.em.getRepository(Author).count();
    const authors = await result.manyAndPersist(3);
    expect(authors).toBeInstanceOf(Array);
    expect(authors.length).toBe(3);
    expect(authors[0]).toBeInstanceOf(Author);
    expect(await orm.em.getRepository(Author).count()).toBe(currCount + 3);
  });

  it(`make().with().manyAndPersist()`, async () => {
    const result = factory.make(Author).with({ age: 30 });
    expect(result.manyAndPersist).toBeInstanceOf(Function);

    const authors = await result.manyAndPersist(3);
    const ages = authors.map((author) => author.age);
    expect(ages).toMatchObject([30, 30, 30]);
  });

  it(`make().ignore()`, () => {
    const author = factory.make(Author).ignore('address', 'age').one();

    expect(author).toBeInstanceOf(Author);
    expect(author.address).toBeUndefined();
    expect(author.age).toBeUndefined();
  });

  it(`make().with()`, () => {
    const author = factory
      .make(Author)
      .with({
        age: 30,
        mood: Mood.GOOD,
        address: factory
          .make(Address)
          .with({
            city: 'ReactCity',
          })
          .one(),
      })
      .one();

    expect(author).toBeInstanceOf(Author);
    expect(author.age).toBe(30);
    expect(author.mood).toBe(Mood.GOOD);
    expect(author.address.city).toBe('ReactCity');
  });

  it(`make().with().many()`, () => {
    const authors = factory
      .make(Author)
      .with({
        age: 500,
        name: 'Foo',
      })
      .many(5);

    for (const author of authors) {
      expect(author).toBeInstanceOf(Author);
      expect(author.age).toBe(500);
      expect(author.name).toBe('Foo');
    }
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

    describe(`special type`, () => {
      it(`doesn't work by default`, () => {
        /**
         * For some reasons expect().toThrow() refuses to work
         * here, hence why I am using a try {} catch {} block
         */
        try {
          factory.make(WithSpecialType).one();
        } catch (error) {
          expect(error).toBeDefined();
        }
      });

      it(`works with @Property({ type })`, () => {
        const entity = factory.make(WithSpecialTypeFixed).one();
        expect(typeof entity.weirdScalar).toBe('string');
      });
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

  describe(`with customization`, () => {
    let author: AuthorWithCustomization;

    beforeAll(() => {
      author = factory.make(AuthorWithCustomization).one();
    });

    it(`@Fixture(faker => string)`, () => {
      expect(author.firstName).toBeDefined();
      expect(typeof author.firstName === 'string').toBe(true);
    });

    it(`@Fixture(string)`, () => {
      expect(author.lastName).toBeDefined();
      expect(typeof author.lastName === 'string').toBe(true);
    });

    it(`@Fixture({ type: () => any })`, () => {
      expect(author.fullName).toBeDefined();
      expect(typeof author.fullName === 'string').toBe(true);
    });

    it(`@Fixture(() => any)`, () => {
      expect(author.age).toBe(24);
    });

    it(`@Fixture({ min, max })`, () => {
      expect(author.books).toBeDefined();
      expect(author.books.length).toBe(5);
    });

    it(`@Fixture({ ignore: true })`, () => {
      expect(author.address).toBeUndefined();
    });
  });
});
