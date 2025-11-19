/**
 * Copyright 2023 Design Barn Inc.
 */

import type { NodeValue } from '@lottiefiles/last';
import parse, { type Options as ParseOptions, type ParseFileData } from '@lottiefiles/relottie-parse';
import stringify, { type Options as StringifyOptions, type StringifyFileData } from '@lottiefiles/relottie-stringify';
import { unified, type FrozenProcessor } from 'unified';

export type Options = Partial<{
  parse: ParseOptions;
  stringify: StringifyOptions;
}>;

export interface FileData extends ParseFileData, StringifyFileData {}

export const relottie: FrozenProcessor<NodeValue, NodeValue, NodeValue, string> = unified()
  .use(parse)
  .use(stringify)
  .freeze();
