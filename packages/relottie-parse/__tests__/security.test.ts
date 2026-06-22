/**
 * Copyright 2024 Design Barn Inc.
 */

import { unified } from 'unified';

import relottieParse from '../src/index.js';
import type { Options } from '../src/unified-relottie-parse.js';

const parseDoc = (doc: string, options: Options = {}): unknown => unified().use(relottieParse, options).parse(doc);

const VALID_SHALLOW = '{"v":"5.5.2","fr":0,"ip":0,"op":10,"w":1,"h":1,"ddd":0,"layers":[]}';

describe('parse() — input hardening', () => {
  describe('nesting depth guard', () => {
    it('rejects input deeper than the default maxDepth without throwing a RangeError', () => {
      const deep = '['.repeat(5000) + ']'.repeat(5000);

      expect(() => parseDoc(deep)).toThrow(/JSON nesting depth \d+ exceeds the maximum of 1024/u);
    });

    it('does not throw a raw RangeError (stack-overflow is converted to a controlled failure)', () => {
      const deep = '['.repeat(5000) + ']'.repeat(5000);

      expect(() => parseDoc(deep)).not.toThrow(RangeError);
    });

    it('honours a custom maxDepth', () => {
      expect(() => parseDoc('[[[1]]]', { maxDepth: 2 })).toThrow(/JSON nesting depth 3 exceeds the maximum of 2/u);
    });

    it('does not count brackets inside string literals', () => {
      // The string value contains many brackets but real nesting depth is 2.
      const doc = `{"a":"${'['.repeat(5000)}"}`;

      expect(() => parseDoc(doc, { maxDepth: 4 })).not.toThrow(/nesting depth/u);
    });
  });

  describe('size guard', () => {
    it('is disabled by default (maxBytes = 0)', () => {
      expect(() => parseDoc(VALID_SHALLOW)).not.toThrow(/Input size/u);
    });

    it('rejects input larger than maxBytes', () => {
      expect(() => parseDoc('{"a":1}', { maxBytes: 3 })).toThrow(/Input size 7 exceeds the maximum of 3/u);
    });
  });

  describe('malformed JSON', () => {
    it('surfaces a controlled failure instead of throwing raw', () => {
      expect(() => parseDoc('{not valid json')).toThrow(/Failed to parse JSON/u);
    });
  });

  describe('prototype-pollution-shaped keys', () => {
    it('does not pollute Object.prototype when a __proto__ member is present', () => {
      // Should parse (or fail on schema) without mutating the global prototype.
      try {
        parseDoc('{"__proto__":{"polluted":true},"layers":[]}');
      } catch {
        // schema-level failures are fine; we only assert no global pollution
      }

      expect(({} as Record<string, unknown>).polluted).toBeUndefined();
    });
  });
});
