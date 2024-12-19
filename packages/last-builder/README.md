# last-builder

![npm](https://img.shields.io/npm/v/@lottiefiles/last-builder)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/%40lottiefiles%2Flast-builder)
![npm](https://img.shields.io/npm/dt/%40lottiefiles/last-builder)
![npm](https://img.shields.io/npm/l/@lottiefiles/last-builder)

Use composable functions to build up a [last] structure

## Use

```sh
yarn add @lottiefiles/last-builder
```

```ts
import { at, el, ob, pt, rt } from '@lottiefiles/last-builder';

const output = rt([
    at('v', 'version', pt('4.8.0')),
    el(
    'meta',
    'metadata',
    ob('custom', [
        at('a', 'author', pt('LottieFiles')),
        at('d', 'description', pt('A lottie animation.')),
        at('data', 'custom', pt(2)),
    ]),
    ),
]);
```

`output` will equal

```javascript
{
    type: 'Root',
    title: 'animation',
    hasExpressions: false,
    children: [
    {
        type: 'Attribute',
        key: 'v',
        title: 'version',
        children: [
        {
            type: 'Strubg',
            value: '4.8.0',
        },
        ],
    },
    {
        type: 'Element',
        key: 'meta',
        title: 'metadata',
        children: [
        {
            type: 'Object',
            title: 'custom',
            children: [
            {
                type: 'Attribute',
                key: 'a',
                title: 'author',
                children: [
                {
                    type: 'String',
                    value: 'LottieFiles',
                },
                ],
            },
            {
                type: 'Attribute',
                key: 'd',
                title: 'description',
                children: [
                {
                    type: 'String',
                    value: 'A lottie animation.',
                },
                ],
            },
            {
                type: 'Attribute',
                key: 'data',
                title: 'custom',
                children: [
                {
                    type: 'Number',
                    value: 2,
                },
                ],
            },
            ],
        },
        ],
    },
    ]
}
```

## Legal

[License](license) © [LottieFiles][]

[last]: https://github.com/LottieFiles/relottie/tree/main/packages/last

[LottieFiles]: https://github.com/LottieFiles
