/**
 * Copyright 2016 Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
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
 * Typescript Math Toolkit: Binary heap that is optimized for nodes with a numerical value and optional data.  The
 * structure may be a min- or max-heap and all operations are supported on either type of heap.  A newly constructed
 * TSMT Heap instance is a min-heap.  Use the type accessor to change the heap type.
 *
 * Each heap node contains a numerical value (externally assigned) and optional Object data (refer to HeapData
 * interface).  An empty Object is created for a node's data if none is provided in an insert operation.
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */

export enum HeapType
{
  MIN,
  MAX
}

export interface HeapData
{
  value: number;
  data: object;
}

export class TSMT$Heap
{
  // node that heap begins at element 1 of the data array

  protected _position!: number;              // current position in array
  protected _data!: Array<HeapData>;         // node data
  protected _type: number;                   // heap type (min or max)

 /**
  * Create a new Heap
  */
  constructor()
  {
    this.clear();

    this._type = HeapType.MIN;
  }

 /**
  * Access the size of the heap
  */
  public get size(): number
  {
    return this._position;
  }

 /**
  * Access the number of levels in the heap  (the final level may not be complete)
  */
  public get levels(): number
  {
    if (this._position < 2) return this._position;

    const log2: number = Math.round( Math.log2(this._position) );

    return  this._position >= Math.pow(2,log2) ? log2+1 : log2;
  }

 /**
  * Access the heap type, i.e. {HeapType.MIN} if min-heap or {HeapType.MAX} if max-heaps
  */
  public get type(): number
  {
    return this._type;
  }

 /**
  * Assign the heap type.  This MUST be performed before any other operation; the heap type may
  * not be changed after data has been addded, although this may be relaxed in the future.
  *
  * @param {number} data: Either {HeapType.MIN} or {HeapType.MAX}
  */
  public set type(data: number)
  {
    this._type = data === HeapType.MIN || data === HeapType.MAX ? data : this._type;
  }

 /**
  * Construct a heap from a data array
  *
  * @param {Array<HeapData>} data An array of heap data
  */
  public fromArray(data: Array<HeapData>): void
  {
    const len: number = data.length;

    if (len > 0)
    {
      this.clear();

      let i: number;
      for (i = 0; i < len; ++i)
      {
        // insert elements sequentially
        this.insert(data[i].value, data[i].data);
      }
    }
  }

 /**
  * Return a (shallow) copy of the heap as an array
  */
  public toArray(): Array<HeapData>
  {
    return this._data.slice().splice(1,this._position);
  }

 /**
  * Insert an element into the heap.  The internal structure is heapified if the value is valid.
  *
  * @param {number} x: Node value
  *
  * @param {object} data Optional data associated with this node
  */
  public insert(x: number, data?: object): void
  {
    if (isNaN(x) || !isFinite(x)) return;

    const nodeData: object = data || {};

    // no heapify if first value
    if (this._position == 0)
    {
      this._data[1]  = {value: x, data: nodeData};
      this._position = 1;
    }
    else
    {
      this._data[++this._position] = {value: x, data: nodeData};

      // this is already modified to handle min- or max-heap
      this.__heapifyUp();
    }
  }

 /**
  * Examine the root value of the heap without modifying the internal structure.  Returns numerical value of root node, which will be minimum
  * value for a min-heap and maximum value for a max-heap
  */
  public peek(): number
  {
    if (this._position > 0)
    {
      // return value of first node
      return <number> this._data[1].value;
    }
    else
    {
      // no data
      return 0;
    }
  }

 /**
  * Extract the root node of the heap or null if the heap is empty
  */
  public extractRoot(): HeapData | null
  {
    if (this._data === undefined || this._data.length == 1)  return null;

    const root: HeapData = this._data[1];
    this._data[1]      = this._data[this._position];

    this._position--;

    if (this._position > 1)
    {
      // this call handles min- or max-heap
      this.__heapifyDn(1);
    }

    return root;
  }

 /**
  * Remove a node from the heap based on an input value.  The node with the specified value is searched for (within tolerance).  If found,
  * that node is deleted and the internal structure is heapified.  Because of the search, the operation is O(n).  Delete is
  * expected to be an infrequent operation, otherwise another structure is likely a better application fit.
  *
  * @param {number} value Numerical value of node to search for and then delete
  */
  public delete(value: number): void
  {
    // arbitrary delete should be an infrequent operation, otherwise a binary heap is not the best choice
    // of data structure.  so, this is not as efficient as it could be with more effort.
    if (this._position == 0)
    {
      // heap is empty; nothing to do
      return;
    }

    // step 1, find
    let index = 0;
    let i: number;

    for (i = 1; i <= this._position; ++i )
    {
      if (Math.abs(value - this._data[i].value) <= 0.0000001)
      {
        index = i;
        break;
      }
    }

    // step 2, remove and heapify if necessary - I don't like this, but again, delete is not a common op. for a
    // binary heap.
    if (index != 0)
    {
      this._data[index] = this._data[this._position];
      this._position--;

      if (this._position <= 1)
      {
        // heap is empty or a singleton; nothing left to do
        return;
      }

      // following already handles min- or max-heap
      this.__heapifyDn(index);
    }
  }

 /**
  * Clear the heap and prepare for new data. The current heap type remains unaltered.
  */
  public clear(): void
  {
    this._data     = new Array<HeapData>();
    this._position = 0;

    this._data.push( {value: 0, data: {}} );
  }

  protected __heapifyUp(): void
  {
    let pos: number = this._position;
    let p2: number  = Math.floor(0.5*pos);
    let h: HeapData;

    if (this._type == HeapType.MIN)
    {
      while (p2 > 0)
      {
        if (<number> this._data[p2].value > <number> this._data[pos].value)
        {
          h = this._data[pos];

          // swap
          this._data[pos] = this._data[p2];
          this._data[p2] = h;

          pos = p2;
          p2  = Math.floor(0.5 * pos);
        }
        else
        {
          // force quit
          p2 = 0;
        }
      }
    }
    else
    {
      while (p2 > 0)
      {
        if (<number> this._data[p2].value < <number> this._data[pos].value)
        {
          h = this._data[pos];

          // swap
          this._data[pos] = this._data[p2];
          this._data[p2]  = h;

          pos = p2;
          p2  = Math.floor(0.5 * pos);
        }
        else
        {
          // force quit
          p2 = 0;
        }
      }
    }
  }

  protected __heapifyDn(k: number): void
  {
    let minIndex: number;
    let maxIndex: number;
    const left: number  = k + k;
    const right: number = left + 1;

    if (this._type == HeapType.MIN)
    {
      if (right > this._position)
      {
        if (left > this._position)
        {
          // all levels tested
          return;
        }
        else
        {
          // set min-index to left as right node position is beyond heap bounds
          minIndex = left;
        }
      }
      else
      {
        // compute min-index
        minIndex = (this._data[left].value <= this._data[right].value) ? left : right;
      }

      // swap?
      if (this._data[k].value > this._data[minIndex].value)
      {
        const tmp: HeapData    = this._data[minIndex];
        this._data[minIndex] = this._data[k];
        this._data[k]        = tmp;

        this.__heapifyDn(minIndex);
      }
    }
    else
    {
      if (right > this._position)
      {
        if (left > this._position)
        {
          // all levels tested
          return;
        }
        else
        {
          // set min-index to left as right node position is beyond heap bounds
          maxIndex = left;
        }
      }
      else
      {
        // compute max-index
        maxIndex = (this._data[left].value >= this._data[right].value) ? left : right;
      }

      // swap?
      if (this._data[k].value < this._data[maxIndex].value)
      {
        const tmp: HeapData    = this._data[maxIndex];
        this._data[maxIndex] = this._data[k];
        this._data[k]        = tmp;

        this.__heapifyDn(maxIndex);
      }
    }
  }
}
