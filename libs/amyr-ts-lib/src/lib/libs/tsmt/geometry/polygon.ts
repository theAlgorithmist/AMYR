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
 * AMYR Library: Polygon: A 2D, closed, polygonal shape defined as collection of (x,y) vertices in
 * clockwise order
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */
import {
  Point,
  DirEnum,
  Rect,
  Vertices
} from "../../../models/geometry";

import * as geomUtils from '../utils/geom-utils';

 export class Polygon
 {
   protected DEG_TO_RAD = 3.14159265359/180; // convert degrees to radians

   protected _xcoord: Array<number>;         // x-coordinates of each point
   protected _ycoord: Array<number>;         // y-coordinates of each point
   protected _area: number;                  // area of the polygon
   protected _isConvex: boolean;             // is the polygon convex?
   protected _invalidateBound: boolean;      // true if assigning a new point(s) invalidates previously computed bounding box
   protected _invalidateArea: boolean;       // true if assigning a new point(s) invalidates previously computed area
   protected _invalidateCentroid: boolean;   // true if assigning a new point(s) invalidates previously computed centroid
   protected _aabb: Rect;                    // Axis-aligned bounding-box
   protected _centroid: Point;               // centroid of polygon

   constructor()
   {
     this._xcoord             = new Array<number>();
     this._ycoord             = new Array<number>();
     this._area               = 0;
     this._isConvex           = false;
     this._invalidateBound    = false;
     this._invalidateArea     = false;
     this._invalidateCentroid = false;
     this._aabb               = {left: 0, top: 0, right: 0, bottom: 0};
     this._centroid           = {x: 0, y: 0};
   }

  /**
   * Access the number of vertices in the Polygon
   */
   public get vertexCount(): number
   {
	   return this._xcoord.length;
   }

  /**
   * Access the vertex x-coordinates
   */
   public get xcoordinates(): Array<number>
   {
	   return this._xcoord.slice(0);
   }

  /**
   * Assign a sequence of x-coordinates to the {Polygon}.  The internal array of x-coordinates is re-assigned to the
   * input array.  It is common to use this method in tandem with setYCoordinates() and it is the user's responsibility
   * to ensure that each array is of the same length.
   *
   * @param {Array<number>} x An array of floating-point numbers containing the x-coordinates of a vertex set to
   * add to the Polygon
   */
   public set xcoordinates(x: Array<number>)
   {
     this._xcoord             = x.slice();
     this._invalidateBound    = true;
     this._invalidateArea     = true;
     this._invalidateCentroid = true;
   }


   /**
   * Access the vertex y-coordinates
   */
   public get ycoordinates(): Array<number>
   {
     return this._ycoord.slice(0);
   }

  /**
   * Assign a sequence of y-coordinates to the Polygon
   *
   * @param {Array<number>} y An array of floating-point numbers containing the y-coordinates of a vertex set to
   * add to the Polygon
   */
   public set ycoordinates(y: Array<number>)
   {
     this._ycoord             = y.slice();
     this._invalidateBound    = true;
     this._invalidateArea     = true;
     this._invalidateCentroid = true;
   }

  /**
   * Access the area of the >Polygon
   *
   * @returns {number} Area of the polygon or zero if less than three vertices are defined
   */
   public get area(): number
   {
	   if (this._invalidateArea)
	   {
       const n: number = this._xcoord.length;
	     let i: number;
       if (n < 3) return 0.0;

       this._area = 0.0;
       i          = 0;
	     while (i < n-1)
	     {
         this._area += this._xcoord[i] * this._ycoord[i+1];
         i++;
	     }

       this._area += this._xcoord[n-1] * this._ycoord[0];

       i = 0;
	     while (i < n-1)
	     {
         this._area -= this._ycoord[i] * this._xcoord[i+1];
         i++;
	     }

       this._area -= this._ycoord[n-1] * this._xcoord[0];

	     // computed area may be positive or negative depending on vertex order (CCW -> positive, CW -> negative)
       this._area           = Math.abs( 0.5*this._area );
	     this._invalidateArea = false;
	   }

	   return this._area;
   }

  /**
   * Access the centroid of the Polygon, or the origin if no points are defined
   */
   public get centroid(): Point
   {
	   if (this._invalidateCentroid)
	   {
       const numPoints: number = this._xcoord.length;

	     if( numPoints === 0 )
       {
         // degenerate case
         this._centroid = {x: 0, y: 0};
       }
	     else
	     {
         const n: number  = 1/numPoints;
         let cx: number = this._xcoord[0];
         let cy: number = this._ycoord[0];

         let i  = 1;

         while (i < numPoints)
         {
           cx += this._xcoord[i];
           cy += this._ycoord[i];
           i++;
         }

	       cx *= n;
         cy *= n;

	       this._centroid           = {x: cx, y: cy};
	       this._invalidateCentroid = false;
	     }
	   }

     // always maintain immutability
	   return {x: this._centroid.x, y: this._centroid.y};
   }

  /**
   * Access the axis-aligned bounding box of the Polygon
   *
   * @param {boolean} yDown {true} if the coordinate system is y-down, which is the case in many browser-based
   * drawing environments
   * @default {true}
   */
   public getBoundingBox(yDown: boolean=true): Rect
   {
     const n: number = this._xcoord.length;
     if (n == 0) return {left: 0, top: 0, right: 0, bottom: 0};

     if (this._invalidateBound)
     {
       let l: number = this._xcoord[0];
       let t: number = this._ycoord[0];
       let r: number = this._xcoord[0];
       let b: number = this._ycoord[0];
       let i = 1;

       if (yDown)
       {
         while (i < n)
         {
           l = Math.min(l, this._xcoord[i]);
           t = Math.min(t, this._ycoord[i]);
           r = Math.max(r, this._xcoord[i]);
           b = Math.max(b, this._ycoord[i]);
           i++;
         }
       }
       else
       {
         while (i < n)
         {
           l = Math.min(l, this._xcoord[i]);
           t = Math.max(t, this._ycoord[i]);
           r = Math.max(r, this._xcoord[i]);
           b = Math.min(b, this._ycoord[i]);
           i++;
         }
       }

       this._aabb            = {left:l, top:t, right:r, bottom:b};
       this._invalidateBound = false;
     }

     return this._aabb;
   }

  /**
   * Translate the polygon
   *
   * @param {number} dx Delta-x value
   *
   * @param {number} dy Delta-y value
   */
  public translate(dx: number, dy: number): void
  {
    const n: number = this._xcoord.length;
    let i: number;

    for (i = 0; i < n; ++i)
    {
      this._xcoord[i] += dx;
      this._ycoord[i] += dy;
    }
  }

  /**
   * Scale the Polygon about its geometric center (no action is taken if the vertex count is less than two)
   *
   * @param {number} s Scale factor - must be greater than zero
   */
   public scale(s: number): void
   {
	   if (s > 0)
	   {
       const numPoints: number = this._xcoord.length;
	     if (numPoints > 0)
	     {
	       const c: Point   = this.centroid;
	       const cx: number = c.x;
	       const cy: number = c.y;
	       let i = 0;

	       // translate centroid to origin and scale
         while (i < numPoints)
         {
           this._xcoord[i] = s*(this._xcoord[i] - cx);
           this._ycoord[i] = s*(this._ycoord[i] - cy);
           i++;
         }

         // translate back
         i = 0;
         while (i < numPoints)
         {
           this._xcoord[i] += cx;
           this._ycoord[i] += cy;
           i++;
         }
	     }

	     this._invalidateBound = true;
       this._invalidateArea  = true;
	   }
   }

  /**
   * Rotate the Polygon about its geometric center
   *
   * @param {number} a Rotation angle in degrees
   *
   * @returns {nothing} - Rotates the Polygon about its geometric center by the specified rotation angle or no action
   * is taken if the vertex count is less than two.
   */
   public rotate(a: number): void
   {
	   if (a != 0)
	   {
       const numPoints: number = this._xcoord.length;
       if (numPoints > 0)
       {
         const cent: Point = this.centroid;
         const cx: number  = cent.x;
         const cy: number  = cent.y;
         let i  = 0;

	       // translate centroid to origin
         while (i < numPoints)
         {
           this._xcoord[i] = this._xcoord[i] - cx;
           this._ycoord[i] = this._ycoord[i] - cy;
		       i++;
         }

         // rotate and translate back
         const angle: number = a*this.DEG_TO_RAD;
         const s: number     = Math.sin(angle);
         const c: number     = Math.cos(angle);

         let x = 0;
         let y = 0;

		     i = 0;
         while (i < numPoints)
         {
           x = this._xcoord[i];
           y = this._ycoord[i];

           this._xcoord[i] = c*x - s*y + cx;
           this._ycoord[i] = s*x + c*y + cy;
		       i++;
         }
       }

	     this._invalidateBound = true;
	   }
   }

  /**
   * Is the specified point strictly inside the Polygon?  A point that lies on an edge is considered outside the Polygon.
   *
   * @param {number} x x-coordinate of the test point
   *
   * @param {number} y y-coordinate of the test point
   */
   public isInside(x: number, y: number): boolean
   {
	   let n: number = this._xcoord.length;
	   if (n < 3) {
       return false;
     }

	   // check vs. bounding-box (tbd, this could be made faster if perf. becomes an issue)
	   const bound: Rect = this.getBoundingBox();
	   const inBound: boolean  = geomUtils.insideBox(
       x,
       y,
       bound.left,
       bound.top,
       bound.right,
       bound.bottom
     );

	   if (!inBound) return false;

	   // winding number algorithm
	   let wind = 0;
	   let i    = 0;
     let dir: number;

	   n -= 1;
	   while (i < n)
	   {
	     if (this._ycoord[i] <= y)
	     {
		     if (this._ycoord[i+1] > y)
		     {
		       dir = geomUtils.pointOrientation(this._xcoord[i], this._ycoord[i], this._xcoord[i+1], this._ycoord[i+1], x, y);
		       if (dir == DirEnum.LEFT) wind++;
		     }
	     }
	     else
	     {
         if (this._ycoord[i+1] <= y)
		     {
            dir = geomUtils.pointOrientation(this._xcoord[i], this._ycoord[i], this._xcoord[i+1], this._ycoord[i+1], x, y);
		        if (dir == DirEnum.RIGHT) wind--;
         }
	     }

       i++;
	   }

	   // process final edge from last vertex to first (the polygon is always closed)
	   if (this._ycoord[n] <= y)
     {
       if (this._ycoord[0] > y)
       {
         dir = geomUtils.pointOrientation(this._xcoord[n], this._ycoord[n], this._xcoord[0], this._ycoord[0], x, y);
         if (dir == DirEnum.LEFT) wind++;
       }
     }
     else
     {
       if (this._ycoord[0] <= y)
       {
         dir = geomUtils.pointOrientation(this._xcoord[n], this._ycoord[n], this._xcoord[0], this._ycoord[0], x, y);
         if (dir == DirEnum.RIGHT) wind--;
       }
     }

     return wind != 0;
   }

  /**
   * Is the Polygon convex?  Returns {false} if the vertex count is less than three.
   */
   public isConvex(): boolean
   {
     const n: number = this._xcoord.length;
	   if (n < 3) return false;

	   let i: number;
	   let j: number;
	   let k: number;
     let z: number;
	   let result = 0;

     i = 0;
     while (i < n)
	   {
       j  = (i + 1) % n;
       k  = (i + 2) % n;
       z  = (this._xcoord[j] - this._xcoord[i]) * (this._ycoord[k] - this._ycoord[j]);
       z -= (this._ycoord[j] - this._ycoord[i]) * (this._xcoord[k] - this._xcoord[j]);

       if( z < 0 )
         result |= 1;
       else if( z > 0 )
         result |= 2;

       if (result === 3) return false;

       i++;
     }

     return result != 0 ? true : false
   }

  /**
   * Add a vertex or point to the {Polygon}. If both x- and y-coordinates are valid numbers, the new vertex is appended
   * to the end of the {Polygon}. The {Polygon} is considered to be closed and does not intersect itself.  No check is
   * made for violation of the latter condition, in which case future calls to some methods may return unpredictable
   * results.
   *
   * @param {number} x x-coordinate of new vertex
   *
   * @param {number} y y-coordinate of new vertex
   */
   public addVertex(x: number, y: number): void
   {
	   if (!isNaN(x) && isFinite(x) && !isNaN(y) && isFinite(y))
	   {
       this._xcoord.push(x);
	     this._ycoord.push(y);

	     this._invalidateBound    = true;
       this._invalidateArea     = true;
       this._invalidateCentroid = true;
	   }
   }

  /**
   * Clear the current vertex collection for this Polygon
   *
   * @returns {nothing} The internal vertex set is cleared
   */
   public clear(): void
   {
	   this._xcoord.length = 0;
	   this._ycoord.length = 0;

	   this._invalidateBound    = true;
     this._invalidateArea     = true;
     this._invalidateCentroid = true;
   }

  /**
   * Convert to y-down.  This is used for polygons that are defined in a y-up orientation, but represented in a y-down
   * layout.  The y-coordinates are adjusted so that the object retains its orientation, but the vertices are correctly
   * defined for a y-down layout.
   *
   * @param {boolean} bounds True if bounds need to be computed; if you already know existing AABB is correct, then
   * set this input to {false}
   * @default {true}
   */
   public toYDown(bounds: boolean = true): void
   {
     this._aabb = bounds ? this.getBoundingBox(false) : this._aabb;

     const yMax: number = this._aabb.top;
     const dy: number   = this._aabb.top - this._aabb.bottom;
     const n: number    = this._xcoord.length;

     if (n > 0)
     {
       let i: number;

       // convert to y-down
       for (i = 0; i < n; ++i) {
         this._ycoord[i] = yMax - this._ycoord[i] + 1;
       }
     }
   }

  /**
   * Clone the current {Polygon}
   */
   public clone(): Polygon
   {
     const p: Polygon = new Polygon();

     p.xcoordinates = this._xcoord;
     p.ycoordinates = this._ycoord;

     return p;
    }
  }
