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
 * Typescript Math Toolkit: Some basic functions for the chi-squared distribution
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */

import {
  gammaln,
  gammp,
  invgammp
} from "./special-fcn";

export class ChiSquare
{
  private _fac:number;
  private _nu: number;

  constructor()
  {
    this._fac = 0.0;
    this._nu  = 1;
  }

  /**
   * Access the number degrees of freedom (should be integral, one or higher)
   */
  public get nu(): number
  {
    return this._nu;
  }

  /**
   * Assign the nu value or number of degrees of freedom
   *
   * @param {number} nu Number of degrees of freedom - must be integral and defaults to 1.0 on incorrect input
   */
  public set nu(value: number)
  {
    let nu: number = isNaN(value) || !isFinite(value) || value < 1 ? 1 : value;
    nu             = Math.floor(nu);

    this._nu  = nu;
    this._fac = 0.6931471805599453*(0.5*nu) + gammaln(0.5*nu);
  }

  /**
   * Probability that an observed chi-square for a correct model is less than an input value
   *
   * @param {number} x2 Input value (greater than zero)
   */
  public p(x2: number): number
  {
    if( x2 <= 0.0 ) return 0.0;

    return Math.exp( -0.5*(x2 - (this._nu - 2.0)*Math.log(x2)) - this._fac);
  }

  /**
   * Chi-square CDF value.  Zero is returned for a data error
   *
   * @param x2 : Number - Input value (greater than zero)
   */
  public cdf(x2: number): number
  {
    if ( isNaN(x2) || x2 <= 0.0) return 0.0;

    return gammp(this._nu/2, 0.5*x2);
  }

  /**
   * Chi-square q-value (often used in cross-table analysis), which is a probability value in [0,1].  q = 1-p is the
   * probability that the table relationships occur by chance.  -1 is returned on input data error
   *
   * @param {number} x2 Input value (greater than zero)
   */
  public q(x2: number): number
  {
    if (x2 <= 0.0) return -1.0;

    return 1.0 - gammp(this._nu/2, 0.5*x2);
  }

  /**
   * Critical chi-square value or what must the chi-2 value be to support the supplied probability, i.e. inverse CDF?
   *
   * @param {number} p Probability in [0,1] - clamped to zero if out of range
   */
  public invCDF(p: number): number
  {
    p = isNaN(p) || (p < 0.0 || p > 1.0) ? 0.0 : p;

    return 2.0*invgammp(p, 0.5*this._nu);
  }
}
