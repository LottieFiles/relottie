/**
 * Copyright 2022 Design Barn Inc.
 */

import { parse as jsonParse, traverse as jsonTraverse } from '@humanwhocodes/momoa';
import type { Root, NodeValue } from '@lottiefiles/last';
import { is } from 'unist-util-is';
import type { VFile, Data } from 'vfile';

import { traverseJsonEnter, traverseJsonExit } from './helpers.js';
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
  slots?: Slots;
}

// eslint-disable-next-line consistent-return
export function parse(document: string, file: VFile, settings: SettingsOptions = {}): Root {
  const jsonAst = jsonParse(document, { tokens: false });

  const options: ParseOptions = { ...DEFAULT_OPTIONS, ...settings.parse };

  const stack = new Stack<NodeValue>();

  const info: Info = { hasExpressions: false, slots: new Slots(file, options) };

  jsonTraverse(jsonAst, {
    enter(node: Momoa.AstNode, parent: Momoa.AstParent) {
      traverseJsonEnter(node, parent, stack, file, options);
    },
    exit(node: Momoa.AstNode, parent: Momoa.AstParent) {
      traverseJsonExit(node, parent, stack, file, options, info);
    },
  });

  info.slots?.mutateNodeTitles();

  const tree = stack.pop();

  if (is<Root>(tree, 'root')) {
    tree.hasExpressions = info.hasExpressions || false;

    return tree;
  } else {
    file.fail(`Stack's last item has to be "root" but it's "${tree?.type}"`, tree);
  }
}
