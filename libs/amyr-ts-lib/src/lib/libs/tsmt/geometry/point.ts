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
 * AMYR Library: PlanarPoint: Representation of and computations on a point in the plane.
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */
export class PlanarPoint
{
  protected _x: number;
  protected _y: number;
  protected _invalidated: boolean;
  protected _norm: number;

  constructor(x: number=0, y: number=0)
  {
    this._x           = x;
    this._y           = y;
    this._invalidated = true;
    this._norm        = this.length();
  }

  /**
   * Return a copy of the current Point
   */
  public clone(): PlanarPoint
  {
    return new PlanarPoint(this._x, this._y);
  }

  /**
   * Access the current x-coordinate
   */
  public get x(): number
  {
    return this._x;
  }

  /**
   * Set the current x-coordinate
   *
   * @param {number} value x-coordinate value
   */
  public set x(value: number)
  {
    this._x = this.__assign(value);
    this._invalidated = true;
  }

  // just in case
  private __assign(value: any): number
  {
    let t = 0;
    switch (typeof value)
    {
      case "number":
        return !isNaN(value) && isFinite(value) ? value : 0;

      case "string":
        t = parseFloat(value);
        return !isNaN(t) ? t : 0;

      case "boolean":
        return value ? 0 : 1;
    }

    return <number> value;
  }

  /**
   * Access the current y-coordinate
   */
  public get y(): number
  {
    return this._y;
  }

  /**
   * Assign the current y-coordinate
   *
   * @param {number} y y-coordinate value
   */
  public set y(value: number)
  {
    this._y = this.__assign(value);
    this._invalidated = true;
  }

  /**
   * Return the Euclidean length or l-2 norm of the Point
   */
  public length()
  {
    if (this._invalidated)
    {
      this._norm        = Math.sqrt(this._x*this._x + this._y*this._y);
      this._invalidated = false;
    }

    return this._norm;
  }

  /**
   * Return the l-1 norm of the Point (interpreted as a vector in 2D space)
   */
  public l1Norm(): number
  {
    return Math.abs(this._x) + Math.abs(this._y);
  }

  /**
   * Return the l-infinity norm of the Point (interpreted as a vector in 2D space)
   */
  public lInfNorm(): number
  {
    const absX = Math.abs(this._x);
    const absY = Math.abs(this._y);

    return Math.max( absX, absY );
  }

  /**
   * Return the Euclidean distance between the current Point and an input Point
   *
   * @param {PlanarPoint} point Input Point
   */
  public distance(point: PlanarPoint): number
  {
    const dx = point.x - this._x;
    const dy = point.y - this._y;

    return Math.sqrt(dx*dx + dy*dy);
  }

  /**
   * Compute dot or inner product of the current Point and another Point (both Points interpreted as vectors with
   * the origin as initial points)
   *
   * @param {PlanarPoint} point Input Point
   */
  public dot(point: PlanarPoint): number
  {
    return this._x*point.x + this._y*point.y;
  }

  /**
   * Cross or outer product of the current Point and another Point (both Points interpreted as vectors with the origin
   * as initial points). Mathematically, the outer product is a vector that is normal to the two input vectors whose
   * direction is computed via the right-hand rule.  This method returns the magnitude of that vector.
   *
   * @param point: Point - Input Point
   */
  public cross(point: PlanarPoint): number
  {
    return this._x*point.y - this._y*point.x;
  }

  /**
   * Return a {string} representation of the current point - "(x, y)" where 'x' and 'y' are replaced by {string}
   * representations of the x- and y-coordinates
   */
  public toString(): string
  {
    const s1: string = this._x.toString();
    const s2: string = this._y.toString();

    return "(" + s1 + " , " + s2 + ")";
  }
}
