/**
 * Copyright 2017 Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
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
 * Typescript Math Toolkit:  Minimal implementation of an internal skip list node.  Although not strictly necessary,
 * the list is doubly-linked at each level for added flexibility.
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */

export interface TSMT$ISkipListNode
{
  key: string;                       // utils key or id for this node
  value: number;                     // node value (in future will likely be an IComparable)
  aux: object;                       // some auxiliary data that is store with the node
  level?: number;                    // optional level number (zero-based) that can be used for level-related optimization
  prev: TSMT$ISkipListNode | null;   // previous node in list (null if head)
  next: TSMT$ISkipListNode | null;   // next node in list (null if tail)
  up: TSMT$ISkipListNode   | null;   // node one level down (null if none exists)
  down: TSMT$ISkipListNode | null;   // node one level up in list (null if none exists)
}

/**
 * Typescript Math Toolkit:  Skip list node data that is returned to the user (this does not expose the grid linkage
 * which maintains immutability of the internal list structure)
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/))
 *
 * @version 1.0
 */
export interface TSMT$ISkipListData
{
  key: string;                // utils key or id for this node
  value: number;              // node value (in future will likely be an IComparable)
  aux: object;                // some auxiliary data that is store with the node

  up?: string;                // optional information about up-linkage
  dn?: string;                // optional information about down-linkage
}
