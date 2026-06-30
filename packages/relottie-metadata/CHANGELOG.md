# @lottiefiles/relottie-metadata

## 1.15.2

### Patch Changes

- 2df1aa9: chore: align codebase with 28-package major dependency bump
  - turbo 2.x: rename `pipeline` → `tasks` in turbo.json
  - typescript 6.0: add `ignoreDeprecations: "6.0"` to tsconfigs; add per-package `types` arrays to restore test globals
    under TS 6 + pnpm
  - unified 11: `ParserFunction` → `Parser`, `CompilerFunction` → `Compiler`; drop removed `FrozenProcessor`; augment
    `Settings` interface for `.data('settings', …)` type-checking
  - unist-util-is 6: replace unsupported explicit-generic `is<T>(node, type)` calls with direct `.type` comparisons
  - jest 30: regenerate snapshots (dropped legacy `Object {` / `Array [` serialiser prefixes)
  - prettier 3: override `prettier-plugin-pkg` to `^0.22.1` to fix crash on package.json files
  - eslint: hold at 7.32.0 (incompatible with `@lottiefiles/eslint-plugin` under Node 24)

- Updated dependencies [2df1aa9]
  - @lottiefiles/last@1.15.2

## 1.15.0

### Patch Changes

- Updated dependencies [5db2c76]
- Updated dependencies [5db2c76]
  - @lottiefiles/last@1.15.0

## 1.13.0

### Patch Changes

- Updated dependencies [99136ce]
  - @lottiefiles/last@1.13.0

## 1.11.1

### Patch Changes

- 54163ec: chore(deps): fix lottiefiles/last version to a fixed version using workspace

## 1.9.1

### Patch Changes

- 3d3fed3: chore(package): add provenance to publishConfig
- Updated dependencies [3d3fed3]
  - @lottiefiles/last@1.9.1

## 1.4.0

### Major Changes

- d49a56e: feat: initial major release that captures these Lottie metadata: colors, fileSize, framerate, frames,
  geneartor, height, weight, inPoint, outPoint & version
