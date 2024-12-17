/**
 * Copyright 2023 Design Barn Inc.
 */

export interface ParseOptions {
  /**
   * Include 'position' prop into nodes (default, true)
   */
  position: boolean;
}

export const DEFAULT_OPTIONS: ParseOptions = {
  position: true,
} as const;
