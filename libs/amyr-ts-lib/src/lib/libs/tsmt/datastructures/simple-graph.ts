/**
 * Copyright 2018 Jim Armstrong (www.algorithmist.net)
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
 * Typescript Math Toolkit: Simple Graph.  This is a very lightweight graph class that contains in-lined methods for
 * union-find that are in the TSMT$DisjointSet data structure for purposes of computing the MST.  The ability to read
 * graph data from a file is provided along with clustering.  This structure is useful when the graph should be
 * constructed directly from {Object} data (i.e. a service return) and then either the MST is directly computed or
 * cluster analysis is immediately performed.  No further operations are supported on the graph.
 *
 * Note that there are more efficient methods for computing the Euclidean MST, but the number of nodes is expected
 * to be sufficiently small that actual run-time will be more than adequate for a higher complexity, but simpler to
 * implement (and general) MST.
 *
 * This is a convenience class that provides computations in a package that is optimized for performance.  As such,
 * mutability of internal structures is possible.  Expected use-case for this class is an assign-once, compute-once
 * mode, so mutability should not be much of an issue.
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */

import { sortOn } from "../../sorting/sort-on";

/**
 * This is a convenience function that gathers all children of a node into an array
 *
 * @param {TSMT$INode} root Reference to root node
 *
 */
export function gatherChildren(root: TSMT$INode | null): Array<TSMT$INode>
{
  if (root == null) return [];

  let n: TSMT$INode = root.children as TSMT$INode;
  if (n === undefined || n == null) return [];

  const children: Array<TSMT$INode> = [n];
  while (n.next != null) {
    children.push(n.next);

    n = n.next;
  }

  return children;
};

// types of clustering
export enum TSMT_CLUSTER_TYPE
{
  AUTO      = 'auto',
  BY_NUMBER = 'by_number'
}

/**
 * Cluster params
 */
export interface ClusterParams
{
  clusters: number;
}

/**
 * Default cluster parameters for k-cluster
 */
export const TSMT_CLUSTER_DEFAULT_PARAMS: ClusterParams = {
  clusters: 2
};

/**
 * Node Model
 */
export interface TSMT$INode
{
  key: string;
  parent: TSMT$INode | null;
  rank: number;
  next?: TSMT$INode | null;
  children?: TSMT$INode | null;
  tail?: TSMT$INode | null;
  x?: number;
  y?: number;
}

/**
 * Edge Model
 */
export interface TSMT$IEdge
{
  v1: TSMT$INode;      // first vertex
  v2: TSMT$INode;      // second vertex
  w: number;           // edge weight
  marked?: boolean;    // reserved for future use in algorithms where an edge needs to be marked during cluster computations
}

/**
 * Edge data
 */
export interface TSMT$IEdgeData
{
  from: string;        // An edge begins at this vertex or node key
  to: string;          // An edge ends at this vertex or node key
  w: number;           // edge weight or cost
}

/**
 * Node data
 */
export interface TSMT$INodeData
{
  key: string;         // Every node must have a unique string identifier or key
  x?: number;          // optional x-coordinate
  y?: number;          // optional y-coordinate
}

/**
 * Cluster data model
 */
export interface TSMT$ClusterData
{
  nodes: Array<TSMT$INodeData>;   // vertex list
}

/**
 * Graph model from Object data
 */
export interface TSMT$GraphData extends TSMT$ClusterData
{
  useCoords?: boolean;            // true if vertex coordinates are to be used in computing edge costs
  edges: Array<TSMT$IEdgeData>;   // edge data
}

export class TSMT$SimpleGraph
{
  protected _edges: Array<TSMT$IEdge>;           // edge list

  protected _sets: Array<TSMT$INode>;            // vertex sets in union-find

  protected _mst: Array<TSMT$IEdge>;             // internal reference to edge collection in minimum spanning tree

  protected _vertices: Array<TSMT$INode>;        // vertex list

  protected _hash: Record<string, TSMT$INode>;   // lookup Node based on a key

  protected _path!: Array<TSMT$INode>;           // internal traversal path

  protected _deletedEdges: Array<TSMT$IEdge>;    // collection of deleted edges

 /**
  * Construct a new {TSMT$SimpleGraph}
  */
  constructor()
  {
    this._edges        = new Array<TSMT$IEdge>();
    this._vertices     = new Array<TSMT$INode>();
    this._sets         = new Array<TSMT$INode>();
    this._mst          = new Array<TSMT$IEdge>();
    this._deletedEdges = new Array<TSMT$IEdge>();

    this._hash = {};
  }

 /**
  * Create a new node
  *
  * @param {string} key Node key (unique identifier)
  *
  * @param {number} x Optional x-coordinate
  *
  * @param {number} y Optional y-coordinate
  */
  public static createNode(key: string, x: number = 0, y: number = 0): TSMT$INode
  {
    const xCoord: number = x !== undefined && !isNaN(x) ? x : 0;
    const yCoord: number = y !== undefined && !isNaN(y) ? y : 0;

    return {
      key: key,
      x: xCoord,
      y: yCoord,
      rank: 0,
      parent: null
    };
  }

 /**
  * Convert an edge list representing the minimum spanning tree to a formal tree structure, rooted at the first node
  * in the first edge
  *
  * @param {Array<TSMT$IEdge>} mst Edge list in the minimum spanning tree
  */
  public static toTree(mst: Array<TSMT$IEdge>): TSMT$INode | null
  {
    if (mst === undefined || mst == null || mst.length == 0) return null;

    const E: number = mst.length;
    let e: TSMT$IEdge;
    let i: number;

    // remove information from disjoint set processing
    for (i = 0; i < E; ++i)
    {
      e           = mst[i];
      e.v1.parent = null;
      e.v2.parent = null;
    }

    const list: Array<TSMT$IEdge> = mst.slice();  // shallow copy is okay

    // first one is easy :)
    e = list[0];

    let source: TSMT$INode = e.v1;
    let dest: TSMT$INode   = e.v2;
    const root: TSMT$INode = source;
    let node: TSMT$INode;

    root.parent   = null;
    root.children = dest;
    root.tail     = dest;
    dest.parent   = root;
    dest.next     = null;

    list.shift();

    // if source is found in the existing tree, then dest can be parented to source; otherwise if we find dest in
    // the existing tree, reverse the polarity of the neutron flow :).  otherwise, skip the edge and process it
    // in another sweep.  delete an edge as soon as it's processed (the graph can only flow in one of two
    // directions)
    i = 0;
    while (list.length > 0)
    {
      e = list[i];

      source = e.v1;
      dest   = e.v2;

      node = TSMT$SimpleGraph.getNode(source.key, root) as TSMT$INode;

      if (node != null)
      {
        TSMT$SimpleGraph.__add(source, dest);

        // this edge is processed
        list.splice(i, 1);
        i = 0;
      }
      else
      {
        node = TSMT$SimpleGraph.getNode(dest.key, root) as TSMT$INode;
        if (node != null)
        {
          TSMT$SimpleGraph.__reverse(source, dest);

          list.splice(i,1);
          i = 0;
        }
        else
        {
          i = (i + 1) % list.length;
        }
      }
    }

    return root;
  }

  /**
   * Parent a dest node to a source node when adding to the tree
   *
   * @param {TSMT$INode} source
   *
   * @param {TSMT$INode} dest
   * @private
   */
  protected static __add(source: TSMT$INode, dest: TSMT$INode): void
  {
    if (source.children !== undefined)
    {
      // add the next node
      (source.tail as TSMT$INode).next = dest;
      source.tail                      = dest;

      dest.parent = source;
      dest.next   = null;   // this is currently the tail node
    }
    else
    {
      // create first time
      source.children      = dest;
      source.children.next = null;
      source.tail          = dest;

      dest.parent = source;
    }
  }

 /**
  * Parent a source node to a dest node when adding to the tree
  *
  * @param {TSMT$INode} source
  *
  * @param {TSMT$INode} dest
  * @private
  */
  public static __reverse(source: TSMT$INode, dest: TSMT$INode): void
  {
    const tmp: TSMT$INode = source;
    source              = dest;
    dest                = tmp;

    source.children      = dest;
    source.children.next = null;
    source.tail          = dest;

    dest.parent = source;
  }

  /**
   * Get the cost of the supplied minimum spanning tree
   *
   * @param {Array<TSMT$IEdge>} mst Edge list in the minimum spanning tree
   */
  public static getCost(mst: Array<TSMT$IEdge>): number
  {
    const E: number = mst.length;

    let i: number;
    let e: TSMT$IEdge;
    let cost = 0;

    for (i = 0; i < E; ++i)
    {
      e     = mst[i];
      cost += e.w;
    }

    return cost;
  }

  /**
   * Find a node in a tree structure with the prescribed id, starting at the prescribed root node
   *
   * @param {string} id Id {key} property of the node to find
   *
   * @param {TSMT$INode} root Root node to begin search
   */
  public static getNode(id: string, root: TSMT$INode): TSMT$INode | null
  {
    // nothing new ... move along ... move along
    if (root.key == id) {
      return root;
    }

    let list: TSMT$INode = root.children as TSMT$INode;
    let node: TSMT$INode | null;

    while (list.next != null)
    {
      node = list;
      if (node.key == id) {
        return node;
      }

      if (node.children != null)
      {
        node = TSMT$SimpleGraph.getNode(id, node) as TSMT$INode;

        if (node != null) {
          return node;
        }
      }

      list = list.next;
    }

    if ((root.tail as TSMT$INode).key === id) return root.tail as TSMT$INode;

    if ((root.tail as TSMT$INode).children != null)
    {
      node = TSMT$SimpleGraph.getNode(id, root.tail as TSMT$INode);

      if (node != null) {
        return node;
      }
    }

    return null;
  }

  /**
   * Access the current edge count
   */
  public get edgeCount(): number
  {
    return this._edges.length;
  }

  /**
   * Access a (shallow) copy of the current edge list
   */
  public get edgeList(): Array<TSMT$IEdge>
  {
    return this._edges;
  }

  /**
   * Access the current vertex count
   */
  public get vertexCount(): number
  {
    return this._vertices.length;
  }

  /**
   * Access a (shallow) copy of the MST independently computed during cluster computations
   */
  public getMST(): Array<TSMT$IEdge>
  {
    return this._mst.slice();
  }

  /**
   * Access a (shallow) copy of the current list of deleted edges
   */
  public get deletedEdges(): Array<TSMT$IEdge>
  {
    return this._deletedEdges.slice();
  }

  /**
   * Return a preorder traversal of a general tree of nodes
   *
   * @param {TSMT$INode} node Root node
   */
  public preorder(node: TSMT$INode | null): Array<TSMT$INode>
  {
    if (node == null) return [];

    this._path = new Array<TSMT$INode>();

    this.__preorderTraversal(node);

    return this._path.slice();
  }

  /**
   * Recursively continue a preorder traversal
   *
   * @param {TSMT$INode} node Current node
   * @private
   */
  protected __preorderTraversal(node: TSMT$INode)
  {
    if (node == null) {
      return;
    }

    this._path.push(node);

    let list: TSMT$INode = node.children as TSMT$INode;

    while (list && list.next != null)
    {
      this.__preorderTraversal(list);

      list = list.next;
    }

    if (node.tail) {
      this.__preorderTraversal(node.tail);
    }
  }

  /**
   * Clear the current graph and prepare for new data
   */
  public clear(): void
  {
    this._edges.length    = 0;
    this._vertices.length = 0;
    this._sets.length     = 0;
    this._mst.length      = 0;

    this._hash = {};
  }

  /**
   * Create a graph representation from a Graph data object
   *
   * @param {TSMT$GraphData} data
   */
  public fromObject(data: TSMT$GraphData): void
  {
    if (data === undefined || data == null) {
      return;
    }

    if (!data['edges'] || !data['nodes']) return;

    const useCoords: boolean = data.useCoords === true;

    const nodeList: Array<TSMT$INodeData> = data.nodes;

    let i: number;
    let v: TSMT$INode;
    let node: TSMT$INodeData;

    let n: number = nodeList.length;
    for (i = 0; i < n; ++i)
    {
      node = nodeList[i];

      // guard against repeated nodes - could be errors/typos in the data
      if (!this._hash[node.key])
      {
        // create a new vertex
        v = TSMT$SimpleGraph.createNode(node.key, node.x, node.y);

        this._hash[node.key] = v;
        this._vertices.push(v);    // this is likely to be removed at some point in the future
      }
    }

    const edgeList: Array<TSMT$IEdgeData> = data.edges;

    let e: TSMT$IEdgeData;

    // process edge list; should be complete - you break it, you buy it
    n = edgeList.length;
    let v1: TSMT$INode;
    let v2: TSMT$INode;

    for (i = 0; i < n; ++i)
    {
      e = edgeList[i];

      // from-to vertices for this edge
      v1 = this._hash[e.from];
      v2 = this._hash[e.to];

      this._edges.push(
        {
          v1: v1,
          v2: v2,
          w: useCoords ? this.__getWeight(v1, v2, e.w) : e.w
        }
      )
    }
  }

  /**
   * Add an edge to the graph
   *
   * @param {TSMT$IEdge} edge Edge to be added
   */
  public addEdge(edge: TSMT$IEdge): void
  {
    if (edge)
    {
      if (edge.v1 && edge.v2 && edge.w && edge.w >= 0)
      {
        this._edges.push(edge);

        this.__updateVertexCount(edge.v1, edge.v2);
      }
    }
  }

  /**
   * Compute the minimum spanning tree of the current graph
   */
  public mst(): Array<TSMT$IEdge>
  {
    // just Kruskal's algorithm ... nothing new under the sun :)
    const edges: Array<TSMT$IEdge> = new Array<TSMT$IEdge>();

    // trivial edge cases
    const E: number = this._edges.length;

    if (E == 0) {
      return [];
    }

    if (E == 1) {
      return this._edges;
    }

    // edge sort on weight property
    sortOn(this._edges, ['w']);

    // initial list of disjoint sets is all singletons
    const V: number = this._vertices.length;
    let i: number;

    for (i = 0; i < V; ++i) {
      this.__makeSet(this._vertices[i]);
    }

    // here we go ...
    let next: TSMT$IEdge;
    let n1: TSMT$INode;
    let n2: TSMT$INode;

    i = 0;
    while (edges.length < V-1)
    {
      next = this._edges[i];
      n1   = this.__find(next.v1) as TSMT$INode;
      n2   = this.__find(next.v2) as TSMT$INode;

      if (n1.key != n2.key)
      {
        edges.push(next);
        this.__union(n1, n2);
      }

      i++;
    }

    return edges;
  }

  /**
   * Solve the Euclidean minimum spanning tree problem and break the vertex set into a number of clusters based
   * on the prescribed cluster strategy and parameters.   Each node is the root of a tree that spans the node set
   * in the cluster.
   *
   * @param {TSMT$ClusterData} data Data (vertex) set
   *
   * @param {string} type Type of clustering strategy (only {TSMT_CLUSTER_TYPE.BY_NUMBER} is currently supported)
   *
   * @param {ClusterParams} params Optional parameters (name/value pairs) for the cluster strategy
   *
   * @param {boolean} first True if this is the first call; for mostly future use in caching preliminary computations
   * in the event that multiple clusters are computed in an interactive application
   */
  public cluster(data: TSMT$ClusterData,
                 type: string=TSMT_CLUSTER_TYPE.BY_NUMBER,
                 params: ClusterParams=TSMT_CLUSTER_DEFAULT_PARAMS,
                 first: boolean = true): Array<TSMT$INode>
  {
    const nodeList: Array<TSMT$INodeData> = data.nodes;

    let i: number;
    let v: TSMT$INode;
    let node: TSMT$INodeData;

    const n: number = nodeList.length;
    for (i = 0; i < n; ++i)
    {
      node = nodeList[i];

      if (!this._hash[node.key])
      {
        // create a new vertex
        v = TSMT$SimpleGraph.createNode(node.key, node.x, node.y);

        this._hash[node.key] = v;
        this._vertices.push(v);    // this is likely to be removed at some point in the future
      }
    }

    // the number of possible edges is C(n,2) = n*(n-1)/2, which is the count of the elements in the the lower
    // triangle of the connectivity matrix between all nodes.  Note that there is a better way to do this for
    // larger problems (but more difficult to follow) and it may be included in a future update.  This is a
    // reasonable starting point for most interactive applications, since n will be relatively small.  It also
    // allows this class to serve as a general Graph class with MST as a separate concern.
    //
    // For more on the Euclidean minimum spanning tree: https://en.wikipedia.org/wiki/Euclidean_minimum_spanning_tree

    let j: number;

    for (i = 0; i < n; ++i)
    {
      for (j = i+1; j < n; ++j)
      {
        this._edges.push(
          {
            v1: this._vertices[i],
            v2: this._vertices[j],
            w: this.__getWeight(this._vertices[i], this._vertices[j], 1)
          }
        )
      }
    }

    let result: Array<TSMT$INode> = new Array<TSMT$INode>();

    // TODO cache all preliminary computations in addition to the MST in first call
    if (first) {
      this._mst = this.mst();
    }

    this._deletedEdges.length = 0;

    switch (type)
    {
      case TSMT_CLUSTER_TYPE.BY_NUMBER:
        // create the specified number of clusters
        result = this.__clusterByNumber(+params['clusters']);
        break;

      case TSMT_CLUSTER_TYPE.AUTO:
        result = this.__autoCluster();
        break;

      default:
        // other options to be supported at some future time
        result = [TSMT$SimpleGraph.toTree(this._mst) as TSMT$INode];
        break;
    }

    return result;
  }

  /**
   * Implement clustering by a prescribed number of clusters (i.e. k-cluster problem).  Each node is the root of a tree that
   * spans the set of all nodes in the cluster
   *
   * @param {number} clusters Number of clusters
   * @private
   */
  protected __clusterByNumber(clusters: number): Array<TSMT$INode>
  {
    if (clusters === undefined || clusters == null || isNaN(clusters)) return [];

    clusters = Math.abs(Math.round(clusters));

    // edge cases
    if (clusters === 0) return [];

    if (clusters === 1) return [TSMT$SimpleGraph.toTree(this._mst) as TSMT$INode];

    const V: number = this._vertices.length;
    if (clusters >= V)
    {
      const result: Array<TSMT$INode> = new Array<TSMT$INode>();
      let i: number;
      let n: TSMT$INode;
      for (i = 0; i < V; ++i)
      {
        n = this._vertices[i];

        n.parent   = null;
        n.children = null;
        n.tail     = null

        result.push(this._vertices[i]);
      }

      return result;
    }

    // can't help it ... I'm a RUSH fan :)
    const theTrees: Array<TSMT$INode> = [ TSMT$SimpleGraph.toTree(this._mst) as TSMT$INode];

    let index: number = this._mst.length-1;

    // highest cost edge is always at the end
    let e: TSMT$IEdge = this._mst[index];
    this._deletedEdges.push(e);

    // split
    let source: TSMT$INode = e.v1;
    let dest: TSMT$INode   = e.v2;

    // prune dest node from source child list if there is more than one child
    this.__prune(source, dest);

    theTrees.push(dest);     // new head of second 'half'

    if (clusters == 2) {
      return theTrees;
    }

    // well, now we have to do some more work ...
    let clusterCount = 2;

    while (clusterCount < clusters)
    {
      index--;
      e = this._mst[index];

      this._deletedEdges.push(e);

      source = e.v1;
      dest   = e.v2;

      this.__prune(source, dest);

      theTrees.push(dest);

      clusterCount++;
    }

    return theTrees;
  }

  /**
   * Prune a set of child nodes as part of the operation of 'breaking' a tree at an edge that corresponds to parent -> child
   * linkage
   *
   * @param {TSMT$INode} source 'Source' node of the edge
   *
   * @param {TSMT$INode} dest 'Dest' node of the edge
   * @private
   */
  protected __prune(source: TSMT$INode, dest: TSMT$INode): void
  {
    // TODO the entire set of computations could be completely in-lined into the above code (left as an exercise)
    const c: Array<TSMT$INode> = gatherChildren(source);

    const n: number = c.length;
    if (n == 1)
    {
      // the easy case ...
      source.children = null;  // make this a leaf
      source.tail     = null;
      dest.parent     = null;  // make this a root

      return;
    }

    // TODO this can also be compressed - cases split out to make it easier to follow

    // dest at the beginning?
    if (c[0].key === dest.key)
    {
      source.children = (source.children as TSMT$INode).next;
      dest.next       = null;
    }
    else if (c[n-1].key === dest.key)
    {
      // dest at the end
      source.tail = c[n-2];
      c[n-2].next = null;
    }
    else
    {
      // okay, scan for it ...
      let i: number;
      let node: TSMT$INode;
      for (i = 1; i < n-1; ++i)
      {
        node = c[i];
        if (node.key === dest.key)
        {
          c[i-1].next = node.next;
          dest.next   = null;
        }
      }
    }

    dest.parent = null;
  }

  /**
   * Implement auto-cluster (currently a placeholder for future development)
   * @private
   */
  protected __autoCluster(): Array<TSMT$INode>
  {
    // open for future implementation
    console.log( "TODO: Auto-cluster to be implemented" );

    return [];
  }

  /**
   * Get the weight or cost of an edge based a weighted Euclidean cost metric, i.e. w*{norm} where {norm} is the Euclidean distance between
   * the two vertices (or zero if no coordinates are provided)
   *
   * @param {TSMT$INode} v1 First edge
   *
   * @param {TSMT$INode} v2 Second edge
   *
   * @param {number} w Weight or cost multiplier
   * @default 1
   *
   * @private
   */
  protected __getWeight(v1: TSMT$INode, v2: TSMT$INode, w: number=1): number
  {
    const x1: number = v1.x !== undefined && !isNaN(v1.x) ? v1.x : 0;
    const y1: number = v1.y !== undefined && !isNaN(v1.y) ? v1.y : 0;

    const x2: number = v2.x !== undefined && !isNaN(v2.x) ? v2.x : 0;
    const y2: number = v2.y !== undefined && !isNaN(v2.y) ? v2.y : 0;

    const dx: number = x2-x1;
    const dy: number = y2-y1;

    w = w == undefined || isNaN(w) ? 1 : w;

    return w*Math.sqrt(dx*dx + dy*dy);
  }

  /**
   * Make set from disjoint set structure
   *
   * @param {TSMT$INode} node
   * @private
   */
  protected __makeSet(node: TSMT$INode): void
  {
    node.parent = node;
    node.rank   = 0;

    this._sets.push(node);
  }

  /**
   * Helper function for updating the vertex count as edges are added
   *
   * @param {TSMT$INode} v1 First vertex in edge
   *
   * @param {TSMT$INode} v2 Second vertex in edge
   *
   * @private
   */
  protected __updateVertexCount(v1: TSMT$INode, v2: TSMT$INode): void
  {
    if (this._hash[v1.key] === undefined)
    {
      this._hash[v1.key] = v1;
      this._vertices.push(v1);
    }

    if (this._hash[v2.key] === undefined)
    {
      this._hash[v2.key] = v2;
      this._vertices.push(v2);
    }
  }

  /**
   * Find-node from disjoint set
   *
   * @param {TSMT$INode} node
   *
   * @private
   */
  protected __findNode(node: TSMT$INode): TSMT$INode | null
  {
    if (node === undefined || node == null) {
      return null;
    }

    const n: TSMT$INode | null = this.__find(node);

    if (n == null) return null;

    // path compression may reduce the rank of the representative node by 1
    if (n.rank > 1) {
      n.rank = n.rank-1;
    }

    return n;
  }

  protected __find(node: TSMT$INode): TSMT$INode | null
  {
    if ((node.parent as TSMT$INode).key != node.key) {
      node.parent = this.__find( node.parent as TSMT$INode );
    }

    return node.parent;
  }

  /**
   * Union from disjoint set
   *
   * @param {TSMT$INode} x
   *
   * @param {TSMT$INode} y
   *
   * @private
   */
  protected __union(x: TSMT$INode, y: TSMT$INode): void
  {
    const rootX: TSMT$INode | null= this.__findNode(x);
    const rootY: TSMT$INode | null = this.__findNode(y);

    if (rootX == null || rootY == null) return;

    if (rootX.key != rootY.key) this.__join(rootX, rootY)
  }

  protected __join(x: TSMT$INode, y: TSMT$INode): void
  {
    let index: number;

    // note that x and y are expected to be representative nodes and thus roots of a tree
    if (x.rank >= y.rank)
    {
      // y is rooted to x
      y.parent = x;

      index = this.__indexOf(y);
      if (index != -1) {
        this._sets.splice(index,1);
      }

      x.rank = x.rank == 0 ? 1 : x.rank;
    }
    else
    {
      // x is rooted to y
      x.parent = y;

      index = this.__indexOf(x);
      if (index != -1) {
        this._sets.splice(index,1);
      }

      y.rank = y.rank == 0 ? 1 : y.rank;
    }
  }

  /**
   * Return the index of a representative node in the current disjoint set collection or -1 if not found.
   *
   * @param {TSMT$INode} node Node
   * @private
   */
  protected __indexOf(node: TSMT$INode): number
  {
    const n: number = this._sets.length;
    let index       = -1;
    let i: number;
    let nd: TSMT$INode;

    for (i = 0; i < n; ++i)
    {
      nd = this._sets[i]; // representative node for a set

      if (node.key == nd.key)
      {
        index = i;
        break;
      }
    }

    return index;
  }
}
