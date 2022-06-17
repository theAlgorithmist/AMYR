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
 * AMYR Library:  Some utilities for making approximate element/vector comparisons.
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */

/**
 * perform a quick absolute comparison vs. to a specified number of digits. Returns {true} if |a-b| < 10^-d.
 *
 * @param {number} a First number
 *
 * @param {number} b Second number
 *
 * @param {number} d Number of digits for comparison
 */
 export function compareToDigits(a: number, b: number, d: number): boolean
 {
   d = Math.max(Math.abs(d), 1);

   const tol: number = Math.pow(10, -d);

   return Math.abs(a-b) < tol;
 }

/**
 * Does a value exist in an array to the specified relative error?
 *
 * @param {number} value Test value
 *
 * @param {Array<number>} compare List of numbers to test against
 *
 * @param {number} epsilion: Approximate relative error tolerance
 * @default 0.01
 */
 export function containsApproximately(value: number, compare: Array<number>, epsilon: number = 0.01): boolean
 {
   let i: number;
   let r: number;
   const len: number = compare.length;

   for (i = 0; i < len; ++i)
   {
     r = Math.abs((value - compare[i]) / value);
     if (r <= epsilon) return true;
   }

   return false;
 }

/**
 * Compare two vectors (array of numbers) against the specified relative error
 *
 * @param {Array<number>} vector1 First vector
 *
 * @param {Array<number>} vector2 Second vector
 *
 * @param {number} epsilion: Approximate relative error tolerance
 * @default 0.01
 *
 */
 export function vectorCompare(vector1: Array<number>, vector2: Array<number>, epsilon: number = 0.01): boolean
 {
   const n1: number = vector1.length;
   const n2: number = vector2.length;

   if (n1 != n2) return false;

   let i: number;
   let v: number;

   for (i = 0; i < n1; ++i)
   {
     v = Math.abs((vector1[i] - vector2[i]) / vector1[i]);
     if (v > epsilon) return false;
   }

   return true;
 }
