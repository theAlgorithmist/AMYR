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
 * AMYR Library. Convert the constituents of a time stamp into milliseconds
 *
 * @param {number} days Number of days (greater than or equal to zero)
 *
 * @param {number} hours Number of hours in range [0,24]
 *
 * @param {number} minutes Number of minutes in range [0,60]
 *
 * @param {number} seconds Number of seconds in range [0,60]
 */
export function timeStampToMilliseconds(days: number, hours: number, minutes: number, seconds: number): number
{
  if (isNaN(days) || !isFinite(days) || days < 0 || days > 24) return 0;

  if (isNaN(hours) || !isFinite(hours) || hours < 0 || hours > 24) return 0;

  if (isNaN(minutes) || !isFinite(minutes) || minutes < 0 || minutes > 60) return 0;

  if (isNaN(seconds) || !isFinite(seconds) || seconds < 0 || seconds > 60) return 0;

  days    = Math.round(days);
  hours   = Math.round(hours);
  minutes = Math.round(minutes);
  seconds = Math.round(seconds);

  return 1000*(seconds + 60*(minutes + 60*(hours + 24*days)));
}
