import {segmentsIntersect} from "../libs/tsmt/utils/geom-utils";

export const ZERO_TOL        = 0.0000001;       // arbitrary zero-tolerance to use as default when tolerance not provided
export const RAD_TO_DEG      = 180/Math.PI;     // convert radians to degrees
export const ROOT_ITER_LIMIT = 50;              // iteration limit for root finding

export interface Point
{
  x: number;
  y: number;
}

export interface Interval
{
  left: number;
  right: number;
}

export interface FcnEval
{
  (x: number): number;
}

export enum DirEnum
{
  LEFT,
  RIGHT,
  ON
}

export interface Projection
{
  x: number,
  y: number,
  d: number
}

export interface ProjectFromTo extends Projection
{
  fromX: number;
  fromY: number;
}

export interface Rect
{
  left: number;
  top: number;
  right: number;
  bottom: number
}

export interface IntersectionPoints
{
  first: Point,
  second: Point
}

export interface SegmentIntersection
{
  intersects: boolean,
  t: number,
  u: number
}

export interface Vertices
{
  name?: string;
  xcoord: Array<number>;
  ycoord: Array<number>;
  autoClose: boolean;
  toYDown: boolean;
}

export interface NEWS
{
  n: number;
  e: number;
  s: number;
  w: number;
  n1: Point;
  n2: Point;
  e1: Point;
  e2: Point;
  s1: Point;
  s2: Point;
  w1: Point;
  w2: Point;
}

export interface Ranges
{
  min: number,
  minX: number,
  minY: number,
  max: number,
  maxX: number,
  maxY: number
}


