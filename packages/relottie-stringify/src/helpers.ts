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
    case 'Number':
      return node.value;

    case 'String':
      return node.value;

    case 'Boolean':
      return node.value;

    case 'Null':
      return null;

    case 'Attribute':
      return node.children[0] ? evaluate(node.children[0]) : null;

    case 'Collection':
      return node.children[0] ? evaluate(node.children[0]) : null;

    case 'Element':
      return node.children[0] ? evaluate(node.children[0]) : null;

    case 'Array':
      return node.children.map(evaluate);

    case 'Root':
      return getObjectValue(node);

    case 'Object':
      return getObjectValue(node);

    default:
      throw new Error(`Unknown node type ${node.type}.`);
  }
}
