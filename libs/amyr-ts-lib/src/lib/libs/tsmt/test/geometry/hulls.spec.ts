/** Copyright 2021 Jim Armstrong (www.algorithmist.net)
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
import { concaveHull } from "../../geometry/hulls/concave-hull";
import {
  grahamScan,
  Point
} from "@algorithmist/amyr-ts-lib";

import { Point2D } from "@algorithmist/amyr-ts-lib";

interface VectorComparable
{
  (a: Array<Point2D>, b: Array<Point2D>, tolerance?: number): boolean;
}

const CH_POINTS: Array<Point> = [
  {x: 0, y: 0},
  {x: 7, y: 0},
  {x: 3, y: 1},
  {x: 5, y: 2},
  {x: 3, y: 3},
  {x: 1, y: 4},
  {x: 5, y: 5},
  {x: 9, y: 6}
];

const CH_POINTS_1: Array<Point> = [
  {x: 0, y: 3}, {x: 1, y: 1}, {x: 2, y: 2}, {x: 4, y: 4},
  {x: 0, y: 0}, {x: 1, y: 2}, {x: 3, y: 1}, {x: 3, y: 3}
];

const CH_POINTS_2: Array<Point> = [
  {x:-7, y: 8},
  {x:-4, y: 6},
  {x:2, y: 6},
  {x: 6, y: 4},
  {x: 8, y: 6},
  {x: 7, y: -2},
  {x: 4, y: -6},
  {x: 8, y: -7},
  {x: 0, y:  0},
  {x: 3, y: -2},
  {x: 6, y: -10},
  {x: 0, y: -6},
  {x: -9, y: -5},
  {x: -8, y: -2},
  {x: -8, y: 0},
  {x: -10, y: 3},
  {x: -2, y: 2},
  {x: -10, y: 4}
]

const POINTS_1: Array<Point2D> = [
  [10, 10], [30, 15], [20, 5], [100,50], [20, 25]
];

const CORRECT_1: Array<Point2D> = [
  [ 20, 5 ], [ 10, 10 ], [ 20, 25 ], [ 100, 50 ], [ 20, 5 ]
]

const POINTS_2: Array<Point2D> = [
  [10, 15], [38, 8], [20, 18], [40, 20], [48, 19],
  [33, 15], [42, 35], [50, 52], [34, 48], [18, 60],
  [12, 52], [13, 40], [8, 52], [8, 38], [5, 25],
];

const CORRECT_2: Array<Point2D> = [
  [ 10, 15 ], [ 5, 25 ], [ 8, 52 ],  [ 18, 60 ],
  [ 50, 52 ], [ 48, 19 ], [ 38, 8 ],  [ 10, 15 ]
];

const POINTS_3: Array<Point2D> = [
  [162, 332], [182, 299], [141, 292], [158, 264], [141, 408], [160, 400],
  [177, 430], [151, 442], [155, 425], [134, 430], [126, 447], [139, 466],
  [160, 471], [167, 447], [182, 466], [192, 442], [187, 413], [173, 403],
  [168, 425], [153, 413], [179, 275], [163, 292], [134, 270], [143, 315],
  [177, 320], [163, 311], [162, 281], [182, 255], [141, 226], [156, 235],
  [173, 207], [187, 230], [204, 194], [165, 189], [145, 201], [158, 167],
  [190, 165], [206, 145], [179, 153], [204, 114], [221, 138], [243, 112],
  [248, 139], [177, 122], [179, 99], [196, 82], [219, 90], [240, 75],
  [218, 61], [228, 53], [211, 34], [197, 51], [179, 65], [155, 70], [165, 85],
  [134, 80], [124, 58], [153, 44], [173, 34], [192, 27], [156, 19], [119, 32],
  [128, 17], [138, 36], [100, 58], [112, 73], [100, 92], [78, 100], [83, 78],
  [61, 63], [80, 44], [100, 26], [60, 39], [43, 71], [34, 54], [32, 90],
  [53, 104], [60, 82], [66, 99], [247, 94], [187, 180], [221, 168],
];

const CORRECT_3: Array<Point2D> = [
  [ 34, 54 ],   [ 32, 90 ], [ 126, 447 ], [ 139, 466 ],
  [ 160, 471 ], [ 182, 466 ], [ 192, 442 ], [ 248, 139 ],
  [ 247, 94 ],  [ 240, 75 ], [ 228, 53 ],  [ 211, 34 ],
  [ 192, 27 ],  [ 156, 19 ], [ 128, 17 ],  [ 100, 26 ],
  [ 60, 39 ],   [ 34, 54 ]
];

const POINTS_4: Array<Point2D> = [
  [141, 408], [160, 400], [177, 430], [151, 442],
  [155, 425], [134, 430], [126, 447], [139, 466],
  [160, 471], [167, 447], [182, 466], [192, 442],
  [187, 413], [173, 403], [165, 430], [171, 430],
  [177, 437], [175, 443], [172, 444], [163, 448],
  [156, 447], [153, 438], [154, 431], [160, 428]
];

const CORRECT_4: Array<Point2D> = [
  [ 141, 408 ], [ 126, 447 ],
  [ 139, 466 ], [ 160, 471 ],
  [ 182, 466 ], [ 192, 442 ],
  [ 187, 413 ], [ 173, 403 ],
  [ 160, 400 ], [ 141, 408 ]
];

const vectorCompareExact: VectorComparable = (a: Array<Point2D>, compare: Array<Point2D>): boolean => {
  let i: number;
  const n: number = compare.length;
  for (i = 0; i < n; ++i)
  {
    if (a[i][0] !== compare[i][0] || a[i][1] !== compare[i][1]) {
      return false;
    }
  }

  return true;
}

describe('Convex Hull, Graham Scan', () => {
  it ('returns empty array for empty input', function() {
    const hull: Array<Point> = grahamScan([]);

    expect(hull.length).toEqual(0);
  });

  it('convex hull of a single point is a point', function() {
    const hull: Array<Point> = grahamScan([{x:1, y:2}]);

    expect(hull.length).toEqual(1);

    const point: Point = hull[0];
    expect(point.x).toEqual(1);
    expect(point.y).toEqual(2);
  });

  it('convex hull of a line segment is the segment', function() {
    const hull: Array<Point> = grahamScan([{x:1, y:2}, {x:3, y:4}]);

    expect(hull.length).toEqual(2);
    let point: Point = hull[0];

    expect(point.x).toEqual(1);
    expect(point.y).toEqual(2);

    point = hull[1];
    expect(point.x).toEqual(3);
    expect(point.y).toEqual(4);
  });

  it ('utils test', function() {
    const hull: Array<Point> = grahamScan(CH_POINTS);

    expect(hull.length).toEqual(4);

    let point: Point = hull[0];

    expect(point.x).toEqual(0);
    expect(point.y).toEqual(0);

    point = hull[1];
    expect(point.x).toEqual(7);
    expect(point.y).toEqual(0);

    point = hull[2];

    expect(point.x).toEqual(9);
    expect(point.y).toEqual(6);

    point = hull[3];
    expect(point.x).toEqual(1);
    expect(point.y).toEqual(4);
  });

  it ('utils test 2', function() {
    const hull: Array<Point> = grahamScan(CH_POINTS_1);

    expect(hull.length).toEqual(4);

    let point: Point = hull[0];

    expect(point.x).toEqual(0);
    expect(point.y).toEqual(0);

    point = hull[1];
    expect(point.x).toEqual(3);
    expect(point.y).toEqual(1);

    point = hull[2];

    expect(point.x).toEqual(4);
    expect(point.y).toEqual(4);

    point = hull[3];
    expect(point.x).toEqual(0);
    expect(point.y).toEqual(3);
  });

  it ('utils test 3', function() {
    const hull: Array<Point> = grahamScan(CH_POINTS_2);

    expect(hull.length).toEqual(7);

    let point: Point = hull[0];

    expect(point.x).toEqual(6);
    expect(point.y).toEqual(-10);

    point = hull[1];
    expect(point.x).toEqual(8);
    expect(point.y).toEqual(-7);

    point = hull[2];

    expect(point.x).toEqual(8);
    expect(point.y).toEqual(6);

    point = hull[3];
    expect(point.x).toEqual(-7);
    expect(point.y).toEqual(8);

    point = hull[4];
    expect(point.x).toEqual(-10);
    expect(point.y).toEqual(4);

    point = hull[5];
    expect(point.x).toEqual(-10);
    expect(point.y).toEqual(3);

    point = hull[6];
    expect(point.x).toEqual(-9);
    expect(point.y).toEqual(-5);
  });
});

describe('Concave Hull', () => {
  it('returns empty array for empty input', function() {
    const hull: Array<Point2D> = concaveHull([]);

    expect(hull.length).toEqual(0);
  });

  it('concave hull of a single point is a point', function() {
    const hull: Array<Point2D> = concaveHull([[1, 2]]);

    expect(hull.length).toEqual(1);

    const point: Point2D = hull[0];
    expect(point[0]).toEqual(1);
    expect(point[1]).toEqual(2);
  });

  it('concave hull of a line segment is the segment', function() {
    const hull: Array<Point2D> = concaveHull([[1, 2], [3, 4]]);

    expect(hull.length).toEqual(2);
    let point: Point2D = hull[0];

    expect(point[0]).toEqual(1);
    expect(point[1]).toEqual(2);

    point = hull[1];
    expect(point[0]).toEqual(3);
    expect(point[1]).toEqual(4);
  });

  it('concave hull of a triangle is the triangle', function() {
    const hull: Array<Point2D> = concaveHull([[1, 2], [3, 4], [5, 6]]);

    expect(hull.length).toEqual(3);
    let point: Point2D = hull[0];

    expect(point[0]).toEqual(1);
    expect(point[1]).toEqual(2);

    point = hull[1];
    expect(point[0]).toEqual(3);
    expect(point[1]).toEqual(4);

    point = hull[2];
    expect(point[0]).toEqual(5);
    expect(point[1]).toEqual(6);
  });

  it('concave hull of less than 4 points is a copy', function() {
    const points: Array<Point2D> = [[1, 2], [3, 4], [5, 6]];
    const hull: Array<Point2D> = concaveHull(points);

    expect(hull.length).toEqual(3);

    // if reference is returned, this would mutate result
    points[0] = [-1, -2];
    points[1] = [-3, -4];
    points[2] = [-5, -6];

    let point: Point2D = hull[0];
    expect(point[0]).toEqual(1);
    expect(point[1]).toEqual(2);

    point = hull[1];
    expect(point[0]).toEqual(3);
    expect(point[1]).toEqual(4);

    point = hull[2];
    expect(point[0]).toEqual(5);
    expect(point[1]).toEqual(6);
  });

  it('utils test #1', function() {
    const hull: Array<Point2D> = concaveHull(POINTS_1);

    expect(vectorCompareExact(hull, CORRECT_1)).toBe(true);
  });

  it('utils test #2', function() {
    const hull: Array<Point2D> = concaveHull(POINTS_2);

    expect(vectorCompareExact(hull, CORRECT_2)).toBe(true);
  });

  it('utils test #3', function() {
    const hull: Array<Point2D> = concaveHull(POINTS_3);

    expect(vectorCompareExact(hull, CORRECT_3)).toBe(true);
  });

  it('utils test #4', function() {
    const hull: Array<Point2D> = concaveHull(POINTS_4);

    expect(vectorCompareExact(hull, CORRECT_4)).toBe(true);
  });
});
