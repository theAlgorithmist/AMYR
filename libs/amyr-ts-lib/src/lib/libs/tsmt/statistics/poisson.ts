/**
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
 * AMYR Library: Computations dealing with Poisson distribution
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */
import {
  gammaq,
  gammaln
} from "./special-fcn";

export class TSMT$Poisson
{
  // lambda-value of distribution
  protected _lambda = 1;

  constructor()
  {
    // empty
  }

  /**
   * Access the current lambda value
   */
  public get lambda(): number
  {
    return this._lambda;
  }

  /**
   * Assign a lambda for this distribution
   *
   * @param {number} value Lambda value, must be greater than zero
   */
  public set lambda(value: number)
  {
    this._lambda = !isNaN(value) && value > 0 ? value : this._lambda;
  }

  /**
   * Return the mean of the current distribution
   *
   */
  public get mean(): number
  {
    return this._lambda;
  }

  /**
   * Return the standard deviation of this distribution
   */
  public get std(): number
  {
    return Math.sqrt(this._lambda);
  }

  /**
   * Return the skewness of this distribution
   */
  public get skew(): number
  {
    return 1/Math.sqrt(this._lambda);
  }

  /**
   * Compute the probability of a given number of events
   *
   * @param {number} x (integer) Event count
   */
  public prob(x: number): number
  {
    if (isNaN(x)) return 0;

    x = Math.abs(Math.round(x));

    if (x < 0) return 0;

    return Math.exp( -this._lambda + x*Math.log(this._lambda) - gammaln(x+1.0) );
  }

  /**
   * Compute the probability of less than x events, i.e. P(X < x).  Call prob() method with same argument and add
   * result to compute P(X <= x).
   *
   * @param {number} x (integer) Success count
   */
  public cdf(x: number): number
  {
    if (isNaN(x)) return 0.0;

    x = Math.abs(Math.round(x));
    if (x <= 0) return 0.0;

    return gammaq(-x, this._lambda);
  }
}
