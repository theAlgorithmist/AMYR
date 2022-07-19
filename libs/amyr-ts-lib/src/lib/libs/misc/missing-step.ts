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
 * AMYR Library.  Find the missing step. A sequence of steps labeled 1, 2, ... N can be performed
 * each time step and out of order.  An array of N-1 time intervals with step labels is provided,
 * i.e. one label is missing.  Find the missing step label or return 0 if inputs are invalid.
 *
 * @param {Array<number>} input Input array of integer labels (steps)
 */
export function missingStep(n: number, input: Array<number>): number
{
  if (input === undefined || input == null || !Array.isArray(input)) return 0;

  const len: number = input.length;
  if (len === 0) return 0;

  if (n === 1 && input[0] != 1) return 1;

  if (len != n-1) return 0;

  let total = input[0];
  let i: number;

  for (i = 1; i < len; ++i)
    total += input[i];

  // theoretical minus actual
  return (n*(n+1) / 2) - total;
}
