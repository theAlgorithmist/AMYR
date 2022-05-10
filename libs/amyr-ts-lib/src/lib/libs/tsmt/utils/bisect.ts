/**
 * Copyright 2016 Jim Armstrong (www.algorithmist.net)
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
 * AMYR Library Interval bisection - used to isolate a single, real root of a continuous function inside a small interval
 * (as a preliminary to pass onto a root-finder)
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */
export interface BisectInterval
{
  left: number;      // value of left interval endpoint
  right: number;     // value of right interval endpoint
  root: boolean;     // true if root exists in [left, right]
}

export const BISECT_EPSILON = 1.0; // stop when interval width is this value or less

/**
 * Bisect the supplied function over the input interval [a,b]. Note that there is minimal error-checking for
 * performance reasons.
 *
 * @param {number} a left endpoint of interval
 *
 * @param {number} b right endpoint of interval
 *
 * @param {Function } f numeric function of a single variable whose real root is desired
 *
 * There is only minimal error-checking for performance reasons.
 */
 export function bisect(a: number, b: number, f: (x: number) => number): BisectInterval | null
 {
   const left: number            = Math.min(a,b);
   const right: number           = Math.max(a,b);
   const result: BisectInterval | null = __bisect(left, right, f);

   return result ? {left:+result.left, right:+result.right, root:true} : {left:a, right:b, root:false};
 }

 function __bisect(left: number, right: number, f: (x: number) => number): BisectInterval | null
 {
   if (Math.abs(right-left) <= BISECT_EPSILON) return null;

   if (f(left)*f(right) < 0)
   {
     return {left: left, right: right, root: true};
   }
   else
   {
     const middle: number                = 0.5*(left + right);
     const leftInterval: BisectInterval | null = __bisect(left, middle, f);
     if (leftInterval != null) return leftInterval;

     const rightInterval: BisectInterval | null = __bisect(middle, right, f);
     if (rightInterval != null) return rightInterval;
   }

   return null;
 }
