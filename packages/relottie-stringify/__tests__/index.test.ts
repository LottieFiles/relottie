/**
 * Copyright 2022 Design Barn Inc.
 */

import { at, el, ob, pt, rt } from '@lottiefiles/last-builder';
import relottieParse from '@lottiefiles/relottie-parse';
import { unified } from 'unified';
import { VFile } from 'vfile';

import relottieStringify from '../src/index.js';
import { stringify } from '../src/stringify.js';

const lottie = '{"v":"5.5.7"}';

describe('stringify()', () => {
  test('serializes LAST', () => {
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

    const result = stringify(tree, new VFile());

    const output = '{"v":"4.8.0","meta":{"a":"LottieFiles","d":"A lottie animation.","data":2}}';

    expect(String(result)).toEqual(output);
  });

  test('honours a custom maxDepth via SettingsOptions', () => {
    const tree = rt([el('meta', 'metadata', ob('custom', [at('a', 'author', pt('LottieFiles'))]))]);

    expect(() => stringify(tree, new VFile(), { stringify: { maxDepth: 1 } })).toThrow(
      /AST nesting depth exceeds the maximum of 1/u,
    );
  });
});

describe('relottie-stringify', () => {
  test('by default should create a lottieJson', () => {
    const file = unified().use(relottieParse).use(relottieStringify).processSync(lottie);

    expect(file.data['stringify']).toEqual(undefined);
    expect(String(file.value)).toEqual(lottie);
  });

  test('honours a custom maxDepth passed to the plugin', () => {
    expect(() =>
      unified().use(relottieParse).use(relottieStringify, { maxDepth: 0 }).processSync('{"v":"5.5.7","fr":30}'),
    ).toThrow(/AST nesting depth exceeds the maximum of 0/u);
  });
});
