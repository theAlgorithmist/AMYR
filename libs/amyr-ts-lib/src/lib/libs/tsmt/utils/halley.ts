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
 * AMYR Libraryt: Implementation of Halley's method (the function must have a continuous first and
 * second derivative in the interval of evaluation)
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */
import { FcnEval } from "../../../models/geometry";
import {
  ZERO_TOL,
  ROOT_ITER_LIMIT
} from "../../../models/geometry";

 /**
  * Find a root of the supplied function
  *
  * @param {number} start desired starting point for iteration
  *
  * @param {FcnEval} _function reference to <code>Function</code> to evalute f(x)
  *
  * @param {FcnEval} _deriv reference to <code>Function</code> to evaluate f'(x)
  *
  * @param {FcnEval} _secondDeriv reference to <code>Function</code> to evaluate f''(x)
  */
  export function halleyRoot(start: number, _fcn: FcnEval, _deriv: FcnEval, _secondDeriv: FcnEval ): number
  {
    let iter = 1;

    if (_fcn == null || _deriv == null) return start;

    let previous: number  = start;
    let f: number         = _fcn(previous);
    let deriv: number     = _deriv(previous);
    let x: number         = previous - (2*f*deriv) / (2*deriv*deriv - f*_secondDeriv(previous));
    let finished: boolean = Math.abs(x - previous) < ZERO_TOL;

    while (iter < ROOT_ITER_LIMIT && !finished)
    {
      previous = x;
      f        = _fcn(previous);
      deriv    = _deriv(previous);
      x        = previous - (2*f*deriv) / (2*deriv*deriv - f*_secondDeriv(previous));
      finished = Math.abs(x - previous) < ZERO_TOL;

      iter++;
    }

    return x;
  }
