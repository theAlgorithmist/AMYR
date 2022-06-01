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
 * AMYR Library: Low-level, utils string utility functions (probably similar to many you have seen
 * elsewhere as there really isn't anything new under the sun).  These methods are optimized for reasonable
 * performance and there is little error checking.  You break it ... you buy it.  Some methods are direct
 * replacement for lodash equivalents.
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */
export const WHITESPACE: Array<string> = [ ' ', '\n', '\r', '\t', '\f', '\v', '\u00A0', '\u1680', '\u180E', '\u2000',
  '\u2001', '\u2002', '\u2003', '\u2004', '\u2005', '\u2006', '\u2007', '\u2008',
  '\u2009', '\u200A', '\u2028', '\u2029', '\u202F', '\u205F', '\u3000'
];

 /**
  * Determine if an input string starts exactly with the specified char string (case matters)
  *
  * @param {string} input Input string
  *
  * @param {string} target string to check against
  * @default 0
  */
  export function startsWith(input: string, target: string, position: number = 0): boolean
  {
    const length: number = input.length || 0;
    if (!input || !target ) return false;

    // relatively quick string-convert
    target = `${target}`;

    const n: number = target.length;
    if (length == 0 && n == 0) {
      return true;
    }

    position = position < 0 ? 0 : (position >= length ? length-1 : position);

    return input.slice(position, position + n) === target
  }

 /**
  * Capitalize the first letter of a string and convert all remaining characters to lowercase
  *
  * @param {string} input String to be capitalized
  */
  export function capitalize(input: string): string
  {
    const n: number = input.length;
    if (n === 0) return input;

    if (n === 1) return input.toUpperCase();

    return input.charAt(0).toUpperCase() + (input.substr(1, n)).toLowerCase();
  }

 /**
  * Quick trim of spaces from a string
  *
  * @param {string} inputInput string
  */
  export function trim(input: string): string
  {
    return input.replace(/ /g, '');
  }

 /**
  * Remove selected whitepsace characters from the beginning of a string
  *
  * @param {string} input Input string
  *
  * @param {Array<string>} white List of whitespace characters to be removed
  * @default {WHITESPACE}
  */
  export function leftTrim(input: string, chars: Array<string> = WHITESPACE): string
  {
    let start              = 0;
    const len: number      = input.length;
    const whiteLen: number = chars.length;
    let found              = true;

    let i: number;
    let char: string;

    while (found && start < len)
    {
      found = false;
      i     = -1;
      char  = input.charAt(start);

      while (++i < whiteLen)
      {
        if (char === chars[i])
        {
          found = true;
          start++;
          break;
        }
      }
    }

    return (start >= len) ? '' : input.substr(start, len);
  }

 /**
  * Remove selected whitespace characters from the end of a string
  *
  * @param {string} input Input string
  *
  * @param {Array<string>} white List of whitespace characters to be removed
  * @default {WHITESPACE}
  */
  export function rightTrim(input: string, chars: Array<string> = WHITESPACE): string
  {
    const len: number      = input.length;
    let end: number        = len-1;
    const whiteLen: number = chars.length;
    let found              = true;

    let i: number;
    let char: string;

    while (found && end >= 0)
    {
      found = false;
      i     = -1;
      char  = input.charAt(end);

      while (++i < whiteLen)
      {
        if (char === chars[i])
        {
          found = true;
          end--;
          break;
        }
      }
    }

    return (end >= 0) ? input.substr(0, end+1) : '';
  }

 /**
  * Trim whitespace from beginning and end of a string based on a list of whitespace characters
  * (that may include line feeds and such)
  *
  * @param {string} input Input string
  *
  * @param {Array<string>} chars List of 'whitespace' characters to remove
  * @default {WHITESPACE}
  */
  export function trimEnds(input: string, chars: Array<string> = WHITESPACE): string
  {
    return leftTrim(rightTrim(input, chars), chars);
  }

 /**
  * Trim a string at the nearest (previous) space based on a character count with optional insertion of ellipses.
  * Original string is trimmed at nearest previous space, i.e. 'This is a test' is trimmed to 'This is a'
  * with a character count greater than nine or 'This is a...' if the ellipses parameter is true.
  *
  * @param input : input string
  *
  * @param count : number - Character count for trimming (must be greater than zero)
  *
  * @param ellipses: boolean If true, insert ellipses (...) after trip
  * @default {false}
  */
  export function trimToCharCount(input: string, count: number, ellipses: boolean = false): string
  {
    count = Math.max(1, Math.round(count));

    const len: number = input.length;
    if (len < count) return input;

    if (input === ' ') return '';

    let char: string = input.charAt(count-1);
    let end: number  = count-1;

    while (end >= 0)
    {
      char = input.charAt(end--);
      if (char === ' ') break;
    }

    end = end < 0 ? count-1 : end;

    // add ellipses?
    return ellipses ? input.substring(0,end+1) + '...' : input.substring(0, end+1);
  }

 /**
  * Left-pad a string with a specified character if its length is smaller than the specified value
  *
  * @param {string} input Input string
  *
  * @param {number} len minimum length (must be greater than zero)
  *
  * @param {string} replaceWith: string Replacement string
  * @default ' ' (single space)
  */
  export function leftPad(input: string, len: number, replaceWith: string = ' '): string
  {
    len = Math.max(1, Math.round(len));
    return ((input.length < len) ? repeat(replaceWith, len - input.length) + input : input);
  }

 /**
  * Right-pad a string with a specified character if its length is smaller than the specified value
  *
  * @param {string} input Input string
  *
  * @param {number} len minimum length (must be greater than zero)
  *
  * @param {string} replaceWith Replacement string
  * @default ' ' (single space)
  */
  export function rightPad(input: string, len: number, replaceWith: string = ' '): string
  {
    len = Math.max(1, Math.round(len));
    return (input.length < len) ? input + repeat(replaceWith, len - input.length) : input;
  }

 /**
  * Repeat a string specified number of times
  *
  * @param {string} input Input string
  *
  * @param {number} n Repeat count (must be greater than zero)
  */
  export function repeat(input: string, n: number): string
  {
    n = Math.max(1, Math.round(n));
    return (new Array(n + 1)).join(input);
  }

 /**
  * Escape a string to prepare for DOM insertion
  *
  * @param {string} input Input string with characters that require escaping before dynamic placement into DOM elements
  */
  export function toHtml(input: string): string
  {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

 /**
  * Unescape HTML special characters (reverse of toHtml)
  *
  * @param {string} input Input string containing html-escaped characters
  */
  export function fromHtml(input: string): string
  {
    return input
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  }

 /**
  * Return the first non-repeating character in a string or a null string if all characters are unique
  *
  * @param {string} input Input string
  */
  export function firstNonrepeatingChar(input: string): string
   {
     if (input == '') return '';

     // this algorithm tends to run reasonably fast in practice, although complexity is still O(n^2).
     const len: number = input.length;
     let i: number
     let char = '';

     for (i = 0; i < len; ++i)
     {
       char = input.charAt(i);

       if (input.indexOf(char) == i && input.indexOf(char,i+1) == -1) {
         return char;
       }
     }

     return '';
   }

 /**
  * Reverse characters in a string
  *
  * @param {string} input Input string
  */
  export function reverseChars(input: string): string
  {
    return input.split('').reverse().join('');
  }

 /**
  * Convert an input string (presumed to be a name) into uppercase initials with an optional delimiter, i.e.
  * james tiberius kirk -> JTK or J.T.K.
  *
  * @param {string} input Input string
  */
  export function initials(input: string, delim: string=''): string
  {
    return input.split(' ').map( (n:string): string => {return n.charAt(0).toUpperCase()} ).join(delim);
  }

 /**
  * Count the number of words in a string.
  *
  * @param {string} input Input string
  */
  export function wordCount(input: string): number
  {
    if (input === undefined || input == null) return 0;

    if (input == '' || input == ' ') return 0;

    const matcher: RegExpMatchArray | null = input.match(/\b\w+\b/g);
    return matcher != null ? matcher.length : 0;
  }

 /**
  * Remove all instances of the input substring from the supplied  string.
  *
  * @param {string} input Input string
  *
  * @param {string} remove Substring to be removed
  *
  * @param {boolean} caseSensitive Indicate if replacement is case sensitive.
  * @edefault {true}
  */
  export function remove(input: string, remove: string, caseSensitive: boolean=true): string
  {
    if (input === undefined || input == null) return '';

    if (input == '' || input == ' ') return input;

    const rem: string   = __pattern(remove);
    const flags: string = (!caseSensitive) ? 'ig' : 'g';

    return input.replace(new RegExp(rem, flags), '');
  }

 /**
  * Is the input string numeric?
  *
  * @param {string} input Input string
  */
  export function isNumeric(input: string): boolean
  {
    if (input === undefined && input == null) return false;

    if (input == '' || input == ' ') return false;

    // ha ha - another one I looked up on stackoverflow!
    const regex = /^[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?$/;

    return regex.test(input);
  }

  export function __pattern(pattern: string): string
  {
    // of course I ripped this from stackoverflow ... what did you expect?
    return pattern.replace(/(\]|\[|\{|\}|\(|\)|\*|\+|\?|\.|\\)/g, '\\$1');
  }
