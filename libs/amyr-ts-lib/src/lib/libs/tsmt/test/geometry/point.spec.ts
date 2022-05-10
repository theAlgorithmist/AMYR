/** Copyright 2016 Jim Armstrong (www.algorithmist.net)
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

// Geometry Specs (todo: complete specs)
import { PlanarPoint } from "../../geometry/point";

// Test Suites
describe('Point', () => {

  it('properly constructs a new default planar point', function() {
    const point: PlanarPoint = new PlanarPoint();

    expect(point.x).toEqual(0);
    expect(point.y).toEqual(0);
  });

  it('properly constructs a new point with specified coordinates', function() {
    const point: PlanarPoint = new PlanarPoint(-1, 3);

    expect(point.x).toEqual(-1);
    expect(point.y).toEqual(3);
  });

  it('properly handles incorrect coordinate values', function() {
    const point: PlanarPoint = new PlanarPoint();
    const tmp: any = "a";
    point.x = tmp;
    point.y = -1;

    expect(point.x).toEqual(0);
    expect(point.y).toEqual(-1);
  });

  it('properly computes l-2 distance (test 1)', function() {
    const point: PlanarPoint = new PlanarPoint();
    const dist: number = point.distance(new PlanarPoint());

    expect(dist).toEqual(0);
  });

  it('properly computes l-2 distance (test 1)', function() {
    const point: PlanarPoint = new PlanarPoint();
    const dist: number = point.distance(new PlanarPoint());

    expect(dist).toEqual(0);
  });

  it('properly computes l-2 distance (test 2)', function() {
    const point: PlanarPoint = new PlanarPoint(0, 3);
    const dist: number = point.distance(new PlanarPoint(4, 0));

    expect(dist).toEqual(5);
  });

  // remainder of specs to be filled in
});
