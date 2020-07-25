import { Author } from './entities/author.entity';
import { Book } from './entities/book.entity';
import { BaseEntity } from './entities/base.entity';
import { Address } from './entities/address.entity';
import { WithBadEnum } from './entities/with-bad-enum.entity';
import { BookTag } from './entities/book-tag.entity';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Options } from '@mikro-orm/core';

export default <Options>{
  metadataProvider: TsMorphMetadataProvider,
  entities: [BaseEntity, Author, Book, Address, WithBadEnum, BookTag],
  // dbName: 'test.db',
  // type: 'sqlite',
  dbName: 'mikro-resources-fixtures',
  type: 'mysql',
  user: 'root',
  password: 'root',
  debug: true,
  cache: {
    enabled: true,
    pretty: true,
    options: { cacheDir: process.cwd() + '/test/temp' },
  },
  highlight: true,
};
