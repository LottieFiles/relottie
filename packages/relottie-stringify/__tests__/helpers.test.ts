/**
 * Copyright 2024 Design Barn Inc.
 */

import type { ObjectNode } from '@lottiefiles/last';
import { at, el, ob, pt, rt } from '@lottiefiles/last-builder';

import type { JSONObject } from '../src/helpers.js';
import { evaluate } from '../src/helpers.js';

describe('evaluate() — recursion depth guard', () => {
  const buildNested = (depth: number): ObjectNode => {
    if (depth <= 0) {
      return ob('custom', [at('v', 'custom', pt(1))]);
    }

    return ob('custom', [el('e', 'metadata', buildNested(depth - 1))]);
  };

  test('throws a RangeError once nesting exceeds the maximum depth', () => {
    const tree = rt([el('e', 'metadata', buildNested(1100))]);

    expect(() => evaluate(tree)).toThrow(RangeError);
    expect(() => evaluate(tree)).toThrow(/AST nesting depth exceeds the maximum of 1024/u);
  });

  test('does not throw for shallow, real-world-shaped trees', () => {
    const tree = rt([el('e', 'metadata', buildNested(5))]);

    expect(() => evaluate(tree)).not.toThrow();
  });
});

describe('evaluate() — null-prototype objects', () => {
  test('produces objects with a null prototype', () => {
    const tree = rt([at('v', 'custom', pt('x'))]);

    const result = evaluate(tree) as JSONObject;

    expect(Object.getPrototypeOf(result)).toBeNull();
  });

  test('stores a `__proto__`-named member as its own data property instead of mutating the prototype', () => {
    const tree = rt([at('__proto__', 'custom', pt('polluted'))]);

    const result = evaluate(tree) as JSONObject;

    expect(Object.hasOwn(result, '__proto__')).toBe(true);
    expect(Object.getOwnPropertyDescriptor(result, '__proto__')?.['value']).toBe('polluted');
    // Ensure the wider Object prototype was never touched.
    expect(({} as JSONObject)['polluted']).toBeUndefined();
  });
});
