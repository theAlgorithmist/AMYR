/**
 * Copyright 2016 Jim Armstrong (www.algorithmist.net)
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
 * Typescript Math Toolkit: Low-level utility methods for coordinate operations using the core TSMT$Point structure.
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */

import { Point          } from "../../../models/geometry";
import { compareNumbers } from "./approx-equal";

/**
 * Compute the Euclidean distance between two points
 *
 * @param {Point} p0 First point
 *
 * @param {Point} p1 Second point
 */
 export function l2Norm(p0: Point, p1: Point): number
 {
   if (!p0 || !p1) return 0;

   const dx = p0.x - p1.x;
   const dy = p0.y - p1.y;

   return Math.sqrt((dx*dx) + (dy*dy));
 }

/**
 * Return the interior (minimum) angle between the origin and the two input points in either degrees or radians.
 *
 * @param {Point} p0 First point
 *
 * @param {Point} p1 Second point
 *
 * @param {boolean} toDegree {true} if the result is to be returned in degrees
 * @efault {true}
 */
 export function angle(p0: Point, p1: Point, toDegree: boolean=true): number
 {
   const value: number = Math.atan2( p1.y-p0.y, p1.x-p0.x );

   return toDegree ? 180*value/Math.PI : value;
 }

/**
 * Compute the (distance) ratio between two line segments, or the ratio of the distance from line segment P0-P2
 * to the distance of line segment P0-P1
 *
 * @param {Point} p0 First point
 *
 * @param {Point} p1 Second point
 *
 * @param {Point} p2 Third point
 */
 export function ratio(p0: Point, p1: Point, p2: Point): number
 {
   const l1: number = l2Norm(p0, p1);
   const l2: number = l2Norm(p0, p2);

   return (l2/l1);
 }

/**
 * Are two line segments parallel (within very small angle tolerance)?
 *
 * @param {Point} p0 First endpoint of first line segment
 *
 * @param {Point} p1 Second endpoint of first line segment
 *
 * @param {Point} p2 First endpoint of second line segment
 *
 * @param {Point} p3 Second endpoint of second line segment
 */
 export function isParallel(p0: Point, p1: Point, p2: Point, p3: Point): boolean
 {
   const a1: number = angle(p0, p1);
   const a2: number = angle(p2, p3);

   return compareNumbers( a1, a2, 0.0001 );
 }

/**
 * Is the input point on the line segment between two other points (within a very tight tolerance)?
 *
 * @param {Point} p0 First endpoint of line segment
 *
 * @param {Point} p1 Second endpoint of line segment
 *
 * @param {Point} p Test point
 */
 export function pointIsOnLine(p0: Point, p1: Point, p: Point): boolean
 {
   // if p is on line segment from p0 to p1, then it must satisfy p = (1-t)*p0 + t*p1 for t in [0,1] - the process
   // is, of course, complicated by nearly horizontal/vertical lines and numerical issues.
   let tx = -1;
   let ty = -2;

   // endpoint tests
   const dx0: number = p.x - p0.x;
   const dy0: number = p.y - p0.y;
   if (Math.abs(dx0) < 0.00000001 && Math.abs(dy0) < 0.00000001) tx = 0;

   const dx1: number = p1.x - p.x;
   const dy1: number = p1.y - p.y;
   if (Math.abs(dx1) < 0.00000001 && Math.abs(dy1) < 0.00000001) ty = 1;

   if (tx === 0 || ty === 1) return true;

   const dx: number = (p1.x - p0.x);
   const dy: number = (p1.y - p0.y);
   if (Math.abs(dx) < 0.00000001)
   {
     if (Math.abs(dy) < 0.00000001)
     {
       // otherwise coincident point test
       return false;
     }
     else
     {
       ty = dy0 / (p1.y-p0.y);
       return ty >= 0 && ty <= 1;
     }
   }
   else
   {
     tx = dx0/(p1.x-p0.x);
     if (Math.abs(dy) < 0.00000001)
     {
       // same as above
       return tx >= 0 && tx <= 1;
     }
     else
     {
       ty = dy0 / (p1.y-p0.y);
       if (tx >= 0 && tx <= 1 && ty >= 0 && ty <= 1)
         return compareNumbers(tx, ty, 0.001);
       else
         return false;
     }
   }
 }

/**
 * Is a point strictly to the left of the line through two other points?
 *
 * @param {Point} p0 Initial point of line segment
 *
 * @param {Point} p1 Terminal point of line segment
 *
 * @param {Point} Test point
 */
 export function isLeft(p0: Point, p1: Point, p2: Point): boolean
 {
   const amt: number = (p1.x - p0.x)*(p2.y - p0.y) - (p2.x - p0.x)*(p1.y - p0.y);

   return amt > 0;
 }

/**
 * Project a Point a specified distance in the direction of it and another {Point}. Returns coordinates of the first
 * point projected a distance, {d}, in the direction from P0 to P1
 *
 * @param {Point} p0 Origin point
 *
 * @param {Point} p1 Direction point
 *
 * @param {number} d: Number - Projection distance
 */
 export function project(p0: Point, p1: Point, d: number):Point
 {
   // trig. approach vs. unit vectors
   const a: number = angle(p0, p1);

   return {x: p0.x + Math.cos(a)*d, y: p0.y + Math.sin(a)*d};
 }

/**
 * Return the index of the 'bottom left' element in an array of {Points} representing 2D coordinates
 * (this presumes a y-up coordinate system)
 *
 * @param points: Array<Point> - Point collection
 */
 export function bottomLeft(points: Array<Point>): number
 {
   let i     = 0;
   let index = 0;

   const len: number = points.length;

   let pt: Point;

   for (i = 0; i < len; ++i)
   {
     pt = points[i];

     if ( pt.y < points[index].y || (pt.y <= points[index].y && pt.x < points[index].x) ) index = i;
   }

   return index;
 }

/**
 * Return the index of the 'bottom right' element in an array of Points representing 2D coordinates
 * (this presumes a y-up coordinate system)
 *
 * @param {Array<Point>} points Point collection
 */
 export function bottomRight(points: Array<Point>): number
 {
   let i     = 0;
   let index = 0;

   const len: number = points.length;

   let pt: Point;

   for (i = 0; i < len; ++i)
   {
     pt = points[i];

     if ( pt.y < points[index].y || (pt.y <= points[index].y && pt.x > points[index].x ) ) index = i;
   }

   return index;
 }

/**
 * Return the index of the closest point from a point collection to an infinite line passing through two other points
 *
 * @param {Array<Point>} points  Point collection
 *
 * @param {Point} p0 First point on the line
 *
 * @param {Point} p1 Second point on the line
 */
 export function closestPointToLine(points: Array<Point>, p0: Point, p1: Point): number
 {
   const a: number   = p0.y - p1.y;
   const b: number   = p1.x - p0.x;
   const c: number   = p0.x * p1.y - p1.x*p0.y;
   const len: number = points.length;

   let i: number;
   let d: number;
   let p: Point;
   let minIndex    = 0;
   let min: number = Math.abs( a*points[0].x + b*points[0].y+ c );

   for (i=1; i<len; ++i)
   {
     p = points[i];
     d = Math.abs( a*p.x + b*p.y + c );

     if (d < min)
     {
       minIndex = i;
       min      = d;
     }
   }

   return minIndex;
 }

/**
 * Return the distance from a single point, {P} to the infinite line passing through two other points, {P1} and {P2}.
 *
 * @param {Point} p0 First point of line
 *
 * @param {Point} p1 Second point of line
 *
 * @param {Point} p: TSMT$Test point
 */
 export function pointToLineDistancee(p0: Point, p1: Point, p: Point): number
 {
   const vx: number = p1.x - p0.x;
   const vy: number = p1.y - p0.y;

   const wx: number = p.x - p0.x;
   const wy: number = p.y - p0.y;

   const c1: number = vx*wx + vy*wy;
   const c2: number = vx*vx + vy*vy;
   const b: number  = c1 / c2;

   const px: number = p0.x + b*vx;
   const py: number = p0.y + b*vy;

   const dx: number = p.x - px;
   const dy: number = p.y - py;

   return Math.sqrt( dx*dx + dy*dy);
 }

/**
 * Return the distance from a single point to a line segment
 *
 * @param {Point} p0 First point of line segment
 *
 * @param {Point} p1 Second point of line segment
 *
 * @param {Point} p Test point
 */
 export function pointToSegmentDist(p0: Point, p1: Point, p: Point): number
 {
   const vx: number = p1.x - p0.x;
   const vy: number = p1.y - p0.y;

   let wx: number = p.x - p0.x;
   let wy: number = p.y - p0.y;

   const c1: number = wx*vx + wy*vy;
   if (c1 <= 0) return Math.sqrt(wx * wx + wy * wy);

   const c2: number = vx*vx + vy*vy;
   if (c2 <= c1)
   {
     wx = p1.x - p.x;
     wy = p1.y - p.y;

     return Math.sqrt(wx*wx + wy*wy);
   }

   const b: number  = c1 / c2;
   const px: number = p0.x + b*vx;
   const py: number = p0.y + b*vy;
   const dx: number = p.x - px;
   const dy: number = p.y - py;

   return Math.sqrt( dx*dx + dy*dy);
 }

/**
 *
 * Return the intersection point from projecting a point onto a line
 *
 * @param {Point} p0 First point of line segment
 *
 * @param {Point} p1 Second point of line segment
 *
 * @param {Point} p Input point
 */
 export function pointSegmentProjection(p0: Point, p1: Point, p: Point): Point
 {
   const p0x: number = p0.x;
   const p0y: number = p0.y;
   const p1x: number = p1.x;
   const p1y: number = p1.y;
   let px: number    = p.x;
   let py: number    = p.y;

   const dx: number = p1x-p0x;
   const dy: number = p1y-p0y;
   const d: number  = dx*dx + dy*dy;

   if (d < 0.0000001) return {x: p0x, y: p0y};

   const t: number = ( (px-p0x)*(p1x-p0x) + (py-p0y)*(p1y-p0y) ) / d;

   if (t < 0) return {x: p0x, y: p0y};

   if (t > 1) return {x: p1x, y: p1y};

   px = (1-t)*p0x + t*p1x;
   py = (1-t)*p0y + t*p1y;

   return {x: px, y:py};
 }

/**
 * Are two points equal (within tolerance)?
 *
 * @param a First point for comparison
 *
 * @param b Second point for comparison
 */
export function areEqual(a: Point, b: Point): boolean
{
  if (Math.abs(a.x - b.x) <= 0.00001) return Math.abs(a.y - b.y) <= 0.00001;

  return false;
}

/**
 * Are the three points ordered CW (returns positive), CCW (returns negative), or co-linear (returns zero)
 *
 * @param {Point} p1 First Point
 *
 * @param {Point} p2 Second Point
 *
 * @param {Point} p3 Third Point
 */
export function orientation(p1: Point, p2: Point, p3: Point)
{
  const value: number = (p2.y - p1.y) * (p3.x - p2.x) - (p3.y - p2.y) * (p2.x - p1.x);
  return Math.abs(value) < 0.000001 ? 0 : value;
}


