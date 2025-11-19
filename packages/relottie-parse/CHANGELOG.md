# @lottiefiles/relottie-parse

## 1.15.0

### Minor Changes

- 5db2c76: feat(options): introduce phantomRoot option to enable parsing from/for any Lottie node
- 5db2c76: feat: change parse return type from Root to NodeValue

### Patch Changes

- Updated dependencies [5db2c76]
- Updated dependencies [5db2c76]
  - @lottiefiles/last@1.15.0
  - @lottiefiles/last-builder@1.15.0

## 1.14.0

### Minor Changes

- 77768ef: fix(slots): titles detection

## 1.13.0

### Minor Changes

- 99136ce: fix: end-opacity is an Element node and related to "eo" prop

### Patch Changes

- Updated dependencies [99136ce]
  - @lottiefiles/last@1.13.0
  - @lottiefiles/last-builder@1.13.0

## 1.11.0

### Minor Changes

- 13a5a25: feat: bump Momoa to v3.3.5 with required changes

## 1.10.0

### Minor Changes

- c5ba28c: fix(slots): dont stop mutating titles after facing an undefined Slot

## 1.9.1

### Patch Changes

- 3d3fed3: chore(package): add provenance to publishConfig
- Updated dependencies [3d3fed3]
  - @lottiefiles/last@1.9.1
  - @lottiefiles/last-builder@1.9.1

## 1.9.0

### Patch Changes

- Updated dependencies [773d802]
  - @lottiefiles/last@1.9.0
  - @lottiefiles/last-builder@1.9.0

## 1.8.0

### Minor Changes

- b6b912c: fix(blend-mode): include missing Add & HardMix consts
- b6b912c: chore: bump lottie-types pkg to v1.2.0

### Patch Changes

- Updated dependencies [b6b912c]
  - @lottiefiles/last-builder@1.8.0
  - @lottiefiles/last@1.8.0

## 1.5.0

### Minor Changes

- bbe5425: chore: use OSS lottie-types by Lottie Animation Community (LAC)

### Patch Changes

- Updated dependencies [bbe5425]
  - @lottiefiles/last-builder@1.5.0
  - @lottiefiles/last@1.5.0

## 1.4.0

### Minor Changes

- bb20b89: fix(constants): trimMultipleShapesValues values"
- e2a3cf0: feat: support slots, slot, slotId, slotProperty

### Patch Changes

- e2a3cf0: refactor(parse): move traverse assistent logic to helpers & Stack to its own file
- 6f55f2c: chore: bump lottie-types to v1.5.0
- ff8bfa9: refactor(entities): remove duplicate strokeWidth, strokeHue, textFillBrightness props from objectEntity
- Updated dependencies [cdd475b]
- Updated dependencies [e2a3cf0]
- Updated dependencies [6f55f2c]
- Updated dependencies [63c9ffe]
  - @lottiefiles/last@1.4.0
  - @lottiefiles/last-builder@1.4.0

## 1.3.4

### Patch Changes

- f75c7fd: chore(devDeps): bump types/node to 18.18.9
- 7a3556e: chore: bump momoa version to 2.0.4
- fd0cd8f: chore(devDeps): bump esbuild to 0.19.5"
- Updated dependencies [c420329]
- Updated dependencies [fd0cd8f]
  - @lottiefiles/last-builder@1.3.4
  - @lottiefiles/last@1.3.4

## 1.3.1

### Patch Changes

- a8e9a62: feat: do not duplicate log messages with the vfile.messages and remove the unnecessary "warningMessage"
  option
- a8e9a62: feat: rename export relottie-parse's FileData type into ParseFileData
- a8e9a62: feat: add position and sourceId info when adding a vfile message

## 1.3.0

### Minor Changes

- c217b08: fix: move matteTarget to intBoolean
- c217b08: fix: move rangeUnits to numberConstantEntity
- c217b08: fix: detect constant textShapeValues for textShape
- c217b08: fix: detect mergeMode constant values & move to numberConstantEntity
- c217b08: fix: move keyframe x and y titles to number type entity & titles

### Patch Changes

- Updated dependencies [c217b08]
- Updated dependencies [c217b08]
- Updated dependencies [c217b08]
  - @lottiefiles/last@1.3.0
  - @lottiefiles/last-builder@1.3.0

## 1.2.3

### Patch Changes

- a60e86a: fix: textDocument width (sw) node

## 1.2.2

### Patch Changes

- Updated dependencies [566cb4c]
  - @lottiefiles/last@1.2.2
  - @lottiefiles/last-builder@1.2.2

## 1.2.1

### Patch Changes

- 5901e60: feat: layer-threedimensional title
- Updated dependencies [5901e60]
  - @lottiefiles/last@1.2.1
  - @lottiefiles/last-builder@1.2.1

## 1.2.0

### Minor Changes

- 4a54598: feat: find unique titles for string and number constant nodes: blendMode, composite, fillRule, lineCap,
  lineJoin, shapeDirection, trimMultipleShapes, matteMode & maskMode
- 4a54598: feat(titles): add constant blendMode titles
- 4a54598: feat(titles): add keyframe, keyframeList, keyframeValue, positionKeyframe, positionKeyframeList,
  keyframeBezierHandle prefixes to xAxisValue & yAxisValue
- 4a54598: feat(titles): add bezier prefix to inTangents, outTangents and vertices
- 4a54598: feat(titles): add keyframe, keyframeList, keyframeValue, positionKeyframe, positionKeyframeList,
  keyframeBezierHandle, shapeKeyframe to inTangent and outTangent
- 4a54598: feat(titles): add text- prefix to fillBrightness, fillColor, fillHue, fillOpacity, fillSaturation
- 4a54598: feat(titles): add shapeFillOpacity, shapeGradientFillOpacity, shapeGradientStrokeOpacity, layerStyleOpacity,
  shapeStrokeOpacity prefixes to opacity
- 4a54598: feat(titles): add audio prefix to level
- 4a54598: feat(titles): add text prefix to maxAmount, maxEase, minEase
- 4a54598: feat(titles): add shapeTrim prefix to offset
- 4a54598: feat(titles): add layerTransform, shapeTransform, transformRepeater, textStyle prefix to orientation
- 4a54598: feat(titles): add shapeRectangleSize,layerStyleStrokeSize prefixes to size
- 4a54598: feat(titles): rename valueOutTangent to positionKeyframeOutTangents
- 4a54598: feat(titles): rename valueInTangent to positionKeyframeInTangents
- 4a54598: feat(titles): add layerTransform, shapeTransform, transformRepeater, textStyle prefixes to skew & skewAxis
- 4a54598: feat(titles): add layerTransforms, shapeTransforms, transformRepeaters, textStyles prefixes to scale
- 4a54598: feat(titles): add shapePolygon & shapeStar prefixes to outerRoundness & outerRadius
- 4a54598: feat(titles): add shapeGradientFill, shapeGradientStroke prefixes to startPoint & endPoint
- 4a54598: feat(titles): add assetImage, assetPrecomposition, assetDataSource, assetFile prefixes to id
- 4a54598: feat(titles): rename blur to textBlur
- 4a54598: feat(titles): rename center to shapeTrimCenter
- 4a54598: feat(titles): add shapePolygon, shapeStar, shapeZigZags prefixes to points
- 4a54598: feat(titles): rename multiple to trimMultipleShapes
- 4a54598: feat(titles): rename closed to bezierClosed
- 4a54598: feat: add time titles for keyframe, keyframeList, keyframeValue, positionKeyframe, positionKeyframeList,
  keyframeBezierHandle, shapeKeyframe
- 4a54598: fix: effectIgnoredValue.v title and placement
- 4a54598: fix: numberOfProperties parent titles
- 4a54598: fix: rename effectList numberOfProperties title to effectPropertyCount
- 4a54598: refactor: remove unused ind titles for effectList and effectParams
- 4a54598: feat: rename effectValueAngle, effectValueCheckbox, effectValueColor, effectValueDropdown, effectValueLayer,
  effectValuePoint, effectValueSlider to effectParamAngle, effectParamCheckbox, effectParamColor, effectParamDropdown,
  effectParamLayer, effectParamPoint, effectParamSlider
- 4a54598: feat: rename effectParameters to effectParamList
- 4a54598: feat: add effectPropertyCount title
- 4a54598: feat(titles): rename effectValueAngleValue, effectValueCheckboxValue, effectValueColorValue,
  effectValueDropdownValue, effectValueLayerValue, effectValuePointValue, effectValueSliderValue to effectValueAngle,
  effectValueCheckbox, effectValueColor, effectValueDropdown, effectValueLayer, effectValuePoint, effectValueSlider
- 4a54598: feat: remove unused OT.effect title
- 4a54598: feat(titles): replace textTypeCaps with textCaps, textCapsRegular, textCapsAll, textCapsSmall
- 4a54598: feat(titles): add textBasedCharacters, textBasedCharacterExcludingSpaces, textBasedWords, textBasedLines
- 4a54598: feat(titles): replace textTypeGrouping with textGrouping, textGroupingCharacters, textGroupingWords,
  textGroupingLine, textGroupingAll
- 4a54598: feat(titles): replace textTypeJustify with textJustityLeft, textJustityRight, textJustityCenter,
  textJustityWithLastLineLeft, textJustityWithLastLineRight, textJustityWithLastLineCenter, textJustityWithLastLineFull
- 4a54598: feat(titles): replace textTypeShape with textShape, textShapeSquare, textShapeRampUp, textShapeRampDown,
  textShapeTriangle, textShapeRound, textShapeSmooth
- 4a54598: feat(titles): replace textType with fontPathOrigin, fontPathOriginLocal, fontPathOriginCssUrl,
  fontPathOriginScriptUrl, fontPathOriginFonturl
- 4a54598: feat(titles): replace textTypeVerticalJustify with textVerticalJustify, textVerticalJustifyTop,
  textVerticalJustifyCenter, textVerticalJustifyBottom
- 4a54598: feat(titles): detect & add rangeUnitsPercent & rangeUnitsIndex

### Patch Changes

- 4a54598: chore: bump lottie-types to v1.4.0
- 4a54598: feat: improve Momoa primitive types
- Updated dependencies [4a54598]
- Updated dependencies [4a54598]
- Updated dependencies [4a54598]
  - @lottiefiles/last@1.2.0
  - @lottiefiles/last-builder@1.2.0

## 1.1.0

### Minor Changes

- 00baff8: feat: ct prop named collapse-transform-new
- 00baff8: fix(entities): add missing selectorSmoothness value

### Patch Changes

- Updated dependencies [00baff8]
  - @lottiefiles/last@1.1.0
  - @lottiefiles/last-builder@1.1.0

## 1.0.9

### Patch Changes

- 8ab4369: feat: tp MatteParent
- Updated dependencies [8ab4369]
  - @lottiefiles/last@1.0.9
  - @lottiefiles/last-builder@1.0.9

## 1.0.8

### Patch Changes

- bc31556: fix: remove reference-id title duplicate
- Updated dependencies [bc31556]
  - @lottiefiles/last@1.0.8
  - @lottiefiles/last-builder@1.0.8

## 1.0.7

### Patch Changes

- 9c4f0a6: feat(entities): asset-file node
- Updated dependencies [9c4f0a6]
  - @lottiefiles/last@1.0.7
  - @lottiefiles/last-builder@1.0.7

## 1.0.6

### Patch Changes

- 6d3a1dd: feat(options): rename messages.warning into warningMessage
- 6d3a1dd: feat: remove deepmerge pkg
- 6d3a1dd: chore: move vfile deps to devDeps

## 1.0.5

### Patch Changes

- 8005cea: build: enable splitting & treeshake
- Updated dependencies [8005cea]
- Updated dependencies [8005cea]
  - @lottiefiles/last-builder@1.0.5
  - @lottiefiles/last@1.0.5

## 1.0.4

### Patch Changes

- a520179: refactor: 💡 improve relottie-parse bundle size

## 1.0.3

### Patch Changes

- 329f72c: chore(package): add main and types
- 329f72c: chore(package): add \*.d.ts to typesVersions
- Updated dependencies [329f72c]
- Updated dependencies [329f72c]
- Updated dependencies [329f72c]
  - @lottiefiles/last@1.0.3
  - @lottiefiles/last-builder@1.0.3

## 1.0.2

### Patch Changes

- 5f59978: feat: dont use jsonTokens & better stack var name
- Updated dependencies [5f59978]
  - @lottiefiles/last@1.0.2
  - @lottiefiles/last-builder@1.0.2

## 1.0.1

### Patch Changes

- a4e9867: feat: add extraCompositions child node titles

## 1.0.0

### Major Changes

- 3484bb6: feat: initial major release

### Patch Changes

- Updated dependencies [3484bb6]
  - @lottiefiles/last@1.0.0
  - @lottiefiles/last-builder@1.0.0
