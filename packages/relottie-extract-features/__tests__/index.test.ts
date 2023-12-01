/**
 * Copyright 2022 Design Barn Inc.
 */

import { readdirSync, readFileSync } from 'fs';
import path from 'path';

import relottieParse from '@lottiefiles/relottie-parse';
import relottieStringify from '@lottiefiles/relottie-stringify';
import { toMatchSpecificSnapshot } from 'jest-specific-snapshot';
import { unified } from 'unified';

import relottieExtractFeatures from '../src/extract-features.js';

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

describe('relottie-extract-features', () => {
  describe('fixtures', () => {
    const LOTTIES_DIR_NAME = 'features';

    describe(LOTTIES_DIR_NAME, () => {
      const dirPath = `${FIXTURE_DIR_PATH + LOTTIES_DIR_NAME}/`;
      const snapshotDirPath = `${SNAPSHOT_DIR_PATH + LOTTIES_DIR_NAME}/`;

      const files = readdirSync(dirPath);

      files.forEach((file) => {
        const jsonFile = readFileSync(dirPath + file, 'utf8');
        const fileName = path.parse(file).name;

        test(`Test in ${file} should have correct data`, () => {
          const vfile = unified()
            .use(relottieParse, { position: false })
            .use(relottieExtractFeatures)
            .use(relottieStringify)
            .processSync(jsonFile);

          expect(vfile.data['extract-features']).toMatchSpecificSnapshot(`${snapshotDirPath + fileName}.snap`);
        });
      });
    });
  });
});
