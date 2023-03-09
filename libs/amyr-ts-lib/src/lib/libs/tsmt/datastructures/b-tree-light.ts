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
 * Typescript Math Toolkit: Lightweight (insert-only) binary tree.  This version computes balance factors on insertion, so it can be used to see how well or poorly
 * a classic binary tree is balanced for a particular situation.  It is largely provided for experimental and information-gathering applications.
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */

 import {TSMT$BTreeNode} from './b-tree-node';
 import {TSMT$IBTree   } from './ibtree';

 export class TSMT$BTreeLight<T> implements TSMT$IBTree<T>
 {
   protected _root: TSMT$BTreeNode<T> | null;        // reference to root of the AVL Tree
   protected _size: number;                         // size of tree or total number of nodes

 /**
  * Construct a new TSMT$BTreeLight<T>
  */
   constructor()
   {
     this._root = null;
     this._size = 0;
   }

  /**
   * Access the size or number of nodes in the TSMT$AVLTree
   */
   public get size(): number
   {
     return this._size;
   }

  /**
   * Access the root node in the TSMT$AVLTree
   */
   public get root(): TSMT$BTreeNode<T> | null
   {
     return this._root;
   }

  /**
   * Insert a node into the tree
   *
   * @param node {TSMT$BTreenode<T>} Reference to node to be inserted
   */
   public insert(node: TSMT$BTreeNode<T>): void
   {
     if (node != null && node != undefined)
     {
       if (this._root == null)
       {
         this._root = node;
         this._size = 1;
       }
       else
       {
         let n: TSMT$BTreeNode<T> | null = this._root;
         let finished                    = false;

         let parent: TSMT$BTreeNode<T> | null;
         let dir: number;

         while (!finished)
         {
           if (n === node)
             finished = true;
           else
           {
             parent = n;
             dir    = node.compare(n as TSMT$BTreeNode<T>);
             n      = (n as TSMT$BTreeNode<T>).getChild(dir);

             // insert or continue to traverse?
             if (n == null)
             {
               node.parent = parent;
               (parent as TSMT$BTreeNode<T>).setChild(dir, node);

               this.__adjustBalancePostInsert(node, dir);

               finished = true;
               this._size++;
             }
           }
         } // end traversal
       }
     }
   }

   // post-insertion balance update
   protected __adjustBalancePostInsert(root: TSMT$BTreeNode<T>, dir:number): void
   {
     let parent: TSMT$BTreeNode<T> | null = root.parent;

     if (parent == null) return;

     // walk back up to root of tree
     let node: TSMT$BTreeNode<T>
     let add: number = dir == 0 ? -1 : 1;

     while (parent != null)
     {
       parent.balance = parent.balance + add;
       node           = parent;

       if (parent.balance == 0)
         parent = null;  // remainder of tree should be okay
       else
       {
         parent = parent.parent;

         if (parent != null) add = parent.left === node ? -1 : 1;
       }
     }
   }

  /**
   * Create a new tree from a sequential list of values
   *
   * @param values {Array<T>} Array of raw values
   */
   public fromArray(values: Array<T>): void
   {
     if (values != null && values != undefined && values.length && values.length > 0)
     {
       this.clear();

       const len: number = values.length;
       let i: number;
       let n: TSMT$BTreeNode<T>;

       for (i=0; i<len; ++i)
       {
         n    = new TSMT$BTreeNode<T>(values[i]);
         n.id = this._size.toString();

         this.insert(n);
       }
     }
   }

  /**
   * Clear the current tree  (all node references are nulled, the tree root is nulled, and tree size set to zero)
   */
   public clear()
   {
     if (this._size > 0)
     {
       this.__clear(this._root);

       this._size = 0;
       this._root = null;
     }
   }

   protected __clear(node: TSMT$BTreeNode<T> | null): void
   {
     if (node != null)
     {
       this.__clear(node.left);
       this.__clear(node.right);

       node = null;
     }
   }
 }
