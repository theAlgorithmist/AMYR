/* eslint-disable no-constant-condition */
/** 
 * Copyright 2021 Jim Armstrong
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

export const WORD_TERMINATOR = '#';
export const PLACEHOLDER     = '?';

export const DEFAULT_ALPHABET: Record<string, number> =
  {
    'a': 2,
    'b': 3,
    'c': 4,
    'd': 5,
    'e': 6,
    'f': 7,
    'g': 8,
    'h': 9,
    'i': 10,
    'j': 11,
    'k': 12,
    'l': 13,
    'm': 14,
    'n': 15,
    'o': 16,
    'p': 17,
    'q': 18,
    'r': 10,
    's': 20,
    't': 21,
    'u': 22,
    'v': 23,
    'w': 24,
    'x': 25,
    'y': 26,
    'z': 27,
  };

DEFAULT_ALPHABET[WORD_TERMINATOR] = 1;

/**
 * Typescript Math Toolkit: A rudimentary implementation of a double-array Trie as described in [1].  Many of the references
 * in the open literature (see [2]) use one-based indexing to illustrate the DA Trie construction.  This practice is accommodated
 * in the current implementation.  Conversion to zero-based array indexing occurs just before accessing array elements.
 * <br/>
 * <br/>
 * References:
 * <br/>
 * <br/>
 * [1] Aho, Alfred V.; Corasick, Margaret J. (June 1975). "Efficient string matching: An aid to bibliographic search".
 * Communications of the ACM. 18 (6): 333–340. doi:10.1145/360825.360855. MR 0371172.
 * <br/>
 * <br/>
 * [2] Aoe, Jun-ichi, Morimoto, Katsushi, "An Efficient Implementation of Trie Structures", SOFTWARE—PRACTICE AND EXPERIENCE,
 * VOL. 22(9), 695–721 (SEPTEMBER 1992)
 * <br/>
 * <br/>
 * Knuth, D.E., "The Art of Computer Programming", Vol. I, Fundamental Algorithms, pp. 295–304; Vol. III, Sorting and Searching,
 * pp. 481–505, Addison-Wesley, Reading, Mass., 1973.
 * <br/>
 * <br/>
 * Note that this implementation most closely follows reference [2]
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 * 
 * @version 1.0
 */

export class TSMT$Trie
{
  // the alphabet - character is key and unique index or code is the value; value doubles as array index
  protected _alphabet: Record<string, number>;

  // convert the alphabet to an array where characters can be looked up in O(1) by their code
  protected _toArray: Array<string>;

  // base, check, tail, and position are the same as in references [1] and [2]
  protected _base: Array<number>;
  protected _check: Array<number>;
  protected _tail: Array<string>;

  protected _position: number;

  /**
   * Construct a new Trie
   *
   * @param {Record<string, number>} alphabet Character and unique code collection that represents the alphabet used by the Trie
   */
  constructor(alphabet?: Record<string, number>)
  {
    if (alphabet === undefined || alphabet == null)
    {
      this._alphabet = JSON.parse(JSON.stringify(DEFAULT_ALPHABET));
    }
    else
    {
      this._alphabet = JSON.parse(JSON.stringify(alphabet['length'] > 0 ? alphabet : DEFAULT_ALPHABET));
    }

    this._base    = [1];
    this._check   = [0];
    this._tail    = [];
    this._toArray = [];

    this._position = 1;

    this.__alphabetToArray(this._alphabet);
  }

  /**
   * Access the length or number of characters in the alphabet used to initialize the Trie
   */
  public get alphabetLength(): number
  {
    return Object.keys(this._alphabet).length;
  }

  /**
   * Access the current position index
   */
  public get position(): number
  {
    return this._position;
  }

  /**
   * Access a copy of the base (index) array; can be used for studying the internals of the algorithm
   */
  public get base(): Array<number>
  {
    return this._base.slice();
  }

  /**
   * Access a copy of the check (index) array; can be used for studying the internals of the algorithm
   */
  public get check(): Array<number>
  {
    return this._check.slice();
  }

  /**
   * Access a copy of the tail string collection (leaves in the Trie)
   */
  public get tail(): Array<string>
  {
    return this._tail.slice();
  }

  /**
   * Access a character of the alphabet given an index or code
   *
   * @param {number} index Unique code for the character in the alphabet
   */
  public getCharacter(index: number): string
  {
    if (index >= 0 && index < this._toArray.length) return this._toArray[index];

    return '';
  }

  /**
   * Assign external state; can be used to initialize the Trie from a prior state
   *
   * @param {Array<number>} base Base array
   * @param {Array<number>} check Check Array
   * @param {Array<string>} tail Tail array
   * @param {number} position Position index
   */
  public setState(base: Array<number>, check: Array<number>, tail: Array<string>, position: number): void
  {
    this._base = base !== undefined && base.length > 0
      ? base.slice()
      : this._base;

    this._check = check !== undefined && check.length > 0
      ? check.slice()
      : this._check;

    this._tail = tail !== undefined && tail.length > 0
      ? tail.slice()
      : this._tail;

    this._position = !isNaN(position) ? position : this._position;
  }

  /**
   * Clear the Trie and prepare for a new dictionary (using the same alphabet)
   */
  public clear(): void
  {
    this._base     = [1];
    this._check    = [0];
    this._tail     = [];
    this._position = 1;
  }

  /**
   * Does the Trie contain a given word?
   *
   * @param {string} word Test if the Trie contains this word in its entirety
   */
  public contains(word: string): boolean
  {
    const characters: Array<string> = word.split('');
    const len: number               = characters.length;

    if (len === 0) return false;

    let n = 1;
    let i: number;
    let index = -1;
    let m     = -1;

    for (i = 0; i < len; ++i)
    {
      index = i;
      m     = this.__getBaseAtPosition(n) + Number(this.__alphabetCode(characters[i]));

      if (this.__getCheckAtPosition(m) !== n) {
        return false;
      }

      if (this.__getBaseAtPosition(m) < 0) break;

      n = m;
    }

    // add the terminator since comparing vs the tail str
    characters.push(WORD_TERMINATOR);

    // either made it to the end or the remainder of the word is in the tail
    return index === characters.length || this.__tailStrEquals(-this.__getBaseAtPosition(m), characters, index+1);
  }

  /**
   * Insert a single word from a dictionary into the Trie
   *
   * @param {string} word Word to be inserted into the Trie
   */
  public insert(word: string): void
  {
    if (word === undefined || word === '') return;

    const letters: Array<string> = word.split('');
    letters.push(WORD_TERMINATOR);

    const n: number = letters.length;

    if (n === 0) return;

    let p = 1;
    let q = -1;
    let index = -1;
    let cq: number;
    let i: number;

    for (i = 0; i < n; ++i)
    {
      index = i;

      q  = this.__getBaseAtPosition(p) + Number(this.__alphabetCode(letters[i]));
      cq = this.__getCheckAtPosition(q);

      if (cq !== p)
      {
        if (cq !== 0)
        {
          this.__resetBase(p, q, letters, i)
        }
        else
        {
          this.__setBaseAtPosition(q, -this._position);
          this.__setCheckAtPosition(q, p);
          this.__toTail(letters, this._position, i);
        }

        return;
      }

      if (this.__getBaseAtPosition(q) < 0) break;

      p = q;
    }

    // if not at end of word, must add to tail
    const base: number = this.__getBaseAtPosition(q);
    if (letters[index] === WORD_TERMINATOR || this.__tailStrEquals(-base, letters, index+1)) {
      return;
    }

    if (base !== 0) this.__insertAtTail(q, -base, letters, index+1)
  }

  /**
   * Remove a word from the Trie
   *
   * @param {string} word Word to be removed from the Trie (may leave some old tail strings intact)
   */
  public remove(word: string): void
  {
    if (word === undefined || word == null || word == '') return;

    const characters: Array<string> = word.split('');
    characters.push(WORD_TERMINATOR);

    const len: number = characters.length;

    if (len === 0) return;

    let i: number;
    let m     = -1;
    let index = -1;

    let n = 1;

    for (i = 0; i < len; ++i)
    {
      index = i;
      m     = this.__getBaseAtPosition(n) + Number(this.__alphabetCode(characters[i]));

      if (this.__getBaseAtPosition(m) < 0) break;

      n = m;
    }

    if (characters[index] === WORD_TERMINATOR || this.__tailStrEquals(-this.__getBaseAtPosition(m), characters, index+1))
    {
      this.__setBaseAtPosition(m, 0);
      this.__setCheckAtPosition(m, 0);
    }
  }

  protected __alphabetCode(char: string): number | null
  {
    return this._alphabet[char] !== undefined
      ? this._alphabet[char]
      : null;
  }

  protected __alphabetToArray(alphabet: Record<string, number>): void
  {
    // first pass, max-index
    const values: Array<number> = Object.values(alphabet);
    let max = -1;

    values.forEach( (value: number): void => {
      max = Math.max(max, value);
    });

    this._toArray.length = 0;
    let i: number;

    for (i = 0; i < max; ++i) {
      this._toArray.push('');
    }

    // treat coded value as array index
    Object.keys(alphabet).forEach( (key: string): void => {
      this._toArray[alphabet[key]] = key;
    });
  }

  protected __arcs(code: number): Array<number> // findArcs
  {
    const arcValues: Array<number> = new Array<number>();

    Object.keys(this._alphabet).forEach ( (char: string): void =>
    {
      const alpha: number = this.__alphabetCode(char) as number;
      if (this.__getCheckAtPosition(this.__getBaseAtPosition(code) + alpha) === code) {
        arcValues.push(alpha);
      }
    });

    return arcValues;
  }

  // X_CHECK in [2]
  protected __crossCheck(indexList: Array<number>): number
  {
    const n: number = indexList.length;

    let i: number;
    let indx     = 1;  // q
    let finished = false;

    while (true)
    {
      finished = false;

      for (i = 0; i < n; ++i)
      {
        finished = this.__getCheckAtPosition(indx + indexList[i]) !== 0;

        if (finished) break;
      }

      if (!finished) break;
      indx++;
    }

    return indx;
  }

  protected __getBaseAtPosition(position: number): number
  {
    return this._base[position-1] !== undefined ? this._base[position - 1] : 0;
  }

  protected __setBaseAtPosition(position: number, value: number): void
  {
    if (position > 0) this._base[position - 1] = value;
  }

  protected __getCheckAtPosition(position: number): number
  {
    return this._check[position-1] !== undefined ? this._check[position - 1] : 0;
  }

  // TAIL_INSERT in [2]
  protected __insertAtTail(n: number, position: number, characters: Array<string>, index: number): void
  {
    const base: number = -this.__getBaseAtPosition(n);

    let i: number;
    let k: number;
    let j         = 0;
    let m: number = n;

    let tailCode: number;
    let charCode: number;
    let mBase: number;

    for (i = position-1; i < this._tail.length; ++i)
    {
      tailCode = this.__alphabetCode(this._tail[i]) as number;
      charCode = this.__alphabetCode(characters[index+j]) as number;
      mBase    = this.__getBaseAtPosition(m);

      if (tailCode === charCode)
      {
        mBase = this.__crossCheck([tailCode]);

        this.__setBaseAtPosition(m, mBase);
        this.__setCheckAtPosition(mBase+tailCode, m);

        m = mBase + tailCode;
      }
      else
      {
        mBase = this.__crossCheck([tailCode, charCode]);

        this.__setBaseAtPosition(m, mBase);

        k = mBase + tailCode;

        this.__setBaseAtPosition(k, -base);
        this.__setCheckAtPosition(k, m);
        this.__toTail(this._tail, base, i);

        k               = mBase + charCode;
        const l: number = index+i > characters.length ? index+j : index+i;

        this.__setBaseAtPosition(k, -this._position);
        this.__setCheckAtPosition(k, m);
        this.__toTail(characters, this._position, l);

        break;
      }

      if (this._tail[i] === WORD_TERMINATOR) break;

      j++;
    }
  }

  // CHANGE_BC in [2]
  protected __resetBase(n: number, m: number, characters: Array<string>, index: number): void
  {
    let node1 = -1;
    let node2 = -1;

    const list1: Array<number> = this.__arcs(n);
    const list2: Array<number> = this.__arcs(this.__getCheckAtPosition(m));

    const compare: boolean = list1.length + 1 < list2.length;

    const nodeValue: number   = compare ? n : this.__getCheckAtPosition(m);
    const list: Array<number> = compare ? list1 : list2;
    const len: number         = list.length;

    if (len === 0) return;

    let base: number = this.__getBaseAtPosition(nodeValue);

    this.__setBaseAtPosition(nodeValue, this.__crossCheck(list));

    let i: number;
    let j: number;

    for (i = 0; i < len; ++i)
    {
      node1 = base + list[i];
      node2 = this.__getBaseAtPosition(nodeValue) + list[i];

      this.__setBaseAtPosition(node2, this.__getBaseAtPosition(node1));
      this.__setCheckAtPosition(node2, nodeValue);

      if (this.__getBaseAtPosition(node1) > 0)
      {
        j = 1;

        while (j < this._check.length)
        {
          const k: number = this.__getBaseAtPosition(node1) + j;

          if (this.__getCheckAtPosition(k) === node1) {
            this.__setCheckAtPosition(k, node2);
          }

          j++;
        }
      }
    }

    if (node1 !== n) {
      node2 = n;
    }

    this.__setBaseAtPosition(node1, 0);
    this.__setCheckAtPosition(node1, 0);

    base = this.__getBaseAtPosition(node2) + (this.__alphabetCode(characters[index]) as number);
    this.__setBaseAtPosition(base, -this._position);
    this.__setCheckAtPosition(base, node2);

    this.__toTail(characters, this._position, index);
  }

  protected __setCheckAtPosition(position: number, value: number): void
  {
    if (position > 0 ) this._check[position - 1] = value;
  }

  // Write Tail in [2]
  protected __toTail(str: Array<string>, strPosition: number, tailPosition: number): void
  {
    const n: number = str.length;

    let i: number;
    let j = 0;

    for (i = tailPosition+1; i < n; ++i)
    {
      this._tail[strPosition - 1 + j] = str[i];

      if (str[i] === WORD_TERMINATOR) break;

      j++;
    }

    // update internal position
    this._position = strPosition + j + 1 > this._position
      ? strPosition + j + 1
      : this._position;
  }

  protected __tailStrEquals(index: number, str: Array<string>, position: number): boolean
  {
    // quick test for false
    let i: number;
    let j = 0;

    for (i = index-1; i < this._tail.length; ++i)
    {
      if (this._tail[i] !== str[position + j]) return false;

      if (this._tail[i] === WORD_TERMINATOR) break;

      j++;
    }

    return true;
  }
}
