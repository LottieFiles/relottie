---
'@lottiefiles/relottie-stringify': minor
---

Harden `evaluate` against untrusted/pathologically deep Lottie ASTs:
enforce a recursion depth limit and build objects with a null prototype to
avoid inherited-property confusion. A new `stringify` option, `maxDepth`
(default `1024`), lets callers tune the limit.
