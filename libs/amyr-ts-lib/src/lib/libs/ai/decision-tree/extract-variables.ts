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
 * AMYR Library. Utility function to extract independent variables from an expression
 *
 * @param {string} data Expression
 *
 * @returns {Array<string>} List of independent variables
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */
import { CHAR_EXP } from "./decision-tree";

import { processOperators } from './process-operators';

export function extractVariables(data: string): Array<string>
{
  if (!data) return [];

  const strArr: Array<string> = data.split(' ');

  // include parens for completeness
  const operators: Array<string> = ['+', '-', '/', '^', '*', '!', '(', ')'];

  // match ASCII characters a-z and A-Z for variable names
  const n: number = strArr.length;
  let i: number;
  let str: string;

  const result: Array<string> = new Array<string>();

  for (i = 0; i < n; ++i)
  {
    str = strArr[i];
    if (CHAR_EXP.test(str))
    {
      // avoid duplciate
      if (result.indexOf(str) === -1)
      {
        // this is the easy case
        result.push(str);
      }
    }
    else
    {
      // have to test things like '2*x' or 'x^2' or '(3*x' + or + 'x)', and don't forget '!x'
      // the worst cases are compound, such as '3*x)', but no need to split more than twice
      processOperators(str, operators, result);
    }
  }

  return result;
};
