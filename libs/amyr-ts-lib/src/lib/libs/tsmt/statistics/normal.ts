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
 * AMYR Library: Computations involving normal distributions
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */

import {
  SQRT_2_PI,
  SQRT_2
} from "../../../models/constants";

export class Normal
{
  // mean and std. dev. of the distribution
  protected _mean = 0.0;
  protected _std  = 1.0;

  // for rational approx. of inv. cumulative normal
  protected readonly __a: Array<number> = [
    -39.69683028665376,
    220.9460984245205,
    -275.9285104469687,
    138.3577518672690,
    -30.66479806614716,
    2.506628277459239
  ];

  protected readonly __b: Array<number> = [
    -54.47609879822406,
    161.5858368580409,
    -155.6989798598866,
    66.80131188771972,
    -13.28068155288572
  ];

  protected readonly __c: Array<number> = [
    -.007784894002430293,
    -.3223964580411365,
    -2.400758277161838,
    -2.549732539343734,
    4.374664141464968,
    2.938163982698783
  ];

  protected readonly __d: Array<number> = [
    .007784695709041462,
    .3224671290700398,
    2.445134137142996,
    3.754408661907416
  ];

  constructtor()
  {
    // empty
  }

  /**
   * Access the current mean
   */
  public get mean(): number
  {
    return this._mean;
  }

  /**
   * Assign a mean to this normal distribution
   *
   * @param {number} value Mean for the normal distribution (must be greater than or equal to zero)
   */
  public set mean(value: number)
  {
    this._mean = !isNaN(value) && value >= 0 ? value : this._mean
  }

  /**
   * Access the current standard deviation
   */
  public get std(): number
  {
    return this._std;
  }

  /**
   * Assign a standard deviation to this normal distribution
   *
   * @param {number} value Std. dev. for the normal distribution (must be greater than zero)
   *
   * @return Nothing
   */
  public set std(value: number)
  {
    this._std = !isNaN(value) && value > 0 ? value : this._std;
  }

  /**
   * Compute the probability that N(X) <= x
   *
   * @param {number} x Input value to test
   */
  public normaldist(x: number): number
  {
    if( isNaN(x) ) return 0;

    // normalize to unit
    const z: number = (x - this._mean)/this._std;

    return this.__normalCDF(z);
  }

  /**
   * Inverse normal distribution, i.e., x such that P(X<=x) = p.  Note that p MUST be strictly in the open interval (0,1).
   * You break it, you buy it.
   *
   * @param {number} p Probability in (0,1)
   */
  public invnormaldist(p: number): number
  {
    const inv: number = this.__invNormalCDF(p);

    return this._std*inv + this._mean;
  }

  /**
   * Prediction interval or probability that a sample from the current normal distribution lies within {n}
   * standard deviations of the mean.  The result is computed for a standard normal distribution.
   *
   * @param {number} n Number of standard deviations from the mean - must be greater than zero
   */
  public predictionInterval(n: number): number
  {
    if (n <= 0) return 0;

    return this.__normalCDF(n) - this.__normalCDF(-n) ;
  }

  /**
   * Return the prediction or confidence interval as a multiplier to the standard deviation such that a
   * sample from the distribution is expected to be inside that range with the supplied probability.  If u is the
   * mean and s is the standard deviation, then X is expected to be in u +/- ns with probability, p.
   *
   * @param {number} p Probability - must be in (0,1)
   */
  public inversePredictionInterval(p: number): number
  {
    if (p <= 0 || p >= 1 ) return NaN;

    return SQRT_2*this.__invERF(p);
  }

  /**
   * Evaluate the normal function at the supplied input value.  Returns N(x) or normal distribution function
   * (not CDF) evaluated at x
   *
   * @param {number} x x-coordinate
   */
  public getNormal(x: number): number
  {
    const z: number = (x-this._mean)/this._std;
    const d: number = -0.5*z*z;
    const c: number = 1/(this._std*SQRT_2_PI);

    return c * Math.exp(d);
  }

  /**
   * Evaluate the first derivative of the normal function at the supplied input value
   *
   * @param {number} x x-coordinate
   */
  public getNormalDerivative(x: number): number
  {
    const s: number = this._std*this._std;
    const f: number = this.getNormal(x);

    return (this._mean - x)*f/s;
  }

  // internal methods for normal CDF and inverse
  //
  // References:  Hart, J.F., Computer Approximations, SIAM Series in Applied Mathematics, Wiley, N.Y., 1968.
  // Cody, J.W., Rational Chebyshev Approximations for the Error Function, Math. Comp., 1969, pp. 631-637.
  // lest anyone think I'm making this up myself :)
  protected __normalCDF(x: number): number
  {
    let b: number;
    let c: number;

    // Hart approximation
    const zAbs = Math.abs(x);

    if (zAbs > 37) return 0;

    const e: number = Math.exp(-0.5*zAbs*zAbs);
    if (zAbs < 7.07106781186547)
    {
      b = 0.0352624965998911*zAbs + 0.700383064443688;
      b = b*zAbs + 6.37396220353165;
      b = b*zAbs + 33.912866078383;
      b = b*zAbs + 112.079291497871;
      b = b*zAbs + 221.213596169931;
      b = b*zAbs + 220.206867912376;
      c = e*b;

      b = 0.0883883476483184*zAbs + 1.75566716318264;
      b = b*zAbs + 16.064177579207;
      b = b*zAbs + 86.7807322029461;
      b = b*zAbs + 296.564248779674;
      b = b*zAbs + 637.333633378831;
      b = b*zAbs + 793.826512519948;
      b = b*zAbs + 440.413735824752;

      c = c/b;
    }
    else
    {
      b = zAbs + 0.65;
      b = zAbs + 4/b;
      b = zAbs + 3/b;
      b = zAbs + 2/b;
      b = zAbs + 1/b;

      c = e / b / 2.506628274631;
    }

    if (x > 0) c = 1 - c;

    return c;
  }

  // Inverse normal CDF.  Serious props to Peter J. Acklman.
  protected __invNormalCDF(p: number): number
  {
    if (isNaN(p) || p > 1.0 || p < 0.0) return NaN;

    // (extreme) edge cases; todo - zero tol in constants file
    if (Math.abs(p) < 0.0000000000001) return -Number.MAX_VALUE;

    if (Math.abs(p-1) < 0.0000000000001) return Number.MAX_VALUE;

    let t: number, q: number, x: number;

    if (p < 0.02425)
    {
      // low
      q = Math.sqrt( -2*Math.log(p) );
      x = (((((this.__c[0]*q + this.__c[1])*q + this.__c[2])*q + this.__c[3])*q + this.__c[4])*q + this.__c[5]) /
        ((((this.__d[0]*q + this.__d[1])*q + this.__d[2])*q + this.__d[3])*q + 1.0);
    }
    else if( p <= 0.97575 )
    {
      // central
      q = p-0.5;
      t = q*q;
      x = (((((this.__a[0]*t + this.__a[1])*t + this.__a[2])*t + this.__a[3])*t + this.__a[4])*t + this.__a[5])*q /
        (((((this.__b[0]*t + this.__b[1])*t + this.__b[2])*t + this.__b[3])*t + this.__b[4])*t + 1.0);
    }
    else
    {
      // high
      q = Math.sqrt( -2*Math.log(1-p) );
      x = -(((((this.__c[0]*q + this.__c[1])*q + this.__c[2])*q + this.__c[3])*q + this.__c[4])*q + this.__c[5]) /
        ((((this.__d[0]*q + this.__d[1])*q + this.__d[2])*q + this.__d[3])*q + 1.0);
    }

    // note that this computation could be refined to further precision at the expense of performance.
    // Will see if this refinement is needed in a future release based on actual library usage.  Also, the
    // low/high (tail) region computations could be merged.
    return x;
  }

  // internal method - approximate inverse error function of suitable accuracy for prediction interval computations
  protected __invERF(x: number): number
  {
    // this is a quick-and-dirty implementation tha requires two sqrts.  I have another method that only uses
    // one sart in part of the domain, but it does not agree with published tables in some areas, so that one
    // is on hold.

    const w: number = Math.log( 1 - x*x );
    let p: number   = 18.75537 - 2.47197*w + .25*w*w;

    p = Math.sqrt(p);

    let t: number = p - 4.33074 - 0.5*w;
    t             = Math.sqrt(t);

    return t >= 0 ? t : -t;
  }
}
