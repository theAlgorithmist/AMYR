/**
 * Copyright 2020 Jim Armstrong
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
 *
 * This software is derived from that bearing the following copyright notice
 *
 * copyright (c) 2010, Jim Armstrong.  All Rights Reserved.
 *
 * THIS SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * This software may be modified for commercial use as long as the above copyright notice remains intact.
 */

/**
 * A* algorithm for Waypoints - call find() method to find optimal path; costs may be directly computed or
 * externally entered, even a function may be provided to compute updated costs during the algorithm.  The
 * class name {AStar} defaults to A* for Waypoints; {AStarTiles} is reserved for the 2D A* algorithm for
 * game tiles.
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */

import { AstarMinHeap   } from './astar-min-heap';
import { AStarWaypoint  } from './astar-waypoint';
import { AStarGraph     } from './astar-graph';
import { AStarGraphArc  } from './astar-graph-arc';

export class AStar
{
  protected _heap: AstarMinHeap;    // min-heap of AStarWaypoint instances
  
  constructor()
  {
    this._heap = new AstarMinHeap();
  }

/**
 * Find the optimal path along from supplied Graph from source to target node (variable cost metric); returned
 * in an Array of {AStarWaypoint} references.  For the case where constant 2-norm distance between waypoints is
 * used to determine the optimal path, the total (distance) cost of the path is in the {distance} property of
 * the final waypoint in the path.  Pathfinding auto-clears, so this method may be called with differing
 * start/end nodes, for example without having to manually clear the pathfinder.
 *
 * @param {AStarGraph} graph Waypoint Graph (nodes must be AStarWaypoint instances)
 *
 * @param {AStarWaypoint | string} from Starting Waypoint or waypoint key
 *
 * @param {AStarWaypoint | string} to Ending Waypoint or waypoint key
 *
 */
  public find(graph: AStarGraph, from: AStarWaypoint | string, to: AStarWaypoint | string): Array<AStarWaypoint>
  {
    if (graph === undefined || graph == null) return [];

    if (from == null || to == null) return [];

    // some outliers
    if (graph.size === 0) return [];

    if (graph.size === 1) return [graph.nodeList as AStarWaypoint];

    if (graph.size === 2)
    {
      // list is reversed
      return [graph.nodeList?.next as AStarWaypoint, graph.nodeList as AStarWaypoint];
    }

    const source: AStarWaypoint | null = typeof from === 'string' ? graph.getNode(from as string) : from as AStarWaypoint;
    const target: AStarWaypoint | null = typeof to === 'string'   ? graph.getNode(to as string)   : to as AStarWaypoint;

    this._heap.clear();

    const path: Array<AStarWaypoint> = new Array<AStarWaypoint>();

    let pathExists = false;
    let traverse: AStarWaypoint | null = graph.nodeList;

    while (traverse != null)
    {
      traverse.marked = false;
      traverse.parent = null;

      traverse.reset();
      traverse = traverse.next;
    }

    this._heap.clear();
    this._heap.insert(source as AStarWaypoint);

    let waypoint1: AStarWaypoint | null;
    let waypoint2: AStarWaypoint | null;
    let node1: AStarWaypoint | null;
    let node2: AStarWaypoint | null;
    let arc: AStarGraphArc | null;
    let distance: number;

    while (this._heap.size > 0)
    {
      waypoint1        = this._heap.extractRoot() as AStarWaypoint;
      waypoint1.onPath = false;

      node1 = waypoint1;

      if (node1.marked) continue;

      node1.marked = true;

      if (node1.equals(target as AStarWaypoint))
      {
        pathExists = true;
        break;
      }

      arc = node1.arcList;

      while (arc != null)
      {
        // node the arc is pointing to
        node2 = arc.node;

        // skip already marked nodes
        if (node2?.marked)
        {
          arc = arc.next;
          continue;
        }

        waypoint2 = node2;
        distance  = waypoint1.distance + waypoint1.distanceTo(waypoint2 as AStarWaypoint);

        if (node2?.parent != null)
        {
          if (distance < (waypoint2?.distance as number))
          {
            node2.parent                          = node1;
            (waypoint2 as AStarWaypoint).distance = distance;
          }
          else
          {
            arc = arc.next;
            continue;
          }
        }
        else
        {
          (node2 as AStarWaypoint).parent       = node1;
          (waypoint2 as AStarWaypoint).distance = distance;
        }

        (waypoint2 as AStarWaypoint).heuristic = (waypoint2?.distanceTo(target as AStarWaypoint) as number) + distance;

        if (!waypoint2?.onPath)
        {
          (waypoint2 as AStarWaypoint).onPath = true;
          this._heap.insert(waypoint2 as AStarWaypoint);
        }

        arc = arc.next;
      }
    }

    if (pathExists)
    {
      traverse = target;
      while (!traverse?.equals(source as AStarWaypoint))
      {
        path.push(traverse as AStarWaypoint);
        traverse = traverse?.parent as AStarWaypoint;
      }

      path.push(source as AStarWaypoint);
      path.reverse();
    }

    return path;
  }
}
