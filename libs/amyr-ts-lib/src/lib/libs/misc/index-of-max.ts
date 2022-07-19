/**
 * Copyright Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
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
 * AMYR Library Compute the index of the maximum value of an array of numbers.  Returns index of maximum numeric
 * value or -1 for invalid input.
 *
 * @param {Array<number>} results Input array to test
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */

export function indexOfMax(results: Array<number>): number
{
  if (!results || !results.length || results.length == 0 ) return -1;

  const n: number   = results.length;
  let test: number  = results[0];
  let index         = 0;
  let i: number;

  for (i = 1; i < n; ++i)
  {
    if (results[i] > test)
    {
      test  = results[i];
      index = i;
    }
  }

  return index;
}
