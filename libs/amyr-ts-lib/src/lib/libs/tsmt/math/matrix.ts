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
 * AMYR Library - Typescript Math Toolkit: A simple matrix class for dealing with dense matrices containing numerical data and of modest
 * size (for typical online and device-based applications).  Note that on construction, the matrix is 0 x 0 and data is
 * undefined.  Add or delete rows to fill the matrix, in which case the column count is determined by the maximum row
 * array length.  If any operation attempts to access row data beyond bounds, that data will be undefined.  The caller
 * is responsible for maintaining proper length in each input row array.
 *
 * LU Factorization is lazy; the factorization will only be recomputed if matrix data changes.
 *
 * Note: Internal matrix storage is row-major
 *
 * @author Jim Armstrong ()
 *
 * @version 1.0
 */

export class TSMT$Matrix
{
  protected _n = 0;                           // column count
  protected _matrix: Array< Array<number> >;  // internal reference to array of row arrays
  protected _indx:Array<number>;              // pivot indices
  protected _factorized: boolean;             // true if current matrix has been (LU) factorized, false if a data
                                              // setting or operation invalidates a prior factorization

  /**
   * Construct a new Matrix class
   */
  constructor()
  {
    this._n          = 0;
    this._matrix     = new Array< Array<number> >();
    this._indx       = new Array<number>();
    this._factorized = false;
  }

  /**
   * Overwrite the current matrix with an array of (row) arrays.
   *
   * @param {Array<Array<number>>} matrix New matrix that will overwrite the current matrix, row by row
   */
  public fromArray( matrix: Array<Array<number>> ): void
  {
    this.clear();
    const n: number = matrix.length;
    let i: number;

    for (i = 0; i < n; ++i) {
      this.appendRow(matrix[i]);
    }
  }

  /**
   * Convenience accessor to determine if the current matrix has been factorized
   *
   * returns {boolean} True if the matrix has been LU factorized, false otherwise.
   */
  public get factorized(): boolean
  {
    return this._factorized;
  }

  /**
   * Access the current row count
   *
   * @returns {number}
   */
  public get m(): number
  {
    return this._matrix.length;
  }

  /**
   * Access the current column count
   *
   * @returns {number}
   */
  public get n(): number
  {
    return this._n;
  }

  /**
   * Access a row of the matrix; returns an empty array if index out of range
   *
   * @param {number} index Row index of the matrix
   */
  public getRow(index: number): Array<number>
  {
    if (index >= 0 && index < this._matrix.length)
      return this._matrix[index].slice();
    else
      return new Array<number>();
  }

  /**
   * Access a column of the matrix; returns an empty array if the index is out of range
   *
   * @param {number} index Column index of the matrix
   */
  public getColumn(index: number): Array<number>
  {
    const arr: Array<number> = new Array<number>();
    const m: number          = this._matrix.length;

    let i: number;
    let row: Array<number>;

    if (index >= 0 && index < this._n)
    {
      for (i = 0; i < m; ++i)
      {
        row = this._matrix[i];
        arr.push(row[index]);
      }
    }

    return arr;
  }

  /**
   * Clear the current matrix and prepare it to accept new data
   */
  public clear(): void
  {
    this._matrix.length = 0;
    this._n             = 0;
    this._factorized    = false;
  }

  /**
   * Add a row to the top of the matrix.  It is the caller's responsibility for data integrity, including
   * consistent column count for each row added to the matrix; the row will not be auto-filled, for example.
   *
   * @param {Array<number>} row Row array
   */
  public addRow(row: Array<number>): void
  {
    if (row !== undefined && row instanceof Array)
    {
      this._matrix.unshift(row.slice());

      this._n          = Math.max(this._n, row.length);
      this._factorized = false;
    }
  }

  /**
   * Append a row to the matrix.  It is the caller's responsibility for data integrity, including consistent
   * column count for each row added to the matrix
   *
   * @param {Array<number>} row Row array
   */
  public appendRow(row: Array<number>): void
  {
    if (row !== undefined && row instanceof Array)
    {
      this._matrix.push( row.slice() );

      this._n          = Math.max( this._n, row.length );
      this._factorized = false;
    }
  }

  /**
   * Insert a row into the matrix
   *
   * @param {number} index Row index (zero-based), which must be between zero and the current row count minus one.
   *
   * @param {Array<number>} row Row Array
   */
  public insertRow(index: number, row: Array<number>): void
  {
    if (index >= 0 && index < this._matrix.length)
    {
      if (row)
      {
        this._matrix.splice(index, 0, row.slice());

        this._n          = Math.max( this.n, row.length );
        this._factorized = false;
      }
    }
  }

  /**
   * Remove the first row of the matrix
   */
  public removeFirst(): void
  {
    if (this._matrix.length > 0)
    {
      this._matrix.shift();
      this._factorized = true;
    }
  }

  /**
   * Remove the last row of the matrix
   */
  public removeLast(): void
  {
    if (this._matrix.length > 0) {
      this._matrix.pop();
    }
  }

  /**
   * Delete a row from an arbitrary index in the matrix
   *
   * @param {number} index  Row index (zero-based), which must be between zero and the current row count minus one.
   */
  public deleteRow(index: number): void
  {
    if (index >= 0 && index < this._matrix.length)
    {
      this._matrix.splice(index, 1);
      this._factorized = false;
    }
  }

  /**
   * Clone the current {Matrix}
   */
  public clone(): TSMT$Matrix
  {
    const t: TSMT$Matrix = new TSMT$Matrix();
    const m: number      = this.m;
    let i: number;

    for (i = 0; i < m; ++i) {
      t.appendRow(this._matrix[i]);
    }

    return t;
  }

  /**
   * Sum the columns of the current matrix
   */
  public sumColumns(): Array<number>
  {
    const m: number = this.m;
    if (m === 0) return new Array<number>();

    const n: number = this._matrix[0].length;
    if (n === 0) return new Array<number>();

    let i: number;
    let j: number;
    let row: Array<number>;

    const sum: Array<number> = this._matrix[0].slice();

    for (i = 1; i < m; ++i)
    {
      row = this._matrix[i];
      for (j = 0; j < n; ++j) {
        sum[j] += row[j]
      }
    }

    return sum;
  }

  /**
   * Sum the rows of the current matrix
   */
  public sumRows(): Array<number>
  {
    const m: number = this.m;
    if (m === 0) return new Array<number>();

    const n: number = this._matrix[0].length;
    if (n === 0) return new Array<number>();

    let i: number;
    let row: Array<number>;

    const sum: Array<number> = new Array<number>();

    for (i = 1; i < m; ++i)
    {
      row = this._matrix[i];

      // this is not as efficient as a straight loop, so it could be optimized if performance becomes an issue
      sum[i] = row.reduce( (sum: number, current: number): number => {return sum + current}, 0 );
    }

    return sum;
  }

  /**
   * Add a matrix to the current matrix and overwrite the current elements
   *
   * @param {TSMT$Matrix} m Matrix to be added to the current Matrix
   */
  public add(matrix: TSMT$Matrix): void
  {
    if ( !matrix || matrix.m != this._matrix.length || matrix.n != this._n ) return;

    const m: number = this._matrix.length;
    let i: number;
    let j: number;
    let row: Array<number>;
    let inputRow: Array<number>;

    for (i = 0; i < m; ++i)
    {
      row      = this._matrix[i];
      inputRow = matrix.getRow(i);

      for (j = 0; j < this._n; ++j) {
        row[j] += inputRow[j];
      }
    }

    this._factorized = false;
  }

  /**
   * Add a matrix to the current matrix and return the result in a new Matrix
   *
   * @param {TSMT$Matrix} m Matrix to be added to the current Matrix
   */
  public addTo(matrix: TSMT$Matrix): TSMT$Matrix | null
  {
    if (!matrix || matrix.m != this._matrix.length || matrix.n != this._n) return null;

    const theMatrix: TSMT$Matrix = this.clone();
    theMatrix.add(matrix);

    return theMatrix;  // yes, it has you ...
  }

  /**
   * Subtract a matrix from the current matrix and overwrite the current elements
   *
   * @param {TSMT$Matrox} m Matrix to be subtracted from the current Matrix
   */
  public subtract(matrix: TSMT$Matrix): void
  {
    if (!matrix || matrix.m != this._matrix.length || matrix.n != this._n ) {
      return;
    }

    const m: number = this._matrix.length;
    let i: number;
    let j: number;
    let row: Array<number>;
    let inputRow: Array<number>;

    for (i = 0; i < m; ++i)
    {
      row      = this._matrix[i];
      inputRow = matrix.getRow(i);

      for (j = 0; j < this._n; ++j) {
        row[j] = row[j] - inputRow[j];
      }
    }

    this._factorized = false;
  }

  /**
   * Subtract a matrix from the current matrix and return the result in a new Matrix
   *
   * @param {TSMT$Matrix} m Matrix to be subtracted from the current Matrix
   */
  public subtractFrom(matrix: TSMT$Matrix): TSMT$Matrix | null
  {
    if (matrix.m != this._matrix.length || matrix.n != this._n) return null;

    const theMatrix:TSMT$Matrix = this.clone();
    theMatrix.subtract(matrix);

    return theMatrix;  // yes, it has you
  }

  /**
   * Multiply the current matrix by a scalar and overwrite the elements.  The current matrix is unchanged if the
   * scalar is invalid.  Note that overflow is still possible for a sufficiently large scalar value and matrix elements.
   *
   * @param {number} s Scalar for element-wise multiplication
   */
  public timesScalar(s: number): void
  {
    if (isNaN(s) || !isFinite(s)) return;

    const m: number = this._matrix.length;
    let i: number;
    let j: number;
    let row: Array<number>;

    for (i = 0; i < m; ++i)
    {
      row = this._matrix[i];

      for (j = 0; j < this._n; ++j) {
        row[j] = s * row[j];
      }
    }

    this._factorized = false;
  }

  /**
   * Transpose the current matrix (in-place), which transforms an m x n matrix into an n x m matrix.
   */
  public transpose(): void
  {
    const temp:TSMT$Matrix = this.clone();

    const m: number = this._n;      // new number of rows
    const n: number = this.m;       // new number of columns
    let i: number;
    let col: Array<number>;

    this.clear();

    for (i = 0; i < m; ++i)
    {
      col = temp.getColumn(i);
      this.appendRow( col );
    }

    this._n          = n;
    this._factorized = false;
  }

  /**
   * Return the transpose of the current matrix
   */
  public transposeInto(): TSMT$Matrix
  {
    const t: TSMT$Matrix = this.clone();
    t.transpose();

    return t;
  }

  /**
   * Multiply the current matrix by a vector and return the result in an Array.  If the current matrix is A and the
   * input vector is v (A is m x n and v is n x 1) then the return is the matrix-vector product, Av.  If v contains
   * less than n items, the return array is empty. If it contains more than n items, the excess number is ignored.
   *
   * @param {Array<number>} v Input vector whose length matches the number of columns in the current array
   */
  public timesVector(v: Array<number>): Array<number>
  {
    if (v === undefined || v == null || Object.prototype.toString.call(v) != '[object Array]') return new Array<number>();

    if (v.length < this._n) return new Array<number>();

    const m: number = this._matrix.length;
    let i: number;
    let j: number;
    let row: Array<number>;
    let s: number;

    const r = new Array<number>();

    for (i = 0; i < m; ++i)
    {
      row = this._matrix[i];
      s   = 0;

      for (j = 0; j < this._n; ++j) {
        s += row[j] * v[j];
      }

      r[i] = s;
    }

    return r;
  }

  /**
   * Multiply the current matrix by another matrix and store the result in the current matrix.  The matrices must be
   * of appropriate dimensions for the multiplication.  If the current matrix is m x n, the input matrix must be n x p
   * and the result will be a new, m x p matrix.  There is little error-checking for performance reasons - the current
   * matrix is unchanged if the operation is not defined.
   *
   * @param {TSMT$Matrix} m Input Matrix to be multiplied by the current matrix
   */
  public multiply(matrix: TSMT$Matrix): void
  {
    if (!matrix || this._n != matrix.m) return;

    const t:TSMT$Matrix = this.clone();
    const m: number     = this._matrix.length;
    const p: number     = matrix.n;

    let i: number;
    let j: number;
    let k: number;
    let row: Array<number>;
    let column: Array<number>;
    let s: number;

    this._matrix.length = 0;

    for (i = 0; i < m; ++i) {
      this._matrix.push(new Array<number>());
    }

    for (i = 0; i < m; ++i)
    {
      row = t.getRow(i);
      for (j = 0; j < p; ++j)
      {
        s      = 0.0;
        column = matrix.getColumn(j);

        for (k = 0; k < this._n; ++k) {
          s += row[k] * column[k];
        }

        this._matrix[i][j] = s;
      }
    }

    this._n          = p;
    this._factorized = false;
  }

  /**
   * Multiply the current {Matrix} by another matrix and store the result in a new {Matrix}. The matrices must be of
   * appropriate dimensions for the multiplication.  If the current matrix is m x n, the input matrix must be n x p
   * and the result will be a new, m x p matrix.  A new 0x0 {Matrix} is returned if the operationis not defined.
   *
   * @param {TSMT$Matrix} m Input Matrix to be multiplied by the current Matrix
   */
  public multiplyInto(matrix: TSMT$Matrix): TSMT$Matrix
  {
    if (!matrix || this._n != matrix.m) return new TSMT$Matrix();

    const t: TSMT$Matrix = this.clone();
    t.multiply(matrix);

    return t;
  }

  /**
   * Solve a linear system of equations, Ax = b with the current matrix being a n x n coefficient matrix.  Note that
   * the current matrix will be overwritten by its LU factorization.  There is no error-checking on inputs for
   * performance reasons.
   *
   * This method may be called multiple times with different right-hand sides and the matrix will be factorized only
   * once. Clone the current matrix if you wish to use the original matrix again after solution.
   *
   * @param {Array<number>} b Right-hand side vector
   */
  public solve(b: Array<number>): Array<number>
  {
    const status: number = !this._factorized ? this.__LU() : 0;

    if (status == 0)
    {
      const x: Array<number> = b.slice();
      return this.__solve(x);
    }
    else
    {
      return new Array<number>();
    }
  }

  // internal method - compute LU factorization (overwrites current matrix)
  protected __LU(): number
  {
    if (this._matrix.length != this._n) return -1;

    const n: number = this._n;
    if (n === 0) return -1;

    const small = 0.0000001;

    let i: number;
    let j: number;
    let k: number;
    let imax: number;  // think result from Linpack IDAMAX

    let b: number;
    let temp: number;
    let z: number;

    // reset pivots
    this._indx.length = 0;

    // factor w/partial pivoting
    for (k = 0; k < n; ++k)
    {
      // get pivot row
      b    = 0.0;
      imax = k;

      for (i = k; i < n; ++i)
      {
        temp = Math.abs(this._matrix[i][k]);

        if(temp > b)
        {
          b    = temp;
          imax = i;
        }
      }

      // interchange rows
      if (k != imax)
      {
        for (j = 0; j < n; ++j)
        {
          temp = this._matrix[imax][j];

          this._matrix[imax][j] = this._matrix[k][j];
          this._matrix[k][j]    = temp;
        }
      }

      this._indx[k] = imax;

      if (Math.abs(this._matrix[k][k]) < 0.000000001) {
        this._matrix[k][k] = small;
      }

      z = 1.0/this._matrix[k][k];

      // rank-1 update of sub-matrix
      if (k+1 < n)
      {
        for (i = k+1; i<n; ++i)
        {
          this._matrix[i][k] *= z;
          temp = this._matrix[i][k];

          for (j = k+1; j < n; ++j)
            this._matrix[i][j] -= temp*this._matrix[k][j];
        }
      }
    }

    this._factorized = true;
    return 0;
  }

  // given A = LU, A^-1x = (LU)^-1 x or U^-1 L^-1 x - solve Ly = x for y and then Ux = y for x
  protected __solve(x: Array<number>): Array<number>
  {
    const n: number = this._matrix.length;

    let i: number;
    let j: number;
    let ii: number = 0;
    let ip: number;
    let sum: number;

    for (i = 0; i < n; ++i)
    {
      ip    = this._indx[i];
      sum   = x[ip];
      x[ip] = x[i];

      if (ii != 0)
      {
        for (j = ii-1; j < i; ++j) {
          sum -= this._matrix[i][j] * x[j];
        }
      }
      else if (sum != 0.0) {
        ii = i + 1;
      }

      x[i] = sum;
    }

    for (i = n-1; i >= 0; i--)
    {
      sum = x[i];

      for (j = i+1; j < n; j++) {
        sum -= this._matrix[i][j] * x[j];
      }

      x[i] = sum / this._matrix[i][i];
    }

    return x;
  }
}
