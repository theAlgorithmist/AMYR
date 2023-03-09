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
 * AMYR Library.  0-1 item allocation (knapsack problem).  Computes optimal allocation of Items with specified
 * capacity/payoff into an environment with a specified total capacity. An item is either completely in or completely
 * out of the environment.
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */
import { ItemAllocation  } from "./item-allocation";
import { AllocatableItem } from "./allocatable-item";
import { matrixFactory   } from "./matrix-factory";

export class Knapsack extends ItemAllocation
{
  constructor()
  {
    super();
  }

  /**
   * Allocate items to the environment from the collection, based on assigned item strategy and specified environment
   * capacity. After solution, use the {cost} and {payoff} accessors to obtain the total cost and payoff from this
   * allocation.  Note that the allocation is not cached - if a subsequent call is made to {allocate} without
   * changing any inputs, the entire solution will be recomputed.  Note that no check is made on item capacities,
   * which must be non-negative and integral.
   */
  public override allocate(): Array<AllocatableItem>
  {
    const allocation: Array<AllocatableItem> = new Array<AllocatableItem>();
    const itemCount: number                  = this._items.length;
    let item: AllocatableItem;

    if (itemCount === 0) return allocation;

    if (this._capacity === 0) return allocation;

    // one item is treated as an edge case - just seems strange to build a value table for only one item :)
    if (itemCount === 1)
    {
      item = this._items[0];
      if (item.capacity <= this._capacity)
      {
        item.solutionCapacity = item.capacity;
        item.solutionValue    = item.payoff;

        allocation.push(item);
      }

      return allocation;
    }

    // 'value' matrix - rows represent items and column indices are integer capacity values (the first row/column
    // represents a trivial or degenerate problem).
    const rows: number = itemCount+1;
    const cols: number = this._capacity+1;

    const value: Array<Array<number>> = matrixFactory(rows, cols, 0.0);

    let i: number;
    let capacity: number;

    // process by rows or by item capacity
    for (i = 1; i < rows; ++i)
    {
      item = this._items[i-1];
      for (capacity = 1; capacity < cols ; ++capacity)
      {
        if (item.capacity <= capacity)
        {
          // new value is maximum of current item payoff and payoff of what can be achieved with remaining capacity vs. prior sub-problem
          value[i][capacity] = Math.max ( item.payoff + value[i-1][capacity - item.capacity], value[i-1][capacity] );
        }
        else
        {
          // current item requires too much capacity, so current value is previous row value
          value[i][capacity] = value[i-1][capacity];
        }
      }
    }

    // payoff from this solution ends up on the lower, right-hand corner of the table
    this._solutionPayoff = value[rows-1][cols-1];

    // backtrack to determine which items are in the optimal allocation
    let curValue: number = this._solutionPayoff;
    capacity             = cols-1;
    i                    = rows-1;

    while (curValue > 0)
    {
      // in optimal allocation?  yes, if did not come from prior sub-problem
      if (value[i-1][capacity] != curValue)
      {
        item                  = this._items[i-1];
        item.solutionCapacity = item.capacity;
        item.solutionValue    = item.payoff;

        allocation.push(item);

        i--;
        capacity -= item.capacity;
      }
      else
        i--;

      curValue = value[i][capacity];  // as soon as this is zero, we quit
    }

    return allocation; // beam me up, Scotty
  }
}
