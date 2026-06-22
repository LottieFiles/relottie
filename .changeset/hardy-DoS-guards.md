---
'@lottiefiles/relottie-parse': minor
'@lottiefiles/relottie-stringify': patch
'@lottiefiles/relottie-metadata': patch
---

Harden parsing of untrusted Lottie JSON.

- **relottie-parse**: reject pathologically nested or oversized input before
  handing it to momoa, preventing an uncaught `RangeError: Maximum call stack
  size exceeded` (stack-overflow DoS). Two new `parse` options: `maxDepth`
  (default `1024`) and `maxBytes` (default `0`, disabled). momoa parse errors
  are now surfaced via `file.fail` instead of throwing raw. A `RangeError`
  raised by momoa's `traverse` (which can overflow at a shallower depth than
  `parse`) is likewise converted to a controlled failure, keeping the
  default-safe guarantee even when a caller raises `maxDepth`. Input-keyed
  lookups and accumulators use null-prototype objects / `Object.hasOwn` guards
  to avoid inherited-property confusion. Adds regression tests for the depth /
  size / malformed-JSON / prototype-key paths.
- **relottie-stringify**: `evaluate` now enforces a recursion depth limit
  (`1024`) and builds objects with a null prototype.
- **relottie-metadata**: numeric `0` and empty-string values are no longer
  dropped by a falsy guard; `getFileSize` no longer throws on malformed input.
