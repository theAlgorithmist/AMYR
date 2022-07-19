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

import { TimeValues } from "../../models/day-and-time";

/**
 * AMYR Library. Convert a single time unit, i.e. day or minutes to milliseconds  or zero for invalid input.
 * It is allowable for any of the time unit values to take on any positive integer, i.e. 182 hours or 75 minutes.
 *
 * @param {TimeValues} unit Time unit
 *
 * @param {number} value Value of the time unit, i.e. 1 day, 34 seconds, 2 hours
 */
export function timeUnitToMilliseconds(unit: string, value: number): number
{
  if (unit === undefined || unit === '') return 0;

  if (isNaN(value) || !isFinite(value)) return 0;

  // values are rounded before conversion
  switch (unit)
  {
    case TimeValues.DAY:
      return value >= 0 ? Math.round(value)*24*3600*1000 : 0;

    case TimeValues.HOUR:
      return value >= 0 ? Math.round(value)*3600*1000 : 0;

    case TimeValues.MINUTE:
      return value >= 0 ? Math.round(value)*60*1000 : 0;

    case TimeValues.SECOND:
      return value >= 0 ? Math.round(value)*1000: 0;

    default:
      return 0;
  }
}
