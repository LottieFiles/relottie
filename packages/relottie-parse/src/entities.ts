/**
 * Copyright 2024 Design Barn Inc.
 */

import type {
  ValueNode as MomoaValueNode,
  ObjectNode as MomoaObject,
  AnyNode as MomoaAnyNode,
  ArrayNode as MomoaArray,
  StringNode as MomoaString,
  NumberNode as MomoaNumber,
  MemberNode as MomoaMember,
} from '@humanwhocodes/momoa';
import type {
  Key,
  NodeValueType,
  AttributeTitle,
  ParentTitle,
  AnyTitle,
  CollectionTitle,
  ElementTitle,
  ObjectTitle,
  IntegerBooleanTitle,
  StringTitle,
  NumberTitle,
  BooleanTitle,
} from '@lottiefiles/last';
import { TITLES } from '@lottiefiles/last';

import { constantNumValues, constantStrValues } from './constants.js';
import type { MomoaPrimitive } from './helpers.js';

const {
  boolean: BT,
  collection: CT,
  custom: CUSTOM,
  element: ET,
  intBoolean: IBT,
  number: NT,
  object: OT,
  string: ST,
} = TITLES;

export type EntityRecord<T extends AnyTitle> = Record<Key, Partial<Record<ParentTitle, T>>>;

export type Requried = boolean;

export interface EntityMap<T extends AnyTitle> {
  known: EntityRecord<T>;
  required: EntityRecord<T>;
}

export type EntityType = NodeValueType | 'constant' | 'integer-boolean' | 'missing';

export interface Entity<T = AnyTitle> {
  parentTitle: ParentTitle;
  required: Requried;
  title: T;
  type: EntityType;
}

export interface ParentTitleConstant {
  /**
   * constants default value will be used if 'values' are not defined
   */
  defaultValue: string | number;
  /**
   * constructs a final parentTitle from values[defaultValue]
   */
  prefix?: string;
  /**
   * depedants values pairs of Node's value and title
   */
  values: Record<ParentTitleConstant['defaultValue'], string>;
}

export interface DependentBase {
  /**
   * Node's key
   */
  key: Key;
  /**
   * parentTitle dependent info for the parent node's title
   */
  parentTitle: ParentTitle | ParentTitleConstant;
  /**
   * Dependent node's title
   */
  title: AnyTitle;
  /**
   * Dependent node's type
   */
  type: MomoaAnyNode['type'] | 'Constant';
}

export interface DependentPrimitive extends DependentBase {
  parentTitle: ParentTitle;
  type: MomoaPrimitive['type'] | MomoaObject['type'];
}

export interface DependentObject extends DependentBase {
  parentTitle: ParentTitle;
  type: MomoaObject['type'];
}

export interface DependentArray extends DependentBase {
  /**
   * if present the "childType" will be checked as well
   */
  childType?: MomoaValueNode['type'];
  parentTitle: ParentTitle;
  type: MomoaArray['type'];
}

export interface DependentConstant extends DependentBase {
  parentTitle: ParentTitleConstant;
  type: 'Constant';
}

export type Dependent = DependentPrimitive | DependentConstant | DependentArray | DependentObject;

export interface NoKeyEntity {
  /**
   * defaultTitle will be used if couldn't find title in "dependent"
   */
  defaultTitle: ParentTitle;
  /**
   * if dependent is undefined, the "defaultTitle" will be used
   */
  dependents?: Dependent[];
}

export type NoKeyEntityMap = Record<ParentTitle | string, NoKeyEntity>;

type AnimatedPropertyTitle =
  | typeof OT.animatedColor
  | typeof OT.animatedMultidimensional
  | typeof OT.animatedPosition
  | typeof OT.animatedShape
  | typeof OT.animatedValue;

const animatedPropEntity = (parentTitle: AnimatedPropertyTitle, kTitle: AnyTitle): NoKeyEntity => {
  return {
    defaultTitle: `${parentTitle}-static` as ObjectTitle,
    dependents: [
      {
        key: 'k',
        type: 'Array',
        title: kTitle,
        childType: 'Object',
        parentTitle,
      },
      {
        key: 'a',
        type: 'Constant',
        title: IBT.animated,
        parentTitle: {
          defaultValue: 0,
          values: {
            0: `${parentTitle}-static`,
            1: parentTitle,
          },
        },
      },
    ],
  };
};

const animatedValueProp: NoKeyEntity = {
  ...animatedPropEntity(OT.animatedValue, CT.keyframeList),
} as const;

const animatedShapeProp: NoKeyEntity = {
  ...animatedPropEntity(OT.animatedShape, CT.shapeKeyframeList),
} as const;

const animatedPositionProp: NoKeyEntity = {
  ...animatedPropEntity(OT.animatedPosition, CT.positionKeyframeList),
} as const;

const animatedColorProp: NoKeyEntity = {
  ...animatedPropEntity(OT.animatedColor, CT.keyframeList),
} as const;

const animatedMultidimensionalProp: NoKeyEntity = {
  ...animatedPropEntity(OT.animatedMultidimensional, CT.keyframeList),
} as const;

export const objectEntity: NoKeyEntityMap = {
  [CT.composition]: {
    defaultTitle: OT.layerPrecomposition,
    dependents: [
      {
        key: 'ty',
        type: 'Constant',
        title: NT.layerType,
        parentTitle: {
          prefix: 'layer',
          defaultValue: 0,
          values: {
            0: 'precomposition',
            1: 'solid-color',
            2: 'image',
            3: 'null',
            4: 'shape',
            5: 'text',
            6: 'audio',
            7: 'video-placeholder',
            8: 'image-sequence',
            9: 'video',
            10: 'image-placeholder',
            11: 'guide',
            12: 'adjustment',
            13: 'camera',
            14: 'light',
            15: 'data',
          },
        },
      },
    ],
  },
  [CT.shapeList]: {
    defaultTitle: OT.shapeRectangle,
    dependents: [
      {
        key: 'ty',
        type: 'Constant',
        title: ST.shapeType,
        parentTitle: {
          prefix: 'shape',
          defaultValue: 'rc',
          values: {
            rc: 'rectangle',
            el: 'ellipse',
            // aka shape-polygon but default sy: 1
            sr: 'star',
            sh: 'path',
            fl: 'fill',
            st: 'stroke',
            gf: 'gradient-fill',
            gs: 'gradient-stroke',
            gr: 'group',
            tr: 'transform',
            rd: 'rounded-corners',
            pb: 'pucker-bloat',
            mm: 'merge',
            tw: 'twist',
            op: 'offset-path',
            zz: 'zig-zag',
            '': 'modifier',
            rp: 'repeater',
            tm: 'trim',
          },
        },
      },
      {
        key: 'sy',
        type: 'Constant',
        title: NT.shapePolygonStarType,
        parentTitle: {
          prefix: 'shape',
          defaultValue: 1,
          values: {
            1: 'star',
            // NOTE: how to support it?
            2: 'polygon',
          },
        },
      },
    ],
  },
  [CT.assets]: {
    defaultTitle: OT.assetPrecomposition,
    dependents: [
      { key: 'w', type: 'Number', title: NT.width, parentTitle: OT.assetImage },
      { key: 'h', type: 'Number', title: NT.height, parentTitle: OT.assetImage },
      {
        key: 't',
        type: 'Constant',
        title: ST.assetType,
        parentTitle: {
          prefix: 'asset',
          defaultValue: 'seq',
          values: {
            seq: 'image',
            3: 'data-source',
          },
        },
      },
      { key: 'layers', type: 'Array', title: CT.composition, parentTitle: OT.assetPrecomposition },
      { key: 'mn', type: 'String', title: ST.matchName, parentTitle: OT.assetPrecomposition },
      { key: 'fr', type: 'Number', title: NT.framerate, parentTitle: OT.assetPrecomposition },
      {
        key: 'xt',
        // integer-boolean
        type: 'Number',
        title: IBT.extraComposition,
        parentTitle: OT.assetPrecomposition,
      },
      { key: 'p', type: 'String', title: ST.filename, parentTitle: OT.assetFile },
      { key: 'u', type: 'String', title: ST.path, parentTitle: OT.assetFile },
      { key: 'e', type: 'Number', title: IBT.embedded, parentTitle: OT.assetFile },
    ],
  },
  [CT.effectList]: {
    defaultTitle: OT.effectCustom,
    dependents: [
      {
        key: 'ty',
        type: 'Constant',
        title: NT.effectType,
        parentTitle: {
          prefix: 'effect',
          defaultValue: 5,
          values: {
            25: 'drop-shadow',
            21: 'fill',
            29: 'gaussian-blur',
            28: 'matte3',
            24: 'pro-levels',
            22: 'stroke',
            20: 'tint',
            23: 'tritone',
            26: 'radial-wipe',
            32: 'wavy',
            34: 'puppet',
            33: 'spherize',
            7: 'paint-over-transparent',
            31: 'mesh-warp',
            27: 'displacement-map',
            5: 'custom',
          },
        },
      },
    ],
  },
  [CT.effectParamList]: {
    defaultTitle: OT.effectParamSlider,
    dependents: [
      {
        key: 'ty',
        type: 'Constant',
        title: NT.effectValueType,
        parentTitle: {
          defaultValue: 0,
          prefix: 'effect-param',
          values: {
            4: 'checkbox',
            2: 'color',
            7: 'dropdown',
            6: 'ignored',
            10: 'layer',
            3: 'point',
            0: 'slider',
            1: 'angle',
          },
        },
      },
    ],
  },
  [CT.layerStyleList]: {
    defaultTitle: OT.layerStyleStroke,
    dependents: [
      {
        key: 'ty',
        type: 'Constant',
        title: NT.layerStyleType,
        parentTitle: {
          prefix: CT.layerStyle,
          defaultValue: 0,
          values: {
            0: 'stroke',
            1: 'drop-shadow',
            2: 'inner-shadow',
            3: 'outer-glow',
            4: 'inner-glow',
            5: 'bevel-emboss',
            6: 'satin',
            7: 'color-overlay',
            8: 'gradient-overlay',
          },
        },
      },
    ],
  },
  [ET.animatedPositionProp]: {
    ...animatedPositionProp,
  },
  [ET.animatedShapeProp]: {
    ...animatedShapeProp,
  },
  [ET.animatedShapeBezier]: {
    defaultTitle: OT.bezier,
  },
  [ET.animatedColorProp]: {
    ...animatedColorProp,
  },
  [ET.animatedMultidimensionalProp]: {
    ...animatedMultidimensionalProp,
  },
  [ET.anchorPoint]: {
    ...animatedPositionProp,
  },
  [CT.keyframeList]: {
    defaultTitle: OT.keyframe,
  },
  [CT.keyframeValue]: {
    defaultTitle: OT.bezier,
  },
  [CT.keyframeEndValue]: {
    defaultTitle: OT.bezier,
  },
  [CT.positionKeyframeList]: {
    defaultTitle: OT.positionKeyframe,
  },
  [ET.keyframeInTangent]: {
    defaultTitle: OT.keyframeBezierHandle,
  },
  [ET.keyframeListInTangent]: {
    defaultTitle: OT.keyframeBezierHandle,
  },
  [ET.keyframeValueInTangent]: {
    defaultTitle: OT.keyframeBezierHandle,
  },
  [ET.positionKeyframeInTangent]: {
    defaultTitle: OT.keyframeBezierHandle,
  },
  [ET.positionKeyframeListInTangent]: {
    defaultTitle: OT.keyframeBezierHandle,
  },
  [ET.keyframeBezierHandleInTangent]: {
    defaultTitle: OT.keyframeBezierHandle,
  },
  [ET.shapeKeyframeInTangent]: {
    defaultTitle: OT.keyframeBezierHandle,
  },
  [ET.keyframeOutTangent]: {
    defaultTitle: OT.keyframeBezierHandle,
  },
  [ET.keyframeListOutTangent]: {
    defaultTitle: OT.keyframeBezierHandle,
  },
  [ET.keyframeValueOutTangent]: {
    defaultTitle: OT.keyframeBezierHandle,
  },
  [ET.positionKeyframeOutTangent]: {
    defaultTitle: OT.keyframeBezierHandle,
  },
  [ET.positionKeyframeListOutTangent]: {
    defaultTitle: OT.keyframeBezierHandle,
  },
  [ET.keyframeBezierHandleOutTangent]: {
    defaultTitle: OT.keyframeBezierHandle,
  },
  [ET.shapeKeyframeOutTangent]: {
    defaultTitle: OT.keyframeBezierHandle,
  },
  [ET.translation]: {
    defaultTitle: OT.animatedPositionStatic,
    dependents: [
      {
        key: 'k',
        type: 'Array',
        title: CT.positionKeyframeList,
        childType: 'Object',
        parentTitle: OT.animatedPosition,
      },
      {
        key: 'a',
        type: 'Constant',
        title: IBT.animated,
        parentTitle: {
          defaultValue: 0,
          values: {
            0: OT.animatedPositionStatic,
            1: OT.animatedPosition,
          },
        },
      },
      {
        key: 's',
        type: 'Boolean',
        title: BT.splitEnabled,
        parentTitle: OT.splitVector,
      },
      { key: 'x', type: 'Object', title: ET.animatedValueProp, parentTitle: OT.splitVector },
      { key: 'y', type: 'Object', title: ET.animatedValueProp, parentTitle: OT.splitVector },
      { key: 'z', type: 'Object', title: ET.animatedValueProp, parentTitle: OT.splitVector },
    ],
  },
  [ET.layerTransformScale]: {
    ...animatedMultidimensionalProp,
  },
  [ET.shapeTransformScale]: {
    ...animatedMultidimensionalProp,
  },
  [ET.transformRepeaterScale]: {
    ...animatedMultidimensionalProp,
  },
  [ET.textStyleScale]: {
    ...animatedMultidimensionalProp,
  },
  [ET.rotationClockwise]: {
    ...animatedValueProp,
  },
  [ET.polygonRotationClockwise]: {
    ...animatedValueProp,
  },
  [ET.rotationX]: {
    ...animatedValueProp,
  },
  [ET.rotationY]: {
    ...animatedValueProp,
  },
  [ET.rotationZ]: {
    ...animatedValueProp,
  },
  [ET.layerTransformSkew]: {
    ...animatedValueProp,
  },
  [ET.shapeTransformSkew]: {
    ...animatedValueProp,
  },
  [ET.transformRepeaterSkew]: {
    ...animatedValueProp,
  },
  [ET.textStyleSkew]: {
    ...animatedValueProp,
  },
  [ET.layerTransformSkewAxis]: {
    ...animatedValueProp,
  },
  [ET.shapeTransformSkewAxis]: {
    ...animatedValueProp,
  },
  [ET.transformRepeaterSkewAxis]: {
    ...animatedValueProp,
  },
  [ET.textStyleSkewAxis]: {
    ...animatedValueProp,
  },
  [ET.layerTransformOrientation]: {
    ...animatedMultidimensionalProp,
  },
  [ET.shapeTransformOrientation]: {
    ...animatedMultidimensionalProp,
  },
  [ET.transformRepeaterOrientation]: {
    ...animatedMultidimensionalProp,
  },
  [ET.textStyleOrientation]: {
    ...animatedMultidimensionalProp,
  },
  [ET.shapeRectangleSize]: {
    ...animatedMultidimensionalProp,
  },
  [ET.layerStyleStrokeSize]: {
    ...animatedMultidimensionalProp,
  },
  [ET.rounded]: {
    ...animatedValueProp,
  },
  [ET.audioLevel]: {
    ...animatedMultidimensionalProp,
  },
  [ET.shapeEllipseSize]: {
    ...animatedMultidimensionalProp,
  },
  [ET.shapeGradientFillStartPoint]: {
    ...animatedMultidimensionalProp,
  },
  [ET.shapeGradientStrokeStartPoint]: {
    ...animatedMultidimensionalProp,
  },
  [ET.shapeGradientFillEndPoint]: {
    ...animatedMultidimensionalProp,
  },
  [ET.shapeGradientStrokeEndPoint]: {
    ...animatedMultidimensionalProp,
  },
  [ET.splitX]: {
    ...animatedValueProp,
  },
  [ET.splitY]: {
    ...animatedValueProp,
  },
  [ET.splitZ]: {
    ...animatedValueProp,
  },
  [ET.effectValueAngle]: {
    ...animatedValueProp,
  },
  [ET.effectValueCheckbox]: {
    ...animatedValueProp,
  },
  [ET.effectValueColor]: {
    ...animatedColorProp,
  },
  [ET.effectValueDropdown]: {
    ...animatedValueProp,
  },
  [ET.effectValueLayer]: {
    ...animatedValueProp,
  },
  [ET.effectValuePoint]: {
    ...animatedMultidimensionalProp,
  },
  [ET.effectValueSlider]: {
    ...animatedValueProp,
  },
  [ET.shapeFillOpacity]: {
    ...animatedValueProp,
  },
  [ET.shapeGradientFillOpacity]: {
    ...animatedValueProp,
  },
  [ET.shapeGradientStrokeOpacity]: {
    ...animatedValueProp,
  },
  [ET.layerStyleOpacity]: {
    ...animatedValueProp,
  },
  [ET.shapeStrokeOpacity]: {
    ...animatedValueProp,
  },
  [ET.transformOpacity]: {
    ...animatedValueProp,
  },
  [ET.maskOpacity]: {
    ...animatedValueProp,
  },
  [ET.timeRemapping]: {
    ...animatedValueProp,
  },
  [ET.dilate]: {
    ...animatedValueProp,
  },
  [ET.perspective]: {
    ...animatedValueProp,
  },
  [ET.highlightLength]: {
    ...animatedValueProp,
  },
  [ET.highlightAngle]: {
    ...animatedValueProp,
  },
  [OT.strokeDashDefault]: {
    ...animatedValueProp,
  },
  [ET.miterLimitAlternative]: {
    ...animatedValueProp,
  },
  [ET.shapePolygonOuterRadius]: {
    ...animatedValueProp,
  },
  [ET.shapeStarOuterRadius]: {
    ...animatedValueProp,
  },
  [ET.shapePolygonOuterRoundness]: {
    ...animatedValueProp,
  },
  [ET.shapeStarOuterRoundness]: {
    ...animatedValueProp,
  },
  [ET.shapePolygonPoints]: {
    ...animatedValueProp,
  },
  [ET.shapeStarPoints]: {
    ...animatedValueProp,
  },
  [ET.shapeZigZagsPoints]: {
    ...animatedValueProp,
  },
  [ET.innerRadius]: {
    ...animatedValueProp,
  },
  [ET.innerRoundness]: {
    ...animatedValueProp,
  },
  [ET.amount]: {
    ...animatedValueProp,
  },
  [ET.copies]: {
    ...animatedValueProp,
  },
  [ET.shapeTrimOffset]: {
    ...animatedValueProp,
  },
  [ET.radius]: {
    ...animatedValueProp,
  },
  [CT.shapeKeyframeList]: {
    defaultTitle: OT.shapeKeyframe,
  },
  [CT.shapeKeyframeStart]: {
    defaultTitle: OT.bezier,
  },
  [OT.animatedShapeStatic]: {
    defaultTitle: OT.bezier,
  },
  [ET.shapeTrimStart]: {
    ...animatedValueProp,
  },
  [ET.shapeTrimEnd]: {
    ...animatedValueProp,
  },
  [ET.angle]: {
    ...animatedValueProp,
  },
  [ET.miterLimit]: {
    ...animatedValueProp,
  },
  [ET.roundness]: {
    ...animatedValueProp,
  },
  [ET.shapeZigZagSize]: {
    ...animatedValueProp,
  },
  [OT.layerStyleChokeSpread]: {
    ...animatedValueProp,
  },
  [ET.chokeSpread]: {
    ...animatedValueProp,
  },
  [ET.layerStyleBlendMode]: {
    ...animatedValueProp,
  },
  [ET.blurSize]: {
    ...animatedValueProp,
  },
  [ET.noise]: {
    ...animatedValueProp,
  },
  [ET.distance]: {
    ...animatedValueProp,
  },
  [ET.layerStyleColor]: {
    ...animatedColorProp,
  },
  [ET.layerConceal]: {
    ...animatedValueProp,
  },
  [ET.range]: {
    ...animatedValueProp,
  },
  [ET.jitter]: {
    ...animatedValueProp,
  },
  [ET.source]: {
    ...animatedValueProp,
  },
  [ET.strength]: {
    ...animatedValueProp,
  },
  [ET.bevelStyle]: {
    ...animatedValueProp,
  },
  [ET.technique]: {
    ...animatedValueProp,
  },
  [ET.soften]: {
    ...animatedValueProp,
  },
  [ET.globalAngle]: {
    ...animatedValueProp,
  },
  [ET.altitude]: {
    ...animatedValueProp,
  },
  [ET.highlightMode]: {
    ...animatedValueProp,
  },
  [ET.highlightColor]: {
    ...animatedValueProp,
  },
  [ET.highlightOpacity]: {
    ...animatedValueProp,
  },
  [ET.shadowMode]: {
    ...animatedValueProp,
  },
  [ET.shadowColor]: {
    ...animatedColorProp,
  },
  [ET.shadowOpacity]: {
    ...animatedValueProp,
  },
  [ET.invert]: {
    ...animatedValueProp,
  },
  [ET.smoothness]: {
    ...animatedValueProp,
  },
  [ET.reverse]: {
    ...animatedValueProp,
  },
  [ET.align]: {
    ...animatedValueProp,
  },
  [OT.gradientOverlay]: {
    ...animatedValueProp,
  },
  [ET.firstMargin]: {
    ...animatedValueProp,
  },
  [ET.lastMargin]: {
    ...animatedValueProp,
  },
  [ET.reversePath]: {
    ...animatedValueProp,
  },
  [ET.forceAlignment]: {
    ...animatedValueProp,
  },
  [ET.perpendicularToPath]: {
    ...animatedValueProp,
  },
  [ET.strokeWidth]: {
    ...animatedValueProp,
  },
  [ET.strokeHue]: {
    ...animatedValueProp,
  },
  [ET.strokeSaturation]: {
    ...animatedValueProp,
  },
  [ET.strokeBrightness]: {
    ...animatedValueProp,
  },
  [ET.strokeOpacity]: {
    ...animatedValueProp,
  },
  [ET.textFillColor]: {
    ...animatedColorProp,
  },
  [ET.textFillHue]: {
    ...animatedValueProp,
  },
  [ET.textFillBrightness]: {
    ...animatedValueProp,
  },
  [ET.textFillOpacity]: {
    ...animatedValueProp,
  },
  [ET.letterSpacing]: {
    ...animatedValueProp,
  },
  [ET.textBlur]: {
    ...animatedValueProp,
  },
  [ET.lineSpacing]: {
    ...animatedValueProp,
  },
  [ET.textMinEase]: {
    ...animatedValueProp,
  },
  [ET.textMaxEase]: {
    ...animatedValueProp,
  },
  [ET.textMaxAmount]: {
    ...animatedValueProp,
  },
  [ET.textSelectorStart]: {
    ...animatedValueProp,
  },
  [ET.textSelectorEnd]: {
    ...animatedValueProp,
  },
  [ET.shape]: {
    ...animatedShapeProp,
  },
  [ET.maskVertices]: {
    ...animatedShapeProp,
  },
  [ET.shapeFillColor]: {
    ...animatedColorProp,
  },
  [ET.shapeStrokeColor]: {
    ...animatedMultidimensionalProp,
  },
  [CT.documentStrokeColor]: {
    ...animatedColorProp,
  },
  [CT.documentFillColor]: {
    ...animatedColorProp,
  },
  [ET.shapeTrimCenter]: {
    ...animatedMultidimensionalProp,
  },
  [ET.textGroupAlignment]: {
    ...animatedMultidimensionalProp,
  },
  [CT.masksProperties]: {
    defaultTitle: OT.mask,
  },
  [CT.textFontList]: {
    defaultTitle: OT.textFont,
  },
  [ET.startOpacity]: {
    ...animatedValueProp,
  },
  [ET.endOpacity]: {
    ...animatedValueProp,
  },
  [CT.strokeDashList]: {
    defaultTitle: OT.strokeDashDefault,
    dependents: [
      {
        key: 'n',
        type: 'Constant',
        title: ST.strokeDashType,
        parentTitle: {
          prefix: 'stroke-dash',
          defaultValue: 'd',
          values: {
            d: 'default',
            g: 'gap',
            o: 'offset',
          },
        },
      },
    ],
  },
  [ET.strokeLength]: {
    ...animatedValueProp,
  },
  [CT.markers]: {
    defaultTitle: OT.marker,
  },
  [ET.textCharacterData]: {
    defaultTitle: OT.characterShapes,
    dependents: [
      { key: 'shapes', type: 'Array', title: CT.shapeList, parentTitle: OT.characterShapes },
      { key: 'refId', type: 'String', title: ST.idReference, parentTitle: OT.characterPrecomp },
      { key: 'ks', type: 'Object', title: ET.layerTransform, parentTitle: OT.characterPrecomp },
      { key: 'ip', type: 'Number', title: NT.inPoint, parentTitle: OT.characterPrecomp },
      { key: 'op', type: 'Number', title: NT.outPoint, parentTitle: OT.characterPrecomp },
      { key: 'sr', type: 'Number', title: NT.timeStretch, parentTitle: OT.characterPrecomp },
      { key: 'st', type: 'Number', title: NT.timeStart, parentTitle: OT.characterPrecomp },
    ],
  },
  [CT.textDocumentKeyframes]: {
    defaultTitle: OT.textDocumentKeyframe,
  },
  [CT.textRanges]: {
    defaultTitle: OT.textRange,
  },
  [CT.extraCompositions]: {
    defaultTitle: OT.assetPrecomposition,
  },
  [ET.selectorSmoothness]: {
    ...animatedValueProp,
  },
};

const createDependentTitles = (
  parentTitle: AnyTitle,
  targetTitle: AnyTitle,
  dependentKey: string = 'ty',
): Record<string, AnyTitle> => {
  const entityMap = objectEntity[parentTitle];
  const dependents = entityMap?.dependents;
  const node = dependents?.find((item) => item.key === dependentKey);

  if (node?.type !== 'Constant') return {};

  const { prefix, values } = node.parentTitle;

  const prefixTitle = prefix ? `${prefix}-` : '';

  const titles = Object.values(values);
  const result: Record<string, AnyTitle> = {};

  for (const title of titles) {
    if (typeof title === 'string') result[prefixTitle + title] = targetTitle;
  }

  return result;
};

export const arrayEntity: NoKeyEntityMap = {};

export const getNoKeyEntity = (node: MomoaArray | MomoaObject, parentTitle: ParentTitle): NoKeyEntity => {
  switch (node.type) {
    case 'Object':
      return objectEntity[parentTitle] || { defaultTitle: parentTitle };

    case 'Array':
      return arrayEntity[parentTitle] || { defaultTitle: parentTitle };

    default:
      throw new Error("The node.type has to be 'Array' or 'Object'");
  }
};

export const stringEntity: EntityMap<StringTitle> = {
  required: {
    p: {
      // assets starts
      [OT.assetImage]: ST.filename,
      [OT.assetPrecomposition]: ST.filename,
      [OT.assetDataSource]: ST.filename,
      [OT.assetFile]: ST.filename,
      // assets ends
    },
    sc: { [OT.layerSolidColor]: ST.hexColor },
    ch: { [CT.textCharacters]: ST.character },
    fName: { [OT.textFont]: ST.fontName },
    fStyle: { [OT.textFont]: ST.fontStyle },
    style: { [CT.textCharacters]: ST.fontStyle },
    fFamily: {
      [OT.textFont]: ST.fontFamily,
      [CT.textCharacters]: ST.fontFamily,
    },
    f: { [ET.textDocument]: ST.fontFamily },
    t: { [ET.textDocument]: ST.text },
  },
  known: {
    x: {
      [OT.animatedValue]: ST.expression,
      [OT.animatedValueStatic]: ST.expression,
      [OT.animatedShape]: ST.expression,
      [OT.animatedShapeStatic]: ST.expression,
      [OT.animatedPosition]: ST.expression,
      [OT.animatedPositionStatic]: ST.expression,
      [OT.animatedColor]: ST.expression,
      [OT.animatedColorStatic]: ST.expression,
      [OT.animatedMultidimensional]: ST.expression,
      [OT.animatedMultidimensionalStatic]: ST.expression,
      [ET.textAnimatedDocument]: ST.expression,
    },
    v: { [OT.animation]: ST.version },
    cm: { [OT.marker]: ST.markerComment },
    a: { [ET.metadata]: ST.author },
    k: { [ET.metadata]: ST.keyword },
    d: { [ET.metadata]: ST.description },
    tc: { [ET.metadata]: ST.themeColor },
    g: { [ET.metadata]: ST.generator },
    id: {
      // assets starts
      [OT.assetImage]: ST.idAssetImage,
      [OT.assetPrecomposition]: ST.idAssetPrecomposition,
      [OT.assetDataSource]: ST.idAssetDataSource,
      [OT.assetFile]: ST.idAssetFile,
      // assets ends
    },
    refId: {
      [OT.layerAudio]: ST.idSound,
      [OT.layerPrecomposition]: ST.idReference,
      [OT.layerImage]: ST.idImage,
      [OT.layerData]: ST.idDataSource,
      [OT.characterPrecomp]: ST.idReference,
    },
    u: {
      // assets starts
      [OT.assetImage]: ST.path,
      [OT.assetPrecomposition]: ST.path,
      [OT.assetDataSource]: ST.path,
      [OT.assetFile]: ST.path,
      // assets ends
    },
    nm: {
      [OT.animation]: ST.name,
      // assets starts
      [OT.assetImage]: ST.name,
      [OT.assetPrecomposition]: ST.name,
      [OT.assetDataSource]: ST.name,
      [OT.assetFile]: ST.name,
      // assets ends

      [OT.textRange]: ST.name,

      [ET.transformRepeater]: ST.name,
      [OT.animatedValue]: ST.name,
      [OT.animatedValueStatic]: ST.name,
      [OT.animatedShape]: ST.name,
      [OT.animatedShapeStatic]: ST.name,
      [OT.animatedPosition]: ST.name,
      [OT.animatedPositionStatic]: ST.name,
      [OT.animatedColor]: ST.name,
      [OT.animatedColorStatic]: ST.name,
      [OT.animatedMultidimensional]: ST.name,
      [OT.animatedMultidimensionalStatic]: ST.name,
      ...createDependentTitles(CT.effectParamList, ST.name),
      ...createDependentTitles(CT.effectList, ST.name),
      [OT.mask]: ST.name,
      ...createDependentTitles(CT.composition, ST.name),
      ...createDependentTitles(CT.shapeList, ST.name),

      [OT.strokeDashDefault]: ST.name,
      [OT.strokeDashGap]: ST.name,
      [OT.strokeDashOffset]: ST.name,

      // layer-style-layer starts
      [OT.layerStyleBevelEmboss]: ST.name,
      [OT.layerStyleColorOverlay]: ST.name,
      [OT.layerStyleDropShadow]: ST.name,
      [OT.layerStyleGradientOverlay]: ST.name,
      [OT.layerStyleInnerShadow]: ST.name,
      [OT.layerStyleOuterGlow]: ST.name,
      [OT.layerStyleSatin]: ST.name,
      [OT.layerStyleStroke]: ST.name,
      // layer-style-layer ends

      [ET.layerTransform]: ST.name,
    },
    mn: {
      [OT.animation]: ST.matchName,
      [OT.animatedValue]: ST.matchName,
      [OT.animatedValueStatic]: ST.matchName,
      [OT.animatedShape]: ST.matchName,
      [OT.animatedShapeStatic]: ST.matchName,
      [OT.animatedPosition]: ST.matchName,
      [OT.animatedPositionStatic]: ST.matchName,
      [OT.animatedColor]: ST.matchName,
      [OT.animatedColorStatic]: ST.matchName,
      [OT.animatedMultidimensional]: ST.matchName,
      [OT.animatedMultidimensionalStatic]: ST.matchName,
      ...createDependentTitles(CT.effectParamList, ST.matchName),
      ...createDependentTitles(CT.effectList, ST.matchName),
      [OT.mask]: ST.matchName,
      ...createDependentTitles(CT.composition, ST.matchName),
      ...createDependentTitles(CT.shapeList, ST.matchName),

      [OT.strokeDashDefault]: ST.matchName,
      [OT.strokeDashGap]: ST.matchName,
      [OT.strokeDashOffset]: ST.matchName,

      // layer-style-layer starts
      [OT.layerStyleBevelEmboss]: ST.name,
      [OT.layerStyleColorOverlay]: ST.name,
      [OT.layerStyleDropShadow]: ST.name,
      [OT.layerStyleGradientOverlay]: ST.name,
      [OT.layerStyleInnerShadow]: ST.name,
      [OT.layerStyleOuterGlow]: ST.name,
      [OT.layerStyleSatin]: ST.name,
      [OT.layerStyleStroke]: ST.name,
      // layer-style-layer ends

      [ET.transformRepeater]: ST.matchName,
    },
    ln: {
      ...createDependentTitles(CT.composition, ST.idLayerXml),
      ...createDependentTitles(CT.shapeList, ST.idLayerXml),
    },
    cl: {
      ...createDependentTitles(CT.composition, ST.cssClass),
      ...createDependentTitles(CT.shapeList, ST.cssClass),
    },
    fPath: { [OT.textFont]: ST.fontPath },
    fWeight: { [OT.textFont]: ST.fontWeight },
    fClass: { [OT.textFont]: ST.fontCssClass },
    tg: {
      ...createDependentTitles(CT.composition, ST.layerXmlTagName),
    },
    t: { [OT.assetImage]: ST.assetImageType },
    sid: {
      [OT.animatedValue]: ST.slotId,
      [OT.animatedValueStatic]: ST.slotId,
      [OT.animatedShape]: ST.slotId,
      [OT.animatedShapeStatic]: ST.slotId,
      [OT.animatedPosition]: ST.slotId,
      [OT.animatedPositionStatic]: ST.slotId,
      [OT.animatedColor]: ST.slotId,
      [OT.animatedColorStatic]: ST.slotId,
      [OT.animatedMultidimensional]: ST.slotId,
      [OT.animatedMultidimensionalStatic]: ST.slotId,
      [ET.textAnimatedDocument]: ST.slotId,
      [OT.assetImage]: ST.slotId,
    },
  },
};

export const stringConstantEntity: EntityMap<StringTitle> = {
  required: {
    ty: {
      ...createDependentTitles(CT.composition, NT.layerType),
      ...createDependentTitles(CT.shapeList, ST.shapeType),
    },
  },
  known: {
    mode: { [OT.mask]: ST.maskMode },
    n: {
      [OT.strokeDashDefault]: ST.strokeDashType,
      [OT.strokeDashGap]: ST.strokeDashType,
      [OT.strokeDashOffset]: ST.strokeDashType,
    },
    t: { [OT.assetImage]: ST.assetImageType },
  },
};

export const numberEntity: EntityMap<NumberTitle> = {
  required: {
    ip: {
      [OT.animation]: NT.inPoint,
      ...createDependentTitles(CT.composition, NT.inPoint),
    },
    op: {
      [OT.animation]: NT.outPoint,
      ...createDependentTitles(CT.composition, NT.outPoint),
      [OT.characterPrecomp]: NT.outPoint,
    },
    p: { [ET.animatedGradientColors]: NT.count },
    k: {
      [OT.animatedValueStatic]: NT.staticValue,
      [OT.animatedMultidimensionalStatic]: NT.staticValue,
      [OT.animatedPositionStatic]: NT.staticValue,
      [OT.animatedValue]: NT.staticValue,
    },
    w: {
      [OT.animation]: NT.width,
      [OT.assetImage]: NT.width,
      [OT.assetPrecomposition]: NT.width,
      [CT.textCharacters]: NT.width,
      [OT.layerPrecomposition]: NT.width,
    },
    sw: {
      [OT.layerSolidColor]: NT.width,
      [ET.textDocument]: NT.width,
    },
    h: {
      [OT.animation]: NT.height,
      [OT.assetImage]: NT.height,
      [OT.assetPrecomposition]: NT.height,
      [OT.layerPrecomposition]: NT.height,
    },
    sh: { [OT.layerSolidColor]: NT.height },
    size: { [CT.textCharacters]: NT.fontSize },
    ls: { [ET.textDocument]: NT.baselineShift },
    t: {
      [OT.keyframe]: NT.keyframeTime,
      [CT.keyframeList]: NT.keyframeListTime,
      [CT.keyframeValue]: NT.keyframeValueTime,
      [OT.positionKeyframe]: NT.positionKeyframeTime,
      [CT.positionKeyframeList]: NT.positionKeyframeListTime,
      [OT.keyframeBezierHandle]: NT.keyframeBezierHandleTime,
      [OT.shapeKeyframe]: NT.shapeKeyframeTime,
      [OT.textDocumentKeyframe]: NT.timeStart,
    },
    s: {
      [ET.textDocument]: NT.fontSize,
    },
    x: {
      [OT.keyframe]: NT.keyframeXAxis,
      [CT.keyframeList]: NT.keyframeListXAxis,
      [CT.keyframeValue]: NT.keyframeValueXAxis,
      [OT.positionKeyframe]: NT.positionKeyframeXAxis,
      [CT.positionKeyframeList]: NT.positionKeyframeListXAxis,
      [OT.keyframeBezierHandle]: NT.keyframeBezierHandleXAxis,
    },
    y: {
      [OT.keyframe]: NT.keyframeYAxis,
      [CT.keyframeList]: NT.keyframeListYAxis,
      [CT.keyframeValue]: NT.keyframeValueYAxis,
      [OT.positionKeyframe]: NT.positionKeyframeYAxis,
      [CT.positionKeyframeList]: NT.positionKeyframeListYAxis,
      [OT.keyframeBezierHandle]: NT.keyframeBezierHandleYAxis,
    },
  },
  known: {
    v: { [OT.effectParamIgnored]: NT.effectValueIgnored },
    tm: { [OT.marker]: NT.markerTime },
    dr: { [OT.marker]: NT.markerDuration },
    sa: { [ET.motionBlur]: NT.shutterAngle },
    sp: { [ET.motionBlur]: NT.shutterPhase },
    spf: { [ET.motionBlur]: NT.samplesPerFrame },
    asl: { [ET.motionBlur]: NT.adaptiveSampleLimit },
    ix: {
      ...createDependentTitles(CT.shapeList, NT.propertyIndex),
      ...createDependentTitles(CT.effectList, NT.propertyIndex),
      ...createDependentTitles(CT.effectParamList, NT.propertyIndex),
      [OT.animatedValue]: NT.propertyIndex,
      [OT.animatedValueStatic]: NT.propertyIndex,
      [OT.animatedShape]: NT.propertyIndex,
      [OT.animatedShapeStatic]: NT.propertyIndex,
      [OT.animatedPosition]: NT.propertyIndex,
      [OT.animatedPositionStatic]: NT.propertyIndex,
      [OT.animatedColor]: NT.propertyIndex,
      [OT.animatedColorStatic]: NT.propertyIndex,
      [OT.animatedMultidimensional]: NT.propertyIndex,
      [OT.animatedMultidimensionalStatic]: NT.propertyIndex,
    },
    ind: {
      ...createDependentTitles(CT.composition, NT.compositionIndex),
      [OT.shapePath]: NT.shapePathIndex,
    },
    cix: {
      ...createDependentTitles(CT.shapeList, NT.expressionPropertyIndex),
    },
    fr: {
      [OT.animation]: NT.framerate,
      [OT.assetPrecomposition]: NT.framerate,
    },
    sr: {
      ...createDependentTitles(CT.composition, NT.timeStretch),
      [OT.characterPrecomp]: NT.timeStretch,
    },
    st: {
      ...createDependentTitles(CT.composition, NT.timeStart),
      [OT.characterPrecomp]: NT.timeStart,
    },
    l: {
      [OT.animatedMultidimensional]: NT.length,
      [OT.animatedMultidimensionalStatic]: NT.length,
      [OT.animatedPosition]: NT.length,
      [OT.animatedPositionStatic]: NT.length,
      [ET.translation]: NT.length,
    },
    parent: {
      ...createDependentTitles(CT.composition, NT.parentIndex),
    },
    tp: {
      // layer-visual starts
      [OT.layerPrecomposition]: NT.matteParent,
      [OT.layerShape]: NT.matteParent,
      [OT.layerSolidColor]: NT.matteParent,
      [OT.layerImage]: NT.matteParent,
      [OT.layerNull]: NT.matteParent,
      [OT.layerText]: NT.matteParent,
      // layer-visual ends
    },
    ml: {
      // shape-base-stroke starts
      [OT.shapeGradientStroke]: NT.miterLimitValue,
      [OT.shapeStroke]: NT.miterLimitValue,
      // shape-base-stroke ends
    },
    np: {
      [OT.shapeGroup]: NT.numberOfProperties,
      ...createDependentTitles(CT.effectList, NT.effectPropertyCount),
    },
    ip: {
      [OT.characterPrecomp]: NT.inPoint,
    },
    ascent: {
      [OT.textFont]: NT.ascent,
    },
    lh: {
      [ET.textDocument]: NT.lineHeight,
    },
    tr: {
      [ET.textDocument]: NT.textTracking,
    },
    ls: {
      [ET.textDocument]: NT.baselineShift,
    },
  },
};

export const numberConstantEntity: EntityMap<NumberTitle> = {
  required: {
    ty: {
      ...createDependentTitles(CT.composition, NT.layerType),
      ...createDependentTitles(CT.layerStyleList, NT.layerStyleType),
      ...createDependentTitles(CT.effectParamList, NT.effectType),
      ...createDependentTitles(CT.effectList, NT.effectType),
    },
    bm: {
      ...createDependentTitles(CT.composition, NT.blendMode),
      ...createDependentTitles(CT.shapeList, NT.blendMode),
    },
    d: {
      [OT.shapeEllipse]: NT.shapeDirection,
      [OT.shapePath]: NT.shapeDirection,
      [OT.shapePolygon]: NT.shapeDirection,
      [OT.shapeStar]: NT.shapeDirection,
      [OT.shapeRectangle]: NT.shapeDirection,
    },
    t: {
      [OT.assetDataSource]: NT.dataSourceType,
    },
    origin: { [OT.textFont]: NT.fontPathOrigin },
    b: {
      [ET.textSelector]: NT.textBased,
    },
    sh: {
      [ET.textSelector]: NT.textShape,
    },
  },
  known: {
    tt: {
      // layer-visual starts
      [OT.layerPrecomposition]: NT.matteMode,
      [OT.layerShape]: NT.matteMode,
      [OT.layerSolidColor]: NT.matteMode,
      [OT.layerImage]: NT.matteMode,
      [OT.layerNull]: NT.matteMode,
      [OT.layerText]: NT.matteMode,
      // layer-visual ends
    },
    m: {
      [OT.shapeRepeater]: NT.composite,
      [OT.shapeTrim]: NT.trimMultipleShapes,
      [ET.textFollowPath]: NT.textMask,
    },
    mm: {
      [OT.shapeMerge]: NT.mergeMode,
    },
    r: {
      [OT.shapeFill]: NT.fillRule,
      [OT.shapeGradientFill]: NT.fillRule,
      [ET.textSelector]: NT.rangeUnits,
    },
    t: {
      [OT.shapeGradientFill]: NT.gradientType,
      [OT.shapeGradientStroke]: NT.gradientType,
    },
    gt: {
      [OT.layerStyleGradientOverlay]: NT.gradientType,
    },
    lc: {
      // shape-base-stroke starts
      [OT.shapeGradientStroke]: NT.lineCap,
      [OT.shapeStroke]: NT.lineCap,
      // shape-base-stroke ends
    },
    lj: {
      // shape-base-stroke starts
      [OT.shapeGradientStroke]: NT.lineJoin,
      [OT.shapeStroke]: NT.lineJoin,
      // shape-base-stroke ends
      [OT.shapeOffsetPath]: NT.lineJoin,
    },
    sy: {
      [OT.shapePolygon]: NT.shapePolygonStarType,
      [OT.shapeStar]: NT.shapePolygonStarType,
    },
    g: {
      [ET.textAlignmentOptions]: NT.textGrouping,
    },
    j: {
      [ET.textDocument]: NT.textJustify,
    },
    ca: {
      [ET.textDocument]: NT.textCaps,
    },
    vj: {
      [ET.textDocument]: NT.textVerticalJustify,
    },
  },
};

export const nullEntity: EntityMap<AttributeTitle> = {
  required: {},
  known: {},
};

export const integerBooleanEntity: EntityMap<IntegerBooleanTitle> = {
  required: {
    t: { [ET.textSelector]: IBT.expressible },
  },
  known: {
    rn: { [ET.textSelector]: IBT.randomize },
    ddd: {
      [OT.animation]: IBT.threedimensional,
      ...createDependentTitles(CT.composition, IBT.layerThreedimensional),
    },
    ao: {
      // layer-visual starts
      [OT.layerPrecomposition]: IBT.autoOrient,
      [OT.layerShape]: IBT.autoOrient,
      [OT.layerSolidColor]: IBT.autoOrient,
      [OT.layerImage]: IBT.autoOrient,
      [OT.layerNull]: IBT.autoOrient,
      [OT.layerText]: IBT.autoOrient,
      // layer-visual ends
    },
    a: {
      [OT.animatedValue]: IBT.animated,
      [OT.animatedValueStatic]: IBT.animated,
      [OT.animatedShape]: IBT.animated,
      [OT.animatedShapeStatic]: IBT.animated,
      [OT.animatedPosition]: IBT.animated,
      [OT.animatedPositionStatic]: IBT.animated,
      [OT.animatedColor]: IBT.animated,
      [OT.animatedColorStatic]: IBT.animated,
      [OT.animatedMultidimensional]: IBT.animated,
      [OT.animatedMultidimensionalStatic]: IBT.animated,
    },
    e: {
      [OT.assetImage]: IBT.embedded,
      [OT.assetDataSource]: IBT.embedded,
      [OT.assetFile]: IBT.embedded,
    },
    en: {
      ...createDependentTitles(CT.effectList, IBT.enabled),
    },
    xt: { [OT.assetPrecomposition]: IBT.extraComposition },
    h: {
      [OT.keyframe]: IBT.hold,
      [CT.keyframeList]: IBT.hold,
      [CT.keyframeValue]: IBT.hold,
      [OT.positionKeyframe]: IBT.hold,
      [CT.positionKeyframeList]: IBT.hold,
      [OT.keyframeBezierHandle]: IBT.hold,
      [OT.shapeKeyframe]: IBT.hold,
    },
    ct: {
      // layer-visual starts
      [OT.layerPrecomposition]: IBT.collapseTransformNew,
      [OT.layerShape]: IBT.collapseTransformNew,
      [OT.layerSolidColor]: IBT.collapseTransformNew,
      [OT.layerImage]: IBT.collapseTransformNew,
      [OT.layerNull]: IBT.collapseTransformNew,
      [OT.layerText]: IBT.collapseTransformNew,
      // layer-visual ends
    },
    td: {
      // layer-visual starts
      [OT.layerPrecomposition]: IBT.matteTarget,
      [OT.layerShape]: IBT.matteTarget,
      [OT.layerSolidColor]: IBT.matteTarget,
      [OT.layerImage]: IBT.matteTarget,
      [OT.layerNull]: IBT.matteTarget,
      [OT.layerText]: IBT.matteTarget,
      // layer-visual ends
    },
  },
};

export const booleanEntity: EntityMap<BooleanTitle> = {
  required: {
    s: {
      [OT.splitVector]: BT.splitEnabled,
    },
  },
  known: {
    c: {
      [OT.bezier]: BT.bezierClosed,
    },
    inv: { [OT.mask]: BT.inverted },
    hd: {
      ...createDependentTitles(CT.composition, BT.hidden),
      ...createDependentTitles(CT.shapeList, BT.hidden),
    },
    cp: {
      // layer-visual starts
      [OT.layerPrecomposition]: BT.collapseTransform,
      [OT.layerShape]: BT.collapseTransform,
      [OT.layerSolidColor]: BT.collapseTransform,
      [OT.layerImage]: BT.collapseTransform,
      [OT.layerNull]: BT.collapseTransform,
      [OT.layerText]: BT.collapseTransform,
      // layer-visual ends
    },
    hasMask: {
      // layer-visual starts
      [OT.layerPrecomposition]: BT.hasMask,
      [OT.layerShape]: BT.hasMask,
      [OT.layerSolidColor]: BT.hasMask,
      [OT.layerImage]: BT.hasMask,
      [OT.layerNull]: BT.hasMask,
      [OT.layerText]: BT.hasMask,
      // layer-visual ends
    },
    mb: {
      // layer-visual starts
      [OT.layerPrecomposition]: BT.motionBlurEnabled,
      [OT.layerShape]: BT.motionBlurEnabled,
      [OT.layerSolidColor]: BT.motionBlurEnabled,
      [OT.layerImage]: BT.motionBlurEnabled,
      [OT.layerNull]: BT.motionBlurEnabled,
      [OT.layerText]: BT.motionBlurEnabled,
      // layer-visual ends
    },
    of: {
      [ET.textDocument]: BT.strokeOverFill,
    },
  },
};

export const collectionEntity: EntityMap<CollectionTitle> = {
  required: {
    assets: { [OT.animation]: CT.assets },
    layers: {
      [OT.animation]: CT.composition,
      [OT.assetPrecomposition]: CT.composition,
    },
    shapes: {
      [OT.layerShape]: CT.shapeList,
      [OT.characterShapes]: CT.shapeList,
    },
    ef: {
      ...createDependentTitles(CT.effectList, CT.effectParamList),
    },
    i: {
      [OT.bezier]: CT.bezierInTangents,
    },
    o: { [OT.bezier]: CT.bezierOutTangents },
    v: { [OT.bezier]: CT.bezierVertices },
    k: {
      [ET.textAnimatedDocument]: CT.textDocumentKeyframes,
      [OT.animatedValue]: CT.keyframeList,
      [OT.animatedValueStatic]: CT.staticValues,
      [OT.animatedMultidimensional]: CT.keyframeList,
      [OT.animatedMultidimensionalStatic]: CT.staticValues,
      [OT.animatedPosition]: CT.positionKeyframeList,
      [OT.animatedPositionStatic]: CT.staticValues,
      [OT.animatedColor]: CT.keyframeList,
      [OT.animatedShape]: CT.shapeKeyframeList,
      [OT.animatedColorStatic]: CT.colorRgba,
    },
    a: {
      [ET.textAnimatorData]: CT.textRanges,
    },
    x: {
      [OT.keyframeBezierHandle]: CT.bezierXAxis,
    },
    y: {
      [OT.keyframeBezierHandle]: CT.bezierYAxis,
    },
    s: {
      [OT.shapeKeyframe]: CT.shapeKeyframeStart,
    },
    fc: { [ET.textDocument]: CT.documentFillColor },
  },
  known: {
    k: {
      [ET.metadata]: CT.keywords,
    },
    comps: { [OT.animation]: CT.extraCompositions },
    chars: { [OT.animation]: CT.textCharacters },
    markers: { [OT.animation]: CT.markers },
    masksProperties: {
      // layer-visual starts
      [OT.layerPrecomposition]: CT.masksProperties,
      [OT.layerShape]: CT.masksProperties,
      [OT.layerSolidColor]: CT.masksProperties,
      [OT.layerImage]: CT.masksProperties,
      [OT.layerNull]: CT.masksProperties,
      [OT.layerText]: CT.masksProperties,
      // layer-visual ends
    },
    ef: {
      // layer-visual starts
      [OT.layerPrecomposition]: CT.effectList,
      [OT.layerShape]: CT.effectList,
      [OT.layerSolidColor]: CT.effectList,
      [OT.layerImage]: CT.effectList,
      [OT.layerNull]: CT.effectList,
      [OT.layerText]: CT.effectList,
      // layer-visual ends
    },
    sy: {
      // layer-visual starts
      [OT.layerPrecomposition]: CT.layerStyle,
      [OT.layerShape]: CT.layerStyle,
      [OT.layerSolidColor]: CT.layerStyle,
      [OT.layerImage]: CT.layerStyle,
      [OT.layerNull]: CT.layerStyle,
      [OT.layerText]: CT.layerStyle,
      // layer-visual ends
    },
    d: {
      // shape-base-stroke starts
      [OT.shapeGradientStroke]: CT.strokeDashList,
      [OT.shapeStroke]: CT.strokeDashList,
      // shape-base-stroke ends
    },
    it: { [OT.shapeGroup]: CT.shapeList },
    s: {
      [OT.keyframe]: CT.keyframeValue,
      [CT.keyframeList]: CT.keyframeValue,
      [OT.positionKeyframe]: CT.keyframeValue,
      [CT.positionKeyframeList]: CT.keyframeValue,
      [OT.keyframeBezierHandle]: CT.keyframeValue,
    },
    e: {
      [OT.keyframe]: CT.keyframeEndValue,
      [CT.keyframeList]: CT.keyframeEndValue,
      [CT.keyframeValue]: CT.keyframeEndValue,
      [OT.positionKeyframe]: CT.keyframeEndValue,
      [CT.positionKeyframeList]: CT.keyframeEndValue,
      [OT.keyframeBezierHandle]: CT.keyframeEndValue,
      [OT.shapeKeyframe]: CT.keyframeEndValue,
    },
    to: {
      [OT.positionKeyframe]: CT.positionKeyframeOutTangents,
    },
    ti: {
      [OT.positionKeyframe]: CT.positionKeyframeInTangents,
    },
    sz: { [ET.textDocument]: CT.wrapSize },
    sc: {
      [ET.textDocument]: CT.documentStrokeColor,
    },
    ps: {
      [ET.textDocument]: CT.wrapPosition,
    },
    list: {
      [ET.textFonts]: CT.textFontList,
    },
  },
};

export const elementEntity: EntityMap<ElementTitle> = {
  required: {
    r: {
      // transform starts
      [ET.layerTransform]: ET.rotationClockwise,
      [OT.shapeTransform]: ET.rotationClockwise,
      [ET.transformRepeater]: ET.rotationClockwise,
      [ET.textStyle]: ET.rotationClockwise,
      // transform ends
      [OT.shapePolygon]: ET.polygonRotationClockwise,
      [OT.shapeStar]: ET.polygonRotationClockwise,
      [OT.shapeRectangle]: ET.rounded,
      [OT.shapeRoundedCorners]: ET.radius,
    },
    au: { [OT.layerAudio]: ET.layerAudioSettings },
    t: { [OT.layerText]: ET.textAnimatorData },
    pe: { [OT.layerCamera]: ET.perspective },
    ks: {
      // layer-visual starts
      [OT.layerPrecomposition]: ET.layerTransform,
      [OT.layerShape]: ET.layerTransform,
      [OT.layerSolidColor]: ET.layerTransform,
      [OT.layerImage]: ET.layerTransform,
      [OT.layerNull]: ET.layerTransform,
      [OT.layerText]: ET.layerTransform,
      // layer-visual ends
      [OT.layerCamera]: ET.layerTransform,
      [OT.shapePath]: ET.animatedShapeProp,
    },
    p: {
      [OT.shapeEllipse]: ET.animatedPositionProp,
      [OT.shapePolygon]: ET.animatedPositionProp,
      [OT.shapeStar]: ET.animatedPositionProp,
      [OT.shapeRectangle]: ET.animatedPositionProp,
      [ET.textAnimatorData]: ET.textFollowPath,
      [ET.slot]: ET.slotProperty,
    },
    s: {
      [OT.shapeEllipse]: ET.shapeEllipseSize,
      [OT.shapeGradientFill]: ET.shapeGradientFillStartPoint,
      [OT.shapeGradientStroke]: ET.shapeGradientStrokeStartPoint,
      [OT.shapeRectangle]: ET.shapeRectangleSize,
      [OT.shapeTrim]: ET.shapeTrimStart,
      [OT.textDocumentKeyframe]: ET.textDocument,

      [OT.layerStyleStroke]: ET.blurSize,
      [OT.layerStyleDropShadow]: ET.blurSize,
      [OT.layerStyleInnerShadow]: ET.blurSize,
      [OT.layerStyleBevelEmboss]: ET.blurSize,
      [OT.layerStyleSatin]: ET.blurSize,
    },
    o: {
      [OT.shapeFill]: ET.shapeFillOpacity,
      [OT.shapeGradientFill]: ET.shapeGradientFillOpacity,
      [OT.shapeTrim]: ET.shapeTrimOffset,

      // shape-base-stroke starts
      [OT.shapeGradientStroke]: ET.strokeOpacity,
      [OT.shapeStroke]: ET.strokeOpacity,
      // shape-base-stroke ends
    },
    c: {
      [OT.shapeFill]: ET.shapeFillColor,
      [OT.shapeRepeater]: ET.copies,
      [OT.shapeStroke]: ET.shapeStrokeColor,
    },
    e: {
      [OT.shapeGradientFill]: ET.shapeGradientFillEndPoint,
      [OT.shapeGradientStroke]: ET.shapeGradientStrokeEndPoint,
      [OT.shapeTrim]: ET.shapeTrimEnd,
    },
    g: {
      [OT.shapeGradientFill]: ET.animatedGradientColors,
      [OT.shapeGradientStroke]: ET.animatedGradientColors,
    },
    or: {
      [OT.shapePolygon]: ET.shapePolygonOuterRadius,
      [OT.shapeStar]: ET.shapeStarOuterRadius,
    },
    os: {
      [OT.shapePolygon]: ET.shapePolygonOuterRoundness,
      [OT.shapeStar]: ET.shapeStarOuterRoundness,
    },
    pt: {
      [OT.shapePolygon]: ET.shapePolygonPoints,
      [OT.shapeStar]: ET.shapeStarPoints,
    },
    ir: {
      [OT.shapeStar]: ET.innerRadius,
    },
    is: {
      [OT.shapeStar]: ET.innerRoundness,
    },
    tr: {
      [OT.shapeRepeater]: ET.transformRepeater,
    },
    data: {
      [CT.textCharacters]: ET.textCharacterData,
    },
    a: {
      [ET.textSelector]: ET.textMaxAmount,
    },
    d: {
      [ET.textAnimatorData]: ET.textAnimatedDocument,
    },
    k: {
      [OT.animatedShapeStatic]: ET.animatedShapeBezier,
      [ET.animatedGradientColors]: ET.animatedMultidimensionalProp,
    },
    lv: { [ET.layerAudioSettings]: ET.audioLevel },
    x: {
      [OT.splitVector]: ET.splitX,
    },
    y: {
      [OT.splitVector]: ET.splitY,
    },
    z: {
      [OT.splitVector]: ET.splitZ,
    },
    lc: {
      [OT.layerStyleDropShadow]: ET.layerConceal,
    },
    m: {
      [ET.textAnimatorData]: ET.textAlignmentOptions,
    },
    w: {
      // shape-base-stroke starts
      [OT.shapeGradientStroke]: ET.strokeWidth,
      [OT.shapeStroke]: ET.strokeWidth,
      // shape-base-stroke ends
    },
  },
  known: {
    xe: {
      [ET.textSelector]: ET.textMaxEase,
    },
    ne: {
      [ET.textSelector]: ET.textMinEase,
    },
    meta: { [OT.animation]: ET.metadata },
    [ET.metadata]: { [OT.animation]: ET.userMetadata },
    mb: { [OT.animation]: ET.motionBlur },
    fonts: { [OT.animation]: ET.textFonts },
    v: {
      [OT.strokeDashDefault]: ET.strokeLength,
      [OT.strokeDashGap]: ET.strokeLength,
      [OT.strokeDashOffset]: ET.strokeLength,

      [OT.effectParamAngle]: ET.effectValueAngle,
      [OT.effectParamCheckbox]: ET.effectValueCheckbox,
      [OT.effectParamColor]: ET.effectValueColor,
      [OT.effectParamDropdown]: ET.effectValueDropdown,
      [OT.effectParamLayer]: ET.effectValueLayer,
      [OT.effectParamPoint]: ET.effectValuePoint,
      [OT.effectParamSlider]: ET.effectValueSlider,
    },
    rx: {
      // transform starts
      [ET.layerTransform]: ET.rotationX,
      [OT.shapeTransform]: ET.rotationX,
      [ET.transformRepeater]: ET.rotationX,
      [ET.textStyle]: ET.rotationX,
      // transform ends
    },
    ry: {
      // transform starts
      [ET.layerTransform]: ET.rotationY,
      [OT.shapeTransform]: ET.rotationY,
      [ET.transformRepeater]: ET.rotationY,
      [ET.textStyle]: ET.rotationY,
      // transform ends
    },
    rz: {
      // transform starts
      [ET.layerTransform]: ET.rotationZ,
      [OT.shapeTransform]: ET.rotationZ,
      [ET.transformRepeater]: ET.rotationZ,
      [ET.textStyle]: ET.rotationZ,
      // transform ends
    },
    or: {
      // transform starts
      [ET.layerTransform]: ET.layerTransformOrientation,
      [OT.shapeTransform]: ET.shapeTransformOrientation,
      [ET.transformRepeater]: ET.transformRepeaterOrientation,
      [ET.textStyle]: ET.textStyleOrientation,
      // transform ends
    },
    a: {
      // transform starts
      [ET.layerTransform]: ET.anchorPoint,
      [ET.transformRepeater]: ET.anchorPoint,
      [OT.shapeTransform]: ET.anchorPoint,
      [ET.textStyle]: ET.anchorPoint,
      // transform ends
      [OT.shapeGradientFill]: ET.highlightAngle,
      [OT.shapeGradientStroke]: ET.highlightAngle,
      [OT.shapePuckerBloat]: ET.amount,
      [OT.shapeTwist]: ET.angle,
      [OT.shapeOffsetPath]: ET.amount,

      [OT.textRange]: ET.textStyle,
      [ET.textFollowPath]: ET.forceAlignment,
      [ET.textSelector]: ET.textMaxAmount,
      [ET.textAlignmentOptions]: ET.textGroupAlignment,

      [OT.layerStyleDropShadow]: ET.angle,
      [OT.layerStyleInnerShadow]: ET.angle,
      [OT.layerStyleBevelEmboss]: ET.angle,
      [OT.layerStyleSatin]: ET.angle,
      [OT.layerStyleGradientOverlay]: ET.angle,
    },
    s: {
      // transform starts
      [ET.layerTransform]: ET.layerTransformScale,
      [OT.shapeTransform]: ET.shapeTransformScale,
      [ET.transformRepeater]: ET.transformRepeaterScale,
      [ET.textStyle]: ET.textStyleScale,
      // transform ends

      [OT.shapeZigZags]: ET.shapeZigZagSize,
      [OT.textRange]: ET.textSelector,

      [OT.layerStyleStroke]: ET.layerStyleStrokeSize,
      [OT.layerStyleGradientOverlay]: ET.gradientOverlayScale,
      [ET.textSelector]: ET.textSelectorStart,
    },
    o: {
      // transform starts
      [ET.layerTransform]: ET.transformOpacity,
      [OT.shapeTransform]: ET.transformOpacity,
      [ET.transformRepeater]: ET.transformOpacity,
      [ET.textStyle]: ET.transformOpacity,
      // transform ends

      [ET.textSelector]: ET.shapeTrimOffset,

      [OT.shapeFill]: ET.shapeFillOpacity,
      [OT.shapeGradientFill]: ET.shapeGradientFillOpacity,
      [OT.shapeGradientStroke]: ET.shapeGradientStrokeOpacity,
      [OT.shapeStroke]: ET.shapeStrokeOpacity,

      [OT.mask]: ET.maskOpacity,

      [OT.shapeRepeater]: ET.shapeTrimOffset,
      [OT.keyframe]: ET.keyframeOutTangent,
      [CT.keyframeList]: ET.keyframeListOutTangent,
      [CT.keyframeValue]: ET.keyframeValueOutTangent,
      [OT.positionKeyframe]: ET.positionKeyframeOutTangent,
      [CT.positionKeyframeList]: ET.positionKeyframeListOutTangent,
      [OT.keyframeBezierHandle]: ET.keyframeBezierHandleOutTangent,
      [OT.shapeKeyframe]: ET.shapeKeyframeOutTangent,
      [OT.layerStyleDropShadow]: ET.layerStyleOpacity,
      [OT.layerStyleInnerShadow]: ET.layerStyleOpacity,
      [OT.layerStyleBevelEmboss]: ET.layerStyleOpacity,
      [OT.layerStyleSatin]: ET.layerStyleOpacity,
      [OT.layerStyleColorOverlay]: ET.layerStyleOpacity,
      [OT.layerStyleGradientOverlay]: ET.layerStyleOpacity,
    },
    i: {
      [OT.keyframe]: ET.keyframeInTangent,
      [CT.keyframeList]: ET.keyframeListInTangent,
      [CT.keyframeValue]: ET.keyframeValueInTangent,
      [OT.positionKeyframe]: ET.positionKeyframeInTangent,
      [CT.positionKeyframeList]: ET.positionKeyframeListInTangent,
      [OT.keyframeBezierHandle]: ET.keyframeBezierHandleInTangent,
      [OT.shapeKeyframe]: ET.shapeKeyframeInTangent,
    },
    sk: {
      // transform starts
      [ET.layerTransform]: ET.layerTransformSkew,
      [OT.shapeTransform]: ET.shapeTransformSkew,
      [ET.transformRepeater]: ET.transformRepeaterSkew,
      [ET.textStyle]: ET.textStyleSkew,
      // transform ends
    },
    sa: {
      // transform starts
      [ET.layerTransform]: ET.layerTransformSkewAxis,
      [OT.shapeTransform]: ET.shapeTransformSkewAxis,
      [ET.transformRepeater]: ET.transformRepeaterSkewAxis,
      [ET.textStyle]: ET.textStyleSkewAxis,
      // transform ends
    },
    p: {
      // transform starts
      [ET.layerTransform]: ET.translation,
      [OT.shapeTransform]: ET.translation,
      [ET.transformRepeater]: ET.translation,
      [ET.textStyle]: ET.translation,
      // transform ends
      [ET.textFollowPath]: ET.perpendicularToPath,
    },
    pt: {
      [OT.mask]: ET.maskVertices,
      [OT.shapeZigZags]: ET.shapeZigZagsPoints,
    },
    x: { [OT.mask]: ET.dilate },
    tm: { [OT.layerPrecomposition]: ET.timeRemapping },
    h: {
      [OT.shapeGradientFill]: ET.highlightLength,
      [OT.shapeGradientStroke]: ET.highlightLength,
    },
    r: {
      [OT.shapeGradientFill]: ET.shapeGradientFillRule,
      [OT.shapeZigZags]: ET.roundness,
      [ET.textFollowPath]: ET.reversePath,
      [OT.layerStyleOuterGlow]: ET.range,
    },
    ml2: {
      // shape-base-stroke starts
      [OT.shapeGradientStroke]: ET.miterLimitAlternative,
      [OT.shapeStroke]: ET.miterLimitAlternative,
      // shape-base-stroke ends
    },
    w: {
      // shape-base-stroke starts
      [OT.shapeGradientStroke]: ET.strokeWidth,
      [OT.shapeStroke]: ET.strokeWidth,
      // shape-base-stroke ends
    },
    c: {
      [OT.shapeTrim]: ET.shapeTrimCenter,
      [OT.layerStyleStroke]: ET.layerStyleColor,
      [OT.layerStyleDropShadow]: ET.layerStyleColor,
      [OT.layerStyleInnerShadow]: ET.layerStyleColor,
      [OT.layerStyleBevelEmboss]: ET.layerStyleColor,
      [OT.layerStyleOuterGlow]: ET.layerStyleColor,
    },
    ml: { [OT.shapeOffsetPath]: ET.miterLimit },
    so: {
      [OT.layerStyleBevelEmboss]: ET.shadowOpacity,
      [OT.layerStyleColorOverlay]: ET.layerStyleOpacity,
      [ET.transformRepeater]: ET.startOpacity,
    },
    eo: {
      [ET.transformRepeater]: ET.endOpacity,
    },
    ks: {
      [OT.characterPrecomp]: ET.layerTransform,
      [OT.shapePath]: ET.shape,
    },
    f: {
      [ET.textFollowPath]: ET.firstMargin,
    },
    l: {
      [ET.textFollowPath]: ET.lastMargin,
    },
    sw: {
      [ET.textStyle]: ET.strokeWidth,
    },
    sc: {
      [ET.textStyle]: ET.strokeColor,
      [ET.textDocument]: ET.strokeColor,
      [OT.layerStyleBevelEmboss]: ET.shadowColor,
    },
    sh: {
      [ET.textStyle]: ET.strokeHue,
    },
    ss: {
      [ET.textStyle]: ET.strokeSaturation,
    },
    sb: {
      [ET.textStyle]: ET.strokeBrightness,
    },
    fc: {
      [ET.textStyle]: ET.textFillColor,
    },
    fh: {
      [ET.textStyle]: ET.textFillHue,
    },
    fs: {
      [ET.textStyle]: ET.textFillSaturation,
    },
    fo: {
      [ET.textStyle]: ET.textFillOpacity,
    },
    fb: {
      [ET.textStyle]: ET.textFillBrightness,
    },
    t: {
      [ET.textStyle]: ET.letterSpacing,
    },
    bl: {
      [ET.textStyle]: ET.textBlur,
    },
    ls: {
      [ET.textStyle]: ET.lineSpacing,
    },
    sm: {
      [ET.textSelector]: ET.selectorSmoothness,
      [OT.layerStyleBevelEmboss]: ET.shadowMode,
    },
    e: {
      [ET.textSelector]: ET.textSelectorEnd,
    },
    gf: {
      [OT.layerStyleGradientOverlay]: ET.animatedGradientColors,
    },
    ch: {
      [OT.layerStyleDropShadow]: ET.chokeSpread,
      [OT.layerStyleInnerShadow]: ET.chokeSpread,
      [OT.layerStyleBevelEmboss]: ET.chokeSpread,
      [OT.layerStyleOuterGlow]: ET.chokeSpread,
    },
    bm: {
      [OT.layerStyleDropShadow]: ET.layerStyleBlendMode,
      [OT.layerStyleInnerShadow]: ET.layerStyleBlendMode,
      [OT.layerStyleBevelEmboss]: ET.layerStyleBlendMode,
      [OT.layerStyleSatin]: ET.layerStyleBlendMode,
      [OT.layerStyleColorOverlay]: ET.layerStyleBlendMode,
      [OT.layerStyleGradientOverlay]: ET.layerStyleBlendMode,
    },
    no: {
      [OT.layerStyleDropShadow]: ET.noise,
      [OT.layerStyleInnerShadow]: ET.noise,
      [OT.layerStyleOuterGlow]: ET.noise,
      [OT.layerStyleInnerGlow]: ET.noise,
    },
    d: {
      [OT.layerStyleDropShadow]: ET.distance,
      [OT.layerStyleInnerShadow]: ET.distance,
      [OT.layerStyleBevelEmboss]: ET.distance,
      [OT.layerStyleOuterGlow]: ET.distance,
    },
    j: {
      [OT.layerStyleOuterGlow]: ET.jitter,
    },
    sr: {
      [OT.layerStyleInnerGlow]: ET.source,
      [OT.layerStyleBevelEmboss]: ET.strength,
    },
    bs: {
      [OT.layerStyleBevelEmboss]: ET.bevelStyle,
    },
    bt: {
      [OT.layerStyleBevelEmboss]: ET.technique,
    },
    sf: {
      [OT.layerStyleBevelEmboss]: ET.soften,
    },
    ga: {
      [OT.layerStyleBevelEmboss]: ET.globalAngle,
    },
    ll: {
      [OT.layerStyleBevelEmboss]: ET.altitude,
    },
    hm: {
      [OT.layerStyleBevelEmboss]: ET.highlightMode,
    },
    hc: {
      [OT.layerStyleBevelEmboss]: ET.highlightColor,
    },
    ho: {
      [OT.layerStyleBevelEmboss]: ET.highlightOpacity,
    },
    in: {
      [OT.layerStyleSatin]: ET.invert,
    },
    gs: {
      [OT.layerStyleGradientOverlay]: ET.smoothness,
    },
    re: {
      [OT.layerStyleGradientOverlay]: ET.reverse,
    },
    al: {
      [OT.layerStyleGradientOverlay]: ET.align,
    },
    of: {
      [OT.layerStyleGradientOverlay]: ET.shapeTrimOffset,
    },
    slots: {
      [OT.animation]: ET.slots,
    },
  },
};

export const getEntityData = <T extends AnyTitle>(
  key: Key,
  parentTitle: ParentTitle,
  entity: EntityMap<T>,
  type: EntityType,
): Entity<T> => {
  const requiredMap = entity.required[key] || {};
  const requiredTitle = requiredMap[parentTitle];

  if (requiredTitle) {
    return {
      type,
      title: requiredTitle,
      parentTitle,
      required: true,
    };
  }

  const knownMap = entity.known[key] || {};
  const title = knownMap[parentTitle] || (CUSTOM as T);

  return {
    type,
    title,
    parentTitle,
    required: false,
  };
};

export const getCollectionData = (key: Key, parentTitle: ParentTitle): Entity<CollectionTitle> => {
  return getEntityData<CollectionTitle>(key, parentTitle, collectionEntity, 'collection');
};

export const getElementData = (key: Key, parentTitle: ParentTitle): Entity<ElementTitle> => {
  return getEntityData<ElementTitle>(key, parentTitle, elementEntity, 'element');
};

export const getNumberConstantEntity = (
  key: Key,
  member: MomoaNumber,
  parentTitle: ParentTitle,
): Entity<AttributeTitle> => {
  const constantEntity = getEntityData<AttributeTitle>(key, parentTitle, numberConstantEntity, 'constant');

  if (constantEntity.title !== CUSTOM) {
    const constantValues = constantNumValues.get(constantEntity.title);

    if (!constantValues) return constantEntity;

    const constValue = constantValues.get(member.value);

    if (constValue) constantEntity.title = `${constantEntity.title}-${constValue}` as AttributeTitle;

    return constantEntity;
  }

  return getEntityData<AttributeTitle>(key, parentTitle, integerBooleanEntity, 'integer-boolean');
};

export const getStringConstantEntity = (
  key: Key,
  member: MomoaString,
  parentTitle: ParentTitle,
): Entity<AttributeTitle> => {
  const constantEntity = getEntityData<AttributeTitle>(key, parentTitle, stringConstantEntity, 'constant');

  if (constantEntity.title !== CUSTOM) {
    const constantValues = constantStrValues.get(constantEntity.title);

    if (!constantValues) return constantEntity;

    const constValue = constantValues.get(member.value);

    if (constValue) constantEntity.title = `${constantEntity.title}-${constValue}` as AttributeTitle;
  }

  return constantEntity;
};

export const getAttributeData = (key: Key, member: MomoaMember, parentTitle: ParentTitle): Entity<AttributeTitle> => {
  switch (member.value.type) {
    case 'String':
      const stringTitles = getEntityData<AttributeTitle>(key, parentTitle, stringEntity, 'attribute');

      if (stringTitles.title !== CUSTOM) return stringTitles;

      return getStringConstantEntity(key, member.value, parentTitle);

    case 'Boolean':
      return getEntityData<BooleanTitle>(key, parentTitle, booleanEntity, 'attribute');

    case 'Number':
      const numberEntityData = getEntityData<AttributeTitle>(key, parentTitle, numberEntity, 'attribute');

      if (numberEntityData.title !== CUSTOM) return numberEntityData;

      return getNumberConstantEntity(key, member.value, parentTitle);

    case 'Null':
      return getEntityData<AttributeTitle>(key, parentTitle, nullEntity, 'attribute');

    default:
      return {
        type: 'missing',
        title: CUSTOM,
        parentTitle,
        required: false,
      };
  }
};

export const getMemberEntity = (key: Key, member: MomoaMember, parentTitle: ParentTitle): Entity => {
  switch (member.value.type) {
    case 'Array':
      return getCollectionData(key, parentTitle);

    case 'Object':
      return getElementData(key, parentTitle);

    default:
      return getAttributeData(key, member, parentTitle);
  }
};
