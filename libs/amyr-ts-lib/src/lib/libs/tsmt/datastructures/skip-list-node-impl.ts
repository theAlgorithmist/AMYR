/**
 * Copyright 2017 Jim Armstrong (www.algorithmist.net)
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

import {TSMT$ISkipListNode} from "./skip-list-node";
import {TSMT$ISkipListData} from "./skip-list-node";

export class TSMT$SkipListNode implements TSMT$ISkipListNode
{
  public key: string;                     // utils key or id for this node
  public value: number;                    // node value (in future will likely be an IComparable)
  public aux: object;                      // auxiliary data associated with this node
  public level: number;                    // used for level-related optimization
  public prev: TSMT$SkipListNode | null;   // previous node in list (null if head)
  public next: TSMT$SkipListNode | null;   // next node in list (null if tail)
  public up: TSMT$SkipListNode   | null;   // node one level down (null if none exists)
  public down: TSMT$SkipListNode | null;   // node one level up in list (null if none exists)

  constructor()
  {
    this.key   = '';
    this.aux   = {};
    this.value = 0;
    this.level = 0;
    this.prev  = null;
    this.next  = null;
    this.up    = null;
    this.down  = null;
  }

  public clone(): TSMT$SkipListNode
  {
    const node: TSMT$SkipListNode = new TSMT$SkipListNode();

    node.key   = this.key;
    node.value = this.value;
    node.aux   = JSON.parse(JSON.stringify(this.aux));
    node.prev  = this.prev;
    node.next  = this.next;
    node.up    = this.up;
    node.down  = this.down;

    return node;
  }

  public toData(): TSMT$ISkipListData
  {
    return {
      key: this.key,
      value: this.value,
      aux: this.aux
    }
  }
}
