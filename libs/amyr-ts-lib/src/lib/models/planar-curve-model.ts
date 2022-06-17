import { Point } from "@algorithmist/amyr-ts-lib";

export interface ControlPoints
{
  x0: number;

  y0: number;

  cx: number;

  cy: number;

  cx1?: number;

  cy1?: number;

  x1: number;

  y1: number;
}

export interface CurveCoefs
{
  c0x: number;

  c0y: number;

  c1x: number;

  c1y: number;

  c2x: number;

  c2y: number;

  c3x?: number;

  c3y?: number;
}

export interface PlanarCurveModel extends ControlPoints
{
  order: number;

  coefs: CurveCoefs;

  fromObject(coefs: ControlPoints): void;

  toObject(): ControlPoints;

  getX(t: number): number;

  getY(t: number): number;

  getXPrime(t: number): number;

  getYPrime(t: number): number;

  interpolate(points: Array<Point>): void;

  getTAtS(s: number): number;

  getTAtX(x: number): Array<number>;

  getYAtX(x: number): Array<number>;

  getXAtY(y: number): Array<number>;

  lengthAt(t: number): number;
}

export enum SplineTypes
{
  CARTESIAN    = "cartesian",
  CUBIC_BEZIER = "cubicbezier",
  CATMULL_ROM  = "catmullrom"
}

export interface Split
{
  left: ControlPoints;
  right: ControlPoints;
}
