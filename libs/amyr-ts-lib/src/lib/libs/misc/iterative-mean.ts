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
 * AMYR Library.  Iterative mean from Knuth TAOCP - suitable for working with averages of very large numbers where
 * overflow is a consideration in the traditional averaging formula.  Returns zero for invalid or empty argument.
 *
 * @param value Input array of numbers
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */
export function iterativeMean(values: Array<number>): number
{
  if (values === undefined || values == null) return 0;

  const n: number = values.length;
  if (n === 0) return 0;

  let avg = 0;
  let t   = 1;
  let i: number;

  for (i = 0; i < n; ++i)
  {
    avg += (values[i] - avg) / t;
    ++t;
  }

  return avg;
}
