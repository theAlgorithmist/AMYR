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
 * Typescript Math Toolkit.  Deviates from various popular distributions.  All derived from NRC (Numerical Recipes in C).
 * Nothing new under the sun.
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */

import * as statConstants from '../../../models/constants';

export class Deviates
{
  protected _idum: number;
  protected _iv: Array<number>;
  protected _normVal: number;
  protected _u: number;
  protected _s: number;
  protected _a: number;
  protected _b: number;
  protected _a1: number;
  protected _a2: number;

  constructor()
  {
    this._idum  = 0;
    this._iv      = new Array<number>();
    this._normVal = 0;
    this._u       = 0;
    this._s       = 1;
    this._a       = 1.0;
    this._b       = 1.0;
    this._a1      = 0.0;
    this._a2      = 0.0;
  }

  /**
   * Return a Uniform deviate in (0,1)
   *
   * @param {number} start A starting value for the sequence.
   *
   * @param {boolean} init True if the sequence is to be re-initialized; call with true, then pass false for successive calls
   * @default true
   *
   * Reference:  NRC (aka ran1 - portable and only suffers from period exhaustion)
   */
  public uniform(start: number, init: boolean=true): number
  {
    let i: number
    let j: number;
    let k: number;

    let temp          = 0;
    let iy            = 0;
    const len: number = statConstants.NTAB + 7;

    if (init)
    {
      this._iv.length = 0;

      this._idum = isNaN(start) || start < 1 ? 1 : start;

      for (j = len; j >=0; j--)
      {
        k          = Math.floor( this._idum/statConstants.IQ );
        this._idum = statConstants.IA*(this._idum - k*statConstants.IQ) - statConstants.IR*k;

        if (this._idum < 0) this._idum += statConstants.IM;

        if (j < statConstants.NTAB) this._iv[j] = this._idum;
      }

      iy = this._iv[0];
    }

    k = Math.floor( this._idum / statConstants.IQ );
    this._idum = statConstants.IA*(this._idum - k*statConstants.IQ) - statConstants.IR*k;

    if (this._idum < 0) this._idum += statConstants.IM;

    j           = Math.floor(iy/statConstants.NDIV);
    iy          = this._iv[j];
    this._iv[j] = this._idum;

    temp = statConstants.AM*iy;
    return (temp > statConstants.RNMX) ? statConstants.RNMX : temp;
  }

  /**
   * Return an Exponential deviate
   *
   * @param {number} start A starting value for the sequence.
   *
   * @param {boolean} init True if the sequence is to be re-initialized; call with true, then pass false for successive calls
   * @default true
   *
   * @returns {number} Exponential deviate (positive, unit mean)
   *
   * Reference:  NRC
   */
  public exponential(start: number, init: boolean=true): number
  {
    let tmp = 0.0;

    while (tmp == 0.0) {
      tmp = this.uniform(start, init);
    }

    return -Math.log(tmp);
  }

  /**
   * Return a Normal deviate with the supplied mean and standard deviation
   *
   * @param {number} start A starting value for the sequence.
   *
   * @param {number} mu Desired mean
   *
   * @param {number} sig Desired std. deviation
   *
   * @param {boolean} init True if the sequence is to be re-initialized; call with true, then pass false for successive calls
   * @default true
   *
   * Reference:  NRC
   */
  public normal(start: number, mu: number, sig: number, init: boolean=true): number
  {
    let fac: number;

    let v1 = 0;
    let v2 = 0;
    let rsq  = 0.0;

    if (init)
    {
      this._u = isNaN(mu) || mu < 0 ? 0.0 : mu;
      this._s = isNaN(sig) || sig < 1.0 ? 1.0 : sig;
    }

    if (this._normVal == 0.0)
    {
      while (rsq >= 1.0 || rsq == 0.0)
      {
        v1  = 2.0*this.uniform(start, init) - 1.0;
        v2  = 2.0*this.uniform(start, init) - 1.0;
        rsq = v1*v1 + v2*v2;
      }

      fac = Math.sqrt(-2.0*Math.log(rsq)/rsq);

      this._normVal = v1*fac;
      return this._u + this._s * v2 * fac;
    }
    else
    {
      fac           = this._normVal;
      this._normVal = 0.0;

      return this._u + this._s*fac;
    }
  }

  /**
   * Return a Gamma deviate
   *
   * @param {number} start A starting value for the sequence.
   *
   * @param {number} alpha Shape parameter (sometimes denoted as k)
   *
   * @param {number} beta Inverse scale parameter (1/theta)
   *
   * @param {boolean} init True if the sequence is to be re-initialized; call with true, then pass false for successive calls
   * @default true
   *
   * @returns {number} Gamma deviate with zero mean and unit variance
   *
   * Reference:  NRC
   */
  public gamma (start: number, alpha: number, beta: number, init: boolean=true): number
  {
    if (start)
    {
      this._a  = isNaN(alpha) || (alpha <= 0.0) ? 1.0 : alpha;

      if (this._a < 1.0) this._a += 1.0;

      this._b  = isNaN(beta) || beta < 0.0001 ? 0.5 : beta;
      this._a1 = this._a - 1.0/3.0;
      this._a2 = 1.0/Math.sqrt(9.0*this._a1);
    }

    let u   = 10.0;
    let v   = 0.0;
    let x   = 0.0;
    let xSQ = 0.0;

    while (u > 1.0 - xSQ*xSQ && Math.log(u) > 0.5*xSQ + this._a1*(1.0 - v + Math.log(v)))
    {
      while (v <= 0.0)
      {
        x = this.uniform(start, init);
        v = 1.0 + this._a2*x;
      }

      v   = v*v*v;
      u   = this.uniform(start, init);
      xSQ = x*x;
    }

    return this._a1*v/this._b;
  }

  /**
   * Return a Logistic deviate
   *
   * @param {number} start A starting value for the sequence.
   *
   * @param {number} mu Desired mean
   *
   * @param {number} sig Desired std. deviation
   *
   * @param {boolean} init True if the sequence is to be re-initialized; call with true, then pass false for successive calls
   * @default true
   *
   * @return Number - Logistic deviate with supplied mean and variance
   *
   * Reference:  NRC
   */
  public logistic(start: number, mu: number, sig: number, init: boolean=true): number
  {
    if (init)
    {
      this._u = isNaN(mu) || mu < 0 ? 0.0 : mu;
      this._s = isNaN(sig) || sig < 1.0 ? 1.0 : sig;
    }

    let v = 0.0;
    while (v*(1.0-v) == 0.0) {
      v = this.uniform(start, init);
    }

    return this._u + 0.5513288954217921*this._s*Math.log(v/(1.0-v));
  }
}
