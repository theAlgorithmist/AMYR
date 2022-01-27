/** Copyright 2016 Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
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

import { AstarMinHeap  } from "../../pathfinding/astar-min-heap";
import { AStarWaypoint } from "../../pathfinding/astar-waypoint";

function waypointFactory(id: string, h: number): AStarWaypoint
{
  const w: AStarWaypoint = new AStarWaypoint(id);
  w.heuristic            = h;

  return w;
};

// Test Suites
describe('A* Min-Heap Tests', () => {

  it('newly constructed Heap has size of zero', function() {
    const heap: AstarMinHeap = new AstarMinHeap();

    expect(heap.size).toBe(0);
  });

  it('properly assigns a singleton element', function() {
    const heap: AstarMinHeap = new AstarMinHeap();

    const w: AStarWaypoint = new AStarWaypoint('1');
    w.heuristic            = 1.0;

    heap.insert(w);

    const element: number = heap.peek();

    expect(heap.size).toBe(1);
    expect(element).toBe(1.0);
  });

  it('2-element insert test #1', function() {
    const heap: AstarMinHeap = new AstarMinHeap();

    const w1: AStarWaypoint = new AStarWaypoint('1');
    w1.heuristic            = 1.0;

    const w2: AStarWaypoint = new AStarWaypoint('2');
    w2.heuristic            = 2.0;

    heap.insert(w1);
    heap.insert(w2);

    const element: number = heap.peek();

    expect(heap.size).toBe(2);
    expect(element).toBe(1.0);
  });

  it('2-element insert test #2', function() {
    const heap: AstarMinHeap = new AstarMinHeap();

    const w1: AStarWaypoint = new AStarWaypoint('1');
    w1.heuristic            = 2.0;

    const w2: AStarWaypoint = new AStarWaypoint('2');
    w2.heuristic            = 1.0;

    heap.insert(w1);
    heap.insert(w2);

    const element: number = heap.peek();

    expect(heap.size).toBe(2);
    expect(element).toBe(1.0);
  });

  it('3-element insert test #1', function() {
    const heap: AstarMinHeap = new AstarMinHeap();

    const w1: AStarWaypoint = new AStarWaypoint('1');
    w1.heuristic            = 1.0;

    const w2: AStarWaypoint = new AStarWaypoint('2');
    w2.heuristic            = 2.0;

    const w3: AStarWaypoint = new AStarWaypoint('3');
    w3.heuristic            = 3.0;

    heap.insert(w1);
    heap.insert(w2);
    heap.insert(w3);

    const element: number = heap.peek();

    expect(heap.size).toBe(3);
    expect(element).toBe(1.0);
  });

  it('3-element insert test #2', function() {
    const heap: AstarMinHeap = new AstarMinHeap();

    const w1: AStarWaypoint = new AStarWaypoint('3');
    w1.heuristic            = 3.0;

    const w2: AStarWaypoint = new AStarWaypoint('2');
    w2.heuristic            = 2.0;

    const w3: AStarWaypoint = new AStarWaypoint('1');
    w3.heuristic            = 1.0;

    heap.insert(w1);
    heap.insert(w2);
    heap.insert(w3);

    const element: number = heap.peek();

    expect(heap.size).toBe(3);
    expect(element).toBe(1.0);
  });

  it('3-element insert test #3', function() {
    const heap: AstarMinHeap = new AstarMinHeap();

    const w1: AStarWaypoint = new AStarWaypoint('2');
    w1.heuristic            = 2.0;

    const w2: AStarWaypoint = new AStarWaypoint('1');
    w2.heuristic            = 1.0;

    const w3: AStarWaypoint = new AStarWaypoint('3');
    w3.heuristic            = 3.0;

    heap.insert(w1);
    heap.insert(w2);
    heap.insert(w3);

    const element: number = heap.peek();

    expect(heap.size).toBe(3);
    expect(element).toBe(1.0);
  });

  it('multi-element insert test #1', function() {
    const heap: AstarMinHeap = new AstarMinHeap();

    heap.insert(waypointFactory('3', 3.0));
    heap.insert(waypointFactory('9', 9.0));
    heap.insert(waypointFactory('5', 5.0));
    heap.insert(waypointFactory('1', 1.0));
    heap.insert(waypointFactory('6', 6.0));
    heap.insert(waypointFactory('8', 8.0));

    const element: number = heap.peek();

    expect(heap.size).toBe(6);
    expect(element).toBe(1.0);
  });

  it('toArray returns copy of heap', function() {
    const heap: AstarMinHeap = new AstarMinHeap();

    heap.insert(waypointFactory('3', 3.0));
    heap.insert(waypointFactory('9', 9.0));
    heap.insert(waypointFactory('5', 5.0));
    heap.insert(waypointFactory('1', 1.0));
    heap.insert(waypointFactory('6', 6.0));
    heap.insert(waypointFactory('8', 8.0));

    const curHeap: Array<AStarWaypoint> = heap.toArray();

    expect(curHeap.length).toBe(6);
    expect(curHeap[0].heuristic).toBe(1.0);
  });

  it('multi-element insert test #2', function() {
    const heap: AstarMinHeap = new AstarMinHeap();

    heap.insert(waypointFactory('3', 3.0));
    heap.insert(waypointFactory('9', 9.0));
    heap.insert(waypointFactory('5', 5.0));
    heap.insert(waypointFactory('1', 1.0));
    heap.insert(waypointFactory('6', 6.0));
    heap.insert(waypointFactory('8', 8.0));
    heap.insert(waypointFactory('7', 7.0));

    const element: number = heap.peek();

    expect(heap.size).toBe(7);
    expect(element).toBe(1.0);

    const curHeap: Array<AStarWaypoint> = heap.toArray();
    expect(curHeap[heap.size-1].heuristic).toBe(7);
  });

  it('multi-element insert test #3', function() {
    const heap: AstarMinHeap = new AstarMinHeap();

    heap.insert(waypointFactory('2', 2.0));
    heap.insert(waypointFactory('4', 4.0));
    heap.insert(waypointFactory('3', 3.0));
    heap.insert(waypointFactory('9', 9.0));
    heap.insert(waypointFactory('1', 1.0));
    heap.insert(waypointFactory('5', 5.0));
    heap.insert(waypointFactory('10', 10.0));
    heap.insert(waypointFactory('14', 14.0));
    heap.insert(waypointFactory('6', 6.0));

    const element: number = heap.peek();

    expect(heap.size).toBe(9);
    expect(element).toBe(1.0);
  });

  it('multi-element insert test #4', function() {
    const heap: AstarMinHeap = new AstarMinHeap();

    heap.insert(waypointFactory('1', 1.0));
    heap.insert(waypointFactory('2', 2.0));
    heap.insert(waypointFactory('3', 3.0));
    heap.insert(waypointFactory('4', 4.0));
    heap.insert(waypointFactory('5', 5.0));
    heap.insert(waypointFactory('6', 6.0));
    heap.insert(waypointFactory('7', 7.0));
    heap.insert(waypointFactory('8', 8.0));
    heap.insert(waypointFactory('9', 9.0));

    const element: number = heap.peek();

    expect(heap.size).toBe(9);
    expect(element).toBe(1.0);
  });

  it('multi-element insert test #5', function() {
    const heap: AstarMinHeap = new AstarMinHeap();

    heap.insert(waypointFactory('9', 9.0));
    heap.insert(waypointFactory('8', 8.0));
    heap.insert(waypointFactory('7', 7.0));
    heap.insert(waypointFactory('6', 6.0));
    heap.insert(waypointFactory('5', 5.0));
    heap.insert(waypointFactory('4', 4.0));
    heap.insert(waypointFactory('3', 3.0));
    heap.insert(waypointFactory('2', 2.0));
    heap.insert(waypointFactory('1', 1.0));

    const element: number = heap.peek();

    expect(heap.size).toBe(9);
    expect(element).toBe(1.0);
  });

  it('levels accessor test #1', function() {
    const heap: AstarMinHeap = new AstarMinHeap();

    expect(heap.levels).toBe(0);
  });

  it('levels accessor test #2', function() {
    const heap: AstarMinHeap = new AstarMinHeap();

    heap.insert(waypointFactory('1', 1.0));

    expect(heap.levels).toBe(1);
  });

  it('levels accessor test #3', function() {
    const heap: AstarMinHeap = new AstarMinHeap();

    heap.insert(waypointFactory('1', 1.0));
    heap.insert(waypointFactory('2', 2.0));

    expect(heap.levels).toBe(2);
  });

  it('levels accessor test #3', function() {
    const heap: AstarMinHeap = new AstarMinHeap();

    heap.insert(waypointFactory('1', 1.0));
    heap.insert(waypointFactory('2', 1.0));
    heap.insert(waypointFactory('3', 3.0));

    expect(heap.levels).toBe(2);
  });

  it('levels accessor test #4', function() {
    const heap: AstarMinHeap = new AstarMinHeap();

    heap.insert(waypointFactory('1', 1.0));
    heap.insert(waypointFactory('2', 2.0));
    heap.insert(waypointFactory('3', 3.0));
    heap.insert(waypointFactory('4', 4.0));

    expect(heap.levels).toBe(3);
  });

  it('levels accessor test #5', function() {
    const heap: AstarMinHeap = new AstarMinHeap();

    heap.insert(waypointFactory('1', 1.0));
    heap.insert(waypointFactory('2', 2.0));
    heap.insert(waypointFactory('3', 3.0));
    heap.insert(waypointFactory('4', 4.0));
    heap.insert(waypointFactory('5', 5.0));

    expect(heap.levels).toBe(3);
  });

  it('levels accessor test #6', function() {
    const heap: AstarMinHeap = new AstarMinHeap();

    heap.insert(waypointFactory('1', 1.0));
    heap.insert(waypointFactory('2', 2.0));
    heap.insert(waypointFactory('3', 3.0));
    heap.insert(waypointFactory('4', 4.0));
    heap.insert(waypointFactory('5', 5.0));
    heap.insert(waypointFactory('6', 6.0));

    expect(heap.levels).toBe(3);
  });

  it('levels accessor test #8', function() {
    const heap: AstarMinHeap = new AstarMinHeap();

    heap.insert(waypointFactory('1', 1.0));
    heap.insert(waypointFactory('2', 2.0));
    heap.insert(waypointFactory('3', 3.0));
    heap.insert(waypointFactory('4', 4.0));
    heap.insert(waypointFactory('5', 5.0));
    heap.insert(waypointFactory('6', 6.0));
    heap.insert(waypointFactory('7', 7.0));
    heap.insert(waypointFactory('8', 8.0));

    expect(heap.levels).toBe(4);
  });

  it('properly removes min element from heap #1', function() {
    const heap: AstarMinHeap = new AstarMinHeap();

    heap.insert(waypointFactory('3', 3.0));
    heap.insert(waypointFactory('9', 9.0));
    heap.insert(waypointFactory('5', 5.0));
    heap.insert(waypointFactory('1', 1.0));
    heap.insert(waypointFactory('6', 6.0));
    heap.insert(waypointFactory('8', 8.0));

    let element: number = heap.peek();
    expect(element).toBe(1.0);

    const min: AStarWaypoint | null = heap.extractRoot();
    expect(min?.key).toBe('1');
    element = heap.peek();

    expect(heap.size).toBe(5);
    expect(element).toBe(3);
  });

  it('properly removes min element from heap #2', function() {
    const heap: AstarMinHeap = new AstarMinHeap();

    heap.insert(waypointFactory('3', 3.0));
    heap.insert(waypointFactory('9', 9.0));
    heap.insert(waypointFactory('5', 5.0));
    heap.insert(waypointFactory('1', 1.0));
    heap.insert(waypointFactory('6', 6.0));
    heap.insert(waypointFactory('8', 8.0));

    let element: number = heap.peek();
    expect(element).toBe(1.0);

    heap.extractRoot();
    element = heap.peek();

    expect(heap.size).toBe(5);
    expect(element).toBe(3);

    heap.extractRoot();
    element = heap.peek();

    expect(heap.size).toBe(4);
    expect(element).toBe(5);
  });

  it('properly removes min element from heap #3', function() {
    const heap: AstarMinHeap = new AstarMinHeap();

    heap.insert(waypointFactory('5', 5.0));
    heap.insert(waypointFactory('8', 8.0));
    heap.insert(waypointFactory('6', 6.0));
    heap.insert(waypointFactory('9', 9.0));

    heap.extractRoot();
    let element: number = heap.peek();

    expect(heap.size).toBe(3);
    expect(element).toBe(6);

    heap.extractRoot();
    element = heap.peek();

    expect(heap.size).toBe(2);
    expect(element).toBe(8);

    heap.extractRoot();
    element = heap.peek();

    expect(heap.size).toBe(1);
    expect(element).toBe(9);

    heap.extractRoot();
    element = heap.peek();

    expect(heap.size).toBe(0);
    expect(element).toBe(0);
  });

  it('properly extracts and inserts', function() {
    const heap: AstarMinHeap = new AstarMinHeap();

    heap.insert(waypointFactory('5', 5.0));
    heap.insert(waypointFactory('8', 8.0));
    heap.insert(waypointFactory('6', 6.0));
    heap.insert(waypointFactory('9', 9.0));

    heap.extractRoot();
    const element: number = heap.peek();

    expect(heap.size).toBe(3);
    expect(element).toBe(6);

    heap.insert(waypointFactory('1', 1.0));

    expect(heap.size).toBe(4);
    expect(heap.peek()).toBe(1);
  });

  it('does nothing on deleting from an empty heap', function() {
    const heap: AstarMinHeap = new AstarMinHeap();

    heap.delete(1.0);

    expect(heap.size).toBe(0);
  });

  it('properly deletes element from a singleton heap', function() {
    const heap: AstarMinHeap = new AstarMinHeap();

    heap.insert(waypointFactory('1', 1.0));

    heap.delete(5.0);
    expect(heap.size).toBe(1);

    heap.delete(1.0);
    expect(heap.size).toBe(0);
  });

  it('arbitrary element delete test #1', function() {
    const heap: AstarMinHeap = new AstarMinHeap();

    heap.insert(waypointFactory('1', 1.0));
    heap.insert(waypointFactory('2', 2.0));

    heap.delete(1.0);

    expect(heap.size).toBe(1);
    expect(heap.peek()).toBe(2);
  });

  it('arbitrary element delete test #2', function() {
    const heap: AstarMinHeap = new AstarMinHeap();

    heap.insert(waypointFactory('1', 1.0));
    heap.insert(waypointFactory('2', 2.0));

    heap.delete(2.0);

    expect(heap.size).toBe(1);
    expect(heap.peek()).toBe(1);
  });

  it('arbitrary element delete test #3', function() {
    const heap: AstarMinHeap = new AstarMinHeap();

    heap.insert(waypointFactory('1', 1.0));
    heap.insert(waypointFactory('2', 2.0));
    heap.insert(waypointFactory('3', 3.0));

    heap.delete(1.0);

    expect(heap.size).toBe(2);
    expect(heap.peek()).toBe(2);
  });

  it('arbitrary element delete test #4', function() {
    const heap: AstarMinHeap = new AstarMinHeap();

    heap.insert(waypointFactory('1', 1.0));
    heap.insert(waypointFactory('2', 2.0));
    heap.insert(waypointFactory('3', 3.0));

    heap.delete(2.0);

    expect(heap.size).toBe(2);
    expect(heap.peek()).toBe(1);
  });

  it('arbitrary element delete test #5', function() {
    const heap: AstarMinHeap = new AstarMinHeap();

    heap.insert(waypointFactory('1', 1.0));
    heap.insert(waypointFactory('2', 2.0));
    heap.insert(waypointFactory('3', 3.0));

    heap.delete(3.0);

    expect(heap.size).toBe(2);
    expect(heap.peek()).toBe(1);
  });

  it('arbitrary element delete test #6', function() {
    const heap: AstarMinHeap = new AstarMinHeap();

    heap.insert(waypointFactory('1', 1.0));
    heap.insert(waypointFactory('5', 5.0));
    heap.insert(waypointFactory('6', 6.0));
    heap.insert(waypointFactory('9', 9.0));
    heap.insert(waypointFactory('11', 11.0));
    heap.insert(waypointFactory('8', 8.0));
    heap.insert(waypointFactory('15', 15.0));
    heap.insert(waypointFactory('17', 17.0));
    heap.insert(waypointFactory('21', 21.0));
    
    heap.delete(5.0);

    expect(heap.size).toBe(8);
    expect(heap.peek()).toBe(1);

    const arr: Array<AStarWaypoint> = heap.toArray();
    expect(arr[1].heuristic).toBe(9);
    expect(arr[2].heuristic).toBe(6);
    expect(arr[3].heuristic).toBe(17);
    expect(arr[4].heuristic).toBe(11);
    expect(arr[5].heuristic).toBe(8);
    expect(arr[6].heuristic).toBe(15);
    expect(arr[7].heuristic).toBe(21);
  });

  it('arbitrary element delete test #7', function() {
    const heap: AstarMinHeap = new AstarMinHeap();

    heap.insert(waypointFactory('1', 1.0));
    heap.insert(waypointFactory('5', 5.0));
    heap.insert(waypointFactory('6', 6.0));
    heap.insert(waypointFactory('9', 9.0));
    heap.insert(waypointFactory('11', 11.0));
    heap.insert(waypointFactory('8', 8.0));
    heap.insert(waypointFactory('15', 15.0));
    heap.insert(waypointFactory('17', 17.0));
    heap.insert(waypointFactory('21', 21.0));

    heap.delete(8.0);

    expect(heap.size).toBe(8);
    expect(heap.peek()).toBe(1);

    const arr: Array<AStarWaypoint> = heap.toArray();
    expect(arr[1].heuristic).toBe(5);
    expect(arr[2].heuristic).toBe(6);
    expect(arr[3].heuristic).toBe(9);
    expect(arr[4].heuristic).toBe(11);
    expect(arr[5].heuristic).toBe(21);
    expect(arr[6].heuristic).toBe(15);
    expect(arr[7].heuristic).toBe(17);
  });
});
