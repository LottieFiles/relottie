/**
 * Copyright 2023 Design Barn Inc.
 */

import { TITLES } from '../src/titles.js';

const SNAPSHOT_DIR_PATH = './__snapshots__/';

test('TITLES should match snapshots', () => {
  expect(TITLES).toMatchSnapshot(`${SNAPSHOT_DIR_PATH}-titles.snap`);
});
