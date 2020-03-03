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
        
        const meta = orm.getMetadata();
        const authorMeta = meta.get('Author');
        const addressMeta = meta.get('Address');
        const bookMeta = meta.get('Book');
        console.log('bookMeta :', bookMeta);
        //console.log('authorMeta :', authorMeta);
        //console.log('addressMeta :', addressMeta);
    });
    afterAll(() => orm.close());

    it(`orm exists`, () => {
        expect(orm).toBeDefined();
    })
})
