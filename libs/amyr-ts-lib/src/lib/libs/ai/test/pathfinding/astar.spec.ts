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
import { AStarGraph    } from "../../pathfinding/astar-graph";
import { AStar         } from "../../pathfinding/astar";

import { createWaypoint } from "../../pathfinding/astar-waypoint";

import { graph1 } from "./data/graph1";

// Test Suites
describe('A* Pathfinding Tests', () => {

  it('correctly constructs new A* pathfinder', function() {
    const astar: AStar = new AStar();

    expect(astar).toBeTruthy();
  });

  it('path is empty for invalid arguments', function() {
    const astar: AStar      = new AStar();
    const graph: AStarGraph = new AStarGraph();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tmp: any = null;

    let waypoints: Array<AStarWaypoint> = astar.find(tmp, tmp, tmp);
    expect(waypoints.length).toBe(0);

    waypoints = astar.find(graph, tmp, tmp);
    expect(waypoints.length).toBe(0);

    const w: AStarWaypoint = createWaypoint('1', 1, 4, true, 3);
    waypoints              = astar.find(graph, w, tmp);
    expect(waypoints.length).toBe(0);

    waypoints = astar.find(graph, tmp, w);
    expect(waypoints.length).toBe(0);
  });

  it('path is empty for empty graph', function() {
    const astar: AStar      = new AStar();
    const graph: AStarGraph = new AStarGraph();

    const w: AStarWaypoint                = createWaypoint('1', 1, 4, true, 3);
    const waypoints: Array<AStarWaypoint> = astar.find(graph, w, w);

    expect(waypoints.length).toBe(0);
  });

  it('path is correct for singleton graph', function() {
    const astar: AStar      = new AStar();
    const graph: AStarGraph = new AStarGraph();

    const w: AStarWaypoint = createWaypoint('1', 1, 4, true, 3);
    graph.addNode(w);

    const waypoints: Array<AStarWaypoint> = astar.find(graph, w, w);
    expect(waypoints.length).toBe(1);

    expect(waypoints[0].equals(w)).toBe(true);
  });

  it('path is correct for two-node graph', function() {
    const astar: AStar      = new AStar();
    const graph: AStarGraph = new AStarGraph();

    const w: AStarWaypoint = createWaypoint('1', 1, 4, true, 3);
    graph.addNode(w);

    const w2: AStarWaypoint = createWaypoint('2', 2, 6, true, 4);
    graph.addNode(w2);

    const waypoints: Array<AStarWaypoint> = astar.find(graph, w, w);
    expect(waypoints.length).toBe(2);

    expect(waypoints[0].equals(w)).toBe(true);
    expect(waypoints[1].equals(w2)).toBe(true);
  });

  it('general graph test #1', function() {
    const astar: AStar      = new AStar();
    const graph: AStarGraph = new AStarGraph();

    graph.fromObject(graph1);

    const waypoints: Array<AStarWaypoint> = astar.find(graph, '1', '7');

    expect(waypoints.length).toBe(4);

    expect(waypoints[0].key).toBe('1');
    expect(waypoints[1].key).toBe('2');
    expect(waypoints[2].key).toBe('4');
    expect(waypoints[3].key).toBe('7');

    expect(Math.abs(waypoints[3].distance - 9.576491222541476) < 0.001).toBe(true);
  });
});
