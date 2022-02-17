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
 * Repeating decimal to fraction
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */

export type SimpleFraction =
{
  num: number,
  den: number
}

/**
 * AMYR Library, Typescript Math Toolkit.  Return a number with a simple repeating decimal, i.e. 1.454545 as a fraction
 * (optionally in reduced form).  Decimals in the repeating sequence may be presumed to be unique, i.e. 0.115115 would
 * be considered as 0.1111 as 1 is the first digit to repeat.  This likely done to keep problems tractable for students.
 *
 * Only numerator and denominator are returned.
 *
 * @param {string} n Number containing a repeating sequence after the decimal
 *
 * @param {boolean} toReduced True if result is to be converted into reduced form
 * @default false
 */
 export function repeatToFraction(n: string, toReduced: boolean = false): SimpleFraction | null
 {
   let result: SimpleFraction | null = null;

   // is there a repeating sequence after the decimal?
   const decimal: number = n.indexOf('.');
   if (decimal == -1) return result;

   const beforeDecimal = n.substring(0,decimal);
   const afterDecimal  = n.substring(decimal+1, n.length);
   let repeat: string  = getMinimalRepeating(afterDecimal);
   let shift           = 0;

   // do we need to skip forward to test for a repeating sequence some places after the decimal, like 5.0424242 or 2.13234234
   if (repeat == "")
   {
     let tmp: string   = afterDecimal;
     const len: number = afterDecimal.length;
     shift             = 1;

     while (tmp.length > 1)
     {
       tmp    = afterDecimal.substring(shift, len);
       repeat = getMinimalRepeating(tmp);

       if (repeat != "") break;

       shift++;
     }

     if (repeat === "") return result;
   }

   const digits: number = repeat.length + shift; // number of repeat and shift digits

   // if d = # repeat digits, s = shift factor, and x is the original number, then form the equation 10^(d+s)x -
   // (10^s)x = z, where z is  the numerical result of subtracting out the repeat sequence so, numerator = z and
   // denominator = 10^(d+s) - 10^s.  z needs to be symbolically computed since the repeat sequence may not be
   // repeated in sufficient length to get the correct result in floating-point computation.

   const s: number           = shift == 0 ? 1 : Math.pow(10,shift);
   let   denominator: number = Math.pow(10,digits) - s;
   const n1: string          = beforeDecimal + n.substr(decimal+1, digits);
   const n2: string          = beforeDecimal + n.substr(decimal+1, shift);
   let   numerator: number   = +n1 - +n2;

   // result in reduced form?
   if (toReduced)
   {
     const d: number = gcd(numerator, denominator);
     numerator       = Math.floor(numerator/d);
     denominator     = Math.floor(denominator/d);
   }

   result = {num: numerator, den: denominator};

   return result;
 }

 // utility function to extract the minimal (unique-digit) repeating sequence of at least length 1, i.e. '555555' is
 // a repeating sequence of '5', '545454' is a repeating sequence of '54, '123123123' is a repeating sequence of '123',
 // and '054605460546' is a repeating sequence of '0546'
 function getMinimalRepeating(test: string): string
 {
   const result      = "";
   const len: number = test.length;

   if (len < 1) return result;

   let candidate: string;   // candidate sequence
   let lenC = 1;            // length of candidate sequence

   while (2*lenC <= len)
   {
     candidate  = test.substr(0,lenC);

     if (candidate == test.substr(lenC, lenC))
     {
       // candidate just got elected
       return candidate;
     }
     else
     {
       // try again
       lenC++;
     }
   }

   return result;
 }

/**
 *  Compute the greatest common divisor of two integers
 *
 * @param {number} n1 First integer
 *
 * @param {number} n2 Second integer
 */
 function gcd(n1: number, n2: number): number
 {
   // since this is used internally to the problem at hand, a lot of error-checking is skipped

   // Euclid's algorithm - nothing new under the sun
   let a = Math.max(n1, n2);
   let b = Math.min(n1, n2);
   let r = 0;

   while( b > 0 )
   {
     r = a % b;
     a = b;
     b = r;
   }

   return Math.floor(a);
 }
