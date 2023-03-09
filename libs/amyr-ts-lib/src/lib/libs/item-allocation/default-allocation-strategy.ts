/**
 * Copyright 2017 Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
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
 * Typescript Math Toolkit Item allocation - implementation of a Strategy pattern that allows a variety of payoff vs. capacity scenarios to be considered during
 * the solution process; this specific implementation represents the default, linear relationship.
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */

import { AllocatableItem         } from './allocatable-item';
import { AllocatableItemProps    } from "../../models/allocatable-item-props";
import { AllocatableItemStrategy } from "../../models/allocatable-item-strategy";

export class DefaultAllocationStrategy implements AllocatableItemStrategy
{
  constructor()
  {
    // empty
  }

  /**
   * Transform cost and/or payoff values of a TSMT$AllocatableItem to enable what-if scenarios
   *
   * @param {AllocatableItem} item Reference to an allocatable item whose properties will be transformed
   *
   * @param { [key:string]: number } data Optional property bag that may be used in rate and value computations - note
   * that this may be passed as null, so always check before using
   */
  public transform(item: AllocatableItem, data?: { [key:string]: number }): AllocatableItemProps
  {
    // tbd - check on rate computation if capacity is zero or near-zero?  Right now, you break it, you buy it.
    if (item !== null && item instanceof AllocatableItem)
      return {
        capacity: item.capacity,
        payoff: item.payoff,
        rate: item.payoff/item.capacity,
        value: (item.solutionCapacity/item.capacity)*item.payoff
    };

    // return an item that can not be allocated since it has invalid capacity; this provides a more graceful failure
    // than null or undefined
    return {
      capacity: 0,
      payoff: 0,
      rate: 0,
      value: 0
    };
  }
}
