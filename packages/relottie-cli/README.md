# relottie-cli

Command line interface to inspect and change Lottie files with **[relottie][relottie-core]**.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [Use](#use)
*   [CLI](#cli)
*   [Examples](#examples)
*   [Compatibility](#compatibility)
*   [Security](#security)
*   [Acknowledgments](#acknowledgments)
*   [License](#license)

## What is this?

This package is a command line interface (CLI) that you can use in your terminal
or in npm scripts and the like to inspect and change lottie files.
This CLI is built around relottie, which is an ecosystem of plugins
that work with lottie as structured data, specifically ASTs (abstract syntax
trees).
You can choose from the 10+ plugins that already exist or make your own.

See [the monorepo readme][relottie] for info on what the relottie ecosystem is.

## When should I use this?

You can use this package when you want to work with the lottie files in your
project from the command line.
`relottie-cli` has many options and you can combine it with many plugins, so it
should be possible to do what you want.
If not, you can always use [`relottie`][relottie] itself manually in a script.

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).
In Node.js (version 14.14+, or 16.0+), install with [npm][]:

```sh
npm install @lottiefiles/relottie-cli
```

## Use

## CLI

The interface of `relottie-cli` is explained as follows on its help page
(`relottie --help`):

```txt
Usage: relottie [options] [path | glob ...]

  Command line interface to inspect and change Lottie files with relottie

Options:

  -h  --help                              output usage information
  -v  --version                           output version number
  -o  --output [path]                     specify output location
  -r  --rc-path <path>                    specify configuration file
  -i  --ignore-path <path>                specify ignore file
  -s  --setting <settings>                specify settings
  -e  --ext <extensions>                  specify extensions
  -u  --use <plugins>                     use plugins
  -w  --watch                             watch for changes and reprocess
  -q  --quiet                             output only warnings and errors
  -S  --silent                            output only errors
  -f  --frail                             exit with 1 on warnings
  -t  --tree                              specify input and output as syntax tree
      --report <reporter>                 specify reporter
      --file-path <path>                  specify path to process as
      --ignore-path-resolve-from dir|cwd  resolve patterns in `ignore-path` from its directory or cwd
      --ignore-pattern <globs>            specify ignore patterns
      --silently-ignore                   do not fail when given ignored files
      --tree-in                           specify input as syntax tree
      --tree-out                          output syntax tree
      --inspect                           output formatted syntax tree
      --[no-]stdout                       specify writing to stdout (on by default)
      --[no-]color                        specify color in report (on by default)
      --[no-]config                       search for configuration files (on by default)
      --[no-]ignore                       search for ignore files (on by default)

Examples:

  # Process `input.json`
  $ relottie input.json -o output.json

  # Pipe
  $ relottie < input.json > output.json

  # Rewrite all applicable files
  $ relottie . -o
```

More information on all these options is available at
[`unified-args`][unified-args], which does the work.
`relottie-cli` is `unified-args` preconfigured to:

*   Load `@lottiefiles/relottie-` plugins
*   Search for lottie extensions `.json`
*   Ignore paths found in [`.relottieignore` files][ignore-file]
*   Load configuration from
    [`.relottierc`, `.relottierc.js`, etc files][config-file]
*   Use configuration from
    [`relottieConfig` fields in `package.json` files][config-file]

## Examples

### Example: generating LAST tree on the CLI

This example converts LottieJSON into Lottie AST [last][] with `relottie-cli`.
It assumes you’re in a Node.js package.

First, install the CLI and plugins:

```sh
npm install @lottiefiles/relottie-cli --save-dev
```

Now, add an npm script in your `package.json`:

```js
  /* … */
  "scripts": {
    /* … */
    "generate:last": "relottie lottie-animation --tree-out --output",
    /* … */
  },
  /* … */
```

Observe that the above change adds a `relottie` plugins script, which can be run with
`npm run generate:last`.
It runs relottie on all lottie files under (`lottie-animation`) directory 
(it's better to specify the folder because Lottie files are JSON format) and rewrites them (`--output`).

Run `./node_modules/.bin/relottie --help` for more info on the CLI.

Then, add a `relottieConfig` to your `package.json` to configure relottie:

```js
  /* … */
  "relottieConfig": {
    "parse": {
      "position": false
    },
    "plugins": [/** a list of unist plugins that compatible with relottie */]
  },
  /* … */
```

> 👉 **Note**: you must remove the comments in the above examples when
> copy/pasting them, as comments are not supported in `package.json` files.

Finally, you can run the npm script to replace Lottie Files with [last][] files in your
project:

```sh
npm run generate:last
```

### Example: config files (JSON, YAML, JS)

In the previous example, we saw that `relottie-cli` was configured from within a
`package.json` file.
That’s a good place when the configuration is relatively short, when you have a
`package.json`, and when you don’t need comments (which are not allowed in
JSON).

You can also define configuration in separate files in different languages.
With the `package.json` config as inspiration, here’s a JavaScript version that
can be placed in `.relottierc.js`:

```js
import relottiePlugin from '...'

const relottieConfig = {
  settings: {
    parse: {
      position: false
    },
  }
  plugins: [
    relottiePlugin
  ]
}

export default relottieConfig
```

This is the same configuration in YAML, which can be placed in `.relottierc.yml`:

```yml
parse:
  position: false
plugins:
  - relottie-plugin
```

When `relottie-cli` is about to process a lottie file it’ll search the file
system upwards for configuration files starting at the folder where that file
exists.
Take the following file structure as an illustration:

```txt
folder/
├─ subfolder/
│  ├─ .relottierc
│  └─ lottie.json
├─ .relottierc.js
├─ package.json
└─ readme.md
```

When `folder/subfolder/file.json` is processed, the closest config file is
`folder/subfolder/.relottierc.json`.
For `folder/readme.md`, it’s `folder/.relottierc.js`.

The order of precedence is as follows.
Earlier wins (so in the above file structure `folder/.relottierc.js` wins over
`folder/package.json`):

1.  `.relottierc` (JSON)
2.  `.relottierc.json` (JSON) (we should not use it since Lottie files are `.json` formats)
3.  `.relottierc.cjs` (CJS)
4.  `.relottierc.mjs` (ESM)
5.  `.relottierc.js` (CJS or ESM, depending on `type: 'module'` in `package.json`)
6.  `.relottierc.yaml` (YAML)
7.  `.relottierc.yml` (YAML)
8.  `package.json` with `relottieConfig` field

## Compatibility

Projects maintained by the unified collective are compatible with all maintained
versions of Node.js.
As of now, that is Node.js 14.14+, and 16.0+.
Our projects sometimes work with older versions, but this is not guaranteed.

## Security

As last properties can have [expressions][], and improper use of **last** can open you up to cross-site scripting [cross-site scripting (XSS)][XSS]. Carefully assess each plugin and the risks involved in using them.

## Contribute

Any contributions are welcome.

By interacting with this repository, organization, or community you agree to abide by its terms.

## Acknowledgments

- [remark-cli][]

## License

[License](./LICENSE) © [LottieFiles][]

<!-- Definitions -->

[license]: https://github.com/relottiejs/relottie/blob/main/license

[LottieFiles]: https://github.com/LottieFiles

[npm]: https://docs.npmjs.com/cli/install

[last]: https://github.com/LottieFiles/relottie/tree/main/packages/last

[relottie]: https://github.com/LottieFiles/relottie

[config-file]: https://github.com/unifiedjs/unified-engine/blob/main/doc/configure.md

[ignore-file]: https://github.com/unifiedjs/unified-engine/blob/main/doc/ignore.md

[unified-args]: https://github.com/unifiedjs/unified-args#cli

[relottie-core]: https://github.com/LottieFiles/relottie/tree/main/packages/relottie

[remark-cli]: https://github.com/remarkjs/remark/tree/main/packages/remark-cli

[expressions]: https://lottiefiles.github.io/lottie-docs/expressions/#expressions

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting
