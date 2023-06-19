/**
 * Copyright 2022 Design Barn Inc.
 */

const { createConfig } = require('@lottiefiles/jest-config');

const { name: displayName } = require('./package.json');

module.exports = createConfig({
  displayName,

  globals: {
    'ts-jest': {
      useESM: true,
    },
  },

  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  transformIgnorePatterns: ['/node_modules/'],

  transformFormat: 'esm',
  transformTarget: 'es2020',
});
