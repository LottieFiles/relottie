/**
 * Copyright 2022 Design Barn Inc.
 */

import type { Root, AnyTitle, NodeValue, KeyNode, PrimitiveNode } from '@lottiefiles/last';
import type { Plugin } from 'unified';
import { visitParents } from 'unist-util-visit-parents';
import type { Data, VFile } from 'vfile';

import { type Options } from './options.js';
import { isFeatureUsed } from './used-features.js';

export type UsedCount = number;

export type Used = Map<
  AnyTitle,
  {
    /**
     * Total unused count
     */
    n: UsedCount;
    /**
     * Map of parent titles to whether how many nodes is used or not_used in the parent
     */
    parents: Map<AnyTitle, { n: UsedCount; y: UsedCount }>;
    /**
     * Total used count
     */
    y: UsedCount;
  }
>;

export interface ExtractFeaturesFileData extends Data {
  'extract-features': Used;
}

type AncestorChildNode = Exclude<NodeValue, KeyNode>;
type AncestorNode = Exclude<AncestorChildNode, PrimitiveNode>;

const extractFeatures: Plugin<[Options?], Root> = (_ops: Options = {}) => {
  // const options = { ...DEFAULT_OPTIONS, ...ops };

  function transformer(tree: Root, file: VFile): void {
    const usedData: Used = new Map();

    visitParents(tree, (node: AncestorChildNode, ancestor: AncestorNode[]) => {
      if (
        node.type === 'Root' ||
        node.type === 'String' ||
        node.type === 'Number' ||
        node.type === 'Boolean' ||
        node.type === 'Null'
      )
        return;

      const feature = node.title;
      const parent = ancestor.at(-1);

      if (!parent) return;

      const parentTitle = parent.title;

      const featureData = usedData.has(feature)
        ? usedData.get(feature)
        : usedData
            .set(feature, {
              parents: new Map(),
              y: 0,
              n: 0,
            })
            .get(feature);

      if (!featureData) return;

      const parentsData = featureData.parents.has(parentTitle)
        ? featureData.parents.get(parentTitle)
        : featureData.parents
            .set(parentTitle, {
              y: 0,
              n: 0,
            })
            .get(parentTitle);

      if (!parentsData) return;

      const isUsed = isFeatureUsed(feature, node);

      if (isUsed) {
        featureData.y += 1;
        parentsData.y += 1;
      } else {
        featureData.n += 1;
        parentsData.n += 1;
      }
    });

    const data: ExtractFeaturesFileData = {
      'extract-features': usedData,
    };

    Object.assign(file.data, data);
  }

  return transformer;
};

export default extractFeatures;
