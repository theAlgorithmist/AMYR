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
 * AMYR Library.  Given two different days, i.e. M and W, or TU and SA, computed the number of 24-hour intervals between the days, with
 * wrapping to the next day of the week, in sequence.  The week is presumed to begin on Sunday, with day indices in
 * [0,6].
 *
 * @param {number} start Start day in [0,6]
 *
 * @param {number} end End day in [0,6]
 *
 * @param {boolean} forward true if days run forward in sequence, false if reverse
 * @default true
 *
 * @returns {number} Zero is returned for invalid inputs or coincident days
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */

export function intervalsBetweenDays(start: number, end: number, forward: boolean = true): number
{
  if (start === undefined || end === undefined || start == null || end == null || start == end) return 0;

  if (start < 0 || end > 6) return 0;

  start = Math.round(start);
  end = Math.round(end);

  if (forward)
  {
    if (end > start)
    {
      // no wrap into next week
      return (end - start) * 24;
    }
    else
    {
      // wrap into the following week
      return ((6 - start) + end + 1) * 24;
    }
  }
  else
  {
    if (start > end)
    {
      // no wrap into prior week
      return (start - end) * 24;
    }
    else
    {
      // wrap into the previous week
      return ((6 - end) + start + 1) * 24;
    }
  }
}
