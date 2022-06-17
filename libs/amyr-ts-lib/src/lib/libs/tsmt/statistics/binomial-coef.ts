/**
 * Copyright 2016 Jim Armstrong
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
 * AMYR Library: Generate binomial coefficients, either individually or as a single row in Pascal's triangle.
 * Methods in this class were designed to work best in applications where successive coefficients are generated either
 * in the same row or moving row to row (forward or backward).
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */

export class BinomialCoef
{
  protected _row:Array<number>;          // currently generated row (nonsymmetric portion)
  protected _n:number;                   // row number or 'n' in binomial coefficient (n k)

  constructor()
  {
    // row 1 = [1]
    this._row = [1, 2];
    this._n   = 2;
  }

  /**
   * Generate the binomial coefficient (n k)
   *
   * @param {number} n n items
   *
   * @param {number} k taken k at a time
   */
  public coef(n: number, k: number): number
  {
    if (isNaN(n) || !isFinite(n)) return 0;

    if (isNaN(n) || !isFinite(n)) return 0;

    if (n < 0 || k < 0) return 0;

    if( k > n )
    {
      // beyond bounds
      return 0;
    }
    else if (k == n)
    {
      // edge
      return 1;
    }

    if (this._n != n) this.__recurse(n);

    const j: number = this._n % 2;
    const e: number = (this._n+2-j)/2;

    return (k >= e) ? this._row[n-k] : this._row[k];
  }

  /**
   * Access the most recently generated row index
   */
  public get rowNumber(): number
  {
    return this._n;
  }

  /**
   * Return the n-th full row of Pascal's triangle
   *
   * @param n: number - Index of desired row (beginning at zero)
   */
  public getRow(n: number): Array<number>
  {
    if (isNaN(n) || !isFinite(n)) return [];

    if (n < 0 ) return [];

    switch(n)
    {
      case 0:
        return [1];

      case 1:
        return [1,1];

      case 2:
        return [1,2,1];

      default:
        return (n == this._n) ? this.__fillOut() : this.__recurse(n);
    }
  }

  // internal method - fill out non-symmetric portion of current row & return reference to full array
  protected __fillOut(): Array<number>
  {
    let i: number;
    const j: number          = this._n % 2;
    const e: number          = (this._n+2-j)/2;
    const arr: Array<number> = this._row.slice(0,e+1);

    if (j === 0)
    {
      for (i=0; i<e-1; ++i)
        arr[e+i] = arr[e-i-2];
    }
    else
    {
      for (i=0; i<e; ++i)
        arr[e+i] = arr[e-i-1];
    }

    return arr;
  }

  // internal method - recursively generate desired row from the current row
  private __recurse(r: number): Array<number>
  {
    // forward or reverse?
    if (r > this._n)
    {
      // recurse forward
      this.__forward(r);
    }
    else
    {
      if ( (r-2) <= (this._n-r) )
      {
        // reset and move forward
        this._row[1] = 2;
        this._n      = 2;
        this.__forward(r);
      }
      else
      {
        // recurse backward
        this.__reverse(r);
      }
    }

    this._n = r;

    return this.__fillOut();
  }

  // recurse forward
  protected __forward(r: number): void
  {
    let i: number;
    let j: number;
    let k: number;
    let e: number;
    let h: number;
    let val:number;

    for (i = this._n+1; i <= r; ++i)
    {
      // how many elements in the nonsymmetric portion of the current row?
      j = i % 2;
      e = (i+2-j)/2;
      h = this._row[0];

      if (j == 1)
      {
        for (k = 1; k < e; ++k)
        {
          val           = this._row[k] + h;
          h             = this._row[k];
          this._row[k] = val;
        }
      }
      else
      {
        for( k = 1; k < e-1; ++k )
        {
          val           = this._row[k] + h;
          h             = this._row[k];
          this._row[k] = val;
        }

        this._row[e-1] = 2*h;
      }
    }
  }

  // recurse backwards
  protected __reverse(r: number): void
  {
    let i: number;
    let j: number;
    let k: number;
    let e: number;

    for (i = this._n-1; i >= r; i--)
    {
      // how many elements in the nonsymmetric portion of the current row?
      j = i % 2;
      e = (i+2-j)/2;

      for (k = 1; k < e; ++k) {
        this._row[k] = this._row[k] - this._row[k - 1];
      }
    }
  }
}
