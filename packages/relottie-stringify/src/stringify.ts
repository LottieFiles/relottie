/**
 * Copyright 2023 Design Barn Inc.
 */

import type { NodeValue } from '@lottiefiles/last';
import type { VFile, Data } from 'vfile';

import { evaluate } from './helpers.js';
import { DEFAULT_OPTIONS } from './options.js';
import type { StringifyOptions } from './options.js';
import type { SettingsOptions } from './unified-relottie-stringify';

export interface StringifyFileData extends Data {
  stringify?: object;
}

/**
 * Converts a Lottie AST back into the LottieJSON
 * @returns The JSON representation of the Lottie AST.
 */
export function stringify(node: NodeValue, _file: VFile, settings: SettingsOptions = {}): string {
  const options: StringifyOptions = { ...DEFAULT_OPTIONS, ...settings.stringify };

  const lottieJson = evaluate(node);

  return JSON.stringify(lottieJson, null, options.indent);
}
