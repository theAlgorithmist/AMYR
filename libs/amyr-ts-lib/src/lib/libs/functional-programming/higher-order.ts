/**
 * Copyright 2020 Jim Armstrong (www.algorithmist.net)
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
 * AMYR Library - A small collection of higher-order functions
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */

export type PredicateFunction<T> = (x: T) => boolean;

export type XformFunction<T> = (x: T) => T;

/**
 * Dynamically filter an array based on a function whose body is passed as an argument and return result in a new array
 *
 * @param predicateBody Body of a function that takes a single argument, 'x', and returns a boolean
 *
 * @param inputs Apply the predicate to this collection of input values
 */
export function dynamicFilter<T>(predicateBody: string, inputs: Array<T>): Array<T>
{
  if (!predicateBody || predicateBody === '' || predicateBody === ' ') return [];
  if (!inputs) return [];

  const result: Array<T>     = new Array<T>();
  const f: (x: T) => boolean = new Function('x', predicateBody) as (x: T) => boolean;

  inputs.forEach( (x: T): void => {if (f(x) === true) result.push(x)} );

  return result;
};

/**
 * Filter an array based on an inverse of a supplied predicate
 *
 * @param predicate Function that takes a single input value and returns a boolean
 *
 * @param arr Input array to be filtered; return values are inputs where the predicate returns false
 */
export function reverseFilter<T>(predicate: (value: T) => boolean, arr: Array<T> ): Array<T>
{
  if (!arr || !predicate) return [];

  const result: Array<T> = new Array<T>();

  arr.forEach( (value: T): void => {if (predicate(value) === false) result.push(value)} );

  return result;
};

/**
 * Dynamically transform an array based on a function whose body is provided as an argument and return result in a new array
 *
 * @param xformFunctionBody Body of a function that takes a single argument, 'x', and returns a boolean
 *
 * @param inputs Input array to be transformed
 */
export function dynamicXform<T>(xformFunctionBody: string, inputs: Array<T>): Array<T>
{
  if (!xformFunctionBody || xformFunctionBody === '' || xformFunctionBody === ' ') return [];
  if (!inputs) return [];

  const result: Array<T>    = new Array<T>();
  const f: XformFunction<T> = new Function('x', xformFunctionBody) as XformFunction<T>;

  inputs.forEach( (x: T): void => {result.push(f(x))} );

  return result;
}

/**
 * Reduce an array based on a helper function provided as an argument
 *
 * @param helper Reducer function
 *
 * @param initialValue Initial value for the array reduction
 *
 * @param inputs Input array to be reduced
 */
export function extendedReducer<T>(helper: (value1: T, value2: T) => T, initialValue: T, inputs: Array<T>): T | null
{
  if (!helper || !inputs) return null;

  if (inputs.length === 0) return null;

  const result: Array<T> = new Array<T>();

  return inputs.reduce( (acc: T, current: T): T => {
    const value: T = helper(acc, current);

    result.push(value);

    return value;
  }, initialValue );
};

/**
 * Does an array contain any values that satisfy a predicate whose function body is provided as an argument
 *
 * @param predicateBody Body of a function that takes a single argument, 'x', and returns a boolean
 *
 * @param inputs Input array to which the predicate is applied
 */
export function hasAny<T>(predicateBody: string, inputs: Array<T>): boolean
{
  if (!predicateBody || predicateBody === '' || predicateBody === ' ') return false;

  if (!inputs) return false;

  const f: PredicateFunction<T> = new Function('x', predicateBody) as PredicateFunction<T>;

  return inputs.reduce((acc: boolean | T, x: T): boolean | T => acc || f(x), false) as unknown as boolean;
};

/**
 * Is an array completely devoid of any values that satisfy a predicate whose function body is provided as an argument
 *
 * @param predicateBody Body of a function that takes a single argument, 'x', and returns a boolean
 *
 * @param inputs Input array to which the predicate is applied
 */
export function hasNone<T>(predicateBody: string, inputs: Array<T>): boolean
{
  if (!predicateBody || predicateBody === '' || predicateBody === ' ') return false;

  if (!inputs || inputs.length === 0) return false;

  const f: PredicateFunction<T> = new Function('x', predicateBody) as PredicateFunction<T>;

  return inputs.reduce((acc: boolean | T, x: T): boolean | T => !acc && !f(x), true) as unknown as boolean;
};

/**
 * Partition an array into 'left' and 'right' sections based on a predicate that is evaluated at each array value
 *
 * @param predicate Function taking a single argument and returning a boolean
 *
 * @param arr Input array to which the predicate is applied
 */
export function partition<T>(predicate: (value: T) => boolean, arr: Array<T> ): {left: Array<T>, right: Array<T>} | null
{
  if (!arr || !predicate || arr.length === 0) return null;

  const result: {left: Array<T>, right: Array<T>} = {left: [], right: []};

  arr.forEach( (value: T): void => {
    if (predicate(value) === true) {
      result.left.push(value);
    } else {
      result.right.push(value);
    }
  });

  return result;
};

/**
 * Cache returns from a function and return those values in the case of a repeated function call with the same arguments
 *
 * @param f Function that takes an array of values and returns an arbitrary result
 */
export function cache(f: (...args: Array<any>) => any): (...rest: Array<any>) => any
{
  const localCache: Record<string, any> = {};

  return (...rest: Array<any>): any => {
    const key: string = JSON.stringify(rest);
    let result: any   = localCache[key];

    if (result !== undefined) return result;

    result          = f(rest);
    localCache[key] = result;

    return result;
  }
};
