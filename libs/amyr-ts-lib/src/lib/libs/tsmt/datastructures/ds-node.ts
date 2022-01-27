/** 
 * Copyright 2018 Jim Armstrong (www.algorithmist.net)
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

import {TSMT$DSNode} from "./ds-node-impl";

/**
 * Typescript Math Toolkit:  Minimal implementation of a disjoint set node
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 * 
 * @version 1.0
 */

export interface TSMT$IDSNode
{
  key: string;                           // general key or id for this node
  value?: number | string;               // node value
  rank: number;                          // if this is the representative node in a set, this represents the rank of that set
  data?: object;                         // some auxiliary data that is store with the node
  parent: TSMT$IDSNode | null;           // reference to parent of this node
  next: TSMT$IDSNode | null;             // next node in the set (circularly links back to root)

  isEqual(node: TSMT$DSNode): boolean;   // returns true if two nodes are equal
}