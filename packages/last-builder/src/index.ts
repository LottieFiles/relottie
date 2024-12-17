/**
 * Copyright 2023 Design Barn Inc.
 */

import { TITLES } from '@lottiefiles/last';
import type {
  Root,
  KeyValue,
  KeyNode,
  PrimitiveNode,
  PrimitiveNodeValue,
  ObjectNode,
  ObjectNodeValue,
  ObjectTitle,
  ArrayNode,
  ArrayNodeValue,
  Element,
  Collection,
  Attribute,
  Position,
  ArrayTitle,
  AttributeTitle,
  ElementTitle,
  CollectionTitle,
} from '@lottiefiles/last';
import { u } from 'unist-builder';

export interface Parts {
  position?: Position;
}

type Children<T> = T | T[];

function normalizeChildren<T>(children?: Children<T>): T[] {
  if (Array.isArray(children)) {
    return children;
  } else if (typeof children === 'function') {
    const res = children();

    return normalizeChildren(res);
  } else if (typeof children === 'undefined') {
    return [];
  } else {
    return [children];
  }
}

type MemberChild<T> = T | [T] | T[];

function normalizeMemberChild<T>(child?: MemberChild<T>): [T] | [] {
  if (Array.isArray(child)) {
    if (child.length > 0) {
      return [child[0]];
    } else {
      return [];
    }
  } else if (typeof child === 'function') {
    const res = child();

    return normalizeMemberChild(res);
  } else if (typeof child === 'undefined') {
    return [];
  } else {
    return [child];
  }
}

/**
 * Create a Primitive Node
 * @param value - Primitive's value, e.g. 7
 * @param parts - additional data props e.g. Position
 * @returns
 * - (last) PrimitiveNode
 * - if value is not PrimitiveNodeValue, return a String node with value "UNKNOWN"
 */
export const pt = (value?: PrimitiveNodeValue, parts?: Parts): PrimitiveNode => {
  if (value === null) {
    return u('Null', { value, ...parts });
  }

  switch (typeof value) {
    case 'string':
      return u('String', { value, ...parts });

    case 'number':
      return u('Number', { value, ...parts });

    case 'boolean':
      return u('Boolean', { value, ...parts });

    default:
      return u('String', { value: 'UNKNOWN', ...parts });
  }
};

/**
 * Create a Key node
 * @param value - Key property name. e.g "ef"
 * @param parts - additional data props e.g. Position
 * @returns (last) Key node
 */
export const ky = (value: string, parts?: Parts): KeyNode => {
  return u('Key', { ...parts }, value);
};

/**
 * Create an Object node
 * @param title - Lottie's qualified name. e.g. "anchor-point"
 * @param kids - Can have many children, ObjectNodeValue[]
 * @param parts - additional data props e.g. Position
 * @returns (last) Object node
 */
export const ob = (title: ObjectTitle, kids?: Children<ObjectNodeValue>, parts?: Parts): ObjectNode =>
  u(
    'Object',
    {
      title,
      ...parts,
    },
    [...normalizeChildren(kids)],
  );

/**
 * Create an Array node
 * @param title - Lottie's qualified name
 * @param kids - Can have many children, ArrayNodeValue[]
 * @param parts - additional data props e.g. Position
 * @returns (last) Array node
 */
export const ar = (title: ArrayTitle, kids?: Children<ArrayNodeValue>, parts?: Parts): ArrayNode =>
  u(
    'Array',
    {
      title,
      ...parts,
    },
    [...normalizeChildren(kids)],
  );

/**
 * Create an Attribute node
 * @param key - Object's key property
 * @param title - Lottie's qualified name
 * @param kid - Can have a single child only - [Primitive]
 * @param parts - additional data props e.g. Position
 * @returns (last) Attribute node
 */
export const at = (
  key: KeyValue,
  title: AttributeTitle,
  kid?: MemberChild<PrimitiveNode>,
  parts?: Parts,
): Attribute => {
  return u('Attribute', { key, title, ...parts }, normalizeMemberChild(kid));
};

/**
 * Create an Element node
 * @param key - Object's key property
 * @param title - Lottie's qualified name
 * @param kid - Can have a single child only, [ObjectNode]
 * @param parts - additional data props e.g. Position
 * @returns (last) Element node
 */
export const el = (key: KeyValue, title: ElementTitle, kid?: MemberChild<ObjectNode>, parts?: Parts): Element => {
  return u('Element', { key, title, ...parts }, normalizeMemberChild(kid));
};

/**
 * Create a Collection node
 * @param key - Object's key property
 * @param title - Lottie's qualified name
 * @param kid - Can have a single child only, [ArrayNode]
 * @param parts - additional data props e.g. Position
 * @returns (last) Collection node
 */
export const cl = (key: KeyValue, title: CollectionTitle, kid?: MemberChild<ArrayNode>, parts?: Parts): Collection => {
  return u('Collection', { key, title, ...parts }, normalizeMemberChild(kid));
};

/**
 * Create a Root node
 * @param kids - Can have many children, ObjectNodeValue[]
 * @param parts - additional data props e.g. Position
 * @returns (last) Root node
 */
export const rt = (kids?: Children<ObjectNodeValue>, parts?: Parts): Root => {
  return u(
    'Root',
    {
      title: TITLES.object.animation,
      hasExpressions: false,
      ...parts,
    },
    [...normalizeChildren(kids)],
  );
};
