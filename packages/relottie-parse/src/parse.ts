/**
 * Copyright 2022 Design Barn Inc.
 */

import { parse as jsonParse, traverse as jsonTraverse } from '@humanwhocodes/momoa';
import type {
  ArrayNode,
  Collection,
  Element,
  Attribute,
  KeyValue,
  ObjectNode,
  Primitive,
  Root,
  PrimitiveValueType,
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
import type { PrimitiveParts } from '@lottiefiles/last-builder';
import merge from 'lodash.merge';
import { is } from 'unist-util-is';
import type { VFile, Data } from 'vfile';

import type { Dependent } from './entities.js';
import { getMemberEntity, getNoKeyEntity } from './entities.js';
import { Stack } from './helpers.js';
import { DEFAULT_OPTIONS } from './options.js';
import type { ParseOptions } from './options.js';
import type { SettingsOptions } from './unified-relottie-parse.js';

export interface ParseFileData extends Data {
  parse: {
    messages?: VFile['messages'];
  };
}

export interface Info {
  hasExpressions: Root['hasExpressions'];
}

const addWarningMessage = (file: VFile, message: string, options: ParseOptions): void => {
  if (options.messages.warning) {
    file.message(message);
  }
};

const createValueType = (node: Momoa.AstNode, options: ParseOptions): PrimitiveParts<PrimitiveValueType> => {
  if (!options.valueType || node.type === 'Array' || node.type === 'Object' || node.type === 'Document') {
    return {};
  }

  return { valueType: node.type.toLowerCase() as PrimitiveValueType };
};

/**
 * Converts Momoa position into the Last position style if the related option is enabled
 * @param node - Momoa Node
 * @param options - Parse Options
 * @returns Last position prop or empty object
 */
const createPositionProp = (node: Momoa.AstNode, options: ParseOptions): { position?: Position } => {
  if (options.position) {
    return {
      position: { ...node.loc },
    };
  } else {
    return {};
  }
};

const createPrimitiveNode = (node: Momoa.Primitive, options: ParseOptions): Primitive => {
  const position = createPositionProp(node, options);
  const valueType = createValueType(node, options) as PrimitiveParts<PrimitiveValueType>;

  return primitiveNode(node.value, { ...position, ...valueType });
};

const createKeyNode = (node: Momoa.Member, options: ParseOptions): KeyValue => {
  const value = node.name.value;

  if (options.position) {
    const posiiton = createPositionProp(node.name, options);

    return keyNode(value, { ...posiiton });
  } else {
    return value;
  }
};

const createMemberNode = (node: Momoa.Member, parentTitle: ParentTitle, options: ParseOptions): ObjectNodeValue => {
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

const isMomoaMemberValue = (node: Momoa.Primitive, parent: Momoa.Member): boolean => {
  return parent.loc.end.column === node.loc.end.column;
};

function assertNodeType<T extends NodeValue>(
  node: NodeValue | undefined,
  type: T['type'],
  file: VFile,
): asserts node is T {
  if (!is<T>(node, type)) {
    file.fail(`Unexpected node type found ${node?.type}, has to be 'array'`);
  }
}

const getMembersFromArrNode = (node: Momoa.Arr): Momoa.Member[] => {
  const members: Momoa.Member[] = [];

  node.elements.forEach((element) => {
    if (is<Momoa.Obj>(element, 'Object')) {
      element.members.forEach((member) => members.push(member));
    }
  });

  return members;
};

const getTitleFromMemberValue = (
  node: Momoa.MemberValue,
  parentNodeTitle: ParentTitle,
  dependent: Dependent,
  file: VFile,
  options: ParseOptions,
): AnyTitle | undefined => {
  const { key, parentTitle, type } = dependent;

  switch (type) {
    case 'Constant':
      if (!is<Momoa.Str>(node, 'String') && !is<Momoa.Num>(node, 'Number')) break;

      const { defaultValue, prefix, values } = parentTitle;

      const defaultConstTitle = values[defaultValue];

      if (!defaultConstTitle)
        throw new Error(`[${parentNodeTitle}] '${defaultValue}' has to present in "dependent.parentTitle.values"`);

      const constantKey = node.value;
      const constTitle = values[constantKey];

      if (!constTitle) {
        const message = `[${parentNodeTitle}] '${constantKey}' is missing in "dependent.parentTitle.values"`;

        addWarningMessage(file, message, options);
      }

      const title = typeof constTitle === 'undefined' ? defaultConstTitle : constTitle;

      return (prefix && prefix.length > 0 ? `${prefix}-${title}` : title) as AnyTitle;

    case 'Array':
      if (!is<Momoa.Arr>(node, 'Array')) break;
      const childType = dependent.childType;
      const matchedMember = childType ? node.elements.find((element) => element.type === childType) : undefined;

      if (!matchedMember) break;

      return parentTitle;

    default:
      if (type !== node.type) {
        const message = `${parentNodeTitle}'s '${key}' type is ${node.type} but has to be ${type}`;

        addWarningMessage(file, message, options);
        break;
      }

      return parentTitle;
  }

  return undefined;
};

const getDependentTitle = (
  parentTitle: ParentTitle,
  members: Momoa.Member[],
  dependents: Dependent[],
  file: VFile,
  options: ParseOptions,
): AnyTitle | undefined => {
  const memberKeyValue = members.reduce((acc, member) => {
    const key = member.name.value;

    acc[key] = member.value;

    return acc;
  }, {} as Record<string, Momoa.MemberValue>);

  for (const dependent of dependents) {
    const { key } = dependent;
    const node = memberKeyValue[key];

    if (!node) continue;

    const title = getTitleFromMemberValue(node, parentTitle, dependent, file, options);

    if (title) return title;
  }

  return undefined;
};

const getObjectNodeTitle = (
  node: Momoa.Obj,
  parentNodeTitle: ParentTitle,
  file: VFile,
  options: ParseOptions,
): ObjectTitle => {
  const entity = getNoKeyEntity(node, parentNodeTitle);

  const { defaultTitle, dependents } = entity;

  if (!dependents) return defaultTitle as ObjectTitle;

  const title = getDependentTitle(parentNodeTitle, node.members, dependents, file, options);

  return (title || defaultTitle) as ObjectTitle;
};

const getArrayNodeTitle = (
  node: Momoa.Arr,
  parentNodeTitle: ParentTitle,
  file: VFile,
  options: ParseOptions,
): ArrayTitle => {
  const entity = getNoKeyEntity(node, parentNodeTitle);

  const { defaultTitle, dependents } = entity;

  if (!dependents) return defaultTitle as ArrayTitle;

  const members = getMembersFromArrNode(node);

  const title = getDependentTitle(parentNodeTitle, members, dependents, file, options);

  return (title || defaultTitle) as ArrayTitle;
};

const traverseJsonEnter = (
  node: Momoa.AstNode,
  parent: Momoa.AstParent,
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
      switch (parent.type) {
        case 'Document':
          stack.push(rootNode([], { ...position }));
          break;

        case 'Member':
          // member.value
          const element = stack.peek();

          assertNodeType<Element>(element, 'element', file);
          const elementValueTitle = getObjectNodeTitle(node, element.title, file, options);

          stack.push(objectNode(elementValueTitle, [], { ...position }));
          break;

        case 'Array':
          const array = stack.peek();

          assertNodeType<ArrayNode>(array, 'array', file);
          const objectTitle = getObjectNodeTitle(node, array.title, file, options);

          stack.push(objectNode(objectTitle, [], { ...position }));
          break;

        default:
          break;
      }
      break;

    case 'Array':
      switch (parent.type) {
        case 'Member':
          const collection = stack.peek();

          assertNodeType<Collection>(collection, 'collection', file);
          const collectionValueTitle = getArrayNodeTitle(node, collection.title, file, options);

          stack.push(arrayNode(collectionValueTitle, [], { ...position }));
          break;

        case 'Array':
          const array = stack.peek();

          assertNodeType<ArrayNode>(array, 'array', file);
          const arrayTitle = getArrayNodeTitle(node, array.title, file, options);

          stack.push(arrayNode(arrayTitle, [], { ...position }));
          break;

        default:
          break;
      }
      break;

    default:
      switch (parent.type) {
        case 'Member':
          if (isMomoaMemberValue(node, parent)) {
            stack.push(createPrimitiveNode(node, options));
          }
          break;

        case 'Array':
          stack.push(createPrimitiveNode(node, options));
          break;

        default:
          break;
      }
      break;
  }
};

const traverseJsonExit = (
  node: Momoa.AstNode,
  parent: Momoa.AstParent,
  stack: Stack<NodeValue>,
  file: VFile,
  _options: ParseOptions,
  info: Info,
): void => {
  switch (node.type) {
    case 'Document':
      // finish traversing
      break;

    case 'Member':
      const objectNodeValue = stack.pop() as ObjectNodeValue;

      switch (objectNodeValue.type) {
        case 'element':
          break;

        case 'collection':
          break;

        case 'attribute':
          if (!info.hasExpressions && objectNodeValue.title === 'expression') {
            info.hasExpressions = true;
          }

          break;

        default:
          file.fail("Node's type has to be 'element', 'collection or 'attribute'");
      }

      const parentNode = stack.peek() as Root | ObjectNode;

      switch (parentNode.type) {
        case 'object':
          break;

        case 'root':
          break;

        default:
          file.fail("ParentNode's type has to be 'object' or 'root'");
      }

      parentNode.children.push(objectNodeValue);
      break;

    case 'Object':
      switch (parent.type) {
        case 'Document':
          // root node
          break;

        case 'Member':
          const elementChild = stack.pop();

          assertNodeType<ObjectNode>(elementChild, 'object', file);

          const element = stack.peek();

          assertNodeType<Element>(element, 'element', file);

          if (elementChild.title === element.title) {
            elementChild.title = `${element.title}-children` as ObjectTitle;
          }

          element.children = [elementChild];
          break;

        case 'Array':
          const arrayChild = stack.pop();

          assertNodeType<ObjectNode>(arrayChild, 'object', file);
          const array = stack.peek();

          assertNodeType<ArrayNode>(array, 'array', file);
          array.children.push(arrayChild);
          break;

        default:
          break;
      }
      break;

    case 'Array':
      switch (parent.type) {
        case 'Member':
          const collectionChild = stack.pop();

          assertNodeType<ArrayNode>(collectionChild, 'array', file);

          const collection = stack.peek();

          assertNodeType<Collection>(collection, 'collection', file);

          if (collectionChild.title === collection.title) {
            collectionChild.title = `${collection.title}-children` as ArrayTitle;
          }

          collection.children = [collectionChild];
          break;

        case 'Array':
          const arrayChild = stack.pop();

          assertNodeType<ArrayNode>(arrayChild, 'array', file);

          const array = stack.peek();

          assertNodeType<ArrayNode>(array, 'array', file);

          array.children.push(arrayChild);
          break;

        default:
          break;
      }
      break;

    default:
      switch (parent.type) {
        case 'Member':
          if (isMomoaMemberValue(node, parent)) {
            const attributeChild = stack.pop();

            assertNodeType<Primitive>(attributeChild, 'primitive', file);
            const attribute = stack.peek();

            assertNodeType<Attribute>(attribute, 'attribute', file);

            attribute.children = [attributeChild];
          }
          break;

        case 'Array':
          const arrayChild = stack.pop();

          assertNodeType<Primitive>(arrayChild, 'primitive', file);

          const array = stack.peek();

          assertNodeType<ArrayNode>(array, 'array', file);

          array.children.push(arrayChild);
          break;

        default:
          break;
      }
      break;
  }
};

// eslint-disable-next-line consistent-return
export function parse(document: string, file: VFile, settings: SettingsOptions = {}): Root {
  const jsonAst = jsonParse(document, { tokens: true });

  const options: ParseOptions = merge(DEFAULT_OPTIONS, settings.parse);

  const capacity = jsonAst.tokens.length;
  const lastStack = new Stack<NodeValue>(capacity);

  const info: Info = { hasExpressions: false };

  jsonTraverse(jsonAst, {
    enter(node: Momoa.AstNode, parent: Momoa.AstParent) {
      traverseJsonEnter(node, parent, lastStack, file, options);
    },
    exit(node: Momoa.AstNode, parent: Momoa.AstParent) {
      traverseJsonExit(node, parent, lastStack, file, options, info);
    },
  });

  const dataMessages = options.messages.warning && file.messages.length > 0 ? { messages: file.messages } : {};

  const fileData: ParseFileData = {
    parse: {
      ...dataMessages,
    },
  };

  Object.assign(file.data, fileData);

  const tree = lastStack.pop();

  if (is<Root>(tree, 'root')) {
    tree.hasExpressions = info.hasExpressions;

    return tree;
  } else {
    file.fail(`Stack's last item has to be "root" but it's "${tree?.type}"`, tree);
  }
}
