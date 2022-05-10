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
 * AMYR Library: A small set of functions for operations on strings and arrays where a functional approach is desired
 * and performance is secondary.  There is no error-checking on inputs.
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */

 // pad an input string with the requested number of spaces on the left
 export function padLeft(inputStr: string, pad: number): string
 {
   return Array(Math.abs(pad)+1).join(' ') + inputStr;
 }

 // return the minimum element in an array of numbers
 export function minValue(values: Array<number>): number
 {
   return values.length == 0 ? NaN : values.reduce( (min: number, x: number): number => {return x < min ? x : min});
 }

 // return the maximum element in an array of numbers
 export function maxValue(values: Array<number>): number
 {
   return values.length == 0 ? NaN : values.reduce( (max: number, x: number): number => {return x > max ? x : max});
 }

 // are all values in an array greater than the supplied input value?
 export function allGreaterThan(values: Array<number>, compare: number): boolean
 {
   return values.length == 0 ? false : values.every( (x: number): boolean => {return x > compare} );
 }

 // return all the elements in an array that are greater than the supplied value
 export function getAllGreaterThan(values: Array<number>, compare: number): Array<number>
 {
   return values.filter( (x: number): boolean => { return x > compare } );
 }

 // return first index of array element greater than supplied value or -1 if no such array value exsits
 export function indexFirstGreaterThan(values: Array<number>, compare: number): number
 {
   return values.length == 0 ? -1 : values.map( (x: number): number => { return x > compare ? 1 : 0 } ).indexOf(1);
 }
