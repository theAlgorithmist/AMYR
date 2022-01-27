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
 * Typescript Math Toolkit: Minimal implementation of a general tree node.  Node id and value are the typical differentiators
 * of tree nodes, so ensure that all nodes have a unique id and a value assigned before adding them to a tree.  Node
 * children may be either ordered by value or maintained in the order they were added.  Node data is intended to be {number},
 * {string}, or a simple {object}.
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 * 
 * @version 1.0
 */

// ultra-light doubly-linked list to traverse node children
export interface TSMT$ITreeList<T>
{
  prev: TSMT$ITreeList<T> | null;   // previous node in list (null if head)
  next: TSMT$ITreeList<T> | null;   // next node in list (null if tail)
  node: TSMT$TreeNode<T> | null;    // current node;
}

export class TSMT$TreeNode<T>
{
  // node properties
	public id: string;                     // optional identifier for this node

  // maintain a doubly-linked list of child nodes for fast forward/back traversal, particularly for ordered children
	protected _parent: TSMT$TreeNode<T> | null;   // this node's parent (null if root node)
	protected _head: TSMT$ITreeList<T>;           // reference to head node in child list
  protected _tail: TSMT$ITreeList<T>;           // reference to tail node in child list

  protected _data!: T;                   // node data
  protected _children: number;           // total number of children
  protected _ordered: boolean;           // true if children of this node are ordered (ltr) by increasing node value
  protected _traverse: boolean;          // true if this node and its children may be traversed; false if it has
                                         // been pruned as part of a branch-and-bound type procedure, but remains in a
                                         // tree structure

  protected _min: number;                // minimum child value for an ordered child list
  protected _max: number;                // maximum child value for an ordered child list

 /**
  * Construct a new TSMT$TreeNode
  *
  * @param d: T (optional) Node data of the appropriate type.
  *
  * @return Nothing Note that a direct reference to the data is stored internally
  */
	constructor(d?:T)
	{
    if (d != undefined && d != null) {
      this._data = d;
    }

    this.id        = "";
    this._children = 0;
		this._parent   = null;
    this._head     = {prev: null, next: null, node: null};
    this._tail     = this._head;
    this._ordered  = false;
    this._traverse = true;

    this._min = Number.MAX_VALUE;
    this._max = Number.MIN_VALUE;
	}

  /**
   * Access whether or not this node's children are ordered LTR by increasing node value
   */
  public get ordered(): boolean
  {
    return this._ordered;
  }

  /**
   * Assign whether or not node children are ordered
   *
   * @param value: boolean True if node children are to be ordered by value when added to this node's child list.  This
   * value MUST be assigned before adding any children, otherwise, ordering will only apply to insertions AFTER setting
   * this parameter.
   *
   * @returns nothing
   */
   public set ordered(value: boolean)
   {
     this._ordered = value === true ? true : false;
 
     if (this._ordered && this._children > 0)
     {
       // update bounds
       this.__getBounds();
     }
   }
   
  /**
   * Access the number of children for this node
   */
  public get childCount(): number
  {
    return this._children;
  }

  /**
   * Access the total number of nodes for which this node is a root, inclusive
   */
  public get size(): number
  {
    if (this._children == 0) return 1;

    const size: number = 1 + this.__size(this);

    return size;
  }

  /**
   * Access the height to total number of levels of this node.  A singleton node has a height of 0.
   */
  public get height(): number
  {
    if (this._children == 0 ) return 0;

    let h = 0;
    let list: TSMT$ITreeList<T> = this._head;

    while (list.next != null)
    {
      if (list.node && list.node.hasChildren) h = Math.max(h, this.__height(list.node));

      list = list.next;
    }

    if (this._tail.node && this._tail.node.hasChildren) h = Math.max(h, this.__height(this._tail.node));

    return 1 + h;
  }

  protected __height(node: TSMT$TreeNode<T>): number
  {
    let h = 0;
    if (node.hasChildren)
    {
      h++;
      let list: TSMT$ITreeList<T> = node.head;

      while (list.next != null)
      {
        if (list.node && list.node.hasChildren) h += this.__height(list.node);

        list = list.next;
      }

      if (node.tail.node && node.tail.node.hasChildren) h += this.__height(node.tail.node);
    }

    return h;
  }

  /**
   * Recursive method to accumulate node size
   *
   * @param {TSMT$TreeNode<T>} node Input tree node
   * @private
   */
  protected __size(node: TSMT$TreeNode<T>): number
  {
    let list: TSMT$ITreeList<T> = node.head;
    let n: TSMT$TreeNode<T>;

    let size = 0;

    while (list.node && list.next != null)
    {
      n = list.node;
      size++;

      if (n.hasChildren) {
        size += this.__size(n);
      }

      list = list.next;
    }

    n = node.tail.node as TSMT$TreeNode<T>;
    size++;

    if (n.hasChildren) size += this.__size(n);

    return size;
  }

  /**
   * Access whether or not this node may be traversed
   */
  public get traverse(): boolean
  {
    return this._traverse;
  }

  /**
   * Access node data. 
   */
  public get data(): T
  {
    if (Object.prototype.toString.call(this._data) == "[object Object]") return JSON.parse(JSON.stringify(this._data));
  
    return this._data;
  }

  /**
   * Assign data to this node
   *
   * @param {Cloneable<T>} value node data
   */
   public set data(value: T)
   {
     if (value == null || value == undefined) return;
 
     if (typeof value == "object") this._data = JSON.parse(JSON.stringify(value));

     this._data = value;
   }    

 /**
  * Access a direct reference to this node's parent
  */
  public get parent(): TSMT$TreeNode<T> | null
  {
    return this._parent;
  }

  /**
   * Assign this node's parent
   *
   * @param {TSMT$TreeNode<T>} node Reference to this node's new parent
   */
   public set parent(node: TSMT$TreeNode<T> | null)
   {
     if ((node != undefined && node instanceof TSMT$TreeNode) || node == null) this._parent = node;
   }

  /**
   * Access a direct reference to the head node in the child list
   */
  public get head(): TSMT$ITreeList<T>
  {
    return this._head;
  }

  /**
   * Access a direct reference to the tail node in the child list
   */
  public get tail(): TSMT$ITreeList<T>
  {
    return this._tail;
  }

  /**
   * Return the numerical value of this node.  The current implementation is suitable for numeric data;
   * this method is usually overridden for other types of nodes where the value may be derived from node data.
   */
  public get value(): number
  {
    if (this._data != null && this._data !== undefined) return Number(this._data);

    return 0;
  }

  /**
   * Access the minimum value in the immediate child list (typically used for ordered child collections)
   */
  public get min(): number
  {
    if (this._children == 0) return 0;

    if (!this._ordered)
    {
      // update bounds
      this.__getBounds();
    }

    return this._min;
  }

  public get max(): number
  {
    if (this._children == 0) return 0;

    if (!this._ordered)
    {
      // update bounds
      this.__getBounds();
    }

    return this._max;
  }

  /**
   * Does this node have a child list?
   */
  public get hasChildren(): boolean
  {
    return this._children > 0;
  }

  /**
   * Return the list of child ids in an array of string
   */
  public get childIdList(): Array<string>
  {
    const list: Array<string> = new Array<string>();

    let nodeList: TSMT$ITreeList<T> = this._head;
    while (nodeList.next != null)
    {
      if (nodeList.node !== null) {
        list.push(nodeList.node.id);
      }

      nodeList = nodeList.next;
    }

    if (this._tail.node != null) {
      list.push(this._tail.node.id);
    }

    return list;
  }

  /**
   * Add a child to this node
   *
   * @param {TSMT$TreeNode<T>} node Reference to the new child
   */
  public addChild(node: TSMT$TreeNode<T>)
  {
    if ((node !== undefined && node != null && node instanceof TSMT$TreeNode))
    {
      node.parent = this;

      if (this._ordered)
      {
        // add node into appropriate slot and adjust child list
        this.__insertOrderedNode(node);
      }
      else
      {
        // append to end of list
        this.__appendNode(node);
      }

      this._min = Math.min(this._min, node.value);
      this._max = Math.max(this._max, node.value);

      node.parent = this;

      this._children++;
    }
  }

  /**
   * Insert a node into the child list in order of increasing value
   *
   * @param {TSMT$TreeNode<T>| node Reference to node to be appended
   *
   * @private
   */
  protected __insertOrderedNode(node: TSMT$TreeNode<T>): void
  {
    const v: number = node.value;

    // if there is only one node, life is easy, either insert before or after head
    if (this._children == 1)
    {
      if (v >= node.value)
      {
        // append to end
        this.__appendNode(node);
      }
      else
      {
        // prepend before head
        this.__prependNode(node);
      }

      return;
    }

    // have to do it the hard way ... traverse the child list to find an insertion point
    let list: TSMT$ITreeList<T> = this._tail;
    let n: TSMT$TreeNode<T>;
    let listNode: TSMT$ITreeList<T>;

    while (list.prev != null)
    {
      n = list.node as TSMT$TreeNode<T>;
      if (v > n.value)
      {
        // insert after tail?
        if (list.next == null)
        {
          this.__appendNode(node);
        }
        else
        {
          listNode       = {prev: list, next: list.next, node: node};
          list.next      = listNode;
          list.next.prev = listNode;
        }

        return;
      }

      list = list.prev;
    }

    // have to modify the head?
    if (this._children == 0)
    {
      this._head.node = node;
    }
    else
    {
      // insert before head
      this.__prependNode(node);
    }
  }

  /**
   * Prepend a node ahead of the current head of the direct child list
   *
   * @param {TSMT$TreeNode<T>| node Reference to node to be appended
   *
   * @private
   */
  protected __prependNode(node: TSMT$TreeNode<T>): void
  {
    const listNode: TSMT$ITreeList<T> = {prev: null, next: this._head, node: node};

    this._head.prev = listNode;
    this._head      = listNode;
  }

  /**
   * Append a node onto the end of the child list
   *
   * @param {TSMT$TreeNode<T>} Reference to node to be appended
   *
   * @private
   */
  protected __appendNode(node: TSMT$TreeNode<T>): void
  {
    if (this._children == 0)
    {
      this._head.node = node;
    }
    else
    {
      const listNode: TSMT$ITreeList<T> = {prev: this._tail, next: null, node: node};

      this._tail.next = listNode;
      this._tail      = listNode;
    }
  }

  /**
   * Delete a child from this node's child list.  The specified node is deleted provided that its id *exactly* matches an id in the
   * child list. The deleted node is automatically cleared.
   */
  public deleteChild(node: TSMT$TreeNode<T>): void
  {
    if (node !== undefined && node != null)
    {
      const n: TSMT$TreeNode<T> | null = this.deleteChildByID(node.id);

      if (n !== null) n.clear();

      // update bounds
      this.__getBounds();
    }
  }

  /**
   * Delete the child in this node's child list with the specified id.  This method returns a feference to a node in the child list 
   * that will be deleted from that list; it is the caller's responsibility to clear the node if it will no longer be needed.  Otherwise, 
   * the node's child list and hierarchy remains intact.  Returns {null} if no node in the child list is found with a matching id.
   *
   * @param {string} id Node id
   */
  public deleteChildByID(id: string): TSMT$TreeNode<T> | null
  {
    if (this._children == 0) return null;

    let list: TSMT$ITreeList<T> = this._head;
    let node: TSMT$TreeNode<T>  = list.node as TSMT$TreeNode<T>;

    // delete head node?
    if (node.id == id)
    {
      // update head reference
      this._head = this._children == 1 ? {prev: null, next: null, node: null} : list.next as TSMT$ITreeList<T>;

      if (list.next) list.next.prev = null;

      // if only one node, then tail must be fixed as well
      if (this._children == 1) this._tail = this._head;

      this._children--;
      return node;
    }

    // delete interior node?
    while (list.next != null)
    {
      list = list.next;
      node = list.node as TSMT$TreeNode<T>;
      if (node.id == id)
      {
        // deleting tail node?
        if (this._tail.node?.id == id)
        {
          (this._tail.prev as TSMT$ITreeList<T>).next = null;

          this._tail = this._tail.prev as TSMT$ITreeList<T>;
        }
        else
        {
          (list.prev as TSMT$ITreeList<T>).next = list.next;
          (list.next as TSMT$ITreeList<T>).prev = list.prev;
        }

        this._children--;
        return node;
      }
    }

    return null;
  }

  /**
   * Compare two tree nodes, generally for the purpose of determining a traversal direction.  Returns 0 if the current node 
   * value is less than the input node value and 1 otherwise, which doubles as a search direction.
   *
   * @param {T} node Reference to an input node for comparison
   */
  public compare(node: TSMT$TreeNode<T>): number
  {
    if (node === undefined || node == null) return NaN;

    return this.value < node.value ? 0 : 1;
  }

  /**
   * Compare two binary tree nodes for less than, equal to, or greater than in value.  Returns -1 if the current node value is 
   * less than the input node, 0 if equal, and and 1 if greater; note that nodes with numerical values may be require and approx-equal 
   * comparison which could be implemented in a future version.
   *
   * @param {T} node Reference to an input node for comparison
   */
  public compareTo(node: TSMT$TreeNode<T>): number
  {
    if (node == undefined || node == null) return NaN;

    return this.value < node.value ? -1 : this.value == node.value ? 0 : 1;
  }

  /**
   * Clear the child list of this node
   */
  public clear(): void
  {
    let list: TSMT$ITreeList<T> = this._head;

    while (list.next != null)
    {
      const tmp: TSMT$ITreeList<T> = list;

      list     = list.next;
      tmp.prev = null;
      tmp.next = null;

      if ((tmp.node as TSMT$TreeNode<T>).hasChildren) (tmp.node as TSMT$TreeNode<T>).clear();

      tmp.node = null;
    }

    // finish off tail
    if (this._tail.node && this._tail.node.hasChildren) this._tail.node.clear();

    this._head     = {prev: null, next: null, node: null};
    this._tail     = this._head;
    this._children = 0;
  }

  /**
   * Update min/max values for the direct child list
   *
   * @private
   */
  protected __getBounds(): void
  {
    this._min = Number.MAX_VALUE;
    this._max = Number.MIN_VALUE;

    // no kiddies, nothing to do :)
    if (this._children == 0) return;

    let list: TSMT$ITreeList<T> = this._head;
    let v: number;

    while (list.node && list.next != null)
    {
      v         = list.node.value;
      this._min = Math.min(this._min, v);
      this._max = Math.max(this._max, v);

      list = list.next;
    }

    v         = (this._tail as TSMT$ITreeList<T>).node?.value as number;
    this._min = Math.min(this._min, v);
    this._max = Math.max(this._max, v);
  }
}