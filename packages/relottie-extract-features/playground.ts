/**
 * Copyright 2022 Design Barn Inc.
 */

import relottieParse from '@lottiefiles/relottie-parse';
import relottieStringify from '@lottiefiles/relottie-stringify';
import { readSync } from 'to-vfile';
import { unified } from 'unified';

import relottieExtractFeatures from './src/index.js';

const lottiePath = '../../__fixtures__/features/image.json';

const vfile = unified()
  .use(relottieParse)
  .use(relottieExtractFeatures)
  .use(relottieStringify)
  .processSync(readSync(lottiePath));

// eslint-disable-next-line no-console
console.log(vfile.data['extract-features']);
