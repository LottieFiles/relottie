/**
 * Copyright 2022 Design Barn Inc.
 */

import { at, el, ob, pt, rt } from '../src/index.js';

describe('should create a last tree correctly', () => {
  test('should create a last tree correctly', () => {
    const tree = rt([
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

    const output = {
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
      ],
    };

    expect(tree).toEqual(output);
  });
});
