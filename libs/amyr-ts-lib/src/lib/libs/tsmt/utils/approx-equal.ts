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
 * AMYR Library: Utilities for floating-point number comparison
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */

/**
 * Compare two floating-point numbers within a tolerance.  Returns {true} if the two input numbers are equal within
 * the prescribed relative error or false if either input is undefined.  This comparison is slower relative to straight
 * relative error, but more numerically robust.  There is modest checking on input validity.
 *
 * @param {number} a Floating-point number
 *
 * @param {number} b Floating-point number for comparison with first number
 *
 * @param {number} tol Relative-error tolerance (defaults to 0.001).
 */
 export function compareNumbers(a: number, b: number, tol: number=0.001): boolean
 {
   if (a === undefined || a == null || isNaN(a) ||
       b === undefined || b == null || isNaN(b) )
   {
     // no comparison possible
     return false;
   }

   if (a === b)
   {
     // that was easy
     return true;
   }

	 if (Math.abs(b) > Math.abs(a))
   {
     return Math.abs((a - b) / b) <= tol;
   }
   else
   {
     return Math.abs((a - b) / a) <= tol;
   }
 }
