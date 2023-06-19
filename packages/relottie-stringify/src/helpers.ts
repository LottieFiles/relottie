/**
 * Copyright 2023 Design Barn Inc.
 */

import type { NodeValue, Element, Collection, Attribute, Root, ObjectNode } from '@lottiefiles/last';

export type JSONValue = string | number | boolean | null | JSONObject | JSONArray;

export interface JSONObject {
  [x: string]: JSONValue;
}

export interface JSONArray extends Array<JSONValue> {}

/**
 * Evaluates a Lottie AST node into a JavaScript value.
 * @returns The JavaScript value for the node.
 */
export function evaluate(node: NodeValue): JSONValue {
  const getObjectValue = (objectLikeNode: Root | ObjectNode): JSONObject => {
    const objectValue: JSONObject = {};

    objectLikeNode.children.forEach((member: Element | Collection | Attribute) => {
      const key = typeof member.key === 'string' ? member.key : member.key.value;

      const value = member.children[0];

      if (value) {
        objectValue[key] = evaluate(value);
      }
    });

    return objectValue;
  };

  switch (node.type) {
    case 'primitive':
      switch (typeof node.value) {
        case 'number':
          return node.value;

        case 'string':
          return node.value;

        case 'boolean':
          return node.value;

        case 'object':
          return null;

        default:
          throw new Error(`Unknown Primitive type ${node.type}.`);
      }

    case 'attribute':
      return node.children[0] ? evaluate(node.children[0]) : null;

    case 'collection':
      return node.children[0] ? evaluate(node.children[0]) : null;

    case 'element':
      return node.children[0] ? evaluate(node.children[0]) : null;

    case 'array':
      return node.children.map(evaluate);

    case 'root':
      return getObjectValue(node);

    case 'object':
      return getObjectValue(node);

    default:
      throw new Error(`Unknown node type ${node.type}.`);
  }
}
