/**
 * Copyright 2019 Jim Armstrong
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
 * A very lightweight graph class for use in organizing arcs in A* for waypoints.  This is not a full-featured
 * graph as it has fixed graph nodes and only the minimal needed functionality to work in the A* algorithm.
 * All graph nodes are {AStarWaypoint} instances
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */

import {
  AStarWaypoint,
  createWaypoint
} from './astar-waypoint';

import { AStarGraphArc  } from './astar-graph-arc';

export type CostFunction = (v1: AStarWaypoint, v2: AStarWaypoint) => number;

/**
 * Graph Models
 */
export interface IAStarWaypoint
{
  key: string;
  x: number;
  y: number;
};

export interface IAStarGraphData
{
  isCartesian: boolean;
  waypoints: Array<IAStarWaypoint>;
  edges: Array<IEdgeData>;
};

/**
 * Edge Model
 */
export interface IEdge
{
  key: string;          // key or unique id for string
  v1: AStarWaypoint;    // first vertex
  v2: AStarWaypoint;    // second vertex
  w?: number;           // fixed edge weight or cost
  cost?: CostFunction;  // optional cost function
}

/**
 * Edge data
 */
export interface IEdgeData
{
  key: string;         // key or unique id for the edge
  from: string;        // An edge begins at this vertex or node key
  to: string;          // An edge ends at this vertex or node key
  w?: number;          // edge weight or cost (if not present, defaults to distance metric)
}

export class AStarGraph
{
  protected _nodeCount: number;                      // size or number of nodes in the graph
  protected _edgeCount: number;                      // number of edges or arcs in the graph

  protected _nodes: Record<string, AStarWaypoint>;   // lookup Node based on a key

  protected _edges: Record<string, AStarGraphArc>;   // lookup Edge based on a key

  protected _nodeList: AStarWaypoint | null;         // head/tail of node list for this graph

  protected _isCartesian: boolean;                   // true (x,y) if are cartesian coords, false for (long, lat)

  constructor()
  {
    this._isCartesian = true;

    this._nodeList = null;

    this._nodes     = {};
    this._edges     = {};
    this._nodeCount = 0;
    this._edgeCount = 0;
  }

  /**
   * Clear this graph
   */
  public clear(): void
  {
    let node: AStarWaypoint | null = this._nodeList;
    let next: AStarWaypoint | null;
    let arc: AStarGraphArc | null;
    let nextArc: AStarGraphArc | null;

    while (node != null)
    {
      next = node.next;
      arc  = node.arcList;

      while (arc != null)
      {
        nextArc  = arc.next;
        arc.next = arc.prev = null;
        arc.node = null;
        arc      = nextArc;
      }

      node.next    = node.prev = null;
      node.arcList = null;
      node         = next;
    }

    this._nodeList = null;

    this._nodes     = {};
    this._edges     = {};
    this._nodeCount = 0;
    this._edgeCount = 0;
  }

  /**
   * Access the size or number of nodes in this graph
   *
   * @returns {number} Number of nodes in the graph
   */
  public get size(): number
  {
    return this._nodeCount;
  }

  /**
   * Access the total edge count of this graph
   */
  public get edgeCount(): number
  {
    return this._edgeCount;
  }

  /**
   * Access the head of the node list (direct reference for performance)
   */
  public get nodeList(): AStarWaypoint | null
  {
    return this._nodeList;
  }

  /**
   * Access whether or not graph nodes contain cartesian or geo-coded coordinates
   */
  public get isCartesian(): boolean
  {
    return this._isCartesian;
  }

  /**
   * Assign whether or not coordinates are cartesian
   *
   * @param {boolean} value True if (x,y) are cartesian coords, false if (long, lat)
   */
   public set isCartesian(value: boolean)
   {
     this._isCartesian = value === true;
   }  

  /**
   * Access a graph edge by key and return {null} if no such edge or arc exists with the supplied key
   *
   * @param key Edge key
   */
  public getEdge(key: string): AStarGraphArc | null
  {
    return this._edges !== undefined
      ? this._edges[key] !== undefined
        ? this._edges[key]
        : null
      : null;
  }

  /**
   * Access a graph node by key and return {null} if no graph node exists with the supplied key
   *
   * @param key {AStarWaypoint} key for search
   */
  public getNode(key: string): AStarWaypoint | null
  {
    if (key !== undefined && key != null)
    {
      const keys: Array<string> = Object.keys(this._nodes);
      const n: number           = keys.length;
      let i: number;

      for (i = 0; i < n; ++i) {
        if (key === keys[i]) return this._nodes[keys[i]];
      }
    }

    return null;
  }

  /**
   * Create a graph representation from a data object
   *
   * @param {AStarGraph} data JSON graph data for all possible waypoints and connections
   */
  public fromObject(data: IAStarGraphData): void
  {
    if (data === undefined || data == null) {
      return;
    }

    if (!data.edges || !data.waypoints) return;

    const nodeList: Array<IAStarWaypoint> = data.waypoints;

    let i: number;
    let v: AStarWaypoint;
    let node: IAStarWaypoint;

    let n: number = nodeList.length;

    this.clear();

    for (i = 0; i < n; ++i)
    {
      node = nodeList[i];

      // guard against repeated nodes - could be errors/typos in the data
      if (!this._nodes[node.key])
      {
        // create a new vertex
        v = createWaypoint(node.key, node.x, node.y);

        this.addNode(v);
      }
    }

    const edgeList: Array<IEdgeData> = data.edges;
    n                                = edgeList.length;

    let e: IEdgeData;
    let v1: AStarWaypoint;
    let v2: AStarWaypoint;
    let w: number;

    for (i = 0; i < n; ++i)
    {
      e = edgeList[i];
      if (!this._edges[e.key])
      {
        v1 = this._nodes[e.from];
        v2 = this._nodes[e.to];
        w  = e.w ? e.w : this.__getWeight(v1, v2, 1);

        this.addEdge({
          key: e.key,
          v1: v1,
          v2: v2,
          w: w
        });
      }
    }
  }

  /**
   * Add a node to the graph
   *
   * @param {AStarWaypoint} node Reference to A* waypoint that is added to the graph
   */
  public addNode(node: AStarWaypoint): void
  {
    if (node !== undefined && node != null)
    {
      this._nodes[node.key] = node;

      this._nodeCount++;

      node.next = this._nodeList;
      if (node.next != null) {
        node.next.prev = node;
      }

      this._nodeList = node;
    }
  }

  /**
   * Add an edge to the A* graph
   *
   * @param {IEdge} edge Edge to be added
   *
   * @returns {nothing}
   */
  public addEdge(edge: IEdge): void
  {
    if (edge)
    {
      if (edge.v1 !== undefined && edge.v1 != null && edge.v2 !== undefined && edge.v2 != null)
      {
        this._edgeCount++;

        const source: AStarWaypoint = edge.v1;
        const target: AStarWaypoint = edge.v2;
        const cost: CostFunction | number = edge.w && edge.w >= 0
          ? edge.w
          : edge.cost
            ? edge.cost
            : 0;

        const arc: AStarGraphArc = source.addArc(target, cost) as AStarGraphArc;
        this._edges[edge.key] = arc;
      }
    }
  }

  public updateEdgeCost(key: string, cost: CostFunction | number): void
  {
    if (this._edges[key]) this._edges[key].cost = cost;
  }

  /**
   * Get the weight or cost of an edge based a weighted distance metric, w*{norm} where {norm} is
   * the Euclidean distance between the two vertices (or zero if no coordinates are provided)
   *
   * @param {AStarWaypoint} v1 First edge
   *
   * @param {AStarWaypoint} v2 Second edge
   *
   * @param {number} w Weight or cost multiplier
   */
  protected __getWeight(v1: AStarWaypoint, v2: AStarWaypoint, w: number=1): number
  {
    return w*v1.distanceTo(v2);
  }
}
