# relottie-metadata

![npm](https://img.shields.io/npm/v/@lottiefiles/relottie-metadata)
![npm](https://img.shields.io/npm/dt/%40lottiefiles/relottie-metadata)
![npm](https://img.shields.io/npm/l/@lottiefiles/relottie-metadata)

A [relottie] plugin to extract Lottie metadata from the document and store them in vfile.data.

## Use

```sh
yarn add @lottiefiles/relottie-metadata
```

```ts
import relottieParse, { type ParseFileData } from '@lottiefiles/relottie-parse';
import relottieStringify, { type StringifyFileData } from '@lottiefiles/relottie-stringify';
import relottieMetadata, { type MetadataFileData } from '@lottiefiles/relottie-metadata';
import { unified } from 'unified';

type FileData = ParseFileData & StringifyFileData & MetadataFileData

// The Lottie source: __fixtures__/features/auto-orient.json
const lottieJson = '...';

const vfile = unified()
  .use(relottieParse)
  .use(relottieMetadata)
  .use(relottieStringify)
  .processSync(lottieJson);

const data = vfile.data as FileData
const output = data['metadata']
```

`output`:

```snap
{
  "colors": Set {
    "#3250b0",
  },
  "fileSize": {
    "bytes": 2653,
    "formated": {
      "exponent": 1,
      "symbol": "KiB",
      "unit": "KiB",
      "value": "2.59",
    },
  },
  "framerate": 60,
  "frames": 180,
  "generator": "Glaxnimate 0.4.6-26-g7b05e75c",
  "height": 512,
  "inPoint": 0,
  "outPoint": 180,
  "version": "5.5.7",
  "width": 512,
}
...
```

## FileData

```typescript
export interface MetadataFileData extends Data {
  metadata: {
    /**
     * Set of hex colors used in the animation.
     */
    colors: Set<string>;
    /** *
     * Size of the Lottie JSON
     */
    fileSize?: FileSizeValue;
    /**
     * Framerate in frames per second
     */
    framerate: number;
    /**
     * Total number of frames in the animation.
     */
    frames: number;
    /**
     * Generator of the animation.
     */
    generator: string;
    /**
     * Height of the animation.
     */
    height: number;
    /**
     * Which frame the animation starts at (usually 0)
     */
    inPoint: number;
    /**
     * Which frame the animation stops/loops at, which makes this the duration in frames
     */
    outPoint: number;
    /**
     * Version of the Lottie JSON.
     */
    version: string;
    /**
     * Width of the animation.
     */
    width: number;  
  };
}
```

## Start

1. `pnpm install`
2. `pnpm ts-node playground.ts` for testing playground environment (if you are in the root folder you have to enter the package directory `cd packages/relottie-metadata`)
3. for testing `pnpm test`

## Legal

[MIT](LICENSE) © [LottieFiles](https://www.lottiefiles.com)

<!-- Definitions -->

[relottie]: https://github.com/LottieFiles/relottie

[unified]: https://github.com/unifiedjs/unified