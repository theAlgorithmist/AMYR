/**
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
 * AMYR Library: Cubic Bezier with arc-length parameterization
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */
// import {
//   IControlPoints,
//   ICurveCoefs,
//   IPoint
// } from './IPlanarCurve';
  import {
    ControlPoints,
    CurveCoefs,
    FcnEval,
    Gauss,
    Point,
    twbrf,
    PlanarCurve,
    solve2x2,
    bisect
} from "@algorithmist/amyr-ts-lib";

  import { Interval } from "@algorithmist/amyr-ts-lib";

export class CubicBezier extends PlanarCurve
{
  // cubic polynomial coefficient values
  protected _c0X= 0;
  protected _c0Y= 0;
  protected _c1X= 0;
  protected _c1Y= 0;
  protected _c2X= 0;
  protected _c2Y= 0;
  protected _c3X= 0;
  protected _c3Y= 0;

  protected _s= 0;         // cache recently requested normalized arc-length
  protected _t= 0;         // natural parameter at that normalized arc length;

  // arc length and normalized arc length, i.e. fraction of total length in [0,1]
  protected _length= 0;

  // numerical integration (created on-demand)
  protected _integral: Gauss | null = null;

  /**
   * Construct a new TSMT$CubicBezier which is a {PlanarCurve} after construction
   */
  constructor()
  {
    super();
  }

  public override get order(): number { return 3 }

  public override get coefs(): CurveCoefs
  {
    return {
      c0x: this._c0X,
      c0y: this._c0Y,
      c1x: this._c1X,
      c1y: this._c1Y,
      c2x: this._c2X,
      c2y: this._c2Y,
      c3x: this._c3X,
      c3y: this._c3Y
    }
  }

  /**
   * Initialize the curve from a set of control points defined in an {Object}
   *
   * @param {ControlPoints} control
   */
  public override fromObject(control: ControlPoints): void
  {
    this.x0  = control.x0;
    this.y0  = control.y0;
    this.cx  = control.cx;
    this.cy  = control.cy;
    this.cx1 = control.cx1 === undefined || isNaN(control.cx1) ? 0 : control.cx1 as number;
    this.cy1 = control.cy1 === undefined || isNaN(control.cy1) ? 0 : control.cy1 as number;
    this.x1  = control.x1;
    this.y1  = control.y1;
  }

  /**
   * Access the x-coordinate at the specified value of the natural parameters
   *
   * @param {number} t Natural parameter value, normally in [0,1] but values outside that interval
   * are allowed for extrapolation purposes
   */
  public override getX(t: number): number
  {
    if (this._invalidated) this.__update();

    // evaluate cubic polynomial with nested multiplication
    return this._c0X + t*(this._c1X + t*(this._c2X + t*this._c3X));
  }

  /**
   * Access the y-coordinate at the specified value of the natural parameters
   *
   * @param {number} t Natural parameter value, normally in [0,1] but values outside that interval
   * are allowed for extrapolation purposes
   */
  public override getY(t: number): number
  {
    if (this._invalidated) this.__update();

    // evaluate cubic polynomial with nested multiplication
    return this._c0Y + t*(this._c1Y + t*(this._c2Y + t*this._c3Y));
  }

  /**
   * Access the x-coordinate of the first derivative of the cubic Bezier at the specified value of the natural parameters
   *
   * @param {number} t Natural parameter value, normally in [0,1] but values outside that interval
   * are allowed for extrapolation purposes.
   */
  public override getXPrime(t: number): number
  {
    if (this._invalidated) this.__update();

    // x-coordinate of first derivative of cubic curve
    return this._c1X + 2*t*this._c2X + 3*t*t*this._c3X;
  }

  /**
   * Access the y-coordinate of the first derivative of the cubic Bezier at the specified value of the natural parameters
   *
   * @param {number} t Natural parameter value, normally in [0,1] but values outside that interval
   * are allowed for extrapolation purposes
   */
  public override getYPrime(t: number): number
  {
    if (this._invalidated) this.__update();

    // y-coordinate of first derivative of cubic curve
    return this._c1Y + 2*t*this._c2Y + 3*t*t*this._c3Y;
  }

  /**
   * Interpolate four points with a cubic Bezier using chord-length parameterization.  The return array contains t1
   * and t2 as the computed natural parameter values for the interior geometric constraints, i.e. (cx, cy) and (cx1, cy1).
   * The internal geometric constraints of the cubic Bezier are computed such that the curve now interpolates the four
   * input points.  No action is taken if the length of the input array is less than 4.
   *
   * @param {Array<IPoint>} points Array of four Points.
   */
  public override interpolate(points: Array<Point>): Array<number>
  {
    if (points.length < 4) return [];

    // no error-checking ... you break it, you buy it.
    const p0: Point = points[0];
    const p1: Point = points[1];
    const p2: Point = points[2];
    const p3: Point = points[3];

    const x0: number = p0.x;
    const y0: number = p0.y;
    const x1: number = p3.x;
    const y1: number = p3.y;

    // first and last points interpolate exactly
    this._x0 = x0;
    this._y0 = y0;
    this._x1 = x1;
    this._y1 = y1;

    // currently, this method auto-parameterizes the curve using chord-length parameterization.
    let deltaX: number = p1.x - p0.x;
    let deltaY: number = p1.y - p0.y;
    const d1: number   = Math.sqrt(deltaX*deltaX + deltaY*deltaY);

    deltaX           = p2.x - p1.x;
    deltaY           = p2.y - p1.y;
    const d2: number = Math.sqrt(deltaX*deltaX + deltaY*deltaY);

    deltaX           = p3.x - p2.x;
    deltaY           = p3.y - p2.y;
    const d3: number = Math.sqrt(deltaX*deltaX + deltaY*deltaY);

    const d: number  = d1 + d2 + d3;
    const t1: number = d1/d;            // P1 control point interpolates at this t-value
    const t2: number = (d1+d2)/d;       // P2 control point interpolates at this t-value

    // there are four unknowns (x- and y-coords for P1 and P2), which are solved as two separate
    // sets of two equations in two unknowns
    const t12: number = t1*t1;
    const t13: number = t1*t12;

    const t22: number = t2*t2;
    const t23: number = t2*t22;

    // x-coordinates of P1 and P2 (t = t1 and t2) - exercise: eliminate redudant computations in these equations
    const a11: number = 3*t13 - 6*t12 + 3*t1;
    const a12: number = -3*t13 + 3*t12;
    const a21: number = 3*t23 - 6*t22 + 3*t2;
    const a22: number = -3*t23 + 3*t22;

    let b1: number = -t13*x1 + x0*(t13 - 3*t12 + 3*t1 - 1) + p1.x;
    let b2: number = -t23*x1 + x0*(t23 - 3*t22 + 3*t2 - 1) + p2.x;

    // beware nearly or exactly co-incident interior interpolation points
    let p: Point = solve2x2(a11, a12, a21, a22, b1, b2);

    // null vector sign of near-zero determinant
    if (p.x === 0 && p.y === 0)
    {
      // degenerates to a parabolic interpolation
      const t1m1: number  = 1.0 - t1;
      const tSq: number   = t1*t1;
      const denom: number = 2.0*t1*t1m1;

      // to do - handle case where this degenerates into all overlapping points (i.e. denom is numerically zero)
      this.cx = (p1.x - t1m1*t1m1*x0 - tSq*p2.x)/denom;
      this.cy = (p1.y - t1m1*t1m1*y0 - tSq*p2.y)/denom;

      this.cx1 = this.cx;
      this.cy1 = this.cy;

      this._invalidated = true;

      return [t1, t1];
    }
    else
    {
      this.cx  = p.x;
      this.cx1 = p.y;
    }

    // y-coordinates of P1 and P2 (t = t1 and t2)
    b1 = -t13*y1 + y0*(t13 - 3*t12 + 3*t1 - 1) + p1.y;
    b2 = -t23*y1 + y0*(t23 - 3*t22 + 3*t2 - 1) + p2.y;

    // resolving with same coefficients, but new RHS
    p        = solve2x2(a11, a12, a21, a22, b1, b2);
    this.cy  = p.x;
    this.cy1 = p.y;

    this._invalidated = true;

    return [t1, t2];
  }

  /**
   * Compute the actual arc length at the specified natural parameter value
   *
   * @param {number} t Natural parameter - must be in [0,1]
   */
  public sAtT(t: number): number
  {
    if (this._invalidated) this.__update();

    // todo remove magic constant -> zero tol
    if (Math.abs(this._length) < 0.00001) return 0;

    // outliers
    if (t <= 0) return 0;

    if (t >= 1) return this._length;

    this._integral = this._integral || new Gauss();

    return this._integral.eval( (t: number) => this.__integrand(t), 0, t, 5);
  }

  /**
   * Compute the natural parameter value at the specified normalized arc-length value
   *
   * @param {number} s Normalized arc length in [0,1]
   */
  public override getTAtS(_s: number): number
  {
    // normalized arc length must be in [0,1]
    let s: number = Math.max(0,_s);
    s             = Math.min(s, 1);

    // edge cases at beginning and end of curve
    if (s === 0)
    {
      this._s = this._t = 0;
      return 0;
    }

    if (s === 1)
    {
      this._s = this._t = 1;
      return 1;
    }

    this._invalidated = false;

    this._integral = this._integral || new Gauss();

    const invFcn: FcnEval = (t: number): number => {
      return (this._integral as Gauss).eval((t: number) => this.__integrand(t), 0, t, 8)/this._length - s;
    };

    // the name of the game is to quickly get an interval containing the arc length, then let TWBRF do its work;
    // the new t-value is in either [0,_t) or (_t,1] depending on whether or not s > _s or s < _s.
    let left  = 0;
    let right = 1;

    if (s > this._s)
    {
      // moving uniformly forward in arc-length is the most expected use case
      left = this._t + 0.001;
    }
    else
    {
      right = this._t - 0.001;
    }

    // because of the non-decreasing relationship between the natural parameter and normalized arc length,
    // we know that the t-parameter corresponding to the requested s is in the interval [left, right], provided
    // the delta between subsequent requests for s is sufficiently large for the hardcoded delta-t (that's
    // the trick in this approximation scheme).
    let t: number = twbrf(left, right, invFcn);
    if (t >= 0 && t <= 1)
    {
      this._s = s;
      this._t = t;
    }
    else
    {
      // default to beginning of curve
      t = 0;
    }

    return t;
  }

  /**
   * Return the natural parameter(s) at the specified x-coordinate. This return array contains either one,
   * two, or three t-values.  There are issues with curves that are exactly or nearly (for numerical purposes)
   * vertical in which there could theoretically be an infinite number of y-coordinates for a single x-coordinate.
   * This method does not work in such cases, although compensation might be added in the future.  Returns an empty
   * array in the event of an error.
   *
   * @param {number} x x-coordinate value inside the range covered by the Bezier in [0,1]; that is there
   * must exist t in [0,1] such that Bx(t) = x.
   */
  public override getTAtX(x: number): Array<number>
  {
    // the necessary y-coordinates are the intersection of the curve with the line x = _x.  The curve is generated in the
    // form c0 + c1*t + c2*t^2 + c3*t^3, so the intersection satisfies the equation
    // Bx(t) = _x or Bx(t) - _x = 0, or c0x-_x + c1x*t + c2x*t^2 + c3x*t^3 = 0.
    if (this._invalidated) this.__update();

    // Find one root - any root - then factor out (t-r) to get a quadratic poly. for the remaining roots
    const f: FcnEval = (t: number): number => {
      return + this._c0X + t*(this._c1X + t*(this._c2X + t*(this._c3X))) - x;
    };

    // some curves that loop around on themselves may require bisection
    const interval: Interval | null = bisect(0, 1, f);

    if (interval == null) return [];

    // experiment with tolerance - but not too tight :)
    const t0: number = twbrf(interval.left, interval.right, f);
    const e: number  = Math.abs(f(t0));
    if (e > 0.001)
    {
      // compensate in case method quits due to error
      return [];
    }

    const result: Array<number> = [];
    if (t0 <= 1) result.push(t0);

    // Factor theorem: t-r is a factor of the cubic polynomial if r is a root.  Use this to reduce to a quadratic poly.
    // using synthetic division
    let a: number   = this._c3X;
    const b: number = t0*a+this._c2X;
    const c: number = t0*b+this._c1X;

    // process the quadratic for the remaining two possible roots
    let d: number = b*b - 4*a*c;
    if (d < 0) return result;

    d                = Math.sqrt(d);
    a                = 1/(a + a);
    const t1: number = (d-b)*a;
    const t2: number = (-b-d)*a;

    if (t1 >= 0 && t1 <= 1) result.push(t1);

    if (t2 >= 0 && t2 <= 1) result.push(t2);

    return result;
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

    const dX: number = 3.0*(this._cx-this._x0);
    const dY: number = 3.0*(this._cy-this._y0);
    this._c1X        = dX;
    this._c1Y        = dY;

    const bX: number = 3.0*(this._cx1-this._cx) - dX;
    const bY: number = 3.0*(this._cy1-this._cy) - dY;
    this._c2X        = bX;
    this._c2Y        = bY;

    this._c3X = this._x1 - this._x0 - dX - bX;
    this._c3Y = this._y1 - this._y0 - dY - bY;
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
   *
   * @private
   */
  protected __integrand(t: number): number
  {
    const xPrime: number = this._c1X + 2*t*this._c2X + 3*t*t*this._c3X;
    const yPrime: number = this._c1Y + 2*t*this._c2Y + 3*t*t*this._c3Y;

    return Math.sqrt( xPrime*xPrime + yPrime*yPrime );
  }
}
