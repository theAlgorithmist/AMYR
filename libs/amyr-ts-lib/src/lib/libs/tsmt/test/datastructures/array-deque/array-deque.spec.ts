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

// Specs for Typescript Math Toolkit Array Deque
import { TSMT$ArrayDeque } from '../../../datastructures/array-deque';

describe("Array Deque", () => {

  const deque: TSMT$ArrayDeque<number> = new TSMT$ArrayDeque<number>();

  test('correctly constructs a Deque', () => {
    expect(deque.size()).toBe(0);
    expect(deque.peek()).toBe(null);
    expect(deque.peekFirst()).toBe(null);
    expect(deque.peekLast()).toBe(null);
    expect(deque.removeFirst()).toBe(null);
    expect(deque.removeLast()).toBe(null);
    expect(deque.isEmpty()).toBe(true);
  });

  test('does not add null/undefined items', () => {
    deque.add(null);
    expect(deque.size()).toBe(0);

    deque.addFirst(null);
    expect(deque.size()).toBe(0);

    deque.addLast(null);
    expect(deque.size()).toBe(0);

    expect(deque.isEmpty()).toBe(true);
  });

  test('correctly adds and removes a singleton', () => {
    deque.add(1);

    expect(deque.size()).toBe(1);
    expect(deque.peek()).toBe(1);
    expect(deque.size()).toBe(1);

    expect(deque.peekFirst()).toBe(1);
    expect(deque.size()).toBe(1);

    expect(deque.peekLast()).toBe(1);
    expect(deque.size()).toBe(1);

    const value: number = deque.removeFirst() as number;
    expect(value).toBe(1);
    expect(deque.size()).toBe(0);
  });

  test('correctly adds multiple elements to end and clears deque', () => {
    deque.clear();
    deque.add(1);
    deque.add(2);

    expect(deque.size()).toBe(2);
    expect(deque.isEmpty()).toBe(false);

    deque.clear();
    expect(deque.size()).toBe(0);
    expect(deque.isEmpty()).toBe(true);
  });

  test('correctly adds onto both ends of deque', () => {
    deque.clear();
    deque.add(1);
    deque.add(2);
    deque.addFirst(3);
    deque.addLast(4);

    // 3, 1, 2, 4

    expect(deque.size()).toBe(4);
    expect(deque.isEmpty()).toBe(false);

    expect(deque.peekFirst()).toBe(3);
    expect(deque.peekLast()).toBe(4);
  });

  test('correctly adds/removes onto/from both ends of deque', () => {
    deque.clear();
    deque.add(1);
    deque.add(2);
    deque.addFirst(3);
    deque.addLast(4);

    // 3, 1, 2, 4

    expect(deque.size()).toBe(4);
    expect(deque.isEmpty()).toBe(false);

    deque.addFirst((5));
    deque.addLast(6);

    // 5, 3, 1, 2, 4, 6
    expect(deque.size()).toBe(6);
    expect(deque.removeFirst()).toBe(5);
    expect(deque.size()).toBe(5);

    expect(deque.removeLast()).toBe(6);
    expect(deque.size()).toBe(4);
  });
});
