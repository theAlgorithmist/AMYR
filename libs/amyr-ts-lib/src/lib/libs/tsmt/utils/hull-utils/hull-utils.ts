/**
 * Copyright 2021 Jim Armstrong (www.algorithmist.net)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * AMYR Library: Typescript implementation of some useful utility functions for the concave hull algorithm.
 *
 * @author Jim Armstrong
 *
 * @version 1.0
 */

import { Point2D } from "@algorithmist/amyr-ts-lib";

// point-in-polygon test
export function pointInPolygon(point: Point2D, vs: Array<Point2D>, start: number | null, end: number | null): boolean
{
  const x: number = point[0];
  const y: number = point[1];

  let inside = false;
  let i: number;
  let j: number;

  const startIndex = start != null ? start : 0;
  const endIndex   = end != null ? end : vs.length;

  const len: number = (endIndex - startIndex);

  let xi: number;
  let xj: number;
  let yi: number;
  let yj: number;
  let intersect: boolean;

  for (i = 0, j = len - 1; i < len; j = i++)
  {
    xi = vs[startIndex + i][0];
    yi = vs[startIndex + i][1];
    xj = vs[startIndex + j][0];
    yj = vs[startIndex + j][1];

    intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

    if (intersect) {
      inside = !inside;
    }
  }

  return inside;
}

// CW or CCW orientation test
export function orient(ax: number, ay: number, bx: number, by: number, cx: number, cy: number): number {
  return (ay - cy) * (bx - cx) - (ax - cx) * (by - cy);
}

// vector cross product in 2D
export function cross(p1: Array<number>, p2: Array<number>, p3: Array<number>): number
{
  return orient(p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]);
}

// edge (p1,q1) and (p2,q2) intersect test
export function intersects(p1: Array<number>, q1: Array<number>, p2: Array<number>, q2: Array<number>): boolean
{
  return p1 !== q2 && q1 !== p2 &&
    cross(p1, q1, p2) > 0 !== cross(p1, q1, q2) > 0 &&
    cross(p2, q2, p1) > 0 !== cross(p2, q2, q1) > 0;
}

// squared distance between two points
export function squaredDist(p1: Array<number>, p2: Array<number>): number
{
  const dx: number = p1[0] - p2[0];
  const dy: number = p1[1] - p2[1];

  return dx * dx + dy * dy;
}

// square distance from a point to a segment
export function sqSegDist(p: Array<number>, p1: Array<number>, p2: Array<number>): number
{
  let x: number  = p1[0];
  let y: number  = p1[1];
  let dx: number = p2[0] - x;
  let dy: number = p2[1] - y;

  let t: number;

  if (dx !== 0 || dy !== 0)
  {
    t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);

    if (t > 1)
    {
      x = p2[0];
      y = p2[1];
    }
    else if (t > 0)
    {
      x += dx * t;
      y += dy * t;
    }
  }

  dx = p[0] - x;
  dy = p[1] - y;

  return dx * dx + dy * dy;
}

// segment to segment distance, ported from http://geomalgorithms.com/a07-_distance.html by Dan Sunday
export function sqSegSegDist(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): number
{
  const ux: number = x1 - x0;
  const uy: number = y1 - y0;
  const vx: number = x3 - x2;
  const vy: number = y3 - y2;
  const wx: number = x0 - x2;
  const wy: number = y0 - y2;
  const a: number  = ux * ux + uy * uy;
  const b: number  = ux * vx + uy * vy;
  const c: number  = vx * vx + vy * vy;
  const d: number  = ux * wx + uy * wy;
  const e: number  = vx * wx + vy * wy;
  const D: number  = a * c - b * b;

  let sc: number;
  let sN: number;
  let tc: number;
  let tN: number;
  let sD: number = D;
  let tD: number = D;

  if (D === 0)
  {
    sN = 0;
    sD = 1;
    tN = e;
    tD = c;
  }
  else
  {
    sN = b * e - c * d;
    tN = a * e - b * d;

    if (sN < 0)
    {
      sN = 0;
      tN = e;
      tD = c;
    }
    else if (sN > sD)
    {
      sN = sD;
      tN = e + b;
      tD = c;
    }
  }

  if (tN < 0.0)
  {
    tN = 0.0;
    if (-d < 0.0)
    {
      sN = 0.0;
    }
    else if (-d > a)
    {
      sN = sD;
    }
    else
    {
      sN = -d;
      sD = a;
    }
  }
  else if (tN > tD)
  {
    tN = tD;

    if ((-d + b) < 0.0)
    {
      sN = 0;
    }
    else if (-d + b > a)
    {
      sN = sD;
    }
    else
    {
      sN = -d + b;
      sD = a;
    }
  }

  sc = sN === 0 ? 0 : sN / sD;
  tc = tN === 0 ? 0 : tN / tD;

  const cx: number  = (1 - sc) * x0 + sc * x1;
  const cy: number  = (1 - sc) * y0 + sc * y1;
  const cx2: number = (1 - tc) * x2 + tc * x3;
  const cy2: number = (1 - tc) * y2 + tc * y3;
  const dx: number  = cx2 - cx;
  const dy: number  = cy2 - cy;

  return dx * dx + dy * dy;
}

