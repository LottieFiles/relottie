/**
 * Copyright 2023 Design Barn Inc.
 */

import type { ArrayNode, Collection, Element, Attribute } from '@lottiefiles/last';

export interface ParseOptions {
  /**
   * Optionally provides a phantom node that helps to parse a node
   * or fragment whose parent is not an animation root node.
   */
  phantomRoot?: ArrayNode | Collection | Element | Attribute;
  /**
   * Include 'position' prop into nodes (default, true)
   */
  position: boolean;
  /**
   * Include 'valueType' prop into nodes (default, true)
   */
  valueType: boolean;
}

export const DEFAULT_OPTIONS: ParseOptions = {
  position: true,
  valueType: true,
} as const;
