export type FixtureOptions =
  | string
  | ((faker?: Faker.FakerStatic) => string)
  | {
      ignore?: boolean;
      enum?: object;
      min?: number;
      max?: number;
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
