/**
 * Copyright 2023 Design Barn Inc.
 */

import { URL, fileURLToPath } from 'node:url';

import { execa } from 'execa';
import test from 'tape';

test('relottie-cli', (t) => {
  t.plan(2);

  // eslint-disable-next-line no-shadow
  t.test('should show help on `--help`', (t) => {
    const bin = fileURLToPath(new URL('cli.js', import.meta.url));

    t.plan(1);

    execa(bin, ['--help']).then((result) => {
      t.equal(
        result.stdout,
        [
          'Usage: relottie [options] [path | glob ...]',
          '',
          '  Command line interface to inspect and change Lottie files with relottie',
          '',
          'Options:',
          '',
          '  -h  --help                              output usage information',
          '  -v  --version                           output version number',
          '  -o  --output [path]                     specify output location',
          '  -r  --rc-path <path>                    specify configuration file',
          '  -i  --ignore-path <path>                specify ignore file',
          '  -s  --setting <settings>                specify settings',
          '  -e  --ext <extensions>                  specify extensions',
          '  -u  --use <plugins>                     use plugins',
          '  -w  --watch                             watch for changes and reprocess',
          '  -q  --quiet                             output only warnings and errors',
          '  -S  --silent                            output only errors',
          '  -f  --frail                             exit with 1 on warnings',
          '  -t  --tree                              specify input and output as syntax tree',
          '      --report <reporter>                 specify reporter',
          '      --file-path <path>                  specify path to process as',
          '      --ignore-path-resolve-from dir|cwd  resolve patterns in `ignore-path` from its directory or cwd',
          '      --ignore-pattern <globs>            specify ignore patterns',
          '      --silently-ignore                   do not fail when given ignored files',
          '      --tree-in                           specify input as syntax tree',
          '      --tree-out                          output syntax tree',
          '      --inspect                           output formatted syntax tree',
          '      --[no-]stdout                       specify writing to stdout (on by default)',
          '      --[no-]color                        specify color in report (on by default)',
          '      --[no-]config                       search for configuration files (on by default)',
          '      --[no-]ignore                       search for ignore files (on by default)',
          '',
          'Examples:',
          '',
          '  # Process `input.json`',
          '  $ relottie input.json -o output.json',
          '',
          '  # Pipe',
          '  $ relottie < input.json > output.json',
          '',
          '  # Rewrite all applicable files',
          '  $ relottie . -o',
        ].join('\n'),
        'should show help',
      );
    });
  });

  // eslint-disable-next-line no-shadow
  t.test('should show version on `--version`', (t) => {
    const bin = fileURLToPath(new URL('cli.js', import.meta.url));

    t.plan(2);

    execa(bin, ['--version']).then((result) => {
      t.ok(/relottie: \d+\.\d+\.\d+/u.test(result.stdout), 'should include relottie version');

      t.ok(/relottie-cli: \d+\.\d+\.\d+/u.test(result.stdout), 'should include relottie-cli version');
    });
  });
});
