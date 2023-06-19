# `relottie-parse`

**[relottie][]** plugin to add support for parsing Lottie input.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`unified().use(relottieParse)`](#unifieduserelottieparse)
*   [Examples](#examples)
    *   [Example: convert Lottie to dotLottie](#convert-lottie-to-dotlottie)
*   [Syntax](#syntax)
*   [Syntax tree](#syntax-tree)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Security](#security)
*   [Contribute](#contribute)
*   [Acknowledgments](#acknowledgments)
*   [License](#license)

## What is this?

This package is a [unified][] ([relottie][]) plugin that defines how to take
Lottie as input and turn it into a syntax tree.

This plugin is built on [momoa][], which in turn parses JSON into JSON-AST and turns it into [last][] syntax trees.
relottie focusses on making it easier to transform content by abstracting such
internals away.

**unified** is a project that transforms content with abstract syntax trees
(ASTs).
**relottie** adds support for Lottie to unified.
**last** is the Lottie AST that relottie uses.
**momoa** is the JSON parser we use to build a [last][].
This is a relottie plugin that defines how input Lottie is turned into last.

## When should I use this?

This plugin adds support to unified for parsing Lottie.

You can combine this plugin with other plugins to add syntax extensions. [List of plugins][list-of-plugins].

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).
In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm][]:

```sh
yarn add @lottiefiles/relottie-parse
```

## Use

Say we have the following module `example.ts`:

```ts
import { unified } from 'unified'
import relottieParse, { type Options } from 'relottie-parse'

const parseOptions: Options = {
  position: false
};

const tree = unified().use(relottieParse, parseOptions).parse('{"v":"5.5.7"}');

console.log('tree output', tree);
```

Running that with `npx ts-node example.ts` yields:

```json
// tree output:
{
  "type":"root",
  "title":"animation",
  "hasExpressions": false,
  "children":[
    {
      "type":"attribute",
      "key":"v",
      "title":"version",
      "children":[
        {
          "type":"primitive",
          "value":"5.5.7",
          "valueType":"string"
        }
      ]
    }
  ]
}
```

## API

The default export is `relottieParse`.
You can import the parser `Options` and `FileData` type definitions as well.

### `unified().use(relottieParse)`

Add support for parsing Lottie input.
There are plugin options as well.

## Examples

### Convert Lottie to dotLottie

You can use [dotLottie.js] for converting a LottieJSON into `.lottie` format

## Syntax

Lottie is parsed according to CommonMark.
Other plugins can add support for syntax extensions.

## Syntax tree

The syntax tree format used in relottie is [last][].

## Types

This package is fully typed with [TypeScript][].

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.
As of now, that is Node.js 16.0+, and 18.0+ (other versions have not been tested yet)
Our projects sometimes work with older versions, but this is not guaranteed.

## Security

As last properties can have [expressions][], and improper use of **last** can open you up to cross-site scripting [cross-site scripting (XSS)][XSS]. Carefully assess each plugin and the risks involved in using them.

## Contribute

Any contributions are welcome.

## Acknowledgments

*   [unified][]
*   [momoa][]
*   [lottie-docs][]

## License

[License](license) © [LottieFiles][lottiefiles]

[unified]: https://github.com/unifiedjs/unified

[typescript]: https://www.typescriptlang.org

[npm]: https://docs.npmjs.com/cli/install

[lottie]: https://lottiefiles.com/what-is-lottie

[momoa]: https://github.com/humanwhocodes/momoa

[lottiefiles]: https://github.com/LottieFiles

[list-of-plugins]: https://github.com/LottieFiles/relottie/tree/main/packages

[relottie]: https://github.com/LottieFiles/relottie

[last]: https://github.com/LottieFiles/relottie/tree/main/packages/last

[last-builder]: https://github.com/LottieFiles/relottie/tree/main/packages/last-builder

[relottie-parse]: https://github.com/LottieFiles/relottie/tree/main/packages/relottie-parse

[relottie-stringify]: https://github.com/LottieFiles/relottie/tree/main/packages/relottie-stringify

[dotLottie.js]: https://github.com/dotlottie/dotlottie-js

[lottie-docs]: https://lottiefiles.github.io/lottie-docs/

[expressions]: https://lottiefiles.github.io/lottie-docs/expressions/#expressions

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting

[syntax]: #syntax

[syntax-tree]: #syntax-tree

[contribute]: #contribute
