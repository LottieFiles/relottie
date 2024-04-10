/**
 * Copyright 2024 Design Barn Inc.
 */

import { filesize } from 'filesize';
import type { VFile } from 'vfile';

export interface FileSizeValue {
  /**
   * JSON string file's size
   */
  bytes: number;
  /**
   * full form of unit of measure
   */
  formated: ReturnType<typeof filesize>;
}

/**
 * reference: https://github.com/avoidwork/filesize.js
 */
export type FileSizeOptions = Parameters<typeof filesize>[1];

/**
 *
 * @param jsonFile - JSON file
 * @returns JSON file size in bytes
 */
export const getByteSize = (jsonFile: string | Buffer): number => {
  const data = new Blob([jsonFile]);

  return data.size;
};

/**
 * Converts bytes size to the closest unit byte symbol
 * Reference: https://stackoverflow.com/a/18650828
 * @param bytes - number in bytes
 * @param options - filesize lib options
 * @returns an object with bytes and formatted values
 */
export const formatBytes = (bytes: number, options: FileSizeOptions): FileSizeValue => {
  if (!Number(bytes)) return { bytes: 0, formated: '0 B' };

  return {
    bytes,
    formated: filesize(bytes, options),
  };
};

export const getFileSize = (file: VFile, settings: FileSizeOptions): FileSizeValue => {
  const lottieString = JSON.stringify(JSON.parse(file.value as string));
  const bytes = getByteSize(lottieString);

  return formatBytes(bytes, settings);
};

/**
 * Converts RGBA color array to Hex color string.
 * @param rgba - RGBA color array
 * @param file - VFile instance
 * @returns - Hex color string
 */
export function rgbaToHex(rgba: number[], file?: VFile): string {
  if (rgba.length > 4 || rgba.length < 3) {
    file?.message('RGBA color array must have 3 or 4 values.');

    return '';
  }

  const hexTokens = [];

  for (const val of rgba) {
    if (val < 0 || val > 1) {
      file?.message('RGBA color values must be between 0 and 1.');

      return '';
    }

    const hexToken = Math.round(val * 255).toString(16);

    hexTokens.push(hexToken.length === 1 ? `0${hexToken}` : hexToken);
  }

  return `#${hexTokens.join('')}`;
}

export const isHexValid = (value: string): boolean => /^#[\da-f]{6}$/iu.test(value);
