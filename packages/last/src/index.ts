/**
 * Copyright 2022 Design Barn Inc.
 */

import type {
  Node as UnistNode,
  Parent as UnistParent,
  Literal as UnistLiteral,
  Position as UnistPosition,
  Point as UnistPoint,
  Data as UnistData,
} from 'unist';

import type {
  AttributeTitle,
  CollectionTitle,
  ElementTitle,
  ObjectTitle,
  ArrayTitle,
  AnyTitle,
  TITLES,
} from './titles.js';

export * from './titles.js';

// -----------------------------------------------------------------------------
// Unist
// -----------------------------------------------------------------------------

export interface Node extends UnistNode {}

export interface Parent extends UnistParent {
  /**
   * Lottie's qualified name.
   */
  title: AnyTitle;
}

export interface Literal extends UnistLiteral {}

export interface Position extends UnistPosition {}

export interface Point extends UnistPoint {}

export interface Data extends UnistData {}

// -----------------------------------------------------------------------------
// General
// -----------------------------------------------------------------------------

export type PrimitiveValueType = 'string' | 'number' | 'boolean' | 'null';

export type PrimitiveValue = string | number | boolean | null;

export interface Primitive extends Literal {
  type: 'primitive';
  value: PrimitiveValue;
  valueType?: PrimitiveValueType;
}

export interface KeyNode extends Literal {
  type: 'key';
  value: string;
}

export type Key = string;

export type KeyValue = KeyNode | Key;

/**
 * Base interface for Element, Collection & Attribute
 */
interface Member extends Parent {
  /**
   * Property's key
   */
  key: KeyValue;
  title: AttributeTitle | CollectionTitle | ElementTitle;
}

export type ObjectNodeValue = Attribute | Element | Collection;

export interface ObjectNode extends Parent {
  children: ObjectNodeValue[];
  title: ObjectTitle;
  type: 'object';
}

export type ArrayNodeValue = Primitive | ObjectNode | ArrayNode;

export interface ArrayNode extends Parent {
  children: ArrayNodeValue[];
  title: ArrayTitle;
  type: 'array';
}

export interface Attribute extends Member {
  children: [Primitive] | [];
  title: AttributeTitle;
  type: 'attribute';
}

export interface Element extends Member {
  children: [ObjectNode] | [];
  title: ElementTitle;
  type: 'element';
}

export interface Collection extends Member {
  children: [ArrayNode] | [];
  title: CollectionTitle;
  type: 'collection';
}

/**
 * Top level Node, describing the Lottie animation
 */
export interface Root extends Omit<ObjectNode, 'type'> {
  /**
   * whether the animation contains expressions
   */
  hasExpressions: boolean;
  title: typeof TITLES.object.animation;
  type: 'root';
}

export type NodeValue = Root | Primitive | KeyNode | ArrayNode | ObjectNode | Attribute | Element | Collection;

export type NodeValueType = NodeValue['type'];
