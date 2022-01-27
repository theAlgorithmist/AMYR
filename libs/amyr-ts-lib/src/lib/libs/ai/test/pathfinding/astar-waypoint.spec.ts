/** Copyright 2016 Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
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

import { AStarWaypoint } from "../../pathfinding/astar-waypoint";

// Test Suites
describe('A* Waypoint Tests', () => {

  it('correctly constructs new A* Waypoint', function() {
    const waypoint: AStarWaypoint = new AStarWaypoint('1');

    expect(waypoint.key).toBe('1');
    expect(waypoint.x).toBe(0);
    expect(waypoint.y).toBe(0);
    expect(waypoint.latitude).toBe(0);
    expect(waypoint.longitude).toBe(0);
    expect(waypoint.isCartesian).toBe(true);
  });

  it('correctly sets cartesian coordinates', function() {
    const waypoint: AStarWaypoint = new AStarWaypoint('1');

    expect(waypoint.key).toBe('1');
    expect(waypoint.x).toBe(0);
    expect(waypoint.y).toBe(0);

    waypoint.setCoords(7, 2);
    expect(waypoint.isCartesian).toBe(true);
    expect(waypoint.x).toBe(7);
    expect(waypoint.y).toBe(2);
  });

  it('correctly sets geo coordinates', function() {
    const waypoint: AStarWaypoint = new AStarWaypoint('1');

    expect(waypoint.key).toBe('1');
    expect(waypoint.longitude).toBe(0);
    expect(waypoint.latitude).toBe(0);

    waypoint.setGeoCoords(-97.3456, 32.3307);
    expect(waypoint.isCartesian).toBe(false);
    expect(waypoint.longitude).toBe(-97.3456);
    expect(waypoint.latitude).toBe(32.3307);
  });

  it('computes correct euclidean distance', function() {
    const w1: AStarWaypoint = new AStarWaypoint('1');
    const w2: AStarWaypoint = new AStarWaypoint('2');

    expect(w1.key).toBe('1');
    w1.setCoords(2, 4);

    expect(w2.key).toBe('2');
    w2.setCoords(-3, 8);

    const d: number = w1.distanceTo(w2);
    expect(Math.abs(d - 6.403)).toBeLessThan(0.001);
  });

});
