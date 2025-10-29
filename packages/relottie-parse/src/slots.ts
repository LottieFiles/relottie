/**
 * Copyright 2024 Design Barn Inc.
 */

import {
  traverse as jsonTraverse,
  type MemberNode as MomoaMember,
  type AnyNode as MomoaAnyNode,
} from '@humanwhocodes/momoa';
import type { AnyTitle, Element, Root } from '@lottiefiles/last';
import { type Attribute, type NodeValue, TITLES } from '@lottiefiles/last';
import { rt } from '@lottiefiles/last-builder';
import type { VFile } from 'vfile';

import { traverseJsonEnter, traverseJsonExit, type MomoaParent } from './helpers.js';
import type { ParseOptions } from './options.js';
import type { Info } from './parse.js';
import { Stack } from './stack.js';

const { string: ST } = TITLES;

export class Slots {
  /**
   * Parser's VFile instance
   */
  public readonly file: VFile;

  /**
   * SlotID.value to ParentTitle mapping
   */
  public idTitles: Map<string, AnyTitle> = new Map();

  /**
   * SlotProperty node in the JSON AST
   */
  public jsonNode: MomoaMember | undefined;

  /**
   * Parser's options
   */
  public readonly options: ParseOptions;

  /**
   * Slots Parent Node
   */
  public parentNode: Root | undefined;

  public constructor(vfile: VFile, options: ParseOptions) {
    this.file = vfile;
    this.options = options;
  }

  /**
   * If set, replaces the original Slots JSON node with a LAST node using collected SlotId parent titles.
   *
   * @returns void
   */
  public mutate(): void {
    if (!this.jsonNode || !this.parentNode) {
      // if the original JSON Slot node is not set, we don't need to mutate it
      return;
    }

    const info: Info = {
      slotIdTitles: this.idTitles,
    };

    const stack = new Stack<NodeValue>();

    const parentPosition = this.parentNode.position ? { position: this.parentNode.position } : {};

    stack.push(rt([], { ...parentPosition }));

    jsonTraverse(this.jsonNode, {
      enter: (currNode: MomoaAnyNode, parentNode: MomoaParent) => {
        traverseJsonEnter(currNode, parentNode, stack, this.file, this.options, info);
      },
      exit: (currNode: MomoaAnyNode, parentNode: MomoaParent) => {
        traverseJsonExit(currNode, parentNode, stack, this.file, this.options, info);
      },
    });

    const tempParent = stack.pop();

    if (!tempParent || tempParent.type !== 'root') return;

    const newSlots = tempParent.children.find((child) => child.title === 'slots');

    if (!newSlots) return;

    const childIndex = this.parentNode.children.findIndex((child) => child.title === 'slots');

    this.parentNode.children[childIndex] = newSlots;
  }

  /**
   * Collects SlotID id and its Parent's Ancestor title for future mutations
   *
   * @param node - SlotID Node
   * @param ancestor - SlotID Parent's Ancestor Node
   */
  public setIdTitle(node: Attribute, ancestor: Element): void {
    if (node.title !== ST.slotId) return;

    const child = node.children[0];
    const childValue = child?.value;

    if (typeof childValue !== 'string') return;

    const id = childValue;
    const ancestorTitle = ancestor.title;
    const title = this.idTitles.get(id);

    if (title) return;

    this.idTitles.set(id, ancestorTitle);
  }

  /**
   * Set Slots Node info for future mutations
   *
   * @param parentNode - SlotProperty parent node
   * @param jsonNode - SlotProperty node in the JSON AST
   * @returns void
   */
  public setNodes(parentNode: Root, jsonNode: MomoaMember): void {
    if (this.jsonNode) return;

    this.jsonNode = jsonNode;
    this.parentNode = parentNode;
  }
}
