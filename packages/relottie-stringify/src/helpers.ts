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
 * Default maximum AST nesting depth `evaluate` will recurse through before
 * bailing out. Guards against stack-overflow denial-of-service from a
 * pathologically deep tree (well beyond any real-world Lottie, which nests
 * ~20 levels).
 */
export const DEFAULT_MAX_EVALUATE_DEPTH = 1024;

/**
 * Evaluates a Lottie AST node into a JavaScript value.
 * @param node - The AST node to evaluate.
 * @param maxDepth - Maximum recursion depth before bailing out with a `RangeError`.
 * @param depth - Current recursion depth (internal).
 * @returns The JavaScript value for the node.
 */
export function evaluate(node: NodeValue, maxDepth: number = DEFAULT_MAX_EVALUATE_DEPTH, depth = 0): JSONValue {
  if (depth > maxDepth) {
    throw new RangeError(`relottie-stringify: AST nesting depth exceeds the maximum of ${maxDepth}`);
  }

  const getObjectValue = (objectLikeNode: Root | ObjectNode): JSONObject => {
    // Null-prototype object: keys originate from AST member names, so a
    // `__proto__` key must be stored as plain data, not invoke the setter.
    const objectValue: JSONObject = Object.create(null);

    objectLikeNode.children.forEach((member: Element | Collection | Attribute) => {
      const key = typeof member.key === 'string' ? member.key : member.key.value;

      const value = member.children[0];

      if (value) {
        objectValue[key] = evaluate(value, maxDepth, depth + 1);
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
      return node.children[0] ? evaluate(node.children[0], maxDepth, depth + 1) : null;

    case 'collection':
      return node.children[0] ? evaluate(node.children[0], maxDepth, depth + 1) : null;

    case 'element':
      return node.children[0] ? evaluate(node.children[0], maxDepth, depth + 1) : null;

    case 'array':
      return node.children.map((child) => evaluate(child, maxDepth, depth + 1));

    case 'root':
      return getObjectValue(node);

    case 'object':
      return getObjectValue(node);

    default:
      throw new Error(`Unknown node type ${node.type}.`);
  }
}
