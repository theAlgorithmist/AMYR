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

import { TSMT$GraphNode } from "./graph-node";
/**
 * Typescript Math Toolkit: Graph Arc.  An arc or edge is defined by a terminating node and a numerical cost,
 * which is zero by default.  This is largely a convenience class for TSMT$Graph<T>.
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */

export class TSMT$GraphArc<T>
{
  protected _node: TSMT$GraphNode<T> | null;      // node this arc points to
  protected _prev: TSMT$GraphArc<T> | null;       // previous arc in a list
  protected _next: TSMT$GraphArc<T> | null;       // next arc in a list
  protected _cost: number;                        // numerical cost of this arc

 /**
  *
  * Construct a graph arc
  *
  * @param {TSMT$GraphNode<T>} node Reference to Graph Node that is the terminator for this arc
  *
  * @param {number} cost Numerical cost of this arc
  * @default 0
  */
  constructor(node: TSMT$GraphNode<T>, cost: number=0.0)
  {
    this._node = node !== undefined ? node : null;
    this._cost = cost;
    this._next = null;
    this._prev = null;
  }

 /**
  * Clear the current node and prepare for new data
  */
  public clear(): void
  {
    this._node = null;
    this._next = null;
    this._prev = null;
    this._cost = 0.0;
  }

 /**
  * Access internal node's value
  */
  public get nodeValue(): T | null
  {
    return this._node ? this._node.value : null;
  }

 /**
  * Access this arc's cost
  */
  public get cost(): number
  {
    return this._cost;
  }

 /**
  * Assign a new cost to this arc
  *
  * @param {number} value Graph cost (zero or greater)
  */
  public set cost(value: number)
  {
    this._cost = !isNaN(value) && isFinite(value) && value >= 0 ? value : this._cost;
  }

 /**
  * Access the previous arc in a doubly-linked list of arcs
  *
  * @returns {TSMT$GraphArc<T>} Direct reference to previous arc
  */
  public get previous(): TSMT$GraphArc<T> | null
  {
    return this._prev;
  }

 /**
  * Assign the previous arc reference
  *
  * @param {TSMT$GraphArc<T> | null} arc Reference to previous arc in doubly-linked arc list (should be non-null)
  */
  public set previous(arc: TSMT$GraphArc<T> | null)
  {
    this._prev = arc !== undefined && arc != null ? arc : this._prev;
  }

 /**
  * Access the next arc in a doubly-linked list of arcs
  */
  public get next(): TSMT$GraphArc<T> | null
  {
    return this._next;
  }

 /**
  * Assign the next arc reference
  *
  * @param {TSMT$GraphArc<T> | null} arc Reference to next arc in doubly-linked arc list
  */
  public set next(arc: TSMT$GraphArc<T> | null)
  {
    this._next = arc !== undefined && arc != null ? arc : this._next;
  }

 /**
  * Access the terminal node associated with this arc
  */
  public get node(): TSMT$GraphNode<T> | null
  {
    return this._node;
  }

 /**
  * Assign a new terminal node
  *
  * @param {TSMT$GraphNode<T> | null} value New terminating node for this arc (should be non-null)
  */
  public set node(value: TSMT$GraphNode<T> | null)
  {
    this._node = value !== undefined && value != null && value instanceof TSMT$GraphNode ? value : this._node;
  }
}
