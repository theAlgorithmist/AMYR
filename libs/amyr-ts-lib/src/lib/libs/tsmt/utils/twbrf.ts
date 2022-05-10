/** Copyright 2016 Jim Armstrong (www.algorithmist.net)
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
 * Typescript Math Toolkit: Implementation of Jack Crenshaw's The World's Best Root Finder (TWBRF).  Call after
 * identifying an interval that contains at least one root.
 *
 * @author Jim Armstrong ()
 *
 * @version 1.0
 */

import { FcnEval } from "../../../models/geometry";

const MAX_ITER = 50;        // maximum iteration count

/**
 * Find an approximate root to a function in the specified interval.  Returns approximation of desired root within
 * specified tolerance and iteration limit.  In addition to too small an iteration limit or too tight a tolerance,
 * some pathological numerical conditions exist under which the method may incorrectly report a root.
 *
 * @param {number} _x0 Left interval endpoint; root isolated in interval [_x0, _x2]
 *
 * @param {number} _x2 Right interval endpoint; number - root isolated in interval [_x0, _x2]
 *
 * @param {Function} _f Reference to function whose root in the interval is desired.  Function accepts a single
 * numerical argument and returns a number.
 *
 * @param {number} _eps Tolerance value for root
 * @default {TOL}
 */
 export function twbrf(_x0: number, _x2: number, _f: FcnEval, _eps: number = 0.00001): number
 {
   const _imax: number = MAX_ITER;  // todo - allow this to be variable and user-input?

   let x0: number;
   let x1: number;
   let x2: number;
   let y0: number;
   let y1: number;
   let y2: number;
   let b: number;
   let c: number;
   let y10: number;
   let y20: number;
   let y21: number;
   let xm: number;
   let ym: number;
   let temp: number;
   let xmlast: number = _x0;

   y0 = _f(_x0);

   if (y0 === 0.0) return _x0;

   y2 = _f(_x2);
   if (y2 === 0.0) return _x2;

   if (y2*y0 > 0.0)
   {
     // game over, man ... game over
     return _x0;
   }

	 x1    = 0;
   x0    = _x0;
   x2    = _x2;
	 let i = 0;

   while (i < _imax)
   {
     x1 = 0.5 * (x2 + x0);
     y1 = _f(x1);

     if (y1 == 0.0) return x1;

     if (Math.abs(x1 - x0) < _eps) return x1;

     if (y1*y0 > 0.0)
     {
       temp = x0;
       x0   = x2;
       x2   = temp;
       temp = y0;
       y0   = y2;
       y2   = temp;
     }

     y10 = y1 - y0;
     y21 = y2 - y1;
     y20 = y2 - y0;

     if (y2*y20 < 2.0*y1*y10)
     {
       x2 = x1;
       y2 = y1;
     }
     else
     {
       b  = (x1  - x0 ) / y10;
       c  = (y10 - y21) / (y21 * y20);
       xm = x0 - b*y0*(1.0 - c*y1);
       ym = _f(xm);

       if (ym === 0.0) return xm;

       if (Math.abs(xm - xmlast) < _eps) return xm;

       xmlast = xm;

       if (ym*y0 < 0.0)
       {
         x2 = xm;
         y2 = ym;
       }
       else
       {
         x0 = xm;
         y0 = ym;
         x2 = x1;
         y2 = y1;
       }
     }

     i++;
   }

   // no convergence, either a numerical problem or an issue with the interval or function
   return x1;
 }
