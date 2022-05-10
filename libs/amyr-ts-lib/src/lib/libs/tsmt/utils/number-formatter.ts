// Modified from code bearing the following copyright

/* copyright (c) 2012, Jim Armstrong.  All Rights Reserved.
 *
 * THIS SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * This software may be modified for commercial use as long as the above copyright notice remains intact.
 */

/**
 * Copyright 2017 Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
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
 * AMYR Library: A set of utilities for formatting and displaying floating-piont values.
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */

import {
  LOG_INVERSE,
  DEFAULT_PHONE,
  INVALID_NUMBER,
  TOL // todo - make this mach. eps.
} from '../../../models/numeric';


/**
 * Return a string that represents a floating-point number with no more than the maximum number of specified
 * digits after the decimal place.  Examples: Input of 5 returns '5' regardless of {digits} value.  Input of 5.2
 * returns '5' with {digits} equal to zero and '5.2' with {digits} set to 1.  Input of 5.245 returns '5.2', '5.25',
 * and '5.245' with {digits} equal to 1, 2, and 3, respectively.  Input of 5.10 returns '5.1' with {digits} set to
 * 1 or 2, so the method returns the number formatted with the minimum number of digits required to display with no
 * trailing zeros, but with no more digits than specified with the {digits} argument.  Returns a null string for
 * invalid arguments.
 *
 * @param {number} value Input number to be formatted
 *
 * @param {number} digits Maximum number of digits that may be displayed after the decimal place
 * @default 0
 */
 export function toMininumDigits(value: number, digits: number = 0): string
 {
   if (value === undefined || value == null || isNaN(value) || !isFinite(value)) return '';

   // todo: this is to support IE without polyfill; likely no longer needed
   if (Math.round(value) === value) return value.toString();

   let temp: string = value.toFixed(digits);

   // remove all trailing zeros
   const index: number = temp.indexOf('.');
   let char: string    = temp.charAt(temp.length-1);
   if (char != '0') return temp;

   while (char == '0')
   {
     temp = temp.substring(0,temp.length-1);
     char = temp.charAt(temp.length-1);
   }

   // is there a period at the end?
   if (char == '.') temp = temp.substring(0,temp.length-1);

   return temp;
 }

/**
 * Round a floating-point number to the nearest multiple of a supplied value. If the digits value is zero, the
 * input number is returned.
 *
 * @param {number} value Number to be rounded
 *
 * @param {number} round Round to nearest multiple of this value, i.e. nearest tenth is 0.1, nearest fifth is 0.2, and
 * nearest half is 0.5.  Use 10 to round to nearest 10, for example.
 */
 export function roundTo(value: number, round: number): number
 {
   // error-checking
   if (isNaN(value) || !isFinite(value) || round < 0) return 0;

   // trivial cases
   if (round === 0) return value;

   if( round === 1.0 ) return Math.round(value);

   let r: number = Math.floor(1/round);
   r             = r == 0 ? 1.0/round : r;

   return Math.round(value*r)/r;
 }

/**
 * Return a {string} representation of an input number that is converted to fixed-point notation.  Example: 5.14162 is
 * returned as "5.14" to two decimal places or "NaN" if the input is not a number.  If the number of decimal places is
 * zero, the number is truncated, i.e. 5.14162 as an input results in the {string} output, "5".  This is functionally
 * similar to the toFixed() method in most languages and is provided to allow custom control over the formatting.
 *
 * @param {number} value Input floating-point number
 *
 * @param {number} decimal (Integer) number of decimal places
 */
 export function toFixed(value: number, decimal: number): string
 {
   // outliers
   if (isNaN(value) || !isFinite(value) || typeof value !== 'number')
   {
     // game over
     return INVALID_NUMBER;
   }
   else if (decimal < 0)
   {
     // straight return
     return value.toString();
   }
   else
   {
     if( decimal === 0 )
       return value < 0 ? Math.ceil(value).toString() : Math.floor(value).toString();
     else
     {
       decimal = Math.round(decimal);

       const isNegative: boolean = value < 0;
       value                     = Math.abs(value);


       // there's really nothing new under the sun ...
       let power:number = Math.pow(10, decimal);
       power            = 1/power;

       const temp: number = roundTo(value, power);
       let str: string    = temp.toString();
       let i: number      = str.indexOf(".");

       if (i != -1)
       {
         for (i = str.substr(i+1).length; i < decimal; ++i) {
           str += '0';
         }

       }
       else
       {
         str += ".";
         for (i = 0; i < decimal; ++i) {
           str += "0";
         }
       }

       return isNegative ? '-' + str : str;
     }
   }
 }

/**
 * Return the number of digits past the decimal point of a floating-point number, i.e. 0 if the input is actually an
 * integer, 2 in the case of 4.15, and 1 in the case of 3.5
 *
 * @param {number} value Input number, such as 3.762
 */
 export function numdigitsPastDecimal(value: number): number
 {
   if (isNaN(value) || !isFinite(value) || typeof value !== 'number') return 0;

   const val: string   = value.toString();
   const index: number = val.indexOf(".");

   if (index === -1) return 0;

   return val.length-index-1;
 }

/**
 * Return the order magnitude of a floating-point number, i.e. k such that the input number can be expressed as
 * C*10^k, where C is a constant in [0,10).
 *
 * @param {number} Input, floating-point number
 */
 export function orderOfMagnitude(value: number): number
 {
   // outliers
   if (isNaN(value) || !isFinite(value) || typeof value !== 'number') return 0;

   if (value === 0) return 0;

   // a bit silly, but should export okay to a wide variety of target environments
   let exponent: number     = Math.floor(Math.log(Math.abs(value)) * LOG_INVERSE);
   const powerOfTen: number = Math.pow(10, exponent);
   const mantissa: number   = value / powerOfTen;

   // compute exponent
   exponent = mantissa == 10 ? exponent+1 : exponent;

   return exponent;
 }

/**
 * Return a formatted {string} that contains the input floating-point number converted to scientific notation.  For
 * example, 512.127 is returned as "5.121 x 10^2" with three significant digits.  This string may be used to format
 * UI elements that accept rich-text input and properly format superscript tags.  Returns {"NaN"} if the input is not
 * a number.
 *
 * @param {number} value Input, floating-point number
 *
 * @param {number} significantDigits Number of significant digits, must be at least 1
 */
 export function toScientific(value: number, significantDigits: number=1): string
 {
   if (isNaN(value) || !isFinite(value) || typeof value !== 'number') return INVALID_NUMBER;

   if (value === 0) return '0';

   // this is clumsy but should work across all target environments
   let exponent: number = Math.floor(Math.log(Math.abs(value)) * LOG_INVERSE);
   exponent             = value == 0 ? 0 : exponent;

   const powerOfTen: number = Math.pow(10, exponent);
   let mantissa: number     = value / powerOfTen;

   if (mantissa === 10)
   {
     mantissa  = 1;
     exponent += 1;
   }

   const significand: string = toFixed(mantissa, significantDigits);

   return significand + ' x 10^' + exponent.toString();
 }

/**
 * Return the exponent of a floating-point number
 *
 * @param {number} value Input, floating-point number
 */
 export function getExponent(value: number): number
 {
   if (isNaN(value) || !isFinite(value) || typeof value !== 'number') return 0;

   if (Math.abs(value) < TOL) return 0;

   value                    = Math.abs(value);
   let exponent: number     = Math.floor(Math.log(Math.abs(value)) * LOG_INVERSE);
   const powerOfTen: number = Math.pow(10, exponent);
   const mantissa: number   = value / powerOfTen;

   // compute exponent
   exponent = mantissa == 10 ? exponent+1 : exponent;

   return value == 0 ? 0 : exponent;
 }

/**
 * Format a floating-point number into a {string} representation.  Note that {useSeparator} and {scientificNotation}
 * are mutually exclusive.  If 'useSeparator' is true, then groups of three digits are separated by commas.  If
 * {useSeparator} is {false} and {scientificNotation} is used, then the result is returned in scientific notation.
 * Returns {"NaN"} if the input is not a number.
 *
 * @param {number} value Input, floating-point number
 *
 * @param {number} significantDigits Number of significant digits after the decimal place - should be at least 1.
 * @default 1
 *
 * @param {boolean} useSeparator True if a comma is used to separate groups of three digits (defaults to false)
 *
 * @param {boolean} scientificNotation True if scientific notation is to be used (this argument is only processed if {useSeparator} is false)
 * @default false.
 */
 export function formatNumber(
   value: number,
   significantDigits: number=1,
   useSeparator: boolean=false,
   scientificNotation: boolean=false
 ): string
 {
   if (isNaN(value) || !isFinite(value) || typeof value !== 'number') return 'NaN';

   let digits: number = significantDigits < 0 ? 1 : significantDigits;
   digits             = Math.round(digits);

   // insert commas?
   if (useSeparator)
   {
     // adjust for significant digits
     const tmp: string = toFixed(value, digits);

     return insertCommas(+tmp);
   }
   else
   {
     // scientific or fixed notation
     return scientificNotation ? toScientific(value, digits) : toFixed(value, digits);
   }
 }

/**
 * Insert commas between groups of three digits before the decimal place.  Returns {'NaN'} if input
 * is invalid. For example, 1234567 is formatted as 1,234,567 and 1367.88 is formatted as 1,367.88
 *
 * @param {number} value Input number
 */
 export function insertCommas(value: number): string
 {
   if (isNaN(value) || !isFinite(value) || typeof value !== 'number') return INVALID_NUMBER;

   if( Math.abs(value) < 1000 ) return value.toString();

   const isNegative: boolean = value < 0;

   if (isNegative) value = Math.abs(value);

   let theNumber: string   = value.toString();
   let decimalPart         = '';
   const decimal: number   = theNumber.indexOf('.');

   if (decimal !== -1)
   {
     decimalPart = theNumber.substring(decimal, theNumber.length);
     theNumber   = theNumber.substring(0,decimal);
   }

   let withCommas    = '';
   const len: number = theNumber.length;
   let i             = 1;

   withCommas += theNumber.charAt(0);

   while (i < len)
   {
     if ((len-i)%3 === 0) withCommas += ",";

     withCommas += theNumber.charAt(i);
     i++;
   }

   withCommas = decimal == -1 ? withCommas : withCommas + decimalPart;
   withCommas = isNegative ? '-' + withCommas : withCommas;

   return withCommas;
 }

/**
 * Format a 7- or 10-digit string as a phone number, i.e. 'xxxyyyzzzz' is formatted as (xxx) yyy-zzzz
 *
 * @param {string} value Digit sequence, i.e. '2141234567'.  Expected to contain only digits.
 */
 export function toPhoneNumber(value: string): string
 {
   if (value === undefined || value === '') return DEFAULT_PHONE;

   // get rid of selected characters in case partial formatting was present
   value = value.replace(/-/g, '');
   value = value.replace(/\(/g, '');
   value = value.replace(/\)/g, '');
   value = value.replace(/\+/g, '');
   value = value.replace(/\*/g, '');

   const digits: number = value.length;
   if (digits !== 7 && digits !== 10) return DEFAULT_PHONE;

   const area: string   = digits == 7 ? '' : '(' + value.substr(0,3) + ') ';
   const prefix: string = digits == 7 ? value.substr(0,3) : value.substr(3,3);
   const line: string   = digits == 7 ? value.substr(3,4) : value.substr(6,4);

   return area + prefix + '-' + line;
 }
