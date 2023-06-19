/**
 * Copyright 2023 Design Barn Inc.
 */

import type { Root } from '@lottiefiles/last';
import parse, { type Options as ParseOptions, type FileData as ParseFileData } from '@lottiefiles/relottie-parse';
import stringify, { type Options as StringifyOptions } from '@lottiefiles/relottie-stringify';
import { unified, type FrozenProcessor } from 'unified';

export type Options = Partial<{
  parse: ParseOptions;
  stringify: StringifyOptions;
}>;

export interface FileData extends ParseFileData {}

export const relottie: FrozenProcessor<Root, Root, Root, string> = unified().use(parse).use(stringify).freeze();
