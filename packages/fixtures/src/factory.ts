import { MikroORM, EntityName, Utils, EntityMetadata, EntityProperty } from "mikro-orm";
import { FixtureMetadata, FixtureOptions } from './decorator';
import * as faker from "faker";

export class FixturesFactory {

  constructor(private readonly orm: MikroORM) {}

  make<Entity = object>(entityName: EntityName<Entity>) {
    const meta = this.orm.getMetadata();
    const name = Utils.className(entityName);
    const entityMeta = meta.get(name);
    return this._make(entityMeta, entityName) as Entity;
  }

  private _make(entityMeta: EntityMetadata, entityName: EntityName<any>) {
    const entity = this.orm.em.getRepository(entityName).create({});
    for (const [key, prop] of Object.entries(entityMeta.properties)) {
      const fixtureMeta = FixtureMetadata[Utils.className(entityName)][key];
      if (this.shouldIgnoreProperty(fixtureMeta, prop)) continue;
      entity[key] = this.makeProperty(fixtureMeta, prop, entityMeta);
    }
    return entity;
  }

  private makeProperty(fixtureMeta: FixtureOptions, prop: EntityProperty, entityMeta: EntityMetadata) {
    if (typeof fixtureMeta === "function") {
      return fixtureMeta(faker);
    } else if (typeof fixtureMeta === "string") {
      return faker.fake(fixtureMeta);
    }
    // Auto 
    switch (prop.reference) {
      case 'scalar':
        return this.makeScalarProperty(fixtureMeta, prop, entityMeta);
      case '1:m':
        return this.makeOneToManyProperty(fixtureMeta, prop, entityMeta);
      case 'm:1':
        return this.makeManyToOneProperty(fixtureMeta, prop, entityMeta);
      case '1:1':
        return this.makeOneToOneProperty(fixtureMeta, prop, entityMeta);
      default:
        break;
    }
    return null;
  }

  private shouldIgnoreProperty(fixtureMeta: FixtureOptions, prop: EntityProperty) {
    if (prop.type === "methpd") return true;
    if (typeof fixtureMeta === "object" && fixtureMeta.ignore) return true;
    return false;
  }

  private makeScalarProperty(fixtureMeta: FixtureOptions, prop: EntityProperty, entityMeta: EntityMetadata) {
    switch (prop.type) {
      case "string":
        return faker.random.word();
      case "number":
        return faker.random.number();
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

  private makeOneToManyProperty(fixtureMeta: FixtureOptions, prop: EntityProperty, entityMeta: EntityMetadata) {

  }

  private makeManyToOneProperty(fixtureMeta: FixtureOptions, prop: EntityProperty, entityMeta: EntityMetadata) {

  }

  private makeOneToOneProperty(fixtureMeta: FixtureOptions, prop: EntityProperty, entityMeta: EntityMetadata) {
      const refEntity = this.make(prop.type);
      const refEntityMeta = this.orm.getMetadata().get(prop.type);
      for (const [key, refProp] of Object.entries(refEntityMeta.properties)) {
          
      }
  }
}