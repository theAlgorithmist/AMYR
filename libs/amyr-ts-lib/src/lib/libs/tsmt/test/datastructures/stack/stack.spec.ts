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
  TSMT$Stack,
  STACK_TYPE
} from '../../../datastructures/stack';

// Test Suites
describe('TSMT Stack', () => {
  const __numStack: TSMT$Stack<number> = new TSMT$Stack<number>();

  it('constructs a zero-length stack', function() {
    expect(__numStack.length).toBe(0);
  });

  it('correctly adds items to the stack', function() {
    __numStack.push(1);
    __numStack.push(2);
    __numStack.push(3);

    const n: number = __numStack.peek() as number;
    expect(__numStack.length).toBe(3);
    expect(n).toBe(1);
  });

  it('correctly clears the stack', function() {
    __numStack.clear();

    __numStack.push(1);
    __numStack.push(2);
    __numStack.push(3);

    expect(__numStack.length).toBe(3);
    
    __numStack.clear();
    expect(__numStack.length).toBe(0);
  });

  it('correctly creates a stack from an existing array', function() {
    const a: Array<number> = [1, 2, 3, 4, 5, 6];
    __numStack.clear();
    __numStack.fromArray(a);

    let n: number = __numStack.peek() as number;
    expect(__numStack.length).toBe(6);
    expect(n).toBe(1);

    // check internal array copy
    a[5] = 0.0;

    n = __numStack.pop() as number;
    expect(__numStack.length).toBe(5);
    expect(a.length).toBe(6);
    expect(n).toBe(1);
  });

  it('correctly removes items from a FIFO stack', function() {
    __numStack.clear();
    __numStack.push(1);
    __numStack.push(2);
    __numStack.push(3);

    let n: number = __numStack.pop() as number;
    expect(__numStack.length).toBe(2);
    expect(n).toBe(1);

    n = __numStack.pop() as number;
    expect(__numStack.length).toBe(1);
    expect(n).toBe(2);

    n = __numStack.pop() as number;
    expect(__numStack.length).toBe(0);
    expect(n).toBe(3);

    n = __numStack.pop() as number;
    expect(__numStack.length).toBe(0);
    expect(n === null).toBe(true);
  });

  it('correctly removes items from a LIFO stack', function() {
    __numStack.clear();
    __numStack.access = STACK_TYPE.LIFO;

    __numStack.push(1);
    __numStack.push(2);
    __numStack.push(3);

    let n: number = __numStack.pop() as number;
    expect(__numStack.length).toBe(2);
    expect(n).toBe(3);

    n = __numStack.pop() as number;
    expect(__numStack.length).toBe(1);
    expect(n).toBe(2);

    n = __numStack.pop() as number;
    expect(__numStack.length).toBe(0);
    expect(n).toBe(1);

    n = __numStack.pop() as number;
    expect(__numStack.length).toBe(0);
    expect(n === null).toBe(true);
  });

  it('correctly constructs, modifies a stack, and then returns a copy as an array', function() {
    __numStack.clear();
    __numStack.access = STACK_TYPE.FIFO;

    __numStack.push(1);
    __numStack.push(2);
    __numStack.push(3);
    __numStack.push(4);

    let n: number = __numStack.pop() as number;
    expect(__numStack.length).toBe(3);
    expect(n).toBe(1);

    __numStack.access = STACK_TYPE.LIFO;
    n = __numStack.pop() as number;
    expect(__numStack.length).toBe(2);
    expect(n).toBe(4);

    const arr: Array<number> = __numStack.toArray();
    expect(arr[0]).toBe(2);
    expect(arr[1]).toBe(3);

    arr[1] = -1;
    n = __numStack.pop() as number;
    expect(__numStack.length).toBe(1);
    expect(n).toBe(3);
  });
});
