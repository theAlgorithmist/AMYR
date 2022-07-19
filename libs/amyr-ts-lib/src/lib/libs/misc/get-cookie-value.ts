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
 * AMYR Library - Fetch a cookie value
 *
 * @param {string} cookieName Name of the cookie from which a value is fetched
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */

export function getCookieValue(cookieName: string): string
{
  if (cookieName === undefined || cookieName === '') return '';

  const name: string          = cookieName + "=";
  const decoded: string       = decodeURIComponent(document.cookie);
  const cArray: Array<string> = decoded.split(';');
  const len: number           = cArray.length;

  let i: number;
  let c: string;

  for (i = 0; i <len; ++i)
  {
    c = cArray[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }

    if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
  }

  return "";
}
