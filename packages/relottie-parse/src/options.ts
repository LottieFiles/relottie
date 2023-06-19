/**
 * Copyright 2023 Design Barn Inc.
 */

export interface ParseOptions {
  /**
   * controls which vfile messages to include into vfile.data
   */
  messages: {
    /**
     * include 'warning' type messages into vfile.data (default, false)
     */
    warning: boolean;
  };
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
  messages: {
    warning: false,
  },
} as const;
