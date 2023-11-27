/**
 * Copyright 2023 Design Barn Inc.
 */

export interface ParseOptions {
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
