import { Author } from './entities/author.entity';
import { Book } from './entities/book.entity';
import { BaseEntity } from './entities/base.entity';
import { Address } from './entities/address.entity';
import { WithBadEnum } from './entities/with-bad-enum.entity';
import { BookTag } from './entities/book-tag.entity';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Options } from '@mikro-orm/core';
import { WithSpecialType } from './entities/with-special-type.entity';
import { WithSpecialTypeFixed } from './entities/with-special-type-fixed.entity';
import {
  AuthorWithCustomization,
  Book2,
  Address2,
} from './entities/author-with-customization';
import { Profile } from './entities/profile.entity';
import { User } from './entities/user.entity';

export default <Options>{
  metadataProvider: TsMorphMetadataProvider,
  entities: [
    BaseEntity,
    Author,
    Book,
    Address,
    WithBadEnum,
    BookTag,
    WithSpecialType,
    WithSpecialTypeFixed,
    AuthorWithCustomization,
    Book2,
    Address2,
    User,
    Profile,
  ],
  dbName: 'test.db',
  type: 'sqlite',
  debug: true,
  cache: {
    enabled: true,
    pretty: true,
    options: { cacheDir: process.cwd() + '/test/temp' },
  },
  highlight: true,
};
