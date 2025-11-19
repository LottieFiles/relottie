/**
 * Copyright 2022 Design Barn Inc.
 */

import type { NodeValue } from '@lottiefiles/last';
import type { Plugin, CompilerFunction } from 'unified';

import type { StringifyOptions } from './options.js';
import { stringify } from './stringify.js';

export type Options = Partial<StringifyOptions>;

/**
 * Include other plugins' options
 */
export interface SettingsOptions extends Record<string, unknown> {
  stringify?: Options;
}

const relottieStringify: Plugin<[Options?], NodeValue, string> = function relottieStringify(options: Options = {}) {
  const settings = (this.data('settings') || { stringify: {} }) as SettingsOptions;

  settings.stringify = { ...settings.stringify, ...options };

  const compiler: CompilerFunction<NodeValue, string> = (tree: NodeValue, file) => {
    return stringify(tree, file, settings);
  };

  Object.assign(this, { Compiler: compiler });
};

export default relottieStringify;
