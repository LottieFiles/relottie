/**
 * Copyright 2023 Design Barn Inc.
 */

/* eslint-disable no-console */

import { readFileSync } from 'fs';

import type { Root } from '@lottiefiles/last';
import type { CompilerFunction, Plugin } from 'unified';
import { unified } from 'unified';
// import { reporter } from 'vfile-reporter';

import relottieParse from './src/index.js';

function emptyCompiler(this: Plugin<[], Root, string>): void {
  const compiler: CompilerFunction<Root, string> = (_tree, file): string => {
    file.data['test'] = 'hi';

    return '';
  };

  Object.assign(this, { Compiler: compiler });
}

const path = '../../__fixtures__/features/switch.json';

const lottieJsonFile = readFileSync(path, 'utf8');

const processor = unified().use(relottieParse, { warningMessage: true }).use(emptyCompiler);

// const tree = processor.parse(lottieJsonFile);
// console.log(tree);

const vfile = processor.processSync(lottieJsonFile);

// console.log(reporter(vfile));

console.log(vfile.data);

// writeFileSync('lottie.json', JSON.stringify(tree, null, 2), 'utf8');
