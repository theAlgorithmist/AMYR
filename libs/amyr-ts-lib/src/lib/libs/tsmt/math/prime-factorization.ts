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
 * AMYR Library: A simple, prime factorization, suitable for modest-size, positive integers.
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */
export class TSMT$PrimeFactorization
{
  protected _isFinished: boolean;      // true if procedure finished

  constructor()
  {
    this._isFinished = false;
  }

  /**
   * Return an array of prime factors of a positive integer or empty array for invalid input; {n} is rounded and the
   * abs. value is used as the number to factorize
   *
   * @param {number} n Integer whose prime factorization is desired (this method is not recommended for very large integers)
   */
  public factorize(n: number): Array<number>
  {
    if (isNaN(n) && !isFinite(n)) return [];

    n = Math.abs(Math.round(n));

    // some simple cases ... always make your life easy :)
    const arg: number = Math.floor(n);
    if (arg === 0) return [0];

    if (arg === 1) return [1];

    if (arg === 2) return [2];

    const primes: Array<number> = new Array<number>();
    this._isFinished            = false;

    this.__factors(arg, 2, primes);

    return primes.length == 0 ? [arg] : primes;
  }

  protected __factors(n: number, start: number, primes: Array<number>): void
  {
    let c: number;
    for (c=start; c <=n+1; ++c)
    {
      if (this._isFinished) return;

      if (n%c == 0 && this.__isPrime(c))
      {
        primes.push(c);

        const next: number = n/c;
        if (next > 1)
        {
          this.__factors(next, c, primes);
        }
        else
        {
          this._isFinished = true;
          return;
        }
      }
    }
  }

  protected __isPrime(n: number): boolean
  {
    if (n === 2) return true;

    const upper: number = Math.floor( Math.sqrt(n)+1 );
    let i: number;

    for (i = 2; i <= upper; ++i) {
      if (n%i == 0) return false;
    }

    return true;
  }
}
