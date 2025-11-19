/**
 * Copyright 2022 Design Barn Inc.
 */

import type { NodeValue, Root } from '@lottiefiles/last';
import type { ParserFunction, Plugin } from 'unified';

import type { ParseOptions } from './options.js';
import { parse } from './parse.js';

export type Options = Partial<ParseOptions>;

/**
 * Include other plugins' options
 */
export interface SettingsOptions extends Record<string, unknown> {
  parse?: Options;
}

const relottieParse: Plugin<[Options?], string, Root> = function relottieParse(options: Options = {}): void {
  const settings = (this.data('settings') || { parse: {} }) as SettingsOptions;

  settings.parse = { ...settings.parse, ...options };

  const parser: ParserFunction<NodeValue> = (doc, file) => {
    return parse(doc, file, settings);
  };

  Object.assign(this, { Parser: parser });
};

export default relottieParse;
