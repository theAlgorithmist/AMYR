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
 * AMYR Library Some methods for numerical evaluation of the first derivative of a function.
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */
import { FcnEval } from "../../../models/fcn-eval";

export class TSMT$Derivative
{
  public static LIMIT = 8;  // Iteration limit for Ridders' method

  constructor()
  {
    // empty
  }

 /**
  * Approximate the derivative using central differences
  *
  * @param {FcnEval} f Function reference that takes single argument, x, and returns f(x) - the function whose
  * derivative is desired
  *
  * @param {number} x Domain value at which the derivative is desired
  *
  * @parah {number} h Increment - must be greater than zero and suitably small for the domain over which the
  * derivative is desired.
  */
  public static centralDiff(f: FcnEval, x: number, h: number): number
  {
    return (f(x+h) - f(x-h))/(h+h);
  }

 /**
  * Approximate the derivative using a higher-order difference formula (better accuracy, but assumption of the
  * existence of up to fifth-order continuous derivative)
  *
  * @param {FcnEval} f Function reference that takes single argument, x, and returns f(x) - the function whose
  * derivative is desired
  *
  * @param {number} x Domain value at which the derivative is desired
  *
  * @param {number} h Increment - must be greater than zero and suitably small for the domain over which the
  * derivative is desired.
  */
  public static cdiff_high(f: FcnEval, x: number, h: number): number
  {
    const h2: number = h+h;
    return ( -f(x+h2) + 8.0*f(x+h) -8.0*f(x-h) + f(x-h2) ) / (12.0*h);
  }

 /**
  * Approximate the derivative using Ridders' method (more appropriate for a single or small number of derivative
  * evaluations in an interval)
  *
  * @param {FcnEval} f Function reference that takes single argument, x, and returns f(x) - the function whose
  * derivative is desired
  *
  * @param {number} x Domain value at which the derivative is desired
  *
  * @parah {number} h Increment - must be greater than zero and represent a range over which the function varies in a
  * notable manner - it need not be small.
  */
  public static rDeriv(f: FcnEval, x: number, h: number): number
  {
    const con = 1.4;
    const con2: number = con * con;
    const safe = 2.0;

    let i: number;
    let j: number;

    let errt: number;
    let fac: number;
    let deriv = 0;

    const a: Array<Array<number>> = new Array<Array<number>>();
    for (i = 0; i <TSMT$Derivative.LIMIT; ++i ) {
      a.push([]);
    }

    let hh: number  = h;

    let err: number = Number.MAX_VALUE;
    a[0][0]         = (f(x+hh)-f(x-hh))/(2.0*hh);

    for (i = 1; i < TSMT$Derivative.LIMIT; ++i )
    {
      hh     /= con;
      a[0][i] = (f(x+hh)-f(x-hh))/(2.0*hh);
      fac     = con2;

      for (j = 1; j <= i; ++j)
      {
        a[j][i] = (a[j-1][i]*fac - a[j-1][i-1])/(fac-1.0);
        fac     = con2*fac;
        errt    = Math.max( Math.abs(a[j][i]-a[j-1][i]), Math.abs( a[j][i]-a[j-1][i-1]) );

        if (errt < err)
        {
          err = errt;
          deriv = a[j][i];
        }
      }

      if( Math.abs(a[i][i] - a[i-1][i-1]) >= safe*err ) break;
    }

    return deriv;
  }
}
