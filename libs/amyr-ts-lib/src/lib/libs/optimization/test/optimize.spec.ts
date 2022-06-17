/**
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

import { nelderMead } from "../nelder-mead";

const f1: (x: Array<number>, params?: object) => number = (x: Array<number>) => {
  return Math.log( 1 + Math.pow(Math.abs(x[0]), 2 + Math.sin(x[0])) );
};

const rosenbrock: (x: Array<number>, params?: Record<string, any>) => number = (x: Array<number>, params?: Record<string, any>) => {
  const a: number  = params?.['a'] !== undefined ? +params['a'] : 1;
  const b: number  = params?.['b'] !== undefined ? +params['b'] : 100;
  let axsq: number = a - x[0];
  axsq            *= axsq;

  let bysq: number = x[1] - x[0]*x[0];
  bysq            *= bysq;
  bysq            *= b;

  return axsq + bysq;
};

// Test Suites
describe('NM Simplex Tests', () => {

  test('returns empty solution for undefined objective', function() {
    const tmp: any                = null
    const solution: Array<number> = nelderMead([], tmp);

    expect(solution).toBeTruthy();
    expect(solution.length).toEqual(0);
  });

  test('returns empty solution for undefined objective', function() {
    const solution: Array<number> = nelderMead([], (x: Array<number>): number => x[0]+1);

    expect(solution.length).toEqual(0);
  });

  test('basic 1D test', function() {
    const tmp: any                = null;
    const solution: Array<number> = nelderMead([-5], f1, tmp, 10);

    expect(solution[0]).toEqual(0);
    expect(f1(solution)).toEqual(0);
  });


  test('basic 1D test #2', function() {
    const tmp: any                = null;
    const solution: Array<number> = nelderMead([2], f1, tmp);

    expect(solution[0]).toEqual(0);
    expect(f1(solution)).toEqual(0);
  });

  test('2D test (rosenbrock) fixed iter.', function() {
    const solution: Array<number> = nelderMead([-1.2, 1], rosenbrock, {a: 1, b: 100}, 60);

    expect(solution[0]).toBeCloseTo(0.9997022574215106, 6);
    expect(solution[1]).toBeCloseTo(0.9993675177194592, 6);
    expect(rosenbrock(solution, {a: 1, b: 100})).toBeCloseTo(2.2618610788492934e-7, 6);
  });

  test('2D test (rosenbrock) stopping criteria', function() {
    const solution: Array<number> = nelderMead([-1.2, 1], rosenbrock, {a: 1, b: 100});

    expect(solution[0]).toBeCloseTo(1.000224313353957, 6);
    expect(solution[1]).toBeCloseTo(1.0004554887782764, 6);
    expect(rosenbrock(solution, {a: 1, b: 100})).toBeCloseTo(5.495647985781671e-8, 6);
  });
});
