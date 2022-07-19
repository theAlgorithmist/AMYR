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
 * AMYR Library. A relatively (non-crypto) simple (RFC4122) Universal Unique ID generator with low (but not as low as possible) probability
 * of collisions among generated ID's.  There is nothing unique about the code, which was distilled from
 *
 * https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 *
 * @author Jim Armstrong ()
 *
 * @version 1.0
 *
 */
export const uuid = (): string => {

  const template = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

  return template.replace(/[xy]/g, (c: string): string => {

    const r: number = Math.random() * 16 | 0;
    const v: number = c == 'x' ? r : (r & 0x3 | 0x8);

    return v.toString(16);
  });
};

