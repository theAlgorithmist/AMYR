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
 * Typescript Math Toolkit: Minimal implementation of a binary tree node. 
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 * 
 * @version 1.0
 */

import { TREE_COLOR_ENUM } from "../../../enumerations/tree-color-enum";

export class TSMT$BTreeNode<T>
{
  // node properties
	public id: string;                                     // optional identifier for this node

  // internal
	protected _data!: T;                                   // node data
	protected _parent: TSMT$BTreeNode<T> | null;           // this node's parent (null if root node)
	protected _children: Array<TSMT$BTreeNode<T> | null>;  // left & right child nodes (there is a purpose to this apparent madness)

  // aux variables for balancing and such - these are generally set by a tree so that these properties can be updated JIT instead of recomputed from scratch by the node
  protected _balance: number;                            // will open up for R/B tree in future release
  protected _color: number;

 /**
  * Construct a new TSMT$BTreeNode.  Note that a direct reference to the data is stored internally
  *
  * @param d {T} (optional) Node data of the appropriate type.
  */
	constructor(d?:T)
	{
    if (d != undefined && d != null)
		  this._data   = d;

    this.id           = "";
		this._parent      = null; 
    this._children    = [null, null];  // fixed-length array of two elements
    this._children[0] = null;
    this._children[1] = null;

    this._balance     = 0;
    this._color       = TREE_COLOR_ENUM.NONE;
	}

 /**
  * Access node data
  */
  public get data(): T | null
  {
    if (typeof this._data == "number" || typeof this._data == "string")
      return this._data;
    else if (typeof this._data == "object")
      return JSON.parse(JSON.stringify(this._data));

    return null;
  }

 /**
  * Assign data to this node (direct reference).  Cloning may be supported in the future.
  *
  * @param value {T | null} node data
  *
  * @return nothing
  */
    public set data(value: T | null)
    {
      if (value === null || value == undefined) return;
  
      this._data = value;
    }

 /**
  * Access the node balance with negative for left-heavy, zero for even balance, and positive for right-heavy
  */
  public get balance(): number
  {
    return this._balance;
  }

 /**
  * Assign a balance value to this node
  *
  * @param value {number} Height value which must be integral (the floor of the input is assigned to the internal value)
  */
  public set balance(value: number)
  {
    this._balance = (!isNaN(value) && isFinite(value)) ? Math.floor(value) : this._balance;
  }  

 /**
  * Access a direct reference to this node's parent
  */
  public get parent(): TSMT$BTreeNode<T> | null
  {
    return this._parent;
  }

 /**
  * Assign this node's parent
  *
  * @param node {TSMT$BTreeNode<T> | null} Reference to this node's new parent
  */	
  public set parent(node: TSMT$BTreeNode<T> | null)
  {
    if ((node != undefined && node instanceof TSMT$BTreeNode) || node == null) this._parent = node;
  }
  
 /**
  * Access a direct reference to this node's left child
  */
  public get left(): TSMT$BTreeNode<T> | null
  {
    return this._children[0];
  }

 /**
  * Assign this node's left child.  The new left-child reference is set provided the input is valid; it is allowable to set the reference to null
  *
  * @param node{ TSMT$BTreeNode<T> | null} Reference to this node's new left child
  */
  public set left(node: TSMT$BTreeNode<T> | null)
  {
    if ((node != undefined && node instanceof TSMT$BTreeNode) || node == null)
    {
      this._children[0] = node;
  
      if (node != null) node.parent = this;
    }
  }

 /**
  * Access a direct reference to this node's right child
  */
  public get right(): TSMT$BTreeNode<T> | null
  {
    return this._children[1];
  }

 /**
  * Assign this node's right child.  The new right-child reference is set provided the input is valid; it is allowable to set the reference to null
  *
  * @param node {TSMT$BTreeNode<T> | null} Reference to this node's new right child
  */
  public set right(node: TSMT$BTreeNode<T> | null)
  {
    if ((node != undefined && node instanceof TSMT$BTreeNode) || node == null)
    {
      this._children[1] = node;

      if (node != null) node.parent  = this;
    }
  }  

 /**
  * Return the numerical value of this node.  The current implementation is suitable for numeric data; this method is usually overridden for other
  * types of nodes and the value may be derived from node data.
  */
  public get value(): number
  {
    if (this._data != null && this._data != undefined)
    {
      if (typeof this._data == "number") return this._data as number;
    }

    // the node has no value if data is undefined
    return 0;
  }

 /**
  * Does this node have a left child?
  */
  public get hasLeft(): boolean
  {
    return this._children[0] != null;
  }

 /**
  * Does this node have a right child?
  */
  public get hasRight(): boolean
  {
    return this._children[1] != null;
  }

 /**
  * Access a child node based on its order
  *
  * @param index {number} Index that must be zero (left child) or one (right child)
  */
  public getChild(index: number): TSMT$BTreeNode<T> | null
  {
    if (index == 0)
      return this._children[0];
    else if (index == 1)
      return this._children[1];
    else
      return null;
  }

 /**
  * Assign a child node based on its order
  *
  * @param index {number} Index that must be zero (left child) or one (right child)
  *
  * @param node {TSMT$BTreeNode<T>} Node to be set as a child (null is allowable)
  */
  public setChild(index: number, node: TSMT$BTreeNode<T>): void
  {
    if (index == 0 || index == 1)
    {
      this._children[index] = node;

      if (node != null)
        node.parent = this;
    }
  }

 /**
  * Compare two binary tree nodes, generally for the purpose of determining a traversal direction.  Returns 0 if the current node value is less 
  * than the input node value and 1 otherwise, which doubles as a search direction
  *
  * @param node {T} Reference to an input node for comparison
  */
  public compare(node: TSMT$BTreeNode<T>): number
  {
    if (node == undefined || node == null)
      return NaN;

    return  this.value < node.value ? 0 : 1;
  }

 /**
  * Compare two binary tree nodes for less than, equal to, or greater than in value.  Returns -1 if the current node value is less than the input node, 
  * 0 if equal, and and 1 if greater; note that nodes with numerical values may be require and approx-equal comparison which could be implemented in a 
  * future version.
  *
  * @param node {T} Reference to an input node for comparison
  */
  public compareTo(node: TSMT$BTreeNode<T>): number
  {
    if (node == undefined || node == null)
      return NaN;

    return  this.value < node.value ? -1 : this.value == node.value ? 0 : 1;
  }

 /**
  * Clone this node
  */
  public clone(): TSMT$BTreeNode<T>
  {
    const node: TSMT$BTreeNode<T> = new TSMT$BTreeNode<T>();
    node.id                       = this.id;
    node.left                     = this.left;
    node.right                    = this.right;
    node.parent                   = this._parent;
    node.balance                  = this._balance;
    node.data                     = this._data;

    return node;
  }
}