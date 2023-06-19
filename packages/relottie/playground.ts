/**
 * Copyright 2022 Design Barn Inc.
 */

/* eslint-disable no-console */

import { relottie, type Options } from './src/index.js';

const lottie = '{ "v": "6.0.0" }';

const options: Options = {
  parse: { position: false, valueType: false },
  stringify: {},
};

const processor = relottie().data('settings', options);

const tree = processor.parse(lottie);
const output = processor.stringify(tree);

console.log(output);
