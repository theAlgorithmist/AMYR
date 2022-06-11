/**
 * Copyright 2012-2019 Jim Armstrong ()
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
 * AMYR Library: Cubic Bezier Spline. A cubic bezier spline that interpolates a series of points.  Each curve segment in between
 * interpolation points is a cubic Bezier.  Tangents are computed using a control-points manager that computes the control points or
 * geometric constraints for each cubic bezier segment, given the set of interpolation points.  A default manager is created at instantiation
 * that computes tangents that are normal to the angle bisector at each point.  Reflection is used
 * at each endpoints.
 *
 * By default, the spline uses a uniform parameterization when requesting x- and y-coordinates at a natural parameter value, t.  Use the
 * {getTAtS} method to access the natural parameter at a specific arc length and then query x- and y-coordinates.  This is equivalent to
 * using arc-length parameterization on the spline.
 *
 * The spline may be closed.
 *
 * Author Jim Armstrong (www.algorithmist.net)
 *
 * Version 1.0
 *
 */
import { BezierSplineControl } from './bezier-spline-control';
import {
  CubicBezier,
  ControlPoints,
  Point
} from "@algorithmist/amyr-ts-lib";


export class CubicBezierSpline
{
  protected _tangents: BezierSplineControl = new BezierSplineControl(); // spline control points (tangent manager)
  protected _bezier: Array<CubicBezier>;                                // list of each cubic Bezier in the spline

  // interpolation points
  protected _x: Array<number>;
  protected _y: Array<number>;

  // arc length parameterization
  protected _t: number;                             // local parameter value corresponding to input parameter value
  protected _s: number;                             // current normalized arc-length
  protected _index: number;                         // index of cubic segment corresponding to input parameter value
  protected _arcLength: number;                     // current arc length
  protected _invalidated: boolean;                  // true if data change invalidates spline computations

  constructor()
  {
    this._x = new Array<number>();
    this._y = new Array<number>();

    this._bezier      = new Array<CubicBezier>();
    this._t           = 0;
    this._s           = 0;
    this._index       = 0;
    this._arcLength   = 0;
    this._invalidated = true;
  }

  /**
   * Access interpolation point or knot count
   */
  public get numPoints(): number
  {
    return this._x.length;
  }

  /**
   * Access the collection of interpolation points
   */
  public get points(): Array<Point>
  {
    const pointArr: Array<Point> = new Array<Point>();
    let i  = 0;

    while (i < this.numPoints)
    {
      pointArr.push( {x:this._x[i], y:this._y[i]} );
      i++;
    }

    return pointArr;
  }

  /**
   * Access the total arc length of the spline
   */
  public get length(): number
  {
    if (this._invalidated) {
      this.__tangents();
    }

    let i: number;
    const len: number = this._bezier.length;
    this._arcLength   = 0;

    let bezier: CubicBezier;
    for (i = 0; i < len; ++i)
    {
      bezier  = this._bezier[i];

      this._arcLength += bezier.lengthAt(1.0);
    }

    return this._arcLength;
  }

  /**
   * Access a specific cubic bezier segment
   *
   * @param {number} i Segment index in [0, #points-1]
   */
  public getCubicSegment(i: number): CubicBezier | null
  {
    if (this._invalidated )
    {
      this.__tangents();
    }

    return (i >= 0 && i < this._bezier.length ) ? this._bezier[i] : null;
  }

  /**
   * Add a control or interpolation point to the spline
   *
   * @param {number} x x-coordinate of new point
   * @param {number} y y-coordinate of new point
   *
   */
  public addControlPoint(x: number, y: number): void
  {
    this._invalidated = true;

    this._x.push(x);
    this._y.push(y);
  }

  /**
   * Set spline control or interpolation points from arrays
   *
   * @param {number} x x-coordinates of new point set
   *
   * @param {number} y y-coordinates of new point set
   */
  public setData(x: Array<number>, y: Array<number>): void
  {
    this._invalidated = true;

    this._x = x.slice(0);
    this._y = y.slice(0);
  }

  /**
   * Indicate whether or not the spline is to be automatically closed
   */
  public set closed(isClosed: boolean)
  {
    this._tangents.closed = isClosed;
  }

  /**
   * Clear the spline and prepare for new data
   */
  public clear(): void
  {
    this._x.length      = 0;
    this._y.length      = 0;
    this._bezier.length = 0;
    this._t             = 0;
    this._s             = 0;
    this._index         = 0;
    this._arcLength     = 0;
    this._invalidated   = false;
  }

  /**
   * Access the x-coordinate of the spline at a specified natural parameter in [0,1]
   *
   * @param {number} t Natural parameter in [0,1].  The input value is clipped if it is outside this interval
   */
  public getX(_t: number): number
  {
    if (isNaN(_t)) return 0;

    let t: number = Math.max(0,_t);
    t             = Math.min(1,t)

    if (this._invalidated) this.__tangents();

    this.__interval(t);

    const bezier: CubicBezier = this._bezier[this._index];

    return bezier !== undefined ? bezier.getX(this._t) : 0;
  }

  /**
   * Access the y-coordinate of the spline at a specified natural parameter in [0,1]
   *
   * @param {number} t Natural parameter in [0,1].  The input value is clipped if it is outside this interval
   *
   */
  public getY(_t: number): number
  {
    if (isNaN(_t)) return 0;

    let t: number = Math.max(0,_t);
    t            = Math.min(1,t);

    if (this._invalidated) this.__tangents();

    this.__interval(t);

    const bezier: CubicBezier = this._bezier[this._index];

    return bezier !== undefined ? bezier.getY(this._t) : 0;
  }

  /**
   * Access the x-coordinate of the spline's first derivative at a specified natural parameter in [0,1]
   *
   * @param {number} t Natural parameter in [0,1].  The input value is clipped if it is outside this interval
   */
  public getXPrime(_t: number): number
  {
    if (isNaN(_t)) return 0;

    // todo DRY
    let t: number = Math.max(0,_t);
    t             = Math.min(1,t);

    if (this._invalidated) this.__tangents();

    this.__interval(t);

    const bezier: CubicBezier = this._bezier[this._index];

    return bezier !== undefined ? bezier.getXPrime(this._t) : 0;
  }

  /**
   * Access the y-coordinate of the spline's first derivative at a specified natural parameter in [0,1]
   *
   * @param {number} t Natural parameter in [0,1].  The input value is clipped if it is outside this interval
   *
   */
  public getYPrime(_t: number): number
  {
    if (isNaN(_t)) return 0;

    let t: number = Math.max(0,_t);
    t             = Math.min(1,t);

    if (this._invalidated) this.__tangents();

    this.__interval(t);

    const bezier: CubicBezier = this._bezier[this._index];

    return bezier !== undefined ? bezier.getYPrime(this._t) : 0;
  }

  /**
   * Access the x-coordinate at the specified (normalized) arc length along the spline, i.e. s = 0 is zero percent of the length along
   * the spline and 1 is 100 percent of the length along the spline.
   *
   * @param {number} s Normalized arc length in [0,1] or -1 in the event of an error
   */
  public getXAtS(_s: number): number
  {
    let s: number = Math.max(0,_s);
    s             = Math.min(1,s);

    let bezier: CubicBezier | null = null;
    let t: number;

    // locate the index corresponding to this fraction of arc length - in the next release, most of the common
    // code between this and related methods will be consolidated into a single, internal method.
    if (s != this._s)
    {
      if (this._invalidated) this.__tangents();

      let i: number;

      const len: number  = this._bezier.length;
      this._arcLength    = 0;

      for (i = 0; i < len; ++i)
      {
        bezier  = this._bezier[i];

        this._arcLength += bezier.lengthAt(1.0);
      }

      const f  = s*this._arcLength;
      let z    = 0;
      let indx = 0;
      let bLen = 0;

      for (i = 0; i < len; ++i)
      {
        bezier = this._bezier[i];
        bLen   = bezier.lengthAt(1.0);
        z     += bLen;

        if (z >= f)
        {
          indx = i;
          z    = z - f;  // leftover
          break;
        }
      }

      if (bezier == null) return -1;

      // fraction along current segment of remaining length
      z = (bLen-z)/bLen;
      t = bezier.getTAtS(z);

      // cache since next call is most likely to getYAtT()
      this._index = indx;
      this._s     = s;
      this._t     = t;
    }
    else
    {
      bezier = this._bezier[this._index];
      t      = this._t;
    }

    return bezier.getX(t);
  }

  /**
   * Access the y-coordinate at the specified (normalized) arc length along the spline, i.e. s = 0 is zero percent of the length along
   * the spline and 1 is 100 percent of the length along the spline.
   *
   * @param {number} s Normalized arc length in [0,1] or -1 in the event of an error
   */
  public getYAtS(_s: number): number
  {
    let s: number = Math.max(0,_s);
    s             = Math.min(1,s);

    let bezier: CubicBezier | null = null;
    let t: number;

    // locate the index corresponding to this fraction of arc length
    if (s != this._s)
    {
      if (this._invalidated) this.__tangents();

      let i: number;

      const len: number = this._bezier.length;
      this._arcLength   = 0;

      for (i = 0; i < len; ++i)
      {
        bezier  = this._bezier[i];

        this._arcLength += bezier.lengthAt(1.0);
      }

      const f: number = s*this._arcLength;

      let z    = 0;
      let indx = 0;
      let bLen = 0;

      for (i = 0; i < len; ++i)
      {
        bezier = this._bezier[i];
        bLen   = bezier.lengthAt(1.0);
        z     += bLen;

        if (z >= f)
        {
          indx = i;
          z    = z - f;  // leftover
          break;
        }
      }

      if (bezier == null) return -1;

      // fraction along current segment of remaining length
      z = (bLen-z)/bLen;
      t = bezier.getTAtS(z);

      // cache
      this._index = indx;
      this._s     = s;
      this._t     = t;
    }
    else
    {
      bezier = this._bezier[this._index];
      t      = this._t;
    }

    return bezier.getY(t);
  }

  /**
   * Access dx/dt at the specified (normalized) arc length along the spline
   *
   * @param {number} s Normalized arc length in [0,1] or -1 in the event of an error
   */
  public getXPrimeAtS(_s: number): number
  {
    let s: number = Math.max(0,_s);
    s             = Math.min(1,s);

    let bezier: CubicBezier | null = null;
    let t: number;

    // locate the index corresponding to this fraction of arc length
    if (s != this._s)
    {
      if (this._invalidated) this.__tangents();

      let i: number;

      const len: number = this._bezier.length;
      this._arcLength   = 0;

      for (i = 0; i < len; ++i)
      {
        bezier = this._bezier[i];

        this._arcLength += bezier.lengthAt(1.0);
      }

      const f: number = s*this._arcLength;
      let z    = 0;
      let indx = 0;
      let bLen = 0;

      for (i = 0; i < len; ++i)
      {
        bezier = this._bezier[i];
        bLen   = bezier.lengthAt(1.0);
        z     += bLen;

        if (z >= f)
        {
          indx = i;
          z    = z - f;  // leftover
          break;
        }
      }

      if (bezier == null) return -1;

      // fraction along current segment of remaining length
      z = (bLen-z)/bLen;
      t = bezier.getTAtS(z);

      // cache since next call is most likely to getYAtT()
      this._index = indx;
      this._s     = s;
      this._t     = t;
    }
    else
    {
      bezier = this._bezier[this._index];
      t      = this._t;
    }

    return bezier.getXPrime(t);
  }

  /**
   * Access dy/dt at the specified (normalized) arc length along the spline
   *
   * @param s Normalized arc length in [0,1] or -1 in the event of an error
   */
  public getYPrimeAtS(_s: number): number
  {
    let s: number = Math.max(0,_s);
    s     = Math.min(1,s);

    let bezier: CubicBezier | null = null;
    let t: number;

    // locate the index corresponding to this fraction of arc length
    if (s != this._s)
    {
      if (this._invalidated) this.__tangents();

      let i: number;

      const len: number = this._bezier.length;
      this._arcLength   = 0;

      for (i = 0; i < len; ++i)
      {
        bezier  = this._bezier[i];

        this._arcLength += bezier.lengthAt(1.0);
      }

      const f: number = s*this._arcLength;
      let z    = 0;
      let indx = 0;
      let bLen = 0;

      for (i = 0; i < len; ++i)
      {
        bezier = this._bezier[i];
        bLen   = bezier.lengthAt(1.0);
        z     += bLen;

        if (z >= f)
        {
          indx = i;
          z    = z - f;  // leftover
          break;
        }
      }

      if (bezier == null) return -1;

      // fraction along current segment of remaining length
      z = (bLen-z)/bLen;
      t = bezier.getTAtS(z);

      // cache
      this._index = indx;
      this._s     = s;
      this._t     = t;
    }
    else
    {
      bezier = this._bezier[this._index];
      t      = this._t;
    }

    return bezier.getYPrime(t);
  }

  // update tangent computations - this causes each cubic bezier curve in the spline to be reconstructed
  protected __tangents(): void
  {
    // do we have cubic bezier instances already assigned?
    const numPoints: number = this._x.length;
    let i: number;

    if (this._bezier.length != numPoints)
    {
      this._bezier.length = 0;

      for (i = 0; i < numPoints-1; ++i) this._bezier.push(new CubicBezier());

      if (this._tangents.closed) this._bezier.push(new CubicBezier());
    }

    // closed spline needs to have matching initial and terminal interpolation points
    if (this._tangents.closed && ((this._x[0] != this._x[numPoints-1]) || (this._y[0] != this._y[numPoints-1])) ) {
      this.addControlPoint( this._x[0], this._y[0]);
    }

    this._tangents.construct(this._x, this._y);

    let segment: ControlPoints;
    let bezier: CubicBezier;

    const count: number = this._tangents.closed ? numPoints : numPoints-1;
    for (i = 0; i < count; ++i)
    {
      segment = this._tangents.getSegment(i);
      bezier  = this._bezier[i];

      bezier.fromObject(segment);
    }

    this._invalidated = false;
  }

  // compute index of the cubic bezier segment and local parameter corresponding to the global parameter.  Local parameter must be in [0.1]
  protected __interval(_t: number): void
  {
    let t: number = (_t<0) ? 0 : _t;
    t             = (t>1) ? 1 : t;

    if (t != this._t)
    {
      this._t = t;
      this.__segment();
    }
  }

  // compute current segment (index of single cubic bezier) in the spline and local parameter value within that segment
  protected __segment(): void
  {
    // the trivial case -- one segment
    const k: number = this._x.length;
    if (k === 2)
      this._index = 0;
    else
    {
      if (this._t == 0)
        this._index = 0;
      else if (this._t == 1.0)
        this._index = k-2;
      else
      {
        const N1: number  = k-1;
        const N1t: number = N1*this._t;
        const f: number   = Math.floor(N1t);
        this._index       = Math.min(f+1, N1)-1;
        this._t           = N1t - f;
      }
    }
  }
}
