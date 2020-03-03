import { MikroORM, EntityName, Utils, EntityMetadata, EntityProperty } from "mikro-orm";
import { FixtureMetadata, FixtureOptions } from './decorator';
import * as faker from "faker";

export class FixturesFactory {

  constructor(private readonly orm: MikroORM) {}

  make<Entity>(entityName: EntityName<Entity>) {
    const meta = this.orm.getMetadata();
    const name = Utils.className(entityName);
    const entityMeta = meta.get(name);
  }

  private _make(entityMeta: EntityMetadata, entityName: EntityName<any>) {
    const entity = this.orm.em.getRepository(entityName).create({});
    for (const [key, value] of Object.entries(entityMeta.properties)) {
      const fixtureMeta = FixtureMetadata[Utils.className(entityName)][key];
    }
  }

  private makeProperty(fixtureMeta: FixtureOptions, prop: EntityProperty) {
    if (typeof fixtureMeta === "function") {
      return fixtureMeta();
    } else if (typeof fixtureMeta === "string") {
      return faker.fake(fixtureMeta);
    }
    switch (prop.reference) {
      case 'scalar':
        
        break;
    
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

  private makeScalarProperty(fixtureMeta: FixtureOptions, prop: EntityProperty) {
    switch (prop.type) {
      case "string":
        return faker.random.word();
      case "number":
        return faker.random.number();
      case "enum":
        if (typeof fixtureMeta === "object" && !!fixtureMeta.enum) {
          return faker.random.arrayElement(Object.keys(fixtureMeta.enum));
        }
        break;
      default:
        break;
    }
    return null;
  }
}