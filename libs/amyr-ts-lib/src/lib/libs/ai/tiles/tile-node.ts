/**
 * Copyright 2020 Jim Armstrong
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
 */

/**
 * This functions as a game tile, but in A* parlance, it's a Node.  So, we'll split the difference and
 * call it a TileNode. This is largely a placeholder for values/functions/etc important to a tile.  There is
 * no post-construction error-checking for performance reasons.
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */
export class TileNode
{
  public reachable: boolean;              // true if this tile is reachable
  public id: string;                      // tile id
  public parent: TileNode | null;         // tile's parent if it is on the optimal path

  // A* properties - public for performance reasons
  public f: number;
  public g: number;
  public h: number;

  protected _row: number;                 // row index of this tile in a 2D grid
  protected _col: number;                 // column index of this tile in a 2D grid
  protected _value: number;               // numerical value associated with the tile
  protected _multiplier: number;          // tile multiplier for pathfinding purposes

  constructor(rowVal: number, colVal: number)
  {
    // grid coordinates in the grid
    this._row = !isNaN(rowVal) && rowVal >= 0 ? rowVal : 0;
    this._col = !isNaN(colVal) && colVal >= 0 ? colVal : 0;

    // this TileNode's id and value properties
    this.id     = "";
    this._value = 0;

    // multiplier onto the cost to visit this node by any distance-based metric.
    this._multiplier = 1.0;

    // is the node reachable?
    this.reachable = true;

    // This TileNode's parent
    this.parent = null;

    this.f = 0;
    this.g = 0;
    this.h = 0;
  }

  /**
   * Access the tile's row index
   */
  public get row(): number
  {
    return this._row;
  }

  /**
   * Access the tile's column index
   */
  public get col(): number
  {
    return this._col;
  }

  /**
   * Access the tile value
   */
  public get value(): number
  {
    return this._value;
  }

  /**
   * Assign an (optional) value to this tile
   *
   * @param {number} v tile value
   */
   public set value(v: number)
   {
     this._value = !isNaN(v) ? v : this._value;
   }  

  /**
   * Access the A* multiplier for this tile
   */
  public get multiplier(): number
  {
    return this._multiplier;
  }

  /**
   * Assign a multiplier to this tile
   *
   * @param {number} value tile multiplier
   */
  public set multiplier(value: number)
  {
    this._multiplier = !isNaN(value) && value > 0 ? value : this._multiplier;
  }
}
