import { MikroORM, FileCacheAdapter, wrap } from 'mikro-orm';
import ormConfig from './mikro-orm.config';
import { join } from 'path';
import { Author } from './entities/author.entity';
import { FixturesFactory } from '../src/factory';

describe(`Playground`, () => {
    let orm: MikroORM;

    beforeAll(async () => {
        orm = await MikroORM.init(ormConfig);
        await orm.getSchemaGenerator().dropSchema();
        await orm.getSchemaGenerator().createSchema()
        
        // const cache = orm.config.getCacheAdapter();
        // const authorCached = await cache.get("Author.ts");
        // console.log('authorCached :', authorCached);

        //await orm.em.getRepository(Author).findAll();
        const meta = orm.getMetadata();
        const authorMeta = meta.get('Author');
        const addressMeta = meta.get('Address');
        //console.log('authorMeta :', authorMeta);
        //console.log('addressMeta :', addressMeta);

        const factory = new FixturesFactory(orm);
        const myAuthor = factory.make(Author);
        console.log('myAuthor :', myAuthor);
    });
    afterAll(() => orm.close());

    it(`orm exists`, () => {
        expect(orm).toBeDefined();
    })
})
