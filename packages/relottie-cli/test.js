/**
 * Copyright 2023 Design Barn Inc.
 */

import { URL, fileURLToPath } from 'node:url';

import { execa } from 'execa';
import test from 'tape';

test('relottie-cli', (t) => {
  t.plan(2);

  // eslint-disable-next-line no-shadow
  t.test('should show help on `--help`', async (t) => {
    const bin = fileURLToPath(new URL('cli.js', import.meta.url));

    t.plan(4);

    const { stdout } = await execa(bin, ['--help']);

    t.match(
      stdout,
      /Usage: relottie \[options\] \[path \| glob \.\.\.\]/u,
      'should show usage header',
    );
    t.ok(stdout.includes('Command line interface to inspect and change Lottie files'), 'should include description');
    t.ok(stdout.includes('--help'), 'should list --help option');
    t.ok(stdout.includes('--version'), 'should list --version option');
  });

  // eslint-disable-next-line no-shadow
  t.test('should show version on `--version`', async (t) => {
    const bin = fileURLToPath(new URL('cli.js', import.meta.url));

    t.plan(2);

    const { stdout } = await execa(bin, ['--version']);

    t.ok(/relottie: \d+\.\d+\.\d+/u.test(stdout), 'should include relottie version');

    t.ok(/@lottiefiles\/relottie-cli: \d+\.\d+\.\d+/u.test(stdout), 'should include relottie-cli version');
  });
});
