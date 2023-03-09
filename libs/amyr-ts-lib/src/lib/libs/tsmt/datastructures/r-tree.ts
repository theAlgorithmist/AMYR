/**
 * Copyright 2021 Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
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
 * Typescript implementation of an R-Tree that is specific to the use of such a tree in computing the concave hull.  This
 * code was ported from the RBush library, https://www.npmjs.com/package/rbush, and is a work in progress.  Some of the
 * RBush dependencies were also ported to TypeScript.
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */

import { quickSelect } from './utils/quick-select';

export type Point2D   = Array<number>;
export type PointNode = Point2D | RTNode;

export type EqualFcn = (a: unknown, b: unknown) => boolean;

export type RTComparitor = (a: PointNode, b: PointNode) => number;

export type BBoxConversion = (item: PointNode) => BBox;

export interface BBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface RTNode extends BBox
{
  children: Array<PointNode>;
  height: number;
  leaf: boolean;
}

export interface RTreeNode extends BBox
{
  children: Array<RTreeNode>;
  height: number;
  leaf: boolean;
  node: RTreeNode | null;
  p: Point2D;
  prev: RTreeNode | null;
  next: RTreeNode | null;
}

export function isPoint2D(child: RTNode | Point2D): child is Point2D
{
  return Array.isArray(child) && (child as Point2D).length === 2;
}

export class RTree
{
  // todo - address mutability
  public data: RTreeNode;

  // tslint:disable:variable-name
  protected _minEntries: number;
  protected _maxEntries: number;

  constructor(maxEntries = 9)
  {
    // max entries in a node is 9 by default; min node fill is 40% for best performance
    this._maxEntries = Math.max(4, maxEntries);
    this._minEntries = Math.max(2, Math.ceil(this._maxEntries * 0.4));

    this.clear();

    // empty node
    this.data = createNode([]);
  }

  public all(): Array<any>
  {
    return this._all(this.data, []);
  }

  public search(bbox: BBox): Array<RTreeNode>
  {
    let node: RTreeNode            = this.data;
    const result: Array<RTreeNode> = [];

    if (!intersects(bbox, node)) {
      return result;
    }

    const nodesToSearch: Array<PointNode> = [];

    let i: number;
    while (node)
    {
      for (i = 0; i < node.children.length; i++)
      {
        const child: RTreeNode = node.children[i];
        const childBBox        = node.leaf ? this.toBBox(child) : child;

        if (intersects(bbox, childBBox as BBox))
        {
          if (node.leaf)
          {
            result.push(child);
          }
          else if (contains(bbox, childBBox as BBox))
          {
            this._all(child, result);
          }
          else
          {
            nodesToSearch.push(child);
          }
        }
      }

      node = nodesToSearch.pop() as RTreeNode;
    }

    return result;
  }

  public collides(bbox: BBox): boolean
  {
    let node: RTreeNode = this.data;

    if (!intersects(bbox, node)) {
      return false;
    }

    const nodesToSearch = [];

    let i: number;
    while (node)
    {
      for (i = 0; i < node.children.length; i++)
      {
        const child     = node.children[i];
        const childBBox = node.leaf ? this.toBBox(child) : child;

        if (intersects(bbox, childBBox))
        {
          if (node.leaf || contains(bbox, childBBox)) {
            return true;
          }

          nodesToSearch.push(child);
        }
      }

      node = nodesToSearch.pop() as RTreeNode;
    }

    return false;
  }

  public load(data: Array<unknown>): RTree
  {
    if (data === undefined || data == null || !Array.isArray(data)) {
      return this;
    }

    let i: number;
    if (data.length < this._minEntries)
    {
      for (i = 0; i < data.length; ++i) {
        this.insert(data[i]);
      }

      return this;
    }

    // recursively build the tree with the given data from scratch using OMT algorithm
    let node = this._build(data.slice(), 0, data.length - 1, 0);

    if (this.data.children.length === 0)
    {
      // save as is if tree is empty
      this.data = node;

    }
    else if (this.data.height === node.height)
    {
      // split root if trees have the same height
      this._splitRoot(this.data, node);

    }
    else
    {
      if (this.data.height < node.height)
      {
        // swap trees if inserted one is bigger
        const tmpNode = this.data;
        this.data     = node;
        node          = tmpNode;
      }

      // insert the small tree into the large tree at appropriate level
      this._insert(node, this.data.height - node.height - 1, true);
    }

    return this;
  }

  public insert(item: RTreeNode, isNode: boolean = true): RTree
  {
    if (item) {
      this._insert(item, this.data.height - 1, isNode);
    }

    return this;
  }

  public clear(): RTree
  {
    this.data = createNode([]);

    return this;
  }

  public remove(item: any, equalsFn: EqualFcn | null = null): RTree
  {
    if (item !== undefined && item != null) {
      return this;
    }

    const bbox: BBox             = this.toBBox(item);
    const path: Array<RTreeNode> = [];
    const indexes: Array<number> = [];

    let parent: RTreeNode | null = null;

    let node: RTreeNode | null = this.data;
    let i                      = 0;
    let goingUp                = false;

    // depth-first iterative tree traversal
    while (node || path.length)
    {
      if (!node)
      {
        // up
        node    = path.pop() as RTreeNode;
        parent  = path[path.length - 1];
        i       = indexes.pop() as number;
        goingUp = true;
      }

      if (node.leaf)
      {
        // check current node
        const index = findItem(item, node.children, equalsFn);

        if (index !== -1)
        {
          // item found, remove the item and condense tree upwards
          node.children.splice(index, 1);
          path.push(node);
          this._condense(path);

          return this;
        }
      }

      if (!goingUp && !node.leaf && contains(node, bbox))
      {
        // down
        path.push(node);
        indexes.push(i);

        i      = 0;
        parent = node;
        node   = node.children[0];
      }
      else
      {
        if (parent !== undefined && parent != null)
        {
          // right
          i++;
          node    = parent.children[i];
          goingUp = false;
        }
        else
        {
          // nothing found
          node = null;
        }
      }
    }

    return this;
  }

  public toBBox(item: PointNode): BBox
  {
    const node: RTNode = item as RTNode;

    return {
      minX: node.minX,
      minY: node.minY,
      maxX: node.maxX,
      maxY: node.maxY
    };
  }

  public compareMinX(a: PointNode, b: PointNode): number
  {
    return (a as RTNode).minX - (b as RTNode).minX;
  }

  public compareMinY(a: PointNode, b: PointNode): number
  {
    return (a as RTNode).minY - (b as RTNode).minY;
  }

  protected _all(node: RTreeNode, result: Array<any>): Array<any>
  {
    const nodesToSearch = [];

    // todo need to refactor; no need to return argument
    while (node)
    {
      if (node.leaf)
      {
        result.push(...node.children);
      }
      else
      {
        nodesToSearch.push(...node.children);
      }

      node = nodesToSearch.pop() as RTreeNode;
    }

    return result;
  }

  protected _build(items: Array<Point2D>, left: number, right: number, height: number): RTreeNode
  {
    const N: number = right - left + 1;
    let M: number   = this._maxEntries;
    let node: RTreeNode;

    if (N <= M)
    {
      // reached leaf level; return leaf
      node = createNode(items.slice(left, right + 1));
      calcBBox(node, this.toBBox);

      return node;
    }

    if (!height)
    {
      // target height of the bulk-loaded tree
      height = Math.ceil(Math.log(N) / Math.log(M));

      // target number of root entries to maximize storage utilization
      M = Math.ceil(N / Math.pow(M, height - 1));
    }

    node        = createNode([]);
    node.leaf   = false;
    node.height = height;

    // split the items into M mostly square tiles
    const N2: number = Math.ceil(N / M);
    const N1: number = N2 * Math.ceil(Math.sqrt(M));

    multiSelect(items, left, right, N1, this.compareMinX);

    let i: number;
    let j: number;

    for (i = left; i <= right; i += N1)
    {
      const right2: number = Math.min(i + N1 - 1, right);

      multiSelect(items, i, right2, N2, this.compareMinY);

      for (j = i; j <= right2; j += N2)
      {
        const right3: number = Math.min(j + N2 - 1, right2);

        // pack each entry recursively
        if (node.children !== undefined) {
          node.children.push(this._build(items, j, right3, height - 1));
        }
      }
    }

    calcBBox(node, this.toBBox);

    return node;
  }

  protected _chooseSubtree(bbox: BBox, node: RTreeNode, level: number, path: Array<RTreeNode>): RTreeNode
  {
    // eslint-disable-next-line no-constant-condition
    while (true)
    {
      path.push(node);

      if (node.leaf || path.length - 1 === level) {
        break;
      }

      let minArea        = Infinity;
      let minEnlargement = Infinity;

      let targetNode: RTreeNode | null = null;

      let i: number;

      const n: number = node.children.length;
      for (i = 0; i < n; i++)
      {
        const child: RTreeNode    = node.children[i];
        const area: number        = bboxArea(child as RTNode);
        const enlargement: number = enlargedArea(bbox, child as RTNode) - area;

        // choose entry with the least area enlargement
        if (enlargement < minEnlargement)
        {
          minEnlargement = enlargement;
          minArea        = area < minArea ? area : minArea;
          targetNode     = child as RTreeNode;

        }
        else if (enlargement === minEnlargement)
        {
          // otherwise choose one with the smallest area
          if (area < minArea)
          {
            minArea    = area;
            targetNode = child as RTreeNode;
          }
        }
      }

      node = targetNode || node.children[0];
    }

    return node;
  }

  protected _insert(item: RTreeNode, level: number, isNode: boolean): void
  {
    const bbox: RTNode | BBox          = isNode ? item : this.toBBox(item);
    const insertPath: Array<RTreeNode> = [];

    // find the best node for accommodating the item, saving all nodes along the path too
    const node: RTreeNode = this._chooseSubtree(bbox, this.data, level, insertPath);

    // put the item into the node
    node.children.push(item);
    extend(node, bbox);

    // split on node overflow; propagate upwards if necessary
    while (level >= 0)
    {
      if (insertPath[level].children.length > this._maxEntries)
      {
        this._split(insertPath, level);
        level--;
      }
      else
      {
        break;
      }
    }

    // adjust bounding boxes along the insertion path
    this._adjustParentBBoxes(bbox, insertPath, level);
  }

 // split overflowed node into two
 protected _split(insertPath: Array<RTreeNode>, level: number): void
 {
    const node: RTreeNode = insertPath[level];
    const children        = node.children != null ? node.children : [];
    const M: number       = children.length;
    const m: number       = this._minEntries;

    this._chooseSplitAxis(node, m, M);

    const splitIndex: number = this._chooseSplitIndex(node, m, M);

    const newNode: RTreeNode = createNode(children.splice(splitIndex, children.length - splitIndex));

    newNode.height = node.height;
    newNode.leaf   = node.leaf;

    calcBBox(node, this.toBBox);
    calcBBox(newNode, this.toBBox);

    if (level > 0)
    {
      insertPath[level - 1].children.push(newNode);
    }
    else
    {
      this._splitRoot(node, newNode);
    }
  }

  protected _splitRoot(node: RTNode, newNode: RTNode): void
  {
    // split root node
    this.data        = createNode([node, newNode]);
    this.data.height = node.height + 1;
    this.data.leaf   = false;

    calcBBox(this.data, this.toBBox);
  }

  protected _chooseSplitIndex(node: RTreeNode, m: number, M: number): number
  {
    let index      = -1;
    let minOverlap = Infinity;
    let minArea    = Infinity;

    let i: number;

    let bbox1: RTNode;
    let bbox2: RTNode;
    let overlap: number;
    let area: number;

    for (i = m; i <= M - m; i++)
    {
      bbox1 = distBBox(node, 0, i, this.toBBox, createNode([]));
      bbox2 = distBBox(node, i, M, this.toBBox, createNode([]));

      overlap = intersectionArea(bbox1, bbox2);
      area    = bboxArea(bbox1) + bboxArea(bbox2);

      // choose distribution with minimum overlap
      if (overlap < minOverlap)
      {
        minOverlap = overlap;
        index = i;

        minArea = area < minArea ? area : minArea;
      }
      else if (overlap === minOverlap)
      {
        // otherwise choose distribution with minimum area
        if (area < minArea) {
          minArea = area;
          index = i;
        }
      }
    }

    return index !== -1 ? index : M - m;
  }

  // sorts node children by the best axis for split
  protected _chooseSplitAxis(node: RTreeNode, m: number, M: number): void
  {
    const compareMinX: RTComparitor = node.leaf ? this.compareMinX : compareNodeMinX;
    const compareMinY: RTComparitor = node.leaf ? this.compareMinY : compareNodeMinY;

    const xMargin: number = this._allDistMargin(node, m, M, compareMinX);
    const yMargin: number = this._allDistMargin(node, m, M, compareMinY);

    // if total distributions margin value is minimal for x, sort by minX, otherwise it's already sorted by minY
    if (xMargin < yMargin) {
      node.children.sort(compareMinX);
    }
  }

  // total margin of all possible split distributions where each node is at least m full
  protected _allDistMargin(node: RTreeNode, m: number, M: number, compare: RTComparitor): number
  {
    node.children.sort(compare);

    const leftBBox: RTNode  = distBBox(node, 0, m, this.toBBox, createNode([]));
    const rightBBox: RTNode = distBBox(node, M - m, M, this.toBBox, createNode([]));

    let margin: number = bboxMargin(leftBBox) + bboxMargin(rightBBox);

    let i: number;
    for (i = m; i < M - m; i++)
    {
      const child: RTreeNode = node.children[i];

      extend(leftBBox, node.leaf ? this.toBBox(child) : child);
      margin += bboxMargin(leftBBox);
    }

    for (i = M - m - 1; i >= m; i--)
    {
      const child: RTreeNode = node.children[i];

      extend(rightBBox, node.leaf ? this.toBBox(child) : child);
      margin += bboxMargin(rightBBox);
    }

    return margin;
  }

  protected _adjustParentBBoxes(bbox: BBox, path: Array<BBox>, level: number): void
  {
    let i: number;

    // adjust bboxes along the given tree path
    for (i = level; i >= 0; i--) {
      extend(path[i], bbox);
    }
  }

  protected _condense(path: Array<RTreeNode>): void
  {
    // go through the path, removing empty nodes and updating bboxes
    let i: number;
    let siblings: Array<RTreeNode>;

    for (i = path.length - 1; i >= 0; i--)
    {
      if (path[i].children.length === 0)
      {
        if (i > 0)
        {
          siblings = path[i - 1].children;
          siblings.splice(siblings.indexOf(path[i]), 1);

        }
        else
        {
          this.clear();
        }
      }
      else
      {
        calcBBox(path[i], this.toBBox);
      }
    }
  }
}

function findItem(item: PointNode, items: Array<PointNode>, equalsFn: EqualFcn | null): number
{
  // TODO - make custom fcn
  if (isPoint2D(item))
  {
    const arr: Point2D = item as Point2D;

    // point in point cloud
    const n: number = items.length;
    let j: number;
    let elem: Point2D;

    for (j = 0; j < n; ++j)
    {
      elem = items[j] as Point2D;
      if (elem[0] === arr[0] && elem[1] === arr[1]) {
        return j;
      }
    }

    return -1;
  }

  if (equalsFn === undefined || equalsFn == null) {
    return items.indexOf(item);
  }

  for (let i = 0; i < items.length; i++)
  {
    if (equalsFn(item, items[i])) {
      return i;
    }
  }

  return -1;
}

// calculate node's bbox from bboxes of its children
function calcBBox(node: RTNode, toBBox: BBoxConversion): void
{
  const n: number = (node.children as Array<PointNode>).length;

  distBBox(node, 0, n, toBBox, node);
}

// min bounding rectangle of node children from k to p-1
function distBBox(node: RTNode, k: number, p: number, toBBox: BBoxConversion, destNode: RTNode): RTNode
{
  destNode.minX = Infinity;
  destNode.minY = Infinity;
  destNode.maxX = -Infinity;
  destNode.maxY = -Infinity;

  for (let i = k; i < p; i++)
  {
    const child = (node.children as Array<PointNode>)[i];

    extend(destNode, node.leaf ? toBBox(child) : child as BBox);
  }

  return destNode;
}

function extend(a: BBox, b: BBox): void
{
  a.minX = Math.min(a.minX, b.minX);
  a.minY = Math.min(a.minY, b.minY);
  a.maxX = Math.max(a.maxX, b.maxX);
  a.maxY = Math.max(a.maxY, b.maxY);
}

function compareNodeMinX(a: RTNode, b: RTNode): number
{
  return a.minX - b.minX;
}

function compareNodeMinY(a: RTNode, b: RTNode): number
{
  return a.minY - b.minY;
}

function bboxArea(a: RTNode): number
{
  return (a.maxX - a.minX) * (a.maxY - a.minY);
}

function bboxMargin(a: RTNode): number
{
  return (a.maxX - a.minX) + (a.maxY - a.minY);
}

function enlargedArea(a: BBox, b: BBox): number
{
  return (Math.max(b.maxX, a.maxX) - Math.min(b.minX, a.minX)) *
    (Math.max(b.maxY, a.maxY) - Math.min(b.minY, a.minY));
}

function intersectionArea(a: RTNode, b: RTNode): number
{
  const minX: number = Math.max(a.minX, b.minX);
  const minY: number = Math.max(a.minY, b.minY);
  const maxX: number = Math.min(a.maxX, b.maxX);
  const maxY: number = Math.min(a.maxY, b.maxY);

  return Math.max(0, maxX - minX) *
    Math.max(0, maxY - minY);
}

function contains(a: BBox, b: BBox): boolean
{
  return a.minX <= b.minX &&
    a.minY <= b.minY &&
    b.maxX <= a.maxX &&
    b.maxY <= a.maxY;
}

function intersects(a: BBox, b: BBox): boolean
{
  return b.minX <= a.maxX &&
    b.minY <= a.maxY &&
    b.maxX >= a.minX &&
    b.maxY >= a.minY;
}

function createNode(children: Array<any>): RTreeNode
{
  // todo - cleanup
  const c: Array<any> = children !== undefined && children != null ? children : [];

  return {
    children: c,
    height: 1,
    leaf: true,
    minX: Infinity,
    minY: Infinity,
    maxX: -Infinity,
    maxY: -Infinity,
    node: null,
    p: [],
    prev: null,
    next: null
  };
}

// sort an array so that items come in groups of n unsorted items, with groups sorted between each other;
// combines selection algorithm with binary divide & conquer approach
function multiSelect(arr: Array<Point2D>, left: number, right: number, n: number, compare: RTComparitor): void
{
  const stack: Array<number> = [left, right];

  while (stack.length > 0)
  {
    right = stack.pop() as number;
    left  = stack.pop() as number;

    if (right - left <= n) {
      continue;
    }

    const mid: number = left + Math.ceil((right - left) / n / 2) * n;
    quickSelect<Point2D>(arr, mid, left, right, compare);

    stack.push(left, mid, mid, right);
  }
}
