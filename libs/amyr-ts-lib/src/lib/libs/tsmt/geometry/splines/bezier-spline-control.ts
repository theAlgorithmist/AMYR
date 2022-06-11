/**
 * Copyright 2012-2019 Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
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

import { ControlPoints } from "@algorithmist/amyr-ts-lib";

/**
 * AMYR Library: BezierSplineControl computes tangents and thus geometric constraints for a collection of cubic Bezier segments
 * in a cubic Bezier spline.  The algorithm used is to compute tangent direction as normal to the angle bisector at each control point.
 * Reflection is used at interior points.  Placement of geometric constraints along the tangent line (i.e. cx,cy and cx1,cy1) is based
 * on the tension parameter.
 *
 * Author Jim Armstrong (www.algorithmist.net)
 *
 * Version 1.0
 *
 */
export class BezierSplineControl
{
  // todo constants import
  protected static ZERO_TOL = 0.000001; // zero-tolerance, suitable for this algorithm

  public closed: boolean;

  protected _bXNR: number;            // bisector 'right' normal, x-coordinate
  protected _bYNR: number;            // bisector 'right' normal, y-coordinate
  protected _bXNL: number;            // bisector 'left' normal, x-coordinate
  protected _bYNL: number;            // bisector 'left' normal, y-coordinate
  protected _pX: number;              // reflected point, x-coordinate
  protected _pY: number;              // reflected point, y-coordinate
  protected _dX1: number;             // delta-x, first segment
  protected _dY1: number;             // delta-y, first segment
  protected _dX2: number;             // delta-x, second segment
  protected _dY2: number;             // delta-y, second segment
  protected _d1: number;              // first segment length
  protected _d2: number;              // second segment length
  protected _tension: number;         // tension parameter in [0,1]
  protected _uX: number;              // unit vector, direction of bisector, x-coordinate
  protected _uY: number;              // unit vector, direction of bisector, y-coordinate
  protected _dist: number;            // distance measure from segment intersection, along direction of bisector

  protected _segments: Array<ControlPoints>; // cubic bezier geometric constraints for each segment

  constructor()
  {
    this.closed = false;

    this._bXNR     = 0;
    this._bYNR     = 0;
    this._bXNL     = 0;
    this._bYNL     = 0;
    this._pX       = 0;
    this._pY       = 0;

    this._dX1      = 0;
    this._dY1      = 0;
    this._dX2      = 0;
    this._dY2      = 0;
    this._d1       = 0;
    this._d2       = 0;
    this._tension  = 0.2;
    this._uX       = 0;
    this._uY       = 0;
    this._dist     = 0;

    this._segments = new Array<ControlPoints>();
  }

  /**
   * Access the current tension parameter
   */
  public get tension(): number
  {
    return this._tension;
  }

  /**
   * Assign the tension parameter
   *
   * @param {number} t Desired tension in [0,1], which actually varies the internal tension parameter between a
   * pre-established low and high range.  Higher tension tends to flatten the curve out as it moves
   * in and out of interpolation points.
   */
  public set tension(t: number)
  {
    let tension: number = t === undefined || isNaN(t) ? this._tension : t;
    tension             = Math.max(0, tension);
    tension             = Math.min(1, tension);

    this._tension = (1-tension)*0.1 + tension*0.4;
  }

  /**
   * Access the cubic Bezier geometric constraints for the desired spline segment
   *
   * @param {number} i Zero-based segment index (there are #points - 2 segments)
   */
  public getSegment(i: number): ControlPoints
  {
    if (i < 0 || i > this._segments.length-1) return {x0: 0, y0: 0, cx: 0, cy: 0, cx1: 0, cy1: 0, x1: 0, y1: 0};

    return this._segments[i];
  }

  /**
   * Construct geometric constraints for all cubic bezier segments
   *
   * @param {number} x x-coordinates of spline control or interpolation points
   * @param {number} y y-coordinates of spline control or interpolation points
   */
  public construct(x: Array<number>, y: Array<number>): void
  {
    const numPoints: number = x.length;
    const count: number     = numPoints - 1;

    // Need at least one cubic in the spline
    if (count < 2) return;

    let i: number;
    let j: number;
    this._segments.length = 0;

    for (i = 0; i < count; ++i) this._segments[i] = {x0: 0, y0: 0, cx: 0, cy: 0, cx1: 0, cy1: 0, x1: 0, y1: 0};

    // this approach is sub-optimal, but very easy to follow and modify for other tangent constructions; process left/middle/right
    if (this.closed)
    {
      // 'leftmost' segment, closed spline
      this.__leftClosed(this._tension, x, y);
    }
    else
    {
      // 'leftmost' segment, open spline (requires a reflection point)
      this.__left(this._tension, x, y);
    }

    // 'middle' segments
    for (j = 1; j < count - 1; ++j)
    {
      this.__segmentsCoef(j, this._tension, x, y);
    }

    // rightmost segment
    if (this.closed)
    {
      // 'rightmost' segment, closed spline
      this.__rightClosed(this._tension, x, y);
    }
    else
    {
      // 'rightmost' segment, open spline (requires a reflection point)
      this.__right(this._tension, x, y);
    }
  }

  // compute 'middle' segments
  protected __segmentsCoef(i: number, t: number, x: Array<number>, y: Array<number>): void
  {
    this.__getNormals(i, x, y);

    const coef: ControlPoints = this._segments[i];
    coef.x0                   = x[i];
    coef.y0                   = y[i];
    coef.cx                   = this._bXNL;
    coef.cy                   = this._bYNL;

    if (this._dist > BezierSplineControl.ZERO_TOL)
    {
      if (this.__isClockWise(x, y, i))
      {
        // process close-wise ordered vertices
        this.__CW(i, t, x, y);
      }
      else
      {
        // you guessed it, counter-clockwise :)
        this.__CCW(i, t, x, y);
      }
    }
    else
    {
      this._bXNR = x[i] + t*this._dX1;
      this._bYNR = y[i] + t*this._dY1;
      this._bXNL = x[i] + t*this._dX2;
      this._bYNL = y[i] + t*this._dY2;
    }

    coef.cx1 = this._bXNR;
    coef.cy1 = this._bYNR;
    coef.x1 = x[i+1];
    coef.y1 = y[i+1];
  }

  // Compute normals to the angle bisector at knots (one normal is the reflection of the other)
  protected __getNormals(i: number, x: Array<number>, y: Array<number>): void
  {
    this._dX1  = x[i] - x[i+1];
    this._dY1  = y[i] - y[i+1];
    this._d1   = Math.sqrt(this._dX1*this._dX1 + this._dY1*this._dY1);
    this._dX1 /= this._d1;
    this._dY1 /= this._d1;

    this._dX2  = x[i+2] - x[i+1];
    this._dY2  = y[i+2] - y[i+1];
    this._d2   = Math.sqrt(this._dX2*this._dX2 + this._dY2*this._dY2);
    this._dX2 /= this._d2;
    this._dY2 /= this._d2;

    this._uX   = this._dX1 + this._dX2;
    this._uY   = this._dY1 + this._dY2;
    this._dist = Math.sqrt(this._uX*this._uX + this._uY*this._uY);
    this._uX  /= this._dist;
    this._uY  /= this._dist;
  }

  // Compute left geometric constraints (open spline)
  protected __left(t: number, x: Array<number>, y: Array<number>): void
  {
    this.__getNormals(0, x, y);

    if (this._dist > BezierSplineControl.ZERO_TOL)
    {
      if (this.__isClockWise(x, y, 0))
      {
        // here we go again, clockwise
        this.__CW(0, t, x, y);
      }
      else
      {
        // and again, counter-clockwise vertex order
        this.__CCW(0, t, x, y);
      }

      const mX: number = 0.5*(x[0] + x[1]);
      const mY: number = 0.5*(y[0] + y[1]);
      const pX: number = x[0] - mX;
      const pY: number = y[0] - mY;

      // normal at midpoint
      const n: number  = 2.0/this._d1;
      const nX: number = -n*pY;
      const nY: number = n*pX;

      // upper triangle of symmetric transform matrix
      const a11: number = nX*nX - nY*nY
      const a12: number = 2*nX*nY;
      const a22: number = nY*nY - nX*nX;

      const dX: number = this._bXNR - mX;
      const dY: number = this._bYNR - mY;

      // coordinates of reflected vector
      this._pX = mX + a11*dX + a12*dY;
      this._pY = mY + a12*dX + a22*dY;
    }
    else
    {
      this._bXNR = x[1] + t*this._dX1;
      this._bYNR = y[1] + t*this._dY1;

      this._bXNL = x[1] + t*this._dX2;
      this._bYNL = y[1] + t*this._dY2;

      this._pX = x[0] + t*this._dX1;
      this._pY = y[0] + t*this._dY1;
    }

    const coef: ControlPoints = this._segments[0];

    coef.x0  = x[0];
    coef.y0  = y[0];
    coef.cx  = this._pX;
    coef.cy  = this._pY;
    coef.cx1 = this._bXNR;
    coef.cy1 = this._bYNR;
    coef.x1  = x[1];
    coef.y1  = y[1];
  }

  // Compute left geometric constraints (closed spline)
  protected __leftClosed(t: number, x: Array<number>, y: Array<number>): void
  {
    // point order is n-2, 0, 1 (as 0 and n-1 are the same knot in a closed spline).
    // Use 'right normal' to set first two control segment points
    const n2: number = x.length-2;

    this._dX1  = x[n2] - x[0];
    this._dY1  = y[n2] - y[0];
    this._d1   = Math.sqrt(this._dX1*this._dX1 + this._dY1*this._dY1);
    this._dX1 /= this._d1;
    this._dY1 /= this._d1;

    this._dX2  = x[1] - x[0];
    this._dY2  = y[1] - y[0];
    this._d2   = Math.sqrt(this._dX2*this._dX2 + this._dY2*this._dY2);
    this._dX2 /= this._d2;
    this._dY2 /= this._d2;

    this._uX   = this._dX1 + this._dX2;
    this._uY   = this._dY1 + this._dY2;
    this._dist = Math.sqrt(this._uX*this._uX + this._uY*this._uY);
    this._uX  /= this._dist;
    this._uY  /= this._dist;

    let dt: number;
    if (this._dist > BezierSplineControl.ZERO_TOL)
    {
      dt = t*this._d2;

      if (((y[1] - y[n2])*(x[0] - x[n2]) > (y[0] -y[n2])*(x[1] - x[n2])))
      {
        this._bXNL = x[0] + dt*this._uY;
        this._bYNL = y[0] - dt*this._uX;
      }
      else
      {
        dt         = t*this._d2;
        this._bXNL = x[0] - dt*this._uY;
        this._bYNL = y[0] + dt*this._uX;
      }
    }
    else
    {
      this._bXNL = x[0] + t*this._dX1;
      this._bYNL = y[0] + t*this._dY1;
    }

    const coef: ControlPoints = this._segments[0];
    coef.x0                   = x[0];
    coef.y0                   = y[0];
    coef.cx                   = this._bXNL;
    coef.cy                   = this._bYNL;

    // now, continue as before using the point order 0, 1, 2
    this.__getNormals(0, x, y);

    if (this._dist > BezierSplineControl.ZERO_TOL)
    {
      if (this.__isClockWise(x, y, 0))
      {
        // clockwise vertices
        this.__CW(0, t, x, y);
      }
      else
      {
        // CCW
        this.__CCW(0, t, x, y);
      }
    }
    else
    {
      this._bXNR = x[1] + t*this._dX1;
      this._bYNR = y[1] + t*this._dY1;
      this._bXNL = x[1] + t*this._dX2;
      this._bYNL = y[1] + t*this._dY2;
    }

    coef.cx1 = this._bXNR;
    coef.cy1 = this._bYNR;
    coef.x1  = x[1];
    coef.y1  = y[1];
  }

  // Compute right geometric constraints (open spline)
  protected __right(t: number, x: Array<number>, y: Array<number>): void
  {
    const count: number = x.length-1;
    if (this._dist > BezierSplineControl.ZERO_TOL)
    {
      const mX: number = 0.5*(x[count-1] + x[count]);
      const mY: number = 0.5*(y[count-1] + y[count]);
      const pX: number = x[count] - mX;
      const pY: number = y[count] - mY;

      // normal at midpoint
      const n: number  = 2.0/this._d2;
      const nX: number = -n*pY;
      const nY: number = n*pX;

      // upper triangle of symmetric transform matrix
      const a11: number = nX*nX - nY*nY
      const a12: number = 2*nX*nY;
      const a22: number = nY*nY - nX*nX;

      const dX: number = this._bXNL - mX;
      const dY: number = this._bYNL - mY;

      // coordinates of reflected vector
      this._pX = mX + a11*dX + a12*dY;
      this._pY = mY + a12*dX + a22*dY;
    }
    else
    {
      this._pX = x[count] - t*this._dX2;
      this._pY = y[count] - t*this._dY2;
    }

    const coef: ControlPoints = this._segments[count-1];

    coef.x0  = x[count-1];
    coef.y0  = y[count-1];
    coef.cx  = this._bXNL;
    coef.cy  = this._bYNL;
    coef.cx1 = this._pX;
    coef.cy1 = this._pY;
    coef.x1  = x[count];
    coef.y1  = y[count];
  }

  // Compute right geometric constraints (closed spline)
  protected __rightClosed(t: number, x: Array<number>, y: Array<number>): void
  {
    const count: number        = x.length-1;
    const c0: ControlPoints   = this._segments[0];
    const coef: ControlPoints = this._segments[count-1];

    coef.x0  = x[count-1];
    coef.y0  = y[count-1];
    coef.cx  = this._bXNL;
    coef.cy  = this._bYNL;

    const dx: number = coef.cx - coef.x0;
    const dy: number = coef.cy - coef.y0;
    const d: number  = Math.sqrt(dx*dx + dy*dy);

    const dx2: number = c0.x0 - c0.cx;
    const dy2: number = c0.y0 - c0.cy;
    const d2: number  = Math.sqrt(dx2*dx2 + dy2*dy2);
    const ux: number  = dx2 / d2;
    const uy: number  = dy2 / d2;

    coef.cx1 = x[0] + d*ux;
    coef.cy1 = y[0] + d*uy;
    coef.x1  = x[count];           // knot number 'count' and knot 0 should be the same for a closed spline
    coef.y1  = y[count];
  }

  // partial normal computation, clockwise vertex order
  protected __CW(i: number, t: number, x: Array<number>, y: Array<number>): void
  {
    let dt: number = t*this._d1;

    this._bXNR = x[i+1] - dt*this._uY;
    this._bYNR = y[i+1] + dt*this._uX;

    dt         = t*this._d2;
    this._bXNL = x[i+1] + dt*this._uY;
    this._bYNL = y[i+1] - dt*this._uX;
  }

  // partial normal computation, counter-clockwise vertex order
  protected __CCW(i: number, t: number, x: Array<number>, y: Array<number>): void
  {
    let dt: number = t*this._d2;

    this._bXNL = x[i+1] - dt*this._uY;
    this._bYNL = y[i+1] + dt*this._uX;

    dt         = t*this._d1;
    this._bXNR = x[i+1] + dt*this._uY;
    this._bYNR = y[i+1] - dt*this._uX;
  }

  // is the vertex order CW or CCW?
  protected __isClockWise(x: Array<number>, y: Array<number>, i: number): boolean
  {
    return ((y[i+2] - y[i])*(x[i+1] - x[i]) > (y[i+1] -y[i])*(x[i+2] - x[i]));
  }
}
