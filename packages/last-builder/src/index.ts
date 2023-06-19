/**
 * Copyright 2023 Design Barn Inc.
 */

import { TITLES } from '@lottiefiles/last';
import type {
  Root,
  KeyValue,
  KeyNode,
  Primitive,
  PrimitiveValue,
  PrimitiveValueType,
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

export interface PrimitiveParts<T> extends Parts {
  valueType?: T;
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

function normalizePrimitiveValue<T>(value: T): T | string {
  if (value === undefined) {
    return 'empty';
  } else {
    return value;
  }
}

/**
 * Create a Primitive Node
 * @param value - Primitive's value,  e.g. 7
 * @param parts - additional data props e.g. Position
 * @returns (last) Primitive node
 */
export const pt = (value?: PrimitiveValue, parts?: PrimitiveParts<PrimitiveValueType>): Primitive => {
  return u('primitive', { value: normalizePrimitiveValue(value) as PrimitiveValue, ...parts });
};

/**
 * Create a Key node
 * @param value - Key property name. e.g "ef"
 * @param parts - additional data props e.g. Position
 * @returns (last) Key node
 */
export const ky = (value: string, parts?: Parts): KeyNode => {
  return u('key', { ...parts }, value);
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
    'object',
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
    'array',
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
export const at = (key: KeyValue, title: AttributeTitle, kid?: MemberChild<Primitive>, parts?: Parts): Attribute => {
  return u('attribute', { key, title, ...parts }, normalizeMemberChild(kid));
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
  return u('element', { key, title, ...parts }, normalizeMemberChild(kid));
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
  return u('collection', { key, title, ...parts }, normalizeMemberChild(kid));
};

/**
 * Create a Root node
 * @param kids - Can have many children, ObjectNodeValue[]
 * @param parts - additional data props e.g. Position
 * @returns (last) Root node
 */
export const rt = (kids?: Children<ObjectNodeValue>, parts?: Parts): Root => {
  return u(
    'root',
    {
      title: TITLES.object.animation,
      hasExpressions: false,
      ...parts,
    },
    [...normalizeChildren(kids)],
  );
};
