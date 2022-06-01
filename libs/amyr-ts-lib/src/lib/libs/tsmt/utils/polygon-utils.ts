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
 * AMYR Library: Some utilities for dealing with Polygons (coordinate convention is y-up)
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */

import {
  NEWS,
  Point,
  Rect,
  Projection,
  ProjectFromTo
} from "../../../models/geometry";

import * as pointUtils from './point-utils';
import { Polygon } from '../geometry/polygon';

import * as geomUtils from './geom-utils';

 export class PolygonUtils
 {
   // cache reference to inner/outer polygon x- and y-coordinates
   protected _xi: Array<number>;
   protected _yi: Array<number>;
   protected _xo: Array<number>;
   protected _yo: Array<number>;

   constructor()
   {
     this._xi = [];
     this._yi = [];
     this._xo = [];
     this._yo = [];
   }

  /**
   * Compute a pair of tangent points from an arbitrary polygon (which may not be convex) to an input point.
   * Often used for rough line-of-sight or shooting computations in games.  Return {Array} contains the indices of
   * the leftmost and rightmost tangent point on the polygon.  Returns [0,0] if there are less than three points in
   * the polygon. Note that faster algorithms exist if the polygon is known to be convex in advance.  Results will not
   * be reliable if the test point is inside the polygon and no error check is made for that condition.
   *
   * @param {Polygon} poylygon Input {Polygon} (must have at least three vertices)
   *
   * @param {Point} p Input Point - MUST BE EXTERIOR TO THE POLYGON
   *
   * Credit: geomalgorithms.com
   */
   public tangents(polygon: Polygon, p: Point): Array<number>
   {
     const n = polygon.vertexCount;
     if (n < 3) return [0, 0];

     let i: number;
     let ePrev = false;
     let eNext = false;
     let rTan  = 0;
     let lTan  = 0;

     const xcoord: Array<number> = polygon.xcoordinates;
     const ycoord: Array<number> = polygon.ycoordinates;

     // vertex list as a sequence of Point structures
     const vertices: Array<Point> = new Array<Point>();

     for (i = 0; i < n; ++i) {
       vertices.push({x: xcoord[i], y: ycoord[i]});
     }

     // polygon closure
     vertices.push({x: xcoord[0], y: ycoord[0]});

     ePrev = pointUtils.isLeft( vertices[0], vertices[1], p );
     for (i = 1; i < n; ++i)
     {
       eNext = pointUtils.isLeft(vertices[i], vertices[i+1], p);

       if (!ePrev && eNext)
       {
         if (!this.__below(p, vertices[i], vertices[rTan])) rTan = i;
       }
       else if (ePrev && !eNext)
       {
         if (!this.__above(p, vertices[i], vertices[lTan])) lTan = i;
       }

       ePrev = eNext;
     }

     return [ lTan, rTan ];
   }

  /**
   * Do two polygons intersect?  The algorithm is suitable for online applications where the polygons have at most a
   * few hundred vertices.
   *
   * @param {Polygon} poly1 First polygon
   *
   * @param {Polygon} poly2 Second polygon
   *
   * @param {boolean} yDown {true} if the coordinate system is y-down
   * @default {false};
   */
   public intersect( poly1: Polygon, poly2: Polygon, yDown: boolean=false ): boolean
   {
     // outlier cases
     const n1 = poly1.vertexCount;
     const n2 = poly2.vertexCount;

     if (n1 == 0 || n2 == 0) return false;

     const xc1: Array<number> = poly1.xcoordinates;
     const yc1: Array<number> = poly1.ycoordinates;
     const xc2: Array<number> = poly2.xcoordinates;
     const yc2: Array<number> = poly2.ycoordinates;

     if (n1 == 1 || n2 == 1) {
       return Math.abs(xc1[0] - xc2[0]) < 0.0001 && Math.abs(yc1[0] - yc2[0]) < 0.0001;
     }

     // simplest test is to see if the bounding boxes intersect - if not, then the polygons can not intersect
     const bound1: Rect = poly1.getBoundingBox(yDown);
     const bound2: Rect = poly2.getBoundingBox(yDown);

     if (!geomUtils.boxesIntersect(bound1, bound2)) return false;

     // now we have to do it the hard way.  preface segment-segment intersection to return a quick false if there is
     // no intersection based on bounding-box of the segments, so it's a very fast test to eliminate what are often a
     // large set of non-intersections.  For this version, intended for online use, test each segment (edge) in one
     // polygon vs. the other.  As soon as an intersection is found, the method breaks and returns true.

     let i: number;
     let j: number;
     let intersect: boolean;
     let p1x: number
     let p1y: number;
     let p2x: number;
     let p2y: number;
     let q1x: number;
     let q1y: number;
     let q2x: number;
     let q2y: number;
     let minX1: number;
     let minY1: number;
     let minX2: number;
     let minY2: number;
     let maxX1: number;
     let maxY1: number;
     let maxX2: number;
     let maxY2: number;

     let bailout = false;

     // poly1
     for (i = 0; i < n1; ++i)
     {
       p1x = xc1[i];
       p1y = yc1[i];
       q1x = i == n1-1 ? xc1[0] : xc1[i+1];
       q1y = i == n1-1 ? yc1[0] : yc1[i+1];

       minX1 = Math.min(p1x, q1x);
       minY1 = Math.min(p1y, q1y);
       maxX1 = Math.max(p1x, q1x);
       maxY1 = Math.max(p1y, q1y);

       // poly2
       for (j = 0; j < n2; ++j)
       {
         p2x = xc2[j];
         p2y = yc2[j];
         q2x = j == n2-1 ? xc2[0] : xc2[j+1];
         q2y = j == n2-1 ? xc2[0] : yc2[j+1];

         minX2 = Math.min(p2x, q2x);
         minY2 = Math.min(p2y, q2y);
         maxX2 = Math.max(p2x, q2x);
         maxY2 = Math.max(p2y, q2y);

         // quick non-intersection test
         bailout = false;
         if (yDown)
         {
           if (maxY1 < minY2 || minY1 > maxY2) bailout = true;

           if (maxX1 < minX2 || minX1 > maxX2) bailout = true;
         }
         else
         {
           if (minY1 > maxY2 || maxY1 < minY2) bailout = true;

           if (minX1 > maxX2 || maxX1 < minX2) bailout = true;
         }

         // full segment intersection
         if (!bailout)
         {
           if (geomUtils.segmentsIntersect(p1x, p1y, q1x, q1y, p2x, p2y, q2x, q2y)) {
             return true;
           }
         }
       }
     }

     return false;
   }

   /**
    * Compute NEWS separations for an inner polygon, entirely contained inside an outer polygon.  The inner polygon is
    * presumed to be entirely contained inside the outer polygon; no test is made for this condition.  If vertices are
    * y-down, then reverse the meaning of {N} and {S} in the returned separations.
    *
    * @param {Polygon} inner Reference to inner polygon (should be closed)
    *
    * @param {Polygon} outer Reference to outer polygon (should be closed)
    */
   public separations(inner: Polygon, outer: Polygon): NEWS | null
   {
     if (!inner || !outer) return null;

     const result: NEWS = {
       n: 0,
       e: 0,
       w: 0,
       s: 0,
       n1: {x: 0, y: 0},
       n2: {x: 0, y: 0},
       e1: {x: 0, y: 0},
       e2: {x: 0, y: 0},
       w1: {x: 0, y: 0},
       w2: {x: 0, y: 0},
       s1: {x: 0, y: 0},
       s2: {x: 0, y: 0}
     };

     // for now, inner is presumed entirely inside of outer - no test is made for this condition.  The algorithm is
     // suitable for utils use in interactive applications and is O(E*log(E)) where E is the maximum number of edges
     // in both polygons.

     // West separation
     let x: Array<number> = inner.xcoordinates;
     let y: Array<number> = inner.ycoordinates;
     let n: number        = x.length;
     let i: number;

     let minXInner: number = x[0];
     let maxXInner: number = x[0];
     let minYInner: number = y[0];
     let maxYInner: number = y[0];

     for (i = 1; i < n; ++i)
     {
       minXInner = Math.min(minXInner, x[i]);
       maxXInner = Math.max(maxXInner, x[i]);
       minYInner = Math.min(minYInner, y[i]);
       maxYInner = Math.max(maxYInner, y[i]);
     }

     x = outer.xcoordinates;
     y = outer.ycoordinates;
     n = x.length;

     let minXOuter: number = x[0];
     let maxXOuter: number = x[0];
     let minYOuter: number = y[0];
     let maxYOuter: number = y[0];

     for (i = 1; i < n; ++i)
     {
       minXOuter = Math.min(minXOuter, x[i]);
       maxXOuter = Math.max(maxXOuter, x[i]);
       minYOuter = Math.min(minYOuter, y[i]);
       maxYOuter = Math.max(maxYOuter, y[i]);
     }

     // left-most inner edge
     let leftInnerX1 = 0;
     let leftInnerY1 = 0;
     let leftInnerX2 = 0;
     let leftInnerY2 = 0;

     x = inner.xcoordinates;
     y = inner.ycoordinates;
     n = x.length;

     for (i = 0; i < n-1; ++i)
     {
       if (x[i] <= minXInner)
       {
         leftInnerX1 = x[i];
         leftInnerY1 = y[i];
         leftInnerX2 = x[i+1];
         leftInnerY2 = y[i+1];

         break;
       }
     }

     // right-most inner edge
     let rightInnerX1 = 0;
     let rightInnerY1 = 0;
     let rightInnerX2 = 0;
     let rightInnerY2 = 0;

     for (i = 0; i < n-1; ++i)
     {
       if (x[i] == maxXInner)
       {
         rightInnerX1 = x[i];
         rightInnerY1 = y[i];
         rightInnerX2 = x[i+1];
         rightInnerY2 = y[i+1];

         break;
       }
     }

     // top-most inner edge
     let topInnerX1 = 0;
     let topInnerY1 = 0;
     let topInnerX2 = 0;
     let topInnerY2 = 0;

     // bottom-most inner edge
     let bottomInnerX1 = 0;
     let bottomInnerY1 = 0;
     let bottomInnerX2 = 0;
     let bottomInnerY2 = 0;

     for (i = 0; i < n-1; ++i)
     {
       if (y[i] <= minYInner)
       {
         bottomInnerX1 = x[i];
         bottomInnerY1 = y[i];
         bottomInnerX2 = x[i+1];
         bottomInnerY2 = y[i+1];

         break;
       }
     }

     for (i = 0; i < n-1; ++i)
     {
       if (y[i] === maxYInner)
       {
         topInnerX1 = x[i];
         topInnerY1 = y[i];
         topInnerX2 = x[i+1];
         topInnerY2 = y[i+1];

         break;
       }
     }

     // ----- NEWS computations

     x = outer.xcoordinates;
     y = outer.ycoordinates;
     n = x.length;

     let d: number = Number.MAX_VALUE;

     let d1: number, d2: number;
     let p1x: number, p1y: number, p2x: number, p2y: number;

     // West - for each outer edge that is not horizontal and whose first vertex x-coordinate is less than leftInnerX1 - this will
     // eliminate most edges
     for (i = 0; i < n-1; ++i)
     {
       if ( x[i] < leftInnerX1 && this.__isVertValid(leftInnerY1, leftInnerY2, y[i], y[i+1]) )
       {
         p1x = this.__xAtY(x[i], y[i], x[i+1], y[i+1], leftInnerY1);
         p2x = this.__xAtY(x[i], y[i], x[i+1], y[i+1], leftInnerY1);
         d1  = leftInnerX1 - p1x;
         d2  = leftInnerX2 - p2x;

         if ( (d1 >= 0 && d1 < d) || (d2 >= 0 && d2 < d) )
         {
           // new min-distance
           d = Math.min(d1, d2);

           if (d1 < d2)
           {
             // first point wins
             result.w    = d1;
             result.w1.x = leftInnerX1;
             result.w1.y = leftInnerY1;
             result.w2.x = p1x;
             result.w2.y = leftInnerY2;
           }
           else if (Math.abs(d1 - d2) < 0.00001)
           {
             // points are co-linear (two vertical line segments)
             p1y = 0.5 * leftInnerY1 + 0.5 * leftInnerY2;

             result.w    = d1;
             result.w1.x = leftInnerX1;
             result.w1.y = p1y;
             result.w2.x = p1x;
             result.w2.y = p1y;
           }
           else
           {
             // second point wins
             result.w    = d2;
             result.w1.x = leftInnerX2;
             result.w1.y = leftInnerY2;
             result.w2.x = p1x;
             result.w2.y = leftInnerY2;
           }
         }
       }
     }

     // East separation - for every vertex whose x-value is greater than or equal to maxXInner and not horizontal
     d = Number.MAX_VALUE;

     for (i = 0; i < n-1; ++i)
     {
       if ( x[i] >= rightInnerX1 && this.__isVertValid(rightInnerY1, rightInnerY2, y[i], y[i+1]) )
       {
         p1x = this.__xAtY(x[i], y[i], x[i+1], y[i+1], rightInnerY1);
         p2x = this.__xAtY(x[i], y[i], x[i+1], y[i+1], rightInnerY1);
         d1  = p1x - rightInnerX1;
         d2  = p2x - rightInnerX2;

         if ( (d1 >= 0 && d1 < d) || (d2 >= 0 && d2 < d) )
         {
           // new min-distance
           d = Math.min(d1, d2);

           if (d1 < d2)
           {
             // first point wins
             result.e    = d1;
             result.e1.x = rightInnerX1;
             result.e1.y = rightInnerY1;
             result.e2.x = p1x;
             result.e2.y = rightInnerY2;
           }
           else if (Math.abs(d1 - d2) < 0.00001)
           {
             // points are co-linear (two vertical line segments)
             p1y = 0.5 * leftInnerY1 + 0.5 * leftInnerY2;

             result.e    = d1;
             result.e1.x = rightInnerX1;
             result.e1.y = p1y;
             result.e2.x = p1x;
             result.e2.y = p1y;
           }
           else
           {
             // second point wins
             result.e    = d2;
             result.e1.x = leftInnerX2;
             result.e1.y = leftInnerY2;
             result.e2.x = p1x;
             result.e2.y = rightInnerY2;
           }
         }
       }
     }

     // North separation for each outer edge that is not vertical and whose first vertex y-coordinate is greater than topInnerY1
     d = Number.MAX_VALUE;

     for (i = 0; i < n-1; ++i)
     {
       if ( y[i] >= topInnerY1 && this.__isHorValid(topInnerX1, topInnerX2, x[i], x[i+1]) )
       {
         p1y = this.__yAtX(x[i], y[i], x[i+1], y[i+1], topInnerX1);
         p2y = this.__yAtX(x[i], y[i], x[i+1], y[i+1], topInnerX2);
         d1  = p1y - topInnerY1;
         d2  = p2y - topInnerY2;

         if ( (d1 >= 0 && d1 < d) || (d2 >= 0 && d2 < d) )
         {
           // new min-distance
           d = Math.min(d1, d2);

           if (d1 < d2)
           {
             // first point wins
             result.n    = d1;
             result.n1.x = topInnerX1;
             result.n1.y = topInnerY1;
             result.n2.x = topInnerX1;
             result.n2.y = p1y;
           }
           else if (Math.abs(d1 - d2) < 0.00001)
           {
             // points are co-linear (two vertical line segments)
             p1x = 0.5 * topInnerX1 + 0.5 * topInnerX2;

             result.n    = d1;
             result.n1.x = topInnerX1;
             result.n1.y = p1y;
             result.n2.x = p1x;
             result.n2.y = p1y;
           }
           else
           {
             // second point wins
             result.n    = d2;
             result.n1.x = topInnerX2;
             result.n1.y = topInnerY2;
             result.n2.x = topInnerX2;
             result.n2.y = p2y;
           }
         }
       }
     }

     // South separation for each outer edge that is not vertical and whose first vertex y-coordinate is less than bottomInnerY1
     d = Number.MAX_VALUE;

     for (i = 0; i < n-1; ++i)
     {
       if ( y[i] < bottomInnerY1 && this.__isHorValid(bottomInnerX1, bottomInnerX2, x[i], x[i+1]) )
       {
         p1y = this.__yAtX(x[i], y[i], x[i+1], y[i+1], bottomInnerX1);
         p2y = this.__yAtX(x[i], y[i], x[i+1], y[i+1], bottomInnerX2);
         d1  = bottomInnerY1 - p1y;
         d2  = bottomInnerY2 - p2y;

         if ( (d1 >= 0 && d1 < d) || (d2 >= 0 && d2 < d) )
         {
           // new min-distance
           d = Math.min(d1, d2);

           if (d1 < d2)
           {
             // first point wins
             result.s    = d1;
             result.s1.x = bottomInnerX1;
             result.s1.y = bottomInnerY1;
             result.s2.x = bottomInnerX1;
             result.s2.y = p1y;
           }
           else if (Math.abs(d1 - d2) < 0.00001)
           {
             // points are co-linear (two vertical line segments)
             p1x = 0.5 * bottomInnerX1 + 0.5 * bottomInnerX2;

             result.s    = d1;
             result.s1.x = bottomInnerX1;
             result.s1.y = p1y;
             result.s2.x = p1x;
             result.s2.y = p1y;
           }
           else
           {
             // second point wins
             result.s    = d2;
             result.s1.x = bottomInnerX2;
             result.s1.y = bottomInnerY2;
             result.s2.x = bottomInnerX2;
             result.s2.y = p2y;
           }
         }
       }
     }

     return result;
   }

   public minSeparation(inner: Polygon, outer: Polygon, cache: boolean = true): ProjectFromTo | null
   {
     // the algorithm is kept simple since this library is intended for interactive applications and most polygons
     // represent the boundary of some physical object, wall, ceiling, etc, and therefore have relatively few edges.
     // Although the complexity is still E1*E2 (where E1 and E2 are the edge counts of the inner and outer polygons),
     // the actual number of computations is kept smaller by using a simple heuristic to discount many projection
     // calls.
     if (cache)
     {
       this._xi = inner.xcoordinates;
       this._yi = inner.ycoordinates;
       this._xo = outer.xcoordinates;
       this._yo = outer.ycoordinates;
     }

     const ni: number = this._xi.length;
     const no: number = this._xo.length;

     let i: number, j: number;
     let dx1: number, dy1: number, dx2: number, dy2: number, minDx: number, minDy: number;
     let x: number, y: number;
     let px1: number, py1: number, px2: number, py2: number;

     // current and min projections
     let p: Projection | null       = null;
     let pMin: ProjectFromTo | null = null;

     // current min-distance from any vertex to any edge
     let d: number = Number.MAX_VALUE;

     for (i = 0; i < ni-1; ++i)
     {
       // current inner vertex
       x = this._xi[i];
       y = this._yi[i];

       for (j = 0; j < no-1; ++j)
       {
         // do we project and test distance against j-th edge?
         px1 = this._xo[j];
         py1 = this._yo[j];
         px2 = this._xo[j+1];
         py2 = this._yo[j+1];
         dx1 = Math.abs(x - px1);
         dy1 = Math.abs(y - py1);
         dx2 = Math.abs(x - px2);
         dy2 = Math.abs(y - py2);

         minDx = Math.min(dx1, dx2);
         minDy = Math.min(dy1, dy2);

         if (minDx < d || minDy < d)
         {
           p = geomUtils.projectToSegment(px1, py1, px2, py2, x, y);
           if (p.d < d)
           {
             // new min-projection
             d    = p.d;
             pMin = {...p, fromX: x, fromY: y};
           }
         }
       }
     }

     return pMin;
   }

   protected __isVertValid(p1y: number, p2y: number, yi: number, yi1: number): boolean
   {
     // get the order right :)
     if (yi1 < yi)
     {
       const t: number = yi;
       yi              = yi1;
       yi1             = t;
     }

     // first condition is no horizontal line; second condition is that there is some y-overlap between the two
     // segments
     const condition1: boolean = Math.abs(yi1-yi) > 0.01;
     const condition2: boolean = (p1y >= yi && p1y <= yi1) || (p2y <= yi1 && p2y >= yi);

     return condition1 && condition2;
   }

   protected __isHorValid(p1x: number, p2x: number, xi: number, xi1: number): boolean
   {
     // get the order right :)
     if (xi1 < xi)
     {
       const t: number = xi;
       xi              = xi1;
       xi1             = t;
     }

     // first condition is no vertical line; second condition is that there is some y-overlap between the two
     // segments
     const condition1: boolean = Math.abs(xi1-xi) > 0.01;
     const condition2: boolean = (p1x >= xi && p1x <= xi1) || (p2x <= xi1 && p2x >= xi);

     return condition1 && condition2;
   }

   protected __xAtY(x0: number, y0: number, x1: number, y1: number, py: number): number
   {
     if (Math.abs(x1-x0) < 0.01) return x0;

     const m: number = (y1-y0)/(x1-x0);
     return (py-y1)/m + x0;
   }

   protected __yAtX(x0: number, y0: number, x1: number, y1: number, px: number): number
   {
     if (Math.abs(y1-y0) < 0.01) return y0;

     const m: number = (y1-y0)/(x1-x0);
     return y0 + m*(px-x0);
   }

   // internal method - Vi above Vj ?
   protected __above(P: Point, Vi: Point, Vj: Point): boolean
   {
     const amt: number = (Vi.x-P.x)*(Vj.y-P.y) - (Vj.x-P.x)*(Vi.y-P.y);

     return amt > 0;
   }

   // internal method - Vi (strictly) below Vj?
   protected __below(P: Point, Vi: Point, Vj: Point): boolean
   {
     const amt: number = (Vi.x-P.x)*(Vj.y-P.y) - (Vj.x-P.x)*(Vi.y-P.y);

     return amt < 0;
   }
 }
