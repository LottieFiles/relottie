/**
 * Copyright 2023 Design Barn Inc.
 */

export interface StringifyOptions {
  /**
   * Adds indentation, white space, and line break characters to the return-value Lottie JSON text to make it easier to read.
   */
  indent: number;
}

export const DEFAULT_OPTIONS: StringifyOptions = {
  indent: 0,
} as const;
