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
 * AMYR Library: Low-level, general mathematical utility functions
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */

 /**
   * Compute the least common multiple of two integers
   *
   * @param {number} n1 First integer
   *
   * @param {number} n2 Second integer
   */
   export function lcm(n1: number, n2: number): number
   {
     if (isNaN(n1) || !isFinite(n1))
     {
       // multiple not defined
       return 0;
     }

     if (isNaN(n2) || !isFinite(n2))
     {
       // multile not defined
       return 0;
     }

     const theGcd: number = gcd(n1, n2);
     return theGcd == 0 ? 0 : Math.floor((n1 * n2) / theGcd);
   }

  /**
   * Compute the greatest common divisor of two integers
   *
   * @param {number} n1 First integer
   *
   * @param {number} n2 Second integer
   *
   */
   export function gcd(n1: number, n2: number): number
   {
     if (isNaN(n1) || !isFinite(n1))
     {
       // gcd not defined
       return 0;
     }

     if (isNaN(n2) || !isFinite(n2))
     {
       // gcd not defined
       return 0;
     }

     n1 = Math.floor( Math.abs(n1) );
     n2 = Math.floor( Math.abs(n2) );

     let a: number = Math.max(n1, n2);
     let b: number = Math.min(n1, n2);
     let r         = 0;

     //  Euclid's principle
     // if a > b, swap a, b
     // r = a mod b
     // while r > 0
     // a = b
     // b = r

     while( b > 0 )
     {
       r = a % b;
       a = b;
       b = r;
     }

     return Math.floor(a);
   }
