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
 * AMYR Library Assign a value to local storage and return {true} if successful; {false} otherwise.
 *
 * @param {string} name Name of data object to be stored
 *
 * @param value Value to be stored
 */
export function toLocalStorage(name: string, value: any): boolean
{
  if (typeof name === 'string')
  {
    if (typeof Storage !== 'undefined')
    {
      localStorage.setItem(name, value);
      return true;
    }
  }

  return false;
}
