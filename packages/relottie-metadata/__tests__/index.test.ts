/**
 * Copyright 2024 Design Barn Inc.
 */

import { readdirSync, readFileSync } from 'fs';
import path from 'path';

import relottieParse from '@lottiefiles/relottie-parse';
import relottieStringify from '@lottiefiles/relottie-stringify';
import { toMatchSpecificSnapshot } from 'jest-specific-snapshot';
import { unified } from 'unified';

import relottieMetadata from '../src/metadata.js';

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

describe('relottie-metadata', () => {
  describe('fixtures', () => {
    const FEATURES_DIR_NAME = 'features';
    const EXTRA_DIR_NAME = 'extra';

    describe(FEATURES_DIR_NAME, () => {
      const dirPath = `${FIXTURE_DIR_PATH + FEATURES_DIR_NAME}/`;
      const snapshotDirPath = `${SNAPSHOT_DIR_PATH + FEATURES_DIR_NAME}/`;

      const files = readdirSync(dirPath);

      files.forEach((file) => {
        const jsonFile = readFileSync(dirPath + file, 'utf8');
        const fileName = path.parse(file).name;

        test(`Test in ${file} should have correct data`, () => {
          const vfile = unified()
            .use(relottieParse, { position: false })
            .use(relottieMetadata)
            .use(relottieStringify)
            .processSync(jsonFile);

          expect(vfile.data['metadata']).toMatchSpecificSnapshot(`${snapshotDirPath + fileName}.snap`);
        });
      });
    });

    describe(EXTRA_DIR_NAME, () => {
      const dirPath = `${FIXTURE_DIR_PATH + EXTRA_DIR_NAME}/`;
      const snapshotDirPath = `${SNAPSHOT_DIR_PATH + EXTRA_DIR_NAME}/`;

      const files = readdirSync(dirPath);

      files.forEach((file) => {
        const jsonFile = readFileSync(dirPath + file, 'utf8');
        const fileName = path.parse(file).name;

        test(`Test in ${file} should have correct data`, () => {
          const vfile = unified()
            .use(relottieParse, { position: false })
            .use(relottieMetadata)
            .use(relottieStringify)
            .processSync(jsonFile);

          expect(vfile.data['metadata']).toMatchSpecificSnapshot(`${snapshotDirPath + fileName}.snap`);
        });
      });
    });
  });
});
