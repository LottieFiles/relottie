/**
 * Copyright 2023 Design Barn Inc.
 */

import { TITLES } from '@lottiefiles/last';
import type {
  AnyTitle,
  ObjectNode,
  Attribute,
  Element,
  Collection,
  ArrayNode,
  Primitive,
  Root,
} from '@lottiefiles/last';

const { element: ET, intBoolean: IBT, number: NT, object: OT } = TITLES;

export type NodeWithTitle = Root | ArrayNode | ObjectNode | Attribute | Element | Collection;

export type IsFeatureUsedChecker<T = NodeWithTitle> = (node: T) => boolean;

export const collectionNodeChecker: IsFeatureUsedChecker<Collection> = (node): boolean => {
  const valueNode = node.children[0];

  if (!valueNode) {
    return false;
  } else if (valueNode.children.length > 0) {
    return true;
  } else {
    return false;
  }
};

export const objectNodeChecker: IsFeatureUsedChecker<ObjectNode> = (node): boolean => {
  const valueNode = node.children[0];

  if (!valueNode) {
    return false;
  } else if (valueNode.children.length > 0) {
    return true;
  } else {
    return false;
  }
};

export const elementNodeChecker: IsFeatureUsedChecker<Element> = (node): boolean => {
  const objectNode = node.children[0];

  if (!objectNode) return false;

  return objectNodeChecker(objectNode);
};

export const primitiveNodeChecker: IsFeatureUsedChecker<Primitive> = (node): boolean => {
  const value = node.value;

  switch (typeof value) {
    case 'string':
      if (value.length === 0) {
        return false;
      }

      return true;

    default:
      return true;
  }
};

export const attributeValueChecker: IsFeatureUsedChecker<Attribute> = (node): boolean => {
  const nodeValue = node.children[0];

  if (!nodeValue) return false;

  return primitiveNodeChecker(nodeValue);
};

export const arrayNodeChecker: IsFeatureUsedChecker<ArrayNode> = (node): boolean => {
  return node.children.length > 0;
};

export const intBooleanNodeChecker: IsFeatureUsedChecker<Attribute> = (node, defaultValue: number = 0): boolean => {
  const valueNode = node.children[0];

  if (!valueNode) return false;

  const value = valueNode.value;

  if (typeof value !== 'number') {
    return false;
  } else if (value === defaultValue) {
    return false;
  } else {
    return true;
  }
};

export const timeStretchChecker: IsFeatureUsedChecker<Attribute> = (node): boolean => {
  const title = node.title;

  if (title !== NT.timeStretch) return false;

  const valueNode = node.children[0];

  if (!valueNode) return false;

  const value = valueNode.value;

  if (typeof value !== 'number') {
    return false;
  } else if (value > 0 && value !== 1) {
    return true;
  } else {
    return false;
  }
};

/**
 * If dilate's (aka Mask Expansion) or Transform Skew is set to a non-animated static value of 0, then it's disabled and not used.
 */
export const animatedValueStaticChecker: IsFeatureUsedChecker<Element> = (node): boolean => {
  const valueNode = node.children[0];

  if (!valueNode) return false;

  if (valueNode.title !== OT.animatedValueStatic) return objectNodeChecker(valueNode);

  for (const childNode of valueNode.children) {
    if (childNode.title !== NT.staticValue) continue;

    const staticValueNode = childNode.children[0];

    if (staticValueNode?.value === 0) return false;

    return true;
  }

  return true;
};

export const FEATURE_CHECKERS = new Map<
  AnyTitle,
  | IsFeatureUsedChecker<Attribute>
  | IsFeatureUsedChecker<Element>
  | IsFeatureUsedChecker<Collection>
  | IsFeatureUsedChecker<ObjectNode>
  | IsFeatureUsedChecker<ArrayNode>
>([
  [IBT.threedimensional, intBooleanNodeChecker],
  [IBT.layerThreedimensional, intBooleanNodeChecker],
  [IBT.autoOrient, intBooleanNodeChecker],
  [IBT.extraComposition, intBooleanNodeChecker],
  [IBT.embedded, intBooleanNodeChecker],
  [IBT.hold, intBooleanNodeChecker],
  [IBT.enabled, intBooleanNodeChecker],
  [IBT.collapseTransformNew, intBooleanNodeChecker],
  [IBT.expressible, intBooleanNodeChecker],
  [IBT.randomize, intBooleanNodeChecker],
  [IBT.matteTarget, intBooleanNodeChecker],
  [NT.timeStretch, timeStretchChecker],
  [ET.dilate, animatedValueStaticChecker],
  [ET.layerTransformSkew, animatedValueStaticChecker],
  [ET.shapeTransformSkew, animatedValueStaticChecker],
  [ET.transformRepeaterSkew, animatedValueStaticChecker],
  [ET.textStyleSkew, animatedValueStaticChecker],
]);

export const isFeatureUsed = (feature: AnyTitle, node: NodeWithTitle): boolean => {
  if (FEATURE_CHECKERS.has(feature)) {
    const checkerFn = FEATURE_CHECKERS.get(feature);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return checkerFn ? checkerFn(node) : true;
  }

  switch (node.type) {
    case 'attribute':
      return attributeValueChecker(node);

    case 'element':
      return elementNodeChecker(node);

    case 'collection':
      return collectionNodeChecker(node);

    case 'array':
      return arrayNodeChecker(node);

    case 'object':
      return objectNodeChecker(node);

    default:
      return true;
  }
};
