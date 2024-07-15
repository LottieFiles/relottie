# relottie-extract-features

![npm](https://img.shields.io/npm/v/@lottiefiles/relottie-extract-features)
![npm](https://img.shields.io/npm/dt/%40lottiefiles/relottie-extract-features)
![npm](https://img.shields.io/npm/l/@lottiefiles/relottie-extract-features)

A [relottie] plugin to extract Lottie features from the document and store them in vfile.

## FileData

```typescript
export type UsedCount = number;

export type Used = Map<
  AnyTitle,
  {
    /**
     * Total unused count
     */
    n: UsedCount;
    /**
     * Map of parent titles to whether how many nodes is used or not_used in the parent
     */
    parents: Map<AnyTitle, { n: UsedCount; y: UsedCount }>;
    /**
     * Total used count
     */
    y: UsedCount;
  }
>;

export interface ExtractFeaturesFileData extends Data {
  'extract-features': Used;
}
```

## Use

```sh
yarn add @lottiefiles/relottie-extract-features
```

```ts
import relottieParse, { type ParseFileData } from '@lottiefiles/relottie-parse';
import relottieStringify, { type StringifyFileData } from '@lottiefiles/relottie-stringify';
import relottieExtractFeatures, { type ExtractFeaturesFileData } from '@lottiefiles/relottie-extract-features';
import { unified } from 'unified';

type FileData = ParseFileData & StringifyFileData & ExtractFeaturesFileData

const lottie = '{ "layers": [ { "nm": "foo", "mn": "bar", "ddd": 0, "ty": 2 } ] }';

const vfile = unified()
  .use(relottieParse)
  .use(relottieExtractFeatures)
  .use(relottieStringify)
  .processSync(lottie);

const data = vfile.data as FileData
const output = data['extract-features']
```

`output`:

```
Map {
  "composition" => Object {
    "n": 0,
    "parents": Map {
      "animation" => Object {
        "n": 0,
        "y": 1,
      },
    },
    "y": 1,
  },
  "composition-children" => Object {
    "n": 0,
    "parents": Map {
      "composition" => Object {
        "n": 0,
        "y": 1,
      },
    },
    "y": 1,
  },
  "layer-image" => Object {
    "n": 0,
    "parents": Map {
      "composition-children" => Object {
        "n": 0,
        "y": 1,
      },
    },
    "y": 1,
  },
  "name" => Object {
    "n": 0,
    "parents": Map {
      "layer-image" => Object {
        "n": 0,
        "y": 1,
      },
    },
    "y": 1,
  },
  "match-name" => Object {
    "n": 0,
    "parents": Map {
      "layer-image" => Object {
        "n": 0,
        "y": 1,
      },
    },
    "y": 1,
  },
  "threedimensional" => Object {
    "n": 1,
    "parents": Map {
      "layer-image" => Object {
        "n": 1,
        "y": 0,
      },
    },
    "y": 0,
  },
  "layer-type" => Object {
    "n": 0,
    "parents": Map {
      "layer-image" => Object {
        "n": 0,
        "y": 1,
      },
    },
    "y": 1,
  },
}
```

## Start

1. `pnpm install`
2. `pnpm ts-node playground.ts` for testing playground environment (if you are in the root folder you have to enter the package directory `cd packages/relottie-extract-features`)
3. for testing `pnpm test`

## Legal

[MIT](LICENSE) © [LottieFiles](https://www.lottiefiles.com)

<!-- Definitions -->

[relottie]: https://github.com/LottieFiles/relottie

[unified]: https://github.com/unifiedjs/unified