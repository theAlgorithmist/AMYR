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

import { DataStats    } from "../../statistics/data-stats";
import { ChiSquare    } from "../../statistics/chi-square";
import { BinomialCoef } from "../../statistics/binomial-coef";

import { vectorCompare } from '../../utils/compare-utils';
import * as spcfcn from '../../statistics/special-fcn';

// Test Suites
describe('Special Functions', () => {

  it('incomplete beta returns 0 and 1 for 0 and 1 inputs', function() {
    expect(spcfcn.incompleteBeta(1, 1, 0)).toEqual(0);
    expect(spcfcn.incompleteBeta(1, 1, 1)).toEqual(1);
  });

  it('incomplete beta returns correct result for (a, b, x) = (1, 3, 0.4)', function() {
    expect(spcfcn.incompleteBeta(1, 3, 0.4)).toBeCloseTo(0.784, 3);
  });

  it('incomplete beta returns correct result for (a, b, x) = (10, 25, 0.8)', function() {
    expect(spcfcn.incompleteBeta(10, 25, 0.8)).toBeCloseTo( 0.9999, 3);
  });

  it('incomplete beta returns correct result for (a, b, x) = (2, 2, 0.6)', function() {
    expect(spcfcn.incompleteBeta(2, 2, 0.6)).toBeCloseTo(0.648, 3);
  });

  it('ln gamma of x = 1.0 is zero', function() {
    expect(spcfcn.gammaln(1.0)).toBeCloseTo(0.0, 4);
  });

  it('ln gamma of x = 3.5 is correct', function() {
    expect(spcfcn.gammaln(3.5),).toBeCloseTo(1.20097, 4);
  });

  it('ln gamma of x = 10.0 is correct', function() {
    expect(spcfcn.gammaln(10.0)).toBeCloseTo(12.8018, 4);
  });
});

describe('Chi Square', () => {

  it('number degrees of freedom is set properly with invalid inputs', function() {
    const chisq: ChiSquare = new ChiSquare();
    chisq.nu               = NaN;

    expect(chisq.nu).toBe(1);

    chisq.nu = 2.2567;
    expect(chisq.nu).toBe(2);

    chisq.nu = -3.004;
    expect(chisq.nu).toBe(1);
  });

  it('cdf of zero (edge case) returns zero', function() {
    const chisq: ChiSquare = new ChiSquare();
    chisq.nu               = 2;
    const cdf: number      = chisq.cdf(0);

    expect(cdf).toBeCloseTo(0, 3);
  });

  it('computes correct cdf & q #1', function() {
    const chisq: ChiSquare = new ChiSquare();
    chisq.nu               = 2;
    const cdf: number      = chisq.cdf(0.5);
    const q: number        = 1.0 - cdf;

    expect(cdf).toBeCloseTo(0.22, 2);
    expect(q - chisq.q(0.5)).toBeCloseTo(0, 4);
  });

  it('computes correct cdf & q #2', function() {
    const chisq: ChiSquare = new ChiSquare();
    chisq.nu               = 1;
    const cdf: number      = chisq.cdf(0.1);
    const q: number        = 1.0 - cdf;

    expect(cdf).toBeCloseTo(0.25, 2);
    expect(q - chisq.q(0.1)).toBeCloseTo(0, 4);
  });

  it('computes correct cdf & q #3', function() {
    const chisq: ChiSquare = new ChiSquare();
    chisq.nu               = 3;
    const cdf: number      = chisq.cdf(0.8);
    const q: number        = 1.0 - cdf;

    expect(cdf).toBeCloseTo(0.15, 2);
    expect(q - chisq.q(0.8)).toBeCloseTo(0, 4);
  });
});

describe('Basic Data Stats', () => {

  it('does not accept a null data provider', function() {
    const tmp: any           = null;
    const myStats: DataStats = new DataStats();
    myStats.data = tmp;

    expect(myStats.samples).toBe(0);
  });

  it('does not accept a zero-length data provider', function() {
    const myStats: DataStats = new DataStats();
    myStats.data = [];

    expect(myStats.samples).toBe(0);
  });

  it('reports correct sample count for a singleton data provider', function() {
    const myStats: DataStats = new DataStats();
    myStats.data = [1.0];

    expect(myStats.samples).toBe(1);
  });

  it('reports correct min/max/mean/median for a singleton data provider', function() {
    const myStats: DataStats = new DataStats();
    myStats.data = [1.0];

    expect(myStats.min).toBe(1);
    expect(myStats.max).toBe(1);
    expect(myStats.mean).toBe(1);
    expect(myStats.median).toBe(1);
  });


  it('reports correct mean/median/mode for small dataset', function() {
    const myStats: DataStats = new DataStats();

    myStats.data = [60, 64, 70, 70, 70, 75, 80, 90, 95, 95, 100];

    expect(myStats.mean).toBe(79);
    expect(myStats.median).toBe(75);
    expect(myStats.mode).toBe(70);
  });

  it('reports correct mean/median/mode/std for small dataset #2', function() {
    const myStats: DataStats = new DataStats();

    myStats.data = [17, 12, 14, 17, 13, 16, 18, 20, 13, 12,
      12, 17, 16, 15, 14, 12, 12, 13, 17, 14,
      15, 12, 15, 16, 12, 18, 20, 19, 12, 15,
      18, 14, 16, 17, 15, 19, 12, 13, 12, 15
    ];

    expect(myStats.mean).toBe(14.975);
    expect(myStats.median).toBe(15);
    expect(myStats.mode).toBe(12);
    expect(Math.abs(myStats.std-2.496) < 0.001).toBe(true);
  });

  it('reports correct mean/std for larger dataset', function() {
    const myStats: DataStats = new DataStats();

    myStats.data = [ -0.17153201811526, -0.24688253248949, 0.11338441630439, 0.21688342552633, -0.011673274048979,
      -0.02003736435437, -0.34336588850306, 0.078405646177621, -0.065555801648822, 0.028825789263126,
      0.042177644981986, -0.50528595024946, -0.4273793332064, 0.3017619807293, 0.040940131180399,
      0.12162445946489, 0.046924000912204, -0.31441861873484, -0.24797010811493, -0.31245115727514,
      0.36179798762062, -0.46964621705612, 0.1159236116096, 0.44229719468743, 0.17553670198059,
      -0.049653531282555, 0.035737645461893, -0.52367570682749, 0.12014526093805, -0.2060419038672,
      -0.12789255250514, -0.19007839020849, -0.17402649310177, 0.12573206620924, 0.2646133618755,
      0.41670972482352, 0.030866480670971, 0.07031579787869, -0.085545940939841, 0.34396444357458,
      -0.34488388941556, 0.15597328456662, -0.39937390581988, 0.12960169981417, 0.26218698256904,
      -0.1620734969907, -0.028376561029554, -0.080399756342166, 0.14758867251726, -0.23720637932878,
      -0.27695138789864, 0.05257578120839, 0.21722344584028, 0.19122661193002, -0.20626312001628,
      -0.059435335753833, -0.1995971405858, -0.23267982758906, 0.33527000452094, 0.043882296754041,
      -0.07738562758975, 0.5515265183042, 0.34121467746293, 0.011521247389367, 0.17429773253761,
      -0.22635967501679, 0.15713909187964, -0.1787810576828, -0.34801215785823, -0.082164064211855,
      0.64074819328462, -0.044302007836004, -0.38284231659945, -0.41366498500892, -0.15964965729918,
      0.39248247734553, -0.12031750238867, -0.16930717524153, -0.40060591948563, 0.0068312326939647,
      -0.1898421274294, 0.44393250846458, 0.029613400394471, -0.22581182588274, 0.02045533910155,
      0.11398918107627, -0.20562256981737, 0.11476536764274, -0.32378382765313, -0.09196424943184,
      0.17281588794572, -0.35251113939319, 0.073961983637722, 0.11265707197549, -0.317176214879,
      0.091016285581571, -0.14930773416087, 0.047940214497312, -0.13754460419439, -0.078689419991652
    ];

    expect(Math.abs(myStats.mean- -0.0287) < 0.001).toBe(true);
    expect(Math.abs(myStats.std - 0.2447) < 0.001).toBe(true);
  });

  it('reports correct geometric mean #1', function() {
    const myStats: DataStats = new DataStats();

    myStats.data = [10, 51.2, 8];

    expect(Math.abs(myStats.geometricMean-16) < 0.0000001).toBe(true);
  });

  it('reports correct geometric mean #2', function() {
    const myStats: DataStats = new DataStats();

    myStats.data = [1, 3, 9, 27, 81];

    expect(Math.abs(myStats.geometricMean-9) < 0.0000001).toBe(true);
  });

  it('reports correct harmonic mean #1', function() {
    const myStats: DataStats = new DataStats();

    myStats.data = [100, 110, 90, 120];

    expect(Math.abs(myStats.harmonicMean-103.8) < 0.01).toBe(true);
  });

  it('reports correct harmonic mean #2', function() {
    const myStats: DataStats = new DataStats();

    myStats.data = [13.2, 14.2, 14.8, 15.2, 16.1];

    expect(Math.abs(myStats.harmonicMean-14.63) < 0.01).toBe(true);
  });

  it('reports correct skewness #1', function() {
    const myStats: DataStats = new DataStats();

    myStats.data =  [ 61, 61, 61, 61, 61,  64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
      67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67,
      67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70,
      70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 73, 73, 73, 73, 73, 73, 73, 73
    ];

    expect(Math.abs(myStats.skewness - -.108) < 0.001).toBe(true);
  });

  it('reports correct skewness and kurtosis', function() {
    const myStats: DataStats = new DataStats();

    myStats.data = [2, 5, -1, 3, 4, 5, 0, 2];

    expect(Math.abs(myStats.skewness - -.35) < 0.01).toBe(true);
    expect(Math.abs(myStats.kurtosis - -.94) < 0.01).toBe(true);
  });

  it('reports correct sample covariance', function() {
    const myStats: DataStats = new DataStats();
    const cov: number             = myStats.covariance( [2.1, 2.5, 4.0, 3.6], [8, 12, 14, 10] );

    expect(Math.abs(cov - 1.53) < 0.01).toBe(true);
  });

  it('reports correct Pearson corr. coef.', function() {
    const myStats: DataStats = new DataStats();
    const corr: number             = myStats.correlation( [43, 21, 25, 42, 57, 59, 247], [99, 65, 79, 75, 87, 81, 486] );

    expect(Math.abs(corr - 0.98761) < 0.0001).toBe(true);
  });
});

describe("Binomial Coef. Pascal's Triangle", () => {

  const binomial: BinomialCoef = new BinomialCoef();

  it('caches row 2 for a default instance', () => {
    expect(binomial.rowNumber).toBe(2);
  });

  it('returns empty row for invalid numeric input', () => {
    const crapola: any = 'abc';

    expect(binomial.getRow(crapola).length).toBe(0);
  });

  it('returns empty row for negative row value', () => {
    expect(binomial.getRow(-1).length).toBe(0);
  });

  it('returns zero for binomial coefficient with invalid inputs #1', () => {
    const morecrapola: any = 'x';

    expect(binomial.coef(morecrapola, 1)).toBe(0);
  });

  it('returns zero for binomial coefficient with invalid inputs #2', () => {
    const evenmorecrapola: number = 1/0;

    expect(binomial.coef(2, evenmorecrapola)).toBe(0);
  });

  it('returns correct third row', () => {
    const row: Array<number> = binomial.getRow(2);
    const compare: boolean   = vectorCompare(row, [1,2,1]);
    expect(compare).toBe(true);
  });

  // iterate forward a couple rows
  it('returns correct sixth row', () => {
    const row: Array<number> = binomial.getRow(5);
    expect(vectorCompare(row, [1, 5, 10, 10, 5, 1])).toBe(true);
  });

  // forward, then reverse
  it('does correct forward/reverse recursion row #1', () => {
    let row: Array<number> = binomial.getRow(7);
    expect(vectorCompare(row, [1, 7, 21, 35, 35, 21, 7, 1])).toBe(true);

    row = binomial.getRow(6);
    expect(vectorCompare(row, [1, 6, 15, 20, 15, 6, 1])).toBe(true);
  });

  // one more time
  it('does correct forward/reverse recursion row #2', () => {
    let row: Array<number> = binomial.getRow(12);
    expect(vectorCompare(row, [1, 12, 66, 220, 495, 792, 924, 792, 495, 220, 66, 12, 1])).toBe(true);

    row = binomial.getRow(10);
    expect(vectorCompare(row, [1, 10, 45, 120, 210, 252, 210, 120, 45, 10, 1])).toBe(true);
  });

  // binomial coefficients, same row - symmetry check
  it('does correct binomial coef. calc in same row #1', () => {
    let coef: number = binomial.coef(10, 2);
    expect(coef).toBe(45);

    coef = binomial.coef(10, 5);
    expect(coef).toBe(252);

    coef = binomial.coef(10, 8);
    expect(coef).toBe(45);
  });

  // one more time
  it('does correct binomial coef. calc in same row #2', () => {
    let coef: number = binomial.coef(19, 5);
    expect(coef).toBe(11628);

    coef = binomial.coef(19, 10);
    expect(coef).toBe(92378);

    coef = binomial.coef(19, 14);
    expect(coef).toBe(11628);
  });
});
