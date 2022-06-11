/**
 * Copyright 2018 Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
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
 * AMYR Library: Minimal implementation of a natural cubic spline. Note that the term 'knots' is used
 * frequently and interchangeably with interpolation points.  This reference comes an ancient process for shipbuilding
 * in which ropes were hung from a common beam and knots in the rope represented points that defined a shape of a curve.
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */
import { SplineTypes } from "@algorithmist/amyr-ts-lib";

import { Point } from "@algorithmist/amyr-ts-lib";

export class CubicSpline
{
  protected ONE_SIXTH = 0.1666666666667;

  // these variables use the same names as in the white paper
  protected _t: Array<number>;
  protected _y: Array<number>;
  protected _u: Array<number>;
  protected _v: Array<number>;
  protected _h: Array<number>;
  protected _b: Array<number>;
  protected _z: Array<number>;
  protected _hInv: Array<number>;

  protected _invalidate: boolean;  // true if data invalidates prior z-value computation
  protected _knots: number;        // total knot count

  /**
   * Construct a new {NaturalCubicSpline)
   */
  constructor()
  {
    this._t    = new Array<number>();
    this._y    = new Array<number>();
    this._u    = new Array<number>();
    this._v    = new Array<number>();
    this._h    = new Array<number>();
    this._b    = new Array<number>();
    this._z    = new Array<number>();
    this._hInv = new Array<number>();

    this._invalidate = true;
    this._knots      = 0;
  }

  public get type(): SplineTypes { return SplineTypes.CARTESIAN }

  /**
   * Access the total number of interpolation points or knots
   */
  public get knotCount()
  {
    return this._knots;
  }

  /**
   * Access the collection of interpolation points or knots
   */
  public get interpolationPoints(): Array<Point>
  {
    const knotArr: Array<Point> = new Array<Point>();
    let i = 0;

    while (i < this._knots)
    {
      knotArr.push( {x:this._t[i], y:this._y[i]} );
      i++;
    }

    return knotArr;
  }

  /**
   * Add an interpolation point to the spline.  Note that all x-coordinates MUST be in increasing order and the
   * coordinate order will be dynamically adjusted to ensure this condition
   *
   * @param {number} x x-coordinate of new control point
   *
   * @param {number} y y-coordinate of new control point
   */
  public addInterpolationlPoint(x: number, y: number): void
  {
    this._invalidate = true;

    let i = 0;

    if (this._t.length == 0)
    {
      this._t.push(x);
      this._y.push(y);
    }
    else
    {
    	// find the correct interval for insertion
      if (x > this._t[this._knots-1])
      {
        this._t.push(x);
        this._y.push(y);
      }
      else if (x < this._t[0])
      {
        this._t.splice(0, 0, x);
        this._y.splice(0, 0, y);
      }
      else
      {
        if (this._knots > 1)
        {
          i = 0;
          while (i < this._knots-1)
          {
            if (x > this._t[i] && x < this._t[i+1])
            {
              this._t.splice(i+1, 0, x);
              this._y.splice(i+1, 0, y);
              break;
            }

            i++;
          }
        }
      }
    }

    this._knots++;
  }

  /**
   * Clear the spline and prepare for new data
   */
  public clear()
  {
    this._t.length    = 0;
    this._y.length    = 0;
    this._u.length    = 0;
    this._v.length    = 0;
    this._h.length    = 0;
    this._b.length    = 0;
    this._z.length    = 0;
    this._hInv.length = 0;

    this._knots      = 0;
    this._invalidate = true;
  }

  /**
   * Compute the spline y-coordinate for a given x-coordinate, provided that the coordinate
   * is in-range as the spline is strictly interpolative.
   *
   * @param {number} x x-coordinate in the domain of the spline
   */
  public getY(x: number): number
  {
    if (this._knots == 0)
    {
      // empty spline returns zero by definition
      return 0;
    }
    else if (this._knots == 1)
    {
      // this is easy - nothing to interpolate :)
      return this._y[0];
    }
    else
    {
    	// lazy validation used for z-values for performance reasons
      if (this._invalidate) {
        this._computeZ();
      }

      // determine interval - TODO make this more DRY
      let i = 0;
      let j: number     = this._knots-2;
      let delta: number = x - this._t[0];

      while (j >= 0)
      {
        if (x >= this._t[j])
        {
          delta = x - this._t[j];
          i     = j;

          break;
        }

        j--;
      }

      const b: number = (this._y[i+1] - this._y[i])*this._hInv[i] - this._h[i]*(this._z[i+1] + 2.0*this._z[i])*this.ONE_SIXTH;
      const q: number = 0.5*this._z[i] + delta*(this._z[i+1]-this._z[i])*this.ONE_SIXTH*this._hInv[i];
      const r: number = b + delta*q;

      return this._y[i] + delta*r;
    }
  }

  /**
   * Compute the first-derivative of the cubic spline at the specified x-coordinate
   *
   * @param {number} x x-coordinate in the domain of the spline
   */
  public getYPrime(x: number): number
  {
  	// The usual suspects ... TODO Make this more DRY
    if( this._knots == 0 )
    {
    	// again, by definition
      return 0;
    }
    else if( this._knots == 1 )
    {
    	// a singleton point has no delta-x
      return this._y[0];
    }

    if (this._invalidate) this._computeZ();

    // determine interval
    let i = 0;
    let delta: number  = x - this._t[0];
    let delta2: number = this._t[1] - x;
    let j: number      = this._knots-2;

    while (j >= 0)
    {
      if (x >= this._t[j])
      {
        delta  = x - this._t[j];
        delta2 = this._t[j+1] - x;
        i      = j;

        break;
      }
      j--;
    }

    // this can be made more efficient - will complete l8r - the equations can be found in the white paper
    const h: number  = this._h[i];
    const h2: number = 1/(2.0*h);
    const h6: number = h/6;

    const a: number = delta*delta;
    const b: number = delta2*delta2;
    let c: number   = this._z[i+1]*h2*a;

    c -= this._z[i]*h2*b;
    c += this._hInv[i]*this._y[i+1];
    c -= this._z[i+1]*h6;
    c -= this._y[i]*this._hInv[i];
    c += h6*this._z[i];

    return c;
  }

  /**
	 * compute z-values or second-derivative values at the interpolation points.
	 *
	 * @private
   */
  protected _computeZ(): void
  {
    // pre-generate h^-1 since the same quantity could be repeatedly calculated in eval()
    let i = 0;
    while (i < this._knots-1)
    {
      this._h[i]    = this._t[i+1] - this._t[i];
      this._hInv[i] = 1.0/this._h[i];
      this._b[i]    = (this._y[i+1] - this._y[i])*this._hInv[i];
      i++;
    }

    // recurrence relations for u(i) and v(i) -- tri-diagonal solver
    this._u[1] = 2.0*(this._h[0]+this._h[1]);
    this._v[1] = 6.0*(this._b[1]-this._b[0]);

    i = 2;
    while (i < this._knots-1)
    {
      this._u[i] = 2.0*(this._h[i]+this._h[i-1]) - (this._h[i-1]*this._h[i-1])/this._u[i-1];
      this._v[i] = 6.0*(this._b[i]-this._b[i-1]) - (this._h[i-1]*this._v[i-1])/this._u[i-1];
      i++;
    }

    // compute z(i)
    this._z[this._knots-1] = 0.0;
    i                        = this._knots-2;

    while (i >= 1)
    {
      this._z[i] = (this._v[i]-this._h[i]*this._z[i+1])/this._u[i];
      i--;
    }

    this._z[0] = 0.0;

    this._invalidate = false;
  }
}
