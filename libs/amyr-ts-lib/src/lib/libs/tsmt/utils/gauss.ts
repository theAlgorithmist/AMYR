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
 * AMYR Library: Gaussian quadrature.  Numerical integration of a function inside a specified interval, [a,b].
 * There is no error-checking in order to maximize performance.
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */
 import { FcnEval} from "../../../models/geometry";

 export class Gauss
 {
   protected __abscissa: Array<number> = new Array<number>();       // abscissa table
   protected __weight: Array<number>   = new Array<number>();       // weight table

   constructor()
   {
	   // N=2
     this.__abscissa.push(-0.5773502692);
     this.__abscissa.push( 0.5773502692);

     this.__weight.push(1);
     this.__weight.push(1);

     // N=3
     this.__abscissa.push(-0.7745966692);
     this.__abscissa.push( 0.7745966692);
     this.__abscissa.push(0);

     this.__weight.push(0.5555555556);
     this.__weight.push(0.5555555556);
     this.__weight.push(0.8888888888);

     // N=4
     this.__abscissa.push(-0.8611363116);
     this.__abscissa.push( 0.8611363116);
     this.__abscissa.push(-0.3399810436);
     this.__abscissa.push( 0.3399810436);

     this.__weight.push(0.3478548451);
     this.__weight.push(0.3478548451);
     this.__weight.push(0.6521451549);
     this.__weight.push(0.6521451549);

     // N=5
     this.__abscissa.push(-0.9061798459);
     this.__abscissa.push( 0.9061798459);
     this.__abscissa.push(-0.5384693101);
     this.__abscissa.push( 0.5384693101);
     this.__abscissa.push( 0.0000000000);

     this.__weight.push(0.2369268851);
     this.__weight.push(0.2369268851);
     this.__weight.push(0.4786286705);
     this.__weight.push(0.4786286705);
     this.__weight.push(0.5688888888);

     // N=6
     this.__abscissa.push(-0.9324695142);
     this.__abscissa.push( 0.9324695142);
     this.__abscissa.push(-0.6612093865);
     this.__abscissa.push( 0.6612093865);
     this.__abscissa.push(-0.2386191861);
     this.__abscissa.push( 0.2386191861);

     this.__weight.push(0.1713244924);
     this.__weight.push(0.1713244924);
     this.__weight.push(0.3607615730);
     this.__weight.push(0.3607615730);
     this.__weight.push(0.4679139346);
     this.__weight.push(0.4679139346);

     // N=7
     this.__abscissa.push(-0.9491079123);
     this.__abscissa.push( 0.9491079123);
     this.__abscissa.push(-0.7415311856);
     this.__abscissa.push( 0.7415311856);
     this.__abscissa.push(-0.4058451514);
     this.__abscissa.push( 0.4058451514);
     this.__abscissa.push( 0.0000000000);

     this.__weight.push(0.1294849662);
     this.__weight.push(0.1294849662);
     this.__weight.push(0.2797053915);
     this.__weight.push(0.2797053915);
     this.__weight.push(0.3818300505);
     this.__weight.push(0.3818300505);
     this.__weight.push(0.4179591837);

     // N=8
     this.__abscissa.push(-0.9602898565);
     this.__abscissa.push( 0.9602898565);
     this.__abscissa.push(-0.7966664774);
     this.__abscissa.push( 0.7966664774);
     this.__abscissa.push(-0.5255324099);
     this.__abscissa.push( 0.5255324099);
     this.__abscissa.push(-0.1834346425);
     this.__abscissa.push( 0.1834346425);

     this.__weight.push(0.1012285363);
     this.__weight.push(0.1012285363);
     this.__weight.push(0.2223810345);
     this.__weight.push(0.2223810345);
     this.__weight.push(0.3137066459);
     this.__weight.push(0.3137066459);
     this.__weight.push(0.3626837834);
     this.__weight.push(0.3626837834);
   }

  /**
   * Approximate integral of specified function over specified range
   *
   * @param {FcnEval} _f Function to be integrated - must accept a numerical argument and return the function value
   * at that argument.
   *
   * @param {number} _a Left-hand value of interval.
   *
   * @param {number} _b Right-hand value of interval, {_b > _a}
   *
   * @param {number} _n Number of nodes -- must be between 2 and 8
   *
   * @returns {number} Approximate integral value over [_a, _b], provided inputs are valid.
   *
   */
   public eval(_f: FcnEval, _a: number, _b: number, _n: number): number
   {
     let n: number = _n < 2 ? 2 : _n;
     n             = n > 8 ? 8 : n;

     const l: number   = (n==2) ? 0 : Math.floor( n*(n-1)/2 - 1 );
     let sum = 0;
     let i   = 0;

     if (_a == -1 && _b == 1)
     {
       while (i < n)
		   {
         sum += _f(this.__abscissa[l+i]) * this.__weight[l+i];
         i++;
		   }

       return sum;
     }
     else
     {
       // change of variable
       const mult: number = 0.5*(_b-_a);
       const ab2: number  = 0.5*(_a+_b);

       while( i < n )
       {
         sum += _f(ab2 + mult*this.__abscissa[l+i])*this.__weight[l+i];
         i++;
		   }

       return mult*sum;
     }
   }
 }
