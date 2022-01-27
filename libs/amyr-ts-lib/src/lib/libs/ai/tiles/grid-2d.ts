/**
 * Copyright 2020 Jim Armstrong (www.algorithmist.net)
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
 *
 * This software is derived from that bearing the following copyright notice
 *
 * ------
 * copyright (c) 2012, Jim Armstrong.  All Rights Reserved.
 *
 * THIS SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * This software may be modified for commercial use as long as the above copyright notice remains intact.
 */

import { IGridView } from '../pathfinding/interfaces/grid-view-model';

import { CELL_TYPE } from '../pathfinding/interfaces/cell-type';

import { TileNode } from './tile-node';

/**
 * A 2D grid-based layout of grid tiles or nodes for use in 2D pathfinding with tiles.  This helper class
 * serves as an intermediary between the visual representation of a game grid and its logical separation
 * into a 2D array of tiles.  An optional view may be associated with the grid, which allows visual updates
 * to be performed in tandem with mutations of the logical grid structure.  This allows different renderers
 * to function with the same tile setup, i.e. substitute and SVG-based {GridView} for the current Canvas-
 * based {GridView}.
 *
 * @author Jim Armstrong
 *
 * @version 1.0
 */
export class Grid2D
{
  // number of rows and columns
  protected _numRows: number;
  protected _numCols: number;

  // 2D array of tiles
  protected _nodeList: Array<Array<TileNode>>;

  // allow a view to be associated with this grid for better performance
  protected _gridView!: IGridView;

  // cache start and target nodes of the grid
  protected _startNode: TileNode | null;
  protected _targetNode: TileNode | null;

  /**
   * Construct a new {Grid2D}
   *
   * @param rows Number of rows in the grid (greater than zero)
   *
   * @param cols Number of columns in the grid (greater than zero)
   */
  constructor(rows: number, cols: number)
  {
    // number of rows and columns in the 2D Grid
    this._numRows = !isNaN(rows) && rows >= 0 ? rows : 0;
    this._numCols = !isNaN(cols) && cols >= 0 ? cols : 0;

    // the node list for this 2D Grid
    this._nodeList = [];

    // record start and target nodes for any path through the grid
    this._startNode  = null;
    this._targetNode = null;

    // initialize the grid
    let i: number;
    let j: number;
    let t: TileNode;

    for (i = 0; i < this._numRows; ++i)
    {
      this._nodeList[i] = [];

      for (j = 0; j < this._numCols; ++j )
      {
        t    = new TileNode(i, j);
        t.id = i + " " + j;

        this._nodeList[i][j] = t;
      }
    }
  }

 /**
  * Access the number of rows
  */
  public get numRows()
  {
    return this._numRows
  }

 /**
  * Access the number of columns
  */
  public get numCols()
  {
    return this._numCols;
  }

 /**
  * Access the current start node
  */
  public get startNode(): TileNode | null
  {
    return this._startNode;
  }

 /**
  * Access the current target node
  */
  public get targetNode(): TileNode | null
  {
    return this._targetNode;
  }

 /**
  * Access the TileNode at the specified x-y grid location
  *
  * @param {number} i Row number in the grid
  *
  * @param {number} j Column number in the grid
  *
  */
  public getNode(i: number, j: number): TileNode | null
  {
    if (i >= 0 && i <= this._numRows)
    {
      if (j >= 0 && j <= this._numCols)
        return this._nodeList[i][j];
      else
        return null;
    }
    else
      return null;
  }

  /**
   * Assign an optional grid view to this 2D grid
   *
   * @param {IGridView} grid view reference
   *
   */
  public set gridView(view: IGridView)
  {
    if (view !== undefined && view != null) {
      this._gridView = view;
    }
  }

 /**
  * Set a particular tile (or node) in the grid as reachable or not (all tiles are reachable by default, on construction)
  *
  * @param {number} i row coordinate
  *
  * @param {number} j column coordinate
  *
  * @param {boolean} reachable True if the node is reachable.
  *
  */
  public isReachable(i: number, j: number, reachable: boolean): void
  {
    if (i >= 0 && i <= this._numRows)
    {
      if (j >= 0 && j <= this._numCols)
      {
        this._nodeList[i][j].reachable = reachable;

        if (this._gridView != null && !reachable) this._gridView.setCell(i, j, CELL_TYPE.BARRIER);
      }
    }
  }

 /**
  * Set a particular tile (or node) in the grid as open or occupied.  The tile visual status is changed provided that the
  * indices are in the proper range and a grid view has been assigned.
  *
  * @param {number} i row coordinate
  *
  * @param {number} j column coordinate
  *
  * @param {boolean} occupied True if the node is occupied, false if open.
  *
  */
  public isOccupied(i: number, j: number, occupied: boolean): void
  {
    if (i >= 0 && i <= this._numRows)
    {
      if (j >= 0 && j <= this._numCols)
      {
        const indicator: CELL_TYPE = occupied ? CELL_TYPE.OCCUPIED : CELL_TYPE.OPEN;

        if (this._gridView != null) this._gridView.setCell(i, j, indicator);
      }
    }
  }

 /**
  * Set a particular tile (or node) in the grid as hazardous or high-cost to cross
  *
  * @param {number} i row coordinate
  *
  * @param {number} j column coordinate
  *
  * @param {number} cost Cost multiplier of the node.
  *
  */
  public isHazard(i: number, j: number, cost: number): void
  {
    if (i >= 0 && i <= this._numRows)
    {
      if (j >= 0 && j <= this._numCols)
      {
        this._nodeList[i][j].multiplier = cost;

        if (this._gridView != null) this._gridView.setCell(i, j, CELL_TYPE.HIGH_COST);
      }
    }
  }

 /**
  * Assign the start node from one of the nodes in the grid
  *
  * @param {number} i row coordinate
  *
  * @param {number} j column coordinate
  */
  public setStartNode(i: number, j: number): void
  {
    if (i >= 0 && i <= this._numRows)
    {
      if (j >= 0 && j <= this._numCols)
      {
        this._startNode = this._nodeList[i][j];

        if( this._gridView ) this._gridView.setCell(i, j, CELL_TYPE.START);
      }
    }
  }

 /**
  * Assign the target node from one of the nodes in the grid
  *
  * @param {number} i row coordinate
  *
  * @param {number} j column coordinate
  */
  public setTargetNode(i: number, j: number): void
  {
    if (i >= 0 && i <= this._numRows)
    {
      if (j >= 0 && j <= this._numCols)
      {
        this._targetNode = this._nodeList[i][j];

        if (this._gridView) this._gridView.setCell(i, j, CELL_TYPE.END);
      }
    }
  }
}
