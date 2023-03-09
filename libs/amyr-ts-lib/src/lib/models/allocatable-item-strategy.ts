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
 * An interface for an allocatable item strategy; the algorithm contained in the strategy will modify cost and payoff parameters and allow for 'what if'
 * scenarios by re-optimizing using the strategy.  A default strategy is to take no action.
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */

import { AllocatableItem      } from "../libs/item-allocation/allocatable-item";
import { AllocatableItemProps } from './allocatable-item-props';

export interface AllocatableItemStrategy
{
  transform(item: AllocatableItem, data?: {[key: string]: number}): AllocatableItemProps;
}
