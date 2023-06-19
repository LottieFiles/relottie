# relottie

**[unified][]** processor with support for parsing Lottie input and serializing Lottie as output

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [API](#api)
*   [Examples](#examples)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Security](#security)
*   [Contribute](#contribute)
*   [Start](#start)
*   [Legal](#legal)

## What is this?

This package is a [unified][] processor with support for parsing Lottie input
and serializing Lottie as output by using unified with
[`relottie-parse`][relottie-parse] and [`relottie-stringify`][relottie-stringify].

**unified** is a project that transforms content with abstract syntax trees
(ASTs).
**relottie** adds support for Lottie to unified.
**last** is the Lottie AST that relottie uses.
Please see [the monorepo readme][relottie] for what the relottie ecosystem is.

## When should I use this?

You can use this package when you want to use unified, have Lottie as input,
and want Lottie as output.
This package is a shortcut for
`unified().use(relottieParse).use(relottieStringify)`.
When the input isn’t Lottie (meaning you don’t need `relottie-parse`) or the
output is not Lottie (you don’t need `relottie-stringify`), it’s recommended to
use unified directly.

When you want to inspect and format Lottie files in a project on the command
line, you can use \[`relottie-cli`]\[relottie-cli].

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).
In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm][]:

```sh
yarn add @lottiefiles/relottie
```

## API

This package exports the following identifier: `relottie`.
There is no default export.

### `relottie()`

Create a new (unfrozen) `unified` processor that already uses `relottie-parse` and `relottie-stringify` and you can add more plugins to.
See [`unified`][unified] for more information.

## Examples

When you use `relottie-parse` and `relottie-stringify` manually you can pass
options to `use`.
Because these are already used in `relottie`, that’s not possible.
To define options for them, you can instead pass options to `data`:

```ts
import {
  relottie,
  type Options,
  type FileData
} from '@lottiefiles/relottie';

const lottie = '{ "v": "6.0.0" }';

const options: Options = {
  parse: {
    position: false
  },
}

const processor = relottie().data('settings', options);

const tree = processor.parse(lottie);
const output = processor.stringify(tree);
```

`tree`:

```javascript
{
  "type": "root",
  "title": "animation",
  "hasExpressions": false
  "children": [
    {
      "type": "attribute",
      "key": "v",
      "title": "version",
      "children": [{ "type": "primitive", "value": "6.0.0", "valueType": "string" }]
    }
  ]
}
```

`output`:

```javascript
{"v":"6.0.0"}
```

## Types

This package is fully typed with [TypeScript][].
There are no extra exported types.

## Compatibility

Projects maintained by the unified collective are compatible with all maintained
versions of Node.js.
As of now, that is Node.js 12.20+, 14.14+, and 16.0+.
Our projects sometimes work with older versions, but this is not guaranteed.

## Security

As last properties can have [expressions](https://lottiefiles.github.io/lottie-docs/expressions/), and improper use of [last][] is also unsafe. Always be
careful with user input.

## Contribute

By interacting with this repository, organisation, or community you agree to
abide by its terms.

## Start

1.  `pnpm install`
2.  `pnpm ts-node playground.ts` for testing playground environment (if you are in the root folder you have to enter the package directory `cd packages/relottie`)
3.  for testing `pnpm test`

## Legal

[License](license) © [LottieFiles][lottiefiles]

[lottiefiles]: https://github.com/LottieFiles

[relottie]: https://github.com/LottieFiles/relottie

[relottie-parse]: https://github.com/LottieFiles/relottie/tree/main/packages/relottie-parse

[relottie-stringify]: https://github.com/LottieFiles/relottie/tree/main/packages/relottie-stringify

[last]: https://github.com/LottieFiles/relottie/tree/main/packages/last

[lottie-docs]: https://lottiefiles.github.io/lottie-docs/

[npm]: https://docs.npmjs.com/cli/install

[unified]: https://github.com/unifiedjs/unified

[processor]: https://github.com/unifiedjs/unified#processor

[typescript]: https://www.typescriptlang.org
