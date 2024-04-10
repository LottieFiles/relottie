/**
 * Copyright 2024 Design Barn Inc.
 */

const { createConfig } = require('@lottiefiles/jest-config');

const { name: displayName } = require('./package.json');

module.exports = createConfig({
  displayName,

  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  transformIgnorePatterns: ['/node_modules/'],

  transformFormat: 'esm',
  transformTarget: 'es2020',
});
