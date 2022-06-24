/** Copyright 2016 Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
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
import {
  LLSQResult,
  PolyLLSQResult
} from "../../../../../models/regression-models";

import { linearFit } from "../../../statistics/regression/llsq";
import {Pllsq} from "../../../statistics/regression/pllsq";

const polyFit = new Pllsq();

// Test Suites
describe('Linear Regression Invalid Inputs and Edge Cases', () => {

  it('returns empty result for undefined arrays', function() {
    let x: any = null;
    let y: any = undefined;
    expect(linearFit(x, y).a).toEqual(0);
    expect(linearFit(x, y).b).toEqual(0);

    x = undefined;
    y = null;
    expect(linearFit(x, y).a).toEqual(0);
    expect(linearFit(x, y).b).toEqual(0);
  });

  it('returns empty result for zero-length inputs', function() {
    let x: Array<number> = [];
    let y: Array<number> = [1, 2, 3];
    expect(linearFit(x, y).a).toEqual(0);
    expect(linearFit(x, y).b).toEqual(0);

    x = [0, 1, 2];
    y = [];
    expect(linearFit(x, y).a).toEqual(0);
    expect(linearFit(x, y).b).toEqual(0);
  });

  it('returns empty result for non-array', function() {
    const x: any = 'blah';
    const y: Array<number> = [1, 2, 3];
    expect(linearFit(x, y).a).toEqual(0);
    expect(linearFit(x, y).b).toEqual(0);

    expect(linearFit(y, x).a).toEqual(0);
    expect(linearFit(y, x).b).toEqual(0);
  });

  it('degenerate points test', function() {
    const x: Array<number> = [1, 1, 1];
    const y: Array<number> = [1, 1, 1];

    const fit: LLSQResult = linearFit(x, y);
    expect(linearFit(x, y).a).toEqual(0);
    expect(linearFit(x, y).b).toEqual(0);
  });

  it('inconsistent length test', function() {
    const x: Array<number> = [1, 2, 3];
    const y: Array<number> = [4, 5, 6, 7];

    const fit: LLSQResult = linearFit(x, y);
    expect(linearFit(x, y).a).toEqual(0);
    expect(linearFit(x, y).b).toEqual(0);
  });

});

describe('Linear Regression Basic Tests', () => {

  it('Basic Test #1', function() {
    const x: Array<number> = [1.7, 1.5, 2.8, 5, 1.3, 2.2, 1.3];
    const y: Array<number> = [368, 340, 665, 954, 331, 556, 376];

    const fit: LLSQResult = linearFit(x, y);

    expect(fit.a).toBeCloseTo(171.5, 1);
    expect(fit.b).toBeCloseTo(125.8, 1);
    expect(fit.r).toBeGreaterThan(0.9);
  });

  it('Basic Test #2', function() {
    const x: Array<number> = [23, 26, 30, 34, 43, 48, 52, 57, 58];
    const y: Array<number> = [651, 762, 856, 1063, 1190,1298,1421, 1440, 1518];

    const fit: LLSQResult = linearFit(x, y);

    expect(fit.a).toBeCloseTo(23.42, 2);
    expect(fit.b).toBeCloseTo(167.68, 2);
    expect(fit.r).toBeGreaterThan(0.95);
  });
});

describe('Polynomial Regression Error and Edge Tests', () => {

  it('Returns empty value for invalid inputs', function() {
    const x: any = undefined;
    const y: any = null;

    let fit: PolyLLSQResult = polyFit.fit(x, y, 2);

    expect(fit.coef.length).toEqual(0);
    expect(fit.rms).toEqual(0);

    fit = polyFit.fit(y, x, 2);

    expect(fit.coef.length).toEqual(0);
    expect(fit.rms).toEqual(0);
  });

  it('Returns empty value for non-array inputs', function() {
    const x: any           = 'a string';
    const y: Array<number> = [1, 2, 3];

    let fit: PolyLLSQResult = polyFit.fit(x, y, 2);

    expect(fit.coef.length).toEqual(0);
    expect(fit.rms).toEqual(0);

    fit = polyFit.fit(y, x, 2);

    expect(fit.coef.length).toEqual(0);
    expect(fit.rms).toEqual(0);
  });

  it('Returns empty value for zero-length inputs', function() {
    const x: Array<number> = [];
    const y: Array<number> = [1, 2, 3];

    let fit: PolyLLSQResult = polyFit.fit(x, y, 2);

    expect(fit.coef.length).toEqual(0);
    expect(fit.rms).toEqual(0);

    fit = polyFit.fit(y, x, 2);

    expect(fit.coef.length).toEqual(0);
    expect(fit.rms).toEqual(0);
  });

  it('Returns singleton point for single input point', function() {
    const x: Array<number> = [1];
    const y: Array<number> = [1];

    const fit: PolyLLSQResult = polyFit.fit(x, y, 2);

    expect(fit.coef.length).toEqual(3);
    expect(fit.coef[0]).toEqual(1);
    expect(fit.rms).toEqual(0);
  });

  it('Two-point (line) test #1', function() {
    const x: Array<number> = [1, 2];
    const y: Array<number> = [1, 2];

    const fit: PolyLLSQResult = polyFit.fit(x, y, 2);

    expect(fit.coef.length).toEqual(3);
    expect(fit.coef[0]).toEqual(0);
    expect(fit.coef[1]).toEqual(1);
    expect(fit.coef[2]).toEqual(0);
    expect(fit.rms).toEqual(0);
  });

  it('Two-point (line) test #2', function() {
    // vertical slope edge case
    const x: Array<number> = [1, 1];
    const y: Array<number> = [1, 3];

    const fit: PolyLLSQResult = polyFit.fit(x, y, 2);

    expect(fit.coef.length).toEqual(3);
    expect(fit.coef[0]).toEqual(2);
    expect(fit.coef[1]).toEqual(0);
    expect(fit.coef[2]).toEqual(0);
    expect(fit.rms).toEqual(0);
  });

  it('Two-point (line) test #3', function() {
    const x: Array<number> = [2, 8];
    const y: Array<number> = [3, 6];

    const fit: PolyLLSQResult = polyFit.fit(x, y, 2);

    expect(fit.coef.length).toEqual(3);
    expect(fit.coef[0]).toEqual(2);
    expect(fit.coef[1]).toEqual(0.5);
    expect(fit.coef[2]).toEqual(0);
    expect(fit.rms).toEqual(0);

    const result: number = polyFit.eval(4);
    expect(result).toEqual(4);
  });
});

describe('Polynomial Regression General Tests', () => {

  it('', function () {
    const x: any = [50, 50, 50, 70, 70, 70, 80, 80, 80, 90, 90, 90, 100, 100, 100];
    const y: any = [3.3, 2.8, 2.9, 2.3, 2.6, 2.1, 2.5, 2.9, 2.4, 3.0, 3.1, 2.8, 3.3, 3.5, 3.0];

    const fit: PolyLLSQResult = polyFit.fit(x, y, 2);

    console.log('fit', fit);

    expect(fit.coef.length).toEqual(3);
    expect(fit.coef[0]).toBeCloseTo(7.96048, 5);
    expect(fit.coef[1]).toBeCloseTo(-0.1537, 4);
    expect(fit.coef[2]).toBeCloseTo(0.0010756, 5);
    expect(fit.rms).toBeCloseTo(0.218597, 5);
  });

});
