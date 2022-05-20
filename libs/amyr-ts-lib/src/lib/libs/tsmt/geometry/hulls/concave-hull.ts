/**
 * Copyright 2021 Jim Armstrong (www.algorithmist.net)
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
 * AMYR Library: Typescript implementation of the concave hull algorithm as described in<br/><br/>
 *
 * A New Concave Hull Algorithm and Concaveness Measure for n-dimensional Datasets, 2012 by Jin-Seo Park and Se-Jong Oh.
 *
 * See: https://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.94.5790&rep=rep1&type=pdf<br/><br/>
 *
 * This code was ported from the Javascript implementation of the above algorithm: https://github.com/mapbox/concaveman <br/><br>
 *
 * This is a work in progress in which typings are not yet complete.  Several of the dependencies from the above
 * implementation were also hand-ported to Typescript.
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */

import {
  RTree,
  BBox,
  RTNode,
  isPoint2D,
  PointNode,
  Point2D,
  RTreeNode
} from "@algorithmist/amyr-ts-lib";

import TinyQueue from 'tinyqueue';
import * as utils from '../../utils/hull-utils/hull-utils';

export interface QueueNode
{
  node: PointNode;
  dist: number;
}

class ExtRTree extends RTree
{
  constructor(levels: number = 9)
  {
    super(levels);
  }

  public override toBBox(a: PointNode): BBox
  {
    if (isPoint2D(a))
    {
      return {
        minX: a[0],
        minY: a[1],
        maxX: a[0],
        maxY: a[1]
      };
    }
    else
    {
      return {
        minX: a.minX,
        minY: a.minY,
        maxX: a.maxX,
        maxY: a.maxY
      };
    }
  }

  public override compareMinX(a: PointNode, b: PointNode): number
  {
    return (a as Point2D)[0] - (b as Point2D)[0];
  }

  public override compareMinY(a: PointNode, b: PointNode): number
  {
    return (a as Point2D)[1] - (b as Point2D)[1];
  }
}

export function compareByX(a: Point2D, b: Point2D): number
{
  return a[0] === b[0] ? a[1] - b[1] : a[0] - b[0];
}

// create a new node in a custom, doubly-linked list
function insertNode(p: Point2D, prev: RTreeNode | null): RTreeNode
{
  const node: RTreeNode = {
    children: [],
    height: 0,
    p,
    prev: null,
    next: null,
    node: null,
    minX: 0,
    minY: 0,
    maxX: 0,
    maxY: 0,
    leaf: false
  };

  if (!prev)
  {
    node.prev = node;
    node.next = node;
  }
  else
  {
    node.next = prev.next;
    node.prev = prev;

    (prev.next as RTreeNode).prev = node;
    prev.next                     = node;
  }

  return node;
}

// update the bounding box of a node's edge
function updateBBox(node: RTreeNode): RTreeNode
{
  const p1: Point2D = node.p;

  // this works since the node has an edge, but some additional checking is advised for the next version
  const p2: Point2D = node.next?.p as Point2D;

  node.minX = Math.min(p1[0], p2[0]);
  node.minY = Math.min(p1[1], p2[1]);
  node.maxX = Math.max(p1[0], p2[0]);
  node.maxY = Math.max(p1[1], p2[1]);

  return node;
}

function inside(a: Point2D, bbox: BBox): boolean
{
  return a[0] >= bbox.minX &&
    a[0] <= bbox.maxX &&
    a[1] >= bbox.minY &&
    a[1] <= bbox.maxY;
}

// squared distance from a segment bounding box to the given one
function sqSegBoxDist(a: Point2D, b: Point2D, bbox: BBox): number
{
  if (inside(a, bbox) || inside(b, bbox)) return 0;

  const d1: number = utils.sqSegSegDist(a[0], a[1], b[0], b[1], bbox.minX, bbox.minY, bbox.maxX, bbox.minY);
  if (d1 === 0) return 0;

  const d2: number = utils.sqSegSegDist(a[0], a[1], b[0], b[1], bbox.minX, bbox.minY, bbox.minX, bbox.maxY);
  if (d2 === 0) return 0;

  const d3: number = utils.sqSegSegDist(a[0], a[1], b[0], b[1], bbox.maxX, bbox.minY, bbox.maxX, bbox.maxY);
  if (d3 === 0) return 0;

  const d4: number = utils.sqSegSegDist(a[0], a[1], b[0], b[1], bbox.minX, bbox.maxY, bbox.maxX, bbox.maxY);
  if (d4 === 0) return 0;

  return Math.min(d1, d2, d3, d4);
}

// comparison function for two distances that can be used to sort by distance
function compareDist(a: QueueNode, b: QueueNode): number
{
  return a.dist - b.dist;
}

function noIntersections(a: Point2D, b: Point2D, segTree: ExtRTree): boolean
{
  let i: number;

  const minX: number = Math.min(a[0], b[0]);
  const minY: number = Math.min(a[1], b[1]);
  const maxX: number = Math.max(a[0], b[0]);
  const maxY: number = Math.max(a[1], b[1]);

  const edges: Array<RTreeNode> = segTree.search({minX, minY, maxX, maxY});
  const len: number             = edges.length;

  for (i = 0; i < len; ++i) {
    if (utils.intersects(edges[i].p, (edges[i].next as RTreeNode).p, a, b)) return false;
  }

  return true;
}

function findCandidate(
  tree: RTree,
  a: Point2D,
  b: Point2D,
  c: Point2D,
  d: Point2D,
  maxDist: number,
  segTree: ExtRTree): Point2D
{
  const queue: TinyQueue<QueueNode> = new TinyQueue<QueueNode>([], compareDist);

  let node = tree.data as RTNode;

  let i: number;
  let child: PointNode;
  let dist: number;
  let d0: number;
  let d1: number;
  let item: QueueNode;
  let p: PointNode;
  let finished = false;

  // depth-first search through the point R-tree, using a priority queue ordered by distance to the edge (b, c)
  while (!finished)
  {
    for (i = 0; i < node.children.length; ++i)
    {
      child = node.children[i];
      if (node.leaf && isPoint2D(child) )
        dist = utils.sqSegDist(child as Point2D, b, c);
      else
        dist = sqSegBoxDist(b, c, child as RTNode);

      // skip the node if it's farther than ever needed
      if (dist > maxDist) continue;

      queue.push({node: child, dist});
    }

    while (queue.length && !(queue.peek()?.node as RTreeNode).children)
    {
      item = queue.pop() as QueueNode;
      p    = item.node;

      // skip all points that are as close to adjacent edges (a,b), (c,d), and points that would introduce self-intersections when connected
      if (isPoint2D(p))
      {
        d0 = utils.sqSegDist(p as Point2D, a, b);
        d1 = utils.sqSegDist(p as Point2D, c, d);

        if (item.dist < d0 && item.dist < d1 &&
          noIntersections(b, p, segTree) &&
          noIntersections(c, p, segTree))
        {
          return p;
        }
      }
    }

    item = queue.pop() as QueueNode;

    if (item != null)
    {
      // assign the next node
      node = item.node as RTNode;
    }
    else
    {
      // we're through ...
      finished = true;
    }
  }

  return [];
}

export function fastConvexHull(points: Array<Point2D>): Array<Point2D>
{
  let left: Point2D   = points[0];
  let top: Point2D    = points[0];
  let right: Point2D  = points[0];
  let bottom: Point2D = points[0];

  let i: number;
  let p: Point2D;

  // y-down AABB
  for (i = 0; i < points.length; i++)
  {
    p = points[i];

    if (p[0] < left[0]) {
      left = p.slice();
    }

    if (p[0] > right[0]) {
      right = p.slice();
    }

    if (p[1] < top[1]) {
      top = p.slice();
    }

    if (p[1] > bottom[1]) {
      bottom = p.slice();
    }
  }

  // filter out points that are inside the resulting bounding-box
  const cull: Array<Point2D> = new Array<Point2D>();

  cull.push(left);
  cull.push(top);
  cull.push(right);
  cull.push(bottom);

  const filtered: Array<Point2D> = new Array<Point2D>();
  filtered.push(left.slice());
  filtered.push(top.slice());
  filtered.push(right.slice());
  filtered.push(bottom.slice());

  points.forEach( (pt: Point2D): void => {
    if (!utils.pointInPolygon(pt, cull, null, null)) {
      filtered.push(pt.slice());
    }
  });

  return convexHull(filtered);
}

function convexHull(points: Array<Point2D>): Array<Point2D>
{
  points.sort(compareByX);

  const n: number             = points.length;
  const lower: Array<Point2D> = new Array<Point2D>();

  let i: number;
  for (i = 0; i < n; ++i)
  {
    while (lower.length >= 2 && utils.cross(lower[lower.length - 2], lower[lower.length - 1], points[i]) <= 0) {
      lower.pop();
    }

    lower.push(points[i]);
  }

  const upper: Array<Point2D> = new Array<Point2D>();

  for (i = n - 1; i >= 0; i--)
  {
    while (upper.length >= 2 && utils.cross(upper[upper.length - 2], upper[upper.length - 1], points[i]) <= 0) {
      upper.pop();
    }

    upper.push(points[i]);
  }

  upper.pop();
  lower.pop();

  return lower.concat(upper);
}

export function concaveHull(
  points: Array<Point2D>,
  concavity: number = 2,
  lengthThreshold: number = 0
): Array<Point2D>
{
  if (points === undefined || points == null) {
    return [];
  }

  const numPoints: number = points.length;

  if (numPoints === 0) {
    return [];
  }

  // trivial cases
  if (numPoints < 4)
  {
    const h: Array<Point2D> = new Array<Point2D>();
    points.forEach( (point: Point2D): void => {
      h.push(point.slice());
    })

    return h;
  }

  // have to do it the hard way, now ;)
  const hull: Array<Point2D> = fastConvexHull(points);
  const hullLength: number   = hull.length;

  // index the points with an R-tree
  const tree: ExtRTree = new ExtRTree(16);

  tree.load(points);

  // convert the convex hull into a linked list and populate the initial edge queue with the nodes
  const queue: Array<RTreeNode> = new Array<RTreeNode>();
  let i: number;
  let p: Point2D;

  let last: RTreeNode | null = null;

  for (i = 0; i < hullLength; ++i)
  {
    p = hull[i];

    tree.remove(p);

    last = insertNode(p, last);
    queue.push(last);
  }

  // index the segments with an R-tree (for intersection checks)
  const segTree: RTree = new RTree(16);
  for (i = 0; i < queue.length; i++)
  {
    updateBBox(queue[i]);
    segTree.insert( queue[i] );
  }

  const sqConcavity: number    = concavity * concavity;
  const sqLenThreshold: number = lengthThreshold * lengthThreshold;

  // process edges
  let node: RTreeNode;
  let a: Point2D;
  let b: Point2D;
  let sqLen: number;
  let maxSqLen: number;

  let q: Point2D;

  while (queue.length > 0)
  {
    node  = queue.shift() as RTreeNode;
    a     = node.p;
    sqLen = 0;
    b     = [];

    if (node.next != null)
    {
      b = node.next.p as Point2D;

      // skip the edge if it's already short enough
      sqLen = utils.squaredDist(a, b);
    }

    if (sqLen < sqLenThreshold) {
      continue;
    }

    maxSqLen = sqLen / sqConcavity;

    // find the best connection point for the current edge to flex inward towards
    q = findCandidate(tree, node.prev?.p as Point2D, a, b, node.next?.next?.p as Point2D, maxSqLen, segTree);

    if (maxSqLen > 0) {
      break;
    }

    // found a connection and it satisfies concavity measure
    if (q.length === 2 && Math.min(utils.squaredDist(q, a), utils.squaredDist(q, b)) <= maxSqLen)
    {
      // connect the edge endpoints through this point and add 2 new edges to the queue
      queue.push(node);
      queue.push(insertNode(q, node));

      // update point and segment indexes
      tree.remove(q);

      segTree.remove(node);
      segTree.insert(updateBBox(node));
      segTree.insert(updateBBox(node.next as RTreeNode));
    }
  }

  hull.length = 0;

  // convert the resulting hull linked list to an array of points
  node = last as RTreeNode;

  do {
    hull.push(node.p);
    node = node.next as RTreeNode;
  } while (node !== last);

  hull.push(node.p);

  return hull;
}

