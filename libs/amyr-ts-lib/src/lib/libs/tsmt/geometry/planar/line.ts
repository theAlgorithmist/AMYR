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
 * AMYR Library: Parametric representation of a line in two dimensions.  The line passes through two points
 * (x0,y0) and (x1,y1).  The line segment between these two points is parameterized by t, in [0,1].  Parameter values
 * outside this interval extrapolate points on the line.
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */

export class Line
{
  // two points that define the line
  protected _x0     = 0;
  protected _y0     = 0;
  protected _x1     = 0;
  protected _y1     = 0;
  protected _length = 0;

  constructor()
  {
    // empty
  }

 /**
  *  Access the slope of this line, as if the line was in the form y = mx + b.  Note that near-infinite slope returns
  *  {Number.MAX_VALUE}.
  */
  public get m(): number
  {
    // don't forget basic calculus ... the good old chain rule :)
    const dx: number = this.getXPrime(0.5);
    return Math.abs(dx) < 0.00000001 ? Number.MAX_VALUE : this.getXPrime(0.5)/dx;
  }

 /**
  *  Access the y-intercept of this line, as if the line was in the form y = mx + b.
  */
  public get b(): number
  {
    const t: number = this.getTAtX(0);
    return this.getY(t);
  }

 /**
  * Access the x-coordinate of the first point
  */
  public get x0(): number
  {
    return this._x0;
  }

  /**
   * Assign the x-coordinate of the first point
   *
   * @param {number} value x-coordinate value
   */
  public set x0(value: number)
  {
    this._x0 = isNaN(value) || !isFinite(value) ? this._x0 : value;
  }

  /**
   * Access the x-coordinate of the second point
   */
  public get x1()
  {
    return this._x1;
  }

  /**
   * Assign the x-coordinate of the second point
   *
   * @param {number} value : x-coordinate value
   *
   * @returns {nothing}
   */
  public set x1(value: number)
  {
    this._x1 = isNaN(value) || !isFinite(value) ? this._x1 : value;
  }

  /**
   * Access the y-coordinate of the first point
   */
   public get y0(): number
   {
     return this._y0;
   }

  /**
   * Assign the y-coordinate of the first point
   *
   * @param {number} value y-coordinate value
   */
  public set y0(value: number)
  {
    this._y0 = isNaN(value) || !isFinite(value) ? this._y0 : value;
  }

  /**
   * Access the y-coordinate of the second point
   *
   */
  public get y1(): number
  {
    return this._y1;
  }

  /**
   * Assign the y-coordinate of the second point
   *
   * @param {number} value y-coordinate value
   */
  public set y1(value: number)
  {
    this._y1 = isNaN(value) || !isFinite(value) ? this._y1 : value;
  }

  /**
   * Evaluate the x-coordinate at a parameter value
   *
   * @param {number} t Parameter value.  t in [0,1] queries x-coordinates from x0 to x1.  Negative values query x-coordinates
   * less than x0 and parameter values greater than 1 query x-coordinates greater than x1.
   */
  public getX(t: number): number
  {
    return (1-t)*this._x0 + t*this._x1;
  }

  /**
   * Evaluate the y-coordinate at a parameter value
   *
   * @param {number} t Parameter value.  t in [0,1] queries y-coordinates from y0 to y1.  Negative values query y-coordinates
   * less than y0 and parameter values greater than 1 query y-coordinates greater than x1.
   */
  public getY(t: number): number
  {
    return (1-t)*this._y0 + t*this._y1;
  }

  /**
   * Evaluate x'(t) or the first derivative of x with respect to t, evaluated at the specified parameter value
   *
   * @param {number} t Parameter value.
   */
  public getXPrime(t: number): number
  {
    return this._x1 - this._x0;
  }

  /**
   * Evaluate y'(t) or the first derivative of y with respect to t, evaluated at the specified parameter value
   *
   * @param {number} t Parameter value.
   */
  public getYPrime(t: number): number
  {
    return this._y1 - this._y0;
  }

  /**
   * Query the natural parameter at a specific arc-length from (x0,y0), similar to methods provided for higher-order
   * parametric curves.  s = 0 is trivial and returns t = 0. This method returns 1 for any input length that exceeds
   * the Euclidean distance between (x0,y0) and (x1,y1)
   *
   * @param {number} s Length value - must be greater than zero.
   */
  public getTAtLength(s: number):  number
  {
    if (s < 0) return 0;

    if (s > 1) return 1;

    return s;
  }

  /**
   * Query the natural parameter at the specified x-coordinate.  This value will be in [0,1] if x is in [x0,x1].
   * The returned parameter will be negative if x < x0 and greater than 1 if x > x1.
   *
   * @param {number} x Input x-coordinate
   */
  public getTAtX(x: number): number
  {
    const dx: number = this._x1 - this._x0;

    // todo magic constant
    if (Math.abs(dx) < 0.0000001) return this._y0;

    return (x-this._x0) / dx;
  }

  /**
   * Query the y-coordinate at the specified x-coordinate.   It is possible that the query may be degenerate,
   * i.e. a vertical line and an input x-coordinate other than the x-intercept.  The method returns y0 in such cases.
   *
   * @param {number} x Input x-coordinate
   */
  public getYAtX(x: number): number
  {
    // solve for t at the specified x-coordinate, i.e. (1-t)*x0 + t*x1 = x -> t(x1-x0) = x - x0 or = (x-x0)/(x1-x0).
    // return y0 if the line is degenerate
    const dx: number = this._x1 - this._x0;

    // todo magic constant
    if (Math.abs(dx) < 0.0000001) return this._y0;

    const t: number = (x-this._x0)/dx;

    return this.getY(t);
  }

  /**
   * Query the x-coordinate at the specified y-coordinate.  It is possible that the query may be degenerate,
   * i.e. a vertical line and an input x-coordinate other than the x-intercept.  The method returns y0 in such cases.
   *
   * @param {number} x Input x-coordinate
   */
  public getXAtY(y: number): number
  {
    // solve for t at the specified y-coordinate, i.e. (1-t)*y0 + t*y1 = y -> t(y1-y0) = y - y0 or = (y-y0)/(y1-y0).
    // return x0 if the line is degenerate
    const dy: number = this._y1 - this._y0;

    // todo magic constant
    if( Math.abs(dy) < 0.0000001 ) return this._x0;

    const t: number = (y-this._y0)/dy;

    return this.getX(t);
  }

  /**
   * Query the length at the specified parameter value, starting from the initial point.  An input value of 1 for a
   * line returns the Euclidean distance from (x0,y0) to (x1,y1). An input value of 2 returns twice the distance from
   * (x0,y0) to (x1,y1).  Return value is always greater than or equal to zero.
   *
   * @param {number} s Input parameter, typically in [0,1], but could be greater.
   */
  public lengthAt(s: number): number
  {
    // todo magic constant
    if (Math.abs(this._length) < 0.0000001) return 0;

    const x: number  = this.getX(s);
    const y: number  = this.getY(s);
    const dx: number = x - this._x0;
    const dy: number = y - this._y0;

    return Math.sqrt(dx*dx + dy*dy);
  }
}
