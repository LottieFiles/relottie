# relottie

![CI](https://github.com/lottiefiles/relottie/workflows/Release/badge.svg)
![GitHub contributors](https://img.shields.io/github/contributors/LottieFiles/relottie)
![GitHub](https://img.shields.io/github/license/LottieFiles/relottie)

**relottie** is a tool that transforms Lotties with plugins. These plugins can inspect and change.

## Feature highlights

*   \[x] **[ASTs][syntax-tree]** (inspecting and changing content made easy)
*   \[x] **[plugins][]** (plugins you can pick and choose from)

## Intro

relottie is a ecosystem of plugins that work with the Lottie file format as structured data, specifically ASTs (abstract syntax trees).
ASTs make it easy for programs to deal with Lottie files.
We call those programs plugins.
Plugins inspect and change trees.
You can use the existing plugins or you can make your own.

*   to learn Lottie, see this [lottie-docs][] and [what-is-lottie][]
*   for more about us, see [lottiefiles][]
*   for help, see [contribute][]
*   for more about [unified][], see [unifiedjs.com][]

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Plugins](#plugins)
*   [Examples](#examples)
*   [Syntax](#syntax)
*   [Syntax tree](#syntax-tree)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Security](#security)
*   [Setting up monorepo](#setting-up-monorepo)
*   [Contribute](#contribute)
*   [Community & Support](#community-&-support)
*   [Acknowledgments](#acknowledgments)
*   [License](#license)

## What is this?

You can use plugins to change Lottie.

**In**:

```javascript
{ "v": "5.5.2" }
```

**Plugin**:

```ts
import {visit} from 'unist-util-visit'
import type { Plugin, Node } from 'unified'
import type { Root } from '@lottiefiles/last'

const myRelottiePlugin: Plugin<[]> () {
  function transform (tree: Root, _file: VFile): void {
    visit(tree, (node) => {
      if (node.title === 'version') {
        node.title = "6.0.0" 
      }
    })
  }

  return transform
}
```

**Out**:

```javascript
{ "v": "6.0.0" }
```

You can use relottie for many different things.
**[unified][]** is the core project that transforms content with ASTs.
**relottie** adds support for Lottie to unified.
**[last][]** is the Lottie AST that relottie uses.

This GitHub repository is a monorepo that contains the following packages:

*   [`last`][last]
    — Type definitions for Lottie Abstract Syntax Tree (last)
*   [`last-builder`][last-builder]
    — Composable functions to easily build syntax tree (last) structures
*   [`relottie`][relottie-pkg]
    — a unified processor with support for parsing Lottie input and serializing Lottie as output
*   [`relottie-parse`][relottie-parse]
    — plugin to take Lottie as input and turn it into a syntax tree [last][]
*   [`relottie-stringify`][relottie-stringify]
    — plugin to take a syntax tree (last) and turn it into Lottie as output
*   [`relottie-cli`][relottie-cli]
    — Command line interface to inspect and change Lottie files with relottie
* [`relottie-extract-features`][relottie-extract-features]
    — plugin to extract Lottie features from the document and store them in vfile

## When should I use this?

relottie focusses on ASTs and providing an interface for plugins to transform them.

Depending on the input you have and output you want, you can use different parts
of relottie.
If the input is Lottie JSON file, you can use `relottie-parse` with [unified].
If the output is Lottie JSON file, you can use `relottie-stringify` with `unified`. If you need to transform LottieJSON to `.lottie`, you can [dotlottie.js][]

## Plugins

relottie plugins deal with Lottie.
Some popular examples are:

*   [relottie-style][]

These plugins are exemplary because what they do and how they do it is quite
different, respectively to extend Lottie syntax, inspect trees, change trees,
and define other output formats.

You can choose from the plugins that already exist.
Here are three good ways to find plugins:

*   [List of LF plugins][list-of-plugins]
    — list of all plugins
*   [`relottie-plugin` topic][topic]
    — any tagged repo on GitHub

Some plugins are maintained by us here in the [`@lottiefiles`][lottiefiles] organization while
others are maintained by folks elsewhere.
Anyone can make relottie plugins, so as always when choosing whether to include
dependencies in your project, make sure to carefully assess the quality of
relottie plugins too.

## Examples

*   be the first one ;)

## Syntax

relottie follows [last][] definitions, [lottie-types][] and [lottie-docs][] title names (with a few changes) Some syntax extensions are supported through plugins.

We use [momoa][] JSON parser for our parsing.
See its documentation for more information.

## Syntax tree

The syntax tree format used in relottie is [last][].
It represents Lottie constructs as JSON objects.

**In**:

```javascript
{ "v": "6.0.0" }
```

**Out**:

```json
{
  "type": "root",
  "title": "animation",
  "hasExpressions": false,
  "position": {
    "start": {
      "line": 1,
      "column": 1,
      "offset": 0
    },
    "end": {
      "line": 1,
      "column": 17,
      "offset": 16
    }
  },
  "children": [
    {
      "type": "attribute",
      "key": {
        "type": "key",
        "position": {
          "start": {
            "line": 1,
            "column": 3,
            "offset": 2
          },
          "end": {
            "line": 1,
            "column": 6,
            "offset": 5
          }
        },
        "value": "v"
      },
      "title": "version",
      "position": {
        "start": {
          "line": 1,
          "column": 3,
          "offset": 2
        },
        "end": {
          "line": 1,
          "column": 15,
          "offset": 14
        }
      },
      "children": [
        {
          "type": "primitive",
          "value": "6.0.0",
          "position": {
            "start": {
              "line": 1,
              "column": 8,
              "offset": 7
            },
            "end": {
              "line": 1,
              "column": 15,
              "offset": 14
            }
          },
          "valueType": "string"
        }
      ]
    }
  ]
}
```

## Types

The relottie organization and the unified as a whole is fully typed
with [TypeScript][].
Types for last are available in [last][]. Also have a look at [lottie-types][].

For TypeScript to work, it is particularly important to type your plugins
correctly.
We strongly recommend using the `Plugin` type from [unified][] with its generics
and to use the node types for the syntax trees provided by [last][].

```ts
import type { Root } from '@lottiefiles/last';
import type { Plugin } from 'unified';

export function myRelottiePluginAcceptingOptions(options): Plugin<[Options?], Root> {
  // `options` is `Options?`.
  return function (tree, file) {
    // `tree` is `Root`.
  }
}
```

## Compatibility

As of now, that is Node.js 16.0+, and 18.0+ (other versions have not been tested yet)
Our projects sometimes work with older versions, but this is not guaranteed.

## Security

As last properties can have [expressions][], and improper use of **last** can open you up to cross-site scripting [cross-site scripting (XSS)][XSS]. Carefully assess each plugin and the risks involved in using them.

## Setting up Monorepo

    git clone https://github.com/LottieFiles/relottie.git

    cd relottie

    pnpm install

### Running in dev mode

    pnpm dev

### Running test suite

    pnpm test

### Add a changelog message

We use [changeset][]

    pnpm changelog

### Building

    pnpm build

### Linting

    pnpm lint

## Contribute

Any contributions are welcome.

## Community & Support

*   [Github issues][issues]. For bugs and errors you encounter using this player.
*   [Discord][lf-discord]. For hanging out with the community and sharing your awesome Lottie animations!

## Acknowledgments

*   [unified][]
*   [momoa][]
*   [lottie-docs][]

The initial release of this project was authored by
[**@aidosmf**][author]

## License

[MIT](license) © [LottieFiles][lottiefiles]

[author]: http://github.com/aidosmf

[unified]: https://github.com/unifiedjs/unified

[unifiedjs.com]: https://unifiedjs.com/

[build]: https://github.com/LottieFiles/relottie/actions

[typescript]: https://www.typescriptlang.org

[momoa]: https://github.com/humanwhocodes/momoa

[list-of-plugins]: https://github.com/LottieFiles/relottie/tree/main/packages

[changeset]: https://github.com/changesets/changesets

[what-is-lottie]: https://lottiefiles.com/what-is-lottie

[lottiefiles]: https://github.com/LottieFiles

[topic]: https://github.com/topics/relottie-plugin

[issues]: https://github.com/LottieFiles/relottie/issues

[lottie-docs]: https://lottiefiles.github.io/lottie-docs/

[relottie]: https://github.com/LottieFiles/relottie

[last]: https://github.com/LottieFiles/relottie/tree/main/packages/last

[last-builder]: https://github.com/LottieFiles/relottie/tree/main/packages/last-builder

[relottie-pkg]: https://github.com/LottieFiles/relottie/tree/main/packages/relottie

[relottie-parse]: https://github.com/LottieFiles/relottie/tree/main/packages/relottie-parse

[relottie-style]: https://www.npmjs.com/package/@lottiefiles/relottie-style

[relottie-stringify]: https://github.com/LottieFiles/relottie/tree/main/packages/relottie-stringify

[relottie-cli]: https://github.com/LottieFiles/relottie/tree/main/packages/relottie-cli

[relottie-extract-features]: https://github.com/LottieFiles/relottie/tree/main/packages/relottie-extract-features

[lottie-types]: https://www.npmjs.com/package/@lottiefiles/lottie-types

[dotlottie.js]: https://github.com/dotlottie/dotlottie-js/

[expressions]: https://lottiefiles.github.io/lottie-docs/expressions/#expressions

[lf-discord]: https://discord.com/invite/6K3fm7yE9v

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting

[syntax]: #syntax

[syntax-tree]: #syntax-tree

[plugins]: #plugins

[contribute]: #contribute
