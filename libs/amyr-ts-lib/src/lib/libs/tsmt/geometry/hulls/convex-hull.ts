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

import {
  angle,
  bottomLeft,
  orientation
} from '../../utils/point-utils';

import {Point} from "@algorithmist/amyr-ts-lib";

/**
 * Compute and return the convex hull of an arbitrary Point set using Graham's Scan
 *
 * @param points Collection of arbitrary Point instances in 2D space
 *
 */
export function grahamScan(points: Array<Point>): Array<Point>
{
  if (!points || points.length === 0) return [];

  if (points.length < 3) return points.slice();

  // initial sort
  const index              = bottomLeft(points);
  const pt: Point          = points[index];
  const same: Array<Point> = new Array<Point>();

  const indexList: Array<number> = new Array<number>();
  const angles: Array<number>    = new Array<number>();
  let i: number;

  const px: number = pt.x;
  const py: number = pt.y;

  for (i = 0; i < points.length; ++i)
  {
    indexList[i] = i;
    angles[i]    = angle(pt, points[i], false);
  }

  // sort by smallest angle and then smallest distance (squared)
  indexList.sort( (i: number, j: number): number => {
    const a1: number = angles[i];
    const a2: number = angles[j];
    if (Math.abs(a1-a2) < 0.01)
    {
      // distance (squared) may never be needed, so inline and compute JIT
      const d1X: number = Math.abs(px - points[i].x);
      const d1Y: number = Math.abs(py - points[i].y);
      const d2X: number = Math.abs(px - points[j].x);
      const d2Y: number = Math.abs(py - points[j].y);

      return (d1X*d1X + d1Y*d1Y) - (d2X*d2X + d2Y*d2Y);
    }
    else
      return a1 - a2;
  });

  for (i = 1; i < indexList.length - 1; i++)
  {
    if (Math.abs(angles[indexList[i]] - angles[indexList[i + 1]]) < 0.01) {
      indexList[i] = -1;  // mark duplicate angle to be bypassed in hull computations
    }
  }

  // compute hull
  const hull: Array<Point> = new Array<Point>();
  for (i = 0; i < indexList.length; ++i)
  {
    const index: number = indexList[i];

    if (index !== -1)
    {
      const point: Point = points[index];
      if (hull.length < 3)
        hull.push(point);
      else
      {
        while ( (hull.length > 1) && (orientation(hull[hull.length-2], hull[hull.length-1], point) >= 0) ) {
          hull.pop();
        }

        hull.push(point);
      }
    }
  }

  return hull;
}
