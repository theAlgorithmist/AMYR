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

// Specs for various alpha release of Typescript Math Toolkit (fifo) queue
import { TSMT$Queue } from '../../../datastructures/queue';

// Test Suites
describe('TSMT Queue', () => {
  const __numQueue: TSMT$Queue<number> = new TSMT$Queue<number>();

  it('constructs a zero-length queue', function() {
    expect(__numQueue.length).toBe(0);
  });

  it('correctly adds items to the queue', function() {
    __numQueue.enqueue(1);
    __numQueue.enqueue(2);
    __numQueue.enqueue(3);

    const n: number = __numQueue.dequeue() as number;
    expect(__numQueue.length).toBe(2);
    expect(n).toBe(1);
  });

  it('correctly clears the queue', function() {
    __numQueue.clear();

    __numQueue.enqueue(1);
    __numQueue.enqueue(2);
    __numQueue.enqueue(3);

    expect(__numQueue.length).toBe(3);
    
    __numQueue.clear();
    expect(__numQueue.length).toBe(0);
  });

  it('correctly creates a queue from an existing array', function() {
    const a: Array<number> = [1, 2, 3, 4, 5, 6];
    __numQueue.clear();
    __numQueue.fromArray(a);

    let n: number = __numQueue.dequeue() as number;
    expect(__numQueue.length).toBe(5);
    expect(n).toBe(1);

    // check internal array copy
    a[5] = 0.0;

    n = __numQueue.dequeue() as number;
    expect(__numQueue.length).toBe(4);
    expect(a.length).toBe(6);
    expect(n).toBe(2);
  });

  it('correctly removes items from a queue', function() {
    __numQueue.clear();
    __numQueue.enqueue(1);
    __numQueue.enqueue(2);
    __numQueue.enqueue(3);

    let n: number = __numQueue.dequeue() as number;
    expect(__numQueue.length).toBe(2);
    expect(n).toBe(1);

    n = __numQueue.dequeue() as number;
    expect(__numQueue.length).toBe(1);
    expect(n).toBe(2);

    n = __numQueue.dequeue() as number;
    expect(__numQueue.length).toBe(0);
    expect(n).toBe(3);

    n = __numQueue.dequeue() as number;
    expect(__numQueue.length).toBe(0);
  });

  it('correctly constructs, modifies a queue, and then returns a copy as an array', function() {
    __numQueue.clear();

    __numQueue.enqueue(1);
    __numQueue.enqueue(2);
    __numQueue.enqueue(3);
    __numQueue.enqueue(4);

    let n: number = __numQueue.dequeue() as number;
    expect(__numQueue.length).toBe(3);
    expect(n).toBe(1);

    n = __numQueue.dequeue() as number;
    expect(__numQueue.length).toBe(2);
    expect(n).toBe(2);

    const arr: Array<number> = __numQueue.toArray();
    expect(arr[0]).toBe(3);
    expect(arr[1]).toBe(4);

    arr[1] = -1;
    n = __numQueue.dequeue() as number;
    expect(__numQueue.length).toBe(1);
    expect(n).toBe(3);
  });
});
