/**
 * Copyright 2022 Design Barn Inc.
 */

import { readdirSync, readFileSync } from 'fs';
import path from 'path';

import type { ArrayNode, Attribute, ObjectNode, Primitive } from '@lottiefiles/last';
import { ar, at, cl, el, ob, pt } from '@lottiefiles/last-builder';
import { toMatchSpecificSnapshot } from 'jest-specific-snapshot';
import { unified } from 'unified';

import relottieParse from '../src/index.js';

expect.extend({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  toMatchDecoratedSpecificSnapshot(received, snapshotFile) {
    // You can modify received data or create dynamic snapshot path
    return toMatchSpecificSnapshot.call(this, received, snapshotFile, '');
  },
});

const FIXTURE_DIR_PATH = '../../__fixtures__/';
const SNAPSHOT_DIR_PATH = './__snapshots__/';

describe('parse()', () => {
  describe('fixtures', () => {
    const STRUCTURE_DIR_NAME = 'structure';

    describe(STRUCTURE_DIR_NAME, () => {
      const dirPath = `${FIXTURE_DIR_PATH + STRUCTURE_DIR_NAME}/`;
      const snapshotDirPath = `${SNAPSHOT_DIR_PATH + STRUCTURE_DIR_NAME}/`;

      const files = readdirSync(dirPath);

      files.forEach((file) => {
        const jsonFile = readFileSync(dirPath + file, 'utf8');
        const fileName = path.parse(file).name;

        test(`Test in ${file} should parse correctly`, () => {
          const tree = unified().use(relottieParse, { position: false }).parse(jsonFile);

          expect(tree).toMatchSpecificSnapshot(`${snapshotDirPath + fileName}.snap`);
        });
      });
    });

    const LOTTIES_DIR_NAME = 'features';

    describe(LOTTIES_DIR_NAME, () => {
      const dirPath = `${FIXTURE_DIR_PATH + LOTTIES_DIR_NAME}/`;
      const snapshotDirPath = `${SNAPSHOT_DIR_PATH + LOTTIES_DIR_NAME}/`;

      const files = readdirSync(dirPath);

      files.forEach((file) => {
        const jsonFile = readFileSync(dirPath + file, 'utf8');
        const fileName = path.parse(file).name;

        test(`Test in ${file} should parse correctly`, () => {
          const tree = unified().use(relottieParse, { position: false }).parse(jsonFile);

          expect(tree).toMatchSpecificSnapshot(`${snapshotDirPath + fileName}.snap`);
        });
      });
    });
  });
});

describe('parse() with phantomRoot', () => {
  test('should parse phantomRoot as Collection correctly', () => {
    const json = [
      {
        o: {
          x: [0.3290197926422512],
        },
      },
    ];

    const phantomRoot = cl('k', 'keyframe-list');

    const tree = unified().use(relottieParse, { phantomRoot, position: false }).parse(JSON.stringify(json));

    const expected: ArrayNode = ar('keyframe-list-children', [
      ob('keyframe', [
        el('o', 'keyframe-out-tangent', [
          ob('keyframe-bezier-handle', [
            cl('x', 'bezier-x-axis', [ar('bezier-x-axis-children', [pt(0.3290197926422512, { valueType: 'number' })])]),
          ]),
        ]),
      ]),
    ]);

    expect(tree).toEqual(expected);
  });

  test('should parse phantomRoot as Element correctly', () => {
    const json = {
      sid: 'something',
    };

    const phantomRoot = el('r', 'rotation-clockwise');

    const tree = unified().use(relottieParse, { phantomRoot, position: false }).parse(JSON.stringify(json));

    const expected: ObjectNode = ob('animated-value-static', [
      at('sid', 'slot-id', pt('something', { valueType: 'string' })),
    ]);

    expect(tree).toEqual(expected);
  });

  test('should parse phantomRoot as Attribute correctly', () => {
    const json = 'something';

    const phantomRoot = at('sid', 'slot-id');

    const tree = unified().use(relottieParse, { phantomRoot, position: false }).parse(JSON.stringify(json));

    const expected: Primitive = pt('something', { valueType: 'string' });

    expect(tree).toEqual(expected);
  });
});
