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
 * Typescript Math Toolkit: Linked List.  A utils (singly, doubly, or ciruclar) linked list of TSMT$ListNodes.  Defaults to single linked list.
 * In order to support fast list operations, immutability is not enforced.
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */
 import { TSMT$ListNode } from './list-node';

 export enum LinkedListType
 {
   SINGLE,        // the usual linked list, nodes may only be referenced forward in the list
   DOUBLE,        // nodes may be referenced in either direction in the list
   CIRCULAR       // singly-linked list with tail node linked to the head node
 }

 export class TSMT$LinkedList
 {
   protected _type: number  = LinkedListType.SINGLE; // list type
   protected _count: number;                         // number of nodes in the list
   protected _head: TSMT$ListNode | null;            // reference to head node
   protected _tail: TSMT$ListNode | null;            // reference to tail node
   protected _node: TSMT$ListNode | null;            // cache reference to most recently fetched node
   protected _index: number;                         // cache index of most recent fetch

   // (index) search parameters
   protected _start = 0;
   protected _end   = 0;
   protected _dir   = 1;

   constructor()
   {
     this._count = 0;
     this._type  = LinkedListType.SINGLE
     this._index = 1;

     this._head = null;
     this._tail = null;
     this._node = null;
   }

  /**
   * Access the number of nodes in the list
   *
   * @return number Current node count
   */
   public get size(): number
   {
     return this._count;
   }

  /**
   * Access the type of list
   *
   * @return number LinkedListType of this list
   */
   public get type(): number
   {
     return this._type;
   }

  /**
   * Assign the list type for valid values, otherwise list type remains unchanged.  A type change automatically alters the current linkage.
   *
   * @param {LinkedListType} listType List type
   */
   public set type(listType: LinkedListType)
   {
     if (this._count == 0)
     {
       // straight assignment of type before list is created
       this._type = listType == LinkedListType.SINGLE || listType == LinkedListType.DOUBLE || listType == LinkedListType.CIRCULAR ? listType : this._type;
       return;
     }

     // type-switch after list creation involves changing existing node linkage
     switch (listType)
     {
       case LinkedListType.CIRCULAR:
         this.__toSingle();

         (this._tail as TSMT$ListNode).next = this._head;
         this._type                         = listType;
       break;

       case LinkedListType.DOUBLE:
         this.__toDouble();

         this._type = listType;
       break;

       case LinkedListType.SINGLE:
         this.__toSingle();

         this._type = listType;
       break;
     }
   }

  /**
   * Access node at the head of the list
   */
   public get head(): TSMT$ListNode | null
   {
     return this._head;
   }

  /**
   * Access node at tail of the list
   */
   public get tail(): TSMT$ListNode | null
   {
     return this._tail;
   }

  /**
   * Access the list node at the specified index or null if the index is out of range
   *
   * @param {number} index Zero-based index of node to fetch which should be in range [0, size-1] unless the list is circular in which case indices wrap mod(size)
   */
   public getNode(index: number): TSMT$ListNode | null
   {
     if (this._count == 0 || index < 0) return null;

     index = index % this._count;

     if (index == this._index && this._node != null) return this._node;

     let node: TSMT$ListNode | null = this.__params(index);
     let i: number                  = this._start;
     let count: number              = Math.abs(this._end - this._start) + 1;

     while (count > 0)
     {
       if (i == index)
       {
         this._index = i;
         this._node  = node;
         return node;
       }

       i   += this._dir;
       node = this._dir == 1 ? (node as TSMT$ListNode).next : (node as TSMT$ListNode).prev;

       count--;
     }

     return null;
   }

  /**
   * Access the list node with the specified id or null if no node in the list has that id
   *
   * @param {string} nodeid Id of node to fetch
   */
   public getNodeById(nodeid: string): TSMT$ListNode | null
   {
     if (this._count == 0) return null;

     let node: TSMT$ListNode = this._head as TSMT$ListNode;
     if (node.id == nodeid)
     {
       this._index = 0;
       this._node  = node;

       return node;
     }

     let i: number;
     for (i=1; i<this._count; ++i)
     {
       node = node.next as TSMT$ListNode;
       if (node.id == nodeid)
       {
         this._index = i;
         this._node  = node;

         return node;
       }
     }

     return null;
   }

  /**
   * Add a node to the list and optionally mark it as the terminal node, which locks the list structure from future additions.  A new list node is created from the
   * input data and added to the list as long as the list does not already have a defined terminator.  In that case, call the {clear} method to clear out the list
   * and begin again.
   *
   * @param {string} id Node id
   *
   * @param {object} data Node data
   *
   * @param {boolean} isTerminal True if this is to be the final node in the list.  If so, no new nodes may be added onto the end and this node may not be deleted.
   * Call the clear method to clear out the list.
   */
   public add(id: string, data: object, isTerminal: boolean=false): void
   {
     if (this._tail && this._tail.isSentinel)
       return;

     const node: TSMT$ListNode = new TSMT$ListNode();
     node.id                   = id;
     node.data                 = data;
     node.isSentinel           = isTerminal;

     if (this._count == 0)
     {
       this._head  = node;
       this._tail  = node;

       this._head.next = this._tail;

       // the tail must have a 'prev' reference yet both head and tail point to same node - will need compensation next addition
       if (this._type == LinkedListType.DOUBLE) this._tail.prev = this._head;

       this._count = 1;

       return;
     }

     (this._tail as TSMT$ListNode).next = node;

     switch (this._type)
     {
       case LinkedListType.DOUBLE:
         node.prev = this._tail;
       break;

       case LinkedListType.CIRCULAR:
         node.next = this._head;
       break;
     }

     this.__noCache();

     this._tail = node;

     // handle edge-case in doubly-linked list transitioning from one to two nodes
     if (this._count == 1 && this._type == LinkedListType.DOUBLE)
     {
       (this._head as TSMT$ListNode).clearRefs();
       (this._head as TSMT$ListNode).next = this._tail;
     }

     this._count++;
   }

  /**
   * Insert a new node at the specified index
   *
   * @param {number} index Zero-based index for the insertion, which must be in the interval [0,size-1].  If zero, the new node becomes the head node, otherwise
   * it is inserted just before the specified index.
   *
   * @param {string} id Id assigned to the inserted node
   *
   * @param {object} data Node data
   */
   public insert(index: number, id: string, data: object): void
   {
     // edge cases
     if (this._count == 0)
     {
       if (index == 0)
       {
         this.add(id, data);
         return;
       }
       else
         return;  // operation is not defined
     }

     if (index < 0)
       return;

     const node: TSMT$ListNode = new TSMT$ListNode();
     node.id                 = id;
     node.data               = data;

     if (index == 0)
     {
       node.next  = this._head;

       if (this._type == LinkedListType.DOUBLE)
         (this._head as TSMT$ListNode).prev = node;
       else if (this._type == LinkedListType.CIRCULAR)
         (this._tail as TSMT$ListNode).next = node;

       this._head  = node;
       this._index = 0;
       this._node  = node;
       this._count++;

       return;
     }

     // in-between cases
     index = index % this._count;

     const before: TSMT$ListNode = this.getNode(index-1) as TSMT$ListNode;
     const after: TSMT$ListNode  = before.next as TSMT$ListNode;

     before.next = node;
     node.next   = after;

     if (this._type == LinkedListType.DOUBLE)
     {
       node.prev  = before;
       after.prev = node;
     }

     this.__noCache();

     this._count++;
   }

  /**
   * Remove a node from the list at the specified index
   *
   * @param {number} index Node index, which should be in the interval [0,size-1] unless the list is circular in which case indices are mod(size)
   */
   public remove(index: number): void
   {
     if (this._count == 0) return;

     if (index < 0 || index >=this._count && this._type != LinkedListType.CIRCULAR) return;

     index = index % this._count;

     // ends of the list
     if (index == 0)
     {
       const node: TSMT$ListNode = this._head as TSMT$ListNode;
       this._head                = this._count == 1 ? null : (this._head as TSMT$ListNode).next;
       this._tail                = this._count == 1 ? null : this._tail;

       node.clear();
     }
     else if (index == this._count-1)
     {
       if ((this._tail as TSMT$ListNode).isSentinel)
         return;
       else
       {
         const node:TSMT$ListNode = this._tail as TSMT$ListNode;

         // note that count-2 will be invalid for a list of length 1, but getNode() returns null which is the desired result (and we should not take
         // this path through the if-then-else anyway)
         this._tail             = this._type == LinkedListType.DOUBLE ? (this._tail as TSMT$ListNode).prev : this.getNode(this._count-2);

         if (this.type == LinkedListType.CIRCULAR && this._tail)
           this._tail.next = this._head;

         this._head = this._count == 1 ? null : this._head;

         node.clear();
       }
     }
     else
     {
       const node: TSMT$ListNode  = this.getNode(index-1) as TSMT$ListNode;
       const node1: TSMT$ListNode = node.next as TSMT$ListNode;
       const node2: TSMT$ListNode = node1.next as TSMT$ListNode;

       node.next = node2;

       if (this._type == LinkedListType.DOUBLE) node1.prev = node;
     }

     this.__noCache();

     this._count--;
   }

  /**
   * Remove the specified node based on its id
   *
   * @param {string} nodeid Id of the node to remove
   */
   public removeById(nodeid: string): void
   {
     // tbd - have never used this in an application - needs to be made more efficient
     const node: TSMT$ListNode | null = this.getNodeById(nodeid);

     if (node) this.remove(this._index);
   }

  /**
   * Convert the list to an Array.   This can be used to create a list with a variety of operations and then repeatedly access
   * the unaltered list with O(1) index operations (provided space efficiency is not a concern).  It may also be used to convert
   * the list to a stack (using array operations to manipulate the stack)
   *
   * @param {boolean} nullRef True if previous and next references are to be nulled out for each node.  This is useful if the resulting array is to be subsequently
   * used as a stack; as nodes are removed, they can be properly garbage collected.
   */
   public toArray(nullRef: boolean=true): Array<TSMT$ListNode>
   {
     const result: Array<TSMT$ListNode> = new Array<TSMT$ListNode>();
     let i: number;
     let node: TSMT$ListNode | null = this._head;

     for (i=0; i<this._count; ++i)
     {
       result.push( node as TSMT$ListNode );
       node = (node as TSMT$ListNode).next;
     }

     if (nullRef)
     {
       for (i=0; i<this._count; ++i)
       {
         node = result[i];
         node.clearRefs();
       }
     }

     return result;
   }

  /**
   * Clear the list structure. The list type remains unchanged; otherwise the list is empty.  References to existing list nodes are nulled.
   */
   public clear(): void
   {
     if (this._count == 0)
       return;

     let prev: TSMT$ListNode = this._head as TSMT$ListNode;
     let next: TSMT$ListNode;
     let i: number;

     for (i=0; i<this._count; ++i)
     {
       // the price of performance and not enforcing immutability ...
       if ((prev as TSMT$ListNode).next)
       {
         next = prev.next as TSMT$ListNode;
         prev.clear();

         prev = next;
       }
     }

     this._count = 0;
     this._head  = null;
     this._tail  = null;

     this.__noCache();
   }

   // all operations pertaining to clearing node-caching
   private __noCache(): void
   {
     this._index = -1;
     this._node  = null;
   }

   // traverse the list and convert to a singly-linked list
   private __toSingle(): void
   {
     if (this._count == 0)
       return;

     let node: TSMT$ListNode = this._head as TSMT$ListNode;
     let i: number;

     for (i=0; i<this._count-1; ++i)
     {
       node.prev = null;
       node      = node.next as TSMT$ListNode;
     }

     (this._tail as TSMT$ListNode).prev = null;
     (this._tail as TSMT$ListNode).next = null;
   }

   // traverse the list and convert to a doubly-linked list
   private __toDouble(): void
   {
     if (this._count == 0)
       return;

     let before: TSMT$ListNode      = this._head as TSMT$ListNode;
     let node: TSMT$ListNode | null = null;
     let i: number;

     for (i=1; i<this._count-1; ++i)
     {
       node      = before.next as TSMT$ListNode;
       node.prev = before;
       before    = node;
     }

     (this._tail as TSMT$ListNode).prev = node;
     (this._tail as TSMT$ListNode).next = null;
   }

   // compute parameters (set in class variables) to traverse the list and search for a node at a given index where the index is not equal to the cached index
   private __params(index: number): TSMT$ListNode | null
   {
     // compute start/end indices and direction for minimum-traversal based on existing cached search and type of list
     if (this._type == LinkedListType.SINGLE || this._type == LinkedListType.CIRCULAR)
     {
       this._start = index > this._index ? this._index+1 : 0;
       this._end   = index;
       this._dir   = 1;

       return (index > this._index && this._node != null) ? this._node.next : this._head;
     }
     else
     {
       // the doubly-linked list has more options, especially if there are cached results from a prior search.  compare traversal distance from head-forward to tail-
       // backward to cached index-forward to cached index-backward.  this is a bit brute-force, but it's also in line with KISS.
       const d1: number      = index;   // head-forward
       const d2: number      = this._count-index;
       let path2: boolean    = d2 < d1;
       let path1             = true;
       path1                 = path2 ? false : path1;
       const d3: number      = index > this._index ? index-this._index : Number.MAX_VALUE;
       let path3:  boolean   = (d3 < d2) && (d3 < d1);

       if (path3)
       {
         path1 = false;
         path2 = false;
       }

       const d4: number     = index < this._index ? this._index - index : Number.MAX_VALUE;
       const path4: boolean = (d4 < d3) && (d4 < d2) && (d4 < d1);

       if (path4)
       {
         path1 = false;
         path2 = false;
         path3 = false;
       }

       // now, compute start/end/dir and return the proper starting node for the traversal based on the best path
       if (path1)
       {
         this._start = 0;
         this._end   = index;
         this._dir   = 1;

         return this._head;
       }
       else if (path2)
       {
         this._start = this._count-1;
         this._end   = index;
         this._dir   = -1;

         return this._tail;
       }
       else if (path3)
       {
         this._start = this._index;
         this._end   = index;
         this._dir   = 1;

         return this._node;
       }
       else
       {
         this._start = this._index;
         this._end   = index;
         this._dir   = -1;

         return this._node;
       }
     }
   }
 }
