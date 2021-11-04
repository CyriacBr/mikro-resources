import { FactoryResult, FixtureFactory } from 'class-fixtures-factory';
import { EntityClass } from '@mikro-orm/core/typings';
import { MikroORM } from '@mikro-orm/core';

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export class FactoryResultWrapper<T> {
  private input?: DeepPartial<T>;
  private propsToIgnore: (keyof T)[] = [];

  constructor(
    private orm: MikroORM,
    private factory: FixtureFactory,
    private entityName: EntityClass<T>
  ) {
    this.orm = orm;
    this.factory = factory;
    this.entityName = entityName;
  }

  with(input: DeepPartial<T>): FactoryResultWrapper<T> {
    this.input = input;
    return this;
  }

  ignore(...props: (keyof T)[]): FactoryResultWrapper<T> {
    this.propsToIgnore = props;
    return this;
  }

  one(): T {
    return this.unwrappedResult().one();
  }

  many(x: number): T[] {
    return this.unwrappedResult().many(x);
  }

  async oneAndPersist(): Promise<T> {
    const entity = this.one();
    await this.orm.em.persistAndFlush(entity);
    return entity;
  }

  async manyAndPersist(x: number): Promise<T[]> {
    const entities = this.many(x);
    await this.orm.em.persistAndFlush(entities);
    return entities;
  }

  private unwrappedResult(): FactoryResult<T> {
    let result = this.factory.make(this.entityName as any);

    if (this.input) {
      result = result.with(this.input as any);
    }

    if (this.propsToIgnore) {
      result = result.ignore(...this.propsToIgnore);
    }

    return result;
  }
}
