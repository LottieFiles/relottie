/**
 * Copyright 2024 Design Barn Inc.
 */

import { TITLES } from '@lottiefiles/last';
import type { Root, Attribute, Collection, ObjectNode } from '@lottiefiles/last';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import type { Data, VFile } from 'vfile';

import type { FileSizeValue } from './helpers.js';
import { getFileSize, isHexValid, rgbaToHex } from './helpers.js';
import { type Options, DEFAULT_OPTIONS } from './options.js';

const { collection: CT, number: NT, object: OT, string: ST } = TITLES;

export interface Metadata {
  /**
   * Set of hex colors used in the animation.
   */
  colors: Set<string>;
  /** *
   * Size of the Lottie JSON
   */
  fileSize?: FileSizeValue;
  /**
   * Framerate in frames per second
   */
  framerate: number;
  /**
   * Total number of frames in the animation.
   */
  frames: number;
  /**
   * Generator of the animation.
   */
  generator: string;
  /**
   * Height of the animation.
   */
  height: number;
  /**
   * Which frame the animation starts at (usually 0)
   */
  inPoint: number;
  /**
   * Which frame the animation stops/loops at, which makes this the duration in frames
   */
  outPoint: number;
  /**
   * Version of the Lottie JSON.
   */
  version: string;
  /**
   * Width of the animation.
   */
  width: number;
}

export interface MetadataFileData extends Data {
  metadata: Metadata;
}

/**
 * Process Attribute node for collecting metadata.
 *
 * @param node - Attribute node
 * @param data - Metadata object
 * @param parent - Parent node
 * @returns void
 */
const processAttributeNode = (node: Attribute, data: Metadata, parent: ObjectNode): void => {
  const valueNode = node.children[0];

  if (!valueNode) return;

  const value = valueNode.value;

  if (!value) return;

  const nodeTitle = node.title;

  switch (typeof value) {
    case 'number':
      switch (nodeTitle) {
        case NT.framerate:
          if (parent.title !== OT.animation) return;
          data.framerate = value;
          break;

        case NT.width:
          if (parent.title !== OT.animation) return;
          data.width = value;
          break;

        case NT.height:
          if (parent.title !== OT.animation) return;
          data.height = value;
          break;

        case NT.inPoint:
          if (parent.title !== OT.animation) return;
          data.inPoint = value;
          break;

        case NT.outPoint:
          if (parent.title !== OT.animation) return;
          data.outPoint = value;
          break;

        default:
          break;
      }

      break;

    case 'string':
      switch (nodeTitle) {
        case ST.version:
          data.version = value;
          break;

        case ST.generator:
          data.generator = value;
          break;

        case ST.hexColor:
          if (isHexValid(value)) data.colors.add(value.toLowerCase());

          break;

        case ST.themeColor:
          if (isHexValid(value)) data.colors.add(value.toLowerCase());

          break;

        default:
          break;
      }
      break;

    default:
      break;
  }
};

/**
 * Get RGBa color string from ColorRgba node.
 *
 * @param node - ColorRgba node
 * @returns - RGBa color string
 */
const getRgbaFromNode = (node: Collection): number[] => {
  const valueNode = node.children[0];

  if (!valueNode) return [];

  const rgbaColor = valueNode.children.reduce((acc, child) => {
    if (child.type !== 'primitive') return acc;

    const childValue = child.value;

    if (typeof childValue === 'number') {
      acc.push(childValue);
    }

    return acc;
  }, [] as number[]);

  return rgbaColor;
};

/**
 * Process Collection node for collecting metadata.
 *
 * @param node - Collection node
 * @param data - Metadata object
 * @param options - Plugin options
 * @param file - VFile instance
 */
const processCollectionNode = (node: Collection, data: Metadata, file: VFile): void => {
  const nodeTitle = node.title;

  switch (nodeTitle) {
    case CT.colorRgba:
      const rgba = getRgbaFromNode(node);

      const hex = rgbaToHex(rgba, file).toLowerCase();

      if (isHexValid(hex)) data.colors.add(hex);
      break;

    default:
      break;
  }
};

const metadata: Plugin<[Options?], Root> = (ops: Options = {}) => {
  const options = { ...DEFAULT_OPTIONS, ...ops };

  function transformer(tree: Root, file: VFile): void {
    const meta: Metadata = {
      colors: new Set(),
      framerate: 0,
      frames: 0,
      inPoint: 0,
      outPoint: 0,
      generator: '',
      height: 0,
      version: '',
      width: 0,
    };

    visit(tree, (node, _index, parent) => {
      switch (node.type) {
        case 'Attribute':
          processAttributeNode(node, meta, parent as ObjectNode);

          break;

        case 'Collection':
          processCollectionNode(node, meta, file);

          break;

        default:
          break;
      }
    });

    if (options.fileSize.enable) {
      Object.assign(meta, { fileSize: getFileSize(file, options.fileSize.options) });
    }

    meta.frames = meta.outPoint - meta.inPoint;

    const fileData: MetadataFileData = {
      metadata: meta,
    };

    Object.assign(file.data, fileData);
  }

  return transformer;
};

export default metadata;
