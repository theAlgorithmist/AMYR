/**
 * Copyright 2020 Jim Armstrong (www.algorithmist.net)
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
 * ------
 * copyright (c) 2002, Jim Armstrong.  All Rights Reserved.
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

import { AStarGraphArc } from './astar-graph-arc';
import { CostFunction  } from './astar-graph';

/**
 * Create a new waypoint/node
 *
 * @param {string} key Node key (unique identifier)
 *
 * @param {number} x Optional x-coordinate
 *
 * @param {number} y Optional y-coordinate
 *
 * @param {boolean} isCartesian True if coordinates are cartesian; false if lat/long
 */
export const createWaypoint = (key: string, x: number = 0, y: number = 0, isCartesian: boolean = true, h: number = 0): AStarWaypoint =>
{
  const xCoord: number = x !== undefined && !isNaN(x) ? x : 0;
  const yCoord: number = y !== undefined && !isNaN(y) ? y : 0;

  const waypoint: AStarWaypoint = new AStarWaypoint(key);

  if (isCartesian)
  {
    // Assign cartesian coordinates
    waypoint.setCoords(xCoord, yCoord);
  }
  else
  {
    // Assign geographic coordinates
    waypoint.setGeoCoords(xCoord, yCoord);
  }

  waypoint.heuristic = h;

  return waypoint;
};

/**
 * A 2D Waypoint for pathfinding in the plane; this class doubles as a special graph node for performance reasons
 *
 * @param {string} id ID associated with this waypoint - may be later accessed with the 'key' property
 *
 * @author Jim Armstrong, (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */
export class AStarWaypoint
{ 
  protected static TO_MILES   = 0.621371;
  protected static DEG_TO_RAD = 0.01745329251;  // PI/180.0;
  protected static RADIUS_KM  = 6378.5;         // approx avg. radius of earth in km.

  // A* Graph node functionality
  public prev: AStarWaypoint | null;
  public next: AStarWaypoint | null;
  public arcList: AStarGraphArc | null;
  public parent: AStarWaypoint | null;
  public marked: boolean;
  public onPath: boolean;

  protected _curArc: AStarGraphArc | null;    // reference to most recently added arc out of this node

  // A* Waypoint functionality
  protected _key: string;

  // cartesian or geo coordinates
  protected _x: number;
  protected _y: number;
  protected _latitude: number;
  protected _longitude: number;

  protected _isCartesian: boolean;

  protected _position: number;
  protected _distance: number;   // distance accumulator
  protected _heuristic: number;  // node's heuristic value

  protected _data: {[key: string]: unknown};       // optional data object associated with this waypoint - simple key-value pairs

  constructor(id: string = '')
  {
    this.onPath = false;

    this._key = id;

    this._x = 0;
    this._y = 0;

    this._position    = 0;
    this._distance    = 0;
    this._heuristic   = 0;
    this._isCartesian = true;

    // used for associating lat/long along with abstract x-y coordinates for the Waypoint - directly access and set
    this._latitude  = 0;
    this._longitude = 0;

    this._data = {};

    this.prev    = null;
    this.next    = null;
    this.arcList = null;
    this.parent  = null;
    this.marked  = false;
    this.onPath  = false;

    this._curArc = null;
  }

  /**
   * Access this waypoint's key or id value
   */
  public get key(): string
  {
    return this._key;
  }

  /**
   * Return true if coordinates in this waypoint are cartesian
   */
  public get isCartesian(): boolean
  {
    return this._isCartesian;
  }

  /**
   * Access the x-coordinate
   */
  public get x(): number
  {
    return this._x;
  }

  /**
   * Access the y-coordinate
   */
  public get y(): number
  {
    return this._y;
  }

  /**
   * Access latitude value for geo-coded coordinates
   */
  public get latitude(): number
  {
    return this._latitude;
  }

  /**
   * Access the longitude value for geo-coded coordinates
   */
  public get longitude(): number
  {
    return this._longitude;
  }

  /**
   * Access the waypoint's currently assigned heuristic value
   */
  public get heuristic(): number
  {
    return this._heuristic;
  }

 /**
  * Assign the waypoint's heuristic value
  *
  * @param value Heuristic value
  */
  public set heuristic(value: number)
  {
    this._heuristic = !isNaN(value) && value > 0 ? value : this._heuristic;
  }
   

  /**
   * Access the waypoint's currently assigned distance value
   */
  public get distance(): number
  {
    return this._distance;
  }

  /**
   * Assign the waypoint's distance value
   *
   * @param value Distance value
   */
  public set distance(value: number)
  {
    this._distance = !isNaN(value) && value > 0 ? value : this._distance;
  }

  /**
   * Access an arbitrary named property from this waypoint
   *
   * @param key Key or property name
   */
  public getProp(key: string): unknown
  {
    if (!this._data) return null;

    return this._data[key]  !== undefined ? this._data[key] : null;
  }

  /**
   * Assign a simple data object to this waypoint
   *
   * @param value
   */
  public set data(value: object)
  {
    if (value !== undefined && value != null) this._data = JSON.parse(JSON.stringify(value));
  }

  /**
   * Reset the internal distance and heuristic values to default
   */
  public reset(): void
  {
    this._distance  = 0;
    this._heuristic = 0;
  }

  /**
   * Assign cartesian coordinates to this waypoint and toggle the internal is-carteisan setting to {true}
   *
   * @param x x-coordinate value
   *
   * @param y y-coordinate value
   */
  public setCoords(x: number, y: number): void
  {
    this._x = !isNaN(x) ? x : this._x;
    this._y = !isNaN(y) ? y : this._y;

    this._isCartesian = true;
  }

  /**
   * Assign longitude and latitude values to this waypoint and toggle the internal is-cartesian setting to {false}
   *
   * @param long Longitude value
   *
   * @param lat Latitude value
   */
  public setGeoCoords(long: number, lat: number): void
  {
    // todo test ranges?
    this._latitude  = !isNaN(lat) ? lat : this._latitude;
    this._longitude = !isNaN(long) ? long : this._longitude;

    this._isCartesian = false;
  }

  /**
   * Compute the distance (2-norm or great circle) from this waypoint to the input waypoint
   *
   * @param wp Calculate distance to this waypoint
   */
  public distanceTo(wp: AStarWaypoint): number
  {
    if (this._isCartesian)
    {
      const dx = wp.x - this.x;
      const dy = wp.y - this.y;

      return Math.sqrt(dx * dx + dy * dy);
    }
    else
    {
      // inline great circle distance
      const lat1  = this._y * AStarWaypoint.DEG_TO_RAD;
      const lat2  = wp.y * AStarWaypoint.DEG_TO_RAD;
      const long1 = this._x * AStarWaypoint.DEG_TO_RAD;
      const long2 = wp.x * AStarWaypoint.DEG_TO_RAD;
      const dlat  = Math.abs(lat2 - lat1);
      const dlon  = Math.abs(long2 - long1);
      const sLat  = Math.sin(dlat * 0.5);
      const sLong = Math.sin(dlon * 0.5);
      const a     = sLat * sLat + Math.cos(lat1) * Math.cos(lat2) * sLong * sLong;
      const c     = 2 * Math.asin(Math.min(1.0, Math.sqrt(a)));

      return AStarWaypoint.RADIUS_KM * c;  // result in km
    }
  }

  /**
   * Compare this waypoint to another based on heuristic value
   *
   * @param other Waypoint for comparison
   */
  public compare(other: AStarWaypoint)
  {
    const x: number = other.heuristic - this.heuristic;
    return (x > 0) ? 1 : (x < 0. ? -1 : 0);
  }

  /**
   * Is this waypoint equal to the supplied waypoint?
   *
   * @param w Comparison waypoint
   */
  public equals(w: AStarWaypoint): boolean
  {
    if (w == undefined || w == null) {
      return false;
    }

    // key is supposed to be unique and should be enough; will add coordinate test as well
    if (w.key !== this._key || w.heuristic !== this._heuristic) {
      return false;
    }

    if (this._isCartesian === w.isCartesian)
    {
      return this._x === w.x && this._y === w.y;
    }
    else
    {
      return this._longitude === w.longitude && this._latitude === w.latitude;
    }
  }

  /**
   * Access the number of arcs emanating from this node
   *
   * @returns {number} Arc count or number of arcs emanating from this node
   */
  public get arcCount(): number
  {
    let count = 0;
    let arc: AStarGraphArc | null = this.arcList;

    while (arc != null)
    {
      count++;
      arc = arc.next;
    }

    return count;
  }

  /**
   * Access the arc or edge (if any) coming out of this waypoint
   */
  public getArc(target: AStarWaypoint): AStarGraphArc | null
  {
    if (target === undefined || target == null) {
      return null;
    }

    let found = false;
    let a: AStarGraphArc | null = this.arcList;

    while (a != null)
    {
      if (a.node?.equals(target))
      {
        found = true;
        break;
      }

      a = a.next;
    }

    return found ? a : null;
  }

  /**
   * Add a graph arc from this node to the specified node
   *
   * @param {AStarWaypoint} target Terminal node of arc
   *
   * @param {CostFunction | number} cost Numerical cost associated with this arc or function to compute the cost
   */
  public addArc(target: AStarWaypoint, cost: CostFunction | number=1.0): AStarGraphArc | null
  {
    if (target !== undefined && target != null)
    {
      const arc: AStarGraphArc = new AStarGraphArc(target, cost);
      arc.next = this.arcList;

      if (this.arcList != null) {
        this.arcList.prev = arc;
      }

      this.arcList = arc;

      return arc;
    }

    return null;
  }

  /**
   * Remove an arc from the set of arcs emanating from the input node and return boolean if arc was found and removed
   *
   * @param {AStarWaypoint} target Terminal node of the arc to remove
   */
  public removeArc(target: AStarWaypoint): boolean
  {
    if (target !== undefined && target != null)
    {
      const arc: AStarGraphArc |  null = this.getArc(target);

      if (arc != null)
      {
        if (arc.prev != null)
        {
          // update prev.next after removal
          arc.prev.next = arc.next;
        }

        if (arc.next != null)
        {
          // update next.prev after removal
          arc.next.prev = arc.prev;
        }

        if (this.arcList === arc)
        {
          // update arcList ref after removal
          this.arcList = arc.next;
        }

        return true;
      }

      return false;
    }
    else
    {
      // nothing to remove
      return false;
    }
  }
}
