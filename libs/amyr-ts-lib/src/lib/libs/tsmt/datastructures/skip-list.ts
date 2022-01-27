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
 * Typescript Math Toolkit: Skip list.  This version uses a simple probability model (coin flip) to decide
 * whether or not to level-up.  A more general facility is likely in the future.  This implementation of a skip list
 * also has additional methods that make it useful for applications other than as a substitute for a binary tree.  It
 * supports O(1) retrieval of minimum and maximum list (numerical) values as well as fast removal of the minimum- or
 * maximum-value node.  With these methods, the list could be used as an alternative to a min or max binary heap.
 *
 * The skip list is organized by nodes containing a string key, a numerical value (which affects the ordering of the list)
 * and an auxiliary Object used to associate arbitrary data with a list node.
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */

 import {TSMT$SkipListNode } from './skip-list-node-impl';
 import {TSMT$ISkipListData} from "./skip-list-node";

export class TSMT$SkipList
{
  // skip list is organized top to bottom where bottom is the 'list' row.  Head to tail runs top to bottom, in column order

  protected _columnHead!: TSMT$SkipListNode | null;    // reference to column root or head node
  protected _columnTail!: TSMT$SkipListNode | null;    // reference to column tail node (this row contains the full list) - final row head node
  protected _listTail!: TSMT$SkipListNode  | null;     // tail node for the bottom row
  protected _size!: number;                            // list size
  protected _topLevel!: number;                        // zero-based index of current top level

  // cache the most recently referenced node and row head from a find operation
  protected _node!: TSMT$SkipListNode | null;
  protected _head!: TSMT$SkipListNode | null;

  // default min and max-values of an empty list
  protected _min: number = -Number.MAX_VALUE;
  protected _max: number = Number.MAX_VALUE;

  // level-up probability is 1/p
  protected _p: number

 /**
  * Construct a new TSMT$SkipList
  */
  constructor()
  {
    this._p = 2;  // default probability model is coin flip

    this.clear();
  }

 /**
  * Access the size or number of nodes in the list
  */
  public get size(): number
  {
    return this._size;
  }

  /**
   * Access the minimum value of the list
   */
  public get min(): number
  {
    return this._size > 0 ? this._columnTail?.next?.value as number: this._min;
  }

  /**
   * Access the maximum value of the list
   */
  public get max(): number
  {
    return this._size > 0 ? this._listTail?.value as number : this._max;
  }

  /**
   * Access the number of levels created in the formation of the list
   *
   */
  public get levels(): number
  {
    if (this._size <= 1) return 1;

    let levels                  = 1;
    let node: TSMT$SkipListNode = this._columnHead as TSMT$SkipListNode;

    while (node.down != null)
    {
      levels++;

      node = node.down;
    }

    return levels;
  }

  /**
   * Access a row-by-row representation of the internal structure of the current list.  Each array contains a list of
   * {TSMT$ISkipListData>} that represents the internal contents of each row of the skip list.  This is used primarily as a 
   * debugging facility and has possible use in educational applications.  This method should be used only on small-sized
   * lists and is subject to future deprecation.
   */
  public get list(): Array< Array<TSMT$ISkipListData> >
  {
    const result: Array< Array<TSMT$ISkipListData> > = new Array< Array<TSMT$ISkipListData> >();

    if (this._size > 0)
    {
      let head: TSMT$SkipListNode = this._columnHead as TSMT$SkipListNode;

      while (head)
      {
        const row: Array<TSMT$ISkipListData> = new Array<TSMT$ISkipListData>();
        let node: TSMT$SkipListNode          = head;
        let obj: TSMT$ISkipListData;

        while(node != null)
        {
          obj    = node.toData();
          obj.up = node.up ? node.up.key : 'null';
          obj.dn = node.down ? node.down.key : 'null';

          row.push(obj);

          node = node.next as TSMT$SkipListNode;
        }

        result.push(row);

        head = head.down as TSMT$SkipListNode;
      }
    }

    return result;
  }

  /**
   * Assign the number of intervals in the uniform probability model used to determine level-up
   *
   * @param {number} value An integer > 0.  Probability of level-up is 1/value.  Defaults internally to 2.
   */
  public set p(value: number)
  {
    this._p = !isNaN(value) && value > 0 ? Math.floor(value) : this._p;
  }

  /**
   * Clear the current list
   *
   * @return {nothing} The list is cleared and ready for new entries.  The probability model remains unchanged.
   */
  public clear(): void
  {
    this._topLevel   = -1;
    this._columnHead = this.__newLevel(null);
    this._node       = null;
    this._head       = null;

    this._size = 0;
  }

  /**
   * Return the list in an Array
   *
   * @param {boolean} reverse Optional parameter to indicate tha the list should be returned in reverse order, i.e.
   * in decreasing order.
   *
   * @returns {Array<TSMT$ISkipListData>} List is returned in increasing order by default
   */
  public toArray(reverse: boolean = false): Array<TSMT$ISkipListData>
  {
    const result: Array<TSMT$ISkipListData> = new Array<TSMT$ISkipListData>();

    if (this._size > 0)
    {
      if (reverse)
      {
        let node: TSMT$SkipListNode = this._listTail as TSMT$SkipListNode;

        while (node.prev != null)
        {
          if (node.value != Number.MAX_VALUE) {
            result.push(node.toData());
          }

          node = node.prev;
        }
      }
      else
      {
        let node: TSMT$SkipListNode = this._columnTail as TSMT$SkipListNode;

        while (node.next != null)
        {
          if (node.value != -Number.MAX_VALUE)
          {
            result.push(node.toData());
          }

          node = node.next;
        }
      }
    }

    return result;
  }

  /**
   * Initialize the list from an array of numerical values (in arbitrary order).  An existing list will be overwritten by calling this method.
   *
   * @param {Array<number>} values
   */
  public fromArray(values: Array<number>): void
  {
    if (values && values.length > 0)
    {
      if (this._size == 0) {
        this.clear();
      }

      const n: number = values.length;
      let i: number;

      for (i = 0; i < n; ++i) {
        this.insert(i.toString(), values[i]);
      }
    }
  }

  /**
   * Insert a new node into the list
   *
   * @param {string} id Node id (should be unique, but not required)
   *
   * @param {number} value Node value must be unique as duplicate values are rejected
   *
   * @param {object} aux Optional auxiliary data that is associated with the node
   */
  public insert(id: string, value: number, aux?: object): void
  {
    if (value != null && value !== undefined && id !== undefined && id != '')
    {
      // insert into the bottom row (full list)
      let insert: TSMT$SkipListNode = this.__insertionNode(this._columnTail as TSMT$SkipListNode, value) as TSMT$SkipListNode;

      if (insert == null)
      {
        // value is not comparable or already exists in the list
        return;
      }
      else
      {
        // insert into the bottom or 'list' row in between existing nodes
        this.__insertInto(insert, id, value, aux);

        // level up?
        let curHead: TSMT$SkipListNode = this._columnTail as TSMT$SkipListNode;
        let prev: TSMT$SkipListNode    = insert.prev as TSMT$SkipListNode;
        let node: TSMT$SkipListNode;

        while (this._size > 2 && this.__levelUp())
        {
          if (curHead.up != null)
          {
            // insert into an already existing row
            insert = this.__insertionNode(curHead.up, value) as TSMT$SkipListNode;
            node   = this.__insertInto(insert, id, value, aux);

            curHead = curHead.up;
          }
          else
          {
            // create a new row - the insertion node is always the tail of the new row (i.e. inf node)
            curHead = this.__newLevel(curHead);
            node    = this.__insertInto(curHead.next as TSMT$SkipListNode, id, value, aux);
          }

          // set up/down linkage
          prev.up   = node;
          node.down = prev;

          // for next level-up
          prev = node;
        }
      }

      this._size++;
    }

    return;
  }

  /**
   * Delete a node from the list
   *
   * @param {number} value Unique value associated with the node
   *
   * @returns {TSMT$ISkipListData} Reference to node data for the deleted list item.  Null if the node does not
   * exist in the list.
   */
  public delete(value: number): TSMT$ISkipListData | null
  {
    let deletedData: TSMT$ISkipListData | null = null;

    if (value !== undefined && value != null)
    {
      // find the node with the specified value in the bottom row; this is inefficient as it does not use the class
      // find() method, however, deletes are rare and any use of the find() method would also disturb caching and
      // other optimizations in place for frequent finds.

      let node: TSMT$SkipListNode = (this._columnTail as TSMT$SkipListNode).next as TSMT$SkipListNode;
      let found                   = false;

      while (node != null)
      {
        if (node.value == value)
        {
          found       = true;
          deletedData = node.toData();

          break;
        }

        node = node.next as TSMT$SkipListNode;
      }

      if (found)
      {
        // delete all references to this node upward in the list
        this.__deleteFrom(node);

        // if the deleted node is the tail of the bottom row, we have to adjust that link
        if (value == (this._listTail as TSMT$SkipListNode).value) {
          this._listTail = (this._listTail as TSMT$SkipListNode).prev;
        }

        // did we delete the value corresponding to the currently cached node?
        if (this._node !== null && value == this._node.value) {
          this._node = null;
        }

        this._size--;
      }
    }

    return deletedData;
  }

  /**
   * Remove the node with minimum value from the list or null if list is empty
   */
  public removeMin(): TSMT$ISkipListData | null
  {
    // nothing to remove if there is no list
    if (this._size == 0) return null;


    const toDelete: TSMT$SkipListNode = (this._columnTail as TSMT$SkipListNode).next as TSMT$SkipListNode;

    this.__deleteFrom((this._columnTail as TSMT$SkipListNode).next as TSMT$SkipListNode);

    this._size--;

    return toDelete.toData();
  }

  /**
   * Remove the node with maximum value from the list or null if the list is empty
   */
  public removeMax(): TSMT$ISkipListData | null
  {
    // nothing to remove if there is no list
    if (this._size == 0) return null;

    const toDelete: TSMT$SkipListNode = this._listTail as TSMT$SkipListNode;

    this.__deleteFrom(this._listTail as TSMT$SkipListNode);

    // this is a bit subtle - have to clean up this link
    this._listTail = (this._listTail as TSMT$SkipListNode).prev;

    this._size--;

    return toDelete.toData();
  }

  /**
   * Find a node in the list with the specified value or return null if no node exists with the specified value
   *
   * @param {number} value Value to find
   */
  public find(value: number): TSMT$ISkipListData | null
  {
    // repeat cached query?
    let startNode: TSMT$SkipListNode | null = this._columnHead;
    if (this._node !== null)
    {
      if (this._node.value == value) {
        return this._node.toData();
      }

      if (value > this._node.value)
      {
        // use the current node as the starting location in the list
        startNode = this._node;
      }
    }

    // edge cases
    if (this._size == 0) {
      return null;
    }

    if (this._size == 1)
    {
      this._node = (((this._columnTail as TSMT$SkipListNode).next as TSMT$SkipListNode)).clone();
      return this._node.toData();
    }

    // the starting node serves as a head node for the start search level
    let curHead: TSMT$SkipListNode | null = startNode;

    while (curHead)
    {
      let node: TSMT$SkipListNode | null = curHead;

      while (node)
      {
        if (node.value == value)
        {
          this._node = node;
          return this._node.toData();
        }
        else if (node.value > value)
        {
          // time to drop down a level
          node = node.prev;              // we went one too far ...
          break;
        }

        node = node.next;
      }

      curHead = (node as TSMT$SkipListNode).down;
    }

    return null;
  }

  protected __newLevel(head: TSMT$SkipListNode | null): TSMT$SkipListNode
  {
   this._topLevel++;

    if (head == null)
    {
      // empty list, bottom level - begin the level with a -infinity node
      head       = new TSMT$SkipListNode();
      head.prev  = null;
      head.up    = null;
      head.key   = '-inf';
      head.level = this._topLevel;
      head.value = -Number.MAX_VALUE;

      // head and tail match for empty or one-level list
      this._columnHead = head;
      this._columnTail = this._columnHead;
      this._listTail   = this._columnTail;

      // finish off the bottom level with an 'infinity' node so that there is always a place to make a valid insertion
      const infNode: TSMT$SkipListNode = new TSMT$SkipListNode();

      infNode.key           = 'inf';
      infNode.value         = Number.MAX_VALUE;
      infNode.level         = this._topLevel;
      this._columnTail.next = infNode;
      this._columnHead.next = infNode;
      infNode.prev          = this._columnTail;

      this._columnTail.level = 0;
      this._columnHead.level = 0;

      return this._columnHead;
    }
    else
    {
      const newHead: TSMT$SkipListNode = new TSMT$SkipListNode();

      newHead.prev  = null;
      newHead.next  = null;
      newHead.up    = null;
      newHead.level = this._topLevel;
      newHead.down  = this._columnHead;
      newHead.key   = '-inf';
      newHead.value = -Number.MAX_VALUE;

      (this._columnHead as TSMT$SkipListNode).up = newHead;

      // reset head node for columns
      this._columnHead = newHead;

      // infinity node for this level
      const infNode: TSMT$SkipListNode = new TSMT$SkipListNode();

      infNode.key   = 'inf';
      infNode.value = Number.MAX_VALUE;
      infNode.level = this._topLevel;
      newHead.next  = infNode;
      infNode.prev  = newHead;

      return newHead;
    }
  }

  protected __deleteFrom(deleteNode: TSMT$SkipListNode)
  {
    if (deleteNode == null ) return;

    // remove the node from it's current level, but if the node has an upward link, it must also be removed from all
    // upper levels

    const prev: TSMT$SkipListNode = deleteNode.prev as TSMT$SkipListNode;
    const next: TSMT$SkipListNode = deleteNode.next as TSMT$SkipListNode;

    prev.next = next;
    next.prev = prev;

    if (deleteNode.up != null)
    {
      deleteNode.up.down = null;

      this.__deleteFrom(deleteNode.up);
    }
  }

  protected __insertInto(insert: TSMT$SkipListNode, id: string, value: number, aux?: object): TSMT$SkipListNode
  {
    const prev: TSMT$SkipListNode    = insert.prev as TSMT$SkipListNode;
    const curNode: TSMT$SkipListNode = new TSMT$SkipListNode();

    curNode.key   = id;
    curNode.value = value;
    curNode.level = insert.level;

    if (aux) curNode.aux = JSON.parse(JSON.stringify(aux));

    if (insert.key == 'inf' && insert.level == 0)
    {
      // the inserted node is the new tail node for the bottom row of this list - this one always contains the max-value of the list and
      // can be used to traverse the list in reverse order since all row lists are doubly-linked
      this._listTail = curNode;
    }

    curNode.prev  = prev;
    curNode.next  = insert;
    prev.next     = curNode;
    insert.prev   = curNode;

    return curNode;
  }

  protected __levelUp(): boolean
  {
    return Math.random() < 0.5;
  }

  protected __insertionNode(node: TSMT$SkipListNode, value: number): TSMT$SkipListNode | null
  {
    while ( (node && node.next != null) || node.value == Number.MAX_VALUE)
    {
      if (node.value == value)
      {
        // value already exists in the list, so there is no place to perform an insertion
        return null;
      }
      else if (node.value > value)
      {
        // first node whose value is greater than the input value
        return node;
      }

      node = (node as TSMT$SkipListNode).next as TSMT$SkipListNode;
    }

    return null;
  }
}