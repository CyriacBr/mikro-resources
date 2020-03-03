import { Author } from './entities/author.entity';
import { Book } from './entities/book.entity';
import { BaseEntity } from './entities/base.entity';

export default {
  entities: [BaseEntity, Author, Book],
  dbName: 'mikro_resources_fixture_test',
  type: 'mysql',
  debug: true,
  cache: {
    enabled: true,
    pretty: true, 
    options: { cacheDir: process.cwd() + '/test/temp' }
  }
};