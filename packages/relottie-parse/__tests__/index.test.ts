/**
 * Copyright 2022 Design Barn Inc.
 */

import { readdirSync, readFileSync } from 'fs';
import path from 'path';

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
