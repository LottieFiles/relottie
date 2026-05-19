---
'@lottiefiles/relottie-parse': patch
---

fix: type imports for `@humanwhocodes/momoa@3.3.10` — `ContainerNode` no longer re-exported from main entry. Replace with
inline `DocumentNode | MemberNode | ElementNode` union, and relax `traverse` visitor parameter types to match upstream
signature.
