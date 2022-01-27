/**
 * Copyright 2020 Jim Armstrong
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
 *
 * This software was modified from that containing the following copyright notice
 *
 * -----
 *
 * Copyright 2017 Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
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

import { AStarWaypoint } from './astar-waypoint';

/**
 * Lightweight implementation of a min-heap for use in A* algorithm.  Heap nodes are A* graph nodes, whose values
 * are A* waypoints having a heuristic value; all nodes are heapified by that heuristic
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */

export class AstarMinHeap
{
  // note that heap begins at element 1 of the data array

  protected _position!: number;              // current position in array
  protected _data!: Array<AStarWaypoint>;   // node data

  constructor()
  {
    this.clear();
  }

  /**
   * Access the size of the heap
   */
  public get size(): number
  {
    return this._position;
  }

  /**
   * Access the number of levels in the heap
   */
  public get levels(): number
  {
    if (this._position < 2) return this._position;

    const log2: number = Math.round( Math.log2(this._position) );

    return  this._position >= Math.pow(2,log2) ? log2+1 : log2;
  }

  /**
   * Return a (shallow) copy of the heap values as an array
   *
   * @returns {HeapData[]} Copy of the heap node values, i.e. A* Waypoints.
   */
  public toArray(): Array<AStarWaypoint>
  {
    const waypoints: Array<AStarWaypoint> = new Array<AStarWaypoint>();

    let i: number;
    for (i = 1; i <= this._position; ++i) {
      waypoints.push(this._data[i]);
    }

    return waypoints;
  }

  /**
   * Insert an element into the heap
   *
   * @param {AStarWaypoint} w A* Waypoint or a direct graph node (graph node is constructed from the former)
   */
  public insert(w: AStarWaypoint): void
  {
    if (w === undefined || w == null) {
      return;
    }

    // no heapify if first value
    if (this._position == 0)
    {
      this._data[1]  = w;
      this._position = 1;
    }
    else
    {
      this._data[++this._position] = w;

      // this is already modified to handle min- or max-heap
      this.__heapifyUp();
    }
  }

  /**
   * Examine the root (min) value of the heap without modifying the internal structure
   */
  public peek(): number
  {
    if (this._position > 0)
    {
      // return value of first node
      return this._data[1].heuristic;
    }
    else
    {
      // no data
      return 0;
    }
  }

  /**
   * Extract the root (min-value) node of the heap, i.e. the A* Waypoint corresponding to the root graph node
   */
  public extractRoot(): AStarWaypoint | null
  {
    if (this._data === undefined || this._data.length == 1) return null;

    const root: AStarWaypoint = this._data[1];
    this._data[1]           = this._data[this._position];

    this._position--;

    if (this._position > 1) this.__heapifyDn(1);

    return root;
  }

  /**
   * Remove a node from the heap based on an input value
   *
   * @param value Numerical value of node to search for and then delete
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
      if (Math.abs(value - this._data[i].heuristic) <= 0.0000001)
      {
        index = i;
        break;
      }
    }

    // step 2, remove and heapify if necessary
    if (index != 0)
    {
      this._data[index] = this._data[this._position];
      this._position--;

      if (this._position <= 1)
      {
        // heap is empty or a singleton; nothing left to do
        return;
      }

      this.__heapifyDn(index);
    }
  }

  /**
   * Clear the heap and prepare for new data
   *
   * @returns nothing The heap is cleared and prepared for new data, however, the current heap type remains unaltered.
   */
  public clear(): void
  {
    this._data     = new Array<AStarWaypoint>();
    this._position = 0;

    this._data.push(new AStarWaypoint());
  }

  /**
   * Heapify up
   * @private
   */
  protected __heapifyUp(): void
  {
    let pos: number = this._position;
    let p2: number  = Math.floor(0.5*pos);
    let h: AStarWaypoint;

    while (p2 > 0)
    {
      if (this._data[p2].heuristic > this._data[pos].heuristic)
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

  /**
   * Heapify down from the supplied level
   *
   * @param k level
   * @private
   */
  protected __heapifyDn(k: number): void
  {
    let minIndex: number;

    const left: number  = k + k;
    const right: number = left + 1;

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
      minIndex = (this._data[left].heuristic <= this._data[right].heuristic) ? left : right;
    }

    // swap?
    if (this._data[k].heuristic > this._data[minIndex].heuristic)
    {
      const tmp: AStarWaypoint = this._data[minIndex];
      this._data[minIndex]     = this._data[k];
      this._data[k]            = tmp;

      this.__heapifyDn(minIndex);
    }
  }
}
