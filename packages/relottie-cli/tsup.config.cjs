/**
 * Copyright 2022 Design Barn Inc.
 */

const { defineConfig } = require('tsup');

module.exports = defineConfig({
  bundle: false,
  clean: true,
  dts: true,
  entry: ['./cli.js'],
  format: ['esm'],
  metafile: false,
  minify: true,
  outDir: 'dist',
  platform: 'node',
  sourcemap: false,
  splitting: false,
  target: ['es2020', 'node18'],
  tsconfig: 'tsconfig.build.json',
});
