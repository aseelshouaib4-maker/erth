import * as migration_20261005_125523_initial from './20261005_125523_initial';

export const migrations = [
  {
    up: migration_20261005_125523_initial.up,
    down: migration_20261005_125523_initial.down,
    name: '20261005_125523_initial'
  },
];
