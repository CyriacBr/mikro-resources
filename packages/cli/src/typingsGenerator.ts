import {
  MikroORM,
  Utils,
  EntityName,
  EntityMetadata,
  EntityProperty,
  Configuration,
} from '@mikro-orm/core';
import { MetadataStorage } from 'mikro-orm/dist/metadata';
import * as path from 'path';
import * as ts from 'typescript';
import * as fs from 'fs';
import { promisify } from 'util';

export interface PathMapping {
  name: string;
  type: string;
  prop: EntityProperty;
}

export interface TypingsGeneratorOptions {
  path?: string;
  simplified?: boolean; // if no, books: BookQuery | Book | Primary
}

export class TypingsGenerator {
  private cache: Record<string, PathMapping[]> = {};
  constructor(
    private readonly metadata: MetadataStorage,
    private readonly config: Configuration
  ) {}

  generate() {
    const entityNames = Object.keys(this.metadata.getAll()).filter(
      v => v[0] === v[0].toUpperCase()
    );
    const imports: string[] = [
      `import { Collection, Primary } from '@mikro-orm/core'`,
    ];
    const types: string[] = [
      `type OperatorMap<T> = {
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
      type WithOperatorMap<T> = {
        [K in keyof T]: T[K] extends Primary<T>
          ? WithOperatorMap<T[K]> | Primary<T>
          : OperatorMap<T[K]> | T[K];
      };`,
    ];

    for (const entityName of entityNames) {
      imports.push(this.generateEntityImport(entityName));
      types.push(this.generateEntityPathMapInterface(entityName));
      types.push(this.generateEntityQueryType(entityName));
    }

    return this.print(`
      ${imports.join('\n')}
      ${types.join('\n')}
      ${this.generateTypingsOverride(entityNames)}
    `);
  }

  generateAndWrite() {
    const content = this.generate();
    const cacheDir = this.config.get('cache').options!.cacheDir;
    const writePath = path.join(cacheDir, 'override.d.ts');
    return promisify(fs.writeFile)(writePath, content);
  }

  private generateTypingsOverride(entityNames: string[]) {
    if (entityNames.length === 0) return;

    let names = [...entityNames];
    const makeStatement = (type: string): string => {
      if (names.length === 0) return 'never';
      const name = names.shift();
      return `(T extends ${name} ? ${name}${type} : ${makeStatement(type)})`;
    };
    let populateStatement = makeStatement('PopulateQuery');
    names = [...entityNames];
    let queryStatement = makeStatement('Query');

    return `
    declare module 'mikro-orm/dist/typings' {
      export interface QueryTypes<T extends AnyEntity<T>> {
        _PopulateQuery: ${populateStatement};
        _Query: true extends IsEntity<T> ? ${queryStatement}
          : T extends Collection<infer K> ? ${queryStatement.replace(
            /\bT\b/g,
            'K'
          )}
          : never;
      }
    }`;
  }

  generateEntityPathMapInterface<Entity = object>(
    entityName: EntityName<Entity>
  ) {
    const name = Utils.className(entityName);
    const pathMappings = this.getEntityPathMappings(entityName);
    return `interface ${name}PathMap {
      ${pathMappings.map(val => `'${val.name}': ${val.type};`).join('\n')}
    }
    export type ${name}PopulateQuery = keyof ${name}PathMap`;
  }

  generateEntityQueryType<Entity = object>(entityName: EntityName<Entity>) {
    const name = Utils.className(entityName);
    const pathMappings = this.getEntityPathMappings(entityName);
    const result: any = {};

    const walk = (
      map: PathMapping,
      parent: any,
      childMaps: PathMapping[] = []
    ) => {
      if (!map.name.includes('.')) {
        parent[map.name] =
          map.prop.reference === 'scalar' ? map.type : `Base${map.type}Query`;
        return;
      }
      return;
      // if (!map.name.includes('.')) {
      //   parent[map.name] = map.type;
      //   return;
      // }
      // const parentProp = /(.*?)\..+/.exec(map.name)![1];
      // const childrenPaths = childMaps
      //   .filter(p => p.name.startsWith(parentProp + '.'))
      //   .map(v => ({
      //     ...v,
      //     name: v.name.replace(parentProp + '.', ''),
      //   }));
      // parent[parentProp] = {};
      // for (const childMap of childrenPaths) {
      //   walk(childMap, parent[parentProp], childrenPaths);
      // }
    };

    for (const map of pathMappings) {
      walk(map, result, pathMappings);
    }
    const queryString = JSON.stringify(result)
      .replace(/:\s*\{(.*?)\}/gi, '?: {$1}')
      .replace(/:\s*"(.*?)"/gi, '?: $1');
    return `type Base${name}Query = WithOperatorMap<${queryString}>;
    export type ${name}Query = Base${name}Query & OperatorMap<Base${name}Query>`;
  }

  generateEntityImport<Entity = object>(entityName: EntityName<Entity>) {
    const cacheDir = this.config.get('cache').options!.cacheDir;
    const name = Utils.className(entityName);
    const entityMeta = this.metadata.get(name);
    const importPath = path
      .relative(cacheDir, entityMeta.path)
      .replace(/\.ts$/gi, '');
    const importStatement = `import { ${name} } from '${importPath}';`;

    const enumProps = Object.values(entityMeta.properties).filter(
      v => !!v.enum
    );
    if (enumProps.length === 0) return importStatement;
    const enumsImportStatement = `import { ${enumProps
      .map(p => p.type)
      .join(',')} } from '${importPath}';`;
    return [importStatement, enumsImportStatement].join('\n');
  }

  getEntityPathMappings<Entity = object>(
    entityName: EntityName<Entity>,
    propsToIgnore: string[] = []
  ): PathMapping[] {
    const name = Utils.className(entityName);
    const cacheKey = `${[name, ...propsToIgnore].join(',')}`;
    if (this.cache[cacheKey]) return this.cache[cacheKey];

    const entityMeta = this.metadata.get(name);
    const paths = Object.values(entityMeta.properties).map(prop => {
      if (propsToIgnore.includes(prop.name)) return null;
      if (prop.reference === 'scalar') {
        return { name: prop.name, type: prop.type, prop } as PathMapping;
      }
      let mappedBy = this.findMappedBy(prop, entityMeta);

      const nestedPaths = this.getEntityPathMappings(prop.type, [mappedBy]);
      return [
        { name: prop.name, type: prop.type, prop } as PathMapping,
        ...nestedPaths.filter(Boolean).map(
          v =>
            ({
              name: prop.name + '.' + v.name,
              type: v.type,
              prop: v.prop,
            } as PathMapping)
        ),
      ];
    });
    // Flatten
    const mapping = [].concat.apply([], paths as any);
    this.cache[cacheKey] = mapping;
    return mapping;
  }

  private findMappedBy(prop: EntityProperty, entityMeta: EntityMetadata) {
    if (prop.mappedBy) return prop.mappedBy;

    let reference: string = '';
    switch (prop.reference) {
      case '1:m':
        reference = 'm:1';
        break;
      case 'm:1':
        reference = '1:m';
        break;
      case 'm:n':
      case '1:1':
        reference = prop.reference;
        break;
      default:
        throw new Error(`Unknow reference "${prop.reference}"`);
    }
    const refEntityMeta = this.metadata.get(prop.type);
    for (const refProp of Object.values(refEntityMeta.properties)) {
      if (refProp.reference === reference && refProp.type === entityMeta.name) {
        return refProp.name;
      }
    }
    throw new Error(
      `Couldn't find mappedBy property of ${entityMeta.className}.${prop.name}`
    );
  }

  private print(content: string) {
    const printer: ts.Printer = ts.createPrinter();
    const sourceFile: ts.SourceFile = ts.createSourceFile(
      'content.ts',
      content,
      ts.ScriptTarget.ES2017,
      true,
      ts.ScriptKind.TS
    );
    return printer.printFile(sourceFile);
  }
}
