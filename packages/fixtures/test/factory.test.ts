import { MikroORM, FileCacheAdapter, wrap } from 'mikro-orm';
import ormConfig from './mikro-orm.config';
import { join } from 'path';
import { Author } from './entities/author.entity';
import { FixturesFactory } from '../src/factory';
import { WithBadEnum } from './entities/with-bad-enum.entity';
import { Address } from './entities/address.entity';

describe(`Factory`, () => {
    let orm: MikroORM;
    let factory: FixturesFactory;

    beforeAll(async () => {
        orm = await MikroORM.init(ormConfig);
        await orm.getSchemaGenerator().dropSchema();
        await orm.getSchemaGenerator().createSchema()
        factory = new FixturesFactory(orm);
    });
    afterAll(() => orm.close());

    it(`orm exists`, () => {
        expect(orm).toBeDefined();
    });

    describe(`scalar properties`, () => {
        let author: Author;
        beforeAll(() => {
            author = factory.make(Author).get();
        });

        it(`string`, () => {
            expect(author.name).toBeDefined();
            expect(typeof author.name === "string").toBe(true);
        });

        it(`number`, () => {
            expect(author.age).toBeDefined();
            expect(typeof author.age === "number").toBe(true);
        });

        it(`date`, () => {
            expect(author.createdAt).toBeInstanceOf(Date);
        });

        describe(`enum`, () => {
            it(`throws without @Fixture({ enum: EnumType })`, () => {
                expect(() => factory.make(WithBadEnum).get()).toThrow();
            });
            it(`works with @Fixture({ enum: EnumType })`, () => {
                expect(["GOOD","BAD","NEUTRAL"].includes(author.mood.toString())).toBe(true);
            });
        })
    });

    describe(`relations`, () => {
        let author: Author;
        beforeAll(() => {
            author = factory.make(Author).get();
            console.log('author :', author);
        });

        it(`1:1`, () => {
            expect(author.address).toBeInstanceOf(Address);
        });
    });
})
