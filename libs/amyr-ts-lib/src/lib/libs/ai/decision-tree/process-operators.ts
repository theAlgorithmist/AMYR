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
import {CHAR_EXP} from "./decision-tree";

export function processOperators(str: string, operators: Array<string>, result: Array<string>): void
{
  let j: number;
  let n: number = operators.length;

  // split on operator and re-test
  for (j = 0; j < n; ++j)
  {
    const res: Array<string> = str.split(operators[j]);
    if (res.length > 1)
    {
      if (CHAR_EXP.test(res[0]))
      {
        if (result.indexOf(res[0]) === -1) result.push(res[0])
      }
      else if (CHAR_EXP.test(res[1]))
      {
        if (result.indexOf(res[1]) ===-1) result.push(res[1]);
      }
      else
      {
        // compounds
        processOperators(res[0], operators, result);

        processOperators(res[1], operators, result);
      }
    }
  }
}
