import { MikroORM, EntityName, Utils, EntityMetadata, EntityProperty } from "mikro-orm";
import { FixtureMetadata, FixtureOptions } from './decorator';
import * as faker from "faker";

export class FixturesFactory {

  constructor(private readonly orm: MikroORM) {}

  make<Entity = object>(entityName: EntityName<Entity>, propsToIgnore: string[] = []) {
    const meta = this.orm.getMetadata();
    const name = Utils.className(entityName);
    const entityMeta = meta.get(name);
    return this._make(entityMeta, entityName, propsToIgnore) as Entity;
  }

  _make(entityMeta: EntityMetadata, entityName: EntityName<any>, propsToIgnore: string[]) {
    const entity = this.orm.em.getRepository(entityName).create({});
    for (const [key, prop] of Object.entries(entityMeta.properties)) {
      const fixtureMeta = (FixtureMetadata[Utils.className(entityName)] || {})[key];
      if (propsToIgnore.includes(key)) continue;
      if (this._shouldIgnoreProperty(fixtureMeta, prop)) continue;
      entity[key] = this._makeProperty(fixtureMeta, prop, entityMeta);
    }
    return entity;
  }

  _makeProperty(fixtureMeta: FixtureOptions, prop: EntityProperty, entityMeta: EntityMetadata) {
    if (typeof fixtureMeta === "function") {
      return fixtureMeta(faker);
    } else if (typeof fixtureMeta === "string") {
      return faker.fake(fixtureMeta);
    }
    // Auto 
    switch (prop.reference) {
      case 'scalar':
        return this._makeScalarProperty(fixtureMeta, prop, entityMeta);
      case '1:m':
        return this._makeOneToManyProperty(fixtureMeta, prop, entityMeta);
      case 'm:1':
        return this._makeManyToOneProperty(fixtureMeta, prop, entityMeta);
      case '1:1':
        return this._makeOneToOneProperty(fixtureMeta, prop, entityMeta);
      default:
        break;
    }
    return null;
  }

  _shouldIgnoreProperty(fixtureMeta: FixtureOptions, prop: EntityProperty) {
    if (prop.type === "methpd") return true;
    if (typeof fixtureMeta === "object" && fixtureMeta.ignore) return true;
    return false;
  }

  _makeScalarProperty(fixtureMeta: FixtureOptions, prop: EntityProperty, entityMeta: EntityMetadata) {
    switch (prop.type) {
      case "string":
        return faker.random.word();
      case "number":
        return faker.random.number();
      case "date":
        return faker.date.recent();
      case "enum":
        if (typeof fixtureMeta === "object" && !!fixtureMeta.enum) {
          return faker.random.arrayElement(Object.keys(fixtureMeta.enum));
        }
        // Throw
        break;
      default:
        break;
    }
    return null;
  }

  _makeOneToManyProperty(fixtureMeta: FixtureOptions, prop: EntityProperty, entityMeta: EntityMetadata) {

  }

  _makeManyToOneProperty(fixtureMeta: FixtureOptions, prop: EntityProperty, entityMeta: EntityMetadata) {

  }

  _makeOneToOneProperty(fixtureMeta: FixtureOptions, prop: EntityProperty, entityMeta: EntityMetadata) {
      const refSideProperty = prop.mappedBy || this._findMappedBy(entityMeta, prop, "1:1");
      return this.make(prop.type, [refSideProperty]);
  }

  _findMappedBy(entityMeta: EntityMetadata, prop: EntityProperty, reference: string) {
    const refEntityMeta = this.orm.getMetadata().get(prop.type);
    for (const [key, refProp] of Object.entries(refEntityMeta.properties)) {
        if (refProp.reference === reference && refProp.type === entityMeta.name) {
          return refProp.name;
        }
    }
    throw new Error('');
  }
}