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
 * AMYR Library. Given a JS {Date object}, return a numerical code indicating the day of week and the number of
 * hours offset from midnight
 *
 * @param {Date} date Input {Date} object
 *
 * @param {boolean} utc {true} if hours is returned using UTC
 * @default false
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */

import { DAY_OF_WEEK        } from "../../models/day-and-time";
import { DayHourOffsetModel } from "../../models/day-and-time";

export function dayHourOffset(date: Date, utc: boolean = false): DayHourOffsetModel
{
  if (!date || !(date instanceof Date))
  {
    return {
      dayOfWeek: DAY_OF_WEEK.NONE,
      hourOffset: 0
    }
  }

  // convention is tha day begins at midnight, so make sure 2018-01-01 00:00:00 reports Wed and not Tue
  const hours: number = utc ? date.getUTCHours() : date.getHours();

  return {
    dayOfWeek: hours == 0 ? date.getDay()+1 : date.getDay(),
    hourOffset: hours
  };
}
