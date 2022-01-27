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

// Specs for various alpha release of TSMT Binary Heap data structure
import {
  TSMT$Heap,
  HeapData,
  HeapType
} from '../../../datastructures/heap';

// Test Suites
describe('TSMT Heap Tests', () => {

  it('newly constructed Heap has size of zero', function() {
    const heap: TSMT$Heap = new TSMT$Heap();

    expect(heap.size).toBe(0);
  });

  it('newly constructed Heap is a min-heap', function() {
    const heap: TSMT$Heap = new TSMT$Heap();

    expect(heap.type).toBe(HeapType.MIN);
  });

  it('will not accept invalid heap type setting', function() {
    const heap: TSMT$Heap = new TSMT$Heap();

    heap.type = -1;

    expect(heap.type).toBe(HeapType.MIN);
  });

  it('properly assigns a singleton element', function() {
    const heap: TSMT$Heap = new TSMT$Heap();

    heap.insert(1.0);

    const element: number = heap.peek();

    expect(heap.size).toBe(1);
    expect(element).toBe(1.0);
  });

  it('2-element insert test #1', function() {
    const heap: TSMT$Heap = new TSMT$Heap();

    heap.insert(1.0);
    heap.insert(2.0);

    const element: number = heap.peek();

    expect(heap.size).toBe(2);
    expect(element).toBe(1.0);
  });

  it('2-element insert test #2', function() {
    const heap: TSMT$Heap = new TSMT$Heap();

    heap.insert(2.0);
    heap.insert(1.0);

    const element: number = heap.peek();

    expect(heap.size).toBe(2);
    expect(element).toBe(1.0);
  });

  it('3-element insert test #1', function() {
    const heap: TSMT$Heap = new TSMT$Heap();

    heap.insert(1.0);
    heap.insert(2.0);
    heap.insert(3.0);

    const element: number = heap.peek();

    expect(heap.size).toBe(3);
    expect(element).toBe(1.0);
  });

  it('3-element insert test #2', function() {
    const heap: TSMT$Heap = new TSMT$Heap();

    heap.insert(3.0);
    heap.insert(2.0);
    heap.insert(1.0);

    const element: number = heap.peek();

    expect(heap.size).toBe(3);
    expect(element).toBe(1.0);
  });

  it('3-element insert test #3', function() {
    const heap: TSMT$Heap = new TSMT$Heap();

    heap.insert(2.0);
    heap.insert(1.0);
    heap.insert(3.0);

    const element: number = heap.peek();

    expect(heap.size).toBe(3);
    expect(element).toBe(1.0);
  });

  it('multi-element insert test #1', function() {
    const heap: TSMT$Heap = new TSMT$Heap();

    heap.insert(3.0);
    heap.insert(9.0);
    heap.insert(5.0);
    heap.insert(1.0);
    heap.insert(6.0);
    heap.insert(8.0);

    const element: number = heap.peek();

    expect(heap.size).toBe(6);
    expect(element).toBe(1.0);
  });

  it('toArray returns copy of heap', function() {
    const heap: TSMT$Heap = new TSMT$Heap();

    heap.insert(3.0);
    heap.insert(9.0);
    heap.insert(5.0);
    heap.insert(1.0);
    heap.insert(6.0);
    heap.insert(8.0);

    const curHeap: Array<HeapData> = heap.toArray();

    expect(curHeap[0]['value']).toBe(1.0);
  });

  it('multi-element insert test #2', function() {
    const heap: TSMT$Heap = new TSMT$Heap();

    heap.insert(3.0);
    heap.insert(9.0);
    heap.insert(5.0);
    heap.insert(1.0);
    heap.insert(6.0);
    heap.insert(8.0);
    heap.insert(7.0);

    const element: number = heap.peek();

    expect(heap.size).toBe(7);
    expect(element).toBe(1.0);

    const curHeap: Array<HeapData> = heap.toArray();
    expect(curHeap[heap.size-1]['value']).toBe(7);
  });

  it('multi-element insert test #3', function() {
    const heap: TSMT$Heap = new TSMT$Heap();

    heap.insert(2.0);
    heap.insert(4.0);
    heap.insert(3.0);
    heap.insert(9.0);
    heap.insert(1.0);
    heap.insert(5.0);
    heap.insert(10.0);
    heap.insert(14.0);
    heap.insert(6.0);

    const element: number = heap.peek();

    expect(heap.size).toBe(9);
    expect(element).toBe(1.0);
  });

  it('multi-element insert test #4', function() {
    const heap: TSMT$Heap = new TSMT$Heap();

    heap.insert(1.0);
    heap.insert(2.0);
    heap.insert(3.0);
    heap.insert(4.0);
    heap.insert(5.0);
    heap.insert(6.0);
    heap.insert(7.0);
    heap.insert(8.0);
    heap.insert(9.0);

    const element: number = heap.peek();

    expect(heap.size).toBe(9);
    expect(element).toBe(1.0);
  });

  it('multi-element insert test #5', function() {
    const heap: TSMT$Heap = new TSMT$Heap();

    heap.insert(9.0);
    heap.insert(8.0);
    heap.insert(7.0);
    heap.insert(6.0);
    heap.insert(5.0);
    heap.insert(4.0);
    heap.insert(3.0);
    heap.insert(2.0);
    heap.insert(1.0);

    const element: number = heap.peek();

    expect(heap.size).toBe(9);
    expect(element).toBe(1.0);
  });

  it('levels accessor test #1', function() {
    const heap: TSMT$Heap = new TSMT$Heap();

    expect(heap.levels).toBe(0);
  });

  it('levels accessor test #2', function() {
    const heap: TSMT$Heap = new TSMT$Heap();

    heap.insert(1.0);

    expect(heap.levels).toBe(1);
  });

  it('levels accessor test #3', function() {
    const heap: TSMT$Heap = new TSMT$Heap();

    heap.insert(1.0);
    heap.insert(2.0);

    expect(heap.levels).toBe(2);
  });

  it('levels accessor test #3', function() {
    const heap: TSMT$Heap = new TSMT$Heap();

    heap.insert(1.0);
    heap.insert(2.0);
    heap.insert(3.0);

    expect(heap.levels).toBe(2);
  });

  it('levels accessor test #4', function() {
    const heap: TSMT$Heap = new TSMT$Heap();

    heap.insert(1.0);
    heap.insert(2.0);
    heap.insert(3.0);
    heap.insert(4.0);

    expect(heap.levels).toBe(3);
  });

  it('levels accessor test #5', function() {
    const heap: TSMT$Heap = new TSMT$Heap();

    heap.insert(1.0);
    heap.insert(2.0);
    heap.insert(3.0);
    heap.insert(4.0);
    heap.insert(5.0);

    expect(heap.levels).toBe(3);
  });

  it('levels accessor test #6', function() {
    const heap: TSMT$Heap = new TSMT$Heap();

    heap.insert(1.0);
    heap.insert(2.0);
    heap.insert(3.0);
    heap.insert(4.0);
    heap.insert(5.0);
    heap.insert(6.0);

    expect(heap.levels).toBe(3);
  });

  it('levels accessor test #8', function() {
    const heap: TSMT$Heap = new TSMT$Heap();

    heap.insert(1.0);
    heap.insert(2.0);
    heap.insert(3.0);
    heap.insert(4.0);
    heap.insert(5.0);
    heap.insert(6.0);
    heap.insert(7.0);
    heap.insert(8.0);

    expect(heap.levels).toBe(4);
  });

  it('properly removes min element from heap #1', function() {
    const heap: TSMT$Heap = new TSMT$Heap();

    heap.insert(3.0)
    heap.insert(9.0);
    heap.insert(5.0);
    heap.insert(1.0);
    heap.insert(6.0);
    heap.insert(8.0);

    let element: number = heap.peek();
    expect(element).toBe(1.0);

    const min: HeapData | null = heap.extractRoot();
    expect(min?.value).toBe(1);
    element = heap.peek();

    expect(heap.size).toBe(5);
    expect(element).toBe(3);
  });

  it('properly removes min element from heap #2', function() {
    const heap: TSMT$Heap = new TSMT$Heap();

    heap.insert(3.0)
    heap.insert(9.0);
    heap.insert(5.0);
    heap.insert(1.0);
    heap.insert(6.0);
    heap.insert(8.0);

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
    const heap: TSMT$Heap = new TSMT$Heap();

    heap.insert(5.0)
    heap.insert(8.0);
    heap.insert(6.0);
    heap.insert(9.0);

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
    const heap: TSMT$Heap = new TSMT$Heap();

    heap.insert(5.0)
    heap.insert(8.0);
    heap.insert(6.0);
    heap.insert(9.0);

    heap.extractRoot();
    const element: number = heap.peek();

    expect(heap.size).toBe(3);
    expect(element).toBe(6);

    heap.insert(1.0);

    expect(heap.size).toBe(4);
    expect(heap.peek()).toBe(1);
  });

  it('does nothing on deleting from an empty heap', function() {
    const heap: TSMT$Heap = new TSMT$Heap();

    heap.delete(1.0);

    expect(heap.size).toBe(0);
  });

  it('properly deletes element from a singleton heap', function() {
    const heap: TSMT$Heap = new TSMT$Heap();

    heap.insert(1.0);
    heap.delete(1.0);

    expect(heap.size).toBe(0);
  });

  it('arbitrary element delete test #1', function() {
    const heap: TSMT$Heap = new TSMT$Heap();

    heap.insert(1.0);
    heap.insert(2.0);

    heap.delete(1.0);

    expect(heap.size).toBe(1);
    expect(heap.peek()).toBe(2);
  });

  it('arbitrary element delete test #2', function() {
    const heap: TSMT$Heap = new TSMT$Heap();

    heap.insert(1.0);
    heap.insert(2.0);

    heap.delete(2.0);

    expect(heap.size).toBe(1);
    expect(heap.peek()).toBe(1);
  });

  it('arbitrary element delete test #3', function() {
    const heap: TSMT$Heap = new TSMT$Heap();

    heap.insert(1.0);
    heap.insert(2.0);
    heap.insert(3.0);

    heap.delete(1.0);

    expect(heap.size).toBe(2);
    expect(heap.peek()).toBe(2);
  });

  it('arbitrary element delete test #4', function() {
    const heap: TSMT$Heap = new TSMT$Heap();

    heap.insert(1.0);
    heap.insert(2.0);
    heap.insert(3.0);

    heap.delete(2.0);

    expect(heap.size).toBe(2);
    expect(heap.peek()).toBe(1);
  });

  it('arbitrary element delete test #5', function() {
    const heap: TSMT$Heap = new TSMT$Heap();

    heap.insert(1.0);
    heap.insert(2.0);
    heap.insert(3.0);

    heap.delete(3.0);

    expect(heap.size).toBe(2);
    expect(heap.peek()).toBe(1);
  });

  it('arbitrary element delete test #6', function() {
    const heap: TSMT$Heap = new TSMT$Heap();

    heap.insert(1.0);
    heap.insert(5.0);
    heap.insert(6.0);
    heap.insert(9.0);
    heap.insert(11.0);
    heap.insert(8.0);
    heap.insert(15.0);
    heap.insert(17.0);
    heap.insert(21.0);

    heap.delete(5.0);

    expect(heap.size).toBe(8);
    expect(heap.peek()).toBe(1);

    const arr: Array<HeapData> = heap.toArray();
    expect(arr[1]['value']).toBe(9);
    expect(arr[2]['value']).toBe(6);
    expect(arr[3]['value']).toBe(17);
    expect(arr[4]['value']).toBe(11);
    expect(arr[5]['value']).toBe(8);
    expect(arr[6]['value']).toBe(15);
    expect(arr[7]['value']).toBe(21);
  });

  it('arbitrary element delete test #7', function() {
    const heap: TSMT$Heap = new TSMT$Heap();

    heap.insert(1.0);
    heap.insert(5.0);
    heap.insert(6.0);
    heap.insert(9.0);
    heap.insert(11.0);
    heap.insert(8.0);
    heap.insert(15.0);
    heap.insert(17.0);
    heap.insert(21.0);

    heap.delete(8.0);

    expect(heap.size).toBe(8);
    expect(heap.peek()).toBe(1);

    const arr: Array<HeapData> = heap.toArray();
    expect(arr[1]['value']).toBe(5);
    expect(arr[2]['value']).toBe(6);
    expect(arr[3]['value']).toBe(9);
    expect(arr[4]['value']).toBe(11);
    expect(arr[5]['value']).toBe(21);
    expect(arr[6]['value']).toBe(15);
    expect(arr[7]['value']).toBe(17);
  });

  it('MAX-Heap properly assigns a singleton element', function() {
    const heap: TSMT$Heap = new TSMT$Heap();
    heap.type           = HeapType.MAX;

    heap.insert(1.0);

    const element: number = heap.peek();

    expect(heap.size).toBe(1);
    expect(element).toBe(1.0);
  });

  it('MAX-Heap 2-element insert test #1', function() {
    const heap: TSMT$Heap = new TSMT$Heap();
    heap.type           = HeapType.MAX;

    heap.insert(1.0);
    heap.insert(2.0);

    const element: number = heap.peek();

    expect(heap.size).toBe(2);
    expect(element).toBe(2.0);
  });

  it('MAX-Heap 2-element insert test #2', function() {
    const heap: TSMT$Heap = new TSMT$Heap();
    heap.type           = HeapType.MAX;

    heap.insert(2.0);
    heap.insert(1.0);

    const element: number = heap.peek();

    expect(heap.size).toBe(2);
    expect(element).toBe(2.0);
  });

  it('MAX-Heap 3-element insert test #1', function() {
    const heap: TSMT$Heap = new TSMT$Heap();
    heap.type           = HeapType.MAX;

    heap.insert(1.0)
    heap.insert(2.0);
    heap.insert(3.0);

    const element: number = heap.peek();

    expect(heap.size).toBe(3);
    expect(element).toBe(3.0);
  });

  it('MAX-Heap 3-element insert test #2', function() {
    const heap: TSMT$Heap = new TSMT$Heap();
    heap.type           = HeapType.MAX;

    heap.insert(3.0)
    heap.insert(2.0);
    heap.insert(1.0);

    const element: number = heap.peek();

    expect(heap.size).toBe(3);
    expect(element).toBe(3.0);
  });

  it('MAX-Heap 3-element insert test #3', function() {
    const heap: TSMT$Heap = new TSMT$Heap();
    heap.type           = HeapType.MAX;

    heap.insert(2.0)
    heap.insert(1.0);
    heap.insert(3.0);

    const element: number = heap.peek();

    expect(heap.size).toBe(3);
    expect(element).toBe(3.0);
  });

  it('MAX-Heap multi-element insert test #1', function() {
    const heap: TSMT$Heap = new TSMT$Heap();
    heap.type           = HeapType.MAX;

    heap.insert(3.0)
    heap.insert(9.0);
    heap.insert(5.0);
    heap.insert(1.0);
    heap.insert(6.0);
    heap.insert(8.0);

    const element: number = heap.peek();

    expect(heap.size).toBe(6);
    expect(element).toBe(9.0);
  });

  it('MAX-Heap multi-element insert test #2', function() {
    const heap: TSMT$Heap = new TSMT$Heap();
    heap.type           = HeapType.MAX;

    heap.insert(3.0)
    heap.insert(9.0);
    heap.insert(5.0);
    heap.insert(1.0);
    heap.insert(6.0);
    heap.insert(8.0);
    heap.insert(7.0);

    const element: number = heap.peek();

    expect(heap.size).toBe(7);
    expect(element).toBe(9.0);

    const curHeap: Array<HeapData> = heap.toArray();
    expect(curHeap[heap.size-1]['value']).toBe(7);
  });

  it('MAX-Heap multi-element insert test #3', function() {
    const heap: TSMT$Heap = new TSMT$Heap();
    heap.type           = HeapType.MAX;

    heap.insert(2.0);
    heap.insert(4.0);
    heap.insert(3.0);
    heap.insert(9.0);
    heap.insert(1.0);
    heap.insert(5.0);
    heap.insert(10.0);
    heap.insert(14.0);
    heap.insert(6.0);

    const element: number = heap.peek();

    expect(heap.size).toBe(9);
    expect(element).toBe(14.0);
  });

  it('MAX-Heap multi-element insert test #4', function() {
    const heap: TSMT$Heap = new TSMT$Heap();
    heap.type           = HeapType.MAX;

    heap.insert(1.0);
    heap.insert(2.0);
    heap.insert(3.0);
    heap.insert(4.0);
    heap.insert(5.0);
    heap.insert(6.0);
    heap.insert(7.0);
    heap.insert(8.0);
    heap.insert(9.0);

    const element: number = heap.peek();

    expect(heap.size).toBe(9);
    expect(element).toBe(9.0);
  });

  it('MAX-Heap multi-element insert test #5', function() {
    const heap: TSMT$Heap = new TSMT$Heap();
    heap.type           = HeapType.MAX;

    heap.insert(9.0);
    heap.insert(8.0);
    heap.insert(7.0);
    heap.insert(6.0);
    heap.insert(5.0);
    heap.insert(4.0);
    heap.insert(3.0);
    heap.insert(2.0);
    heap.insert(1.0);

    const element: number = heap.peek();

    expect(heap.size).toBe(9);
    expect(element).toBe(9.0);
  });

  it('MAX-Heap properly removes max element from heap #1', function() {
    const heap: TSMT$Heap = new TSMT$Heap();
    heap.type           = HeapType.MAX;

    heap.insert(3.0);
    heap.insert(9.0);
    heap.insert(5.0);
    heap.insert(1.0);
    heap.insert(6.0);
    heap.insert(8.0);

    let element: number = heap.peek();
    expect(element).toBe(9.0);

    heap.extractRoot();
    element           = heap.peek();

    expect(heap.size).toBe(5);
    expect(element).toBe(8);
  });

  it('MAX-Heap properly removes max element from heap #2', function() {
    const heap: TSMT$Heap = new TSMT$Heap();
    heap.type           = HeapType.MAX;

    heap.insert(3.0)
    heap.insert(9.0);
    heap.insert(5.0);
    heap.insert(1.0);
    heap.insert(6.0);
    heap.insert(8.0);

    let element: number = heap.peek();
    expect(element).toBe(9.0);

    heap.extractRoot();
    element = heap.peek();

    expect(heap.size).toBe(5);
    expect(element).toBe(8);

    heap.extractRoot();
    element = heap.peek();

    expect(heap.size).toBe(4);
    expect(element).toBe(6);
  });

  it('MAX-Heap properly removes min element from heap #3', function() {
    const heap: TSMT$Heap = new TSMT$Heap();
    heap.type           = HeapType.MAX;

    heap.insert(5.0)
    heap.insert(8.0);
    heap.insert(6.0);
    heap.insert(9.0);

    heap.extractRoot();
    let element: number = heap.peek();

    expect(heap.size).toBe(3);
    expect(element).toBe(8);

    heap.extractRoot();
    element = heap.peek();

    expect(heap.size).toBe(2);
    expect(element).toBe(6);

    heap.extractRoot();
    element = heap.peek();

    expect(heap.size).toBe(1);
    expect(element).toBe(5);

    heap.extractRoot();
    element = heap.peek();

    expect(heap.size).toBe(0);
    expect(element).toBe(0);
  });

  it('MAX-Heap does nothing on deleting from an empty heap', function() {
    const heap: TSMT$Heap = new TSMT$Heap();
    heap.type           = HeapType.MAX;

    heap.delete(1.0);

    expect(heap.size).toBe(0);
  });

  it('MAX-Heap properly deletes element from a singleton heap', function() {
    const heap: TSMT$Heap = new TSMT$Heap();
    heap.type           = HeapType.MAX;

    heap.insert(1.0);
    heap.delete(1.0);

    expect(heap.size).toBe(0);
  });

  it('MAX-Heap arbitrary element delete test #1', function() {
    const heap: TSMT$Heap = new TSMT$Heap();
    heap.type           = HeapType.MAX;

    heap.insert(1.0);
    heap.insert(2.0);

    heap.delete(1.0);

    expect(heap.size).toBe(1);
    expect(heap.peek()).toBe(2);
  });

  it('MAX-Heap arbitrary element delete test #2', function() {
    const heap: TSMT$Heap = new TSMT$Heap();
    heap.type           = HeapType.MAX;

    heap.insert(1.0);
    heap.insert(2.0);

    heap.delete(2.0);

    expect(heap.size).toBe(1);
    expect(heap.peek()).toBe(1);
  });

  it('MAX-Heap arbitrary element delete test #3', function() {
    const heap: TSMT$Heap = new TSMT$Heap();
    heap.type           = HeapType.MAX;

    heap.insert(1.0);
    heap.insert(2.0);
    heap.insert(3.0);

    expect(heap.peek()).toBe(3);

    heap.delete(1.0);

    expect(heap.size).toBe(2);
    expect(heap.peek()).toBe(3);
  });

  it('MAX-Heap arbitrary element delete test #4', function() {
    const heap: TSMT$Heap = new TSMT$Heap();

    heap.insert(1.0);
    heap.insert(2.0);
    heap.insert(3.0);

    heap.delete(2.0);

    expect(heap.size).toBe(2);
    expect(heap.peek()).toBe(1);
  });

  it('MAX-Heap arbitrary element delete test #5', function() {
    const heap: TSMT$Heap = new TSMT$Heap();
    heap.type           = HeapType.MAX;

    heap.insert(1.0);
    heap.insert(2.0);
    heap.insert(3.0);

    heap.delete(3.0);

    expect(heap.size).toBe(2);
    expect(heap.peek()).toBe(2);
  });

  it('MAX-Heap arbitrary element delete test #6', function() {
    const heap: TSMT$Heap = new TSMT$Heap();
    heap.type           = HeapType.MAX;

    heap.insert(1.0);
    heap.insert(5.0);
    heap.insert(6.0);
    heap.insert(9.0);
    heap.insert(11.0);
    heap.insert(8.0);
    heap.insert(15.0);
    heap.insert(17.0);
    heap.insert(21.0);

    heap.delete(5.0);

    expect(heap.size).toBe(8);
    expect(heap.peek()).toBe(21);

    const arr: Array<HeapData> = heap.toArray();
    expect(arr[1]['value']).toBe(17);
    expect(arr[2]['value']).toBe(11);
    expect(arr[3]['value']).toBe(15);
    expect(arr[4]['value']).toBe(6);
    expect(arr[5]['value']).toBe(9);
    expect(arr[6]['value']).toBe(8);
    expect(arr[7]['value']).toBe(1);
  });

  it('MAX-Heap arbitrary element delete test #7', function() {
    const heap: TSMT$Heap = new TSMT$Heap();
    heap.type           = HeapType.MAX;

    heap.insert(1.0);
    heap.insert(5.0);
    heap.insert(6.0);
    heap.insert(9.0);
    heap.insert(11.0);
    heap.insert(8.0);
    heap.insert(15.0);
    heap.insert(17.0);
    heap.insert(21.0);

    heap.delete(8.0);

    expect(heap.size).toBe(8);
    expect(heap.peek()).toBe(21);

    const arr: Array<HeapData> = heap.toArray();
    expect(arr[1]['value']).toBe(17);
    expect(arr[2]['value']).toBe(11);
    expect(arr[3]['value']).toBe(15);
    expect(arr[4]['value']).toBe(6);
    expect(arr[5]['value']).toBe(5);
    expect(arr[6]['value']).toBe(9);
    expect(arr[7]['value']).toBe(1);
  });

});
