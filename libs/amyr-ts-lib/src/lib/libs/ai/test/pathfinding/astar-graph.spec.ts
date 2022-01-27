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

import { AStarGraph    } from "../../pathfinding/astar-graph";
import { AStarWaypoint } from "../../pathfinding/astar-waypoint";
import { AStarGraphArc } from "../../pathfinding/astar-graph-arc";

import { graph1 } from "./data/graph1";

function graphNodeFactory(id: string, h: number, x: number = 0, y: number = 0): AStarWaypoint
{
  const w: AStarWaypoint = new AStarWaypoint(id);
  w.heuristic            = h;
  w.setCoords(x, y);

  return w;
};

// Test Suites
describe('A* Graph Tests', () => {

  it('correctly constructs new A* Graph', function() {
    const graph: AStarGraph = new AStarGraph();

    expect(graph.size).toBe(0);
    expect(graph.edgeCount).toBe(0);
    expect(graph.isCartesian).toBe(true);
  });

  it('does not add a null node', function() {
    const graph: AStarGraph = new AStarGraph();
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tmp: any = null;

    graph.addNode(tmp);
    expect(graph.size).toBe(0);
    expect(graph.edgeCount).toBe(0);
    expect(graph.isCartesian).toBe(true);
  });

  it('adds a singleton node', function() {
    const graph: AStarGraph = new AStarGraph();

    const g: AStarWaypoint = graphNodeFactory('1', 1, 1, 2);

    graph.addNode(g);

    expect(graph.size).toBe(1);
    expect(graph.edgeCount).toBe(0);
    expect(graph.isCartesian).toBe(true);
  });

  it('adds multiple nodes', function() {
    const graph: AStarGraph = new AStarGraph();

    const g: AStarWaypoint = graphNodeFactory('1', 1, 1, 2);
    graph.addNode(g);

    const g2: AStarWaypoint = graphNodeFactory('2', 2, 3, 4);
    graph.addNode(g2);

    const g3: AStarWaypoint = graphNodeFactory('3', 3, 4, 5);
    graph.addNode(g3);

    expect(graph.size).toBe(3);
    expect(graph.edgeCount).toBe(0);
    expect(graph.isCartesian).toBe(true);
  });

  it('adds multiple nodes and edges', function() {
    const graph: AStarGraph = new AStarGraph();

    const g: AStarWaypoint = graphNodeFactory('1', 1, 1, 2);
    graph.addNode(g);

    const g2: AStarWaypoint = graphNodeFactory('2', 2, 3, 4);
    graph.addNode(g2);

    const g3: AStarWaypoint = graphNodeFactory('3', 3, 4, 5);
    graph.addNode(g3);

    graph.addEdge({
      key: 'e1',
      v1: g,
      v2: g2,
      w: 1.7
    });

    graph.addEdge({
      key: 'e2',
      v1: g2,
      v2: g3,
      w: 2.4
    });

    expect(graph.size).toBe(3);
    expect(graph.edgeCount).toBe(2);
    expect(graph.isCartesian).toBe(true);
  });

  it('creates a graph from a data provider', function() {
    const graph: AStarGraph = new AStarGraph();

    graph.fromObject(graph1);

    expect(graph.size).toBe(8);
    expect(graph.edgeCount).toBe(11);
    expect(graph.isCartesian).toBe(true);

    const node: AStarWaypoint | null= graph.nodeList;
    expect(node?.key).toBe('8');
  });

  it('properly modifies edge cost', function() {
    const graph: AStarGraph = new AStarGraph();

    graph.fromObject(graph1);

    expect(graph.size).toBe(8);
    expect(graph.edgeCount).toBe(11);
    expect(graph.isCartesian).toBe(true);

    graph.updateEdgeCost('1', 3.45);

    const edge: AStarGraphArc | null = graph.getEdge('1');

    expect(typeof edge?.cost).toBe('number');
    expect(Number(edge?.cost)).toBe(3.45);
  });

  it('fetch node by waypoint works on null input', function() {
    const graph: AStarGraph = new AStarGraph();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tmp: any = null;

    expect(graph.getNode(tmp)).toBe(null);
  });

  it('fetch waypoint by key returns null on incorrect input', function() {
    const graph: AStarGraph = new AStarGraph();

    const g: AStarWaypoint = graphNodeFactory('1', 1, 1, 2);
    graph.addNode(g);

    const g2: AStarWaypoint = graphNodeFactory('2', 2, 3, 4);
    graph.addNode(g2);

    const g3: AStarWaypoint = graphNodeFactory('3', 3, 4, 5);
    graph.addNode(g3);

    expect(graph.getNode('4')).toBe(null);
  });

  it('fetch waypoint by key', function() {
    const graph: AStarGraph = new AStarGraph();

    const g: AStarWaypoint = graphNodeFactory('1', 1, 1, 2);
    graph.addNode(g);

    const g2: AStarWaypoint = graphNodeFactory('2', 2, 3, 4);
    graph.addNode(g2);

    const g3: AStarWaypoint = graphNodeFactory('3', 3, 4, 5);
    graph.addNode(g3);

    const result: AStarWaypoint | null = graph.getNode('1');

    expect(result?.equals(g)).toBe(true);
  });
});
