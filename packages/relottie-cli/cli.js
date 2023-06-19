#!/usr/bin/env node
/**
 * Copyright 2023 Design Barn Inc.
 */

import { createRequire } from 'node:module';

import { relottie } from '@lottiefiles/relottie';
import { args } from 'unified-args';

const require = createRequire(import.meta.url);

const proc = require('@lottiefiles/relottie/package.json');

const cli = require('./package.json');

const extensions = ['json'];

const name = 'relottie';

args({
  processor: relottie,
  name,
  description: cli.description,
  version: [`${name}: ${proc.version}`, `${cli.name}: ${cli.version}`].join(', '),
  pluginPrefix: `@lottiefiles/${name}`,
  packageField: `${name}Config`,
  rcName: `.${name}rc`,
  ignoreName: `.${name}ignore`,
  extensions,
});
