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
 * AMYR Library: Compute cubic roots of a polynomial with real coefficients.  Assign the two endpoints of the
 * interval and then call the {getRoots} method.
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */

import { twbrf } from "./twbrf";

import {
  Interval,
  FcnEval
} from "../../../models/geometry";

export class CubicRoots
{
  protected static BISECT_LIMIT = 0.05;

  // endpoints
  protected _x0: number;
  protected _x1: number;

  constructor()
  {
    this._x0 = 0;
    this._x1 = 0;
  }

  /**
   * Assign lower endpoint of the search interval
   *
   * @param {number} value Lower endpoint of search interval
   */
  public set x0(value: number)
  {
    this._x0 = isNaN(value) ? this._x0 : value;
  }

  /**
   * Assign upper endpoint of the search interval
   *
   * @param {number} value Upper endpoint of search interval
   */
  public set x1(value: number)
  {
    this._x1 = isNaN(value) ? this._x1 : value;
  }

  /**
   * Compute simple, real, roots of the cubic polynomial in the interval [x0,x1], i.e. solutions to i.e. solutions to
   * c0 + c1*x + c2*x^2 + c3*x^3 = 0. Return Array length is zero if no roots are found.
   *
   * @param {number} c0 Constant coefficient of the polynomial
   *
   * @param {number} c1 Coefficient of the linear term of the polynomial
   *
   * @param {number} c2 Coefficient of the quadratic term of the polynomial
   *
   * @param {number} c3 Coefficient of the cubic term of the polynomial
   */
  public getRoots(c0: number = 0, c1: number = 0, c2: number = 0, c3: number = 0)
  {
    if (c0 == 0 && c1 == 0 && c2 == 0 && c3 == 0) {
      return [0];
    }

    const roots: Array<number> = new Array<number>();

    // validate interval
    if (this._x1 <= this._x0 || Math.abs(this._x1 - this._x0) < 0.0001) {
      return roots;
    }

    // Bairstow's algorithm is probably overkill for a cubic unless you have absolutely no idea of how to bound the roots.
    // Most of the time, we have some idea of either bounds for all roots or a specific interval in which we want roots,
    // so the solution is pretty simple - use Bisection to bound one root in the specified interval.  Compute that single
    // root, then use synthetic division to divide out the factor.  Use the quadratic formula for the remaining roots.
    const f: FcnEval                = (_x: number): number => {return c0 + _x * (c1 + _x * (c2 + _x * (c3)));};
    const interval: Interval | null = this.__bisection(f, this._x0, this._x1);

    if (!interval) return roots;

    // first root
    const r0: number        = twbrf(interval.left, interval.right, f, 0.001);
    const evaluated: number = Math.abs(f(r0));
    if (evaluated > 0.001) return roots;   // compensate in case method quits due to error

    // is the root in the specified interval?
    if (r0 >= this._x0 && r0 <= this._x1) roots.push(r0);

    // Factor theorem: t-r is a factor of the cubic polynomial if r is a root; reduce to a quadratic poly. using synthetic division
    let a: number   = c3;
    const b: number = r0 * a + c2;
    const c: number = r0 * b + c1;

    // process the quadratic for the remaining two possible roots
    let d: number = b * b - 4 * a * c;
    if (d < 0) return roots;

    d = Math.sqrt(d);
    a = 1 / (a + a);

    const r1: number = (d - b) * a;
    const r2: number = (-b - d) * a;

    if (r1 >= this._x0 && r1 <= this._x1) roots.push(r1);

    if (r2 >= this._x0 && r2 <= this._x1) roots.push(r2);

    return roots;
  }

  // todo: inline the bisection for more performance
  protected __bisection(f: FcnEval, left: number, right: number): Interval | null
  {
    if (Math.abs(right - left) <= CubicRoots.BISECT_LIMIT) return null;

    const middle: number = 0.5*(left + right);
    if (f(left) * f(right) <= 0)
    {
      return {left: left, right: right};
    }
    else
    {
      const leftInterval: Interval | null = this.__bisection(f, left, middle);
      if (leftInterval != null) return leftInterval;

      const rightInterval: Interval | null = this.__bisection(f, middle, right);
      if (rightInterval != null) return rightInterval;

      return null;
    }
  }
}
