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
 * Typescript Math Toolkit: Graph consisting of interconnections between TSMT$GraphNode<T> instances.
 *
 * @author Jim Armstrong (www.algorithmist.net), inspired by polygonal ds library
 *
 * @version 1.1 (Added DFS/BFS)
 */

import { TSMT$GraphNode } from './graph-node';
import { TSMT$GraphArc  } from './graph-arc';

export class TSMT$Graph<T>
{
  protected _size!: number;                            // size or number of nodes in the graph
  protected _nodeList!: TSMT$GraphNode<T> | null;      // head of node list for this graph
  protected _curNode!: TSMT$GraphNode<T> | null;       // current or most recently added node

  // structure (stack/queue) that could be used for non-recursive DFS/BFS traversal
  protected _struct!: Array< TSMT$GraphNode<T> >;

  // record the specified graph traversal
  protected _traversal!: Array< TSMT$GraphNode<T> >;

 /**
  * Construct a new TSMT$Graph<T>
  *
  */
  constructor()
  {
    this.clear();
  }

 /**
  * Clear a graph
  */
  public clear(): void
  {
    this._struct        =  this._struct === undefined ? [] : this._struct;
    this._struct.length = 0;

    this._traversal        =  this._traversal === undefined ? [] : this._traversal;
    this._traversal.length = 0;

    let node: TSMT$GraphNode<T> | null = this._nodeList;
    let next: TSMT$GraphNode<T> | null;
    let arc: TSMT$GraphArc<T> | null;
    let nextArc: TSMT$GraphArc<T> | null;

    while (node != null)
    {
      next = node.next as TSMT$GraphNode<T>;
      arc  = node.arcList;

      while (arc != null)
      {
        nextArc  = arc.next;
        arc.next = arc.previous = null;
        arc.node = null;
        arc      = nextArc;
      }

      node.value   = null;
      node.next    = node.previous = null;
      node.arcList = null;
      node         = next;
    }

    this._nodeList  = null;
    this._curNode   = null;
    this._size      = 0;
  }

 /**
  * Access the size or number of nodes in this graph
  */
  public get size(): number
  {
    return this._size;
  }

  /**
   * Is the graph empty?
   */
  public get isEmpty(): boolean
  {
    return this._size == 0;
  }

 /**
  * Access the list of nodes in this graph
  */
  public get nodeList(): TSMT$GraphNode<T> | null
  {
    return this._nodeList;
  }

 /**
  * Find a node in this Graph or return {null} if no such node exists
  *
  * @param {T} value Search for node with this value
  */
  public findNode(value: T): TSMT$GraphNode<T> | null
  {
    let found = false;
    let node: TSMT$GraphNode<T> | null = this._nodeList;

    while (node != null)
    {
      if (node.value == value)
      {
        found = true;
        break;
      }

      node = node.next;
    }

    return found ? node : null;
  }

 /**
  * Add a node to this Graph
  *
  * @param {TSMT$GraphNode<T>} node Reference to graph node to be added
  */
  public addNode(node: TSMT$GraphNode<T>): void
  {
    if (node === undefined && node == null) return;

    this._size++;

    if (this._nodeList == null)
    {
      // begin new list
      this._nodeList = node;
      this._curNode  = node;
    }
    else
    {
      node.previous                             = this._curNode;
      (this._curNode as TSMT$GraphNode<T>).next = node;

      this._curNode      = node;
    }
  }

 /**
  * Remove a node from this Graph
  *
  * @param {TSMT$GraphNode<T>} node Reference of the node to be removed from the graph
  */
  public removeNode(node: TSMT$GraphNode<T>): void
  {
    if (node === undefined || node == null) return;

    this.__unlink(node);

    // update list after removal
    if (node.previous != null)
    {
      node.previous.next = node.next;
    }

    if (node.next != null)
    {
      node.next.previous = node.previous;
    }

    if (this._nodeList === node)
    {
      this._nodeList = node.next;
    }

    this._size--;
  }

 /**
  * Add a single edge (or arc) to this graph by specifying initial and terminal nodes. The one-way arc is created and added to the graph.
  *
  * @param {TSMT$GraphNode<T>} source Source or initial node of the arc
  *
  * @param TSMT$GraphNode<T> target Target or terminal node of the arc
  *
  * @param {number} cost Numerical cost (zero or greater) associated with this arc
  *
  */
  public addEdge(source: TSMT$GraphNode<T>, target: TSMT$GraphNode<T>, cost: number = 1.0): void
  {
    let walk: TSMT$GraphNode<T> | null = this._nodeList;

    // clip for now
    cost = Math.max(0.0, cost);

    while (walk != null)
    {
      if (walk === source)
      {
        const sourceNode: TSMT$GraphNode<T> = walk;
        walk = this._nodeList;

        while (walk != null)
        {
          if (walk === target)
          {
            sourceNode.addArc(walk, cost);
            break;
          }

          walk = walk.next;
        }

        break;
      }

      walk = walk.next;
    }
  }

 /**
  * Add a mutually connected edge (or arc) to this graph by specifying initial and terminal nodes.  The two-way arc is created and added to the graph
  *
  * @param {TSMT$GraphNode<T>} source Source or initial node of the arc
  *
  * @param {TSMT$GraphNode<T>} target Target or terminal node of the arc
  *
  * @param {number} cost Numerical cost (zero or greater) associated with this arc
  */
  public addMutualEdge(source: TSMT$GraphNode<T>, target: TSMT$GraphNode<T>, cost: number = 1.0): void
  {
    let walk: TSMT$GraphNode<T> | null = this._nodeList;

    while (walk != null)
    {
      if (walk === source)
      {
        const sourceNode: TSMT$GraphNode<T> = walk;
        walk = this._nodeList;

        while (walk != null)
        {
          if (walk == target)
          {
            sourceNode.addArc(walk, cost);
            walk.addArc(sourceNode, cost);
            break;
          }

          walk = walk.next;
        }
        break;
      }
      walk = walk.next;
    }
  }

 /**
  * Clear all marks associated with nodes in this graph.  All nodes in the graph are marked as not having been traversed or visited.
  */
  public clearMarks(): void
  {
    let node: TSMT$GraphNode<T> | null = this._nodeList;

    while (node != null)
    {
      node.marked = false;
      node        = node.next;
    }
  }

 /**
  * Clear the parent reference of all nodes in this graph.  All nodes in the graph have a null parent reference after this call.
  */
  public clearParent(): void
  {
    let node: TSMT$GraphNode<T> | null = this._nodeList;

    while (node != null)
    {
      node.parent = null;
      node        = node.next;
    }
  }

 /**
  * Does this graph contain a node with the specified value?
  *
  * @param {T} x Test value
  */
  public contains(x: T): boolean
  {
    let node: TSMT$GraphNode<T> | null = this._nodeList;

    while (node != null)
    {
      if (node.value === x)
      {
        // value found
        return true;
      }

      node = node.next;

    }

    return false;
  }

 /**
  * Remove the node from the graph with the specified value
  *
  * @param {T} x Node value
  */
  public remove(x: T): boolean
  {
    let found  = false;

    let node: TSMT$GraphNode<T> | null = this._nodeList;
    let next: TSMT$GraphNode<T> | null;

    while (node != null)
    {
      next = node.next;

      if (node.value == x)
      {
        this.__unlink(node);

        node.value    = null;
        node.next     = null;
        node.previous = null;
        node.arcList  = null;
        found = true;

        this._size--;
      }

      node = next;
    }

    return found;
  }

 /**
  * Convert the node list to an Array
  */
  public toArray(): Array<TSMT$GraphNode<T>>
  {
    const a  = new Array<TSMT$GraphNode<T>>();
    let node = this._nodeList;

    while (node != null)
    {
      a.push(node);
      node = node.next;
    }

    return a;
  }

  protected __unlink(node: TSMT$GraphNode<T>): void
  {
    let arc0: TSMT$GraphArc<T> | null = node.arcList;

    while (arc0 != null)
    {
      const node1: TSMT$GraphNode<T>    = arc0.node as TSMT$GraphNode<T>;
      let arc1: TSMT$GraphArc<T> | null = node1.arcList;

      let hook: TSMT$GraphArc<T> | null;

      while (arc1 != null)
      {
        hook = arc1.next;

        if (arc1.node == node)
        {
          if (arc1.previous != null)
          {
            arc1.previous.next = hook;
          }

          if (hook != null)
          {
            hook.previous = arc1.previous;
          }

          if (node1.arcList == arc1)
          {
            node1.arcList = hook;
          }

        }

        arc1 = hook;
      }

      hook = arc0.next;

      if (arc0.previous != null)
      {
        arc0.previous.next = hook;
      }

      if (hook != null)
      {
        hook.previous = arc0.previous;
      }

      if (node.arcList == arc0)
      {
        node.arcList = hook;
      }

      arc0 = hook;
    }

    node.arcList = null;
  }

 /**
  * Perform a depth-first search of an undirected graph, starting at the supplied node and only traversing nodes that
  * can be reached from that node.  Return the results in an Array of {TSMT$GraphNode<T>>} instances.  Edge costs are
  * not currently considered.
  *
  * @param {TSMT$GraphNode<T> | T | null} startNode Can be a reference to a starting node or a node with the specified value (a search is performed
  * for the start node in the latter case)
  */
  public DFS(startNode: TSMT$GraphNode<T> | T | null = null): Array< TSMT$GraphNode<T> >
  {
    // outliers
    if (this.size === 0) return [];

    if (this.size === 1) return [this._nodeList as TSMT$GraphNode<T>];

    this._struct.length    = 0;
    this._traversal.length = 0;

    let node: TSMT$GraphNode<T> | null;

    if (startNode === undefined || startNode == null)
    {
      node = this._nodeList;
    }
    else if (startNode instanceof TSMT$GraphNode)
    {
      node = startNode;
    }
    else
    {
      node = this.findNode(startNode as T);
    }

    const rootNode: TSMT$GraphNode<T> | null = node;

    if (rootNode == null) return [];

    while (node != null)
    {
      node.marked = false;
      node        = node.next;
    }

    // can be done pretty easily recursively; non-recursive version uses a stack as a supporting data structure
    this.__DFSTraversal(rootNode);

    return this._traversal;
  }

  protected __DFSTraversal(node: TSMT$GraphNode<T>): void
  {
    node.marked = true;
    this._traversal.push(node);

    let arc: TSMT$GraphArc<T> | null = node.arcList;

    while (arc != null)
    {
      node = arc.node as TSMT$GraphNode<T>;
      if (!node.marked) {
        this.__DFSTraversal(node);
      }

      arc = arc.next;
    }
  }

  /**
   * Perform a breadth-first search of an undirected graph, starting at the supplied node and only traversing nodes that
   * can be reached from that node.  Return the results in an Array of {TSMT$GraphNode<T>>} instances.  Edge costs are
   * not currently considered.
   *
   * @param {TSMT$GraphNode<T> | T | null} startNode Can be a reference to a starting node or a node with the specified value (a search is performed
   * for the start node in the latter case)
   */
  public BFS(startNode: TSMT$GraphNode<T> | T | null = null): Array< TSMT$GraphNode<T> >
  {
    // TODO make this more DRY

    // outliers
    if (this.size === 0) return [];

    if (this.size === 1) return [this._nodeList as TSMT$GraphNode<T>];

    this._struct.length    = 0;
    this._traversal.length = 0;

    let node: TSMT$GraphNode<T> | null;

    if (startNode === undefined || startNode == null)
    {
      node = this._nodeList;
    }
    else if (startNode instanceof TSMT$GraphNode)
    {
      node = startNode;
    }
    else
    {
      node = this.findNode(startNode as T);
    }

    const rootNode: TSMT$GraphNode<T> | null = node;

    if (rootNode == null) return [];

    while (node != null)
    {
      node.marked = false;
      node        = node.next;
    }

    this.__BFSTraversal(rootNode);

    return this._traversal;
  }

  protected __BFSTraversal(node: TSMT$GraphNode<T>): void
  {
    // Traversal uses a queue (implemented as an Array).  Queue is FIFO, so enqueue is push, dequeue is shift.
    node.marked = true;
    this._struct.push(node);

    let arc: TSMT$GraphArc<T>;

    while (this._struct.length > 0)
    {
      node = this._struct.shift() as TSMT$GraphNode<T>;
      this._traversal.push(node);

      arc = node.arcList as TSMT$GraphArc<T>;
      while (arc != null)
      {
        node = arc.node as TSMT$GraphNode<T>;

        if (!node.marked)
        {
          node.marked = true;
          this._struct.push(node);
        }

        arc = arc.next as TSMT$GraphArc<T>;
      }
    }
  }
}
