/** Copyright 2018 Jim Armstrong (www.algorithmist.net)
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

// Specs for Typescript Math Toolkit Natural Cubic Spline

// test functions/classes
import { CubicSpline } from "../../geometry/splines/natural-cubic-spline";

import { Point } from "@algorithmist/amyr-ts-lib";

// Test Suites
describe('Natural Cubic Spline: CubicSpline', () =>
{
  const spline: CubicSpline = new CubicSpline();

  // sample data
  const dataX: Array<number> = new Array<number>();
  const dataY: Array<number> = new Array<number>();

  dataX.push(0.0);
  dataY.push(0.8);

  dataX.push(6);
  dataY.push(-0.34);

  dataX.push(15);
  dataY.push(0.59);

  dataX.push(17);
  dataY.push(0.59);

  dataX.push(19);
  dataY.push(0.23);

  dataX.push(21);
  dataY.push(0.1);

  dataX.push(23);
  dataY.push(0.28);

  dataX.push(26);
  dataY.push(1.03);

  dataX.push(28);
  dataY.push(1.5);

  dataX.push(30);
  dataY.push(1.44);

  dataX.push(36);
  dataY.push(0.74);

  dataX.push(47);
  dataY.push(-0.82);

  dataX.push(52);
  dataY.push(-1.27);

  dataX.push(57);
  dataY.push(-0.92);

  dataX.push(58);
  dataY.push(-0.92);

  dataX.push(60);
  dataY.push(-1.04);

  dataX.push(64);
  dataY.push(-0.79);

  dataX.push(69);
  dataY.push(-0.16);

  dataX.push(76);
  dataY.push(1.0);

  dataX.push(80);
  dataY.push(0.0);

  it('properly constructs a new cubic spline', () =>
  {
    expect(spline.knotCount).toEqual(0);
    expect(spline.interpolationPoints.length).toEqual(0);
    expect(spline.getY(0)).toEqual(0);
  });

  it('works with a singleton interpolation point', () =>
  {
    spline.addInterpolationlPoint(0, 1)
    expect(spline.knotCount).toEqual(1);
    expect(spline.interpolationPoints.length).toEqual(1);

    expect(spline.getY(0)).toEqual(1);
  });

  it('clear test', () =>
  {
    spline.addInterpolationlPoint(1,2);
    expect(spline.knotCount).toEqual(2);

    spline.clear();
    expect(spline.knotCount).toEqual(0);
    expect(spline.interpolationPoints.length).toEqual(0);
    expect(spline.getY(1)).toEqual(0);
  });

  it('multi-point, returns correct interpolation points', () =>
  {
    spline.clear();

    const n: number = dataX.length;
    let i: number;

    for (i = 0; i < n; ++i) {
      spline.addInterpolationlPoint(dataX[i], dataY[i]);
    }

    expect(spline.knotCount).toEqual(n);

    const points:Array<Point> = spline.interpolationPoints;
    expect(points.length).toEqual(n);

    expect(points[0].x).toEqual(dataX[0]);
    expect(points[0].y).toEqual(dataY[0]);
    expect(points[n-1].x).toEqual(dataX[n-1]);
    expect(points[n-1].y).toEqual(dataY[n-1]);
  });

  it('multi-point, interpolates exactly at knots', () =>
  {
    spline.clear();

    const n: number = dataX.length;
    let i: number;

    for (i = 0; i < n; ++i) {
      spline.addInterpolationlPoint(dataX[i], dataY[i]);
    }

    expect(spline.knotCount).toEqual(n);

    const points:Array<Point> = spline.interpolationPoints;
    expect(points.length).toEqual(n);

    for (i = 0; i < n; ++i) {
      expect(Math.abs(dataY[i]- spline.getY(dataX[i])) < 0.001).toBe(true);
    }
  });

  it('multi-point, interpolate in-between knots test', () =>
  {
    spline.clear();

    const n: number = dataX.length;
    let i: number;

    for (i = 0; i < n; ++i) {
      spline.addInterpolationlPoint(dataX[i], dataY[i]);
    }

    expect(spline.knotCount).toEqual(n);

    let y: number = spline.getY(1.0);
    expect(Math.abs(y - 0.54) < 0.01).toBe(true);

    y = spline.getY(8.0);
    expect(Math.abs(y + 0.306) < 0.01).toBe(true);

    y = spline.getY(15.0);
    expect(Math.abs(y - 0.59) < 0.01).toBe(true);

    y = spline.getY(28.0);
    expect(Math.abs(y - 1.5) < 0.01).toBe(true);

    y = spline.getY(35.0);
    expect(Math.abs(y - 0.868) < 0.01).toBe(true);

    y = spline.getY(45.0);
    expect(Math.abs(y + 0.531) < 0.01).toBe(true);

    y = spline.getY(60.0);
    expect(Math.abs(y + 1.04) < 0.01).toBe(true);

    y = spline.getY(70.0);
    expect(Math.abs(y - 0.061) < 0.01).toBe(true);
  });
});
