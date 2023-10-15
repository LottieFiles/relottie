/**
 * Copyright 2023 Design Barn Inc.
 */

import { TITLES, type AttributeTitle } from '@lottiefiles/last';
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
} from '@lottiefiles/lottie-types';

const { number: NT, string: ST } = TITLES;

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

export const lineCapTypeValues: ConstantNumMap = new Map<LineCap.Value, string>([
  [1, 'butt'],
  [2, 'round'],
  [3, 'square'],
]);

export const lineJoinTypeValues: ConstantNumMap = new Map<LineJoin.Value, string>([
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
  [1, 'individually'],
  [2, 'simultaneously'],
]);

export const matteModeValues: ConstantNumMap = new Map<MatteMode.Value, string>([
  [0, 'normal'],
  [1, 'alpha'],
  [2, 'inverted-alpha'],
  [3, 'luma'],
  [4, 'inverted-luma'],
]);

export const constantNumValues: Map<AttributeTitle, ConstantNumMap> = new Map([
  [NT.layerBlendMode, blendModeValues],
  [NT.shapeBlendMode, blendModeValues],
  [NT.composite, compositeValues],
  [NT.fillRuleValue, filleRuleValues],
  [NT.gradientType, gradientTypeValues],
  [NT.lineCapType, lineCapTypeValues],
  [NT.lineJoinType, lineJoinTypeValues],
  [NT.shapeDirection, shapeDirectionValues],
  [NT.trimMultipleShapes, trimMultipleShapesValues],
  [NT.matteMode, matteModeValues],
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
