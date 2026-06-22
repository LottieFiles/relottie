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
  /**
   * Maximum JSON nesting depth allowed in the input document. Guards
   * against stack-overflow denial-of-service from deeply nested untrusted
   * JSON (real-world Lottie files nest no deeper than ~20). (default, 1024)
   */
  maxDepth: number;
  /**
   * Maximum input size, in UTF-16 code units (string length). Documents
   * larger than this are rejected before parsing. `0` disables the check.
   * (default, 0 — disabled)
   */
  maxBytes: number;
}

export const DEFAULT_OPTIONS: ParseOptions = {
  position: true,
  valueType: true,
  maxDepth: 1024,
  maxBytes: 0,
} as const;
