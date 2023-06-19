# relottie-stringify

Compiler for [unified]. Serializes [last] syntax trees to LottieJSON

## Use

```sh
yarn add @lottiefiles/relottie-stringify
```

```ts
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

import type { Attribute } from '@lottiefiles/last';
import relottieParse from '@lottiefiles/relottie-parse';
import relottieStringify from '@lottiefiles/relottie-stringify';

const processor = unified().use(relottieParse).use(relottieStringify);

const tree = processor.parse('{"v":"5.5.7"}');

visit(tree, 'attribute', (node: Attribute) => {
  node.key = 'new_v';
});

const output = processor.stringify(tree);
```

`output` will equal

```string
{"new_v":"5.5.7"}
```

## dotLottie

You can use [dotLottie.js] for converting a LottieJSON into `.lottie` format

## Security

As last properties can have [expressions][], and improper use of **last** can open you up to cross-site scripting [cross-site scripting (XSS)][XSS]. Carefully assess each plugin and the risks involved in using them.

## Contribute

Any contributions are welcome.

## Acknowledgments

*   [unified][]
*   [momoa][]
*   [lottie-docs][lottie-docs]

## Legal

[License](license) © [LottieFiles][lottiefiles]

[last]: https://github.com/LottieFiles/relottie/tree/main/packages/last

[momoa]: https://github.com/humanwhocodes/momoa

[LottieFiles]: https://github.com/LottieFiles

[lottie-docs]: https://lottiefiles.github.io/lottie-docs/

[unified]: https://github.com/unifiedjs/unified

[dotLottie.js]: https://github.com/dotlottie/dotlottie-js

[expressions]: https://lottiefiles.github.io/lottie-docs/expressions/#expressions

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting
