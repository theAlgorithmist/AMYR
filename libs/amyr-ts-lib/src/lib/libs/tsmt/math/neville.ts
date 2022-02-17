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
 * AMYR Library: An implementation of Neville's method for polynomial interpolation of a SMALL
 * (ideally less than 10) number of data points.  In very well-behaved cases, 10 or 20 might work, but
 * 100 or 200 will not.
 *
 * Credit: Derived from NRC polint.c
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */

/**
 * Interpolate a single data point or return {NaN} in the case of failure due to bad inputs.
 *
 * @param {Array<number>} xa x-coordinates of interpolation points
 *
 * @param {Array<number>} ya y-coordinates of interpolation points (length must equal that of {xa})
 *
 * @param {number} x x-coordinate of point to be interpolated
 *
 * @returns {number} y-coordinate of interpolated point or NaN in the case of sufficiently bad inputs to make
 * the method fail.
 */
 export const nevilleInterpolate = (xa: Array<number>, ya: Array<number>, x: number): number =>
 {
   const c: Array<number> = new Array<number>();
   const d: Array<number> = new Array<number>();
   const n: number        = xa.length;

   let den: number, dif: number, dift: number;
   let ho: number, hp: number, w: number;
   let i: number, m: number, ns: number;

   let dy = 0;
   let y: number;

   ns  = 0;
   dif = Math.abs(x - xa[0]);

   for (i = 0; i < n; ++i)
   {
     dift = Math.abs( x-xa[i] );

     if (dift < dif)
     {
       ns  = i;
       dif = dift;
     }

     c[i] = ya[i];
     d[i] = ya[i];
   }

   y  = ya[ns];
   ns = ns-1;

   for (m = 0; m < n-1; ++m)
   {
     for (i = 0; i < n-m-1; ++i)
     {
       ho  = xa[i] - x;
       hp  = xa[i+m+1] - x;
       w   = c[i+1] - d[i];
       den = ho - hp;

       if (Math.abs(den) < 0.00000001)
       {
         // bad news
         return NaN;
       }

       den  = w/den;
       d[i] = hp*den;
       c[i] = ho*den;
     }

     if (2*(ns+1) < n-m-1)
     {
       dy = c[ns + 1];
     }
     else
     {
       dy = d[ns];
       ns = ns-1;
     }

     y = y + dy;
   }

   return y;
 }
