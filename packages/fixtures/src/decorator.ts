export type FixtureOptions =
  | string
  | (() => string)
  | {
      ignore?: boolean;
      enum?: object;
    };

export const FixtureMetadata: {
  [entityName: string]: {
    [prop: string]: FixtureOptions;
  };
} = {};

export function Fixture(options: FixtureOptions) {
  return function(target: Object, key: string | symbol) {
    const name = target.constructor.name;
    FixtureMetadata[name] = {
      ...FixtureMetadata[name],
      [key.toString()]: options,
    };
  };
}
