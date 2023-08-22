/**
 * Copyright 2022 Design Barn Inc.
 */

const { defineConfig } = require('tsup');

module.exports = defineConfig({
  bundle: true,
  clean: true,
  dts: true,
  entry: ['./src/*.ts'],
  format: ['esm'],
  metafile: false,
  minify: true,
  outDir: 'dist',
  platform: 'neutral',
  sourcemap: true,
  splitting: true,
  treeshake: true,
  target: ['es2020', 'node18'],
  tsconfig: 'tsconfig.build.json',
});
