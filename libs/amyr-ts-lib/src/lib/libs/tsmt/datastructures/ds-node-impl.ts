/**
 * Copyright 2018 Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
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
 * Typescript Math Toolkit: Concrete (and cloneable) implementation of the TSMT$ISkipListNode interface.
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */

import {TSMT$IDSNode} from "./ds-node";

export class TSMT$DSNode implements TSMT$IDSNode
{
  public key: string;                   // utils key or id for this node (MUST be unique)
  public value: number | string;        // node value (in future will likely be an IComparable)
  public rank: number;                  // if this is the representative node in a set, this represents the rank of that set
  public data: object;                  // auxiliary data associated with this node
  public parent: TSMT$IDSNode | null;   // parent reference
  public next: TSMT$IDSNode | null;     // next node in list (circularly wraps to root)

 /**
  * Construct a new {TSMT$DSNode}
  *
  * @param {string} id Optional key or id property
  */
  constructor(id?: string)
  {
    this.key    = id ? id : '';
    this.data   = {};
    this.value  = '';
    this.rank   = -1;     // greater than zero only if this is the representative node of a set
    this.next   = null;
    this.parent = null;
  }

 /**
  * Clone a single {TSMT$DSNode}
  */
  public clone(): TSMT$DSNode
  {
    const node: TSMT$DSNode = new TSMT$DSNode();

    node.key    = this.key;
    node.value  = this.value;
    node.rank   = this.rank;
    node.data   = JSON.parse(JSON.stringify(this.data));
    node.next   = this.next;
    node.parent = this.parent;

    return node;
  }

 /**
  * Clone an entire set of nodes, i.e. traverse the circular linkage from head to tail and return a complete copy of
  * the entire set of linked nodes
  */
  public cloneSet(): TSMT$DSNode
  {
    // the 'tree' is represented in reverse structure, i.e. children pointing to a common parent, so the linkage
    // provides a traversal of the full tree.  this is more like cloning a linked list.
    const clone: TSMT$DSNode = this.clone();
    let node: TSMT$DSNode    = <TSMT$DSNode> this.next;
    let cloned: TSMT$DSNode  = clone;

    while (!node.isEqual(this))
    {
      cloned.next = node.clone();
      node        = <TSMT$DSNode> node.next;
      cloned      = <TSMT$DSNode> cloned.next;
    }

    // complete the proper circular linkage
    cloned.next = clone;

    return clone;
  }

 /**
  * Determine if two nodes are equal. Default test is equal {key} properties; subclass and implement other logic as needed.
  *
  * @param {TSMT$DSNode} node Node to compare against this node
  *
  */
  public isEqual(node: TSMT$DSNode): boolean
  {
    // two nodes are considered equal if they have the exact same ID
    return node && (node.key === this.key);
  }
}
