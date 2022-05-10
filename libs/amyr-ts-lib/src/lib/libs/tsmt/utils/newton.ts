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

import { FcnEval } from "../../../models/geometry";

/**
 * AMYR Library: Compute simple roots of the equation f(x) = 0 given a starting point and convergence
 * criteria, using Newton's method.  To use, set the iteration limit and tolerance, then call the {findRoot} method.
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */
export class Newton
{
  protected static TOLERANCE  = 0.000001;
  protected static ZERO_TOL   = 0.00000000000001;
  protected static ITER_LIMIT = 100;

  protected _iter      = 0;                           // number of iterations
  protected _iterLimit: number = Newton.ITER_LIMIT;   // maximum number of allowed iterations
  protected _tolerance: number = Newton.TOLERANCE;    // tolerance for convergence (absolute error between iterates)

  constructor()
  {
    // empty
  }

 /**
  * Access iteration count
  */
  public get iterations(): number
  {
    return this._iter;
  }

  /**
   * Assign convergence tolerance
   *
   * @param {number} tol Absolute convergence tolerance value (must be greater than zero)
   */
  public set tolerance(tol: number)
  {
    this._tolerance = isNaN(tol) || !isFinite(tol) || tol <= 0 ? this._tolerance : tol;
  }

  /**
   * Assign iteration limit
   *
   * @param {number} limit  Maximum number of allowed iterations (must be greater than zero)
   */
  public set iterLimit(limit: number)
  {
    this._iterLimit = isNaN(limit) || !isFinite(limit) || limit <= 0 ? this._iterLimit : Math.round(limit);
  }

  /**
   * Find an approximate root of the supplied function based on tolerance and iteration limit
   *
   * @param {number} start Desired starting point for iteration
   *
   * @param {FcnEval} fcn (number):number Used to evaluate f(x)
   *
   * @param {FcnEval} deriv (number):number Used to evaluate f'(x)
   */
  public findRoot(start: number, fcn: FcnEval, deriv: FcnEval): number
  {
    this._iter           = 0;
    let previous: number = start;

    if (fcn === undefined || fcn == null || deriv === undefined || deriv == null) {
      return start;
    }

    this._iter             = 1;
    let derivative: number = deriv(previous);
    let x: number          = Math.abs(derivative) < Newton.ZERO_TOL ? -Number.MAX_VALUE : previous - fcn(previous)/derivative;
    let finished: boolean  = Math.abs(x - previous) < this._tolerance;

    while (this._iter < this._iterLimit && !finished)
    {
      previous = x;

      derivative = deriv(previous);
      x          = Math.abs(derivative) < Newton.ZERO_TOL ? -Number.MAX_VALUE : previous - fcn(previous)/derivative;
      finished   = Math.abs(x - previous) < this._tolerance;

      this._iter++;
    }

    return x;
  }
}
