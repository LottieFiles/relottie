# \[last]

**L**ottie **A**bstract **S**yntax **T**ree.

***

**last** is a specification for representing Lottie JSON in a \[syntax
tree]\[syntax-tree].
It implements **\[unist]\[]**.

## Contents

*   [Introduction](#introduction)
*   [Install](#install)
    *   [Where this specification fits](#where-this-specification-fits)
*   [Nodes](#nodes)
    *   [`Parent`](#parent)
    *   [`Literal`](#literal)
    *   [`Root`](#root)
    *   [`Primitive`](#primitive)
    *   [`KeyNode`](#keynode)
    *   [`Member`](#member)
    *   [`ObjectNode`](#objectnode)
    *   [`ArrayNode`](#arraynode)
    *   [`Attribute`](#attribute)
    *   [`Element`](#element)
    *   [`Collection`](#collection)
*   [Glossary](#glossary)
*   [List of utilities](#list-of-utilities)
*   [References](#references)
*   [Security](#security)
*   [Related](#related)
*   [Contribute](#contribute)
*   [Acknowledgments](#acknowledgments)
*   [License](#license)

## Introduction

This document defines a format for representing \[lottie]\[] as an \[abstract
syntax tree]\[syntax-tree].
Development of last started in 2022.

## Install

```sh
yarn add @lottiefiles/last
```

### Where this specification fits

last extends \[unist]\[], a format for syntax trees, to benefit from its
\[ecosystem of utilities]\[utilities].

last relates to \[JavaScript]\[] in that it has a rich \[ecosystem of
utilities]\[list-of-utilities] for working with compliant syntax trees in
JavaScript.
However, **last** is not limited to JavaScript and can be used in other programming
languages.

last relates to the \[unified]\[] and \[relottie]\[] projects in that last syntax
trees are used throughout their ecosystems.

## Nodes

### `Parent`

```ts
interface Parent extends UnistParent {
  /**
   * Lottie's qualified name.
   */
  title: AnyTitle;
}
```

**Parent** (\[**UnistParent**]\[dfn-unist-parent]) represents an abstract interface in **last**, containing other nodes (said to be \[*children*]\[term-child]). In addition, has `title` prop which contains Lottie qualified name that can be found in [titles.ts](src/titles.ts) (that based on \[lottie-json-schema]\[])

### `Literal`

```ts
interface Literal extends UnistLiteral {}
```

**Literal** (\[**UnistLiteral**]\[dfn-unist-literal]) represents an abstract
interface in last containing a value.

### `Root`

```ts
interface Root extends Omit<ObjectNode, 'type'> {
  title: 'animation';
  type: 'root';
  hasExpressions: boolean
}
```

**Root** (\[**Parent**]\[dfn-parent]) represents a Lottie JSON.

**Root** can be used as the \[*root*]\[term-root] of a \[*tree*]\[term-tree], never
as a \[*child*]\[term-child].

**Root** also has `hasExpressions` prop that tells whether the Lottie animation contains JS \[expressions]\[]. It is important to identify it early because of the [security](#security) concerns.

### `Primitive`

```ts
type PrimitiveValueType = 'string' | 'number' | 'boolean' | 'null';

type PrimitiveValue = string | number | boolean | null;

interface Primitive extends Literal {
  type: 'primitive';
  value: PrimitiveValue;
  valueType?: PrimitiveValueType;
}
```

**Primitive** (\[**Literal**]\[dfn-literal]) represents a JSON property's value

### `KeyNode`

```ts
interface KeyNode extends Literal {
  type: 'key';
  value: string;
}
```

**KeyNode** (\[**Literal**]\[dfn-literal]) represents a JSON property key.

### `Member`

```ts
/**
 * Base interface for Element, Collection & Attribute
 */
interface Member extends Parent {
  /**
   * Property's key
   */
  key: KeyNode | string;
  title: AttributeTitle | CollectionTitle | ElementTitle;
}
```

**Member** (\[**Parent**]\[dfn-parent]) represents the main interface for nodes that have a JSON property key that could be (\[**KeyNode**]\[dfn-keynode]) or a string value.

### `ObjectNode`

```ts
type ObjectNodeValue = Attribute | Element | Collection;

interface ObjectNode extends Parent {
  children: ObjectNodeValue[];
  title: ObjectTitle;
  type: 'object';
}
```

**ObjectNode** (\[**Parent**]\[dfn-parent]) represents a JSON object value.

### `ArrayNode`

```ts
type ArrayNodeValue = Primitive | ObjectNode | ArrayNode;

interface ArrayNode extends Parent {
  children: ArrayNodeValue[];
  title: ArrayTitle;
  type: 'array';
}
```

**ArrayNode** (\[**Parent**]\[dfn-parent]) represents a JSON array value.

### `Attribute`

```ts
interface Attribute extends Member {
  children: [Primitive] | [];
  title: AttributeTitle;
  type: 'attribute';
}
```

**Attribute** (\[**Member**]\[dfn-member]) represents a Member node which value is (\[**Primitive**]\[dfn-primitive]).

### `Element`

```ts
interface Element extends Member {
  children: [ObjectNode] | [];
  title: ElementTitle;
  type: 'element';
}
```

**Element** (\[**Member**]\[dfn-member]) represents a Member node which value is (\[**ObjectNode**]\[dfn-objectnode]).

### `Collection`

```ts
interface Collection extends Member {
  children: [ArrayNode] | [];
  title: CollectionTitle;
  type: 'collection';
}
```

**Collection** (\[**Member**]\[dfn-member]) represents a Member node which value is (\[**ArrayNode**]\[dfn-arraynode]).

## Glossary

See the \[unist glossary]\[glossary].

## List of utilities

See the \[unist list of utilities]\[utilities] for more utilities.

*   [`last-builder`]()
    — build last structures with composable functions

## References

*   **unist**:
    \[Universal Syntax Tree]\[unist].
    T. Wormer; et al.
*   **lottie-web**:
    \[Lottie Web Player]\[lottie-web].
    H. Torrisi; et al.
*   **lottie-docs**:
    \[A human's guide to the Lottie format]\[lottie].
    M. Basaglia; et al.
*   **lottie-animation-community**:
    \[Lottie Animation Format Documentation]\[lac]

## Security

As last properties can have \[expressions]\[], and improper use of **last** can open you up to cross-site scripting \[cross-site scripting (XSS)]\[XSS]. Carefully assess each plugin and the risks involved in using them.

## Related

*   [hast](https://github.com/syntax-tree/hast)
    — Hypertext Abstract Syntax Tree format
*   [nlcst](https://github.com/syntax-tree/nlcst)
    — Natural Language Concrete Syntax Tree format

## Contribute

By interacting with this repository, organization, or community you agree to abide by its terms.

## Acknowledgments

*   \[unified]\[]
*   \[remark]\[]
*   \[lottie-docs]\[lottie]

The initial release of this project was authored by
\[**@aidosmf**]\[author]

## License

[MIT](LICENSE) © [LottieFiles](https://www.lottiefiles.com)
