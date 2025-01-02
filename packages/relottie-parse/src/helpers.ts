/**
 * Copyright 2024 Design Barn Inc.
 */

import type {
  AnyNode as MomoaAnyNode,
  ObjectNode as MomoaObject,
  ArrayNode as MomoaArray,
  BooleanNode as MomoaBoolean,
  StringNode as MomoaString,
  NumberNode as MomoaNumber,
  NullNode as MomoaNull,
  MemberNode as MomoaMember,
  ValueNode as MomoaValue,
  NaNNode as MomoaNan,
  InfinityNode as MomoaInfinity,
  IdentifierNode as MomoaIdentifier,
  ContainerNode as MomoaContainerNode,
} from '@humanwhocodes/momoa';
import type {
  ArrayNode,
  Collection,
  Element,
  Attribute,
  KeyValue,
  ObjectNode,
  PrimitiveNode,
  Root,
  NodeValue,
  ObjectNodeValue,
  Position,
  AnyTitle,
  ParentTitle,
  ElementTitle,
  CollectionTitle,
  AttributeTitle,
  ArrayTitle,
  ObjectTitle,
} from '@lottiefiles/last';
import {
  ar as arrayNode,
  at as attributeNode,
  cl as collectionNode,
  el as elementNode,
  ky as keyNode,
  ob as objectNode,
  pt as primitiveNode,
  rt as rootNode,
} from '@lottiefiles/last-builder';
import { is } from 'unist-util-is';
import type { VFile } from 'vfile';

import { fileConstants } from './constants.js';
import type { Dependent } from './entities.js';
import { getMemberEntity, getNoKeyEntity } from './entities.js';
import type { ParseOptions } from './options.js';
import type { Info } from './parse.js';
import type { Stack } from './stack.js';

export type MomoaParent = MomoaContainerNode | MomoaArray | MomoaObject | undefined;

export type MomoaPrimitive =
  | MomoaBoolean
  | MomoaNumber
  | MomoaString
  | MomoaNull
  | MomoaNan
  | MomoaInfinity
  | MomoaIdentifier;

/**
 * Converts Momoa position into the Last position style if the related option is enabled
 * @param node - Momoa Node
 * @param options - Parse Options
 * @returns Last position prop or empty object
 */
const createPositionProp = (node: MomoaAnyNode, options: ParseOptions): { position?: Position } => {
  if (options.position) {
    return {
      position: { ...node.loc },
    };
  } else {
    return {};
  }
};

export const getPrimitiveNodeValue = (node: MomoaPrimitive): string | number | boolean | null => {
  switch (node.type) {
    case 'Boolean':
      return node.value;

    case 'Number':
      return node.value;

    case 'String':
      return node.value;

    case 'Null':
      return null;

    case 'NaN':
      return null;

    case 'Infinity':
      return null;

    case 'Identifier':
      return null;

    default:
      return null;
  }
};

const createPrimitiveNode = (node: MomoaPrimitive, options: ParseOptions): PrimitiveNode => {
  const position = createPositionProp(node, options);
  const value = getPrimitiveNodeValue(node);

  return primitiveNode(value, { ...position });
};

const createKeyNode = (node: MomoaMember, options: ParseOptions): KeyValue => {
  const value = node.name.type === 'String' ? node.name.value : node.name.name;

  if (options.position) {
    const position = createPositionProp(node.name, options);

    return keyNode(value, { ...position });
  } else {
    return value;
  }
};

const createMemberNode = (node: MomoaMember, parentTitle: ParentTitle, options: ParseOptions): ObjectNodeValue => {
  const keyValue = createKeyNode(node, options);
  const key = typeof keyValue === 'string' ? keyValue : keyValue.value;
  const position = createPositionProp(node, options);
  const parts = {
    ...position,
  };

  const { title } = getMemberEntity(key, node, parentTitle);

  switch (node.value.type) {
    case 'Array':
      return collectionNode(keyValue, title as CollectionTitle, [], { ...parts });

    case 'Object':
      return elementNode(keyValue, title as ElementTitle, [], { ...parts });

    default:
      return attributeNode(keyValue, title as AttributeTitle, [], { ...parts });
  }
};

const isMomoaMemberValue = (node: MomoaPrimitive, parent: MomoaMember): boolean => {
  const nodeType = node.type;

  if (nodeType === 'Identifier' || nodeType === 'NaN' || nodeType === 'Infinity') return false;

  return parent.loc.end.column === node.loc.end.column;
};

function assertNodeType<T extends NodeValue>(
  node: NodeValue | undefined,
  type: T['type'],
  file: VFile,
): asserts node is T {
  if (!is<T>(node, type)) {
    file.fail(`Unexpected node type found ${node?.type}, has to be ${type}`);
  }
}
const getMembersFromArrNode = (node: MomoaArray): MomoaMember[] => {
  const members: MomoaMember[] = [];

  node.elements.forEach((element) => {
    const elementValue = element.value;

    if (is<MomoaObject>(elementValue, 'Object')) {
      elementValue.members.forEach((member) => members.push(member));
    }
  });

  return members;
};
const getTitleFromMemberValue = (
  node: MomoaValue,
  parentNodeTitle: ParentTitle,
  dependent: Dependent,
  file: VFile,
): AnyTitle | undefined => {
  const { key, resultTitle, type } = dependent;

  switch (type) {
    case 'Constant':
      if (!is<MomoaString>(node, 'String') && !is<MomoaNumber>(node, 'Number')) break;

      const { defaultValue, prefix, values } = resultTitle;

      const defaultConstTitle = values[defaultValue];

      if (!defaultConstTitle)
        throw new Error(`[${parentNodeTitle}] '${defaultValue}' has to present in "dependent.parentTitle.values"`);

      const nodeValue = node.value;
      const constTitle = values[nodeValue];

      if (!constTitle) {
        const message = `[${parentNodeTitle}] '${nodeValue}' is missing in "dependent.parentTitle.values"`;

        file.message(message, node, fileConstants.sourceId);
      }

      const title = typeof constTitle === 'undefined' ? defaultConstTitle : constTitle;

      return (prefix && prefix.length > 0 ? `${prefix}-${title}` : title) as AnyTitle;

    case 'Array':
      if (!is<MomoaArray>(node, 'Array')) break;
      const childType = dependent.childType;

      const matchedMember = childType ? node.elements.find((element) => element.value.type === childType) : undefined;

      if (!matchedMember) return undefined;

      return resultTitle;

    default:
      if (type !== node.type) {
        const message = `${parentNodeTitle}'s '${key}' type is ${node.type} but has to be ${type}`;

        file.message(message, node, fileConstants.sourceId);

        return undefined;
      }

      return resultTitle;
  }

  return undefined;
};

const getDependentTitle = (
  parentTitle: ParentTitle,
  members: MomoaMember[],
  dependents: Dependent[],
  file: VFile,
): AnyTitle | undefined => {
  const membersKeyValueMap = members.reduce((acc, member) => {
    const memberName = member.name;
    const key = memberName.type === 'String' ? memberName.value : memberName.name;

    acc[key] = member.value;

    return acc;
  }, {} as Record<string, MomoaValue>);

  for (const dependent of dependents) {
    const { key } = dependent;
    const memberNodeValue = membersKeyValueMap[key];

    if (!memberNodeValue) continue;

    const title = getTitleFromMemberValue(memberNodeValue, parentTitle, dependent, file);

    if (title) return title;
  }

  return undefined;
};
const getObjectNodeTitle = (node: MomoaObject, parentNodeTitle: ParentTitle, file: VFile): ObjectTitle => {
  const entity = getNoKeyEntity(node, parentNodeTitle);

  const { defaultResult: defaultTitle, dependents } = entity;

  if (!dependents) return defaultTitle as ObjectTitle;

  const title = getDependentTitle(parentNodeTitle, node.members, dependents, file);

  return (title || defaultTitle) as ObjectTitle;
};
const getArrayNodeTitle = (node: MomoaArray, parentNodeTitle: ParentTitle, file: VFile): ArrayTitle => {
  const entity = getNoKeyEntity(node, parentNodeTitle);

  const { defaultResult: defaultTitle, dependents } = entity;

  if (!dependents) return defaultTitle as ArrayTitle;

  const members = getMembersFromArrNode(node);

  const title = getDependentTitle(parentNodeTitle, members, dependents, file);

  return (title || defaultTitle) as ArrayTitle;
};

export const traverseJsonEnter = (
  node: MomoaAnyNode,
  parent: MomoaParent,
  stack: Stack<NodeValue>,
  file: VFile,
  options: ParseOptions,
): void => {
  const position = createPositionProp(node, options);

  switch (node.type) {
    case 'Document':
      if (node.body.type !== 'Object') {
        file.fail(new Error(`Lottie must be "Object" but it's "${node.body.type}"`));
      }

      break;

    case 'Member':
      const memberParent = stack.peek() as ArrayNode | ObjectNode | Root;

      stack.push(createMemberNode(node, memberParent.title as ParentTitle, options));
      break;

    case 'Object':
      if (!parent) break;

      switch (parent.type) {
        case 'Document':
          stack.push(rootNode([], { ...position }));
          break;

        case 'Member':
          // member.value
          const element = stack.peek();

          assertNodeType<Element>(element, 'Element', file);
          const elementValueTitle = getObjectNodeTitle(node, element.title, file);

          stack.push(objectNode(elementValueTitle, [], { ...position }));
          break;

        case 'Element':
          const array = stack.peek();

          assertNodeType<ArrayNode>(array, 'Array', file);
          const objectTitle = getObjectNodeTitle(node, array.title, file);

          stack.push(objectNode(objectTitle, [], { ...position }));
          break;

        default:
          break;
      }
      break;

    case 'Element':
      break;

    case 'Array':
      if (!parent) break;

      switch (parent.type) {
        case 'Member':
          const collection = stack.peek();

          assertNodeType<Collection>(collection, 'Collection', file);
          const collectionValueTitle = getArrayNodeTitle(node, collection.title, file);

          stack.push(arrayNode(collectionValueTitle, [], { ...position }));
          break;

        case 'Element':
          const array = stack.peek();

          assertNodeType<ArrayNode>(array, 'Array', file);
          const arrayTitle = getArrayNodeTitle(node, array.title, file);

          stack.push(arrayNode(arrayTitle, [], { ...position }));
          break;

        default:
          break;
      }
      break;

    default:
      if (!parent) break;

      switch (parent.type) {
        case 'Member':
          if (isMomoaMemberValue(node, parent)) {
            stack.push(createPrimitiveNode(node, options));
          }
          break;

        case 'Element':
          stack.push(createPrimitiveNode(node, options));
          break;

        default:
          break;
      }
      break;
  }
};

export const traverseJsonExit = (
  node: MomoaAnyNode,
  parent: MomoaParent,
  stack: Stack<NodeValue>,
  file: VFile,
  _options: ParseOptions,
  info: Info = {},
): void => {
  switch (node.type) {
    case 'Document':
      // finish traversing
      break;

    case 'Member':
      const objectNodeValue = stack.pop() as ObjectNodeValue;

      const parentNode = stack.peek() as Root | ObjectNode;

      if (parentNode.type === 'Root') {
        parentNode.children.push(objectNodeValue);
        break;
      }

      switch (objectNodeValue.type) {
        case 'Element':
          info.slots?.setNode(objectNodeValue, parentNode, node);
          break;

        case 'Collection':
          break;

        case 'Attribute':
          if (!info.hasExpressions && objectNodeValue.title === 'expression') {
            info.hasExpressions = true;
            break;
          }

          info.slots?.setIdTitle(objectNodeValue, parentNode);

          break;

        default:
          file.fail("Node's type has to be 'element', 'collection' or 'attribute'");
      }

      parentNode.children.push(objectNodeValue);
      break;

    case 'Object':
      if (!parent) break;

      switch (parent.type) {
        case 'Document':
          // root node
          break;

        case 'Member':
          const elementChild = stack.pop();

          assertNodeType<ObjectNode>(elementChild, 'Object', file);

          const element = stack.peek();

          assertNodeType<Element>(element, 'Element', file);

          if (elementChild.title === element.title) {
            elementChild.title = `${element.title}-children` as ObjectTitle;
          }

          element.children = [elementChild];
          break;

        case 'Element':
          const arrayChild = stack.pop();

          assertNodeType<ObjectNode>(arrayChild, 'Object', file);
          const array = stack.peek();

          assertNodeType<ArrayNode>(array, 'Array', file);
          array.children.push(arrayChild);
          break;

        default:
          break;
      }
      break;

    case 'Element':
      break;

    case 'Array':
      if (!parent) break;

      switch (parent.type) {
        case 'Member':
          const collectionChild = stack.pop();

          assertNodeType<ArrayNode>(collectionChild, 'Array', file);

          const collection = stack.peek();

          assertNodeType<Collection>(collection, 'Collection', file);

          if (collectionChild.title === collection.title) {
            collectionChild.title = `${collection.title}-children` as ArrayTitle;
          }

          collection.children = [collectionChild];
          break;

        case 'Element':
          const arrayChild = stack.pop();

          assertNodeType<ArrayNode>(arrayChild, 'Array', file);

          const array = stack.peek();

          assertNodeType<ArrayNode>(array, 'Array', file);

          array.children.push(arrayChild);
          break;

        default:
          break;
      }
      break;

    default:
      if (!parent) break;

      switch (parent.type) {
        case 'Member':
          if (isMomoaMemberValue(node, parent)) {
            const attributeChild = stack.pop();

            if (!attributeChild) file.fail('Attribute child is missing');

            switch (attributeChild.type) {
              case 'String':
                break;

              case 'Number':
                break;

              case 'Boolean':
                break;

              case 'Null':
                break;

              default:
                file.fail(
                  `Unexpected node type found ${attributeChild.type}, has to be 'String', 'Number', 'Boolean' or 'Null'`,
                );
            }

            const attribute = stack.peek();

            assertNodeType<Attribute>(attribute, 'Attribute', file);

            attribute.children = [attributeChild];
          }
          break;

        case 'Element':
          const arrayChild = stack.pop();

          switch (arrayChild?.type) {
            case 'String':
              break;

            case 'Number':
              break;

            case 'Boolean':
              break;

            case 'Null':
              break;

            default:
              file.fail(
                `Unexpected node type found ${arrayChild?.type}, has to be 'String', 'Number', 'Boolean' or 'Null'`,
              );
          }

          const array = stack.peek();

          assertNodeType<ArrayNode>(array, 'Array', file);

          array.children.push(arrayChild);
          break;

        default:
          break;
      }
      break;
  }
};
