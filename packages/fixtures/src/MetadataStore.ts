import {
  BaseMetadataStore,
  Class,
  ClassMetadata,
  PropertyMetadata,
  DefaultMetadataStore,
} from 'class-fixtures-factory';
import {
  MikroORM,
  Utils,
  EntityMetadata,
  ReferenceType,
} from '@mikro-orm/core';

export class MetadataStore extends BaseMetadataStore {
  private defaultStore = new DefaultMetadataStore(true);

  constructor(private readonly orm: MikroORM) {
    super();
  }

  make(classType: Class): ClassMetadata {
    const name = Utils.className(classType.name);
    const defaultMeta = this.defaultStore.make(classType);
    let meta: EntityMetadata;
    try {
      meta = this.orm.getMetadata().get(name);
    } catch (error) {
      return (this.store[name] = defaultMeta);
    }
    const classMetadata = <ClassMetadata>{
      name,
      properties: Object.values(meta.properties)
        .map(prop => {
          const defaultMetaProp = defaultMeta.properties.find(
            p => p.name === prop.name
          );
          if (prop.primary) return null;
          if (prop.type === 'method') return null;
          if (Array.isArray(prop.embedded)) {
            const parent = meta.properties[prop.embedded[0]];
            if (parent.reference === ReferenceType.EMBEDDED && parent.object) {
              return null;
            }
          }
          return <PropertyMetadata>{
            name: prop.name,
            type: defaultMetaProp?.typeFromDecorator
              ? defaultMetaProp.type
              : prop.type,
            array: ['1:m', 'm:n'].includes(prop.reference),
            enum: prop.enum,
            ignore: defaultMetaProp?.ignore,
            input: defaultMetaProp?.input,
            items: prop.items || defaultMetaProp?.items,
            max: defaultMetaProp?.max || 3,
            min: defaultMetaProp?.min || 1,
            scalar: prop.reference === 'scalar' || defaultMetaProp?.scalar,
          };
        })
        .filter(Boolean),
    };
    return (this.store[name] = classMetadata);
  }
}
