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
 * AMYR Library: Common low-level utility methods for analytic geometry.  Although a PointUtils class is
 * available in the library, that class is designed to work with the Point class as a fundamental unit of coordinates.
 * Methods in this utility class use raw coordinate values and are independent from any specific point, coordinate, or
 * vector structure.
 *
 * Note that this class is intended for performance-critical environments, so error checking is at a minimum.
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */

import {
  DirEnum,
  IntersectionPoints,
  Point,
  Projection,
  ProjectFromTo,
  Rect,
  SegmentIntersection,
  ZERO_TOL
} from "../../../models/geometry";

import { compareNumbers } from "./approx-equal";

/**
 * Is the point, (x1,y1) strictly inside bounding box specified by the rectangle (left,top) to (right,bottom)?  The
 * method takes y-up and y-down axis orientations into account.
 *
 * @param {number} x1 x-coordinate of test point
 *
 * @param {number} y1 y-coordinate of test point
 *
 * @param {number} left x-coordinate of upper, left-hand corner of bounding box
 *
 * @param {number} top y-coordinate of upper, left-hand corner of bounding box
 *
 * @param {number} right x-coordinate or lower, right-hand corner of bounding box
 *
 * @param {number} botton y-coordinate of lower, right-hand corner of bounding box
 */
 export function insideBox(
   x1: number,
   y1: number,
   left: number,
   top: number,
   right: number,
   bottom: number
 ): boolean
 {
   const yDown: boolean = bottom > top;
   if (yDown)
   {
     return x1 > left && x1 < right && y1 > top && y1 < bottom;
   }
   else
   {
     return x1 > left && x1 < right && y1 < top && y1 > bottom;
   }
 }

  /**
   * Do two axis-aligned bounding boxes intersect? A single point of contact is considered an intersection.
   *
   * @param {Rect} bound1 Bounding-box object with left, top, right, and bottom properties for top-left point and bottom-right point
   *
   * @param {Rect} bound2 Bounding-box object with left, top, right, and bottom properties for top-left point and bottom-right point
   */
   export function boxesIntersect(bound1: Rect, bound2: Rect): boolean
   {
     // for a y-down coordinate system, bottom > top - reverse internally and copy to temp variables so that all
     // computations are y-up.
     const bound1Left:number   = bound1.left;
     const bound1Right:number  = bound1.right;
     const bound1Top:number    = bound1.top;
     const bound1Bottom:number = bound1.bottom;

     const bound2Left:number   = bound2.left;
     const bound2Right:number  = bound2.right;
     const bound2Top:number    = bound2.top;
     const bound2Bottom:number = bound2.bottom;

     const l1: number = bound1Left;
     const r1: number = bound1Right;
     const t1: number = bound1Top > bound1Bottom ? bound1Top : bound1Bottom;
     const b1: number = bound1Top > bound1Bottom ? bound1Bottom : bound1Top;

     const l2: number = bound2Left;
     const r2: number = bound2Right;
     const t2: number = bound2Top > bound2Bottom ? bound2Top : bound2Bottom;
     const b2: number = bound2Top > bound2Bottom ? bound2Bottom : bound2Top;

     if (l2 > r1)
       return false;
     else if (r2 < l1)
       return false;
     else if (t2 < b1)
       return false;
     else if (t1 < b2)
       return false;
     else if (r2 >= l1 && l2 <= r1)
       return t2 >= b1 && b2 <= t1;

     return false;
   }

  /**
   * Is the specified point (x1,y1) to the left, on, or to the right of the line specified by two input points
   * (x2,y2) - (x3,y3).  Returns One of the codes {DirEnum.LEFT}, {DirEnum.RIGHT}, or {DirEnum.ON} if the point is to
   * the left, right, or on the line, respectively.  Test for point exactly on the line is made first and within a
   * tight tolerance to accommodate for roundoff error.
   *
   * @param {number} x1 x-coordinate of first point on line
   *
   * @param {number} y1 y-coordinate of first point on line
   *
   * @param {number} x2 x-coordinate of second point on line
   *
   * @param {number} y2 y-coordinate of second point on line
   *
   * @param {number} x x-coordinate of test point
   *
   * @param {number} y -coordinate of test point
   */
   export function pointOrientation(
     x1: number,
     y1: number,
     x2: number,
     y2: number,
     x: number,
     y: number
   ): number
   {
     const test: number = ( (x2 - x1)*(y - y1) - (x - x1)*(y2 - y1) );

     if (Math.abs(test) < 0.0001)
     {
       // on the line withing tolerance suitable for typical online drawing environment
       return DirEnum.ON;
     }
     else
     {
       return test > 0 ? DirEnum.LEFT : DirEnum.RIGHT;
     }
   }

  /**
   * Does the line segment from (x1,y1) to (x2,y2) intersect the bounding-box specified by the rectangle (left,top)
   * to (right,bottom)?
   *
   * @param {number} x1 x-coordinate of test point
   *
   * @param {number} y1 y-coordinate of test point
   *
   * @param {number} left x-coordinate of upper, left-hand corner of bounding box
   *
   * @param {number} top y-coordinate of upper, left-hand corner of bounding box
   *
   * @param {number} right x-coordinate or lower, right-hand corner of bounding box
   *
   * @param {number} botton y-coordinate of lower, right-hand corner of bounding box
   */
   export function intersectBox(
     x1: number,
     y1: number,
     x2: number,
     y2: number,
     left: number,
     top: number,
     right: number,
     bottom: number
   ): boolean
   {
     const yDown: boolean = bottom > top;

     // test if segment is completely outside
     if ((x1 < left && x2 < left) || (x1 > right && x2 > right)) return false;

     // y-down
     if( yDown )
     {
       if ((y1 < top && y2 < top) || (y1 > bottom && y2 > bottom)) return false;
     }
     else
     {
       if ((y1 < bottom && y2 < bottom) || (y1 > top && y2 > top)) return false;
     }

     // test intersection with each segment of bounding-box
     if (segmentsIntersect(x1, y1, x2, y2, left, top, right, top)) return true;

     if (segmentsIntersect(x1, y1, x2, y2, right, top, right, bottom)) return true;

     if (segmentsIntersect(x1, y1, x2, y2, right, bottom, left, bottom)) return true;

     if (segmentsIntersect(x1, y1, x2, y2, left, bottom, left, top)) return true;

     return false;
   }

  /**
   * Return the two points of intersection between the line segment from (x1,y1) to (x2,y2) and the rectangle
   * (left,top) to (right,bottom) - this is intended for use after an intersection test as it is optimized for
   * the case where intersection is known to already exist.
   *
   * @param {number} x1 x-coordinate of test point
   *
   * @param {number} y1 y-coordinate of test point
   *
   * @param {number} left x-coordinate of upper, left-hand corner of bounding box
   *
   * @param {number} top y-coordinate of upper, left-hand corner of bounding box
   *
   * @param {number} right x-coordinate or lower, right-hand corner of bounding box
   *
   * @param {number} botton y-coordinate of lower, right-hand corner of bounding box
   */
   export function lineRectIntersection(
     x1: number,
     y1: number,
     x2: number,
     y2: number,
     left: number,
     top: number,
     right: number,
     bottom: number
   ): IntersectionPoints
   {
     // count number of intersections
     let count = 0;
     let intersection: SegmentIntersection = segmentsIntersect(x1, y1, x2, y2, left, top, right, top);
     if (intersection.intersects)
     {
       x1 = (1-intersection.t)*x1 + intersection.t*x2;
       y1 = (1-intersection.t)*y1 + intersection.t*y2;
       count++;
     }

     intersection = segmentsIntersect(x1, y1, x2, y2, right, top, right, bottom)
     if (intersection.intersects)
     {
       if (count === 0)
       {
         x1 = (1-intersection.t)*x1 + intersection.t*x2;
         y1 = (1-intersection.t)*y1 + intersection.t*y2;
       }
       else
       {
         x2 = (1-intersection.t)*x1 + intersection.t*x2;
         y2 = (1-intersection.t)*y1 + intersection.t*y2;
       }
       count++;
     }

     if (count < 2)
     {
       intersection = segmentsIntersect(x1, y1, x2, y2, right, bottom, left, bottom)
       if (intersection.intersects)
       {
         if (count === 0)
         {
           x1 = (1-intersection.t)*x1 + intersection.t*x2;
           y1 = (1-intersection.t)*y1 + intersection.t*y2;
         }
         else
         {
           x2 = (1-intersection.t)*x1 + intersection.t*x2;
           y2 = (1-intersection.t)*y1 + intersection.t*y2;
         }
         count++;
       }
     }

     if (count < 3)
     {
       intersection = segmentsIntersect(x1, y1, x2, y2, left, bottom, left, top)
       if (intersection.intersects)
       {
         if (count === 0)
         {
           x1 = (1-intersection.t)*x1 + intersection.t*x2;
           y1 = (1-intersection.t)*y1 + intersection.t*y2;
         }
         else
         {
           x2 = (1-intersection.t)*x1 + intersection.t*x2;
           y2 = (1-intersection.t)*y1 + intersection.t*y2;
         }
       }
     }

     if (x1 === undefined || x2 === undefined) {
       return {first: {x: Number.NaN, y: Number.NaN}, second: {x: Number.NaN, y: Number.NaN}};
     }

     if (x1 > x2)
       return {first: {x: x2, y: y2}, second:{x: x1, y: y1}};
     else
       return {first: {x: x1, y: y1}, second:{x: x2, y: y2}};
   }

  /**
   * Are the two points, (x1,y1) and (x2, y2) equal (to within a tolerance)?
   *
   * @param {number} x1 x-coordinate of first point
   *
   * @param {number} y1 y-coordinate of first point
   *
   * @param {number} x2 x-coordinate of second point
   *
   * @param {number} y2 y-coordinate of second point
   */
   export function pointsEqual(x1: number, y1: number, x2: number, y2: number): boolean
   {
     // todo allow tolerance to be an argument with 0.001 as a default
	   return ( compareNumbers(x1, x2, 0.001) && compareNumbers(y1, y2, 0.001) );
   }

  /**
   * Do two lines defined by the points (x1,y1) - (x2,y2) and (x3,y3) - (x4,y4) intersect?
   *
   * @param {number} x1 x-coordinate of initial point of first vector
   *
   * @param {number} y1 y-coordinate of initial point of first vector
   *
   * @param {number} x2 x-coordinate of terminal point of first vector
   *
   * @param {number} y2 y-coordinate of terminal point of first vector
   *
   * @param {number} x1 x-coordinate of initial point of first vector
   *
   * @param {number} y1 y-coordinate of initial point of first vector
   *
   * @param {number} x2 x-coordinate of terminal point of first vector
   *
   * @param {number} y2 y-coordinate of terminal point of first vector
   */
   export function linesIntersect(
     x1: number,
     y1: number,
     x2: number,
     y2: number,
     x3: number,
     y3: number,
     x4: number,
     y4: number
   ): boolean
   {
	   // coincident endpoints?
	   if (pointsEqual(x1, y1, x3, y3)) return true;

	   if (pointsEqual(x1, y1, x4, y4)) return true;

	   if (pointsEqual(x2, y2, x3, y3)) return true;

	   if (pointsEqual(x2, y2, x4, y4)) return true;

	   // have to do it the hard way
	   let m1: number      = x2 - x1;
	   let m2: number      = x4 - x3;
	   const inf1: boolean = Math.abs(m1) < 0.00000001;
	   const inf2: boolean = Math.abs(m2) < 0.00000001;

	   m1 = inf1 ? m1 : (y2-y1) / m1;
	   m2 = inf2 ? m2 : (y4-y3) / m2;

	   if (inf1)
       return !inf2;
     else if (inf2)
       return true;
	   else
     {
       // must do a compare (equivalent slopes ==> parallel lines)
       return !compareNumbers(m1, m2, 0.001);
     }
   }

  /**
   * Do two line segments from points (x1,y1) - (x2,y2) and (x3,y3) - (x4,y4) intersect?
   *
   * @param {number} x1 x-coordinate of initial point of first segment
   *
   * @param {number} y1 y-coordinate of initial point of first segment
   *
   * @param {number} x2 x-coordinate of terminal point of first segment
   *
   * @param {number} y2 y-coordinate of terminal point of first segment
   *
   * @param {number} x1 x-coordinate of initial point of second segment
   *
   * @param {number} y1 y-coordinate of initial point of second segment
   *
   * @param {number} x2 x-coordinate of terminal point of second segment
   *
   * @param {number} y2 y-coordinate of terminal point of second segment
   *
   * @returns {boolean} True if the two lines intersect. A full intersection test is performed - check bounding boxes of
   * the segments in advance if you expect a large number of tests with no possible intersection based on segments
   * completely to the left/right or top/bottom relative to one another.
   */
   export function segmentsIntersect(
     px: number,
     py: number,
     p2x: number,
     p2y: number,
     qx: number,
     qy: number,
     q2x: number,
     q2y: number
   ): SegmentIntersection
   {
     // Astute readers will recognize this as a 2D implementation of the Graphic Gems algorithm by Goldman.
     // There is really nothing new under the sun :)
     const rx: number = p2x - px;
     const ry: number = p2y - py;
     const sx: number = q2x - qx;
     const sy: number = q2y - qy;

     const tx: number = qx - px;
     const ty: number = qy - py;

     const num: number = cross(tx, ty, rx, ry);
     const den: number = cross(rx, ry, sx, sy);

     // co-linear test
     if (Math.abs(num) < 0.00000001 && Math.abs(den) < 0.00000001)
     {
       // intersecting points
       if (pointsEqual(px, py, qx, qy) ||
           pointsEqual(px, py, q2x, q2y) ||
           pointsEqual(p2x, p2y, qx, qy) ||
           pointsEqual(p2x, p2y, q2x, q2y)) {
         return {intersects: true, t: 0, u: 0};
       }

       // overlap?
       const overlap: boolean = ( (qx - px < 0) != (qx - p2x < 0) ) || ( (qy - py < 0) != (qy - p2y < 0) );
       return {intersects: overlap, t: 0, u: 0};
     }

     // parallel segments?
     if (Math.abs(den) < 0.00000001) return {intersects: false, t: 0, u: 0};

     const u: number           = num/den;
     const t: number           = cross(tx, ty, sx, sy) / den;
     const intersects: boolean = (t >= 0) && (t <= 1) && (u >= 0) && (u <= 1);

     return {intersects, t, u};
   }

  /**
   * Intersection point of infinite lines between two segments.  This is NOT a general-purpose line-intersection method.
   * It is intended to be a fast algorithm for well-posed data, i.e. segments are not co-linear or overlapping, and point
   * data is well-defined.  There are no tests for bad data or outlier conditions.
   *
   * @param {number} x1 x-coordinate of initial point of first segment
   *
   * @param {number} y1 y-coordinate of initial point of first segment
   *
   * @param {number} x2 x-coordinate of terminal point of first segment
   *
   * @param {number} y2 y-coordinate of terminal point of first segment
   *
   * @param {number} x1 x-coordinate of initial point of second segment
   *
   * @param {number} y1 y-coordinate of initial point of second segment
   *
   * @param {number} x2 x-coordinate of terminal point of second segment
   *
   * @param {number} y2 y-coordinate of terminal point of second segment
   */
   export function lineIntersection(
     px: number,
     py: number,
     p2x: number,
     p2y: number,
     qx: number,
     qy: number,
     q2x: number,
     q2y: number
   ): Point
   {
     const rx: number = p2x - px;
     const ry: number = p2y - py;
     const sx: number = q2x - qx;
     const sy: number = q2y - qy;

     const tx: number = qx - px;
     const ty: number = qy - py;

     const den: number = cross(rx, ry, sx, sy);
     const t: number   = cross(tx, ty, sx, sy) / den;
     const t1: number  = 1 - t;

     return {x:t1*px + t*p2x, y:t1*py + t*p2y};
   }

  /**
   * Compute cross-product between two vectors, both based at the origin and with terminal points P1 and P2
   *
   * @param {number} p1x x-coordinate of P1
   *
   * @param {number} p1y y-coordinate of P1
   *
   * @param {number} p2x x-coordinate of P2
   *
   * @param {number} p2y y-coordinate of P2
   */
   export function cross(p1x: number, p1y: number, p2x: number, p2y: number): number
   {
     return p1x*p2y - p1y*p2x;
   }

  /**
   * Compute the interior angle given three points, (x1,y1), (x2,y2), and (x3,y3) - (x2,y2) is the interior point.
   * The angle measure can be returned in degrees or radians
   *
   * @param {number} x1 x-coordinate of first point (x1,y1)
   *
   * @param {number} y1 y-coordinate of first point (x1,y1)
   *
   * @param {number} x2 x-coordinate of second point (x2,y2)
   *
   * @param {number} y2 y-coordinate of second point (x2,y2)
   *
   * @param {number} x3 x-coordinate of third point (x3,y3)
   *
   * @param {number} y3 y-coordinate of third point (x3,y3)
   *
   * @param {boolean} toDegrees {true} if result is returned in degrees
   * @default {false}
   *
   */
   export function interiorAngle(
     x1: number,
     y1: number,
     x2: number,
     y2: number,
     x3: number,
     y3: number,
     toDegrees: boolean=false
   ): number
   {
     const v1x: number = x1 - x2;
     const v1y: number = y1 - y2;
     const v2x: number = x3 - x2;
     const v2y: number = y3 - y2;

     const v1 = Math.sqrt(v1x*v1x + v1y*v1y);
     const v2 = Math.sqrt(v2x*v2x + v2y*v2y);

     const innerProd = v1x*v2x + v1y*v2y;

     if (v1 <= 0.0000001 || v2 <= 0.0000001)
     {
       // that was easy ...
       return 0;
     }
     else
     {
       // TODO - very small magnitudes could cause numerical issues
       const result:number = Math.acos( innerProd/(v1*v2) );

       return toDegrees ? result*(180/3.14159265359) : result;
     }
   }

  /**
   * Is a sequence of points, P0, P1, P2 in clockwise or counter-clockwise order?  Returns {true} if the point sequence
   * is in CW order, false if CCW
   *
   * @param {number} x0 x-coordinate of P0
   * @param {number} y0 y-coordinate of P0
   *
   * @param {number} x1 x-coordinate of P1
   * @param {number} y1 y-coordinate of P1
   *
   * @param {number} x2 x-coordinate of P2
   * @param {number} y2 y-coordinate of P2
   */
   export function isClockwise(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number): boolean
   {
     return !( (y2-y0)*(x1-x0) > (y1-y0)*(x2-x0) );
   }

  /**
   * Is an input point (rx,ry) anywhere on the line between two other points (px, py) and (qx, qy).  Returns {true}
   * if the input point is numerically 'close enough' to be considered on the line passing through the two other points.
   * The test is designed for computer-based games and is performed very fast and without error checking.  It also has a
   * possible loss of significance if dealing with very close points of very small magnitude.
   *
   * @param {number} rx x-coordinate of test point
   *
   * @param {number} ry y-coordinate of test point
   *
   * @param {number} px x-coordinate of first point on line
   *
   * @param {number} py y-coordinate of first point on line
   *
   * @param {number} qx x-coordinate of second point on line
   *
   * @param {number} qy y-coordinate of second point on line
   */
   export function pointOnLine(rx: number, ry: number, px: number, py: number, qx: number, qy: number): boolean
   {
     // test for small determinant where 'small' is based on pixel values typical in browser and mobile applications
     const det = (qx - px)*(ry - py) - (qy - py)*(rx - px);

     return Math.abs(det) < 0.001;
   }

  /**
   * Return the area of a triangle, given the three vertices.  This is a suitably popular geometric shape whose area is
   * often needed to be computed very fast in games or other online applications, so it is supplied as a separate utility.
   * Inline the code into an app. for best performance.
   *
   * @param {number} x1 x-coordinate of first vertex
   *
   * @param {number} y1 y-coordinate of first vertex
   *
   * @param {number} x2 x-coordinate of second vertex
   *
   * @param {number} y2 y-coordinate of second vertex
   *
   * @param {number} x3 x-coordinate of third vertex
   *
   * @param {number} y3 y-coordinate of third vertex
   */
   export function triangleArea(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): number
   {
     const a = x1*(y2-y3) + x2*(y3-y1) + x3*(y1-y2);

     return 0.5*Math.abs(a);
   }

  /**
   * Return the distance from a single point, P, to a line segment passing through P0 and P1
   *
   * @param {number} p0x x-coordinate of P0
   * @param {number} p0y y-coordinate of P0
   *
   * @param {number} p1x x-coordinate of P1
   * @param {number} p1y y-coordinate of P1
   *
   * @param {number} px x-coordinate of P
   * @param {number} py y-coordinate of P
   */
   export function pointToSegmentDistance(
     p0x: number,
     p0y: number,
     p1x: number,
     p1y: number,
     px: number,
     py: number
   ): number
   {
     const vx: number = p1x - p0x;
     const vy: number = p1y - p0y;

     let wx: number = px - p0x;
     let wy: number = py - p0y;

     const c1: number = wx*vx + wy*vy;
     if (c1 <= 0) return Math.sqrt(wx * wx + wy * wy);

     const c2: number = vx*vx + vy*vy;
     if (c2 <= c1)
     {
       wx = p1x - px;
       wy = p1y - py;

       return Math.sqrt(wx*wx + wy*wy);
     }

     const b: number  = c1 / c2;
     const tx: number = p0x + b*vx;
     const ty: number = p0y + b*vy;
     const dx: number = px - tx;
     const dy: number = py - ty;

     return Math.sqrt( dx*dx + dy*dy);
   }

  /**
   * Return the point from projecting a single point, P, to a line segment passing through P0 and P1
   *
   * @param {number} p0x x-coordinate of P0
   * @param {number} p0y y-coordinate of P0
   *
   * @param {number} p1x x-coordinate of P1
   * @param {number} p1y y-coordinate of P1
   *
   * @param {number} px x-coordinate of P
   * @param {number} py y-coordinate of P
   */
   export function projectToSegment(
     p0x: number,
     p0y: number,
     p1x: number,
     p1y: number,
     px: number,
     py: number
   ): Projection
   {
     let dx: number     = p1x-p0x;
     let dy: number     = p1y-p0y;
     const norm: number = dx*dx + dy*dy;

     if (norm < ZERO_TOL) return {x: p0x, y: p0y, d: 0};

     let vx: number;
     let vy: number;

     const t: number = ( (px-p0x)*(p1x-p0x) + (py-p0y)*(p1y-p0y) ) / norm;

     if (t <= 0)
     {
       vx = p0x;
       vy = p0y;
     }
     else if (t >= 1)
     {
       vx = p1x;
       vy = p1y;
     }
     else
     {
       vx = p0x+t*dx
       vy = p0y+t*dy;
     }

     // distance to projected point
     dx = vx-px;
     dy = vy-py;
     const d: number  = Math.sqrt(dx*dx + dy*dy);

     return { x:vx, y:vy, d: d };
   }

  /**
   * Reflect a point cloud about a line passing through P0 and P1.  Returns the reflected point cloud, provided that the
   * line segment is (numerically) distinct; otherwise, the original array is returned.
   *
   * @param {Array<Point>} points Array of input points to be reflected
   *
   * @param {number} x0 x-coordinate of P0
   *
   * @param {number} y0 y-coordinate of P0
   *
   * @param {number} x1 x-coordinate of P1
   *
   * @param {number} y1 y-coordinate of P1
   */
   export function reflect( points: Array<Point>, x0: number, y0: number, x1: number, y1: number ): Array<Point>
   {
     let p1x: number;
     let p1y: number;

     let dx: number  = x1 - x0;
     let dy: number  = y1 - y0;
     const d: number = dx*dx + dy*dy;

     if (Math.abs(d) < ZERO_TOL)
     {
       // there is no line to reflect about, so the transformation defaults to an indentity
       return points;
     }

     const len: number = points.length;
     if (len === 0)
     {
       // no points to process
       return points;
     }

     const a: number = (dx*dx - dy*dy) / d;
     const b: number = 2*dx*dy / d;

     let i: number;
     let p: Point;

     const reflect: Array<Point> = new Array<Point>();

     for (i = 0; i < len; ++i)
     {
       p   = points[i];
       dx  = p.x - x0;
       dy  = p.y - y0;
       p1x = (a*dx + b*dy + x0);
       p1y = (b*dx - a*dy + y0);

       reflect.push( {x:p1x, y:p1y} );
     }

     return reflect;
   }
