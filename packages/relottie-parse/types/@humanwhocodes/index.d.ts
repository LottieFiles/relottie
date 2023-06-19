/**
 * Copyright 2022 Design Barn Inc.
 */

declare module '@humanwhocodes/momoa';

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Momoa {
  type Column = number;
  type Line = number;
  type Offset = number;
  type Index = number;

  interface Point {
    column: Column;
    index?: Index;
    line: Line;
    offset?: Offset;
  }

  interface Location {
    end: Point;
    start: Point;
  }

  interface Node {
    loc: Location;
    /**
     * [StartOffset, EndOffset]
     */
    range?: [Offset, Offset];
    type: string;
  }

  type PunctuatorValue = '{' | '}' | '[' | ']' | ':' | ',';

  type PrimitiveTypes = 'String' | 'Number' | 'Boolean' | 'Null';

  type PrimitiveValue = string | number | boolean | null;

  interface Token extends Node {
    type: PrimitiveTypes | 'Punctuator' | 'LineComment' | 'BlockComment';
    value: PunctuatorValue | string;
  }

  interface Primitive extends Node {
    type: PrimitiveTypes;
    value: PrimitiveValue;
  }

  interface Str extends Primitive {
    type: 'String';
    value: string;
  }

  interface Num extends Primitive {
    type: 'Number';
    value: number;
  }

  interface Bool extends Primitive {
    type: 'Boolean';
    value: boolean;
  }

  interface Nul extends Primitive {
    type: 'Null';
    value: null;
  }

  type Element = Primitive | Arr | Obj;

  interface Arr extends Node {
    elements: Element[];
    type: 'Array';
  }

  interface Obj extends Node {
    members: Member[];
    type: 'Object';
  }

  type MemberValue = Primitive | Arr | Obj;

  interface Member extends Node {
    name: Str;
    type: 'Member';
    value: MemberValue;
  }

  interface Tree extends Node {
    body: Obj | Arr;
    tokens?: Token[];
    type: 'Document';
  }

  /**
   * AST Node
   */
  type AstNode = Tree | Member | MemberValue;

  /**
   * AST Parent Node
   */
  type AstParent = Tree | Member | Arr | Obj;
}
