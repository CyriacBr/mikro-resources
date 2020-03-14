import { MikroORM } from 'mikro-orm';
import ormConfig from './mikro-orm.config';
import { TypingsGenerator } from '../src/typingsGenerator';

describe(`Playground`, () => {
  let orm: MikroORM;

  beforeAll(async () => {
    orm = await MikroORM.init(ormConfig);
    await orm.getSchemaGenerator().dropSchema();
    await orm.getSchemaGenerator().createSchema();

    const generator = new TypingsGenerator(orm);
    const result = generator._getEntityPathMappings('Author');
    console.log('result :', result);
  });

  afterAll(() => orm.close());

  it(`orm exists`, () => {
    expect(orm).toBeDefined();
  });
});
