/**
 * Copyright 2016 Jim Armstrong
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
 * Undo and redo management implemented as a specialized doubly-linked list with insert-and-invalidate capability, i.e.
 * insertion into the list causes the inserted node to become sentinel.
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */
import {
  TSMT$LinkedList,
  LinkedListType
} from "../tsmt/datastructures/linked-list";

export enum UndoRedoTypes
{
  SINGLE = 'Single',
  RANGE  = 'Range'
}

export interface IUndoTransform
{
  (data: Array<number>, params?: object): void;
}

export interface IUndoRedoOperation
{
  forward: IUndoTransform | null;
  inverse: IUndoTransform | null;
  value?: number;
}

export interface ISetParam
{
  (name: string, value:number): void;
}

export interface IUndoListData
{
  type: string;                            // operation type (UndoRedoTypes)

  id?: string;                             // optional id

  nodeTransformType?: string;

  title?: string;                          // optional title

  operation: IUndoRedoOperation;           // operation associated with a single undo/redo node

  params: object;                          // parameter data for this undo/redo node

  start?: number;                          // set start index

  end?: number;                            // set end index

  setParam?: ISetParam;                    // set name-value pair
}

export class TSMT$UndoRedo extends TSMT$LinkedList
{
  protected _curIndex: number;   // index of current location in undo/redo
  protected _levels = 1000;      // number of undo levels

  protected _atBegin = false;    // true if at beginning index or head of list
  protected _atEnd   = false;    // true if at end index or tail of list

  /**
   * Construct a new UndoRedo instance
   *
   * @returns {nothing}
   */
  constructor()
  {
    super();

    this.type      = LinkedListType.DOUBLE;
    this._curIndex = -1;
  }

  /**
   * Access the current undo/redo index.  A return of {-1} means list has yet to be initialized with any nodes
   */
  public get index(): number
  {
    return this._curIndex;
  }

  /**
   * Access the number of undo levels
   *
   * @returns {number}
   */
  public get levels(): number
  {
    return this._levels;
  }

  /**
   * Assign the number of undo/redo levels
   *
   * @param {number} value Number of undo/redo levels, which should be at least 1
   */
   public set levels(value: number)
   {
     this._levels = isNaN(value) || !isFinite(value) || value < 1.5 ? this._levels : Math.round(value);
   }  

  /**
   * Access the beginning undo/redo data
   */
  public get begin(): IUndoListData | null
  {
    return this._head?.data as IUndoListData;
  }

  /**
   * Access the end undo/redo data
   *
   * @returns {IUndoListData}
   */
  public get end(): IUndoListData | null
  {
    return this._tail?.data as IUndoListData;
  }

  /**
   * Add a node to the undo/redo list. This method MUST be used in order for the undo list to work properly; DO NOT use the superclass
   * {add} method
   *
   * @param {string} id Id for this node
   *
   * @param {IUndoListData} data Node data
   */
  public addNode(id: string, data: IUndoListData): void
  {
    if (data !== undefined && data != null)
    {
      if (this.size < this._levels)
      {
        this.add(id, data);

        this._curIndex = this.size - 1;
      }
    }
  }

  /**
   * Insert a node into the undo/redo list and invalidate the remainder of the list.   Nodes past the inserted up to the current tail are deleted and 
   * the inserted node becomes the new tail node
   *
   * @param {string} id Id for this node
   *
   * @param {IUndoListData} data Node data
   */
  public insertAndInvalidate(id: string, data: IUndoListData): void
  {
    if (data === undefined || data == null) {
      return;
    }

    // insert at current index
    if (this._curIndex == this.size-1)
    {
      // insert devolves into an add
      super.add(id, data);

      this._curIndex = this.size-1;
    }
    else
    {
      // insert and then successively delete nodes from the tail
      this.insert(this._curIndex, id, data);

      while (this.size > this._curIndex) {
        this.remove(this.size-1);
      }

      this._curIndex++;
    }
  }

  /**
   * Clear the undo/redo list
   */
  public override clear(): void
  {
    super.clear();

    this._curIndex = -1;
  }

  /**
   * Return the node data for an undo
   *
   * @returns {IUndoListData}
   */
  public undo(): IUndoListData | null
  {
    // edge cases
    if (this.size == 0 || this._atBegin) {
      return null;
    }

    // search caching makes this traversal very efficient
    const data: IUndoListData | null = this.getNode(this._curIndex)?.data as IUndoListData;

    this._curIndex--;
    this._atBegin  = this._curIndex < 0;
    this._atEnd    = false;
    this._curIndex = Math.max(this._curIndex, 0);

    return data;
  }

  /**
   * Return the node data for a redo
   *
   * @returns {IUndoListData}
   */
  public redo(): IUndoListData | null
  {
    // edge cases
    if (this.size == 0 || this._atEnd) {
      return null;
    }

    // search caching makes this traversal very efficient
    const data: IUndoListData = this.getNode(this._curIndex)?.data as IUndoListData;

    this._curIndex++;
    this._atEnd   = this._curIndex >= this.size;
    this._atBegin = false;
    this._curIndex   = Math.min(this._curIndex, this.size-1);

    return data;
  }
}
