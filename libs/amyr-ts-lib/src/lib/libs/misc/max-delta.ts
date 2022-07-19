/**
 * Copyright 2016 Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
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
 * Function to compute the maximum possible delta between two (strictly positive) numbers in a list.  Not test is made
 * for input integrity for performance reasons.  Algorithm is O(n) complexity.
 *
 * @param {Array<number>} input List of strictly positive numbers, typically some physical measurement over a
 * time periods
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */
export function maxDelta(input: Array<number>): number
{
  const len: number = input.length;
  if (len < 2) return 0;

  let low: number   = input[0];           // record the current low
  let delta: number = -Number.MAX_VALUE;   // record the current max profit
  let i: number;
  let p: number;
  let value: number;

  for (i=1; i<len; ++i)
  {
    value = input[i];              // current time-period value
    p     = value - low;           // current delta
    delta = Math.max(p, delta);    // some unnecessary max computations, but this easily fits in min-delta case
    low   = Math.min(low, value);  // did we hit a new low?
  }

  return delta;
}
