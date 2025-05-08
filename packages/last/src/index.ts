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

export interface StringNode extends Literal {
  type: 'String';
  value: string;
}

export interface NumberNode extends Literal {
  type: 'Number';
  value: number;
}

export interface BooleanNode extends Literal {
  type: 'Boolean';
  value: boolean;
}

export interface NullNode extends Literal {
  type: 'Null';
  value: null;
}

export type PrimitiveNodeType = StringNode['type'] | NumberNode['type'] | BooleanNode['type'] | NullNode['type'];

export type PrimitiveNodeValue = StringNode['value'] | NumberNode['value'] | BooleanNode['value'] | NullNode['value'];

export type PrimitiveNode = StringNode | NumberNode | BooleanNode | NullNode;

export interface KeyNode extends Literal {
  type: 'Key';
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
  type: 'Object';
}

export type ArrayNodeValue = PrimitiveNode | ObjectNode | ArrayNode;

export interface ArrayNode extends Parent {
  children: ArrayNodeValue[];
  title: ArrayTitle;
  type: 'Array';
}

export interface Attribute extends Member {
  children: [PrimitiveNode] | [];
  title: AttributeTitle;
  type: 'Attribute';
}

export interface Element extends Member {
  children: [ObjectNode] | [];
  title: ElementTitle;
  type: 'Element';
}

export interface Collection extends Member {
  children: [ArrayNode] | [];
  title: CollectionTitle;
  type: 'Collection';
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
  type: 'Root';
}

export type NodeValue = Root | PrimitiveNode | KeyNode | ArrayNode | ObjectNode | Attribute | Element | Collection;

export type NodeValueType = NodeValue['type'];
