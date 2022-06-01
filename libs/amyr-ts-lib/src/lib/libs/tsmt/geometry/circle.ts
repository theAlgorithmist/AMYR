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
 * AMYR Library: A Circle class that may be used in a variety of applications that require circles,
 * typically as a bounding region.  A rectangular region may be defined for the circle location (in Canvas or
 * user coordinates) and the class automatically updates quadrant location when the Circle is moved.
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */
export class Circle
{
  // public properties
  public id: string;            // id assigned to this circle

  // internal properties
  protected _radius: number;    // radius
  protected _x: number;         // x-coordinate of center
  protected _y: number;         // y-coordinate of center

  // coordinate bounding-box in which this circle exists
  protected _left: number;
  protected _right: number;
  protected _top: number;
  protected _bottom: number;

  protected _xc: number;        // x-coordinate of AABB midpoint
  protected _yc: number;        // y-coordinate of AABB midpoint
  protected _yDown: boolean;    // true if coordinate system is y-down, false if y-up

  // in quadrant?
  protected _q1: boolean;       // true if this circle's interior lies in quadrant 1
  protected _q2: boolean;       // true if this circle's interior lies in quadrant 2
  protected _q3: boolean;       // true if this circle's interior lies in quadrant 3
  protected _q4: boolean;       // true if this circle's interior lies in quadrant 4

  constructor()
  {
    this.id = '0';
    this._radius = 1;
    this._x      = 0;
    this._y      = 0;

    this._left   = 0;
    this._right  = 0;
    this._top    = 0;
    this._bottom = 0;
    this._xc     = 0;
    this._yc     = 0;

    this._q1    = false;
    this._q2    = false;
    this._q3    = false;
    this._q4    = false;
    this._yDown = true;
  }

  /**
   * Access the radius of this Circle
   */
  public get radius(): number
  {
    return this._radius;
  }

  /**
   * Set the Circle radius
   *
   * @param {number} value Radius value (must be greater than zero)
   */
  public set radius(value: number)
  {
    this._radius = isNaN(value) || value <= 0 ? this._radius : value;

    this.__update();
  }

  /**
   * Access the x-coordinate of this Circle's center
   */
  public get x(): number
  {
    return this._x;
  }

  /**
   * Set the x-coordinate of the Circle center
   *
   * @param value : number - x-coordinate of the Circle center
   */
  public set x(value: number)
  {
    this._x = isNaN(value) ? this._x : value;

    this.__update();
  }

  /**
   * Access the y-coordinate of this Circle's center
   */
  public get y(): number
  {
    return this._y;
  }

  /**
   * Set the y-coordinate of the Circle center
   *
   * @param {number} value y-coordinate of the Circle center
   */
  public set y(value: number)
  {
    this._y = isNaN(value) ? this._y : value;

    this.__update();
  }

  /**
   * Assign a rectangular visible region for this Circle. The AABB for the Circle typically represents a visible
   * space in which the Circle is expected to move.  The (approximate) quadrants the Circle overlaps are computed
   * whenever the center-coordinates or radius are changed.
   *
   * @param {number} left x-coordinate of (left,top) corner
   *
   * @param {number} top y-coordinate of (left,top) corner
   *
   * @param {number} right x-coordinate of (right,bottom) corner
   *
   * @param {number} bottom y-coordinate of (right,bottom) corner
   */
  public setBounds(left: number, top: number, right: number, bottom: number): void
  {
    this._left   = isNaN(left) ? this._left : left;
    this._top    = isNaN(top) ? this._top : top;
    this._right  = isNaN(right) ? this._right : right;
    this._bottom = isNaN(bottom) ? this._bottom : bottom;

    this._xc = 0.5*(this._left + this._right);
    this._yc = 0.5*(this._bottom + this._top);

    this._yDown = this._bottom > this._top;

    this.__update();
  }

  /**
   * Query whether or not a circle is in a specific quadrant, relative to the visible region assigned to the Circle.
   * Note that the test is based on the AABB for the Circle, not the actual Circle geometry.  This trades a small
   * inaccuracy for increased computational efficiency. Returns {true} if any part of the Circle overlaps the specified
   * quadrant, relative to the view bounds, not the global coordinate space.
   *
   * @param {number} quad Quadrant number ( MUST be 1, 2, 3, or 4 )
   */
  public inQuadrant(quad: number): boolean
  {
    switch (quad)
    {
      case 1:
        return this._q1;
        break;

      case 2:
        return this._q2;
        break;

      case 3:
        return this._q3;
        break;

      case 4:
        return this._q4;
        break;

      default:
        return false;
    }
  }

  // update the approximate quadrant overlap for the Circle
  protected __update():void
  {
    if ((this._left == this._right) || (this._top == this._bottom) || this._radius < 0) return;

    // determine quadrant overlap by AABB, not strict geometric intersection w/axes.  This is slightly less
    // accurate, but computationally cheap.
    const xpr: number  = this._x + this._radius;
    const xmr: number  = this._x - this._radius;

    const xgt: boolean = xpr >= this._xc && xmr <= this._right;
    const xlt: boolean = xmr <= this._xc && xpr >= this._left;

    const ypr: number = this._y + this._radius;
    const ymr: number = this._y - this._radius;

    let yhigh: boolean;
    let ylow: boolean;

    if (this._yDown)
    {
      yhigh = ymr <= this._yc && ypr >= this._top;
      ylow  = ypr >= this._yc && ymr <= this._bottom;
    }
    else
    {
      yhigh = ypr >= this._yc && ymr <= this._top;
      ylow  = ymr <= this._yc && ypr >= this._bottom;
    }

    this._q1 = xgt && yhigh;
    this._q2 = xgt && ylow;
    this._q3 = xlt && ylow;
    this._q4 = xlt && yhigh;
  }
}
