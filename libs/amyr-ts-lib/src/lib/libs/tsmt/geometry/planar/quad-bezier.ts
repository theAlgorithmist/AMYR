/**
 * Copyright 2018 Jim Armstrong (www.algorithmist.net)
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
 * Typescript Math Toolkit: Quadratic Bezier with arc-length parameterization
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */

// import {
//   IControlPoints, ICurveCoefs,
//   IPoint
// } from './IPlanarCurve';

import {
  ControlPoints,
  CurveCoefs,
  FcnEval,
  Gauss,
  twbrf
} from "@algorithmist/amyr-ts-lib";

import { Point } from "@algorithmist/amyr-ts-lib";

import { PlanarCurve } from "./planar-curve";

export class QuadBezier extends PlanarCurve
{
  // quadratic polynomial coefficient values
  protected _c0X = 0;
  protected _c0Y = 0;
  protected _c1X = 0;
  protected _c1Y = 0;
  protected _c2X = 0;
  protected _c2Y = 0;

  protected _s = 0;         // cache recently requested normalized arc-length
  protected _t = 0;         // natural parameter at that normalized arc length;

  // arc length and normalized arc length, i.e. fraction of total length in [0,1]
  protected _length        = 0;
  protected _normArcLength = 0;

  // numerical integration (created on-demand)
  protected _integral: Gauss | null= null;

  /**
   * Construct a new QuadBezier, which is a {PlanarCurve} on construction
   */
  constructor()
  {
    super();
  }

  public override get order(): number { return 2 }

  public override get coefs(): CurveCoefs
  {
    return {
      c0x: this._c0X,
      c0y: this._c0Y,
      c1x: this._c1X,
      c1y: this._c1Y,
      c2x: this._c2X,
      c2y: this._c2Y
    }
  }

  /**
   * Initialize the curve from a set of control points defined in an {Object}
   *
   * @param {ControlPoints} control
   */
  public override fromObject(control: ControlPoints): void
  {
    this.x0 = control.x0;
    this.y0 = control.y0;
    this.cx = control.cx;
    this.cy = control.cy;
    this.x1 = control.x1;
    this.y1 = control.y1;
  }

  /**
   * Access the x-coordinate at the specified value of the natural parameters
   *
   * @param {number} t Natural parameter value, normally in [0,1] but values outside that interval are allowed for
   * extrapolation purposes
   */
  public override getX(t: number): number
  {
    if (this._invalidated) this.__update();

    // evaluate quadratic polynomial with nested multiplication
    return this._c0X + t*(this._c1X + t*(this._c2X));
  }

  /**
   * Access the y-coordinate at the specified value of the natural parameters
   *
   * @param {number} t Natural parameter value, normally in [0,1] but values outside that interval are allowed for
   * extrapolation purposes
   */
  public override getY(t: number): number
  {
    if (this._invalidated) this.__update();

    // evaluate quadratic polynomial with nested multiplication
    return this._c0Y + t*(this._c1Y + t*(this._c2Y));
  }

  /**
   * Access the x-coordinate of the first derivative of the quad Bezier at the specified value of the natural parameters
   *
   * @param {number} t Natural parameter value, normally in [0,1] but values outside that interval are allowed for
   * extrapolation purposes
   */
  public override getXPrime(t: number): number
  {
    if (this._invalidated) this.__update();

    return this._c1X + 2*t*this._c2X;
  }

  /**
   * Access the y-coordinate of the first derivative of the quad Bezier at the specified value of the natural parameters
   *
   * @param {number} t Natural parameter value, normally in [0,1] but values outside that interval are allowed for
   * extrapolation purposes
   */
  public override getYPrime(t: number): number
  {
    if (this._invalidated) this.__update();

    return this._c1Y + 2*t*this._c2Y;
  }

  /**
   * Perform 3-point bezier interpolation, i.e. compute the geometric constraints that cause the quad bezier to pass
   * through the three specified points.  The returned parameter value is for the middle interpolation point (obtained
   * via chord-length parameterization).  The returned array contains a single value.
   *
   * @param {Array<Point>} points Interpolation points
   */
  public override interpolate(points: Array<Point>): Array<number>
  {
    // compute natural parameter at interior interpolation point using chord-length parameterization
    let dX: number   = points[1].x - points[0].x;
    let dY: number   = points[1].y - points[0].y;
    const d1: number = Math.sqrt(dX*dX + dY*dY);
    let d: number    = d1;

    dX = points[2].x - points[1].x;
    dY = points[2].y - points[1].y;
    d += Math.sqrt(dX*dX + dY*dY);

    const t: number     = d1/d;
    const t1: number    = 1.0-t;
    const tSq: number   = t*t;
    const denom: number = 2.0*t*t1;

    this._x0 = points[0].x;
    this._y0 = points[0].y;

    this._cx = (points[1].x - t1*t1*points[0].x - tSq*points[2].x)/denom;
    this._cy = (points[1].y - t1*t1*points[0].y - tSq*points[2].y)/denom;

    this._x1 = points[2].x;
    this._y1 = points[2].y;

    this._invalidated = true;

    return [t];
  }

  /**
   * Return the arc length at the specified natural parameter value
   *
   * @param {number} t Natural parameter value
   *
   */
  public override lengthAt(t: number)
  {
    if (this._invalidated) this.__update();

    if (Math.abs(this._length) < 0.0000001) return 0;

    if (t <= 0) return 0;

    if (t >= 1) return this._length;

    this._integral = this._integral || new Gauss();

    return this._integral.eval(this.__integrand, 0, t, 6);
  }

  /**
   * Compute the natural parameter value at the specified normalized arc-length value
   *
   * @param {number} s Normalized arc length in [0,1]
   */
  public override getTAtS(s: number): number
  {
    if (isNaN(s)) return this._s;

    // check for duplicate request and edge cases; todo approx equal
    if (s == this._s) return this._t;

    if (s <= 0)
    {
      this._s = this._t = 0;
      return 0;
    }

    if (s >= 1)
    {
      this._s = this._t = 1;
      return 1;
    }

    if (this._invalidated) this.__update();

    this._normArcLength = s;

    // the game is to quickly get an interval containing the arc length, then let TWBRF do its work; the new _t value is in either
    // [0,_t) or (_t,1] depending on whether or not s > _s or s < _s.
    let left  = 0;
    let right = 1;

    if (s > this._s)
    {
      // moving uniformly forward in arc-length is the most expected use case
      left = this._t + 0.05;
    }
    else
    {
      // okay ... backward, then
      right = this._t - 0.05;
    }

    this._integral = this._integral || new Gauss();

    // because of the non-decreasing relationship between the natural parameter and normalized arc length, we know that the
    // t-parameter corresponding to the requested s is in the interval [left, right], provided the delta between subsequent
    // requests for s is sufficiently large for the hardcoded delta-t (the trick in this approximation scheme).
    const invFcn: FcnEval = (t: number): number => {
      return (this._integral as Gauss)
        .eval((t: number) => this.__integrand(t), 0, t, 6)/this._length - this._normArcLength;
    };

    let t: number = twbrf(left, right, invFcn);
    if (t >= 0 && t <= 1)
    {
      this._s = s;
      this._t = t;
    }
    else
    {
      // t = 0 if out of range
      t = 0;
    }

    return  t;
  }

  /**
   * Compute the natural parameter at the specified x-coordinate
   *
   * @param {number} x x-coordinate
   */
  public override getTAtX(x: number): Array<number>
  {
    if (this._invalidated) this.__update();

    // the venerable quadratic formula
    const c: number = this._c0X - x;
    const b: number = this._c1X;
    let a: number   = this._c2X;

    let d: number = b*b - 4*a*c;
    if (d < 0)
    {
      // no solutions
      return [];
    }

    d                = Math.sqrt(d);
    a                = 1/(a + a);
    const t0: number = (d-b)*a;
    const t1: number = (-b-d)*a;

    // one of the roots could be BS, so take the one that produces a t-value whose x-value on the curve most closely matches the input
    const result: Array<number> = new Array<number>();
    if (t0 >= 0 && t0 <= 1) {
      result.push(t0);
    }

    if (t1 >= 0 && t1 <= 1) {
      result.push(t1);
    }

    return result
  }

  /**
   * Compute the y-coordinate(s) at the specified x-coordinate.  Note that There could be as many as two y-values on the
   * curve at the specified x-coordinate
   *
   * @param {number} x x-coordinate
   */
  public override getYAtX(x: number): Array<number>
  {
    // the necessary y-coordinates are the intersection of the curve with the line x = _x.  The curve is generated in the
    // form c0 + c1*t + c2*t^2, so the intersection satisfies the equation Bx(t) = _x or Bx(t) - _x = 0, or c0x-_x + c1x*t + c2x*t^2 = 0,
    // which is quadratic in t.  I wonder what formula can be used to solve that ????
    if (this._invalidated) this.__update();

    const c: number = this._c0X - x;
    const b: number = this._c1X;
    let a: number   = this._c2X;

    if (Math.abs(a) < 0.0001)
    {
      const x1: number = this.getX(0);
      const x2: number = this.getX(1);

      return [ (x - x1)/(x2 - x1) ];
    }

    let d: number = b*b - 4*a*c;
    if (d < 0)
    {
      // no solutions
      return [];
    }

    d                = Math.sqrt(d);
    a                = 1/(a + a);
    const t0: number = (d-b)*a;
    const t1: number = (-b-d)*a;

    // allow for natural parameters outside [0,1] since the curve can be extrapolated
    return [ this.getY(t0), this.getY(t1) ];
  }

  /**
   * Compute the x-coordinate(s) at the specified y-coordinate.  Note that there could be as many as two x-values on the
   * curve at the specified y-coordinate
   *
   * @param {number} y y-coordinate
   */
  public override getXAtY(y: number): Array<number>
  {
    // the necessary y-coordinates are the intersection of the curve with the line y = _y.  The curve is generated in the
    // form c0 + c1*t + c2*t^2, so the intersection satisfies the equation By(t) = _y or By(t) - _y = 0, or
    // c0y-_y + c1y*t + c2y*t^2 = 0, which is quadratic in t.

    if (this._invalidated) this.__update();

    const c: number = this._c0Y - y;
    const b: number = this._c1Y;
    let a: number   = this._c2Y;

    let d: number = b*b - 4*a*c;
    if (d < 0)
    {
      // no solutions
      return [];
    }

    d                = Math.sqrt(d);
    a                = 1/(a + a);
    const t0: number = (d-b)*a;
    const t1         = (-b-d)*a;

    // allow natural parameters outside of [0,1] as the curve can be extrapolated for t-values outside that range
    return [ this.getY(t0), this.getY(t1) ];
  }

  /**
   * Compute the actual arc length at the specified natural parameter value
   *
   * @param {number} t Natural parameter - must be in [0,1]
   */
  public sAtT(t: number): number
  {
    if (this._invalidated) this.__update();

    // todo fix magic constant -> zero tol
    if (Math.abs(this._length) < 0.00001) return 0;

    // outliers
    if (t <= 0) return 0;

    if (t >= 1) return this._length;

    this._integral = this._integral || new Gauss();

    return this._integral.eval( (t: number) => this.__integrand(t), 0, t, 5 );
  }

  /**
   * Compute the polynomial coefficients of the Bezier curve given the current geometric constraints (control points)
   *
   * @private
   */
  protected __computeCoef(): void
  {
    this._c0X = this._x0;
    this._c0Y = this._y0;

    this._c1X = 2.0*(this._cx-this._x0);
    this._c1Y = 2.0*(this._cy-this._y0);

    this._c2X = this._x0-2.0*this._cx+this._x1;
    this._c2Y = this._y0-2.0*this._cy+this._y1;
  }

  /**
   * Update the coefficients and arc length for the current geometric constraints (control points)
   *
   * @private
   */
  protected __update(): void
  {
    this.__computeCoef();
    this._integral = this._integral || new Gauss();

    this._length      = this._integral.eval( (t: number) => this.__integrand(t), 0, 1, 8 );
    this._invalidated = false;
  }

  /**
   * Integrand for numerical computation of arc length
   *
   * @param {number} t Natural parameter in [0,1]
   * @private
   */
  protected __integrand(t: number): number
  {
    const xPrime: number = this._c1X + 2*t*this._c2X;
    const yPrime: number = this._c1Y + 2*t*this._c2Y;

    return Math.sqrt( xPrime*xPrime + yPrime*yPrime );
  }
}
