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

import { TSMT$BTreeNode } from '../b-tree-node';

/**
 * Recursive (in-place) implementation of a binary tree inversion (I prefer to call it a reverse)
 *
 * @param root {TSMT$BTreeNode<T>} Root node
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 */
export function invert<T>(root: TSMT$BTreeNode<T> | null): TSMT$BTreeNode<T> | null
{
  if (root == null) return null;

  const right: TSMT$BTreeNode<T> = invert(root.right) as TSMT$BTreeNode<T>;
  const left: TSMT$BTreeNode<T>  = invert(root.left) as TSMT$BTreeNode<T>;

  root.left  = right;
  root.right = left;

  return root;
}