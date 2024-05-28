/**
 * Copyright 2023 Design Barn Inc.
 */

import type {
  BlendMode,
  Composite,
  FillRule,
  GradientType,
  LineCap,
  LineJoin,
  ShapeDirection,
  TrimMultipleShapes,
  MatteMode,
  MaskMode,
  TextType,
} from '@lottie-animation-community/lottie-types';
import { TITLES, type AttributeTitle } from '@lottiefiles/last';

const { number: NT, string: ST } = TITLES;

export const fileConstants = {
  sourceId: 'relottie-parse',
} as const;

export type ConstantNumMap = Map<number, string>;

export const blendModeValues: ConstantNumMap = new Map<BlendMode.Value, string>([
  [0, 'normal'],
  [1, 'multiply'],
  [2, 'screen'],
  [3, 'overlay'],
  [4, 'darken'],
  [5, 'lighten'],
  [6, 'color-dodge'],
  [7, 'color-burn'],
  [8, 'hard-light'],
  [9, 'soft-light'],
  [10, 'difference'],
  [11, 'exclusion'],
  [12, 'hue'],
  [13, 'saturation'],
  [14, 'color'],
  [15, 'luminosity'],
]);

export const compositeValues: ConstantNumMap = new Map<Composite.Value, string>([
  [1, 'above'],
  [2, 'below'],
]);

export const filleRuleValues: ConstantNumMap = new Map<FillRule.Value, string>([
  [1, 'non-zero'],
  [2, 'even-odd'],
]);

export const gradientTypeValues: ConstantNumMap = new Map<GradientType.Value, string>([
  [1, 'linear'],
  [2, 'radial'],
]);

export const lineCapValues: ConstantNumMap = new Map<LineCap.Value, string>([
  [1, 'butt'],
  [2, 'round'],
  [3, 'square'],
]);

export const lineJoinValues: ConstantNumMap = new Map<LineJoin.Value, string>([
  [1, 'miter'],
  [2, 'round'],
  [3, 'bevel'],
]);

export const shapeDirectionValues: ConstantNumMap = new Map<ShapeDirection.Value, string>([
  [0, 'normal'],
  [1, 'clockwise'],
  [3, 'clockwise-reversed'],
]);

export const trimMultipleShapesValues: ConstantNumMap = new Map<TrimMultipleShapes.Value, string>([
  [1, 'simultaneously'],
  [2, 'individually'],
]);

export const matteModeValues: ConstantNumMap = new Map<MatteMode.Value, string>([
  [0, 'normal'],
  [1, 'alpha'],
  [2, 'inverted-alpha'],
  [3, 'luma'],
  [4, 'inverted-luma'],
]);

export const textBasedValues: ConstantNumMap = new Map<TextType.Based, string>([
  [1, 'characters'],
  [2, 'character-excluding-spaces'],
  [3, 'words'],
  [4, 'lines'],
]);

export const textCapsValues: ConstantNumMap = new Map<TextType.Caps, string>([
  [0, 'regular'],
  [1, 'all'],
  [2, 'small'],
]);

export const textGroupingValues: ConstantNumMap = new Map<TextType.Grouping, string>([
  [1, 'characters'],
  [2, 'words'],
  [3, 'line'],
  [4, 'all'],
]);

export const textJustifyValues: ConstantNumMap = new Map<TextType.Justify, string>([
  [0, 'left'],
  [1, 'right'],
  [2, 'center'],
  [3, 'with-last-line-left'],
  [4, 'with-last-line-right'],
  [5, 'with-last-line-center'],
  [6, 'with-last-line-full'],
]);

export const textShapeValues: ConstantNumMap = new Map<TextType.Shape, string>([
  [1, 'square'],
  [2, 'ramp-up'],
  [3, 'ramp-down'],
  [4, 'triangle'],
  [5, 'round'],
  [6, 'smooth'],
]);

export const fontPathOriginValues: ConstantNumMap = new Map<TextType.FontPathOrigin, string>([
  [0, 'local'],
  [1, 'css-url'],
  [2, 'script-url'],
  [3, 'fonturl'],
]);

export const verticalJustifyValues: ConstantNumMap = new Map<TextType.VerticalJustify, string>([
  [0, 'top'],
  [1, 'center'],
  [2, 'bottom'],
]);

export const rangeUnitsValues: ConstantNumMap = new Map<number, string>([
  [1, 'percent'],
  [2, 'index'],
]);

export const mergeModeValues: ConstantNumMap = new Map<number, string>([
  [1, 'normal'],
  [2, 'add'],
  [3, 'substract'],
  [4, 'intersect'],
  [5, 'exclude-intersections'],
]);

export const constantNumValues: Map<AttributeTitle, ConstantNumMap> = new Map([
  [NT.blendMode, blendModeValues],
  [NT.composite, compositeValues],
  [NT.fillRule, filleRuleValues],
  [NT.gradientType, gradientTypeValues],
  [NT.lineCap, lineCapValues],
  [NT.lineJoin, lineJoinValues],
  [NT.shapeDirection, shapeDirectionValues],
  [NT.trimMultipleShapes, trimMultipleShapesValues],
  [NT.matteMode, matteModeValues],
  [NT.textBased, textBasedValues],
  [NT.textCaps, textCapsValues],
  [NT.textGrouping, textGroupingValues],
  [NT.textJustify, textJustifyValues],
  [NT.textShape, textShapeValues],
  [NT.fontPathOrigin, fontPathOriginValues],
  [NT.textVerticalJustify, verticalJustifyValues],
  [NT.rangeUnits, rangeUnitsValues],
  [NT.mergeMode, mergeModeValues],
]);

export type ConstantStrMap = Map<string, string>;

export const maskModeValues: ConstantStrMap = new Map<MaskMode.Value, string>([
  ['n', 'no'],
  ['a', 'add'],
  ['s', 'subtract'],
  ['i', 'intersect'],
  ['l', 'lighten'],
  ['d', 'darken'],
  ['f', 'difference'],
]);

export const constantStrValues: Map<AttributeTitle, ConstantStrMap> = new Map([[ST.maskMode, maskModeValues]]);
