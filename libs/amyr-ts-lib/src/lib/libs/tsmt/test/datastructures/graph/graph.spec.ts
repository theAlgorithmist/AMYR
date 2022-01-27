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

// Specs for TSMT Graph
import { TSMT$GraphNode    } from '../../../datastructures/graph-node';
import { TSMT$GraphArc     } from '../../../datastructures/graph-arc';
import { TSMT$Graph        } from '../../../datastructures/graph';
import {
  TSMT$SimpleGraph, 
  TSMT_CLUSTER_TYPE,
  TSMT$INode,
  TSMT$IEdge,
  gatherChildren,
  TSMT$GraphData,
  TSMT$ClusterData
} from "../../../datastructures/simple-graph";

import {graphFromList} from "../../../datastructures/utils/graph-from-list";

// test graphs
// import { testGraph1 } from "../../../datastructures/graphs/tests";
// import { testGraph2 } from "../../../datastructures/graphs/tests";
// import { testGraph3 } from "../../../datastructures/graphs/tests";
// import { testGraph4 } from "../../../datastructures/graphs/tests";
// import { testGraph5 } from "../../../datastructures/graphs/tests";
import { 
  testGraph1,
  testGraph2, 
  testGraph3,
  testGraph4,
testGraph5
} from './graph-tests';

// uncomment to log edges during tests
// const logEdges = (mst: Array<TSMT$IEdge>): void => {
//   const E: number = mst.length;
//   let i: number;
//   let e: TSMT$IEdge;
//   for (i = 0; i < E; ++i)
//   {
//     e = mst[i];
//     console.log( e.v1.key, e.v2.key, e.w );
//   }
// };

const graph1: TSMT$GraphData = {
  useCoords: false,
  nodes: [
    {
      key: '0'
    },
    {
      key: '1'
    },
    {
      key: '2'
    },
    {
      key: '3'
    },
    {
      key: '4'
    },
    {
      key: '5'
    },
    {
      key: '6'
    },
    {
      key: '7'
    },
    {
      key: '8'
    }
  ],
  edges: [
    {
      from: '0',
      to: '7',
      w: 8
    },
    {
      from: '0',
      to: '1',
      w: 4
    },
    {
      from: '1',
      to: '2',
      w: 8
    },
    {
      from: '1',
      to: '7',
      w: 11
    },
    {
      from: '7',
      to: '8',
      w: 7
    },
    {
      from: '7',
      to: '6',
      w: 1
    },
    {
      from: '2',
      to: '3',
      w: 7
    },
    {
      from: '2',
      to: '8',
      w: 2
    },
    {
      from: '8',
      to: '6',
      w: 6
    },
    {
      from: '3',
      to: '5',
      w: 14
    },
    {
      from: '2',
      to: '5',
      w: 4
    },
    {
      from: '3',
      to: '4',
      w: 9
    },
    {
      from: '5',
      to: '4',
      w: 10
    },
    {
      from: '6',
      to: '5',
      w: 2
    }
  ]
};

const graph2: TSMT$GraphData = {
  useCoords: false,
  nodes: [
    {
      key: 'A'
    },
    {
      key: 'B'
    },
    {
      key: 'C'
    },
    {
      key: 'D'
    },
    {
      key: 'E'
    },
    {
      key: 'F'
    },
    {
      key: 'G'
    }
  ],
  edges: [
    {
      from: 'A',
      to: 'B',
      w: 5
    },
    {
      from: 'B',
      to: 'F',
      w: 6
    },
    {
      from: 'A',
      to: 'C',
      w: 1
    },
    {
      from: 'A',
      to: 'D',
      w: 4
    },
    {
      from: 'C',
      to: 'D',
      w: 3
    },
    {
      from: 'D',
      to: 'F',
      w: 8
    },
    {
      from: 'C',
      to: 'E',
      w: 2
    },
    {
      from: 'E',
      to: 'F',
      w: 7
    },
    {
      from: 'E',
      to: 'G',
      w: 9
    }
  ]
};

const cluster1: TSMT$ClusterData = {
  nodes: [
    {
      key: 'A',
      x: 1,
      y: 1
    },
    {
      key: 'B',
      x: 1,
      y: 2
    },
    {
      key: 'C',
      x: 3,
      y: 2
    },
    {
      key: 'D',
      x: 3,
      y: 3
    },
    {
      key: 'E',
      x: 6,
      y: 6
    },
    {
      key: 'F',
      x: 6,
      y: 7
    },
    {
      key: 'G',
      x: 7,
      y: 6
    },
    {
      key: 'H',
      x: 7,
      y: 7
    }
  ]
};

const graph3: TSMT$GraphData = {
  nodes: [
    {
      key: '1'
    },
    {
      key: '2'
    },
    {
      key: '3'
    },
    {
      key: '4'
    },
    {
      key: '5'
    },
    {
      key: '6'
    },
    {
      key: '7'
    },
    {
      key: '8'
    }
  ],
  edges: [
    {
      from: '1',
      to: '2',
      w: 16
    },
    {
      from: '2',
      to: '4',
      w: 4
    },
    {
      from: '2',
      to: '3',
      w: 6
    },
    {
      from: '1',
      to: '3',
      w: 8
    },
    {
      from: '3',
      to: '5',
      w: 5
    },
    {
      from: '1',
      to: '5',
      w: 10
    },
    {
      from: '1',
      to: '6',
      w: 21
    },
    {
      from: '5',
      to: '6',
      w: 14
    },
    {
      from: '5',
      to: '7',
      w: 11
    },
    {
      from: '5',
      to: '8',
      w: 18
    },
    {
      from: '3',
      to: '8',
      w: 23
    },
    {
      from: '6',
      to: '7',
      w: 7
    },
    {
      from: '7',
      to: '8',
      w: 9
    },
    {
      from: '4',
      to: '8',
      w: 24
    }
  ]
};

const cluster2: TSMT$ClusterData = {
  nodes: [
    {
      key: 'a',
      x: 5,
      y: 7
    },
    {
      key: 'b',
      x: 6,
      y: 7
    },
    {
      key: 'c',
      x: 5.5,
      y: 9
    },
    {
      key: 'd',
      x: 6.5,
      y: 8.5
    },
    {
      key: 'e',
      x: 4,
      y: 8
    },
    {
      key: 'f',
      x: 7,
      y: 7
    },
    {
      key: 'g',
      x: 5,
      y: 4.8
    },
    {
      key: 'h',
      x: 8,
      y: 5
    },
    {
      key: 'i',
      x: 9,
      y: 5
    },
    {
      key: 'j',
      x: 9.5,
      y: 7
    },
    {
      key: 'k',
      x: 10,
      y: 5.8
    },
    {
      key: 'l',
      x: 6.5,
      y: 2
    },
    {
      key: 'm',
      x: 8,
      y: 2
    },
    {
      key: 'n',
      x: 9,
      y: 2.2
    },
    {
      key: 'o',
      x: 8,
      y: 0
    }
  ]
};

// Test Suites
describe('TSMT Graph Node', () => {

  it('newly constructed Node has and id of zero', function() {
    const node: TSMT$GraphNode<number> = new TSMT$GraphNode<number>();

    expect(node.id).toBe(0);
  });

  it('Node with empty constructor has null data', function() {
    const node: TSMT$GraphNode<number> = new TSMT$GraphNode<number>();

    expect(node.value).toBe(null);
  });

  it('Node accepts optional data on construction', function() {
    const node: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(1.0);

    expect(node.value as number).toBe(1.0);
  });

  it('Node can only be marked with a boolean', function() {
    const node: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(1.0);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value: any = 'true';
    node.marked = value;

    expect(node.marked).toBe(false);

    node.marked = true;
    expect(node.marked).toBe(true);
  });

  it('Node can accept a value post-construction', function() {
    const node: TSMT$GraphNode<number> = new TSMT$GraphNode<number>();

    expect(node.value).toBe(null);

    node.value = -2.0;

    expect(+node.value).toBe(-2);
  });

  it('Node properly accepts and returns an id', function() {
    const node: TSMT$GraphNode<number> = new TSMT$GraphNode<number>();

    expect(node.id).toBe(0);

    node.id = -1;
    expect(node.id).toBe(0);

    node.id = 1;
    expect(node.id).toBe(1)
  });

  it('Node propertly accepts and sets previous/next references', function() {
    const node: TSMT$GraphNode<number>  = new TSMT$GraphNode<number>();
    const node1: TSMT$GraphNode<number> = new TSMT$GraphNode<number>();
    const node2: TSMT$GraphNode<number> = new TSMT$GraphNode<number>();

    expect(node.previous).toBe(null);
    expect(node.next).toBe(null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const junk: any = null;
    node.previous   = node1;
    node.next       = node2;

    node.previous = junk;
    node.next     = junk;

    expect(node.previous === node1).toBe(true);
    expect(node.next == node2     ).toBe(true);
  });

  it('Newly constructed node has zero arc count', function() {
    const node: TSMT$GraphNode<number> = new TSMT$GraphNode<number>();

    expect(node.arcCount).toBe(0);
  });

  it('Newly constructed node is not connected to any other node', function() {
    const node: TSMT$GraphNode<number>  = new TSMT$GraphNode<number>();
    const node1: TSMT$GraphNode<number> = new TSMT$GraphNode<number>();

    expect(node.connected(node1)).toBe(false);
    expect(node.mutuallyConnected(node1)).toBe(false);
  });
});

describe('TSMT Graph Arc', () =>
{
  it('newly constructed Arc has default zero cost', function ()
  {
    const node: TSMT$GraphNode<number> = new TSMT$GraphNode<number>();
    const arc: TSMT$GraphArc<number>   = new TSMT$GraphArc<number>(node);

    expect(arc.cost).toBe(0);
  });

  it('node accessor returns proper reference', function ()
  {
    const node: TSMT$GraphNode<number> = new TSMT$GraphNode<number>();
    const arc: TSMT$GraphArc<number>   = new TSMT$GraphArc<number>(node);

    expect(arc.node === node).toBe(true);
  });

  it('previous and next references are null by default', function ()
  {
    const node: TSMT$GraphNode<number> = new TSMT$GraphNode<number>();
    const arc: TSMT$GraphArc<number>   = new TSMT$GraphArc<number>(node);

    expect(arc.previous).toBe(null);
    expect(arc.next    ).toBe(null);
  });

  it('arc accepts proper cost pre- and post-construction', function ()
  {
    const node: TSMT$GraphNode<number> = new TSMT$GraphNode<number>();
    const arc: TSMT$GraphArc<number>   = new TSMT$GraphArc<number>(node);

    arc.cost = -1;

    expect(arc.cost).toBe(0);

    arc.cost = 10.0
    expect(arc.cost).toBe(10);

    const arc1: TSMT$GraphArc<number> = new TSMT$GraphArc<number>(node, 2.0);
    expect(arc1.cost).toBe(2);
  });

  it('arc accepts proper previous and next arc references', function ()
  {
    const node: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(1);
    const arc: TSMT$GraphArc<number>   = new TSMT$GraphArc<number>(node);

    const node0: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(0);
    const node2: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(2);

    const arc0: TSMT$GraphArc<number> = new TSMT$GraphArc<number>(node0, 1.0);
    const arc2: TSMT$GraphArc<number> = new TSMT$GraphArc<number>(node2, 2.0);

    arc.previous = arc0;
    arc.next     = arc2;

    arc.previous = null;
    arc.next     = null;

    expect(arc.previous === arc0).toBe(true);
    expect(arc.next === arc2).toBe(true);
  });
});

describe('Node and Arc Tests', () =>
{
  it('correctly adds a singleton arc', function ()
  {
    const root: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(1);
    const node: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(2);

    root.addArc(node, 2.0);

    expect(root.arcCount).toBe(1);

    const list: TSMT$GraphArc<number> | null = root.arcList;
    expect(list?.node?.value).toBe(2);
  });

  it('correctly adds and removes multiple arcs', function ()
  {
    const root: TSMT$GraphNode<number>  = new TSMT$GraphNode<number>(1);
    const node: TSMT$GraphNode<number>  = new TSMT$GraphNode<number>(2);
    const node1: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(3);
    const node2: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(4);

    root.addArc(node , 2.0);
    root.addArc(node1, 3.0);
    root.addArc(node2, 4.0);

    expect(root.arcCount).toBe(3);

    let arc: TSMT$GraphArc<number> | null = root.arcList;
    expect(arc?.node?.value).toBe(2);

    arc = arc?.next as TSMT$GraphArc<number>;
    expect(arc?.node?.value).toBe(3);

    arc = arc?.next;
    expect(arc?.node?.value).toBe(4);

    root.removeAllArcs();
    expect(root.arcCount).toBe(0);
    expect(root.arcList).toBe(null);
  });

  it('correctly removes a single arcs', function ()
  {
    const root: TSMT$GraphNode<number>  = new TSMT$GraphNode<number>(1);
    const node: TSMT$GraphNode<number>  = new TSMT$GraphNode<number>(2);
    const node1: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(3);
    const node2: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(4);
    const node3: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(5);

    root.addArc(node , 2.0);
    root.addArc(node1, 3.0);
    root.addArc(node2, 4.0);

    let result: boolean = root.removeArc(node3);
    expect(result).toBe(false);
    expect(root.arcCount).toBe(3);

    result = root.removeArc(node1);
    expect(result).toBe(true);
    expect(root.arcCount).toBe(2);

    let arc: TSMT$GraphArc<number> | null = root.arcList;
    expect(arc?.node?.value).toBe(2);

    arc = arc?.next as TSMT$GraphArc<number>;
    expect(arc?.node?.value).toBe(4);
  });


  it('correctly identifies connectivity', function ()
  {
    const root: TSMT$GraphNode<number>  = new TSMT$GraphNode<number>(1);
    const node: TSMT$GraphNode<number>  = new TSMT$GraphNode<number>(2);
    const node1: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(3);
    const node2: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(4);
    const node3: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(5);

    root.addArc(node , 2.0);

    node1.addArc(node2, 3.0);
    node1.addArc(node3, 1.0);

    node3.addArc(node1, 1.0)

    let result: boolean = root.connected(node);
    expect(result).toBe(true);

    result = root.connected(node3);
    expect(result).toBe(false);

    result = node1.mutuallyConnected(node3);
    expect(result).toBe(true);
  });
});

describe('Graph Tests', () =>
{
  it('Newly constructed graph has zero size and is empty', function ()
  {
    const graph: TSMT$Graph<number> = new TSMT$Graph<number>();

    expect(graph.size).toBe(0);
    expect(graph.isEmpty).toBe(true);
  });

  it('Graph correctly adds nodes', function ()
  {
    const graph: TSMT$Graph<number>     = new TSMT$Graph<number>();
    let node: TSMT$GraphNode<number>    = new TSMT$GraphNode<number>(1);
    const node1: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(2);
    const node2: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(3);

    graph.addNode(node);
    graph.addNode(node1);
    graph.addNode(node2);

    expect(graph.size).toBe(3);
    expect(graph.isEmpty).toBe(false);

    const root: TSMT$GraphNode<number> | null = graph.nodeList;
    expect(root?.value).toBe(1);

    node = root?.next as TSMT$GraphNode<number>;
    expect(node.value).toBe(2);

    node = node.next as TSMT$GraphNode<number>;
    expect(node.value).toBe(3);

    node = node.previous as TSMT$GraphNode<number>;
    expect(node.value).toBe(2);

    node = node.previous as TSMT$GraphNode<number>;
    expect(node.value).toBe(1);

    node = node.previous as TSMT$GraphNode<number>;
    expect(node).toBe(null);
  });

  it('Graph correctly removes a node', function ()
  {
    const graph: TSMT$Graph<number>     = new TSMT$Graph<number>();
    let node: TSMT$GraphNode<number>    = new TSMT$GraphNode<number>(1);
    const node1: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(2);
    const node2: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(3);
    const node3: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(4);

    graph.addNode(node);
    graph.addNode(node1);
    graph.addNode(node2);
    graph.addNode(node3)

    expect(graph.size).toBe(4);

    graph.removeNode(node2);

    const root: TSMT$GraphNode<number> | null= graph.nodeList;
    expect(root?.value).toBe(1);

    node = root?.next as TSMT$GraphNode<number>;
    expect(node.value).toBe(2);

    node = node.next as TSMT$GraphNode<number>;
    expect(node.value).toBe(4);

    node = node.previous as TSMT$GraphNode<number>;
    expect(node.value).toBe(2);

    node = node.previous as TSMT$GraphNode<number>;
    expect(node.value).toBe(1);

    node = node.previous as TSMT$GraphNode<number>;
    expect(node).toBe(null);
  });

  it('Graph correctly finds a node', function ()
  {
    const graph: TSMT$Graph<number>     = new TSMT$Graph<number>();
    const node: TSMT$GraphNode<number>  = new TSMT$GraphNode<number>(1);
    const node1: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(2);
    const node2: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(3);
    const node3: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(4);

    graph.addNode(node);
    graph.addNode(node1);
    graph.addNode(node2);
    graph.addNode(node3)

    expect(graph.size).toBe(4);

    let found: TSMT$GraphNode<number> | null = graph.findNode(2);
    expect(found === node1).toBe(true);

    found = graph.findNode(5);
    expect(found).toBe(null);
  });

  it('Graph correctly builds graph from single arcs', function ()
  {
    const graph: TSMT$Graph<number> = new TSMT$Graph<number>();

    // build the following graph
    // {1, 4}, {1, 5}, {1, 6}, {2, 5}, {2, 6}, {3, 6}, {4, 1}, {5, 1}, {5, 2}, {6, 1}, {6, 2}, {6, 3}

    const node1: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(1);
    const node2: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(2);
    const node3: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(3);
    const node4: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(4);
    const node5: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(5);
    const node6: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(6);

    graph.addNode(node1);
    graph.addNode(node2);
    graph.addNode(node3);
    graph.addNode(node4);
    graph.addNode(node5);
    graph.addNode(node6);

    expect(graph.size).toBe(6);

    graph.addEdge(node1, node4, 1.0);   // 1-4
    graph.addEdge(node1, node5, 0.75);  // 1-5
    graph.addEdge(node1, node6, 1.2);   // 1-6
    graph.addEdge(node2, node5, 0.5);   // 2-5
    graph.addEdge(node2, node6, 1.0);   // 2-6
    graph.addEdge(node3, node6, 1.8);   // 3-6
    graph.addEdge(node4, node1, 1.4);   // 4-1
    graph.addEdge(node5, node1, 0.9);   // 5-1
    graph.addEdge(node5, node2, 1.2);   // 5-2
    graph.addEdge(node6, node1, 1.6);   // 6-1
    graph.addEdge(node6, node2, 1.2);   // 6-2
    graph.addEdge(node6, node3, 1.0);   // 6-3

    const found: TSMT$GraphNode<number> | null = graph.findNode(6);
    expect(found === node6).toBe(true);

    expect(node6.connected(node3)).toBe(true);
  });

  it('Graph properly clears and accepts new data', function ()
  {
    const graph: TSMT$Graph<number> = new TSMT$Graph<number>();

    const node1: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(1);
    const node2: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(2);
    const node3: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(3);

    graph.addNode(node1);
    graph.addNode(node2);
    graph.addNode(node3);

    graph.clear();

    graph.addNode(node1);
    graph.addNode(node2);
    graph.addNode(node3)

    expect(graph.size).toBe(3);
  });

  it('Graph properly identifies presence of a specified value', function ()
  {
    const graph: TSMT$Graph<number> = new TSMT$Graph<number>();

    const node1: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(1);
    const node2: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(2);
    const node3: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(3);

    graph.addNode(node1);
    graph.addNode(node2);
    graph.addNode(node3);

    expect(graph.contains(3)).toBe(true);
    expect(graph.contains(0)).toBe(false);
  });

  it('Graph properly exports nodes as an array', function ()
  {
    const graph: TSMT$Graph<number> = new TSMT$Graph<number>();

    const node1: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(1);
    const node2: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(2);
    const node3: TSMT$GraphNode<number> = new TSMT$GraphNode<number>(3);

    graph.addNode(node1);
    graph.addNode(node2);
    graph.addNode(node3);

    const nodes: Array<TSMT$GraphNode<number>> = graph.toArray();

    expect(nodes.length).toBe(3);
    expect(nodes[0] === node1).toBe(true);
  });
});

describe('TSMT Simple Graph', () => {

  const graph: TSMT$SimpleGraph = new TSMT$SimpleGraph();

  it('newly constructed Graph has no vertices or edges', function () {
    expect(graph.edgeCount).toBe(0);
    expect(graph.vertexCount).toBe(0);
  });

  it('edge list of empty graph is an empty array', function () {
    expect(graph.edgeList.length).toBe(0);
  });

  it('MST of empty graph is an empty array', function () {
    expect(graph.mst().length).toBe(0);
  });

  it('adds a single edge', function () {
    const n1: TSMT$INode = TSMT$SimpleGraph.createNode('A');
    const n2: TSMT$INode = TSMT$SimpleGraph.createNode('B');

    const e: TSMT$IEdge = {
      v1: n1,
      v2: n2,
      w: 1
    };

    graph.addEdge(e);

    expect(graph.vertexCount).toBe(2);
    expect(graph.edgeCount).toBe(1);
  });

  it('clear works', function () {
    const n1: TSMT$INode = TSMT$SimpleGraph.createNode('C');
    const n2: TSMT$INode = TSMT$SimpleGraph.createNode('D');

    const e: TSMT$IEdge = {
      v1: n1,
      v2: n2,
      w: 2
    };

    graph.addEdge(e);

    graph.clear();

    expect(graph.vertexCount).toBe(0);
    expect(graph.edgeCount).toBe(0);
    expect(graph.mst().length).toBe(0);
  });

  it('adds multiple edges', function () {
    graph.clear();

    const zero: TSMT$INode = TSMT$SimpleGraph.createNode('0');
    const one: TSMT$INode = TSMT$SimpleGraph.createNode('1');

    const two: TSMT$INode = TSMT$SimpleGraph.createNode('2');
    const three: TSMT$INode = TSMT$SimpleGraph.createNode('3');

    const e1: TSMT$IEdge = {
      v1: zero,
      v2: two,
      w: 6
    };

    const e2: TSMT$IEdge = {
      v1: zero,
      v2: one,
      w: 10
    };

    const e3: TSMT$IEdge = {
      v1: two,
      v2: three,
      w: 4
    };

    const e4: TSMT$IEdge = {
      v1: one,
      v2: three,
      w: 15
    };

    const e5: TSMT$IEdge = {
      v1: zero,
      v2: three,
      w: 5
    };

    graph.addEdge(e1);
    graph.addEdge(e2);
    graph.addEdge(e3);
    graph.addEdge(e4);
    graph.addEdge(e5);

    expect(graph.vertexCount).toBe(4);
    expect(graph.edgeCount).toBe(5);
  });

  it('MST of a single edge is the single edge', function () {
    graph.clear();

    const n1: TSMT$INode = TSMT$SimpleGraph.createNode('C');
    const n2: TSMT$INode = TSMT$SimpleGraph.createNode('D');

    const e: TSMT$IEdge = {
      v1: n1,
      v2: n2,
      w: 2
    };

    graph.addEdge(e);

    expect(graph.vertexCount).toBe(2);
    expect(graph.edgeCount).toBe(1);

    const mst: Array<TSMT$IEdge> = graph.mst();

    expect(mst.length).toBe(1);
    expect(mst[0].v1.key).toBe('C');
    expect(mst[0].v2.key).toBe('D');
  });

  it('MST test #1', function () {
    graph.clear();

    const zero: TSMT$INode = TSMT$SimpleGraph.createNode('0');
    const one: TSMT$INode = TSMT$SimpleGraph.createNode('1');

    const two: TSMT$INode = TSMT$SimpleGraph.createNode('2');
    const three: TSMT$INode = TSMT$SimpleGraph.createNode('3');

    const e1: TSMT$IEdge = {
      v1: zero,
      v2: two,
      w: 6
    };

    const e2: TSMT$IEdge = {
      v1: zero,
      v2: one,
      w: 10
    };

    const e3: TSMT$IEdge = {
      v1: two,
      v2: three,
      w: 4
    };

    const e4: TSMT$IEdge = {
      v1: one,
      v2: three,
      w: 15
    };

    const e5: TSMT$IEdge = {
      v1: zero,
      v2: three,
      w: 5
    };

    graph.addEdge(e1);
    graph.addEdge(e2);
    graph.addEdge(e3);
    graph.addEdge(e4);
    graph.addEdge(e5);

    expect(graph.vertexCount).toBe(4);
    expect(graph.edgeCount).toBe(5);

    const mst: Array<TSMT$IEdge> = graph.mst();

    expect(mst.length).toBe(3);

    expect(mst[0].v1.key).toBe('2');
    expect(mst[0].v2.key).toBe('3');
    expect(mst[1].v1.key).toBe('0');
    expect(mst[1].v2.key).toBe('3');
    expect(mst[2].v1.key).toBe('0');
    expect(mst[2].v2.key).toBe('1');
    expect(TSMT$SimpleGraph.getCost(mst)).toBe(19);
  });

  it('from Object test #1', function () {
    graph.clear();

    graph.fromObject(graph1);

    expect(graph.vertexCount).toBe(9);

    expect(graph.edgeCount).toBe(14);
  });

  it('MST from Object data test #1', function () {
    graph.clear();

    graph.fromObject(graph1);

    expect(graph.vertexCount).toBe(9);
    expect(graph.edgeCount).toBe(14);

    const mst: Array<TSMT$IEdge> = graph.mst();

    expect(mst.length).toBe(8);

    let e: TSMT$IEdge = mst[0];
    expect(e.v1.key).toBe('7');
    expect(e.v2.key).toBe('6');

    e = mst[1];
    expect(e.v1.key).toBe('2');
    expect(e.v2.key).toBe('8');

    e = mst[2];
    expect(e.v1.key).toBe('6');
    expect(e.v2.key).toBe('5');

    e = mst[3];
    expect(e.v1.key).toBe('0');
    expect(e.v2.key).toBe('1');

    e = mst[4];
    expect(e.v1.key).toBe('2');
    expect(e.v2.key).toBe('5');

    e = mst[5];
    expect(e.v1.key).toBe('2');
    expect(e.v2.key).toBe('3');

    e = mst[6];
    expect(e.v1.key).toBe('0');
    expect(e.v2.key).toBe('7');

    e = mst[7];
    expect(e.v1.key).toBe('3');
    expect(e.v2.key).toBe('4');

    expect(TSMT$SimpleGraph.getCost(mst)).toBe(37);
  });

  it('MST from Object data test #2', function () {
    graph.clear();

    graph.fromObject(graph2);

    expect(graph.vertexCount).toBe(7);
    expect(graph.edgeCount).toBe(9);

    const mst: Array<TSMT$IEdge> = graph.mst();

    expect(mst.length).toBe(6);

    let e: TSMT$IEdge = mst[0];
    expect(e.v1.key).toBe('A');
    expect(e.v2.key).toBe('C');

    e = mst[1];
    expect(e.v1.key).toBe('C');
    expect(e.v2.key).toBe('E');

    e = mst[2];
    expect(e.v1.key).toBe('C');
    expect(e.v2.key).toBe('D');

    e = mst[3];
    expect(e.v1.key).toBe('A');
    expect(e.v2.key).toBe('B');

    e = mst[4];
    expect(e.v1.key).toBe('B');
    expect(e.v2.key).toBe('F');

    e = mst[5];
    expect(e.v1.key).toBe('E');
    expect(e.v2.key).toBe('G');

    expect(TSMT$SimpleGraph.getCost(mst)).toBe(26);
  });

  it('MST Test #3', function () {
    graph.clear();

    graph.fromObject(graph3);

    expect(graph.vertexCount).toBe(8);

    const mst: Array<TSMT$IEdge> = graph.mst();
    const E: number = mst.length;

    expect(E).toBe(7);

    expect(mst[0].v1.key).toBe('2');
    expect(mst[0].v2.key).toBe('4');
    expect(mst[1].v1.key).toBe('3');
    expect(mst[1].v2.key).toBe('5');
    expect(mst[2].v1.key).toBe('2');
    expect(mst[2].v2.key).toBe('3');
    expect(mst[3].v1.key).toBe('6');
    expect(mst[3].v2.key).toBe('7');
    expect(mst[4].v1.key).toBe('1');
    expect(mst[4].v2.key).toBe('3');
    expect(mst[5].v1.key).toBe('7');
    expect(mst[5].v2.key).toBe('8');
    expect(mst[6].v1.key).toBe('5');
    expect(mst[6].v2.key).toBe('7');

    expect(TSMT$SimpleGraph.getCost(mst)).toBe(50);
  });

  it('toTree test', function () {
    graph.clear();

    graph.fromObject(graph2);

    const mst: Array<TSMT$IEdge> = graph.mst();

    const root: TSMT$INode | null = TSMT$SimpleGraph.toTree(mst);
    expect(root?.key).toBe('A');

    let children: Array<TSMT$INode> = gatherChildren(root);
    expect(children.length).toBe(2);

    let node: TSMT$INode = children[0];
    expect(node.key).toBe('C');

    node = children[1];
    expect(node.key).toBe('B');

    // children of C are D and E
    node     = children[0];
    children = gatherChildren(node);
    expect(children.length).toBe(2);
    expect(children[0].key).toBe('E');
    expect(children[1].key).toBe('D');

    // E has one child - G
    node     = children[0];
    children = gatherChildren(node);
    expect(children.length).toBe(1);
    expect(children[0].key).toBe('G');

    // back to A - pick up child of B
    children = gatherChildren(root);
    node     = children[1];

    expect(node.key).toBe('B');
    children = gatherChildren(node);
    expect(children.length).toBe(1);
    expect(children[0].key).toBe('F');
  });

  it('Cluster edge-case test #1', function () {
    graph.clear();

    const clusters: Array<TSMT$INode> = graph.cluster(cluster1, TSMT_CLUSTER_TYPE.BY_NUMBER, {clusters: 0});

    expect(clusters.length).toBe(0);
  });

  it('Cluster edge-case test #2', function () {
    graph.clear();

    const clusters: Array<TSMT$INode> = graph.cluster(cluster1, TSMT_CLUSTER_TYPE.BY_NUMBER, {clusters: 1});

    expect(clusters.length).toBe(1);

    const cluster: Array<TSMT$INode> = graph.preorder(clusters[0]);

    expect(cluster.length).toBe(8);

    expect(cluster[0].key).toBe('A');
    expect(cluster[1].key).toBe('B');
    expect(cluster[2].key).toBe('C');
    expect(cluster[3].key).toBe('D');
    expect(cluster[4].key).toBe('E');
    expect(cluster[5].key).toBe('F');
    expect(cluster[6].key).toBe('H');
    expect(cluster[7].key).toBe('G');
  });

  it('Cluster edge-case test #3', function () {
    graph.clear();

    const clusters: Array<TSMT$INode> = graph.cluster(cluster1, TSMT_CLUSTER_TYPE.BY_NUMBER, {clusters: 8});

    expect(clusters.length).toBe(8);

    expect(clusters[0].key).toBe('A');
    expect(clusters[1].key).toBe('B');
    expect(clusters[2].key).toBe('C');
    expect(clusters[3].key).toBe('D');
    expect(clusters[4].key).toBe('E');
    expect(clusters[5].key).toBe('F');
    expect(clusters[6].key).toBe('G');
    expect(clusters[7].key).toBe('H');

    expect(clusters[0].children).toBe(null);
    expect(clusters[1].children).toBe(null);
    expect(clusters[2].children).toBe(null);
    expect(clusters[3].children).toBe(null);
    expect(clusters[4].children).toBe(null);
    expect(clusters[5].children).toBe(null);
    expect(clusters[6].children).toBe(null);
    expect(clusters[7].children).toBe(null);
  });

  it('Cluster test #1', function () {
    graph.clear();

    // test a default of two clusters
    const clusters: Array<TSMT$INode> = graph.cluster(cluster1);

    expect(clusters.length).toBe(2);

    let root: TSMT$INode = clusters[0];
    expect(root.key).toBe('A');

    root = clusters[1];
    expect(root.key).toBe('E');

    // test the two tree structures
    root = clusters[0];
    let children: Array<TSMT$INode> = gatherChildren(root);

    expect(children.length).toBe(1);

    let node: TSMT$INode = children[0];
    expect(node.key).toBe('B');

    children = gatherChildren(node);
    expect(children.length).toBe(1);

    node = children[0];
    expect(node.key).toBe('C');

    children = gatherChildren(node);
    expect(children.length).toBe(1);

    node = children[0];
    expect(node.key).toBe('D');

    children = gatherChildren(node);
    expect(children.length).toBe(0);

    // -----
    root     = clusters[1];
    children = gatherChildren(root);
    expect(children.length).toBe(2);

    node = children[0];
    expect(node.key).toBe('F');

    children = gatherChildren(node);
    expect(children.length).toBe(1);
    node = children[0];

    expect(node.key).toBe('H');
    children = gatherChildren(node);
    expect(children.length).toBe(0);
  });

  it('Cluster test #2', function () {
    graph.clear();

    // test a default of two clusters
    const clusters: Array<TSMT$INode> = graph.cluster(cluster1);

    expect(clusters.length).toBe(2);

    // test preorder collection from each cluster
    let root: TSMT$INode = clusters[0];
    expect(root.key).toBe('A');

    let cluster: Array<TSMT$INode> = graph.preorder(root);

    expect(cluster.length).toBe(4);
    expect(cluster[0].key).toBe('A');
    expect(cluster[1].key).toBe('B');
    expect(cluster[2].key).toBe('C');
    expect(cluster[3].key).toBe('D');

    root = clusters[1];
    expect(root.key).toBe('E');

    cluster = graph.preorder(root);

    expect(cluster.length).toBe(4);
    expect(cluster[0].key).toBe('E');
    expect(cluster[1].key).toBe('F');
    expect(cluster[2].key).toBe('H');
    expect(cluster[3].key).toBe('G');
  });

  it('Cluster test #3', function () {
    graph.clear();

    // 3-cluster test
    const clusters: Array<TSMT$INode> = graph.cluster(cluster1, TSMT_CLUSTER_TYPE.BY_NUMBER, {clusters: 3});

    let root: TSMT$INode = clusters[0];
    expect(root.key).toBe('A');

    // check tree structure for each cluster
    let children: Array<TSMT$INode> = gatherChildren(root);

    expect(children.length).toBe(1);

    let node: TSMT$INode = children[0];
    expect(node.key).toBe('B');

    children = gatherChildren(node);

    expect(children.length).toBe(0);

    root = clusters[1];
    expect(root.key).toBe('E');

    children = gatherChildren(root);
    expect(children.length).toBe(2);

    node = children[0];
    expect(node.key).toBe('F');

    children = gatherChildren(node);

    expect(children.length).toBe(1);
    node = children[0];

    expect(node.key).toBe('H');
    children = gatherChildren(node);
    expect(children.length).toBe(0);

    root = clusters[2];
    expect(root.key).toBe('C');

    children = gatherChildren(root);
    expect(children.length).toBe(1);

    node = children[0];
    expect(node.key).toBe('D');

    children = gatherChildren(node);
    expect(children.length).toBe(0);
  });

  it('Cluster test #4', function () {
    graph.clear();

    // 3-cluster test
    const clusters: Array<TSMT$INode> = graph.cluster(cluster1, TSMT_CLUSTER_TYPE.BY_NUMBER, {clusters: 3});

    // test preorder collection from each cluster
    let root: TSMT$INode = clusters[0];
    expect(root.key).toBe('A');

    let cluster: Array<TSMT$INode> = graph.preorder(root);
    expect(cluster.length).toBe(2);
    expect(cluster[0].key).toBe('A');
    expect(cluster[1].key).toBe('B');

    root = clusters[1];
    expect(root.key).toBe('E');

    cluster = graph.preorder(root);
    expect(cluster.length).toBe(4);
    expect(cluster[0].key).toBe('E');
    expect(cluster[1].key).toBe('F');
    expect(cluster[2].key).toBe('H');
    expect(cluster[3].key).toBe('G');

    root = clusters[2];
    expect(root.key).toBe('C');
    cluster = graph.preorder(root);

    expect(cluster.length).toBe(2);
    expect(cluster[0].key).toBe('C');
    expect(cluster[1].key).toBe('D');
  });

  it('Cluster test #5', function () {
    graph.clear();

    // one-cluster test also checks toTree() method
    const clusters: Array<TSMT$INode> = graph.cluster(cluster2, TSMT_CLUSTER_TYPE.BY_NUMBER, {clusters: 1});

    expect(clusters.length).toBe(1);

    const root: TSMT$INode = clusters[0];
    expect(root.key).toBe('a');

    let children: Array<TSMT$INode> = gatherChildren(root);

    expect(children.length).toBe(3);

    const b: TSMT$INode = children[0];
    const e: TSMT$INode = children[1];
    const g: TSMT$INode = children[2];

    expect(b.key).toBe('b');
    expect(e.key).toBe('e');
    expect(g.key).toBe('g');

    children = gatherChildren(b);
    expect(children.length).toBe(2);

    const f: TSMT$INode = children[0];
    expect(f.key).toBe('f');

    children = gatherChildren(f);
    expect(children.length).toBe(1);

    const h: TSMT$INode = children[0];
    expect(h.key).toBe('h');

    children = gatherChildren(h);
    expect(children.length).toBe(1);

    const i: TSMT$INode = children[0];
    expect(i.key).toBe('i');

    children = gatherChildren(i);

    expect(children.length).toBe(2);

    const k: TSMT$INode = children[0];
    const n: TSMT$INode = children[1];

    expect(k.key).toBe('k');
    expect(n.key).toBe('n');

    children = gatherChildren(k);
    expect(children.length).toBe(1);

    const j: TSMT$INode = children[0];
    expect(j.key).toBe('j');

    children = gatherChildren(n);
    expect(children.length).toBe(1);

    const m: TSMT$INode = children[0];
    expect(m.key).toBe('m');

    children = gatherChildren(m);
    expect(children.length).toBe(2);

    const l: TSMT$INode = children[0];
    expect(l.key).toBe('l');

    const o: TSMT$INode = children[1];
    expect(o.key).toBe('o');
  });

  it('Cluster test #6', function () {
    graph.clear();

    // one-cluster test also checks toTree() method
    const clusters: Array<TSMT$INode> = graph.cluster(cluster2, TSMT_CLUSTER_TYPE.BY_NUMBER, {clusters: 1});

    expect(clusters.length).toBe(1);

    const root: TSMT$INode = clusters[0];
    expect(root.key).toBe('a');

    const cluster: Array<TSMT$INode> = graph.preorder(root);

    expect(cluster.length).toBe(15);

    expect(cluster[0].key).toBe('a');
    expect(cluster[1].key).toBe('b');
    expect(cluster[2].key).toBe('f');
    expect(cluster[3].key).toBe('h');
    expect(cluster[4].key).toBe('i');
    expect(cluster[5].key).toBe('k');
    expect(cluster[6].key).toBe('j');
    expect(cluster[7].key).toBe('n');
    expect(cluster[8].key).toBe('m');
    expect(cluster[9].key).toBe('l');
    expect(cluster[10].key).toBe('o');
    expect(cluster[11].key).toBe('d');
    expect(cluster[12].key).toBe('c');
    expect(cluster[13].key).toBe('e');
    expect(cluster[14].key).toBe('g');
  });

  it('Cluster test #7', function () {
    graph.clear();

    const clusters: Array<TSMT$INode> = graph.cluster(cluster2, TSMT_CLUSTER_TYPE.BY_NUMBER, {clusters: 2});

    expect(clusters.length).toBe(2);

    let root: TSMT$INode = clusters[0];
    expect(root.key).toBe('a');

    let cluster: Array<TSMT$INode> = graph.preorder(root);

    expect(cluster.length).toBe(11);

    expect(cluster[0].key).toBe('a');
    expect(cluster[1].key).toBe('b');
    expect(cluster[2].key).toBe('f');
    expect(cluster[3].key).toBe('h');
    expect(cluster[4].key).toBe('i');
    expect(cluster[5].key).toBe('k');
    expect(cluster[6].key).toBe('j');
    expect(cluster[7].key).toBe('d');
    expect(cluster[8].key).toBe('c');
    expect(cluster[9].key).toBe('e');
    expect(cluster[10].key).toBe('g');

    root    = clusters[1];
    cluster = graph.preorder(root);

    expect(root.key).toBe('n');

    expect(cluster[0].key).toBe('n');
    expect(cluster[1].key).toBe('m');
    expect(cluster[2].key).toBe('l');
    expect(cluster[3].key).toBe('o');
  });

  it('Cluster test #8', function () {
    graph.clear();

    const clusters: Array<TSMT$INode> = graph.cluster(cluster2, TSMT_CLUSTER_TYPE.BY_NUMBER, {clusters: 3});

    expect(clusters.length).toBe(3);

    let root: TSMT$INode = clusters[0];
    expect(root.key).toBe('a');

    let cluster: Array<TSMT$INode> = graph.preorder(root);

    expect(cluster.length).toBe(7);

    expect(cluster[0].key).toBe('a');
    expect(cluster[1].key).toBe('b');
    expect(cluster[2].key).toBe('f');
    expect(cluster[3].key).toBe('d');
    expect(cluster[4].key).toBe('c');
    expect(cluster[5].key).toBe('e');
    expect(cluster[6].key).toBe('g');

    root    = clusters[1];
    cluster = graph.preorder(root);

    expect(root.key).toBe('n');

    expect(cluster[0].key).toBe('n');
    expect(cluster[1].key).toBe('m');
    expect(cluster[2].key).toBe('l');
    expect(cluster[3].key).toBe('o');

    root = clusters[2];
    cluster = graph.preorder(root);

    expect(root.key).toBe('h');

    expect(cluster[0].key).toBe('h');
    expect(cluster[1].key).toBe('i');
    expect(cluster[2].key).toBe('k');
    expect(cluster[3].key).toBe('j');
  });
});

describe('Graph from list', () => {

  it('Returns empty Graph from invalid input', () =>
  {
    const graph: TSMT$Graph<string> = graphFromList(null);

    expect(graph.size).toBe(0);
  });

  it('Correctly creates a graph from basic data', () =>
  {
    const graph: TSMT$Graph<string> = graphFromList(testGraph1);

    expect(graph.size).toBe(8);
  });
});

describe('DFS', () => {

  it('Returns empty list from invalid input', () =>
  {
    const graph: TSMT$Graph<string> = new TSMT$Graph<string>();

    expect(graph.size).toBe(0);

    const list: Array<TSMT$GraphNode<string>> = graph.DFS();
    expect(list.length).toBe(0);
  });

  it('Correctly traverses a graph from the root node #1', () =>
  {
    const graph: TSMT$Graph<string> = graphFromList(testGraph1);

    expect(graph.size).toBe(8);

    const list: Array<TSMT$GraphNode<string>> = graph.DFS();
    expect(list.length).toBe(8);

    expect(list[0].id).toBe('R');
    expect(list[1].id).toBe('A');
    expect(list[2].id).toBe('D');
    expect(list[3].id).toBe('G');
    expect(list[4].id).toBe('B');
    expect(list[5].id).toBe('E');
    expect(list[6].id).toBe('C');
    expect(list[7].id).toBe('F');
  });

  it('Correctly traverses a graph from the root node #2', () =>
  {
    const graph: TSMT$Graph<string> = graphFromList(testGraph2);

    expect(graph.size).toBe(5);

    const list: Array<TSMT$GraphNode<string>> = graph.DFS();

    expect(list[0].id).toBe('0');
    expect(list[1].id).toBe('1');
    expect(list[2].id).toBe('2');
    expect(list[3].id).toBe('4');
    expect(list[4].id).toBe('3');
  });

  it('Correctly traverses a graph from the root node #3', () =>
  {
    const graph: TSMT$Graph<string> = graphFromList(testGraph3);

    expect(graph.size).toBe(9);

    const list: Array<TSMT$GraphNode<string>> = graph.DFS();

    expect(list[0].id).toBe('A');
    expect(list[1].id).toBe('B');
    expect(list[2].id).toBe('S');
    expect(list[3].id).toBe('C');
    expect(list[4].id).toBe('D');
    expect(list[5].id).toBe('E');
    expect(list[6].id).toBe('H');
    expect(list[7].id).toBe('F');
    expect(list[8].id).toBe('G');
  });

  it('Correctly traverses a graph from a node with specified value', () =>
  {
    const graph: TSMT$Graph<string> = graphFromList(testGraph1);

    expect(graph.size).toBe(8);

    const list: Array<TSMT$GraphNode<string>> = graph.DFS('A');

    expect(list.length).toBe(3);

    expect(list[0].id).toBe('A');
    expect(list[1].id).toBe('D');
    expect(list[2].id).toBe('G');
  });
});

describe('BFS', () => {

  it('Returns empty list from invalid input', () => {
    const graph: TSMT$Graph<string> = new TSMT$Graph<string>();

    expect(graph.size).toBe(0);

    const list: Array<TSMT$GraphNode<string>> = graph.BFS();
    expect(list.length).toBe(0);
  });

  it('Correctly traverses a graph from the root node #1', () =>
  {
    const graph: TSMT$Graph<string> = graphFromList(testGraph4);

    expect(graph.size).toBe(8);

    const list: Array<TSMT$GraphNode<string>> = graph.BFS();

    expect(list.length).toBe(8);

    expect(list[0].id).toBe('0');
    expect(list[1].id).toBe('1');
    expect(list[2].id).toBe('2');
    expect(list[3].id).toBe('3');
    expect(list[4].id).toBe('4');
    expect(list[5].id).toBe('5');
    expect(list[6].id).toBe('6');
    expect(list[7].id).toBe('7');
  });

  it('Correctly traverses a graph from the root node #2', () =>
  {
    const graph: TSMT$Graph<string> = graphFromList(testGraph5);

    expect(graph.size).toBe(6);

    const list: Array<TSMT$GraphNode<string>> = graph.BFS();

    expect(list.length).toBe(6);

    expect(list[0].id).toBe('R');
    expect(list[1].id).toBe('1');
    expect(list[2].id).toBe('2');
    expect(list[3].id).toBe('3');
    expect(list[4].id).toBe('4');
    expect(list[5].id).toBe('5');
  });

  it('Correctly traverses a graph from the root node #3', () =>
  {
    const graph: TSMT$Graph<string> = graphFromList(testGraph1);

    expect(graph.size).toBe(8);

    const list: Array<TSMT$GraphNode<string>> = graph.BFS();

    expect(list.length).toBe(8);

    expect(list[0].id).toBe('R');
    expect(list[1].id).toBe('A');
    expect(list[2].id).toBe('B');
    expect(list[3].id).toBe('C');
    expect(list[4].id).toBe('D');
    expect(list[5].id).toBe('E');
    expect(list[6].id).toBe('F');
    expect(list[7].id).toBe('G');
  });
});

