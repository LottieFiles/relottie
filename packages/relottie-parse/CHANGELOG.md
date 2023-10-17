# @lottiefiles/relottie-parse

## 1.2.0

### Minor Changes

- 4a54598: feat: find unique titles for string and number constant nodes: blendMode, composite, fillRule, lineCap,
  lineJoin, shapeDirection, trimMultipleShapes, matteMode & maskMode
- 4a54598: - feat(titles): add constant blendMode titles

  - feat(titles): add keyframe, keyframeList, keyframeValue, positionKeyframe, positionKeyframeList,
    keyframeBezierHandle prefixes to xAxisValue & yAxisValue

  - feat(titles): add bezier prefix to inTangents, outTangents and vertices

  - feat(titles): add keyframe, keyframeList, keyframeValue, positionKeyframe, positionKeyframeList,
    keyframeBezierHandle, shapeKeyframe to inTangent and outTangent

  - feat(titles): add text- prefix to fillBrightness, fillColor, fillHue, fillOpacity, fillSaturation

  - feat(titles): add shapeFillOpacity, shapeGradientFillOpacity, shapeGradientStrokeOpacity, layerStyleOpacity,
    shapeStrokeOpacity prefixes to opacity

  - feat(titles): add audio prefix to level

  - feat(titles): add text prefix to maxAmount, maxEase, minEase

  - feat(titles): add shapeTrim prefix to offset

  - feat(titles): add layerTransform, shapeTransform, transformRepeater, textStyle prefix to orientation

  - feat(titles): add shapeRectangleSize,layerStyleStrokeSize prefixes to size

  - feat(titles): rename valueOutTangent to positionKeyframeOutTangents

  - feat(titles): rename valueInTangent to positionKeyframeInTangents

  - feat(titles): add layerTransform, shapeTransform, transformRepeater, textStyle prefixes to skew & skewAxis

  - feat(titles): add layerTransforms, shapeTransforms, transformRepeaters, textStyles prefixes to scale

  - feat(titles): add shapePolygon & shapeStar prefixes to outerRoundness & outerRadius

  - feat(titles): add shapeGradientFill, shapeGradientStroke prefixes to startPoint & endPoint

  - feat(titles): add assetImage, assetPrecomposition, assetDataSource, assetFile prefixes to id

  - feat(titles): rename blur to textBlur

  - feat(titles): rename center to shapeTrimCenter

  - feat(titles): add shapePolygon, shapeStar, shapeZigZags prefixes to points

  - feat(titles): rename multiple to trimMultipleShapes

  - feat(titles): rename closed to bezierClosed

  - feat: add time titles for keyframe, keyframeList, keyframeValue, positionKeyframe, positionKeyframeList,
    keyframeBezierHandle, shapeKeyframe

  - fix: effectIgnoredValue.v title and placement

  - fix: numberOfProperties parent titles

  - fix: rename effectList numberOfProperties title to effectPropertyCount

  - refactor: remove unused ind titles for effectList and effectParams

  - feat: rename effectValueAngle, effectValueCheckbox, effectValueColor, effectValueDropdown, effectValueLayer,
    effectValuePoint, effectValueSlider to effectParamAngle, effectParamCheckbox, effectParamColor, effectParamDropdown,
    effectParamLayer, effectParamPoint, effectParamSlider

  - feat: rename effectParameters to effectParamList

  - feat: add effectPropertyCount title

  - feat(titles): rename effectValueAngleValue, effectValueCheckboxValue, effectValueColorValue,
    effectValueDropdownValue, effectValueLayerValue, effectValuePointValue, effectValueSliderValue to effectValueAngle,
    effectValueCheckbox, effectValueColor, effectValueDropdown, effectValueLayer, effectValuePoint, effectValueSlider

  - feat: remove unused OT.effect title

  - feat(titles): replace textTypeCaps with textCaps, textCapsRegular, textCapsAll, textCapsSmall

  - feat(titles): add textBasedCharacters, textBasedCharacterExcludingSpaces, textBasedWords, textBasedLines

  - feat(titles): replace textTypeGrouping with textGrouping, textGroupingCharacters, textGroupingWords,
    textGroupingLine, textGroupingAll

  - feat(titles): replace textTypeJustify with textJustityLeft, textJustityRight, textJustityCenter,
    textJustityWithLastLineLeft, textJustityWithLastLineRight, textJustityWithLastLineCenter,
    textJustityWithLastLineFull

  - feat(titles): replace textTypeShape with textShape, textShapeSquare, textShapeRampUp, textShapeRampDown,
    textShapeTriangle, textShapeRound, textShapeSmooth

  - feat(titles): replace textType with fontPathOrigin, fontPathOriginLocal, fontPathOriginCssUrl,
    fontPathOriginScriptUrl, fontPathOriginFonturl

  - feat(titles): replace textTypeVerticalJustify with textVerticalJustify, textVerticalJustifyTop,
    textVerticalJustifyCenter, textVerticalJustifyBottom

  - feat(titles): detect & add rangeUnitsPercent & rangeUnitsIndex

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
