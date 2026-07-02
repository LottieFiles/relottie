/**
 * Copyright 2023 Design Barn Inc.
 */

export interface StringifyOptions {
  /**
   * Adds indentation, white space, and line break characters to the return-value Lottie JSON text to make it easier to read.
   */
  indent: number;
  /**
   * Maximum AST nesting depth `evaluate` will recurse through before bailing
   * out. Guards against stack-overflow denial-of-service from a
   * pathologically deep tree (real-world Lottie nests no deeper than ~20).
   * (default, 1024)
   */
  maxDepth: number;
}

export const DEFAULT_OPTIONS: StringifyOptions = {
  indent: 0,
  maxDepth: 1024,
} as const;
