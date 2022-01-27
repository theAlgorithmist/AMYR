/**
 * Copyright 2016 Jim Armstrong (www.algorithmist.net)
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
 * Typescript Math Toolkit: Graph Node.  A default node has an id of zero and null value.  ID is typically assigned
 * post-construction and is expected to be zero or greater.  Nodes are part of a doubly-linked list and expose 'previous'
 * and 'next' pointers.  This node may be the head of a doubly-linked list of graph arcs, which is accessible through
 * a class accessor.  TSMT Graph Nodes and Arcs are constituents of a general graph.
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */

import {TSMT$GraphArc} from './graph-arc';

export class TSMT$GraphNode<T>
{
  protected _id!: string | number;                // id associated with this node (expected to be greater than or equal to zero if number)
  protected _val: T | null;                       // value of this node
  protected _prev!: TSMT$GraphNode<T> | null;     // reference to previous node in a list
  protected _next!: TSMT$GraphNode<T> | null;     // reference to next node in a list
  protected _arcList!: TSMT$GraphArc<T> | null;   // doubly-linked list of arcs for which this node is a head
  protected _curArc!: TSMT$GraphArc<T> | null;    // reference to most recently added arc out of this node
  protected _marked!: boolean;                    // true if this node has been marked in a traversal
  protected _parent!: TSMT$GraphNode<T> | null;   // parent of this node
  protected _depth!: number;                      // traversal depth in a structure

  /**
   * Construct a new GraphNode
   *
   * @param {T} data Optional data associated with this node
   */
  constructor(data?: T)
  {
    this.clear();

    this._val = data !== undefined ? data : null;
  }

 /**
  * Clear this graph node and prepare for new data
  */
  public clear(): void
  {
    this._id      = 0;
    this._val     = null;
    this._prev    = null;
    this._next    = null;
    this._marked  = false;
    this._parent  = null;
    this._depth   = 0;
    this._curArc  = null;
    this._arcList = null;
  }

 /**
  * Access the id of this graph node
  */
  public get id(): string| number
  {
    return this._id;
  }

  /**
   * Assign an ID to this graph node
   *
   * @param value {string} Node ID (zero or greater)
   */
  public set id(value: string | number)
  {
    if (typeof value === 'string')
    {
      this._id = value;
    }
    else
    {
      const nodeID: number = +value;
      this._id = !isNaN(nodeID) && isFinite(nodeID) && value >= 0 ? value : this._id;
    }
  }

 /**
  * Has this node been marked in a graph traversal?
  */
  public get marked(): boolean
  {
    return this._marked;
  }

 /**
  * Assign that this node was marked during traversal
  *
  * @param value {boolean} True if this node is marked as traversed
  */
  public set marked(value: boolean)
  {
    this._marked = value === true ? true : false;
  }

 /**
  * Access this node's value
  */
  public get value(): T | null
  {
    return this._val;
  }

 /**
  * Assign this graph node's value
  *
  * @param v {T | null} New node value
  */
  public set value(v: T | null)
  {
    this._val = v !== undefined && v != null ? v : this._val;
  }

 /**
  * Access previous node in list
  */
  public get previous(): TSMT$GraphNode<T> | null
  {
    return this._prev;
  }

 /**
  * Assign previous node in list
  *
  * @param node {TSMT$GraphNode<T>} Reference to previous node in doubly-linked node list
  */
  public set previous(node: TSMT$GraphNode<T> | null)
  {
    this._prev = node !== undefined && node != null && node instanceof TSMT$GraphNode ? node : this._prev;
  }

 /**
  * Access the next node in list
  */
  public get next(): TSMT$GraphNode<T> | null
  {
    return this._next;
  }

 /**
  * Assign next node in list
  *
  * @param {TMST$GraphNode<T> | null} node Reference to next node in doubly-linked node list
  */
  public set next(node: TSMT$GraphNode<T> | null)
  {
    this._next = node !== undefined && node != null && node instanceof TSMT$GraphNode ? node : this._next;
  }

 /**
  * Access this node's parent
  */
  public get parent(): TSMT$GraphNode<T> | null
  {
    return this._parent;
  }

 /**
  * Assign a parent reference
  *
  * @param {TSMT$GraphNode<T> | null} node Node assigned as a parent node during an organized graph traversal
  */
  public set parent(node: TSMT$GraphNode<T> | null)
  {
    this._parent = node !== undefined && node != null && node instanceof TSMT$GraphNode ? node : this._parent;
  }

 /**
  * Access current traversal depth or distance from first-traversed node
  */
  public get depth(): number
  {
    return this._depth;
  }

 /**
  * Assign traversal depth
  *
  * @param {number} value Traversal depth (zero or greater)
  */
  public set depth(value: number)
  {
    this._depth = !isNaN(value) && isFinite(value) && value >= 0 ? value : this._depth;
  }

 /**
  * Access the arc list for this node
  */
  public get arcList(): TSMT$GraphArc<T> | null
  {
    return this._arcList;
  }

 /**
  * Assign a new head pointer for the arc list from this node
  *
  * @param {TSMT$GraphArc<T> | null} value New head arc in doubly-linked arc list
  */
  public set arcList(value: TSMT$GraphArc<T> | null)
  {
    this._arcList = value !== undefined && value != null && value instanceof TSMT$GraphArc ? value : this._arcList;
  }

 /**
  * Access the number of arcs emanating from this node
  */
  public get arcCount(): number
  {
    let count = 0;
    let arc: TSMT$GraphArc<T> | null = this._arcList;

    while (arc != null)
    {
      count++;
      arc = arc.next;
    }

    return count;
  }

 /**
  * Access if this node is connected to a specified node
  *
  * @param {TSMT$GraphNode<T>} target Target node to check one-way connectivity
  */
  public connected(target: TSMT$GraphNode<T>): boolean
  {
    return target !== undefined && target != null && target instanceof TSMT$GraphNode ? this.getArc(target) != null : false;
  }

 /**
  * Is there a mutual connection from this node to and from the specified node?
  *
  * @param {TSMT$GraphNode<T>} target Target node to check mutual connectivity
  */
  public mutuallyConnected(target: TSMT$GraphNode<T>): boolean
  {
    if (target !== undefined && target != null && target instanceof TSMT$GraphNode)
    {
      // check mutual connection
      return this.getArc(target) != null && target.getArc(this) != null;
    }
    else
    {
      return false;
    }
  }

 /**
  * Access the arc from this node to the specified target
  *
  * @param {TSMT$GraphNode<T>} target Target node to check for one-way connectivity
  */
  public getArc(target: TSMT$GraphNode<T>): TSMT$GraphArc<T> | null
  {
    if (target === undefined || target == null)
    {
      // game over
      return null;
    }

    let found                      = false;
    let a: TSMT$GraphArc<T> | null = this._arcList;

    while (a != null)
    {
      if (a.node == target)
      {
        found = true;
        break;
      }

      a = a.next;
    }
      
    return found ? a : null
  }

  /**
   * Add a graph arc from this node to the specified node
   *
   * @param {TSMT$GraphNode<T>} target Terminal node of arc
   *
   * @param {number} cost Numerical cost associated with this arc (negative values are not currently allowed)
   */
  public addArc(target: TSMT$GraphNode<T>, cost: number=1.0): void
  {
    if (target !== undefined && target != null)
    {
      // clip for now
      cost = Math.max(0.0, cost);

      const arc: TSMT$GraphArc<T> = new TSMT$GraphArc<T>(target, cost);

      if (this._arcList == null)
      {
        // begin new list
        this._arcList = arc;
        this._curArc  = arc;
      }
      else
      {
        arc.previous                            = this._curArc;
        (this._curArc as TSMT$GraphArc<T>).next = arc;

        this._curArc = arc;
      }
    }
  }

  /**
   * Remove an arc from the set of arcs emanating from this node
   *
   * @param {TSMT$GraphNode<T>} target Terminal node of the arc to remove
   *
   * @returns {boolean} True if the arc was found and removed
   */
  public removeArc(target: TSMT$GraphNode<T>): boolean
  {
    if (target !== undefined && target != null)
    {
      const arc: TSMT$GraphArc<T> | null = this.getArc(target);

      if (arc != null)
      {
        if (arc.previous != null)
        {
          // update prev.next after removal
          arc.previous.next = arc.next;
        }

        if (arc.next != null)
        {
          // update next.prev after removal
          arc.next.previous = arc.previous;
        }

        if (this._arcList == arc)
        {
          // update arcList ref after removal
          this._arcList = arc.next;
        }

        return true;
      }

      return false;
    }
    else
    {
      // nothing to remove
      return false;
    }
  }

  /**
   * Remove all outgoing arcs from this node
   */
  public removeOutgoingArcs(): void
  {
    let arc: TSMT$GraphArc<T> = this._arcList as TSMT$GraphArc<T>;

    while (arc != null)
    {
      this.removeArc(arc.node as TSMT$GraphNode<T>);
      arc = arc.next as TSMT$GraphArc<T>;
    }
  }

  /**
   * Remove all outgoing and incoming arcs from this node
   *
   * @return nothing
   */
  public removeAllArcs(): void
  {
    let arc: TSMT$GraphArc<T> = this._arcList as TSMT$GraphArc<T>;

    while (arc != null)
    {
      (arc.node as TSMT$GraphNode<T>).removeArc(this);
      this.removeArc(arc.node as TSMT$GraphNode<T>);

      arc = arc.next as TSMT$GraphArc<T>;
    }
      
    this._arcList = null;
  }
}
