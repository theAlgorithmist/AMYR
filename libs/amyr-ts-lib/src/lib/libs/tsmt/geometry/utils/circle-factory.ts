/**
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
 * AMYR Library - Circle Factory
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */
import { Circle } from '../circle';

/**
 * Generate a collection of Circle instances within a rectangular boundary.  The returned Array of {Circle} instances
 * are generated with radius in [minRadius, maxRadius] and with centers pseudo-randomly distributed throughout the boundary.
 *
 * @param {number} count Total number of circles to generate - must be greater than zero
 *
 * @param {number} left x-coordinate of (top-left) corner of boundary
 *
 * @param {number} top y-coordinate of (top-left) corner of boundary
 *
 * @param {number} right x-coordinate of (bottom-right) corner of boundary
 *
 * @param {number} bottom y-coordinate of (bottom-rightt) corner of boundary
 *
 * @param {number }minRadius Minimum radius value - must be greater than or equal to zero
 *
 * @param {number} maxRadius Maximum radius value - must be greater than minRadius
 */

export function createCircle(
  count:number,
  left:number,
  top:number,
  right:number,
  bottom:number,
  minRadius:number,
  maxRadius:number): Array<Circle>
  {
    if (count < 1) return new Array<Circle>();

    const circleCount = Math.round(Math.abs(count));

    const rRange: number = maxRadius - minRadius;
    const xRange: number = right - left;
    const yRange: number = Math.abs(top - bottom);
    const minY: number   = bottom < top ? bottom : top;  // should work for y-up or y-down coordinates

    let i: number;
    let circle: Circle;

    minRadius = Math.abs(minRadius);
    maxRadius = Math.abs(maxRadius);

    const minR: number = Math.min(minRadius, maxRadius);
    const maxR: number = Math.max(minRadius, maxRadius);

    const circles: Array<Circle> = new Array<Circle>();

    for (i=0; i<circleCount; ++i)
    {
      circle        = new Circle();
      circle.id     = i.toString();
      circle.x      = left + Math.random() * xRange;
      circle.y      = minY + Math.random() * yRange;
      circle.radius = minR + Math.random() * rRange;

      circle.setBounds(left, top, right, bottom);

      circles.push(circle);
    }

    return circles;
  };
