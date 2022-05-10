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
 * AMYR Library: Common low-level utility methods for dealing with Circles.  Circles are a fundamental geometric entity
 * and are often used as a bounding approximation for game sprites.  This is NOT a circle class and all inputs are raw
 * values, such as center-x, center-y, and radius.  So, the utilities will work with any circle structure used in an
 * application.
 *
 * Note:  ALL angle measures are input and returned in radians.
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */

import {
  Point,
  Ranges
} from "../../../models/geometry";

import { PlanarPoint } from "../geometry/point";

/**
 * Return the area of the circle with given radius
 *
 * @param {r} Radius (must be non-negative)
 */
export function circleArea(r: number): number
{
  return isNaN(r) || r < 0 ? 0 : Math.PI*r*r;
};

/**
 * Return the circumference of the circle with given radius or zero for invalid radius
 *
 * @param {r} Radius (must be non-negative)
 */
export function circleCircumference(r: number): number
{
  const twoPI: number = Math.PI + Math.PI
  return isNaN(r) || r < 0 ? 0 : twoPI*r;
};

/**
 * Return the length of a circular arc with a given angular measure or zero for invalid input
 *
 * @param {r} Circle radius (must be non-negative)
 *
 * @param {theta} Angle in radians
 */
export function circleArcLength(r: number, t: number): number
{
  const radius: number = isNaN(r) || r < 0 ? 0 : r;
  const theta: number  = isNaN(t) ? 0 : t;

  return Math.abs(radius*theta);
};

/**
 * Compute properties of a circular segment defined by a chord a prescribed distance from the circle's center
 *
 * @param {r} Circle radius (must be non-negative)
 *
 * @param {d} Distance from chord midpoint to circle center in [0,r]
 *
 * @returns {Object} 'l' property is the chord length.  'theta' property is the central angle, and 'area' property
 * is the segment area.
 */
export function circleChordParams(radius: number, dist: number): {l: number, theta: number, area: number}
{
  const r: number = isNaN(radius) || radius < 0 ? 0.05 : radius;
  let d: number   = isNaN(dist) ? 0 : dist;

  d = Math.max(0,d);
  d = Math.min(r,d);

  const h: number     = r - d;
  const theta: number = Math.acos(d/r);
  const len: number   = 2.0*Math.sqrt(h*(2*r-h));
  const area: number  = 0.5*r*r*( theta - Math.sin(theta) );

  return { l:len, theta:theta, area:area };
};

/**
 * Compute properties of a circular sector defined by a central angle.  In the return, the {area} property is the
 * area of the sector.  The {len} property is the arc length of the sector. The {perim} property is total perimeter
 * of the sector.
 *
 * @param {r} Circle radius (must be non-negative)
 *
 * @param {theta} Central angle in radians
 */
export function circleSectorParams(radius: number, theta: number): {area: number, len: number, perim: number}
{
  const r: number   = isNaN(radius) || radius < 0 ? 0.0 : radius;
  const t: number   = isNaN(theta) ? 0 : Math.abs(theta);
  const len: number = r*t;

  return { area:0.5*r*len, len:len, perim:r*(t+2) };
};

/**
 * Compute the coordinates of a point at an angle of theta (in radians) from the specified center point
 *
 * @param {r} Circle radius (must be non-negative)
 *
 * @param {theta} Central angle in radians
 *
 * @param {xc} x-coordinate of center (converted to zero for NaN)
 *
 * @param {yc} y-coordinate of center (converted to zero for NaN)
 */
export function circleGetCoords(xc:number, yc:number, radius: number, theta: number): Point
{
  const r: number = isNaN(radius) || radius < 0 ? 0.05 : radius;
  const t: number = isNaN(theta) ? 0 : theta;
  const x: number = isNaN(xc) ? 0 : xc;
  const y: number = isNaN(yc) ? 0 : yc;

  return { x:r*Math.cos(t)+x, y:r*Math.sin(t)+y };
};

/**
 * Return the properties of the largest inscribed rectangle inside a circle; since the answer is
 * always a square, the value returned is length of one side.
 *
 * @param {r} Circle radius (must be non-negative)
 */
export function circleInscribedRectProps(radius: number): number
{
  const r: number = isNaN(radius) || radius < 0 ? 0 : radius;
  const d: number = r+r;

  return d / Math.sqrt(2);
};

/**
 * Return the properties of an equilateral triangle inscribed inside a circle of known radius
 *
 * @param {r} Circle radius (must be non-negative)
 *
 * @returns {Object} 's' is the length of any side of the triangle and 'area' is the triangle area
 */
export function circleInscribedTriangleProps(radius: number): {s: number, area: number}
{
  const r: number = isNaN(radius) || radius < 0 ? 0 : radius;
  const s: number = r*Math.sqrt(3);
  const a: number = 0.25*Math.sqrt(3)*s*s;

  return { s:s, area:a };
};

/**
 * Return the radius of the circumcircle of a triangle (circle that passes through all three vertices of the triangle)
 * given three side lengths
 *
 * @param {a} Side length 1 - must be non-negative
 *
 * @param {b} Side length 2 - must be non-negative
 *
 * @param {c} Side length 3 - must be non-negative
 */
export function triangleCircumcircle(a: number, b: number, c: number): number
{
  const _a: number = isNaN(a) || a < 0 ? 0 : a;
  const _b: number = isNaN(a) || a < 0 ? 0 : a;
  const _c: number = isNaN(a) || a < 0 ? 0 : a;

  if (_a == 0 && _b == 0 && _c == 0) {
    return 0;
  }

  return a*b*c / Math.sqrt( (a+b+c) * (b+c-a) * (c+a-b) * (a+b-c) );
};

/**
 * Return the incircle properties for a triangle ABC through points (ax,ay), (bx,by), and (cx,cy).  In the return,
 * the {r} property is radius of in-circle. The {x} and {y} properties are x-y coordinates of the circle center. The
 * {area} property is the area of the triangle and 'p' is its perimeter.  This type of operation is often performed
 * interactively, so there is no error checking for max. performance.
 *
 * @param {ax} x-coordinate of A
 *
 * @param {ay} y-coordinate of A
 *
 * @param {bx} x-coordinate of B
 *
 * @param {by} y-coordinate of B
 *
 * @param {cx} x-coordinate of C
 *
 * @param {cy} y-coordinate of C
 */
export function triangleIncircle(ax: number, ay: number, bx: number, by: number, cx: number, cy: number): {
  r: number,
  x: number,
  y: number,
  area: number,
  p: number
}
{
  // opposite side lengths
  let dx: number  = cx - bx;
  let dy: number  = cy - by;
  const a: number = Math.sqrt(dx*dx + dy*dy);

  dx              = cx - ax;
  dy              = cy - ay;
  const b: number = Math.sqrt(dx*dx + dy*dy);

  dx              = bx - ax;
  dy              = by - ay;
  const c: number = Math.sqrt(dx*dx + dy*dy);

  // perimeter
  const s = a + b + c;
  if (s < 0.00000001) return {r: 0, x: ax, y: ay, area: 0, p: 0};

  const p: number = 1.0/s;

  // incenter coordinates
  const incenterX: number = (a*ax + b*bx + c*cx) * p;
  const incenterY: number = (a*ay + b*by + c*cy) * p;

  // area - since we already have perimeter, use heron's formula
  const semi: number = 0.5*s;
  const area: number = Math.sqrt( semi*(semi-a)*(semi-b)*(semi-c) );

  // incircle radius
  const r: number = 2*area*p;

  return { r:r, x:incenterX, y:incenterY, area:area, p:s };
};

/**
 * Compute the intersection point(s) of two circles. The return array is empty if the two circles do not intersect,
 * they are coincident, or one circle is contained inside another.  No error checking is performed in order to
 * maximize performance.
 *
 * @param {number} xc1 x-coordinate of first circle center
 *
 * @param {number} yc1 y-coordinate of first circle center
 *
 * @param {number} r1 First circle radius
 *
 * @param {number} xc2 x-coordinate of second circle center
 *
 * @param {number} yc2 y-coordinate of second circle center
 *
 * @param {number} r2 Second circle radius
 */
export function circleToCircleIntersection(
  x0: number,
  y0: number,
  r0: number,
  x1: number,
  y1: number,
  r1: number): Array<{x: number, y: number}>
{
  let dx: number  = x1 - x0;                  // delta-x
  let dy: number  = y1 - y0;                  // delta-y
  const d: number = Math.sqrt(dx*dx + dy*dy); // distance between centers

  if (d > r0+r1 || d < Math.abs(r0-r1)) return new Array<{x: number, y: number}>();

  if ( Math.abs(d) < 0.001 && Math.abs(r1-r0) < 0.001) return new Array<{x: number, y: number}>();

  const r0sq: number = r0*r0;
  const a: number    = (r0sq - r1*r1 + d*d ) / (2*d);
  const h: number    = Math.sqrt( r0sq - a*a );

  // unit vector
  dx /= d;
  dy /= d;

  // points of intersection are (x3,y3) and possibly (x4,y4)
  const x2: number = x0 + a*dx;
  const y2: number = y0 + a*dy;
  const x3: number = x2 + h*dy;
  const y3: number = y2 - h*dx;

  const intersect: Array<{x: number, y: number}> = [ {x:x3, y:y3} ];
  if (d != r0 + r1)
  {
    const x4: number = x2 - h*dy;
    const y4: number = y2 + h*dx;
    intersect.push( {x:x4, y:y4} );
  }

  return intersect;
};

/**
 * Circle-Circle Intersection.  The return array is empty if the two circles do not intersect, they are coincident,
 * or one circle is contained inside another.  Unlike the GeomUtils utility, this one is more rigidly error-checked.
 *
 * @param {xc1} x-coordinate of first circle center
 *
 * @param {yc1} y-coordinate of first circle center
 *
 * @param {r1} first circle radius
 *
 * @param {xc2} x-coordinate of second circle center
 *
 * @param {yc2} y-coordinate of second circle center
 *
 * @param {r2} second circle radius
 */
export function circleCircleIntersection(
  xc1: number,
  yc1: number,
  r1: number,
  xc2: number,
  yc2: number,
  r2: number ): Array<{x: number, y: number}>
{
  if (isNaN(xc1) || !isFinite(xc1)) return new Array<{x: number, y: number}>();

  if (isNaN(yc1) || !isFinite(yc1)) return new Array<{x: number, y: number}>();

  if (isNaN(r1) || r1 <= 0) return new Array<{x: number, y: number}>();

  if (isNaN(xc2) || !isFinite(xc2)) return new Array<{x: number, y: number}>();

  if (isNaN(yc2) || !isFinite(yc2)) return new Array<{x: number, y: number}>();

  if (isNaN(r2) || r2 <= 0) return new Array<{x: number, y: number}>();

  return circleToCircleIntersection( xc1, yc1, r1, xc2, yc2, r2 );
};

/**
 * Circle-Line Segment intersection (intersection between circle and line segment passing through two points P0 and P1).
 * The return array is empty if there is no intersection.  This algorithm is commonly used in games or highly-interactive
 * applications, so there is no error-checking for performance reasons.
 *
 * @param {x1} x-coordinate of P0
 *
 * @param {y1} y-coordinate of P0
 *
 * @param {x2} x-coordinate of P1
 *
 * @param {y2} y-coordinate of P1
 *
 * @param {xc} x-coordinate of circle center
 *
 * @param {yc} y-coordinate of circle center
 */
export function circleSegmentIntersection(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  xc: number,
  yc: number,
  r: number ): Array<Point>
{
  const dx: number     = x2-x1;
  const dy: number     = y2-y1;
  const normSq: number = dx*dx + dy*dy;

  const t: number = ( (xc-x1)*(x2-x1) + (yc-y1)*(y2-y1) ) / normSq;

  // compute the coordinates of the corresponding point, E
  const ex: number = (1-t)*x1 + t*x2;
  const ey: number = (1-t)*y1 + t*y2;

  // distance from E to center
  const tx: number = ex-xc;
  const ty: number = ey-yc;
  const d: number  = Math.sqrt( tx*tx + ty*ty );

  // intersection tests
  if (Math.abs(d-r) < 0.0001)
  {
    // tangent
    return [ {x:ex, y:ey} ];
  }
  else if( d < r )
  {
    // two possible intersection points; account for IP outside line segment
    const norm: number = Math.sqrt(normSq);

    const dt: number = Math.sqrt( Math.abs(r*r - d*d) )/norm;
    const t1: number = t - dt;
    const t2: number = t + dt;

    const points = new Array<{x: number, y: number}>();

    // no restriction on t allows for extrapolation, i.e. segment is inside circle
    points.push({x: t1 * dx + x1, y: t1 * dy + y1});
    points.push({x: t2 * dx + x1, y: t2 * dy + y1});

    return points;
  }
  else
  {
    // no intersection
    return new Array<{x: number, y: number}>();
  }
};

/**
 * Compute the min/max gaps between a circle inside a larger circle. The return {min} property contains the minimum distance.
 * The {minX} property is the x-coordinate on the outer circle of that minimum point. The {minY} property contains the
 * corresponding y-coordinate. The {max} property contains the maximum distance, while {maxX} and {maxY} properties
 * contain the corresponding x- and y-coordinates. The return is {null} if any part of the inner circle is determined
 * to be outside the outer circle or inputs are otherwise invalid.
 *
 * @param {a} x-coordinate larger circle center
 *
 * @param {b} y-coordinate larger circle center
 *
 * @param {r1} larger circle radius
 *
 * @param {c} x-coordinate of smaller circle center
 *
 * @param {d} y-coordinate of smaller circle center
 *
 * @param {r2} larger circle radius
 */
export function circleGaps(a: number, b: number, r1: number, c: number, d: number, r2: number): Ranges | null
{
  if (isNaN(a) || !isFinite(a) || isNaN(b) || !isFinite(b)) return null;

  if (isNaN(c) || !isFinite(c) || isNaN(d) || !isFinite(d)) return null;

  if (r1 <= 0 || r2 <= 0 || r1 <= r2) return null;

  // take advantage of the fact that the line containing the min/max distance points will pass through both the
  // circle centers
  const outerPoints: Array<Point> = circleSegmentIntersection(a, b, c, d, a, b, r1);

  if (outerPoints.length === 0) return null;

  // same for inner circle
  const innerPoints: Array<Point> = circleSegmentIntersection(a, b, c, d, c, d, r2);

  let p: Point              = outerPoints[0];
  const outer1: PlanarPoint = new PlanarPoint(p.x, p.y);

  p                         = outerPoints[1];
  const outer2: PlanarPoint = new PlanarPoint(p.x, p.y);

  p                         = innerPoints[0];
  const inner1: PlanarPoint = new PlanarPoint(p.x, p.y);

  p                         = innerPoints[1];
  const inner2: PlanarPoint = new PlanarPoint(p.x, p.y);

  // easiest way is to check the distance combinations for min and max

  // coords of min/max dist.
  let minX: number = outer1.x;
  let minY: number = outer1.y;
  let maxX: number = outer1.x;
  let maxY: number = outer1.y;

  let dist: number    = outer1.distance(inner1);
  let minDist: number = dist;
  let maxDist: number = dist;

  dist = outer1.distance(inner2);
  if (dist < minDist)
  {
    minDist = dist;
    minX    = outer1.x;
    minY    = outer1.y;

    maxDist = outer2.distance(inner2);
    maxX    = outer2.x;
    maxY    = outer2.y;
  }

  dist = outer2.distance(inner1);
  if (dist < minDist)
  {
    minDist = dist;
    minX    = outer2.x;
    minY    = outer2.y;

    maxDist = inner2.distance(outer1);
    maxX    = outer1.x;
    maxY    = outer1.y;
  }

  dist = outer2.distance(inner2);
  if (dist < minDist)
  {
    minDist = dist;
    minX    = outer2.x;
    minY    = outer2.y;

    maxDist = inner1.distance(outer1);
    maxX    = outer1.x;
    maxY    = outer1.y;
  }

  return {min: minDist, minX: minX, minY: minY, max: maxDist, maxX: maxX, maxY: maxY};
};

/**
 * Return the tangent points to a circle from a point, P,  that is external to the circle
 *
 * @param {number} xc x-coordinate of circle center
 *
 * @param {number} yc y-coordinate of circle center
 *
 * @param {number} r circle radius
 *
 * @param {number} px x-coordinate of point
 *
 * @param {number} py - y-coordinate of point
 */
export function circleTangentsFromPoint(
  xc: number,
  yc: number,
  r: number,
  px: number,
  py: number ): Array<Point>
{
  const dx: number = px - xc;
  const dy: number = py - yc;
  const d: number  = Math.sqrt(dx*dx + dy*dy);

  if (d <= r || r <= 0) {
    return new Array<{x: number, y: number}>();
  }

  // this is actually the circle-circle intersection problem with the second circle at (px,py) and a radius of d
  return circleCircleIntersection( xc, yc, r, px, py, d );
};

/**
 * Is the specified point inside the circle with input center and radius
 *
 * @param {number} px x-coordinate of test point
 *
 * @param {number} py y-coordinate of test point
 *
 * @param {number} xc x-coordinate of circle center
 *
 * @param {number} yc y-coordinate of circle center
 *
 * @param {number} r circle radius
 *
 * @return boolean - true if the input point is strictly inside or on the boundary of the circle.  This computation
 * is often used with large numbers of bounding circles in a game, so there is no error-checking for max. performance.
 * For production, consider in-lining these computations into your application.  You break it ... you buy it.
 */
export function pointInCircle(px: number, py: number, xc: number, yc: number, r:number): boolean
{
  // since the method is expected to be run against a large number of circles and most will not pass the test,
  // the code is optimized to try and disprove inclusion as quickly as possible by testing the AABB of the circle
  // against the point
  if (py > yc+r || py < yc-r) {
    return false;
  }

  if (px > xc+r || px < xc-r) {
    return false;
  }

  const dx = px-xc;
  const dy = py-yc;

  return dx*dx + dy*dy <= r*r;
};
