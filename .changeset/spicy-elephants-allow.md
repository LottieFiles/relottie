---
'@lottiefiles/last-builder': major
---

feat: required changes to support last@v2
- capitalize types
- remove "valueType", adjust "pt" helper after PrimitiveNode was split into String, Number, Null & Booelan Nodes
- remove the PrimitiveParts type since it is not relevant anymore after the "valueType" prop is removed
