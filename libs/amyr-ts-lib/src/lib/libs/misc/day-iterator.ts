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
 * AMYR Library.  A simple convenience iterator that moves a starting day forward or backward by one day
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */
import { DAY_OF_WEEK } from "../../models/day-and-time";

export class DayIterator
{
  protected static _day: number = DAY_OF_WEEK.NONE;

  constructor()
  {
    // empty
  }

  public static get day(): number
  {
    return DayIterator._day;
  }

  public static set day(value: number)
  {
    if (value !== undefined && value != null && !isNaN(value) && value > -1 && value < 7) {
      DayIterator._day = Math.round(value);
    }
  }

  public static next(): number
  {
    DayIterator._day++;

    if (DayIterator._day == 7) {
      DayIterator._day = 0;
    }

    return DayIterator._day;
  }

  public static prev(): number
  {
    DayIterator._day--;

    if (DayIterator._day < 0) {
      DayIterator._day = 6;
    }

    return DayIterator._day;
  }

  public static toString(): string
  {
    switch (DayIterator._day)
    {
      case DAY_OF_WEEK.SUNDAY:
        return 'SU';

      case DAY_OF_WEEK.MONDAY:
        return 'M';

      case DAY_OF_WEEK.TUESDAY:
        return 'TU';

      case DAY_OF_WEEK.WEDNESDAY:
        return 'W';

      case DAY_OF_WEEK.THURSDAY:
        return 'TH';

      case DAY_OF_WEEK.FRIDAY:
        return 'F';

      case DAY_OF_WEEK.SATURDAY:
        return 'SA';

      default:
        return '';
    }
  }

  public static format(day: number): string {
    switch (day) {
      case DAY_OF_WEEK.SUNDAY:
        return 'SU';

      case DAY_OF_WEEK.MONDAY:
        return 'M';

      case DAY_OF_WEEK.TUESDAY:
        return 'TU';

      case DAY_OF_WEEK.WEDNESDAY:
        return 'W';

      case DAY_OF_WEEK.THURSDAY:
        return 'TH';

      case DAY_OF_WEEK.FRIDAY:
        return 'F';

      case DAY_OF_WEEK.SATURDAY:
        return 'SA';

      default:
        return '';
    }
  }
}
