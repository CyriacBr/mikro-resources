import { MikroORM, FilterQuery } from 'mikro-orm';
import ormConfig from './mikro-orm.config';
import { TypingsGenerator } from '../src/typingsGenerator';
import { Author } from './entities/author.entity';
import { Query, OperatorMap } from 'mikro-orm/dist/typings';

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

    // orm.em.getRepository(Author).find({
    //   $and
    // });
  });

  afterAll(() => orm.close());

  it(`orm exists`, () => {
    expect(orm).toBeDefined();
  });
});
