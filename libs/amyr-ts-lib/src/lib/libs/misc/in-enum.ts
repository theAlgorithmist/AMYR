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
 * AMYR Library.  Determine if a supplied value is in a string enumeration
 *
 * @param value Test value
 *
 * @param enumeration Reference to string enum
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */

export const inEnum = (value: string, enumeration: Record<string, any>): boolean => {

  if (value === undefined || value == null || value === '') return false;

  const keys: string[] = Object.keys(enumeration);
  const n: number      = keys.length;

  let i: number;
  for (i = 0; i < n; ++i) {
    if (value === enumeration[keys[i]]) return true;
  }

  return false;
};
