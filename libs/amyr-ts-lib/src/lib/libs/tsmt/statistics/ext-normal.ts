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
 * Algorithmist Dev Toolkit: Extended Normal distribution computations (adds graphing normal curve with sequence of
 * quadratic Bezier curves)
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */
import { Normal } from "./normal";
import {
  ControlPoints,
  QuadBezier,
  Point,
  lineIntersection,
  Split
} from "@algorithmist/amyr-ts-lib";

import { SQRT_2_PI } from "../../../models/constants";

export class ExtNormal extends Normal
{
  protected _bezier: QuadBezier;

  constructor()
  {
    super();

    this._bezier = new QuadBezier();
  }

  /**
   * Return a sequence of quadratic bezier curves that approximate the current normal curve over the
   * supplied interval.  If b <= a, an empty array is returned.
   *
   * @param {number} a Left endpoint of interval
   *
   * @param {number} b Right endpoint of interval, b > a
   */
  public toBezier(a: number, b: number): Array<ControlPoints>
  {
    if (isNaN(a) || isNaN(b) || b <= a ) return [];


    // In terms of graphing, it is necessary to capture the single extreme point at x=u and the two
    // inflection points at x = u +/= s, provided they fall in [a,b], as interpolation points of
    // the quad. bezier sequence.
    //
    // One pass of iterative refinement has shown to be suitable for online or device-based
    // graphing applications.
    let stack: Array<ControlPoints> = new Array<ControlPoints>();
    if (a < this._mean)
    {
      stack = this.__leftOfMean(a, Math.min(this._mean, b) );

      if (b > this._mean) {
        stack = stack.concat(this.__rightOfMean(this._mean, b));
      }
    }
    else
    {
      stack = this.__rightOfMean(a, b);
    }

    return stack;
  }

  // internal method - bezier sequence for [a,c], c = min(u,b), where u is the current mean
  protected __leftOfMean(a: number, b: number): Array<ControlPoints>
  {
    // left endpoint
    const x0: number = a;
    const y0: number = this.getNormal(a);
    let m: number    = this.getNormalDerivative(a);
    const x1: number = x0+1;
    const y1: number = y0+m;

    // first division is at inflection point u-s or midpoint if a >= u-s
    let xVal: number;

    if( a < this._mean-this._std )
    {
      xVal = this._mean - this._std;
    }
    else
    {
      xVal = 0.5 * (a + b);
    }

    const yVal: number = this.getNormal(xVal);

    // slope and vectors along either direction of the curve
    m  = this.getNormalDerivative(xVal);
    const x2: number = xVal+1;
    const x3: number = xVal-1;
    const y2: number = yVal+m;
    const y3: number = yVal-m;

    let o: Point = lineIntersection(x0, y0, x1, y1, xVal, yVal, x3, y3);

    let q: ControlPoints = {x0: x0, y0: y0, cx: o.x, cy: o.y, cx1: 0, cy1: 0, x1: xVal, y1: yVal};

    let split: Split;

    let stack: Array<ControlPoints> = new Array<ControlPoints>();
    if (this._std <= 1)
    {
      split = this.__split(q);
      stack = [split.left, split.right];
    }
    else
    {
      stack = [q];
    }

    let x4: number, y4: number, x5: number, y5: number;
    if (b == this._mean)
    {
      x4 = this._mean-1;
      y4 = 1/(this._std*SQRT_2_PI);

      x5 = this._mean;
      y5 = y4;
    }
    else
    {
      x5 = b;
      y5 = this.getNormal(x5);
      m  = this.getNormalDerivative(x5);

      x4 = x5-1;
      y4 = y5-m;
    }

    o = lineIntersection(xVal, yVal, x2, y2, x5, y5, x4, y4);

    const r: ControlPoints = {x0: xVal, y0: yVal, cx: o.x, cy: o.y, cx1: 0, cy1: 0, x1: x5, y1: y5};

    stack.push(r);

    if (this._std <= 1)
    {
      // refine inner segments - final segment is tested for refinement in case right endpoint less
      // than mean or extremely small sigma
      let x: number;
      let y: number;
      let yNorm: number;
      let i: number;

      for (i=1; i<stack.length; ++i )
      {
        q = stack[i];

        this._bezier.fromObject(q);
        x = this._bezier.getX(0.5);
        y = this._bezier.getY(0.5);

        yNorm = this.getNormal(x);

        // this test is a bit arbitrary and is based on how closely you want to match for typical
        // online and device-based graphing applications.
        if (Math.abs(y-yNorm) > 0.025)
        {
          // refine - because of the shape of the normal curve, it will always be the rightmost segment
          // that may need further refining, but for most all
          // cases, one refinement is all that will be required.
          split    = this.__split(q);
          stack[i] = split.left;
          stack.splice(i+1, 0, split.right);
        }
      }

      // todo for extremely low sigmas, the final segment may need refining to better match curvature
      // at x=u.  See if this will be necessary based on actual user experience
    }

    return stack;
  }

  // internal method - bezier sequence for [c,b], c = max(a,u), where u is the current mean
  protected __rightOfMean(a: number, b: number): Array<ControlPoints>
  {
    // left endpoint
    const x0: number = a;
    const y0: number = this.getNormal(a);
    let m: number    = this.getNormalDerivative(a);
    const x1: number = x0+1;
    const y1: number = y0+m;

    // first division is at inflection point u+s or midpoint if a >= u+s
    let xVal: number;

    if (a < this._mean+this._std)
    {
      xVal = this._mean + this._std;
    }
    else
    {
      xVal = 0.5 * (a + this._mean + this._std);
    }

    const yVal: number = this.getNormal(xVal);

    // slope and vectors along either direction of the curve
    m  = this.getNormalDerivative(xVal);
    const x2: number = xVal+1;
    const x3: number = xVal-1;
    const y2: number = yVal+m;
    const y3: number = yVal-m;

    let o: Point = lineIntersection(x0, y0, x1, y1, xVal, yVal, x3, y3);

    let q: ControlPoints = {x0: x0, y0: y0, cx: o.x, cy: o.y, cx1: 0, cy1: 0, x1: xVal, y1: yVal};

    let split: Split;
    const stack: Array<ControlPoints> = [q];


    const x5: number = b;
    const y5: number = this.getNormal(x5);
    m                = this.getNormalDerivative(x5);
    const x4: number = x5-1;
    const y4: number = y5-m;

    o = lineIntersection(xVal, yVal, x2, y2, x5, y5, x4, y4);

    const r: ControlPoints = {x0: xVal, y0: yVal, cx: o.x, cy: o.y, cx1: 0, cy1: 0, x1: x5, y1: y5};

    if (this._std <= 1)
    {
      split = this.__split(q);
      stack.splice(1, 0, split.left, split.right);
    }
    else
    {
      stack.push(r);
    }

    if (this._std <= 1)
    {
      // refine inner segments - similar to 'left of mean' except that all segments need refinement
      // test except last
      let x: number;
      let y: number;
      let yNorm: number;
      let i: number;

      for (i = 0; i < stack.length-1; ++i)
      {
        q = stack[i];

        this._bezier.fromObject(q);
        x = this._bezier.getX(0.5);
        y = this._bezier.getY(0.5);

        yNorm = this.getNormal(x);

        // this test is a bit arbitrary and is based on how closely you want to match for
        // typical online and device-based graphing applications.
        if (Math.abs(y-yNorm) > 0.025)
        {
          // refine - because of the shape of the normal curve, it will always be the rightmost segment
          // that may need further refining, but for most all cases, one refinement is all that will be required.
          split    = this.__split(q);
          stack[i] = split.left;
          stack.splice(i+1, 0, split.right);
        }
      }
    }

    return stack;
  }

  // internal method - split a quad bezier at the approximate midpoint of the normal curve (not the bezier - this
  // is not bezier subdivision) - we take x at t = 0.5 as an approximation to the midpoint of the normal curve segment.
  protected __split(q: ControlPoints): Split
  {
    // get x at t = 0.5
    this._bezier.fromObject(q);

    let x0: number  = q.x0;
    let y0: number  = q.y0;
    let m: number   = this.getNormalDerivative(x0);
    let x0m: number = x0 + 1;
    let y0m: number = y0 + m;

    const xm: number = this._bezier.getX(0.5);
    const ym: number = this.getNormal(xm);

    m = this.getNormalDerivative(xm);

    let x1m: number = xm-1;
    let y1m: number = ym-m;

    // compute control point for left approximating quad.
    let o: Point = lineIntersection(x0, y0, x0m, y0m, xm, ym, x1m, y1m);

    const left: ControlPoints = {x0:  q.x0, y0: q.y0, cx: o.x, cy: o.y, cx1: 0, cy1: 0, x1: xm, y1: ym};

    // right quad bezier
    x0  = xm;
    y0  = ym;
    x0m = x0+1
    y0m = y0+m;

    const x1: number = q.x1;
    const y1: number = this.getNormal(x1);
    m                = this.getNormalDerivative(x1);

    x1m = x1-1;
    y1m = y1-m;

    // control point for right approximating quad.
    o = lineIntersection(x0, y0, x0m, y0m, x1, y1, x1m, y1m);

    const right: ControlPoints = {x0: x0, y0: y0, cx: o.x, cx1: 0, cy1: 0, cy: o.y, x1: x1, y1: y1};

    return {left:left, right:right};
  }
}
