/**
 * Copyright 2024 Design Barn Inc.
 */

import { parse as jsonParse, traverse as jsonTraverse, type AnyNode as MomoaAnyNode } from '@humanwhocodes/momoa';
import type { Root, NodeValue, AnyTitle } from '@lottiefiles/last';
import { is } from 'unist-util-is';
import type { VFile, Data } from 'vfile';

import { traverseJsonEnter, traverseJsonExit, type MomoaParent } from './helpers.js';
import { DEFAULT_OPTIONS } from './options.js';
import type { ParseOptions } from './options.js';
import { Slots } from './slots.js';
import { Stack } from './stack.js';
import type { SettingsOptions } from './unified-relottie-parse.js';

export interface ParseFileData extends Data {
  parse?: object;
}

export interface Info {
  hasExpressions?: Root['hasExpressions'];
  slotIdTitles?: Map<string, AnyTitle>;
  slotPropCurrTitle?: AnyTitle;
  slots?: Slots;
}

/**
 * Computes the maximum bracket nesting depth of a JSON string without
 * building an AST. Characters inside string literals are ignored so that
 * braces/brackets within keys or values do not inflate the count. Runs in
 * O(n) and a few bytes of state — cheap enough to gate every parse.
 */
function getMaxNestingDepth(input: string): number {
  let depth = 0;
  let max = 0;
  let inString = false;
  let escaped = false;

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
    } else if (char === '{' || char === '[') {
      depth += 1;
      if (depth > max) max = depth;
    } else if (char === '}' || char === ']') {
      depth -= 1;
    }
  }

  return max;
}

// eslint-disable-next-line consistent-return
export function parse(document: string, file: VFile, settings: SettingsOptions = {}): NodeValue {
  const options: ParseOptions = { ...DEFAULT_OPTIONS, ...settings.parse };

  // Reject pathological input before handing it to momoa, whose parser and
  // traversal recurse over nesting and would otherwise throw an uncaught
  // `RangeError: Maximum call stack size exceeded` (a DoS for any host that
  // has not wrapped relottie itself).
  if (options.maxBytes > 0 && document.length > options.maxBytes) {
    file.fail(`Input size ${document.length} exceeds the maximum of ${options.maxBytes}`);
  }

  const depth = getMaxNestingDepth(document);

  if (depth > options.maxDepth) {
    file.fail(`JSON nesting depth ${depth} exceeds the maximum of ${options.maxDepth}`);
  }

  let jsonAst: ReturnType<typeof jsonParse>;

  try {
    jsonAst = jsonParse(document);
  } catch (error) {
    file.fail(`Failed to parse JSON: ${(error as Error).message}`);
  }

  const stack = new Stack<NodeValue>();

  const info: Info = { hasExpressions: false, slots: new Slots(file, options) };

  // momoa's `traverse` recurses over nesting and overflows at a shallower
  // depth than `parse` did. The pre-scan keeps the default safe, but a caller
  // that raises `maxDepth` could still drive `traverse` into an uncaught
  // `RangeError` — convert only that into a controlled failure, and rethrow
  // genuine `file.fail` errors raised by the visitor callbacks untouched.
  try {
    jsonTraverse(jsonAst, {
      enter(node, parent) {
        traverseJsonEnter(node as MomoaAnyNode, parent as MomoaParent, stack, file, options, info);
      },
      exit(node, parent) {
        traverseJsonExit(node as MomoaAnyNode, parent as MomoaParent, stack, file, options, info);
      },
    });
  } catch (error) {
    if (error instanceof RangeError) {
      file.fail(`Failed to traverse JSON: ${error.message}`);
    }

    throw error;
  }

  info.slots?.mutate();

  const tree = stack.pop();

  if (tree && options.phantomRoot) {
    return tree;
  } else if (is<Root>(tree, 'root')) {
    tree.hasExpressions = info.hasExpressions || false;

    return tree;
  } else {
    file.fail(`Stack's last item has to be "root" but it's "${tree ? tree.type : 'unknown'}"`, tree);
  }
}
