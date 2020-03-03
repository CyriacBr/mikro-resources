import { Author } from './entities/author.entity';
import { Book } from './entities/book.entity';
import { BaseEntity } from './entities/base.entity';
import { Address } from './entities/address.entity';

export default {
  entities: [BaseEntity, Author, Book, Address],
  dbName: 'test.db',
  type: 'sqlite',
  debug: true,
  cache: {
    enabled: true,
    pretty: true, 
    options: { cacheDir: process.cwd() + '/test/temp' }
  }
};