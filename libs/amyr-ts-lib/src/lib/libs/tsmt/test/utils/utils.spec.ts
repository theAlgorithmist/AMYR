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

// Utility specs (todo: break into separate spec files for each utility class)
import {DirEnum, SegmentIntersection} from "../../../../models/geometry";

import {
  FcnEval,
  Rect,
  Point,
  Ranges
} from "../../../../models/geometry";

import * as stringUtils from '../../utils/string-utils';
import * as geomUtils from '../../utils/geom-utils';
import * as circleUtils from '../../utils/circle-utility-functions';
import * as pointUtils from '../../utils/point-utils';
import * as arrayUtils from '../../utils/array-functions';
import * as numberFormatting from '../../utils/number-formatter';

import {
  bisect,
  BisectInterval
} from "../../utils/Bisect";

import { twbrf      } from "../../utils/twbrf";
import { isBalanced } from "../../utils/balanced-parens";

import { LinearInterpolation } from '../../utils/linear-interp';
import { Gauss               } from '../../utils/gauss';
import { Timer               } from "../../utils/timer";

// Test Suites

describe('Number Formatter (phone number)', () => {

  it('empty string produces default phone', function() {
    expect(numberFormatting.toPhoneNumber('')).toBe('no phone number');
  });

  it('properly formats numbers with selected non-digit characters', function() {
    expect(numberFormatting.toPhoneNumber('123-456-7890')).toBe('(123) 456-7890');
    expect(numberFormatting.toPhoneNumber('(123)456-7890')).toBe('(123) 456-7890');
    expect(numberFormatting.toPhoneNumber('+1234567890')).toBe('(123) 456-7890');
  });

  it('incorrect digits produces default phone', function() {
    expect(numberFormatting.toPhoneNumber('123')).toBe('no phone number');
    expect(numberFormatting.toPhoneNumber('123456')).toBe('no phone number');
    expect(numberFormatting.toPhoneNumber('12345678911')).toBe('no phone number');
  });

  it('correctly formats 7-digit number', function() {
    expect(numberFormatting.toPhoneNumber('1234567')).toBe('123-4567');
  });

  it('correctly formats 10-digit number', function() {
    expect(numberFormatting.toPhoneNumber('1234567890')).toBe('(123) 456-7890');
  });
});

describe('Number Formatter (minimum digits)', () => {

  it('invalid input produces null string', function() {
    expect(numberFormatting.toMininumDigits(1/0)).toBe('');
  });

  it('properly formats an integer', function() {
    expect(numberFormatting.toMininumDigits(5)).toBe('5');
    expect(numberFormatting.toMininumDigits(5, 1)).toBe('5');
    expect(numberFormatting.toMininumDigits(5, 2)).toBe('5');
  });

  it('properly formats a float to one digit after decimal', function() {
    expect(numberFormatting.toMininumDigits(5.1, 1)).toBe('5.1');
    expect(numberFormatting.toMininumDigits(2.4, 1)).toBe('2.4');
    expect(numberFormatting.toMininumDigits(-1.3, 1)).toBe('-1.3');
    expect(numberFormatting.toMininumDigits(5.16, 1)).toBe('5.2');
    expect(numberFormatting.toMininumDigits(2.47, 1)).toBe('2.5');
  });

  it('correctly removes trailing zeros #1', function() {
    expect(numberFormatting.toMininumDigits(5.2, 2)).toBe('5.2');
  });

  it('correctly removes trailing zeros #2', function() {
    expect(numberFormatting.toMininumDigits(5.2, 2)).toBe('5.2');
    expect(numberFormatting.toMininumDigits(5.2, 3)).toBe('5.2');
    expect(numberFormatting.toMininumDigits(5.2, 5)).toBe('5.2');
  });

  it('correctly removes trailing zeros #3', function() {
    expect(numberFormatting.toMininumDigits(5, 2)).toBe('5');
    expect(numberFormatting.toMininumDigits(5.00000001, 3)).toBe('5');
  });
});

describe('Number Formatter (round to)', () =>
{
  it('zero returned on invalid input', function ()
  {
    const input: any = NaN;
    expect(numberFormatting.roundTo(input, 0.1)).toBe(0);

    expect(numberFormatting.roundTo(1.25, -0.1)).toBe(0);
  });

  it('returns input number when argument is zero', function ()
  {
    const input = 10.5;
    expect(numberFormatting.roundTo(input, 0)).toBe(10.5);
  });

  it('equivalent to Math.round when argument is one', function ()
  {
    let input           = 10.5;
    let rounded: number = Math.round(input);
    expect(numberFormatting.roundTo(input, 1)).toBe(rounded);

    input   = 0.2;
    rounded = Math.round(input);
    expect(numberFormatting.roundTo(input, 1)).toBe(rounded);

    input   = -1.2;
    rounded = Math.round(input);
    expect(numberFormatting.roundTo(input, 1)).toBe(rounded);

    input   = -10.5;
    rounded = Math.round(input);
    expect(numberFormatting.roundTo(input, 1)).toBe(rounded);
  });

  it('correctly rounds to nearest tenth and hundredth', function ()
  {
    let input = 10.48;
    expect(numberFormatting.roundTo(input, 0.1)).toBe(10.5);

    input = 0.128;
    expect(numberFormatting.roundTo(input, 0.1)).toBe(0.1);

    input = 10.481;
    expect(numberFormatting.roundTo(input, 0.01)).toBe(10.48);

    input = 0.128;
    expect(numberFormatting.roundTo(input, 0.01)).toBe(0.13);
  });

  it('correctly rounds to nearest ten and hundred', function ()
  {
    let input = 10.48;
    expect(numberFormatting.roundTo(input, 10)).toBe(10);

    input = 128;
    expect(numberFormatting.roundTo(input, 10)).toBe(130);

    input = 10481;
    expect(numberFormatting.roundTo(input, 100)).toBe(10500);

    input = 128;
    expect(numberFormatting.roundTo(input, 100)).toBe(100);
  });
});

describe('Number Formatter (to fixed)', () =>
{
  it('(string) NaN returned on invalid input', function ()
  {
    let input: any = NaN;
    expect(numberFormatting.toFixed(input, 1)).toBe('NaN');

    input = 'a';
    expect(numberFormatting.toFixed(input, 1)).toBe('NaN');
  });

  it('Returns original input if number decimals is negative ', function ()
  {
    expect(numberFormatting.toFixed(10.5, -1)).toBe('10.5');
  });

  it('returns floor/ceil if number of decimals is zero', function ()
  {
    expect(numberFormatting.toFixed(10.5, 0)).toBe('10');
    expect(numberFormatting.toFixed(0.245, 0)).toBe('0');
    expect(numberFormatting.toFixed(-1.5, 0)).toBe('-1');
  });

  it('returns proper result to one digit', function ()
  {
    expect(numberFormatting.toFixed(10.54, 1)).toBe('10.5');
    expect(numberFormatting.toFixed(0.245, 1)).toBe('0.2');
    expect(numberFormatting.toFixed(-1.45, 1)).toBe('-1.5');
    expect(numberFormatting.toFixed(-1.5, 1)).toBe('-1.5');
  });

  it('returns proper result to two digit', function ()
  {
    expect(numberFormatting.toFixed(10.546, 2)).toBe('10.55');
    expect(numberFormatting.toFixed(0.245, 2)).toBe('0.25');
    expect(numberFormatting.toFixed(-1.577, 2)).toBe('-1.58');
  });

  it('returns proper result to four digit', function ()
  {
    expect(numberFormatting.toFixed(1256789.4567, 4)).toBe('1256789.4567');
  });
});

describe('Number Formatter (# digits past decimal)', () =>
{
  it('returns zero if input is invalid', function ()
  {
    let input: any = NaN;
    expect(numberFormatting.numdigitsPastDecimal(input)).toBe(0);

    input = 'a';
    expect(numberFormatting.numdigitsPastDecimal(input)).toBe(0);
  });

  it('returns zero if the input has no decimal point', function ()
  {
    expect(numberFormatting.numdigitsPastDecimal(10)).toBe(0);
    expect(numberFormatting.numdigitsPastDecimal(-5)).toBe(0);
  });

  it('returns correct result for arbitrary numbers with fixed number of decimal places', function ()
  {
    expect(numberFormatting.numdigitsPastDecimal(10.0)).toBe(0);
    expect(numberFormatting.numdigitsPastDecimal(10.1)).toBe(1);
    expect(numberFormatting.numdigitsPastDecimal(0.12)).toBe(2);
    expect(numberFormatting.numdigitsPastDecimal(-10.7071)).toBe(4);
  });
});

describe('Number Formatter (order of magnitude)', () =>
{
  it('returns zero if input is invalid', function ()
  {
    let input: any = NaN;
    expect(numberFormatting.orderOfMagnitude(input)).toBe(0);

    input = 'a';
    expect(numberFormatting.orderOfMagnitude(input)).toBe(0);
  });

  it('returns -1 if |x| > 0 && |x| < 1', function ()
  {
    expect(numberFormatting.orderOfMagnitude(0.5)).toBe(-1);
    expect(numberFormatting.orderOfMagnitude(-0.2)).toBe(-1);
  });

  it('returns 0 if |x| > 1 && |x| < 10', function ()
  {
    expect(numberFormatting.orderOfMagnitude(5.72)).toBe(0);
    expect(numberFormatting.orderOfMagnitude(-2.1)).toBe(0);
  });

  it('returns 1 if |x| > 10 && |x| < 100', function ()
  {
    expect(numberFormatting.orderOfMagnitude(10.5)).toBe(1);
    expect(numberFormatting.orderOfMagnitude(50.72)).toBe(1);
    expect(numberFormatting.orderOfMagnitude(99.0)).toBe(1);
    expect(numberFormatting.orderOfMagnitude(-21.1)).toBe(1);
  });

  it('returns 2 if |x| > 100 && |x| < 1000', function ()
  {
    expect(numberFormatting.orderOfMagnitude(100.5)).toBe(2);
    expect(numberFormatting.orderOfMagnitude(500.72)).toBe(2);
    expect(numberFormatting.orderOfMagnitude(999.0)).toBe(2);
    expect(numberFormatting.orderOfMagnitude(-210.1)).toBe(2);
  });
});

describe('Number Formatter (scientific notation)', () =>
{
  it('returns zero if input is invalid', function ()
  {
    let input: any = NaN;
    expect(numberFormatting.toScientific(input, 1)).toBe('NaN');

    input = 'a';
    expect(numberFormatting.toScientific(input, 1)).toBe('NaN');
  });

  it('returns (string) zero if value is exactly zero', function ()
  {
    expect(numberFormatting.toScientific(0.0, 1)).toBe('0');
  });

  it('returns proper results across combinations of value and number significant digits', function ()
  {
    expect(numberFormatting.toScientific(1.0, 1)).toBe('1.0 x 10^0');
    expect(numberFormatting.toScientific(2.1, 1)).toBe('2.1 x 10^0');
    expect(numberFormatting.toScientific(0.95, 2)).toBe('9.50 x 10^-1');
    expect(numberFormatting.toScientific(512.127, 3)).toBe('5.121 x 10^2');
  });
});

describe('Number Formatter (insert commas)', () =>
{
  it('returns (string) NaN if input is invalid', function ()
  {
    let input: any = NaN;
    expect(numberFormatting.insertCommas(input)).toBe('NaN');

    input = 'a';
    expect(numberFormatting.toScientific(input)).toBe('NaN');
  });

  it('returns input number (to string) if magnitude < 1000', function ()
  {
    expect(numberFormatting.insertCommas(999)).toBe('999');
    expect(numberFormatting.insertCommas(0.457)).toBe('0.457');
    expect(numberFormatting.insertCommas(-800)).toBe('-800');
  });

  it('correctly inserts commas for various numbers with magnitude > 1000', function ()
  {
    expect(numberFormatting.insertCommas(1000)).toBe('1,000');
    expect(numberFormatting.insertCommas(1023045.457)).toBe('1,023,045.457');
    expect(numberFormatting.insertCommas(-800752)).toBe('-800,752');
  });
});

describe('Number Formatter (general formatter)', () =>
{
  it('returns (string) NaN if input is invalid', function ()
  {
    let input: any = NaN;
    expect(numberFormatting.formatNumber(input, 1)).toBe('NaN');

    input = 'a';
    expect(numberFormatting.formatNumber(input, 1)).toBe('NaN');
  });

  it('uses at least one significant digit even if that input is not passed or is invalid', function ()
  {
    expect(numberFormatting.formatNumber(1.45)).toBe('1.5');
    expect(numberFormatting.formatNumber(-1.45)).toBe('-1.5');

    expect(numberFormatting.formatNumber(1.45, -1)).toBe('1.5');
    expect(numberFormatting.formatNumber(1.45, 1.67)).toBe('1.45');
  });

  it('properly formats requested number of significant digits', function ()
  {
    expect(numberFormatting.formatNumber(1.45, 2)).toBe('1.45');
    expect(numberFormatting.formatNumber(-1.45, 2)).toBe('-1.45');

    expect(numberFormatting.formatNumber(12.4567, 3)).toBe('12.457');
    expect(numberFormatting.formatNumber(12.4567, 4)).toBe('12.4567');
  });

  it('properly formats with a requested separator', function ()
  {
    expect(numberFormatting.formatNumber(1.45, 2, true)).toBe('1.45');
    expect(numberFormatting.formatNumber(1203.4567, 3, true)).toBe('1,203.457');
    expect(numberFormatting.formatNumber(1256789.4567, 4, true)).toBe('1,256,789.4567');
  });

  it('properly formats with scientific notation', function ()
  {
    expect(numberFormatting.formatNumber(1.45, 2, false, true)).toBe('1.45 x 10^0');
    expect(numberFormatting.formatNumber(1203.4567, 3, false, true)).toBe('1.203 x 10^3');
    expect(numberFormatting.formatNumber(1256789.4567, 4, false, true)).toBe('1.2568 x 10^6');
  });
});

describe('Number Formatter (get exponent)', () =>
{
  it('returns zero if input is invalid', function ()
  {
    let input: any = NaN;
    expect(numberFormatting.getExponent(input)).toBe(0);

    input = 'a';
    expect(numberFormatting.getExponent(input)).toBe(0);
  });

  it('returns -1 for 0.5', function ()
  {
    expect(numberFormatting.getExponent(0.5)).toBe(-1);
  });

  it('returns 0 for input of exactly or near zero', function ()
  {
    expect(numberFormatting.getExponent(0)).toBe(0);
    expect(numberFormatting.getExponent(0.0000000001)).toBe(0);
  });

  it('returns zero for |x| > 0 |x| < 10', function ()
  {
    expect(numberFormatting.getExponent(1.47)).toBe(0);
    expect(numberFormatting.getExponent(-9.2)).toBe(0);
  });

  it('returns 1 for |x| > 10 && |x| < 100', function ()
  {
    expect(numberFormatting.getExponent(11.47)).toBe(1);
    expect(numberFormatting.getExponent(-92.2)).toBe(1);
  });

  it('returns 2 for |x| > 100 && |x| < 1000', function ()
  {
    expect(numberFormatting.getExponent(411.47)).toBe(2);
    expect(numberFormatting.getExponent(-902.2)).toBe(2);
  });
});

describe('String Utils (startsWith)', () =>
{
  it('returns empty string if input is empty', function ()
  {
    expect(stringUtils.startsWith('', '')).toBe(false);
  });

  it('returns empty string for singleton space', function ()
  {
    expect(stringUtils.startsWith(' ', ' ')).toBe(true);
  });

  it('returns correct result for singleton string and bad position #1', function ()
  {
    expect(stringUtils.startsWith('z', 'z', -1)).toBe(true);
  });

  it('returns correct result for singleton string and bad position #2', function ()
  {
    expect(stringUtils.startsWith('z', 'z', 1)).toBe(true);
  });

  it('returns correct result for singleton string and bad position #3', function ()
  {
    expect(stringUtils.startsWith('z', 'a', 1)).toBe(false);
  });

  it('returns correct result for general string #1', function ()
  {
    expect(stringUtils.startsWith('az', 'a')).toBe(true);
  });

  it('returns correct result for general string #2', function ()
  {
    expect(stringUtils.startsWith('Az', 'a')).toBe(false);
  });

  it('returns correct result for general string #3', function ()
  {
    expect(stringUtils.startsWith('AbcdEfghz', 'cdE', 2)).toBe(true);
  });

});

describe('String Utils (capitalize)', () =>
{
  it('returns empty string if input is empty', function ()
  {
    expect(stringUtils.capitalize('')).toBe('');
  });

  it('returns correct result for singleton space', function ()
  {
    expect(stringUtils.capitalize(' ')).toBe(' ');
  });

  it('returns correct capitalized string for singleton string', function ()
  {
    expect(stringUtils.capitalize('z')).toBe('Z');
  });

  it('returns correct capitalized string #1', function ()
  {
    expect(stringUtils.capitalize('a b c')).toBe('A b c');
  });

  it('returns correct capitalized string #2', function ()
  {
    expect(stringUtils.capitalize('abc')).toBe('Abc');
  });

  it('returns correct capitalized string #3', function ()
  {
    expect(stringUtils.capitalize('ABC')).toBe('Abc');
  });
});

describe('String Utils (trim spaces)', () =>
{
  it('returns empty string if input is empty', function ()
  {
    expect(stringUtils.trim('')).toBe('');
  });

  it('returns empty string for singleton space', function ()
  {
    expect(stringUtils.trim(' ')).toBe('');
  });

  it('returns correct trimmed string #1', function ()
  {
    expect(stringUtils.trim('a b c')).toBe('abc');
  });

  it('returns correct trimmed string #2', function ()
  {
    expect(stringUtils.trim(' a   b c')).toBe('abc');
  });

  it('returns correct trimmed string #3', function ()
  {
    expect(stringUtils.trim(' a   b c  ')).toBe('abc');
  });
});

describe('String Utils (left trim)', () =>
{
  it('returns empty string if input is empty', function ()
  {
    expect(stringUtils.leftTrim('')).toBe('');
  });

  it('returns empty string for singleton space', function ()
  {
    expect(stringUtils.leftTrim(' ')).toBe('');
  });

  it('returns correct trimmed string #1', function ()
  {
    expect(stringUtils.leftTrim('a b c')).toBe('a b c');
  });

  it('returns correct trimmed string #2', function ()
  {
    expect(stringUtils.leftTrim(' ab c')).toBe('ab c');
  });

  it('returns correct trimmed string #3', function ()
  {
    expect(stringUtils.leftTrim('   a b c')).toBe('a b c');
  });
});

describe('String Utils (right trim)', () =>
{
  it('returns empty string if input is empty', function ()
  {
    expect(stringUtils.rightTrim('')).toBe('');
  });

  it('returns empty string for singleton space', function ()
  {
    expect(stringUtils.rightTrim(' ')).toBe('');
  });

  it('returns correct trimmed string #1', function ()
  {
    expect(stringUtils.rightTrim('a b c')).toBe('a b c');
  });

  it('returns correct trimmed string #2', function ()
  {
    expect(stringUtils.rightTrim(' ab c  ')).toBe(' ab c');
  });

  it('returns correct trimmed string #3', function ()
  {
    expect(stringUtils.rightTrim(' a b  c  ')).toBe( ' a b  c');
  });
});

describe('String Utils (left/right trim)', () =>
{
  it('returns empty string if input is empty', function ()
  {
    expect(stringUtils.trimEnds('')).toBe('');
  });

  it('returns empty string for singleton space', function ()
  {
    expect(stringUtils.trimEnds(' ')).toBe('');
  });

  it('returns correct trimmed string #1', function ()
  {
    expect(stringUtils.trimEnds('a b c')).toBe('a b c');
  });

  it('returns correct trimmed string #2', function ()
  {
    expect(stringUtils.trimEnds(' ab c  ')).toBe('ab c');
  });

  it('returns correct trimmed string #3', function ()
  {
    expect(stringUtils.trimEnds(' a b  c  ')).toBe( 'a b  c');
  });
});

describe('String Utils (trim to char count)', () =>
{
  it('returns empty string if input is empty', function ()
  {
    expect(stringUtils.trimToCharCount('', 1)).toBe('');
  });

  it('returns empty string for singleton space', function ()
  {
    expect(stringUtils.trimToCharCount(' ', 1)).toBe('');
  });

  it('returns input if length less than count', function ()
  {
    expect(stringUtils.trimToCharCount('abc', 4)).toBe('abc');
  });

  it('properly adjusts length parameter', function ()
  {
    // results in a trim to 1-char
    expect(stringUtils.trimToCharCount('abc', -4)).toBe('a');
  });

  it('properly trims to 2 chars (no space)', function ()
  {
    expect(stringUtils.trimToCharCount('abc', 2)).toBe('ab');
  });

  it('properly trims to 3 chars (no space)', function ()
  {
    expect(stringUtils.trimToCharCount('abc', 3)).toBe('abc');
  });

  it('properly trims with spaces #1', function ()
  {
    expect(stringUtils.trimToCharCount('abc def', 4)).toBe('abc');
  });

  it('properly trims with spaces #2', function ()
  {
    expect(stringUtils.trimToCharCount('abc def', 5)).toBe('abc');
  });

  it('properly trims with spaces #3', function ()
  {
    expect(stringUtils.trimToCharCount('abc def', 6)).toBe('abc');
  });

  it('properly trims with spaces #4', function ()
  {
    expect(stringUtils.trimToCharCount('abc def', 7)).toBe('abc');
  });

  it('properly trims with spaces #5', function ()
  {
    expect(stringUtils.trimToCharCount('This is a test', 9)).toBe('This is');
  });

  it('properly adds ellipses', function ()
  {
    expect(stringUtils.trimToCharCount('abc def', 7, true)).toBe('abc...');
  });
});

describe('String Utils (left pad)', () =>
{
  it('returns singleton space if input is empty', function ()
  {
    expect(stringUtils.leftPad('', 1)).toBe(' ');
  });

  it('returns correct padding if count is invalid', function ()
  {
    expect(stringUtils.leftPad('', -1)).toBe(' ');
  });

  it('returns correct padding #1', function ()
  {
    expect(stringUtils.leftPad('abc', 4)).toBe(' abc');
  });

  it('returns correct padding #2', function ()
  {
    expect(stringUtils.leftPad('abc', 5)).toBe('  abc');
  });

  it('returns correct padding #3', function ()
  {
    expect(stringUtils.leftPad('abc', 6, 'X')).toBe('XXXabc');
  });
});

describe('String Utils (right pad)', () =>
{
  it('returns singleton space if input is empty', function ()
  {
    expect(stringUtils.rightPad('', 1)).toBe(' ');
  });

  it('returns correct padding if count is invalid', function ()
  {
    expect(stringUtils.rightPad('', -1)).toBe(' ');
  });

  it('returns correct padding #1', function ()
  {
    expect(stringUtils.rightPad('abc', 4)).toBe('abc ');
  });

  it('returns correct padding #2', function ()
  {
    expect(stringUtils.rightPad('abc', 5)).toBe('abc  ');
  });

  it('returns correct padding #3', function ()
  {
    expect(stringUtils.rightPad('abc', 6, 'X')).toBe('abcXXX');
  });
});

describe('String Utils (first non-repeating character)', () => {

  it('correctly handles null input string', () => {
    const char: string = stringUtils.firstNonrepeatingChar('');

    expect(char).toBe('');
  });

  it('correctly handles single-character string', () => {
    const char: string = stringUtils.firstNonrepeatingChar('a');

    expect(char).toBe('a');
  });

  it('correctly handles first non-repeating at first position', () => {
    const char: string = stringUtils.firstNonrepeatingChar('abbccddeeffgghh');

    expect(char).toBe('a');
  });

  it('correctly handles first non-repeating at last position', () => {
    const char: string = stringUtils.firstNonrepeatingChar('aabbccddeeffggh');

    expect(char).toBe('h');
  });

  it('correctly returns first first of multiple non-repeating chars', () => {
    const char: string = stringUtils.firstNonrepeatingChar('aabb1ccddzeeff0ggh');

    expect(char).toBe('1');
  });

  it('correctly handles no non-repeating chars', () => {
    const char: string = stringUtils.firstNonrepeatingChar('aabb1ccd1dzeefzf0ggh0h');

    expect(char).toBe('');
  });

  it('correctly handles arbitrary character sequence', () => {
    const char: string = stringUtils.firstNonrepeatingChar('aldsfalhsdfasldhsdflveiewqoqzseurpeqvadspoiewyurpqowvh1792034273947239');

    expect(char).toBe('z');
  });
});

describe('String Utils (reverse and initials)', () =>
{
  it('correctly reverses characters in a string', () =>
  {
    const result: string = stringUtils.reverseChars('TORTXOF EKIM AHPLA')
    expect(result).toBe('ALPHA MIKE FOXTROT');   // which is what I will say if you ever ask me this in an interview
  });

  it('correctly extracts initials from a name', () =>
  {
    const result: string = stringUtils.initials("james thomas armstrong");
    expect(result).toBe("JTA");
  });

  it('correctly extracts initials from first name only', () =>
  {
    const result: string = stringUtils.initials("james");
    expect(result).toBe("J");
  });

  it('correctly extracts initials from a name and adds delimiter between initials', () =>
  {
    const result: string = stringUtils.initials("james thomas armstrong", ".");
    expect(result).toBe("J.T.A");
  });
});

describe('String Utils (word count)', () =>
{
  const tmp: any = null;
  it('returns zero for undefined string', () =>
  {
    expect(stringUtils.wordCount(tmp)).toBe(0);
  });

  it('returns zero for an empty string', () =>
  {
    expect(stringUtils.wordCount('')).toBe(0);
  });

  it('returns one for a single word', () =>
  {
    expect(stringUtils.wordCount('word')).toBe(1);
  });

  it('returns two for two words', () =>
  {
    expect(stringUtils.wordCount('two words')).toBe(2);
  });

  it('returns twp for a two words #2', () =>
  {
    expect(stringUtils.wordCount('two-words')).toBe(2);
  });

  it('returns four for a four words', () =>
  {
    expect(stringUtils.wordCount('this is four words')).toBe(4);
  });
});

describe('String Utils (remove substring)', () =>
{
  const tmp: any = null;
  it('returns empty string for undefined input', () =>
  {
    expect(stringUtils.remove(tmp, '')).toBe('');
  });

  it('returns empty string for empty input', () =>
  {
    expect(stringUtils.remove('', '')).toBe('');
  });

  it('returns empty string for remove entire string', () =>
  {
    expect(stringUtils.remove('abc', 'abc')).toBe('');
  });

  it('returns correct removal #1', () =>
  {
    expect(stringUtils.remove('abc123', 'abc')).toBe('123');
  });

  it('returns correct removal #2', () =>
  {
    expect(stringUtils.remove('abc123 321abc', 'abc')).toBe('123 321');
  });
});

describe('String Utils (is numeric)', () =>
{
  const tmp: any = null;
  it('returns false for undefined input', () =>
  {
    expect(stringUtils.isNumeric(tmp)).toBe(false);
  });

  it('returns false for empty input', () =>
  {
    expect(stringUtils.isNumeric('')).toBe(false);
  });

  it('returns false character input', () =>
  {
    expect(stringUtils.isNumeric('abc')).toBe(false);
  });

  it('returns false mixed number/character input', () =>
  {
    expect(stringUtils.isNumeric('abc123')).toBe(false);
  });

  it('returns true for number input', () =>
  {
    expect(stringUtils.isNumeric('123')).toBe(true);
  });

  it('returns true for floating-point', () =>
  {
    expect(stringUtils.isNumeric('123.45')).toBe(true);
  });

  it('returns true for negative floating-point', () =>
  {
    expect(stringUtils.isNumeric('-123.45')).toBe(true);
  });

  it('handles leading + sign', () =>
  {
    expect(stringUtils.isNumeric('+123.45')).toBe(true);
  });

  it('handles exponential notation', () =>
  {
    expect(stringUtils.isNumeric('1.2345e2')).toBe(true);
  });

  it('rejects typo', () =>
  {
    expect(stringUtils.isNumeric('1.2345ef2')).toBe(false);
  });
});

describe('(one-line) utility functions', () => {

  it('correctly pads a string to the left # 1', () => {
    const result: string = arrayUtils.padLeft("this is a string", 2);
    expect(result).toBe("  this is a string");
  });

  it('correctly pads a string to the left # 2', () => {
    const result: string = arrayUtils.padLeft("this is a string", 0);
    expect(result).toBe("this is a string");
  });

  it('correctly pads a string to the left # 3', () => {
    const result: string = arrayUtils.padLeft("this is a string", -3);
    expect(result).toBe("   this is a string");
  });

  it('returns NaN for min value of empty array', () => {
    const result: number = arrayUtils.minValue([]);
    expect(isNaN(result)).toBe(true);
  });

  it('returns proper minimum value for an array of numbers', () => {
    const result: number = arrayUtils.minValue([2.5, -1.7, 1.0, 3.6, 1.4, 0.25, 10.0]);
    expect(result).toBe(-1.7);
  });

  it('returns NaN for max value of empty array', () => {
    const result: number = arrayUtils.maxValue([]);
    expect(isNaN(result)).toBe(true);
  });

  it('returns proper maximum value for an array of numbers', () => {
    const result: number = arrayUtils.maxValue([2.5, -1.7, 1.0, 3.6, 1.4, 0.25, 10.0]);
    expect(result).toBe(10.0);
  });

  it('returns false for all greater than an empty array', () => {
    const result: boolean = arrayUtils.allGreaterThan([], 0);
    expect(result).toBe(false);
  });

  it('returns true for all greater a supplied value', () => {
    const result: boolean = arrayUtils.allGreaterThan([1.0, 2.0, 3.0, 4.0, 5.0, 6.0], 0);
    expect(result).toBe(true);
  });

  it('returns false for all greater than a supplied value', () => {
    const result: boolean = arrayUtils.allGreaterThan([1.0, 20.0, 3.0, 40.0, 5.0, 6.0], 10);
    expect(result).toBe(false);
  });

  it('returns all array elements greater than a supplied value', () => {
    const result: Array<number> = arrayUtils.getAllGreaterThan([1.0, 20.0, 3.0, 40.0, 5.0, 60.0], 10);
    expect(result.length).toBe(3);
    expect(result[0]).toBe(20);
    expect(result[1]).toBe(40);
    expect(result[2]).toBe(60);
  });

  it('returns -1 for no index of array element greater than a supplied value', () => {
    const result: number = arrayUtils.indexFirstGreaterThan([1.0, 20.0, 3.0, 40.0, 5.0, 6.0], 100);
    expect(result).toBe(-1);
  });

  it('returns correct index for first array element greater than a supplied value', () => {
    const result: number = arrayUtils.indexFirstGreaterThan([1.0, 20.0, 3.0, 40.0, 5.0, 60.0], 25);
    expect(result).toBe(3);
  });
});

describe('geomUtils', () => {

  // y-down bounding box
  let left   = 150;
  let right  = 350;
  let top    = 120;
  let bottom = 350;

  // point inside bounding box
  it('returns point outside box (y-down) #1', () => {
    expect( geomUtils.insideBox(100.0, 100.0, left, top, right, bottom) ).toBe(false);
  });

  it('returns point outside box (y-down) #2', () => {
    expect( geomUtils.insideBox(375.0, 120.0, left, top, right, bottom) ).toBe(false);
  });

  it('returns point outside box (y-down) #3', () => {
    expect( geomUtils.insideBox(175.0, 370.0, left, top, right, bottom) ).toBe(false);
  });

  it('returns point outside box (y-down) #4', () => {
    expect( geomUtils.insideBox(150.0, 251.0, left, top, right, bottom) ).toBe(false);
  });

  it('returns point inside box (y-down)', () => {
    expect( geomUtils.insideBox(200.0, 200.0, left, top, right, bottom) ).toBe(true);
  });

  it('returns point on boundary as outside (y-down)', () => {
    expect( geomUtils.insideBox(150.0, 250.0, left, top, right, bottom) ).toBe(false);
  });

  // change to y-up
  left   = 150;
  right  = 350;
  top    = 250;
  bottom = 120;

  it('returns point outside box (y-up) #1', () => {
    expect( geomUtils.insideBox(100.0, 100.0, left, top, right, bottom) ).toBe(false);
  });

  it('returns point outside box (y-down) #2', () => {
    expect( geomUtils.insideBox(375.0, 120.0, left, top, right, bottom) ).toBe(false);
  });

  it('returns point inside box (y-down)', () => {
    expect( geomUtils.insideBox(200.0, 200.0, left, top, right, bottom) ).toBe(true);
  });

  it('returns point on boundary as outside (y-up)', () => {
    expect( geomUtils.insideBox(150.0, 250.0, left, top, right, bottom) ).toBe(false);
  });

  // bounding-box intersection
  let box1: Rect = {left:50, top:200, right:150, bottom:100};
  let box2: Rect = {left:175, top:90, right:375, bottom:10};

  it('returns no bounding-box intersection (y-up) #1', () => {
    expect( geomUtils.boxesIntersect(box1, box2) ).toBe(false);
  });

  it('returns no bounding-box intersection (y-up) #2', () => {
    box2 = {left:-20, top:95, right:20, bottom:10};

    expect( geomUtils.boxesIntersect(box1, box2) ).toBe(false);
  });

  it('returns pno bounding-box intersection (y-up) #3', () => {
    box2 = {left:75, top:325, right:200, bottom:201};

    expect( geomUtils.boxesIntersect(box1, box2) ).toBe(false);
  });

  it('returns bounding-box intersection (y-up)', () => {
    box2 = {left:110, top:120, right:200, bottom:30};

    expect( geomUtils.boxesIntersect(box1, box2) ).toBe(true);
  });

  it('returns no bounding-box intersection (y-dn) #1', () => {
    box1 = {left:10, top:10, right:150, bottom:100};
    box2 = {left:100, top:150, right:300, bottom:250};

    expect( geomUtils.boxesIntersect(box1, box2) ).toBe(false);
  });

  it('returns no bounding-box intersection (y-dn) #2', () => {
    box1 = {left:10, top:10, right:150, bottom:100};
    box2 = {left:-20, top:-95, right:20, bottom:0};

    expect( geomUtils.boxesIntersect(box1, box2) ).toBe(false);
  });

  it('returns pno bounding-box intersection (y-dn) #3', () => {
    box1 = {left:10, top:10, right:150, bottom:100};
    box2 = {left:175, top:325, right:200, bottom:210};

    expect( geomUtils.boxesIntersect(box1, box2) ).toBe(false);
  });

  it('returns bounding-box intersection (y-dn)', () => {
    box1 = {left:10, top:10, right:150, bottom:100};
    box2 = {left:110, top:30, right:200, bottom:120};

    expect( geomUtils.boxesIntersect(box1, box2) ).toBe(true);
  });

  // point-line orientation
  it('returns (5,1) to right of line', () => {
    expect( geomUtils.pointOrientation(1, 1, 7, 3, 5, 1) ).toBe(DirEnum.RIGHT);
  });

  it('returns (-1,-7) to right of line', () => {
    expect( geomUtils.pointOrientation(1, 1, 7, 3, -1, -7) ).toBe(DirEnum.RIGHT);
  });

  it('returns (4,2) on the line', () => {
    expect( geomUtils.pointOrientation(1, 1, 7, 3, 4, 2) ).toBe(DirEnum.ON);
  });

  it('returns (2,5) to left of line', () => {
    expect( geomUtils.pointOrientation(1, 1, 7, 3, 2, 5) ).toBe(DirEnum.LEFT);
  });

  it('returns (-2,2) to left of line', () => {
    expect( geomUtils.pointOrientation(1, 1, 7, 3, -2, 2) ).toBe(DirEnum.LEFT);
  });

  // line segment intersects bounding-box
  it('(25,325) to (300,310) does not intersect bounding box', () => {
    expect( geomUtils.intersectBox( 25, 325, 300, 310, 50, 50, 150, 300 ) ).toBe(false);
  });

  it('(140,25) to (200,75) does not intersect bounding box', () => {
    expect( geomUtils.intersectBox( 25, 325, 300, 310, 50, 50, 150, 300 ) ).toBe(false);
  });

  it('(-10,40) to (100,40) does not intersect bounding box', () => {
    expect( geomUtils.intersectBox( 25, 325, 300, 310, 50, 50, 150, 300 ) ).toBe(false);
  });

  it('(25,100) to (100,75) intersects bounding box', () => {
    expect( geomUtils.intersectBox( 25, 325, 300, 310, 50, 50, 150, 300 ) ).toBe(false);
  });

  // test screen coordinates for approximate equality
  it('(-10.2472,40.0) and (-10.2471,40.0) are approximately equal', () => {
    expect( geomUtils.pointsEqual(-10.2472, 40.0, -10.2471, 40.0) ).toBe(true);
  });

  it('(-10.2472,40.0) and (-10.2471,40.1) are not approximately equa', () => {
    expect( geomUtils.pointsEqual(-10.2472, 40.0, -10.2471, 40.1) ).toBe(false);
  });

  // line intersection
  it('lines through (15,10) to (49,25) & (29,5) to (32,32) intersect', () => {
    expect( geomUtils.linesIntersect( 15, 10, 49, 25, 29, 5, 32, 32) ).toBe(true);
  });

  it('lines through (1,1) to (7,7) & (2,2) to (8,8) do not intersect', () => {
    expect( geomUtils.linesIntersect( 1, 1, 7, 7, 2, 2, 8, 8) ).toBe(false);
  });

  it('lines through (1,1) to (7,1) & (2,2) to (8,2) do not intersect', () => {
    expect( geomUtils.linesIntersect( 1, 1, 7, 1, 2, 2, 8, 2) ).toBe(false);
  });

  it('lines through (1,1) to (1,7) & (2,2) to (2,8) do not intersect', () => {
    expect( geomUtils.linesIntersect( 1, 1, 1, 7, 2, 2, 2, 8) ).toBe(false);
  });

  // line segment intersection
  it('line segment (1,1) to (8,5) & (5,2) to (6,-1) do not intersect', () => {
    const intersects: SegmentIntersection = geomUtils.segmentsIntersect( 1, 1, 8, 5, 5, 2, 6, -1);
    expect( intersects.intersects ).toBe(false);
  });

  it('line segment (1,1) to (8,5) & (2,2) to (8,6) do not intersect', () => {
    const intersects: SegmentIntersection = geomUtils.segmentsIntersect( 1, 1, 8, 5, 2, 2, 9, 6);
    expect( intersects.intersects ).toBe(false);
  });

  it('line segment (1,1) to (8,5) & (5,4) to (6,-1) do intersect', () => {
    const intersects: SegmentIntersection = geomUtils.segmentsIntersect( 1, 1, 8, 5, 5, 4, 6, -1)
    expect( intersects.intersects ).toBe(true);
  });

  it('line segment (1,1) to (8,5) & (1,1) to (6,-1) do intersect', () => {
    const intersects: SegmentIntersection =  geomUtils.segmentsIntersect( 1, 1, 8, 5, 1, 1, 6, -1);
    expect( intersects.intersects ).toBe(true);
  });

  // intersection point of two (infinte) lines
  it('line through (15,10) and (49,25) & (29,5) to (32,32) intersect at (30,17)', () => {
    const coord: Point = geomUtils.lineIntersection( 15, 10, 49, 25, 29, 5, 32, 32);
    const x: number    = coord.x;
    const y: number    = coord.y;

    expect( Math.abs(x-30.305) < 0.01 ).toBe(true);
    expect( Math.abs(y-16.75) < 0.01 ).toBe(true);
  });

  // interior angle
  it('interior angle of (1,2), (7,12) and (-1,18) is approx. 95.91 deg.', () => {
    const angle: number = geomUtils.interiorAngle( 1, 2, 7, 12, -1, 18, true);

    expect( Math.abs(angle-95.91) < 0.01 ).toBe(true);
  });

  // point-sequence clockwise or counter-clockwise
  it('point sequence (1,1), (5,8) and (12,-2) is CW', () => {
    expect( geomUtils.isClockwise( 1, 1, 5, 8, 12, -2) ).toBe(true);
  });

  it('point sequence (1,1), (10,2) and (5,8) is CCW', () => {
    expect( geomUtils.isClockwise( 1, 1, 10, 2, 5, 8) ).toBe(false);
  });

  // point on line segment
  it('point (4,5) not to be on segment from (1,2) to (9,8)', () => {
    expect( geomUtils.pointOnLine( 4, 5, 1, 2, 9, 8) ).toBe(false);
  });

  it('point (5,5) to be on segment from (1,2) to (9,8)', () => {
    expect( geomUtils.pointOnLine( 5, 5, 1, 2, 9, 8) ).toBe(true);
  });

  // area of triangle
  it('area of triangle from (1,8) to (3,12) to (17,-2) is 42', () => {
    const a: number = geomUtils.triangleArea( 1, 8, 3, 12, 17, -2);
    expect( Math.abs(a-42) < 0.01 ).toBe(true);
  });

  it('area of triangle with coincident points to be zero', () => {
    const a: number = geomUtils.triangleArea( 1, 8, 1, 8, 1, 8);

    expect( Math.abs(a) < 0.001 ).toBe(true);
  });

  // circle-circle intersection
  it('circle at (-2,-3), r=3 and (-1,1), r=4 to intersect at (0.96, -2.49) and (-4.37, -1.16)', () => {
    const intersect: Array<Point> = circleUtils.circleToCircleIntersection(-2, -3, 3, -1, 1, 4);

    let p: Point     = intersect[0];
    const x1: number = p.x
    const y1: number = p.y

    p                = intersect[1];
    const x2: number = p.x
    const y2: number = p.y

    expect( Math.abs(x1-0.96) < 0.01 ).toBe(true);
    expect( Math.abs(y1+2.49) < 0.01 ).toBe(true);
    expect( Math.abs(x2+4.37) < 0.01 ).toBe(true);
    expect( Math.abs(y2+1.16) < 0.01 ).toBe(true);
  });

  // point to segment distance
  it('dist. from (5,6) to line passing through (2,0) & (8,4) is approx. 3.3', () => {
    const d: number = geomUtils.pointToSegmentDistance(2, 0, 8,4, 5, 6);

    expect( Math.abs(d-3.3) < 0.1 ).toBe(true);
  });

  // reflect point cloud around a line segment
  it('reflection about line y = x', () => {
    const p: Array<Point> = [{x: 2, y: 1}, {x: 1, y: -1}, {x: -1, y: 0}, {x: 4, y: 7}, {x: 6, y: -4}, {x: 7, y: 2}];

    // empty in - empty out
    expect( geomUtils.reflect([], 0, 0, 2, 2).length ).toBe(0);

    // can not reflect about degenerate line segment
    expect( geomUtils.reflect(p, 1, 1, 1, 1).length ).toBe(p.length);

    // reflecting about y = x causes x- and y-coordinates to switch, so this is easier to test
    const r: Array<Point> =  geomUtils.reflect(p, 0, 0, 2, 2);
    let point: Point     = r[0];
    expect( p[0].x ).toBe(point['y']);

    point = r[1];
    expect( p[1].x ).toBe(point['y']);

    point = r[2];
    expect( p[2].x ).toBe(point['y']);

    point = r[3];
    expect( p[3].x ).toBe(point['y']);

    point = r[4];
    expect( p[4].x ).toBe(point['y']);

    point = r[5];
    expect( p[5].x ).toBe(point['y']);
  });
});

describe('Circle Utils', () =>
{
  it('area of zero-radius circle is zero', () => {
    expect( circleUtils.circleArea(0) ).toBe(0);
  });

  it('returns zero area for negative radius', () => {
    expect( circleUtils.circleArea(-2.5) ).toBe(0);
  });

  it('returns 4PI for area of a circle with radius 2.0', () => {
    expect( Math.abs(circleUtils.circleArea(2.0)-Math.PI*4) < 0.001 ).toBe(true);
  });

  it('circumference of zero-radius circle is zero', () => {
    expect( circleUtils.circleCircumference(0) ).toBe(0);
  });

  it('returns zero circumference for negative radius', () => {
    expect( circleUtils.circleCircumference(-2.5) ).toBe(0);
  });

  it('returns 6PI for area of a circle with radius 3.0', () => {
    expect( Math.abs(circleUtils.circleCircumference(3.0)-Math.PI*6) < 0.001 ).toBe(true);
  });

  it('arc-length of zero-radius circle segment is zero', () => {
    expect( circleUtils.circleArcLength(0, 0.25) ).toBe(0);
  });

  it('arc-length of negative-radius circle segment is zero', () => {
    expect( circleUtils.circleArcLength(-1, 0.25) ).toBe(0);
  });

  it('return 0.5 for arc-length of circle segment with radius 2 and arc of 0.25 radians', () => {
    expect( Math.abs(circleUtils.circleArcLength(2.0, 0.25)-0.5) < 0.01 ).toBe(true);
  });

  it('return 0.5 for arc-length of circle segment with radius 2 and arc of -0.25 radians', () => {
    expect( Math.abs(circleUtils.circleArcLength(2.0, -0.25)-0.5) < 0.01 ).toBe(true);
  });

  it('returns correct chord properties', () => {
    const params: {l: number, theta: number, area: number} = circleUtils.circleChordParams(2.5, 0.5);
    const l: number      = params.l;
    const t: number      = params.theta;
    const a: number      = params.area;

    expect( Math.abs(l-4.9) < 0.1 ).toBe(true);
    expect( Math.abs(t-1.37) < 0.01 ).toBe(true);
    expect( Math.abs(a-1.22) < 0.01 ).toBe(true);
  });

  it('returns correct sector properties with positive angle', () => {
    const params: {area: number, len: number, perim: number} = circleUtils.circleSectorParams(4.0, 86*Math.PI/180);
    const a: number = params.area;
    const l:number  = params.len;
    const p:number  = params.perim;

    expect( Math.abs(a-12.01) < 0.01 ).toBe(true);
    expect( Math.abs(l-6.0) < 0.01 ).toBe(true);
    expect( Math.abs(p-14.0) < 0.01 ).toBe(true);
  });

  it('returns correct sector properties with negative angle', () => {
    const params: {area: number, len: number, perim: number} = circleUtils.circleSectorParams(4.0, -86*Math.PI/180);
    const a: number = params.area;
    const l:number  = params.len;
    const p:number  = params.perim;

    expect( Math.abs(a-12.01) < 0.01 ).toBe(true);
    expect( Math.abs(l-6.0) < 0.01 ).toBe(true);
    expect( Math.abs(p-14.0) < 0.01 ).toBe(true);
  });

  it('returns center-coordinates for zero radius', () => {
    const coords: Point = circleUtils.circleGetCoords(-1, 2, 0, 0.25*Math.PI);
    const x:number      = coords.x;
    const y:number      = coords.y;

    expect( Math.abs(x+1.0) < 0.01).toBe(true);
    expect( Math.abs(y-2.0) < 0.01 ).toBe(true);
  });

  it('returns correct coordinates for non-zero radius', () => {
    const coords: Point = circleUtils.circleGetCoords(-1, 2, 2.0, 0.25*Math.PI);
    const x: number     = coords.x;
    const y: number     = coords.y;

    expect( Math.abs(x-0.414) < 0.001 ).toBe(true);
    expect( Math.abs(y-3.414) < 0.001 ).toBe(true);
  });

  it('returns correct min/max gap for circle in circle #1', () => {
    const gaps: Ranges = circleUtils.circleGaps(5, 4, 4,4,4, 2) as Ranges;

    expect(gaps.min).toBe(1);
    expect(gaps.max).toBe(3);

    expect(gaps.minX).toBe(1);
    expect(gaps.minY).toBe(4);

    expect(gaps.maxX).toBe(9);
    expect(gaps.maxY).toBe(4);
  });

  it('returns correct min/max gap for circle in circle #2', () => {
    const gaps: Ranges = circleUtils.circleGaps(5, 4, 4,5,5, 2) as Ranges;

    expect(gaps.min).toBe(1);
    expect(gaps.max).toBe(3);

    expect(gaps.minX).toBe(5);
    expect(gaps.minY).toBe(8);

    expect(gaps.maxX).toBe(5);
    expect(gaps.maxY).toBe(0);
  });

  it('returns correct min/max gap for circle in circle #3', () => {
    const gaps: Ranges = circleUtils.circleGaps(5, 4, 4,6,6, 2) as Ranges;

    expect(Math.abs(gaps.min - 0.236) < 0.001).toBe(true);
    expect(Math.abs(gaps.max - 4.236) < 0.001).toBe(true);

    expect(Math.abs(gaps.minX - 6.788854381999832) < 0.0001).toBe(true);
    expect(Math.abs(gaps.minY - 7.577708763999663) < 0.0001).toBe(true);

    expect(Math.abs(gaps.maxX - 3.2111456180001685) < 0.0001).toBe(true);
    expect(Math.abs(gaps.maxY - 0.4222912360003366) < 0.0001).toBe(true);
  });

  it('returns point outside circle for zero radius (point not at center)', () => {
    expect( circleUtils.pointInCircle(-1, 2, 1, 3, 0) ).toBe(false);
  });

  it('returns point in circle for zero radius (point at center)', () => {
    expect( circleUtils.pointInCircle(-1, 2, -1, 2, 0) ).toBe(true);
  });

  it('(7,0) is outside circle at (2,3) with r=4', () => {
    expect( circleUtils.pointInCircle(7, 0, 2, 3, 4) ).toBe(false);
  });

  it('(5.8,6.8) is outside circle at (2,3) with r=4', () => {
    expect( circleUtils.pointInCircle(5.8, 6.8, 2, 3, 4) ).toBe(false);
  });

  it('(2,8) is outside circle at (2,3) with r=4', () => {
    expect( circleUtils.pointInCircle(2, 8, 2, 3, 4) ).toBe(false);
  });

  it('(-1.9,6.9) is outside circle at (2,3) with r=4', () => {
    expect( circleUtils.pointInCircle(-1.0, 6.9, 2, 3, 4) ).toBe(false);
  });

  it('(-2.5,3) is outside circle at (2,3) with r=4', () => {
    expect( circleUtils.pointInCircle(-2.5, 3, 2, 3, 4) ).toBe(false);
  });

  it('(-1.9,-6.9) is outside circle at (2,3) with r=4', () => {
    expect( circleUtils.pointInCircle(-1.0, -6.9, 2, 3, 4) ).toBe(false);
  });

  it('(-1,-3) is outside circle at (2,3) with r=4', () => {
    expect( circleUtils.pointInCircle(-1, -3, 2, 3, 4) ).toBe(false);
  });

  it('(1.9,-6.8) is outside circle at (2,3) with r=4', () => {
    expect( circleUtils.pointInCircle(-1.0, -6.9, 2, 3, 4) ).toBe(false);
  });

  it('(4,4) is inside circle at (2,3) with r=4', () => {
    expect( circleUtils.pointInCircle(4, 4, 2, 3, 4) ).toBe(true);
  });

  it('(0,1) is inside circle at (2,3) with r=4', () => {
    expect( circleUtils.pointInCircle(0, 1, 2, 3, 4) ).toBe(true);
  });

  it('(-1,-0.5) is inside circle at (2,3) with r=4', () => {
    expect( circleUtils.pointInCircle(-1, 0.5, 2, 3, 4) ).toBe(true);
  });

  it('(1,-0.4) is inside circle at (2,3) with r=4', () => {
    expect( circleUtils.pointInCircle(1, -0.4, 2, 3, 4) ).toBe(true);
  });

  it('(.25,.25) is inside circle at (0,0) with r=0.5', () => {
    expect( circleUtils.pointInCircle(0.25, 0.25, 0, 0, 0.5) ).toBe(true);
  });

});

describe('Interval Bisection', () => {

  it('returns no root for a = b', () => {
    const f: FcnEval             = (x: number): number => {return 2.0*x};
    const result: BisectInterval = bisect(1, 1, f) as BisectInterval;
    expect(result.root).toBe(false);
  });

  it('returns no root when there is no real root in [a,b]', () => {
    const f: FcnEval             = (x: number): number => {return x*x - 4.0};
    const result: BisectInterval = bisect(-10, -5, f) as BisectInterval;
    expect(result.root).toBe(false);
  });

  it('located roote in right interval', () => {
    const f: FcnEval             = (x: number): number => {return x*x - 4.0};
    const result: BisectInterval = bisect(-10, -1, f) as BisectInterval;

    expect(result.root).toBe(true);
    expect(result.left >= -10).toBe(true);
    expect(result.right <= -1).toBe(true);
  });

  it('brackets a single root in a dual-root interval', () => {
    const f: FcnEval             = (x: number): number => {return x*x - 4.0};
    const result: BisectInterval = bisect(-8, 8, f) as BisectInterval;
    expect(result.root).toBe(true);
  });

  it('brackets a root of a cubic polynomial', () => {
    // 4*x^3 -3*x^2 -25*x -6
    // roots at 3, -0.25, and -2

    const f: FcnEval           = (x: number): number => {return -6 + x*(-25 + x*(-3 + x*4))};
    let result: BisectInterval = bisect(2, 5, f) as BisectInterval;
    expect(result.root).toBe(true);

    result = bisect(-10, 0, f) as BisectInterval;
    expect(result['root']).toBe(true);
  });
});

describe('Linear Interpolation', () => {

  const interp: LinearInterpolation = new LinearInterpolation();

  it('is returns zero after construction and 0 x-value', () => {
    expect(interp.interpolate(0)).toBe(0);
  });

  it('works for any x-interval and default y-values', () => {
    interp.x1 = -1;
    interp.x2 = 1;
    expect(interp.interpolate(0)).toBe(0);

    interp.x1 = -2;
    interp.x2 = 2;
    expect(interp.interpolate(0)).toBe(0);
  });

  it('works for coincident points', () => {
    interp.x1 = -1;
    interp.x2 = 1;
    interp.y1 = -1;
    interp.y2 = 1;

    expect(interp.interpolate(-1)).toBe(-1);
    expect(interp.interpolate(1)).toBe(1);
  });

  it('works for reversed interval', () => {
    interp.x1 = 2;
    interp.x2 = -2;
    interp.y1 = -7;
    interp.y2 = 7;

    expect(interp.interpolate(-2)).toBe(-7);
    expect(interp.interpolate(2)).toBe(7);
  });

  it('correctly returns endpoints', () => {
    interp.x1 = -3;
    interp.x2 = 2;
    interp.y1 = 4;
    interp.y2 = 6;

    expect(Math.abs(interp.interpolate(-3) - 4)).toBeLessThan(0.000001);
    expect(Math.abs(interp.interpolate(2) - 6)).toBeLessThan(0.000001);
  });

  it('works with vertical line', () => {
    interp.x1 = 3;
    interp.x2 = 3;
    interp.y1 = 4;
    interp.y2 = 100;

    expect(Math.abs(interp.interpolate(3) - 4)).toBeLessThan(0.000001);
  });

  it('correctly interpolates', () => {
    interp.x1 = 1;
    interp.x2 = 2;
    interp.y1 = 3;
    interp.y2 = 4;

    expect(Math.abs(interp.interpolate(1.5) - 3.5)).toBeLessThan(0.000001);
  });

  it('allows extrapolation', () => {
    interp.x1 = 1;
    interp.x2 = 2;
    interp.y1 = 3;
    interp.y2 = 4;

    expect(Math.abs(interp.interpolate(3) - 5)).toBeLessThan(0.000001);
    expect(Math.abs(interp.interpolate(0) - 2)).toBeLessThan(0.000001);
  });
});

describe('Balanced open/close chars', () => {

  const tmp: any = null;
  it('returns false for null input', function () {
    const result: boolean = isBalanced(tmp);

    expect(result).toBe(false);
  });


  it('returns true for empty string', function () {
    const result: boolean = isBalanced('');

    expect(result).toBe(true);
  });

  it('returns true for string with no open/close chars', function () {
    const result: boolean = isBalanced('abcde');

    expect(result).toBe(true);
  });

  it('returns false for one open char only', function () {
    const result: boolean = isBalanced('abc(de');

    expect(result).toBe(false);
  });

  it('returns false for one close char only', function () {
    const result: boolean = isBalanced('abcde)');

    expect(result).toBe(false);
  });

  it('returns false for reversed open/close', function () {
    const result: boolean = isBalanced(')abcde(');

    expect(result).toBe(false);
  });

  it('returns false for imbalance #1', function () {
    const result: boolean = isBalanced('<abcd<e>');

    expect(result).toBe(false);
  });

  it('returns false for imbalance #2', function () {
    const result: boolean = isBalanced('{abc(de}');

    expect(result).toBe(false);
  });

  it('returns false for imbalance #3', function () {
    const result: boolean = isBalanced('{a[[bc]de}');

    expect(result).toBe(false);
  });

  it('returns false for imbalance #4', function () {
    const result: boolean = isBalanced('{a[bc]]de}');

    expect(result).toBe(false);
  });

  it('balance test #1', function () {
    const result: boolean = isBalanced('{}');

    expect(result).toBe(true);
  });

  it('balance test #2', function () {
    const result: boolean = isBalanced('(ab) * c');

    expect(result).toBe(true);
  });

  it('balance test #3', function () {
    const result: boolean = isBalanced('{(ab) * c}');

    expect(result).toBe(true);
  });

  it('balance test #4', function () {
    const result: boolean = isBalanced('f(a,b) = 2*(c+d)');

    expect(result).toBe(true);
  });
});
