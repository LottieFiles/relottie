# last-builder

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
    type: 'root',
    title: 'animation',
    hasExpressions: false,
    children: [
    {
        type: 'attribute',
        key: 'v',
        title: 'version',
        children: [
        {
            type: 'primitive',
            value: '4.8.0',
        },
        ],
    },
    {
        type: 'element',
        key: 'meta',
        title: 'metadata',
        children: [
        {
            type: 'object',
            title: 'custom',
            children: [
            {
                type: 'attribute',
                key: 'a',
                title: 'author',
                children: [
                {
                    type: 'primitive',
                    value: 'LottieFiles',
                },
                ],
            },
            {
                type: 'attribute',
                key: 'd',
                title: 'description',
                children: [
                {
                    type: 'primitive',
                    value: 'A lottie animation.',
                },
                ],
            },
            {
                type: 'attribute',
                key: 'data',
                title: 'custom',
                children: [
                {
                    type: 'primitive',
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
