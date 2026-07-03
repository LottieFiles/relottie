---
'@lottiefiles/relottie-metadata': patch
---

Fix metadata extraction on untrusted/malformed Lottie input: numeric `0` and
empty-string values are no longer dropped by a falsy guard, and `getFileSize`
no longer throws on malformed or pathologically nested input.
