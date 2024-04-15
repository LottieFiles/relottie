/**
 * Copyright 2024 Design Barn Inc.
 */

import relottieParse from '@lottiefiles/relottie-parse';
import relottieStringify from '@lottiefiles/relottie-stringify';
import { readSync } from 'to-vfile';
import { unified } from 'unified';

import relottieMetadata from './src/index.js';

const lottiePath = '../../__fixtures__/extra/sale.json';

const vfile = unified()
  .use(relottieParse)
  .use(relottieMetadata)
  .use(relottieStringify)
  .processSync(readSync(lottiePath));

// eslint-disable-next-line no-console
console.log(JSON.stringify(vfile.data['metadata'], null, 2));
