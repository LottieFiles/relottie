/**
 * Copyright 2022 Design Barn Inc.
 */

/* eslint-disable no-console */

import { readFileSync } from 'fs';

import relottieParse from '@lottiefiles/relottie-parse';
import { unified } from 'unified';

import relottieStringify, { type Options as StringifyOptions } from './src/index.js';

const path = '../../__fixtures__/extra/lolo.json';

const lottie = readFileSync(path, 'utf8');

const stringifyOptions: StringifyOptions = {};

const file = unified().use(relottieParse).use(relottieStringify, stringifyOptions).processSync(lottie);

const fileData = file.data;

console.log('fileData', fileData);

// writeFileSync('animation.json', file.toString());
