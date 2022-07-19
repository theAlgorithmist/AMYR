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
 * Simple implementation of Knuth's lexical permutation generator (vol 4, aka algorithm L) that is optimized for
 * numerical/string data; a future version may use a comparitor to specify lexical ordering.
 *
 * @author Jim Armstrong
 *
 * @version 1.0
 */
import { sortOn } from "../sorting/sort-on";

export type stringEnumerable = {[key: string]: string | number};

export function orderedPermutations(values: Array<stringEnumerable>, prop: string): Array<Array<stringEnumerable>>
{
  if (!values || !values.length || values.length === 0) return [];

  if (prop === undefined || typeof prop != "string" || prop === '') return [];

  const sorted: Array<stringEnumerable> = values.slice();

  // singleton outlier
  if (values.length === 1) return [values];

  sortOn(sorted, [prop]);

  // L-(i) refers to the ith step in the algorithm according to Knuth

  // first one is a freebie L-1 :)
  const result: Array<Array<stringEnumerable>> = new Array<Array<stringEnumerable>>();

  result.push( sorted.slice() );

  // here we go ...
  const n: number  = values.length;

  // j is the head of the suffix
  let j: number;
  let k: number;
  let l: number;

  const condition = true;
  let tmp: any;

  while (condition)
  {
    // update suffix head (L-2)
    j = n - 2;

    // str/number should work without a formal comparitor
    if (sorted[j][prop] === undefined) return [];

    while ( sorted[j][prop] >= sorted[j+1][prop] )
    {
      if (j === 0) return result;

      j--;
    }

    // last l such that value[j] < value[l] (L-3)
    l = n - 1;
    while (sorted[j][prop] >= sorted[l][prop]) {
      l--;
    }

    // exchange is inlined for performance
    tmp       = sorted[j];
    sorted[j] = sorted[l];
    sorted[l] = tmp;

    k = j + 1;
    l = n - 1;

    // reverse elements j+1 through current count-1 (L-4)
    while (k < l)
    {
      // again, exchange is inlined for performance
      tmp       = sorted[k];
      sorted[k] = sorted[l];
      sorted[l] = tmp;

      k++;
      l--;
    }

    result.push( sorted.slice() );
  }

  return [];
}
