/**
 * Copyright 2018 Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
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
 * AMYR Library. Compute a 'norm' or measure of one VSM against another; the returned measure is higher for greater
 * number of keyword matches and matching keywords with higher frequencies
 *
 * @param {Record<string, number>} vsm1 Input Vector Space Model
 *
 * @param {Record<string, number>} vsm2 Comparison Model
 */
import * as constants from '../../models/constants';

export function vsmNorm(vsm1: Record<string, number>, vsm2: Record<string, number>): number
{
  if (vsm1 !== undefined && vsm1 != null && vsm2 !== undefined && vsm2 !=null)
  {
    // replace sparse vector and property lookup with straight hash lookup
    const v1: Array<string> = Object.keys(vsm1);
    const n: number         = v1.length;

    if (n === 0) return 0;

    let d = 0;
    let i: number;
    let x: number;
    let y: number;
    let word: string;

    // all computations are in-lined for performance and easier testing (i.e. no dependent functions to test)
    for (i = 0; i < n; ++i)
    {
      word = v1[i];
      if (vsm2[word] !== undefined)
      {
        // this is equivalent to matching indices in a sparse vector
        x  = vsm1[word];
        y  = vsm2[word];
        d += x*y;
      }
    }

    return Math.abs(d) < constants.ZERO_TOL ? 0 : d / n;
  }
  else
  {
    return 0;
  }
}
