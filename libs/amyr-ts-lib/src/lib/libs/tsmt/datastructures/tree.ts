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
 * Typescript Math Toolkit: General Tree.  A tree has a root node and both the root and subsequent nodes may have an
 * arbitrary number of child nodes.  Most of the actual tree 'construction' is performed directly on Tree Nodes
 * (instances of TSMT$TreeNode<T>).  This class facilitates creating a root and provides a rich set of methods for
 * searching and traversing the tree.
 *
 * Insertion into a tree may be ordered or unordered, which sets the 'ordered' flag of any newly created node.  This
 * means that all subsequent child additions to that node are automatically positioned LTR in order of increasing
 * node value.  Ordering only applies to the direct children of a given node; there is no implied global ordering
 * imposed across the entire tree.  Ordering is set to true by default.
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 * 
 * @version 1.0
 */

 import {TSMT$ITreeList, TSMT$TreeNode} from './tree-node';

 export class TSMT$Tree<T>
 {
   protected _root: TSMT$TreeNode<T> | null;    // reference to root of the AVL Tree
   protected _size: number;                     // size of tree or total number of nodes
   protected _ordered: boolean;                 // true if children of a given node are inserted in order of increasing value

   // cache the most recently requested traversal for apps. where multiple traversals of the same type are
   // requested at different places.  this is experimental and may or may not survive a future release.
   protected _path: Array<TSMT$TreeNode<T>>;

 /**
  * Construct a new TSMT$Tree<T>
  *
  * @return nothing A new tree is created of the specified type
  */
   constructor()
   {
     this._root    = null;
     this._size    = 0;
     this._ordered = true;
     this._path    = [];
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
   public get root(): TSMT$TreeNode<T> | null
   {
     return this._root;
   }

  /**
   * Assign the root node with an already created tree node.  This overrides any prior root setting, so clear an already
   * constructed tree before resetting the root
   *
   * @param {TSMT$TreeNode<T>} Reference to already created node to serve as the tree root
   */
   public set root(node: TSMT$TreeNode<T> | null)
   {
     if (node !== undefined && node != null && node instanceof TSMT$TreeNode)
     {
       this._root         = node;
       this._root.ordered = this._ordered;
 
       // tree size is now same as root node size
       this._size = node.size;
     }
   }   

   /**
    * Access whether or not direct tree children maintain ordered child insertion
    */
   public get ordered(): boolean
   {
     return this._ordered;
   }

  /**
    * Assign whether or not direct tree children maintain ordered child insertion
    *
    * @param {boolean} value True if the tree is ordered, meaning that all direct children are inserted in order of increasing
    * node value
    */
    public set ordered(value: boolean)
    {
      this._ordered = value === true ? true : false;
    }
    
   /**
    * Access the height of a this tree
    *
    * @returns number Height of this tree; the height of a null or singleton root is zero
    */
   public get height(): number
   {
     if (this._root == null || !this._root.hasChildren) return 0;

     return this._root.height;
   }

   /**
    * Access the number of levels of this tree.  A null root has zero levels.  A singleton (root) has one level.
    * A root with one level of children has a total of two levels, and so on.
    */
   public get levels(): number
   {
     if (this._root == null) return 0;

     return 1 + this.height;
   }

   /**
    * Create the root node from an id and node value. This overrides any prior root setting, so clear an already
    * constructed tree before resetting the root.  Returns {null} if data is invalid.
    *
    * @param {string} id Root node id
    */
   public setRoot(id: string, value: T): TSMT$TreeNode<T> | null
   {
     if (id !== undefined && id != '' && value !== undefined)
     {
       const node: TSMT$TreeNode<T> = new TSMT$TreeNode<T>(value);
       node.id                      = id;
       node.ordered                 = this._ordered;
       this._root                   = node;

       this._size++;

       return node;
     }

     return null;
   }

  /**
   * Clear the current tree (all node references are nulled, the tree root is nulled, and tree size set to zero)
   */
   public clear(): void
   {
     if (this._size > 0) 
     {
       if (this._root != null)
       {
         this._root.clear();

         this._root = null;
       }

       this._size = 0;
       this._root = null;
     }
   }

  /**
   * Insert a node into the tree by id & value as a child of the specified parent.  Returns a reference to the newly created node or 
   * {null} if inputs are invalid.  If the parent is not provided and the root has already been assigned, this method returns {null}.
   *
   * @param {string} id Node id
   *
   * @param {T} value Node data
   *
   * @param {TSMT$TreeNode<T>} parent Optional parent for the newly created node; if undefined and root node has
   * not been assigned, this will automatically create and assign the root node
   */
   public insert(id: string, value: T, parent?: TSMT$TreeNode<T> | null): TSMT$TreeNode<T> | null
   {
     if (value != null && value != undefined && id !== undefined && id != '')
     {
       if (parent !== undefined && parent != null)
       {
         const node: TSMT$TreeNode<T> = new TSMT$TreeNode<T>(value);
         node.id                      = id;
         node.ordered                 = this._ordered;

         parent.addChild(node);

         this._size++;

         return node;
       }
       else
       {
         if (this._root == null)
         {
           this._root         = new TSMT$TreeNode<T>(value);
           this._root.id      = id;
           this._root.ordered = this._ordered;

           this._size++;

           return this._root;
         }
       }
     }

     return null;
   }

  /**
   * Delete a node into the tree with the specified id.  If node is found in the tree with the specified id, that node 
   * (and by extension, its subtree) is deleted from the tree.  That node and all children are automatically cleared and 
   * prepared for garbage collection.
   * 
   * @param {string} id Node id
   */
   public delete(id: string): void
   {
     if (id !== undefined && id != '' && this._root != null)
     {
       const node: TSMT$TreeNode<T> | null = this.find(id);

       if (node != null)
       {
         // if the node has a parent, it must be deleted from that parent in order to fix the child list
         if (node.parent != null) node.parent.deleteChild(node);

         // was the root deleted?
         if (id == this._root.id)
         {
           this._root = null;
           this._size = 0;
         }
         else
         {
           // update the tree size
           this._size = this._root.size;
         }
       }
     }
   }

  /**
   * Find an item with a specified id in a subtree
   *
   * @param id: string id
   * 
   * @param root: TSMT$BTreeNode<T> optional root node for the search - defaults to tree root
   *
   * @return TSMT$BTreeNode<T> Node with the specified value or null if not found
   */
   public find(id: string, root?: TSMT$TreeNode<T>): TSMT$TreeNode<T> | null
   {
     if (this._root == null) return null;

     if (root == null || root === undefined) root = this._root;

     if (root.id == id) return root;

     let list: TSMT$ITreeList<T> = root.head;
     let node: TSMT$TreeNode<T> | null;

     while (list.next != null)
     {
       node = list.node as TSMT$TreeNode<T>;
       if (node.id == id) return node;

       if (node.hasChildren)
       {
         node = this.find(id, node) as TSMT$TreeNode<T>;

         if (node != null) return node;
       }

       list = list.next;
     }

     if (root?.tail?.node?.id == id) return root.tail.node;

     if (root?.tail?.node?.hasChildren)
     {
       node = this.find(id, root.tail.node);

       if (node != null) return node;
     }

     return null;
   }

   /**
    * Perform a preorder traversal. starting at the input node and return the node path in an array
    *
    * @param {TSMT$TreeNode<T>} Optional reference to starting node, defaults to root if not supplied
    */
   public preorder(node?: TSMT$TreeNode<T>): Array<TSMT$TreeNode<T>>
   {
     if (this._root == null) return [];

     // note: caching is not yet implemented
     if (node === undefined) node = this._root;

     this._path = new Array<TSMT$TreeNode<T>>();

     this.__preorderTraversal(node);

     return this._path.slice();
   }

   /**
    * Compute pre-order path
    *
    * @param {TSMT$TreeNode<T>} node Reference to current node in traversal
    *
    * @private
    */
   protected __preorderTraversal(node: TSMT$TreeNode<T> | null)
   {
     if (node == null) return;

     this._path.push(node);

     let list: TSMT$ITreeList<T> = node.head;

     while (list.next != null)
     {
       this.__preorderTraversal(list.node);

       list = list.next;
     }

     if (node.tail.node) this.__preorderTraversal(node.tail.node);
   }

   /**
    * Perform a postorder traversal. starting at the input node and return the node path in an array
    *
    * @param {TSMT$TreeNode<T>} Optional reference to starting node, defaults to root if not supplied
    */
   public postorder(node?: TSMT$TreeNode<T>): Array<TSMT$TreeNode<T>>
   {
     if (this._root == null) return [];

     // note: caching is not yet implemented
     if (node === undefined) node = this._root;

     this._path = new Array<TSMT$TreeNode<T>>();

     this.__postorderTraversal(node);

     return this._path.slice();
   }

   /**
    * Recursively compute post-order path
    *
    * @param node: TSMT$TreeNode<T> Reference to current node in traversal
    *
    * @private
    */
   protected __postorderTraversal(node: TSMT$TreeNode<T> | null)
   {
     if (node == null) return;

     let list: TSMT$ITreeList<T> = node.head;

     while (list.next != null)
     {
       this.__postorderTraversal(list.node);

       list = list.next;
     }

     if (node.tail.node) this.__postorderTraversal(node.tail.node);

     this._path.push(node);
   }

   /**
    * Perform a breadth-first or level traversal, starting at the input node, and return the node path in an array
    *
    * @param {TSMT$TreeNode<T>} node Optional reference to starting node - defaults to tree root
    */
   public levelOrder(node?: TSMT$TreeNode<T>): Array<TSMT$TreeNode<T>>
   {
     if (this._root == null) return [];

     if (node == undefined) node = this._root;

     if (node == null ) return [];

     this._path                          = new Array<TSMT$TreeNode<T>>();
     const list: Array<TSMT$TreeNode<T>> = new Array<TSMT$TreeNode<T>>();

     list.push(node);
     let n: TSMT$TreeNode<T>;

     while (list.length > 0)
     {
       n = list.shift() as TSMT$TreeNode<T>;
       this._path.push(n);

       if (n.hasChildren)
       {
         let nodeList: TSMT$ITreeList<T> = n.head;

         while (nodeList.next != null)
         {
           list.push(nodeList.node as TSMT$TreeNode<T>);

           nodeList = nodeList.next;
         }

         // tail
         list.push(nodeList.node as TSMT$TreeNode<T>);
       }
     }

     return this._path.slice();
   }
 }