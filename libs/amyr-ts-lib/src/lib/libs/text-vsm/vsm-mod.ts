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

import {
  VSM_OP,
  WordVector
} from "../../models/vsm";


/**
 * AMYR Library. Perform simple offset/scale modifications to an existing VSM
 *
 * @param {Record<string, number} Input Vector State Model
 *
 * @param {Array<IWordVector>} List of words to modify
 *
 * @op {VSM_OP} {VSM_OP.OFFSET} to add to each word in the VSM by the amount in the input vector or {VSM_OP.SCALE} to
 * multiply
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */

export function vsmMod(vsm: Record<string, number>, wordVector: Array<WordVector>, op: number): void
{
  if (!vsm || !wordVector || !wordVector.length || wordVector.length === 0) return;

  const n: number = wordVector.length;
  let i: number;
  let word: WordVector;

  switch (op)
  {
    case VSM_OP.OFFSET:
      for (i = 0; i < n; ++i)
      {
        word = wordVector[i];

        if (vsm[word.word] !== undefined) vsm[word.word] += isNaN(word.value) ? 0 : word.value;
      }
      break;

    case VSM_OP.SCALE:
      for (i = 0; i < n; ++i)
      {
        word = wordVector[i];

        if (vsm[word.word] !== undefined) vsm[word.word] *= isNaN(word.value) ? 1 : word.value;
      }
      break;
  }
}
