/**
 * Copyright 2018 Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
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
 * AMYR Library.  Convert a VSM to an array of {IWordVector} elements
 *
 * @param {Record<string, number>}} vsm Vector State Model, most likely computed from {textToVSM}
 *
 * @returns {Array<IWordVector>} Array whose elements represent the key-freq pairs in the VSM structure
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */
import {WordVector} from "../../models/vsm";

export function toVector(vsm: Record<string, number>): Array<WordVector>
{
  const keys: Array<string>       = Object.keys(vsm);
  const vector: Array<WordVector> = new Array<WordVector>();

  const n: number = keys.length;
  let i: number;

  for (i = 0; i < n; ++i) {
    vector.push( {word: keys[i], value: vsm[keys[i]]} );
  }

  return vector;
}
