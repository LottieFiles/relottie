/**
 * Copyright 2023 Design Barn Inc.
 */

import type { filesize } from 'filesize';

export type FileSizeOptions = Parameters<typeof filesize>[1];

export interface MetadataOption {
  /**
   * File size options
   */
  fileSize: {
    /**
     * Enable fileSize calculation (default: true)
     */
    enable: boolean;
    /**
     * If 'fileSize.enabled' is enabled you can control the fileSize options,
     * reference: https://github.com/avoidwork/filesize.js
     */
    options: FileSizeOptions;
  };
}

export type Options = Partial<MetadataOption>;

export const DEFAULT_FILESIZE_OPTIONS: FileSizeOptions = {
  bits: false,
  pad: false,
  base: 10,
  round: 2,
  locale: '',
  localeOptions: {},
  separator: '.',
  spacer: ' ',
  symbols: {},
  standard: 'iec',
  output: 'object',
  fullform: false,
  fullforms: [],
  exponent: -1,
  roundingMethod: 'round',
  precision: 0,
};

export const DEFAULT_OPTIONS: MetadataOption = {
  fileSize: {
    enable: true,
    options: DEFAULT_FILESIZE_OPTIONS,
  },
};
