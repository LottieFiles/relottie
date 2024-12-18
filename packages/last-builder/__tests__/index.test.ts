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
              type: 'String',
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
      ],
    };

    expect(tree).toEqual(output);
  });
});
