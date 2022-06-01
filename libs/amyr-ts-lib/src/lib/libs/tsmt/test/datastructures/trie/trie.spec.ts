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

// Specs for various alpha release of Typescript Math Toolkit stack
import {
  TSMT$Trie,
  WORD_TERMINATOR,
  PLACEHOLDER
} from '../../../datastructures/trie';

// Test Suites
describe('Trie Tests', () => {

  const trie: TSMT$Trie = new TSMT$Trie();

  it('correctly constructs a default Trie', function() {
    expect(trie.alphabetLength).toEqual(27);
    expect(trie.base.length).toEqual(1);
    expect(trie.base[0]).toEqual(1);
    expect(trie.check.length).toEqual(1);
    expect(trie.check[0]).toEqual(0);
    expect(trie.tail.length).toEqual(0);
  });


  it('correctly extracts character from an encoded value', function() {
    expect(trie.getCharacter(2)).toBe('a');
    expect(trie.getCharacter(16)).toBe('o');
    expect(trie.getCharacter(27)).toBe('z');
    expect(trie.getCharacter(-1)).toBe('');
    expect(trie.getCharacter(100)).toBe('');
  });

  it('correctly assigns initial state', function() {
    // a classic :)
    const base: Array<number>  = [4, 0, 1, -15, -1, -12, 1, 0, 0, 0, 0, 0, 0, 0, -9];
    const check: Array<number> = [0, 0, 7,   3,  3,   3, 1, 0, 0, 0, 0, 0, 0, 0, 1];
    const tail: Array<string>  = [
      'h', 'e', 'l', 'o', 'r', WORD_TERMINATOR,
      PLACEHOLDER,
      PLACEHOLDER,
      'a', 'r', WORD_TERMINATOR,
      'g', 'e', WORD_TERMINATOR,
      'y', WORD_TERMINATOR
    ];

    trie.setState(base, check, tail, 17);

    expect(trie.base.length).toEqual(15);
    expect(trie.check.length).toEqual(15);
    expect(trie.tail.length).toEqual(16);
    expect(trie.position).toEqual(17);
  });

  it('checks if trie contains a word', function() {
    // a classic :)
    const base: Array<number>  = [4, 0, 1, -15, -1, -12, 1, 0, 0, 0, 0, 0, 0, 0, -9];
    const check: Array<number> = [0, 0, 7,   3,  3,   3, 1, 0, 0, 0, 0, 0, 0, 0, 1 ];
    const tail: Array<string>  = [
      'h', 'e', 'l', 'o', 'r', WORD_TERMINATOR,
      PLACEHOLDER,
      PLACEHOLDER,
      'a', 'r', WORD_TERMINATOR,
      'g', 'e', WORD_TERMINATOR,
      'y', WORD_TERMINATOR
    ];

    trie.setState(base, check, tail, 17);

    expect(trie.contains('bachelor')).toBe(true);
    expect(trie.contains('badge')).toBe(true);
    expect(trie.contains('baby')).toBe(true);
    expect(trie.contains('jar')).toBe(true);
    expect(trie.contains('boba')).toBe(false);
    expect(trie.contains('fett')).toBe(false);
  });


  it('single-word insert (after clear)', function() {
    trie.clear();

    // single node and a tail list
    trie.insert('bachelor');
    const base: Array<number> = trie.base;
    const check: Array<number> = trie.check;
    const tail: Array<string> = trie.tail;

    expect(base.length).toEqual(4);
    expect(base[0]).toEqual(1);
    expect(base[3]).toEqual(-1);

    expect(check.length).toEqual(4);
    expect(check[0]).toEqual(0);
    expect(check[3]).toEqual(1);

    expect(tail.length).toEqual(8);
    expect(tail[0]).toBe('a');
    expect(tail[1]).toBe('c');
    expect(tail[2]).toBe('h');
    expect(tail[3]).toBe('e');
    expect(tail[4]).toBe('l');
    expect(tail[5]).toBe('o');
    expect(tail[6]).toBe('r');
    expect(tail[7]).toBe(WORD_TERMINATOR)
  });

  it('single-word insert #2', function() {
    trie.clear();

    // single node and a tail list; should be more empty space
    trie.insert('jar');
    const base: Array<number>   = trie.base;
    const check: Array< number> = trie.check;
    const tail: Array<string>   = trie.tail;

    expect(base.length).toEqual(12);
    expect(base[0]).toEqual(1);
    expect(base[11]).toEqual(-1);

    expect(check.length).toEqual(12);
    expect(check[0]).toEqual(0);
    expect(check[11]).toEqual(1);

    expect(tail.length).toEqual(3);
    expect(tail[0]).toBe('a');
    expect(tail[1]).toBe('r');
    expect(tail[2]).toBe(WORD_TERMINATOR);
  });

  it('repeated word insert check', function() {
    trie.clear();

    trie.insert('bachelor');
    trie.insert('bachelor');

    const base: Array<number>   = trie.base;
    const check: Array< number> = trie.check;
    const tail: Array<string>   = trie.tail;

    expect(base.length).toEqual(4);
    expect(base[0]).toEqual(1);
    expect(base[3]).toEqual(-1);

    expect(check.length).toEqual(4);
    expect(check[0]).toEqual(0);
    expect(check[3]).toEqual(1);

    expect(tail.length).toEqual(8);
    expect(tail[0]).toBe('a');
    expect(tail[1]).toBe('c');
    expect(tail[2]).toBe('h');
    expect(tail[3]).toBe('e');
    expect(tail[4]).toBe('l');
    expect(tail[5]).toBe('o');
    expect(tail[6]).toBe('r');
    expect(tail[7]).toBe(WORD_TERMINATOR);
  });

  it('two-word insert test', function() {
    trie.clear();

    trie.insert('bachelor');
    trie.insert('jar');

    const base: Array<number>   = trie.base;
    const check: Array< number> = trie.check;
    const tail: Array<string>   = trie.tail;

    expect(base.length).toEqual(12);
    expect(base[0]).toEqual(1);
    expect(base[3]).toEqual(-1);
    expect(base[11]).toEqual(-9);

    expect(check.length).toEqual(12);
    expect(check[0]).toEqual(0);
    expect(check[3]).toEqual(1);
    expect(check[11]).toEqual(1);

    expect(tail.length).toEqual(11);
    expect(tail[0]).toBe('a');
    expect(tail[1]).toBe('c');
    expect(tail[2]).toBe('h');
    expect(tail[3]).toBe('e');
    expect(tail[4]).toBe('l');
    expect(tail[5]).toBe('o');
    expect(tail[6]).toBe('r');
    expect(tail[7]).toBe(WORD_TERMINATOR);

    expect(tail[8]).toBe('a');
    expect(tail[9]).toBe('r');
    expect(tail[10]).toBe(WORD_TERMINATOR);
  });

  it('multi-word insert #1', function() {
    trie.clear();

    trie.insert('bachelor');
    trie.insert('jar');
    trie.insert('badge');

    const base: Array<number>   = trie.base;
    const check: Array< number> = trie.check;
    const tail: Array<string>   = trie.tail;

    expect(base.length).toEqual(12);
    expect(base[0]).toEqual(1);
    expect(base[2]).toEqual(1);
    expect(base[3]).toEqual(1);
    expect(base[4]).toEqual(-1);
    expect(base[5]).toEqual(-12);
    expect(base[11]).toEqual(-9);

    expect(check.length).toEqual(12);
    expect(check[0]).toEqual(0);
    expect(check[2]).toEqual(4);
    expect(check[3]).toEqual(1);
    expect(check[4]).toEqual(3);
    expect(check[5]).toEqual(3);
    expect(check[11]).toEqual(1);

    expect(tail.length).toEqual(14);
    expect(tail[0]).toBe('h');
    expect(tail[1]).toBe('e');
    expect(tail[2]).toBe('l');
    expect(tail[3]).toBe('o');
    expect(tail[4]).toBe('r');
    expect(tail[5]).toBe(WORD_TERMINATOR)

    expect(tail[6]).toBe('r');
    expect(tail[7]).toBe(WORD_TERMINATOR);

    expect(tail[8]).toBe('a');
    expect(tail[9]).toBe('r');
    expect(tail[10]).toBe(WORD_TERMINATOR)

    expect(tail[11]).toBe('g');
    expect(tail[12]).toBe('e');
    expect(tail[13]).toBe(WORD_TERMINATOR);
  });

  it('multi-word insert #2', function() {
    trie.clear();

    trie.insert('bachelor');
    trie.insert('jar');
    trie.insert('badge');
    trie.insert('baby');

    const base: Array<number>   = trie.base;
    const check: Array< number> = trie.check;
    const tail: Array<string>   = trie.tail;

    expect(base.length).toEqual(15);
    expect(base[0]).toEqual(4);
    expect(base[2]).toEqual(1);
    expect(base[3]).toEqual(-15);
    expect(base[4]).toEqual(-1);
    expect(base[5]).toEqual(-12);
    expect(base[6]).toEqual(1);
    expect(base[11]).toEqual(0);
    expect(base[14]).toEqual(-9);

    expect(check.length).toEqual(15);
    expect(check[0]).toEqual(0);
    expect(check[2]).toEqual(7);
    expect(check[3]).toEqual(3);
    expect(check[4]).toEqual(3);
    expect(check[5]).toEqual(3);
    expect(check[6]).toEqual(1);
    expect(check[11]).toEqual(0);
    expect(check[14]).toEqual(1);

    expect(tail.length).toEqual(16);
    expect(tail[0]).toBe('h');
    expect(tail[1]).toBe('e');
    expect(tail[2]).toBe('l');
    expect(tail[3]).toBe('o');
    expect(tail[4]).toBe('r');
    expect(tail[5]).toBe(WORD_TERMINATOR);

    expect(tail[6]).toBe('r');
    expect(tail[7]).toBe(WORD_TERMINATOR);

    expect(tail[8]).toBe('a');
    expect(tail[9]).toBe('r');
    expect(tail[10]).toBe(WORD_TERMINATOR);

    expect(tail[11]).toBe('g');
    expect(tail[12]).toBe('e');
    expect(tail[13]).toBe(WORD_TERMINATOR);

    expect(tail[14]).toBe('y');
    expect(tail[15]).toBe(WORD_TERMINATOR);
  });

  it('remove test #1', function() {
    trie.clear();

    trie.insert('bachelor');
    trie.insert('jar');
    trie.insert('badge');
    trie.insert('baby');

    trie.remove('');

    expect(trie.contains('bachelor')).toBe(true);
    expect(trie.contains('jar')).toBe(true);
    expect(trie.contains('badge')).toBe(true);
    expect(trie.contains('baby')).toBe(true);
  });

  it('remove test #2 (state test)', function() {
    trie.clear();

    trie.insert('bachelor');
    trie.insert('jar');
    trie.insert('badge');
    trie.insert('baby');

    trie.remove('badge');

    const base: Array<number>   = trie.base;
    const check: Array< number> = trie.check;
    const tail: Array<string>   = trie.tail;

    expect(base.length).toEqual(15);
    expect(base[0]).toEqual(4);
    expect(base[2]).toEqual(1);
    expect(base[3]).toEqual(-15);
    expect(base[4]).toEqual(-1);
    expect(base[5]).toEqual(0);
    expect(base[6]).toEqual(1);
    expect(base[11]).toEqual(0);
    expect(base[14]).toEqual(-9);

    expect(check.length).toEqual(15);
    expect(check[0]).toEqual(0);
    expect(check[2]).toEqual(7);
    expect(check[3]).toEqual(3);
    expect(check[4]).toEqual(3);
    expect(check[5]).toEqual(0);
    expect(check[6]).toEqual(1);
    expect(check[11]).toEqual(0);
    expect(check[14]).toEqual(1);

    expect(tail.length).toEqual(16);
    expect(tail[0]).toBe('h');
    expect(tail[1]).toBe('e');
    expect(tail[2]).toBe('l');
    expect(tail[3]).toBe('o');
    expect(tail[4]).toBe('r');
    expect(tail[5]).toBe(WORD_TERMINATOR);

    expect(tail[6]).toBe('r');
    expect(tail[7]).toBe(WORD_TERMINATOR);

    expect(tail[8]).toBe('a');
    expect(tail[9]).toBe('r');
    expect(tail[10]).toBe(WORD_TERMINATOR);

    expect(tail[11]).toBe('g');
    expect(tail[12]).toBe('e');
    expect(tail[13]).toBe(WORD_TERMINATOR);

    expect(tail[14]).toBe('y');
    expect(tail[15]).toBe(WORD_TERMINATOR);
  });

  it('remove test #3', function() {
    trie.clear();

    trie.insert('bachelor');
    trie.insert('jar');
    trie.insert('badge');
    trie.insert('baby');

    trie.remove('badge');
    expect(trie.contains('bachelor')).toBe(true);
    expect(trie.contains('jar')).toBe(true);
    expect(trie.contains('badge')).toBe(false);
    expect(trie.contains('baby')).toBe(true);
  });

  it('remove test #4', function() {
    trie.clear();

    trie.insert('bachelor');
    trie.insert('jar');
    trie.insert('badge');
    trie.insert('baby');

    trie.remove('badge');
    trie.remove('jar');
    expect(trie.contains('bachelor')).toBe(true);
    expect(trie.contains('jar')).toBe(false);
    expect(trie.contains('badge')).toBe(false);
    expect(trie.contains('baby')).toBe(true);
  });

  it('utils word insert', function() {
    trie.clear();

    trie.insert('bachelor');
    trie.insert('jar');
    trie.insert('badge');
    trie.insert('baby');
    trie.insert('boba');
    trie.insert('fett');
    trie.insert('luke');
    trie.insert('skywalker');

    expect(trie.contains('bachelor')).toBe(true);
    expect(trie.contains('jar')).toBe(true);
    expect(trie.contains('badge')).toBe(true);
    expect(trie.contains('baby')).toBe(true);
    expect(trie.contains('boba')).toBe(true);
    expect(trie.contains('fett')).toBe(true);
    expect(trie.contains('luke')).toBe(true);
    expect(trie.contains('skywalker')).toBe(true);

    expect(trie.contains('han')).toBe(false);
    expect(trie.contains('solo')).toBe(false);
  });
});
