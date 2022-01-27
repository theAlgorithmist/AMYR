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
 * Typescript Math Toolkit: Binary Tree Interface - minimal methods required for a binary tree implementation
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 * 
 * @version 1.0
 */

 import {TSMT$BTreeNode} from './b-tree-node';

 export interface TSMT$IBTree<T>
 {
   size: number;

   root: TSMT$BTreeNode<T> | null;

   insert(node:TSMT$BTreeNode<T>): void;

   fromArray(values: Array<T>): void;

   clear(): void;
 }