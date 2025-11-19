/**
 * Copyright 2023 Design Barn Inc.
 */

import type { ArrayNode, Attribute, Collection, Element, ObjectNode } from '@lottiefiles/last';

export interface ParseOptions {
  /**
   * Optionally provides a synthetic root node (phantomRoot) that helps to prase any node or fragment
   * whose parent is not an animation root node. The phantomRoot must be a valid Parent node and is used exclusively
   * to provide parent context during parsing, such as for resolving titles. If not set, the parser always uses
   * the "animation" as the root node.
   */
  phantomRoot?: ArrayNode | ObjectNode | Attribute | Element | Collection;
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
