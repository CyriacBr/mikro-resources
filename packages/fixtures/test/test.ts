import { MikroORM, FileCacheAdapter } from 'mikro-orm';
import ormConfig from './mikro-orm.config';
import { join } from 'path';

(async () => {
  // const orm = await MikroORM.init(ormConfig);

  // await orm.close();

  const adapter = new FileCacheAdapter(
    {
      cacheDir: join(__dirname, '../test/temp'),
    },
    join(__dirname, '..'),
    true
  );

  const authorJson = await adapter.get('Author');
  console.log('authorJson :', authorJson);
})();
