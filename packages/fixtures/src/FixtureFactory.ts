import {
  FixtureFactory as FF,
  FactoryOptions,
  PropertyMetadata,
  Class,
} from 'class-fixtures-factory';
import { MetadataStore } from './MetadataStore';
import { MikroORM, Collection } from '@mikro-orm/core';
import { EntityClass } from '@mikro-orm/core/typings';
import { FactoryResultWrapper } from './FactoryResultWrapper';

export class FixtureFactory {
  private factory: FF;

  constructor(private readonly orm: MikroORM, options?: FactoryOptions) {
    this.factory = new FF(options);
    const store = new MetadataStore(orm);
    this.factory.setMetadataStore(store);
    this.registerAllEntities();
    this.factory.setAssigner(this.assigner.bind(this));
  }

  register(classTypes: Class[]) {
    this.factory.register(classTypes);
  }

  private registerAllEntities() {
    const metadata = this.orm.getMetadata();
    const entityNames = Object.keys(metadata.getAll()).filter(
      (v) => v[0] === v[0].toUpperCase()
    );
    for (const name of entityNames) {
      const classType = metadata.get(name).class;
      this.register([classType]);
    }
  }

  private assigner(prop: PropertyMetadata, obj: any, value: any) {
    // TODO: find a better way to detect Collections
    if (Array.isArray(value) && obj[prop.name].add) {
      (obj[prop.name] as Collection<any>).add(...value);
    } else {
      obj[prop.name] = value;
    }
  }

  make<Entity = object>(
    entityName: EntityClass<Entity>
  ): FactoryResultWrapper<Entity> {
    return new FactoryResultWrapper(this.orm, this.factory, entityName);
  }
}
