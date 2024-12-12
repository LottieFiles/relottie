/**
 * Copyright 2024 Design Barn Inc.
 */

import {
  traverse as jsonTraverse,
  type MemberNode as MomoaMember,
  type AnyNode as MomoaAnyNode,
} from '@humanwhocodes/momoa';
import type { ElementTitle, ObjectTitle } from '@lottiefiles/last';
import { type Attribute, type ObjectNode, type Element, type NodeValue, TITLES } from '@lottiefiles/last';
import type { VFile } from 'vfile';

import { fileConstants } from './constants.js';
import { traverseJsonEnter, traverseJsonExit, type MomoaParent } from './helpers.js';
import type { ParseOptions } from './options.js';
import { Stack } from './stack.js';

const { element: ET, string: ST } = TITLES;

interface SlotPropertyInfo {
  /**
   * SlotProperty node in the JsonAST
   */
  jsonNode: MomoaMember;
  /**
   * SlotProperty node in the LottieAST
   */
  node: Element;
}

type SlotIdParentTitle = ObjectTitle | ElementTitle;

export class Slots {
  /**
   * SlotID.value to ParentTitle mapping
   */
  public idTitles: Map<string, SlotIdParentTitle> = new Map();

  /**
   * Copy of all the SlotProperty nodes
   */
  public slotProperties: SlotPropertyInfo[] = [];

  /**
   * Parser's VFile instance
   */
  private readonly _file: VFile;

  /**
   * Parser's options
   */
  private readonly _options: ParseOptions;

  public constructor(vfile: VFile, options: ParseOptions) {
    this._file = vfile;
    this._options = options;
  }

  /**
   * Mutates SlotProperty node titles based on the SlotID value and its parent title
   *
   * @returns void
   */
  public mutateNodeTitles(): void {
    const file = this._file;
    const options = this._options;

    for (const { jsonNode, node } of this.slotProperties) {
      node.title = ET.slot;

      const valueNode = node.children[0];

      if (valueNode === undefined) continue;

      const nodeKey = typeof node.key === 'string' ? node.key : node.key.value;
      const slotPropertyTitle = this.idTitles.get(nodeKey);

      if (slotPropertyTitle === undefined) continue;

      const stack = new Stack<NodeValue>();

      stack.push(node);

      jsonTraverse(jsonNode, {
        enter(currNode: MomoaAnyNode, parentNode: MomoaParent) {
          if (!parentNode) return;

          traverseJsonEnter(currNode, parentNode, stack, file, options);

          if (
            parentNode.type === 'Member' &&
            currNode.type === 'Object' &&
            parentNode.name.type === 'String' &&
            parentNode.name.value === `p`
          ) {
            const slotPropertyValueNode = stack.peek();

            if (slotPropertyValueNode?.type !== 'object') return;

            slotPropertyValueNode.title = slotPropertyTitle as ObjectTitle;
          }
        },
        exit(currNode: MomoaAnyNode, parentNode: MomoaParent) {
          if (!parentNode) return;

          traverseJsonExit(currNode, parentNode, stack, file, options);
        },
      });
    }
  }

  /**
   * Collects SlotIdNode value and its parent title
   *
   * @param node - SlotID node
   * @param parentNode - SlotID parent node
   * @returns void
   * @throws
   * - collects vfile message if slotPropertyNode.value is not a string
   * - collects vfile message if slotPropertyNode.value is already defined with a different title
   */
  public setIdTitle(node: Attribute, parentNode: ObjectNode): void {
    if (node.title !== ST.slotId) return;

    const valueNode = node.children[0];

    if (valueNode === undefined) return;

    const id = valueNode.value;

    if (typeof id !== 'string') {
      this._file.message(`slotProperty node.value must be a string`, node, fileConstants.sourceId);

      return;
    }

    const title = this.idTitles.get(id);
    const parentTitle = parentNode.title;

    if (title === undefined) {
      this.idTitles.set(id, parentTitle);
    } else if (title !== parentTitle) {
      this._file.message(
        `SlotProperty (${id}) target's title already defined as "${title}", setting "${parentTitle}" is not possible.`,
        node,
        fileConstants.sourceId,
      );
    }
  }

  /**
   * Collects SlotProperty nodes
   *
   * @param node - SlotProperty node
   * @param parent - SlotProperty parent node
   * @param jsonNode - SlotProperty node in the JsonAST
   * @returns void
   */
  public setNode(node: Element, parent: ObjectNode, jsonNode: MomoaMember): void {
    if (parent.title === `${ET.slots}`) {
      this.slotProperties.push({ node, jsonNode });
    }
  }
}
