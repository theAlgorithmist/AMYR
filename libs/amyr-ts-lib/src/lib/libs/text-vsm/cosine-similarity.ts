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

import { WordVector } from "../../models/vsm";
import * as constants from '../../models/constants';

/**
 * Compute the cosine similarity of two (dense) vectors of numbers or measure of comparison in [-1,1] (least to most)
 * between the two vectors
 *
 * @param {Array<number | WordVector>} v1 First vector for comparision
 *
 * @param {Array<number | WordVector>} v2 Second vector for comparison (must be same length as {v1})
 *
 */
export function cosineSim(v1: Array<number | WordVector>, v2: Array<number | WordVector>): number
{
  if (v1 !== undefined && v2 !== undefined)
  {
    // lengths must be same; you break it ... you buy it
    const n: number = Array.isArray(v1) ? (v1 as Array<number>).length : (v1 as WordVector).word.length;

    let l1 = 0;
    let l2 = 0;
    let d  = 0;

    let i: number;
    let x: number;
    let y: number;

    // all computations are in-lined for performance and easier testing (i.e. no dependent functions to test)
    for (i = 0; i < n; ++i)
    {
      x   = typeof v1[i] == 'number' ? v1[i] as number : (v1[i] as WordVector).value;
      y   = typeof v2[i] == 'number' ? v2[i] as number : (v2[i] as WordVector).value;
      l1 += x*x;
      l2 += y*y;
      d  += x*y;
    }

    return Math.abs(d) < constants.ZERO_TOL ? 0 : d / (Math.sqrt(l1)*Math.sqrt(l2));
  }
  else
  {
    return 0;
  }
}

/**
 * Measure cosine similarity between two vector space models
 *
 * @param {Record<string, number>} vsm1
 *
 * @param {Record<string, number>} vsm2
 *
 */
export function vsmCosineSim(vsm1: Record<string, number>, vsm2: Record<string, number>): number
{
   if (vsm1 !== undefined && vsm2 !== undefined)
  {
    // replace sparse vector and property lookup with straight hash lookup
    const v1: Array<string> = Object.keys(vsm1);
    const n: number        = v1.length;

    if (n === 0) return 0;

    let l1 = 0;
    let l2 = 0;
    let d  = 0;

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
        x   = vsm1[word];
        y   = vsm2[word];
        l1 += x*x;
        l2 += y*y;
        d  += x*y;
      }
    }

    return Math.abs(d) < constants.ZERO_TOL ? 0 : d / (Math.sqrt(l1)*Math.sqrt(l2));
  }
  else
  {
    return 0;
  }
}
