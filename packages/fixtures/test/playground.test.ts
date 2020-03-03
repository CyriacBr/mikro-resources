import { MikroORM, FileCacheAdapter, wrap } from 'mikro-orm';
import ormConfig from './mikro-orm.config';
import { join } from 'path';
import { Author } from './entities/author.entity';

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
        console.log('authorMeta :', authorMeta);
    });
    afterAll(() => orm.close());

    it(`orm exists`, () => {
        expect(orm).toBeDefined();
    })
})
