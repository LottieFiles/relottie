/**
 * Copyright 2023 Design Barn Inc.
 */

import parse, { type Options as ParseOptions, type ParseFileData } from '@lottiefiles/relottie-parse';
import stringify, { type Options as StringifyOptions, type StringifyFileData } from '@lottiefiles/relottie-stringify';
import { unified } from 'unified';

export type Options = Partial<{
  parse: ParseOptions;
  stringify: StringifyOptions;
}>;

export interface FileData extends ParseFileData, StringifyFileData {}

declare module 'unified' {
  interface Settings {
    parse?: ParseOptions;
    stringify?: StringifyOptions;
  }
}

export const relottie = unified().use(parse).use(stringify).freeze();
