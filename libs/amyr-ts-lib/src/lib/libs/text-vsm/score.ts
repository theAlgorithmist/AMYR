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
 * AMYR Library. Score a matrix of vectors using cosine similarity vs a reference vector
 *
 * @aparam {Array<WordVector>} ref Reference array
 *
 * @param {Array<Array<WordVector>>} test Test matrix
 */
import { WordVector } from "../../models/vsm";

import { cosineSim } from "./cosine-similarity";

export function score(ref: Array<WordVector>, tests: Array<Array<WordVector>>): Array<number>
{
  if (ref === undefined && ref == null) return [];
  if (tests === undefined && tests == null) return [];

  if (!Array.isArray(ref)) return [];
  if (!Array.isArray(tests)) return [];

  if (ref.length === 0 || tests.length === 0) return [];

  const n: number = tests.length;
  let i: number;
  let test: Array<WordVector>;

  const scores: Array<number> = new Array<number>();

  for (i = 0; i < n; ++i)
  {
    test = tests[i];

    scores.push( cosineSim(ref, test) );
  }

  return scores;
}
