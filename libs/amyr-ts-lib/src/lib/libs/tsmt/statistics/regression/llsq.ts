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
 * AMYR Library: Linear least squares analysis of x-y data
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */

import { LLSQResult } from "../../../../models/regression-models";
import * as constants from '../../../../models/constants';

/**
 * Perform a linear regression (least squares fit) without data on variance of individual sample y-coordinates.
 * There should be at least three points in the data set.  Invalid inputs result in a fit to a singleton point
 * at the origin.
 *
 * @param {Array<number>} x Array of x-coordinates (must have at least three data points)
 *
 * @param {Array<number>} y Array of y-coordinates (must have at least three data points)
 *
 * Reference: NRC or Wikipedia (https://en.wikipedia.org/wiki/Simple_linear_regression)
 */
export function linearFit(_x: Array<number>, _y: Array<number>): LLSQResult
{
  if (_x === undefined || _x == null || !Array.isArray(_x)) return {a: 0, b: 0, siga: 0, sigb: 0, chi2: 0, r: 0};
  if (_y === undefined || _y == null || !Array.isArray(_y)) return {a: 0, b: 0, siga: 0, sigb: 0, chi2: 0, r: 0};

  const n: number = _x.length;

  if (n < 3 || _y.length != n) return {a: 0, b: 0, siga: 0, sigb: 0, chi2: 0, r: 0};

  let a   = 0.0;
  let b   = 0.0;
  let s   = 0.0;
  let sx  = 0.0;
  let sy  = 0.0;
  let st2 = 0.0;

  let i: number;
  let t: number;
  let w: number;

  for (i = 0; i < n; ++i)
  {
    sx += _x[i];
    sy += _y[i];
  }

  const ss: number    = n;
  const sxoss: number = sx / ss;
  const ybar: number  = sy / ss;

  for (i = 0; i < n; ++i)
  {
    t    = _x[i] - sxoss;
    st2 += t * t;
    b   += t * _y[i];
  }

  if (Math.abs(st2) < constants.EPS) return {a: 0, b: 0, siga: 0, sigb: 0, chi2: 0, r: 0};

  b /= st2;
  a  = (sy - sx * b) / ss;

  let sigdat = 1.0;

  let siga: number = Math.sqrt((1.0 + sx * sx / (ss * st2)) / ss);
  let sigb: number = Math.sqrt(1.0 / st2);

  let chi2 = 0.0;
  for (i = 0; i < n; ++i)
  {
    w     = _y[i] - ybar;
    t     = _y[i] - a - b * _x[i];
    chi2 += t * t;
    s    += w * w;
  }

  if (n > 2) sigdat = Math.sqrt(chi2 / (n - 2));

  siga *= sigdat;
  sigb *= sigdat;

  const cov: number = -sx / st2;        // unused, but reserved for future use
  const r: number   = 1.0 - chi2 / s;

  return {a: b, b: a, siga: siga, sigb: sigb, chi2: chi2, r: r};
}
