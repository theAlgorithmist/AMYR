/**
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
 * AMYR Library: Nelder-Mead simplex optimization for a function with a modest (say less than ten) number of independent
 * variables.  This implementation is oriented towards applications where the cost of the objective well exceeds the cost
 * of a single (non-shrink) iteration (i.e. statistical parameter estimation).  Some performance optimizations are noted
 * that could be implemented for other use cases.  Two methods are provided for creating the initial simplex and two
 * termination (iteration count and function-value) criteria are supported.  There are known issues with domain-value
 * termination criteria and a reference is provided for a known and highly effective domain convergence test.  Another
 * reference is provided that provides alternate formulas for adaptively setting initial parameter (reflect, expand,
 * contract, shrink) parameters.  This implementation uses initial parameter values that are standard in the literature
 * (and can be overridden by user input).
 *
 * @param initial Initial guess for a solution
 *
 * @param objective Objective function to be minimized
 *
 * @params object Optional parameters that can be used in objective-function evaluation
 *
 * @param maxIterations Upper iteration limit
 *
 * @param unitLength True if the unit-length simplex algorithm is used to create an initial simplex
 *
 * @param scale Optional scale factor for the unit-length initial simplex
 *
 * @param reflect Reflect coefficient
 *
 * @param expand Expand coefficient
 *
 * @param contract Contract coefficient
 *
 * @param shrink Shrink coefficient
 *
 * @author Jim Armstrong
 *
 * @version 1.0
 *
 * References:
 *
 * (1) D. J. Wilde and C. S. Beightler, Foundations of Optimization. Englewood Cliffs, N.J., Prentice-Hall, 1967
 *
 * (2) F. Gao, L. Han, Implementing the Nelder Mead simplex algorithm with adaptive parameters, Computational
 * Optimization Applications, DOI 10.0007/s10589-010-9329-3
 *
 * (3) Singer, Saša and Singer, Sanja (2004), “Efficient Implementation of the Nelder-Mead Search Algorithm”, Appl. Numer.
 * Anal. Comput. Math. 1, No. 3, pp. 524–534.
 */

import { NM_EPSILON } from "../../models/constants";
import { NMSimplex  } from '../../models/optimization-models';

export function sortSimplex(a: NMSimplex, b: NMSimplex): number
{
  return a.y - b.y;
}

export function nelderMead(
  initial: Array<number>,
  objective: (x: Array<number>, params?: object) => number,
  params: Record<string, any> = {},
  maxIterations: number = 0,
  unitLength: boolean = true,
  scale: number  = 1.0,
  reflect: number = 1.0,
  expand: number = 2.0,
  contract: number = 0.5,
  shrink: number = 0.5
): Array<number>
{
  if (objective === undefined || objective == null) return [];

  const n: number = initial.length;
  if (n === 0) return [];

  const alpha: number = !isNaN(reflect) && reflect > 0 ? reflect : 1.0;
  const gamma: number  = !isNaN(expand) && expand > 1 ? expand : 2.0;
  const beta: number = !isNaN(contract) && contract > 0 ? Math.min(contract, 0.5) : 0.5;
  const delta: number = !isNaN(shrink) && shrink > 0 ? Math.min(shrink, 0.5) : 0.5;

  const iterCount: number = !isNaN(maxIterations) && maxIterations > 0 ? maxIterations : n*50;

  const simplex: Array<NMSimplex> = new Array<NMSimplex>();

  const nInverse: number = 1.0 / n;

  let i: number;
  let j: number;

  // Create the initial simplex
  if (unitLength)
  {
    // initial simplex is scaled version of unit-length algorithm due to Spendly, Hext, & Himsworth
    const scaleFactor: number = !isNaN(scale) && scale > 1 ? scale : 1.0;
    const nsqrt2: number      = n*Math.sqrt(2.0);
    const sqrtnm1: number     = Math.sqrt(n+1) - 1;
    const p: number           = scaleFactor * (sqrtnm1 + n) / nsqrt2;
    const q: number           = scaleFactor * (sqrtnm1) / nsqrt2;

    simplex.push({x: initial.slice(), y: objective(initial, params)});

    for (i = 1; i <= n; ++i)
    {
      simplex.push({x: new Array<number>(), y: 0});
      const arr: Array<number> = simplex[i].x;

      for (j = 0; j < n; ++j) {
        arr.push((i - 1 === j) ? p + initial[j] : q + initial[j]);
      }

      simplex[i].y = objective(arr, params);
    }
  }
  else
  {
    // initial simplex is perturbation of initial vector about each basis vector
    simplex.push({x: initial.slice(), y: objective(initial, params)});

    for (i = 0; i < n; ++i)
    {
      const x: Array<number> = initial.slice();
      x[i]                  = x[i] ? x[i] * 1.05 : 0.05;

      simplex.push( {x: x, y: objective(x, params)} );
    }
  }

  const centroid: Array<number>   = initial.slice();
  const reflected: Array<number>  = initial.slice();
  const contracted: Array<number> = initial.slice();
  const expanded: Array<number>   = initial.slice();

  let iter        = 0;
  let reflectedY  = 0;
  let expandedY   = 0;
  let contractedY = 0;

  for (iter = 0; iter < iterCount; ++iter)
  {
    // future perf. optimization - for case where previous iter was non-shrink, i.e. only ONE vertex was updated
    //
    // (1) update vertex order with one step of straight insertion sort
    // (2) computed new centroid by direct update from prior centroid instead of full recompute
    //
    // These optimizations, however, are only useful when the cost of objective evaluations is low compared to
    // the cost of a single iteration.
    simplex.sort(sortSimplex);

    // compute centroid (full update)
    for (i = 0; i < n; ++i)
    {
      let s = 0.0;

      for (j = 0; j < n; ++j) {
        s += simplex[j].x[i];
      }

      centroid[i] = s*nInverse;
    }

    // reflection x(r) => x(c) + alpha*(x(c) - x(n))
    let x: Array<number> = simplex[n].x;
    for (i = 0; i < n; ++i) {
      reflected[i] = centroid[i] + alpha*(centroid[i] - x[i]);
    }

    reflectedY = objective(reflected, params);

    let shrink = false;

    // choose expand or contract
    if (reflectedY < simplex[0].y)
    {
      // expand, x(e) => x(c) + gamma*(x(r) - x(c))
      for (i = 0; i < n; ++i) {
        expanded[i] = centroid[i] + gamma*(reflected[i] - centroid[i]);
      }

      expandedY = objective(expanded, params);

      if (expandedY < reflectedY)
      {
        simplex[n].x = expanded.slice();
        simplex[n].y = expandedY;
      }
      else
      {
        simplex[n].x = reflected.slice();
        simplex[n].y = reflectedY;
      }
    }
    else if (reflectedY >= simplex[n-1].y)
    {
      // outside or inside contraction
      if (reflectedY >= simplex[n].y)
      {
        // inside contraction
        x = simplex[n].x;
        for (i = 0; i < n; ++i) {
          contracted[i] = centroid[i] + beta*(x[i] - centroid[i]);
        }

        contractedY = objective(contracted, params);

        if (contractedY <= reflectedY)
        {
          simplex[n].x = contracted.slice();
          simplex[n].y = contractedY;
        }
        else
        {
          // time to shrink
          shrink = true;
        }
      }
      else
      {
        // outside contraction
        for (i = 0; i < n; ++i) {
          contracted[i] = centroid[i] + beta*(reflected[i] - centroid[i]);
        }

        contractedY = objective(contracted, params);

        if (contractedY < simplex[n].y)
        {
          simplex[n].x = contracted.slice();
          simplex[n].y = contractedY;
        }
        else
        {
          // shrink it ...
          shrink = true;
        }
      }

      if (shrink)
      {
        const best: Array<number> = simplex[0].x;

        // shrink
        for (i = 1; i <= n; ++i)
        {
          const x: Array<number> = simplex[i].x;

          for (j = 0; j < n; ++j) {
            x[j] = best[j] + delta * (x[j] - best[j]);
          }

          simplex[i].y = objective(x, params);
        }
      }
    }
    else
    {
      // accept the iteration with the reflected vertex
      simplex[n].x = reflected.slice();
      simplex[n].y = reflectedY;
    }

    // temporary function-value convergence test (every couple iterations)
    // TODO apply more efficient simplex volume update as described in (3)
    if (iter % 2 === 0)
    {
      let sumFcn = 0.0;
      for (i = 0; i <= n; ++i) {
        sumFcn += simplex[i].y;
      }

      const avg: number = sumFcn / (n + 1);
      let sum           = 0.0;
      for (j = 0; j <= n; j++)
      {
        const x: number = simplex[j].y - avg;
        sum += x*x / n;
      }

      if (Math.sqrt(sum) < NM_EPSILON) break;
    }
  }

  simplex.sort(sortSimplex);

  return simplex[0].x;
}
