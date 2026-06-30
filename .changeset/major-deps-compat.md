---
'@lottiefiles/last': patch
'@lottiefiles/relottie': patch
'@lottiefiles/relottie-metadata': patch
'@lottiefiles/relottie-parse': patch
'@lottiefiles/relottie-stringify': patch
---

chore: align codebase with 28-package major dependency bump

- turbo 2.x: rename `pipeline` → `tasks` in turbo.json
- typescript 6.0: add `ignoreDeprecations: "6.0"` to tsconfigs; add per-package `types` arrays to restore test globals under TS 6 + pnpm
- unified 11: `ParserFunction` → `Parser`, `CompilerFunction` → `Compiler`; drop removed `FrozenProcessor`; augment `Settings` interface for `.data('settings', …)` type-checking
- unist-util-is 6: replace unsupported explicit-generic `is<T>(node, type)` calls with direct `.type` comparisons
- jest 30: regenerate snapshots (dropped legacy `Object {` / `Array [` serialiser prefixes)
- prettier 3: override `prettier-plugin-pkg` to `^0.22.1` to fix crash on package.json files
- eslint: hold at 7.32.0 (incompatible with `@lottiefiles/eslint-plugin` under Node 24)
