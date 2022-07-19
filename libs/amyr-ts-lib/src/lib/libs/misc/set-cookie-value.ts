/**
 * Copyright 206 Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
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
 * AMYR Library - Assign a cookie value
 *
 * @param {string} cookieName Name of the cookie to which a value is assigned
 *
 * @param {string} value Cookie value
 *
 * @param {number} exSeconds Expire seconds
 *
 * @param {number} exMinutes Expire hours
 *
 * @param {number} exHours Expire hours
 * @default 0
 *
 * @param {number} exDays Expire days
 * @default 0
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */
import {fromMilliseconds} from './time-stamp-to-milliseconds';

export function setCookie(cookieName: string,
  value: string,
  exSeconds: number,
  exMinutes: number,
  exHours: number = 0,
  exDays: number = 0)
{
  const d: Date      = new Date();
  const msec: number = fromMilliseconds(exDays, exHours, exMinutes, exSeconds);

  d.setTime(d.getTime() + msec);

  const expires: string = "expires="+ d.toUTCString();

  document.cookie = cookieName + "=" + value + ";" + expires + ";path=/";
}
