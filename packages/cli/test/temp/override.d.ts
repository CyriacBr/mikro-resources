import { Collection } from 'mikro-orm';
import { Author } from '../entities/author.entity';
import { Mood } from '../entities/author.entity';
import { Book } from '../entities/book.entity';
import { BookType } from '../entities/book.entity';
import { Address } from '../entities/address.entity';
import { BookTag } from '../entities/book-tag.entity';
export interface AuthorPathMap {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  age: number;
  mood: Mood;
  books: Book;
  'books.id': number;
  'books.createdAt': Date;
  'books.updatedAt': Date;
  'books.name': string;
  'books.onSale': boolean;
  'books.type': BookType;
  'books.tags': BookTag;
  'books.tags.id': number;
  'books.tags.createdAt': Date;
  'books.tags.updatedAt': Date;
  'books.tags.label': string;
  address: Address;
  'address.id': number;
  'address.createdAt': Date;
  'address.updatedAt': Date;
  'address.city': string;
}
type AuthorPopulateQuery = keyof AuthorPathMap;
type BaseAuthorQuery = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  age: number;
  mood: Mood;
  books: {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    onSale: boolean;
    type: BookType;
    tags: {
      id: number;
      createdAt: Date;
      updatedAt: Date;
      label: string;
    };
  };
  address: {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    city: string;
  };
};
type AuthorQuery = BaseAuthorQuery | OperatorMap<BaseAuthorQuery>;
export interface BookPathMap {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  onSale: boolean;
  type: BookType;
  author: Author;
  'author.id': number;
  'author.createdAt': Date;
  'author.updatedAt': Date;
  'author.name': string;
  'author.age': number;
  'author.mood': Mood;
  'author.address': Address;
  'author.address.id': number;
  'author.address.createdAt': Date;
  'author.address.updatedAt': Date;
  'author.address.city': string;
  tags: BookTag;
  'tags.id': number;
  'tags.createdAt': Date;
  'tags.updatedAt': Date;
  'tags.label': string;
}
type BookPopulateQuery = keyof BookPathMap;
type BaseBookQuery = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  onSale: boolean;
  type: BookType;
  author: {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    age: number;
    mood: Mood;
    address: {
      id: number;
      createdAt: Date;
      updatedAt: Date;
      city: string;
    };
  };
  tags: {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    label: string;
  };
};
type BookQuery = BaseBookQuery | OperatorMap<BaseBookQuery>;
export interface AddressPathMap {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  city: string;
  author: Author;
  'author.id': number;
  'author.createdAt': Date;
  'author.updatedAt': Date;
  'author.name': string;
  'author.age': number;
  'author.mood': Mood;
  'author.books': Book;
  'author.books.id': number;
  'author.books.createdAt': Date;
  'author.books.updatedAt': Date;
  'author.books.name': string;
  'author.books.onSale': boolean;
  'author.books.type': BookType;
  'author.books.tags': BookTag;
  'author.books.tags.id': number;
  'author.books.tags.createdAt': Date;
  'author.books.tags.updatedAt': Date;
  'author.books.tags.label': string;
}
type AddressPopulateQuery = keyof AddressPathMap;
type BaseAddressQuery = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  city: string;
  author: {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    age: number;
    mood: Mood;
    books: {
      id: number;
      createdAt: Date;
      updatedAt: Date;
      name: string;
      onSale: boolean;
      type: BookType;
      tags: {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        label: string;
      };
    };
  };
};
type AddressQuery = BaseAddressQuery | OperatorMap<BaseAddressQuery>;
export interface BookTagPathMap {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  label: string;
  books: Book;
  'books.id': number;
  'books.createdAt': Date;
  'books.updatedAt': Date;
  'books.name': string;
  'books.onSale': boolean;
  'books.type': BookType;
  'books.author': Author;
  'books.author.id': number;
  'books.author.createdAt': Date;
  'books.author.updatedAt': Date;
  'books.author.name': string;
  'books.author.age': number;
  'books.author.mood': Mood;
  'books.author.address': Address;
  'books.author.address.id': number;
  'books.author.address.createdAt': Date;
  'books.author.address.updatedAt': Date;
  'books.author.address.city': string;
}
type BookTagPopulateQuery = keyof BookTagPathMap;
type BaseBookTagQuery = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  label: string;
  books: {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    onSale: boolean;
    type: BookType;
    author: {
      id: number;
      createdAt: Date;
      updatedAt: Date;
      name: string;
      age: number;
      mood: Mood;
      address: {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        city: string;
      };
    };
  };
};
type BookTagQuery = BaseBookTagQuery | OperatorMap<BaseBookTagQuery>;
type OperatorMap<T> = {
  $and?: T[];
  $or?: T[];
  $eq?: T;
  $ne?: T;
  $in?: T[];
  $nin?: T[];
  $not?: T;
  $gt?: T;
  $gte?: T;
  $lt?: T;
  $lte?: T;
  $like?: string;
  $re?: string;
};
declare module 'mikro-orm/dist/typings' {
  type ModdedQuery<T> = QueryTypes<T>['_Query'];
  export interface QueryTypes<T extends AnyEntity<T>> {
    _PopulateQuery: T extends Author
      ? AuthorPopulateQuery
      : T extends Book
      ? BookPopulateQuery
      : T extends Address
      ? AddressPopulateQuery
      : T extends BookTag
      ? BookTagPopulateQuery
      : never;
    _Query: true extends IsEntity<T>
      ? T extends Author
        ? AuthorQuery
        : T extends Book
        ? BookQuery
        : T extends Address
        ? AddressQuery
        : T extends BookTag
        ? BookTagQuery
        : never
      : T extends Collection<infer K>
      ? K extends Author
        ? AuthorQuery
        : K extends Book
        ? BookQuery
        : K extends Address
        ? AddressQuery
        : K extends BookTag
        ? BookTagQuery
        : never
      : never;
  }
}
