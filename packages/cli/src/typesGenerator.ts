import {
  MikroORM,
  Utils,
  EntityName,
  EntityMetadata,
  EntityProperty,
} from 'mikro-orm';

export interface PathMapping {
  name: string;
  type: string;
}

export class TypesGenerator {
  constructor(private readonly orm: MikroORM) {}

  generateQueryMap<Entity = object>(entityName: EntityName<Entity>) {
    const meta = this.orm.getMetadata();
    const name = Utils.className(entityName);
    const entityMeta = meta.get(name);
    let result = `export interface ${name}QueryMap {`;
  }

  _getAllPathMappings(
    entityMeta: EntityMetadata,
    propsToIgnore: string[] = []
  ): PathMapping[] {
    const meta = this.orm.getMetadata();
    const paths = Object.values(entityMeta.properties).map(prop => {
      if (propsToIgnore.includes(prop.name)) return null;
      if (prop.reference === 'scalar') {
        return { name: prop.name, type: prop.type } as PathMapping;
      }
      let refSideProperty: string = '';
      switch (prop.reference) {
        case '1:m':
          refSideProperty =
            prop.mappedBy || this._findMappedBy(entityMeta, prop, 'm:1');
          break;
        case 'm:1':
          refSideProperty =
            prop.mappedBy || this._findMappedBy(entityMeta, prop, '1:m');
          break;
        case 'm:n':
        case '1:1':
          refSideProperty =
            prop.mappedBy ||
            this._findMappedBy(entityMeta, prop, prop.reference);
          break;
        default:
          throw new Error(`Unknow reference`);
      }

      const nestedPaths = this._getAllPathMappings(
        meta.get(Utils.className(prop.type)),
        [refSideProperty]
      );
      return [
        { name: prop.name, type: prop.type } as PathMapping,
        ...nestedPaths.filter(Boolean).map(
          v =>
            ({
              name: prop.name + '.' + v.name,
              type: v.type,
            } as PathMapping)
        ),
      ];
    });
    return [].concat.apply([], paths as any);
  }

  _getEntityPathMappings<Entity = object>(entityName: EntityName<Entity>) {
    const meta = this.orm.getMetadata();
    const name = Utils.className(entityName);
    const entityMeta = meta.get(name);
    return this._getAllPathMappings(entityMeta);
  }

  _getEntityPaths<Entity = object>(entityName: EntityName<Entity>) {
    const meta = this.orm.getMetadata();
    const name = Utils.className(entityName);
    const entityMeta = meta.get(name);
    return this._getAllPaths(entityMeta);
  }

  _getAllPaths(
    entityMeta: EntityMetadata,
    propsToIgnore: string[] = []
  ): any[] {
    const meta = this.orm.getMetadata();
    const paths = Object.values(entityMeta.properties).map(prop => {
      if (propsToIgnore.includes(prop.name)) return null;
      if (prop.reference === 'scalar') {
        return prop.name;
      }
      let refSideProperty: string = '';
      switch (prop.reference) {
        case '1:m':
          refSideProperty =
            prop.mappedBy || this._findMappedBy(entityMeta, prop, 'm:1');
          break;
        case 'm:1':
          refSideProperty =
            prop.mappedBy || this._findMappedBy(entityMeta, prop, '1:m');
          break;
        case 'm:n':
        case '1:1':
          refSideProperty =
            prop.mappedBy ||
            this._findMappedBy(entityMeta, prop, prop.reference);
          break;
        default:
          throw new Error(`Unknow reference`);
      }

      const nestedPaths = this._getAllPaths(
        meta.get(Utils.className(prop.type)),
        [refSideProperty]
      );
      return [
        prop.name,
        ...nestedPaths.filter(Boolean).map(v => [prop.name, v].join('.')),
      ];
    });
    return [].concat.apply([], paths as any);
  }

  _findMappedBy(
    entityMeta: EntityMetadata,
    prop: EntityProperty,
    reference: string
  ) {
    const refEntityMeta = this.orm.getMetadata().get(prop.type);
    for (const [key, refProp] of Object.entries(refEntityMeta.properties)) {
      if (refProp.reference === reference && refProp.type === entityMeta.name) {
        return refProp.name;
      }
    }
    throw new Error('');
  }
}
