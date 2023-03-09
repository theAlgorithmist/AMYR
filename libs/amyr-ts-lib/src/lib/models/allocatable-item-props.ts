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
 * An interface for allocation attributes associated with an allocatable item.
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */

export interface AllocatableItemProps
{
  capacity: number;  // optionally modified capacity

  payoff: number;    // optionally modified payoff

  rate: number;      // rate of payoff per unit capacity consumed - used in sorting

  value: number;     // value associated having a specified capacity of this Item in the solution
}
