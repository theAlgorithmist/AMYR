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
 * Typescript Math Toolkit: Linked List Node.  A utils node structure for a linked list.  Supports single or doubly linked lists and allows a node to be specified
 * as a sentinel node.  Data associated with this node is supplied by an arbitrary Object.  Note that to support fast list operations, nodes are directly mutable as
 * well as node data (you break it, you buy it).
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */
 export class TSMT$ListNode
 {
   public id = "node";                            // a utils id for this node

   private _isSentinel = false;                   // true if this is a sentinal node
   private _next!: TSMT$ListNode | null;          // reference to next node in sequence
   private _prev!: TSMT$ListNode | null;          // reference to previous node in sequence
   private _data: object;                         // data for this node

   constructor()
   {
     this.clear();

     this._data = new Object();
   }

  /**
   * Access whether or not this is a sentinel node
   */
   public get isSentinel(): boolean
   {
     return this._isSentinel;
   }

  /**
   * Assign whether or not this is a sentinel node
   *
   * @param {boolean} value: True if this is a sentinel node
   */
   public set isSentinel(value: boolean)
   {
     this._isSentinel = value === true;
   }

  /**
   * Access the next node in sequence
   */
   public get next(): TSMT$ListNode | null
   {
     if (!this._next) return this._isSentinel ? this : null;

     return this._next;
   }

  /**
   * Assign the next node in sequence as long as the current node is not designated to be sentinel
   *
   * @param {TSMT$ListNode | null} value Reference to a list node this is the next in sequence
   */
   public set next(value:TSMT$ListNode | null)
   {
     if (!this._isSentinel)
     {
       if (value && value instanceof TSMT$ListNode) this._next = value;
     }
   }

  /**
   * Access the previous node or null if no previous node exists
   */
   public get prev(): TSMT$ListNode | null
   {
     return this._prev;
   }

  /**
   * Assign the previous node in sequence
   *
   * @param {TSMT$ListNode | null} value Reference to a list node that is the previous in sequence
   *
   * @return Nothing Assigns the previous node in sequence as long as this node has not been designated as a sentinel
   */
   public set prev(value:TSMT$ListNode | null)
   {
     if (!this._isSentinel)
     {
       if (value && value instanceof TSMT$ListNode) this._prev = value;
     }
   }

  /**
   * Access a copy of the data in this node
   */
   public get data(): object
   {
     return JSON.parse(JSON.stringify(this._data));
   }

  /**
   * Assign data to this node
   *
   * @param {object} value Node data
   */
   public set data(value: object)
   {
     if (value !== undefined && value != null) this._data = JSON.parse(JSON.stringify(value));
   }

  /**
   * Null out the previous and next references for this node (allows the node to exist as a property bag, but breaks any linkage)
   */
   public clearRefs(): void
   {
     this._next = null;
     this._prev = null;
   }

  /**
   * Prepare this node for garbage collection
   */
   public clear(): void
   {
     this._next = null;
     this._prev = null;
     this._data = {};
   }
 }
