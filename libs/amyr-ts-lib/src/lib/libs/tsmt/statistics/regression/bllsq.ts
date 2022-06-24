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
 * AMYR Library.  Linear least squares with bagging and sub-bagging.
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */
import {
  BagggedLinearFit,
  LLSQResult,
  Samples
} from "../../../../models/regression-models";

import * as llsq from './llsq';

import * as bagging from './bagging';

/**
 * Perform a linear regression (least squares fit) with bagged data sets
 *
 * @param {Array<number>} x Array of x-coordinates (must have at least three data points)
 *
 * @param {Array<number>} y Array of y-coordinates (must have at least three data points)
 *
 * @param {number} numSets Number of data sets or bags to use in the analysis
 */
export function bagFit(x: Array<number>, y: Array<number>, numSets: number): BagggedLinearFit
{
  const empty: BagggedLinearFit = {
    a: 0,
    b: 0,
    fits: []
  };

  if (!x || !y) return empty;

  const n: number = x.length;
  if (n < 3) return empty;

  numSets = numSets == undefined || isNaN(numSets) || numSets < 1 ? n : Math.round(numSets);

  let a_ave = 0.0;
  let b_ave = 0.0;
  let i     = 0;

  const fitArray: Array<LLSQResult> = new Array<LLSQResult>();
  let fit: LLSQResult;

  const bag: Array<Samples> = bagging.get2DSamplesWithReplacement( x, y, numSets );

  for (i = 0; i < numSets; ++i)
  {
    fit = llsq.linearFit( bag[i].x, bag[i].y );

    a_ave += fit.a;
    b_ave += fit.b;

    fitArray.push(fit);
  }

  a_ave /= numSets;
  b_ave /= numSets;

  return {a: a_ave, b: b_ave, fits: fitArray};
}

/**
 * Perform a linear regression (least squares fit) with sub-bagged data sets
 *
 * @param {Array<number> x Array of x-coordinates (must have at least three data points)
 *
 * @param {Array<number>} y Array of y-coordinates (must have at least three data points)
 *
 * @param {number} m Number of original data points to use in a bag (must be less than or equal to total number of samples)
 *
 * @param {number} numSets Number of data sets or bags to use in the analysis
 */
export function subbagFit(x: Array<number>, y: Array<number>, m: number, numSets: number): BagggedLinearFit
{
  // TODO need to be more DRY
  const empty: BagggedLinearFit = {
    a: 0,
    b: 0,
    fits: []
  };

  if (!x || !y) return empty;

  const n: number = x.length;
  if (n < 3) return empty;

  m       = m == undefined || isNaN(m) || m < 1 || m > n ? Math.floor(n/2) : Math.round(m);
  numSets = numSets == undefined || isNaN(numSets) || numSets < 1 ? n : Math.round(numSets);

  let a_ave = 0.0;
  let b_ave = 0.0;

  const fitArray: Array<LLSQResult> = new Array<LLSQResult>();
  let fit: LLSQResult;
  let i: number;
  const bag: Array<Samples> = bagging.get2DSamplesWithoutReplacement(x, y, m, numSets);

  for (i = 0; i < numSets; ++i )
  {
    fit   = llsq.linearFit( bag[i].x, bag[i].y );
    a_ave += fit.a;
    b_ave += fit.b;

    fitArray.push(fit);
  }

  a_ave /= numSets;
  b_ave /= numSets;

  return {a: a_ave, b: b_ave, fits: fitArray};
}
