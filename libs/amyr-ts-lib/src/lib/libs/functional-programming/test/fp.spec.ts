/** Copyright 2020 Jim Armstrong (www.algorithmist.net)
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

// FP library specs
import {
  dynamicFilter,
  reverseFilter,
  dynamicXform,
  extendedReducer,
  hasAny,
  hasNone,
  partition,
  cache
} from '../higher-order';

// Non-recursive Euclid's algorithm
export function GCD(args: Array<number>): number
{
  if (!args || args.length != 2) return 0;

  const x1: number = args[0];
  const x2: number = args[1];

  if (isNaN(x1) || !isFinite(x1)) return 0;
  if (isNaN(x2) || !isFinite(x2)) return 0;

  const n1: number = Math.floor(Math.abs(x1));
  const n2: number = Math.floor(Math.abs(x2));

  let a = Math.max(n1, n2);
  let b = Math.min(n1, n2);
  let r = 0;

  while (b > 0)
  {
    r = a % b;
    a = b;
    b = r;
  }

  return Math.floor(a);
};

// Test Suites
describe('Higher-Order Function Tests', () => {

  const tmp: any = null;
  it('dynamicFilter returns empty array for incorrect and empty inputs', function() {
    expect(dynamicFilter<number>(tmp, []).length).toBe(0);
    expect(dynamicFilter<number>('return x > 0', tmp).length).toBe(0);
    expect(dynamicFilter<number>('return x > 0', []).length).toBe(0);
  });

  it('dynamicFilter tests', function() {
    let result: Array<number> = dynamicFilter<number>('return x > 0', [1, 0, -1, 2, -2, 4]);
    expect(result.length).toBe(3);
    expect(result[0]).toEqual(1);
    expect(result[1]).toEqual(2);
    expect(result[2]).toEqual(4);

    result = dynamicFilter<number>('return x <= 0', [1, 0, -1, 2, -2, 4]);
    expect(result.length).toBe(3);
    expect(result[0]).toEqual(0);
    expect(result[1]).toEqual(-1);
    expect(result[2]).toEqual(-2);
  });

  it('reverseFilter returns empty array for incorrect and empty inputs', function() {
    expect(reverseFilter<string>(tmp, []).length).toBe(0);

    const f: (x: string) => boolean = (x: string): boolean => {return x.length > 0};
    expect(reverseFilter<string>(f, tmp).length).toBe(0);
    expect(reverseFilter<string>(f, []).length).toBe(0);
  });

  it('reverseFilter tests', function() {
    const f: (x: string) => boolean = (x: string) => x.length > 1;
    const g: (x: string) => boolean = (x: string) => x.length > 0 ? x.charAt(0) === 'a' : false;

    let result: Array<string> = reverseFilter<string>(f, ['1', 'abc', 'd', 'x', '-2', 'x-link', 'y-link']);

    expect(result.length).toBe(3);
    expect(result[0]).toEqual('1');
    expect(result[1]).toEqual('d');
    expect(result[2]).toEqual('x');

    result = reverseFilter<string>(g, ['abc', 'def', '123', 'a1234', 'ax', 'by', 'xyz']);
    expect(result.length).toBe(4);
    expect(result[0]).toEqual('def');
    expect(result[1]).toEqual('123');
    expect(result[2]).toEqual('by');
    expect(result[3]).toEqual('xyz');
  });

  it('dynamicXform returns empty array for incorrect and empty inputs', function() {
    expect(dynamicXform<number>(tmp, []).length).toBe(0);
    expect(dynamicXform<number>('return x + 1', tmp).length).toBe(0);
    expect(dynamicXform<number>('return x - 1', []).length).toBe(0);
  });

  it('dynamicXForm tests', function() {

    // increment  by 1
    let result: Array<number> = dynamicXform<number>('return x + 1', [1, 0, -1, 2, -2, 4]);
    expect(result.length).toBe(6);
    expect(result[0]).toEqual(2);
    expect(result[1]).toEqual(1);
    expect(result[2]).toEqual(0);
    expect(result[3]).toEqual(3);
    expect(result[4]).toEqual(-1);
    expect(result[5]).toEqual(5);

    // clear - reset to zero
    result = dynamicXform<number>('return 0', [1, 0, -1, 2, -2, 4]);
    expect(result.length).toBe(6);
    expect(result[0]).toEqual(0);
    expect(result[1]).toEqual(0);
    expect(result[2]).toEqual(0);
    expect(result[3]).toEqual(0);
    expect(result[4]).toEqual(0);
    expect(result[5]).toEqual(0);
  });

  it('extendedReducer returns empty array for incorrect and empty inputs', function() {
    expect(extendedReducer<number>(tmp, 0, [])).toBeNull();
    expect(extendedReducer<number>((x: number) => x+1, 0, tmp)).toBeNull();
    expect(extendedReducer<number>((x: number) => x-1, 100, [])).toBeNull();
  });

  it('extendedReducer tests', function() {
    const findMin: (min: number, x: number) => number = (min: number, x: number) => x < min ? x : min;
    const findMax: (max: number, x: number) => number = (max: number, x: number) => x > max ? x : max;

    const minValue = extendedReducer<number>(findMin, Number.MAX_VALUE, [4, 8, 15, 26, 23, 42]);
    const maxValue = extendedReducer<number>(findMax, Number.MIN_VALUE, [4, 8, 15, 26, 23, 42]);

    expect(minValue).toEqual(4);
    expect(maxValue).toEqual(42);
  });

  it('hasAny returns empty array for incorrect and empty inputs', function() {
    expect(hasAny<number>(tmp, [])).toBe(false);
    expect(hasAny<number>('x === 0', tmp)).toBe(false);
    expect(hasAny<number>('x > 1', [])).toBe(false);
  });

  it('hasAny tests', function() {
    let result: boolean = hasAny<number>('return x === 0', [1, 0, -1, 2, -2, 4]);
    expect(result).toBe(true);

    result = hasAny<number>('return x > 10', [1, 0, -1, 2, -2, 4]);
    expect(result).toBe(false);
  });

  it('hasNone returns empty array for incorrect and empty inputs', function() {
    expect(hasNone<number>(tmp, [])).toBe(false);
    expect(hasNone<number>('x === 0', tmp)).toBe(false);
    expect(hasNone<number>('x > 1', [])).toBe(false);
  });

  it('hasNone tests', function() {
    let result: boolean = hasNone<number>('return x === 0', [1, 5, -1, 2, -2, 4]);
    expect(result).toBe(true);

    result = hasNone<number>('return x === 0', [1, 0, -1, 2, -2, 4]);
    expect(result).toBe(false);
  });

  it('partition returns null for incorrect and empty inputs', function() {
    expect(partition<object>(tmp, [])).toBeNull();
    expect(partition<object>((x: object): boolean => x !== undefined, tmp)).toBeNull();
    expect(partition<object>((x: object): boolean => !x, [])).toBeNull();
  });

  it('partition tests', function() {
    const result: {left: Array<number>, right: Array<number>} | null = partition<number>((x: number) => x % 2 === 0, [1, 5, 0, 2, -2, 4, 7, 9]);

    const left: Array<number>  = result?.left as number[];
    const right: Array<number> = result?.right as number[];

    expect(left.length).toBe(4);
    expect(right.length).toBe(4);

    expect(left[0]).toEqual(0);
    expect(left[1]).toEqual(2);
    expect(left[2]).toEqual(-2);
    expect(left[3]).toEqual(4);

    expect(right[0]).toEqual(1);
    expect(right[1]).toEqual(5);
    expect(right[2]).toEqual(7);
    expect(right[3]).toEqual(9);
  });

  it('cache tests', function() {
    const cachedGCD: (a: number, b: number) => number = cache(GCD);

    let result: number = cachedGCD(3, 7);
    expect(result).toEqual(1);

    result = cachedGCD(2, 4);
    expect(result).toEqual(2);

    result = cachedGCD(3, 7);
    expect(result).toEqual(1);

    result = cachedGCD(3, 9);
    expect(result).toEqual(3);

    result = cachedGCD(3, 9);
    expect(result).toEqual(3);
  });
});
