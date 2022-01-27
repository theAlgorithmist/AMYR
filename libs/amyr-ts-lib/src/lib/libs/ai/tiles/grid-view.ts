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
 * This software is derived from that containing the following copyright notice
 *
 * -----
 *
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

/**
 * A basic view (built on top of a Canvas renderer) of a 2D grid with fixed, square, cells of varying color
 * depending on whether the tiles are open, barriers, occupied (i.e. part of a path), or start/end tiles.
 *
 * NOTE:  Call {drawDefaultGrid} FIRST to set internal default properties that carry over to future cell settings.
 *
 * This is a simple, visual helper intended to help debug tile-based pathfinding heuristics and other
 * game-related methods.  It is not intended for production use.
 *
 * @author by:  Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */

import { IGraphics } from '../../../models/graphics';
import { CELL_TYPE } from '../pathfinding/interfaces/cell-type';
import { IGridView } from '../pathfinding/interfaces/grid-view-model';

export class GridView implements IGridView
{
  protected _width: number;             // cell width
  protected _borderWidth: number;       // border width of a cell
  protected _borderColor: string;       // cell border color
  protected _backGroundColor: string;   // cell background color
  protected _graphics!: IGraphics;      // Graphics context

  /**
   * Construct a new {GridView}
   *
   * @param cellWidth Cell width (must be greater than zero) - currently clipped at 2px
   */
  constructor(cellWidth: number)
  {
    this._width           = Math.max(2, cellWidth);
    this._borderWidth     = 1;
    this._borderColor     = "0x000000";
    this._backGroundColor = "0xcccccc";
  }

  /**
   * Draw the default grid, which sets the internal graphics context reference
   *
   * @param {IGraphics} g Graphics context
   *
   * @param {number} rows Number of rows in the default grid
   *
   * @param {number} cols Number of columns in the default grid
   *
   * @param {number} borderWidth Cell border width in px
   *
   * @param {string} borderColor Cell border color in format appropriate for the rendering environment
   *
   * @param {string} backGroundColor (open) Cell background color in format appropriate for the rendering environment
   */
  public drawDefaultGrid(
    g: IGraphics,
    rows: number,
    cols: number,
    borderWidth: number,
    borderColor: string,
    backGroundColor: string
  ): void
  {
    let i: number;
    let j: number;

    this._borderWidth     = borderWidth;
    this._borderColor     = borderColor;
    this._backGroundColor = backGroundColor;

    this._graphics = g;

    g.beginFill(this._backGroundColor);
    g.drawRect(0, 0, cols*this._width, rows*this._width);
    g.endFill();

    g.lineStyle(this._borderWidth, this._borderColor);

    let len: number = cols*this._width;
    for (i = 0; i < rows; ++i)
    {
      j = i*this._width;
      g.moveTo(0, j);
      g.lineTo(len, j);
    }

    len = rows*this._width;
    for (j = 0; j < cols; ++j)
    {
      i = j*this._width;
      g.moveTo(i, 0);
      g.lineTo(i, len);
    }
  }

  /**
   * Assign a property to a specific cell in the grid; this draws the cell's visual representation
   *
   * @param {number} i row index of the cell
   *
   * @param {number} j column index of the cell
   *
   * @param {CELL_TYPE} type Cell type or property
   */
  public setCell(i: number, j: number, type: CELL_TYPE): void
  {
    if (this._graphics === undefined || this._graphics == null ) return;

    let theColor: string = this._backGroundColor;  // open cell

    switch (type)
    {
      case CELL_TYPE.BARRIER:
        theColor = "0x000000";
        break;

      case CELL_TYPE.OCCUPIED:
        theColor = "0x00ff00";
        break;

      case CELL_TYPE.HIGH_COST:
        theColor = "0xDB2929";
        break;

      case CELL_TYPE.START:
        theColor = "0xFCD116";
        break;

      case CELL_TYPE.END:
        theColor = "0xFCD116";
        break;
    }

    this._graphics.beginFill(theColor);
    this._graphics.drawRect(j*this._width, i*this._width, this._width, this._width);
    this._graphics.endFill();
  }
}
