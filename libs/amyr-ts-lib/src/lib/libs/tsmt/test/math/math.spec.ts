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

// Specs for TSMT Math classes
import { TSMT$Matrix             } from "../../math/matrix";
import { repeatToFraction        } from "../../math/repeat-to-frac";
import { SimpleFraction          } from "../../math/repeat-to-frac";
import { TSMT$PrimeFactorization } from "../../math/prime-factorization";
import {
  TSMT$Quaternion,
  Quaterion
} from "../../math/quaternion";

// compare two vectors (array of numbers) against the specified relative error
const __vectorCompare = (vector1:Array<number>, vector2:Array<number>, epsilon:number=0.01): boolean =>
{
  const n1:number = vector1.length;
  const n2:number = vector2.length;

  if (n1 != n2) return false;

  let i:number;
  let v:number;

  for (i=0; i<n1; ++i )
  {
    v = Math.abs( (vector1[i]-vector2[i])/vector1[i] );
    if( v > epsilon ) return false;
  }

  return true;
};

// compare two matrices, elementwise against the specified relative error
const __matrixCompare = (matrix1:TSMT$Matrix, matrix2:TSMT$Matrix, epsilon:number=0.01): boolean =>
{
  // compare dimensions
  const m1:number = matrix1.m;
  const n1:number = matrix1.n;
  const m2:number = matrix2.m;
  const n2:number = matrix2.n;

  if (m1 != m2 || n1 != n2) return false;

  let i:number;
  let row1:Array<number>;
  let row2:Array<number>;

  // row-wise compare
  for (i = 0; i < m1; ++i)
  {
    row1 = matrix1.getRow(i);
    row2 = matrix2.getRow(i);

    if (row1.length != row2.length) return false;

    if (!__vectorCompare(row1, row2, epsilon)) return false;
  }

  return true;
}

// Test Suites
describe('The Matrix has you', () => {

  let __matrix: TSMT$Matrix = new TSMT$Matrix();   // dense matrix
  let matrix: TSMT$Matrix   = new TSMT$Matrix();

  const _matrix: Array<Array<number>> = new Array<Array<number>>();

  // old-school
  _matrix.push( [1,2,3] );
  _matrix.push( [3,4,5] );
  _matrix.push( [5,7,8] );

  let m: number;
  let n: number;
  let x: Array<number>;
  let b: Array<number>;

  it('new matrix has dimensions 0x0', function() {
    expect(__matrix.m).toBe(0);
    expect(__matrix.n).toBe(0);
  });

  it('creates a new matrix from an array of arrays', function() {
    __matrix.fromArray(_matrix);

    expect(__matrix.m).toBe(3);
    expect(__matrix.n).toBe(3);

    const row:Array<number> = __matrix.getRow(1);
    expect(__vectorCompare(row, _matrix[1])).toBe(true);
  });

  it('fetches a column from an existing matrix', function() {
    const col:Array<number> = __matrix.getColumn(2);

    expect(__vectorCompare(col, [3,5,8])).toBe(true);
  });

  it('returns empty array for fetching invalid row index', function() {
    const row:Array<number> = __matrix.getRow(5);

    expect(row.length).toBe(0);
  });

  it('properly clears the matrix', function() {
    __matrix.clear();

    expect(__matrix.m).toBe(0);
    expect(__matrix.n).toBe(0);
  });

  it('properly appends rows to end of the matrix', function() {
    __matrix.addRow( [1,2,3] );
    __matrix.appendRow( [4,5,6] );

    expect(__matrix.m).toBe(2);
    expect(__matrix.n).toBe(3);

    const row = __matrix.getRow(0);
    expect(__vectorCompare(row, [1,2,3])).toBe(true);
  });

  it('properly adds rows to beginning of the matrix', function() {
    __matrix.addRow( [-1,-2,-3] );

    expect(__matrix.m).toBe(3);
    expect(__matrix.n).toBe(3);

    const row: Array<number> = __matrix.getRow(2);

    expect(__vectorCompare(row, [4,5,6])).toBe(true);
  });

  it('properly inserts a row into the matrix', function() {
    __matrix.insertRow( 1, [0,0,0] );

    expect(__matrix.m).toBe(4);
    expect(__matrix.n).toBe(3);

    let row: Array<number> = __matrix.getRow(0);
    expect(__vectorCompare(row, [-1,-2,-3])).toBe(true);

    row = __matrix.getRow(1);
    expect(__vectorCompare(row, [0,0,0])).toBe(true);

    row = __matrix.getRow(2);
    expect(__vectorCompare(row, [1,2,3])).toBe(true);
  });

  it('properly removes first and last rows from the matrix', function() {
    __matrix.removeFirst();
    __matrix.removeLast();

    expect(__matrix.m).toBe(2);
    expect(__matrix.n).toBe(3);

    const row: Array<number> = __matrix.getRow(0);
    expect(__vectorCompare(row, [0,0,0])).toBe(true);
  });

  it('properly deletes a row from the matrix', function() {
    __matrix.deleteRow(0);

    expect(__matrix.m).toBe(1);
    expect(__matrix.n).toBe(3);

    const row: Array<number> = __matrix.getRow(0);
    expect(__vectorCompare(row, [1,2,3])).toBe(true);
  });

  it('correctly clones a matrix', function() {
    __matrix.clear();

    __matrix.appendRow( [1, -2, -2, -3] );
    __matrix.appendRow( [3, -9, 0, -9] );
    __matrix.appendRow( [-1, 2, 4, 7] );
    __matrix.appendRow( [-3, -6, 26, 2] );

    matrix = __matrix.clone();

    expect(__matrixCompare(matrix, __matrix)).toBe(true);
  });

  it('correctly adds a matrix in-place', function() {
    __matrix.add( matrix );

    matrix.clear();

    matrix.appendRow( [2, -4, -4, -6] );
    matrix.appendRow( [6, -18, 0, -18] );
    matrix.appendRow( [-2, 4, 8, 14] );
    matrix.appendRow( [-6, -12, 52, 4] );

    expect(__matrixCompare(matrix, __matrix)).toBe(true);
  });

  it('correctly adds a matrix and returns another matrix', function() {
    matrix.clear();

    matrix.appendRow( [-2, 4, 4, 6] );
    matrix.appendRow( [-6, 18, 0, 18] );
    matrix.appendRow( [2, -4, -8, -14] );
    matrix.appendRow( [6, 12, -52, -4] );

    const newMatrix:TSMT$Matrix | null = __matrix.addTo( matrix );

    matrix.clear();

    matrix.appendRow( [0, 0, 0, 0] );
    matrix.appendRow( [0, 0, 0, 0] );
    matrix.appendRow( [0, 0, 0, 0] );
    matrix.appendRow( [0, 0, 0, 0] );

    expect(__matrixCompare(newMatrix as TSMT$Matrix, matrix)).toBe(true);
  });

  it('correctly multiplies by scalar & subtracts a matrix in-place', function() {
    __matrix.clear();
    matrix.clear();

    matrix.appendRow( [1, 2, 3, 4] );
    matrix.appendRow( [5, 6, 7, 8] );
    matrix.appendRow( [9, 10, 11, 12] );
    matrix.appendRow( [13, 14, 15, 16] );

    __matrix = matrix.clone();
    __matrix.timesScalar(2.0);
    __matrix.subtract(matrix);

    expect(__matrixCompare(matrix, __matrix)).toBe(true);
  });

  it('correctly deletes row and transposes matrix', function() {
    __matrix.deleteRow(3);
    __matrix.transpose();

    expect( __matrix.m ).toBe(4);
    expect( __matrix.n ).toBe(3);

    matrix.clear();
    matrix.appendRow( [1, 5, 9] );
    matrix.appendRow( [2, 6, 10] );
    matrix.appendRow( [3, 7, 11] );
    matrix.appendRow( [4, 8, 12] );

    // this one also test that the class is correctly preserving immutability when building matrices from other matrices and arrays
    expect(__matrixCompare(matrix, __matrix)).toBe(true);
  });

  it('correctly multiplies a matrix times a vector', function() {
    __matrix.clear();

    __matrix.appendRow( [1, 2, 3] );
    __matrix.appendRow( [4, 5, 6] );
    __matrix.appendRow( [7, 8, 9] );
    __matrix.appendRow( [10, 11, 12] );

    const result:Array<number> = __matrix.timesVector( [-2, 1, 0] );

    expect(__vectorCompare(result, [0, -3, -6, -9])).toBe(true);
  });

  it('correctly multiplies a matrix times another matrix', function() {
    __matrix.clear();
    matrix.clear();

    __matrix.appendRow( [1, 3, 5, 7] );
    __matrix.appendRow( [2, 4, 6, 8] );

    matrix.appendRow( [1, 8, 9] );
    matrix.appendRow( [2, 7, 10] );
    matrix.appendRow( [3, 6, 11] );
    matrix.appendRow( [4, 5, 12] );

    __matrix.multiply(matrix);

    matrix.clear();
    matrix.appendRow( [50, 94, 178] );
    matrix.appendRow( [60, 120, 220] );

    expect(__matrixCompare(__matrix, matrix)).toBe(true);
  });

  it('returns empty matrix for incorrect multiplication', function() {
    __matrix.clear();
    matrix.clear();

    __matrix.appendRow( [1, 3, 5] );
    __matrix.appendRow( [2, 4, 6] );
    __matrix.appendRow( [-1, 4, 3] );

    matrix.appendRow( [1, 8, 9] );
    matrix.appendRow( [2, 7, 10] );
    matrix.appendRow( [3, 6, 11] );
    matrix.appendRow( [4, 5, 12] );

    const t:TSMT$Matrix = __matrix.multiplyInto(matrix);

    expect(t.m).toBe(0);
    expect(t.n).toBe(0);
  });

  it('correctly sums matrix columns', function() {
    __matrix.clear();

    __matrix.appendRow( [1, 3, 5] );
    __matrix.appendRow( [2, 4, 6] );
    __matrix.appendRow( [-1, 4, 3] );

    const sum: Array<number> = __matrix.sumColumns();

    expect(__vectorCompare(sum, [2, 11, 14])).toBe(true);
  });

  it('correctly sums matrix rows', function() {
    __matrix.clear();

    __matrix.appendRow( [1, 3, 5] );
    __matrix.appendRow( [2, 4, 6] );
    __matrix.appendRow( [-1, 4, 3] );

    const sum: Array<number> = __matrix.sumRows();

    expect(__vectorCompare(sum, [9, 12, 6])).toBe(true);
  });

  it('correctly LU factors and solves a system of equations', function() {
    __matrix.clear();

    __matrix.appendRow( [1, -2, -2, -3] );
    __matrix.appendRow( [3, -9, 0, -9] );
    __matrix.appendRow( [-1, 2, 4, 7] );
    __matrix.appendRow( [-3, -6, 26, 2] );

    expect(__matrix.factorized).toBe(false);
    const solution:Array<number> = __matrix.solve( [1, 1, 1, 1] );
    expect(__matrix.factorized).toBe(true);

    __matrix.clear();

    __matrix.appendRow( [1, -2, -2, -3] );
    __matrix.appendRow( [3, -9, 0, -9] );
    __matrix.appendRow( [-1, 2, 4, 7] );
    __matrix.appendRow( [-3, -6, 26, 2] );

    expect(__matrix.factorized).toBe(false);

    const check:Array<number> = __matrix.timesVector(solution);

    expect(__vectorCompare(check, [1,1,1,1])).toBe(true);
  });
});

describe('Repeating Decimal As Fraction', () => {

  it('returns null for empty input', () => {
    const frac: SimpleFraction | null = repeatToFraction("");

    expect(frac).toBe(null);
  });

  it('returns null for non-repeating sequence after decimal', () => {
    const frac: SimpleFraction | null = repeatToFraction("1.4");

    expect(frac).toBe(null);
  });

  it('returns correct result for 0.55555', () => {
    const frac: SimpleFraction | null = repeatToFraction("0.55555");

    expect(frac?.num).toBe(5);
    expect(frac?.den).toBe(9);
  });

  it('returns correct result for 1.333333 unreduced', () => {
    const frac: SimpleFraction | null = repeatToFraction("1.333333");

    expect(frac?.num).toBe(12);
    expect(frac?.den).toBe(9);
  });

  it('returns correct result for 1.66666 unreduced', () => {
    const frac: SimpleFraction | null = repeatToFraction("1.66666");

    expect(frac?.num).toBe(15);
    expect(frac?.den).toBe(9);
  });

  it('returns correct result for 1.0424242 unreduced', () => {
    const frac: SimpleFraction | null = repeatToFraction("1.0424242");

    expect(frac?.num).toBe(1032);
    expect(frac?.den).toBe(990);
  });

  it('returns correct result for 2.13234234 unreduced', () => {
    const frac: SimpleFraction | null = repeatToFraction("2.13234234");

    expect(frac?.num).toBe(213021);
    expect(frac?.den).toBe(99900);
  });

  it('returns correct result for 1.333333 in reduced form', () => {
    const frac: SimpleFraction | null = repeatToFraction("1.333333", true);

    expect(frac?.num).toBe(4);
    expect(frac?.den).toBe(3);
  });

  it('returns correct result for 1.0424242 in reduced form', () => {
    const frac: SimpleFraction | null = repeatToFraction("1.0424242", true);

    expect(frac?.num).toBe(172);
    expect(frac?.den).toBe(165);
  });
});

describe('Prime Factorization', () => {

  const prime: TSMT$PrimeFactorization = new TSMT$PrimeFactorization();

  it('prime factors of 12', () => {
    const result: Array<number> = prime.factorize(12);

    expect(result.length).toBe(3);
    expect(result[0]).toBe(2);
    expect(result[1]).toBe(2);
    expect(result[2]).toBe(3);
  });

  it('prime factors of 120', () => {
    const result: Array<number> = prime.factorize(120);

    expect(result.length).toBe(5);
    expect(result[0]).toBe(2);
    expect(result[1]).toBe(2);
    expect(result[2]).toBe(2);
    expect(result[3]).toBe(3);
    expect(result[4]).toBe(5);
  });

  it('prime factors of 120', () => {
    const result: Array<number> = prime.factorize(120);

    expect(result.length).toBe(5);
    expect(result[0]).toBe(2);
    expect(result[1]).toBe(2);
    expect(result[2]).toBe(2);
    expect(result[3]).toBe(3);
    expect(result[4]).toBe(5);
  });

  it('prime factors of 330', () => {
    const result: Array<number> = prime.factorize(330);

    expect(result.length).toBe(4);
    expect(result[0]).toBe(2);
    expect(result[1]).toBe(3);
    expect(result[2]).toBe(5);
    expect(result[3]).toBe(11);
  });

  it('prime factors of 1017', () => {
    const result: Array<number> = prime.factorize(1017);

    expect(result.length).toBe(3);
    expect(result[0]).toBe(3);
    expect(result[1]).toBe(3);
    expect(result[2]).toBe(113);
  });

  it('prime factors of 4000', () => {
    const result: Array<number> = prime.factorize(4000);

    expect(result.length).toBe(8);
    expect(result[0]).toBe(2);
    expect(result[1]).toBe(2);
    expect(result[2]).toBe(2);
    expect(result[3]).toBe(2);
    expect(result[4]).toBe(2);
    expect(result[5]).toBe(5);
    expect(result[6]).toBe(5);
    expect(result[7]).toBe(5);
  });

  it('edge case of -1 (should convert to 1)', () => {
    const result: Array<number> = prime.factorize(-1);

    expect(result.length).toBe(1);
    expect(result[0]).toBe(1);
  });

  it('edge case of 0 (should return 0)', () => {
    const result: Array<number> = prime.factorize(0);

    expect(result.length).toBe(1);
    expect(result[0]).toBe(0);
  });
});

describe('Quaternion Tests', () => {

  it('creates a Quaternion', () => {
    const q: TSMT$Quaternion = new TSMT$Quaternion();
    const quat: Quaterion    = q.toObject();

    expect(quat.w).toBe(1);
    expect(quat.i).toBe(0);
    expect(quat.j).toBe(0);
    expect(quat.k).toBe(0);
  });

  it('properly clones a Quaternion', () => {
    const q: TSMT$Quaternion = new TSMT$Quaternion();
    q.fromArray( 1, 2, -1, 0.5 );

    const quat: TSMT$Quaternion = q.clone();
    const v: Array<number>      = quat.values;

    expect(v[0]).toBe(1);
    expect(v[1]).toBe(2);
    expect(v[2]).toBe(-1);
    expect(v[3]).toBe(0.5);
  });

  it('properly adds two Quaternions', () => {
    const q: TSMT$Quaternion  = new TSMT$Quaternion();
    const q1: TSMT$Quaternion = new TSMT$Quaternion();

    q.fromArray(1, 1, 0, 0);
    q1.fromArray(1, 0, 1, 1);

    q.add(q1);

    expect(q.w).toBe(2);
    expect(q.i).toBe(1);
    expect(q.j).toBe(1);
    expect(q.k).toBe(1);
  });

  it('properly subtracts two Quaternions', () => {
    const q: TSMT$Quaternion  = new TSMT$Quaternion();
    const q1: TSMT$Quaternion = new TSMT$Quaternion();

    q.fromArray(1, 1, 0, 0);
    q1.fromArray(1, 0, 1, 1);

    q.subtract(q1);

    expect(q.w).toBe(0);
    expect(q.i).toBe(1);
    expect(q.j).toBe(-1);
    expect(q.k).toBe(-1);
  });

  it('properly multiplies two Quaternions', () => {
    const q: TSMT$Quaternion  = new TSMT$Quaternion();
    const q1: TSMT$Quaternion = new TSMT$Quaternion();

    q.fromArray( 0.5, 2, 3.5, -1.25 );
    q1.fromArray( 1.25, 1.0, 1.5, 1.75 );

    q.multiply(q1);

    expect(q.w).toBe(-4.4375);
    expect(q.i).toBe(11);
    expect(q.j).toBe(0.375);
    expect(q.k).toBe(-1.1875);
  });

  it('properly inverts a Quaternion', () => {
    const q: TSMT$Quaternion = new TSMT$Quaternion();

    q.fromArray(0, 2, -1, -3 );
    q.invert();

    expect(Math.abs(q.w)).toBe(0);
    expect(Math.abs(q.i + 0.14285714285714285)).toBeLessThan(0.0000001);
    expect(Math.abs(q.j - 0.07142857142857142)).toBeLessThan(0.0000001);
    expect(Math.abs(q.k + 0.21428571428571427)).toBeLessThan(0.0000001);
  });

  it('Quaternion Rotation Matrix Test', () => {
    const q: TSMT$Quaternion = new TSMT$Quaternion();

    q.fromArray( 0, 2, -1, -3 );
    const m: Array<Array<number>> = q.toRotationMatrix();

    let result: boolean = __vectorCompare(m[0], [ -0.4285714, -0.2857143, -0.857143 ], 0.00001);
    expect(result).toBe(true);

    result = __vectorCompare(m[1], [ -0.2857143, -0.857143, 0.4285714  ], 0.00001);
    expect(result).toBe(true);

    result = __vectorCompare(m[2], [ -0.857143, 0.42857143, 0.2857143  ], 0.00001);
    expect(result).toBe(true);
  });

  it('properly interpolates two Quaternions', () => {
    const q: TSMT$Quaternion  = new TSMT$Quaternion();
    const q1: TSMT$Quaternion = new TSMT$Quaternion();

    q.fromArray( 1.5, -1, 2, 2.5 );
    q1.fromArray( 3, 2, 5, -2 );

    q.slerp( q1, 0.1 );

    const result: boolean = __vectorCompare([q.w, q.i, q.j, q.k], [ 1.5, -1, 2, 2.5 ], 0.001);
    expect(result).toBe(true);
  });
});
