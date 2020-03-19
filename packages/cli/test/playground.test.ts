import { MikroORM, FilterQuery, Collection } from 'mikro-orm';
import ormConfig from './mikro-orm.config';
import { TypingsGenerator } from '../src/typingsGenerator';
import { Author } from './entities/author.entity';
import { Query, OperatorMap, IsEntity } from 'mikro-orm/dist/typings';
import { Book } from './entities/book.entity';
import { BookTag } from './entities/book-tag.entity';
import { Address } from './entities/address.entity';

describe(`Playground`, () => {
  let orm: MikroORM;

  beforeAll(async () => {
    orm = await MikroORM.init(ormConfig);
    await orm.getSchemaGenerator().dropSchema();
    await orm.getSchemaGenerator().createSchema();

    const generator = new TypingsGenerator(orm.getMetadata(), orm.config);
    await generator.generateAndWrite();
    // const query = generator.generateEntityQueryType(Author);
    // console.log('query :', query);

    orm.em.getRepository(Author).find({
      address: {
        $and: [
          {
            city: 'test',
            author: [1, 2],
          },
        ],
      },
    });
  });

  afterAll(() => orm.close());

  it(`orm exists`, () => {
    expect(orm).toBeDefined();
  });
});

function findOne<T extends string[]>(id: number, populate: T) {
  return null;
}

type ScalarKeys<T> = {
  [K in keyof T]: true extends IsEntity<T[K]>
    ? never
    : T[K] extends Collection
    ? never
    : K;
}[keyof T];
type ScalarsOf<T> = Pick<T, ScalarKeys<T>>;

interface AuthorPopulateReturnType {
  //[key: string]: Author;
  books: {
    books: Collection<ScalarsOf<Book>>;
  } & ScalarsOf<Author>;
  address: {
    address: ScalarsOf<Address>;
  } & ScalarsOf<Author>;
  'books.tags': {
    books: Collection<
      ScalarsOf<Book> & {
        tags: Collection<ScalarsOf<BookTag>>;
      }
    >;
  } & ScalarsOf<Author>;
}

type UnionToIntersection<U> = (U extends any
? (k: U) => void
: never) extends (k: infer I) => void
  ? I
  : never;
type ArrayToIntersection<T> = T extends Array<infer K>
  ? UnionToIntersection<K>
  : never;
type PopulateReturn<T extends string[]> = ArrayToIntersection<
  {
    [K in keyof T]: T[K] extends keyof AuthorPopulateReturnType
      ? AuthorPopulateReturnType[T[K]]
      : Author;
  }
>;

let author1: PopulateReturn<['books']> = null;
author1.books; // OK
author1.address; // type error

let author2: PopulateReturn<['books', 'address']> = null;
author2.books; // OK
author2.address; // Ok

let author3: PopulateReturn<['books', 'address', 'books.tags']> = null;
author3.books; // OK
author3.address; // Ok
author3.books.tags; // type error
author3.books[0].tags; // ok
author3.books[0].author; // type error

let colBooks: Collection<ScalarsOf<Book> & {
  tags: Collection<ScalarsOf<BookTag>>;
}>;
colBooks[0].a;
