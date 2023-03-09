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
 * AMYR Library Item allocation - computes optimal allocation of Items with specified capacity/payoff into an environment
 * with a specified total capacity.  Items may be fractionally consumed, i.e. it is acceptable to complete 50% of a task
 * in a time interval along with other tasks.  Payoff from a single Item is the amount of utility gained if the entire
 * capacity of that Item is consumed.  Payoff is presumed to be continuous and linear as a function of units of capacity.
 *
 * A Strategy pattern is used to assign an algorithm to transform Item costs and/or payoffs to enable 'what if' analyses
 * as a comparison to baseline optimal solution, which is just solving the continuous knapsack problem.  Other models of
 * payoff vs. capacity consumed could be considered.  A default strategy that leaves item capacity and payoff unchanged
 * and uses a linear model for payoff vs. capacity is provided with the code distribution.  If no strateg is defined,
 * the default strategy is automatically assigned and used during the solution process.  This produces the same result
 * as if no strategy had been applied at all.
 *
 * Usage is to add {AllocatableItem} instances via calls to addItem(), set the capacity, and then call the {allocate}
 * method.  Optionally, assign am {AllocatableItemStrategy} for what-if scenarios.
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */

import { AllocatableItem           } from './allocatable-item';
import { AllocatableItemProps      } from "../../models/allocatable-item-props";
import { AllocatableItemStrategy   } from '../../models/allocatable-item-strategy';
import { DefaultAllocationStrategy } from './default-allocation-strategy';

export class ItemAllocation
{
  // strategy for computing payoff vs. capacity consumed and optionally modifying capacity/payoff for what-if scenarios
  protected _strategy: AllocatableItemStrategy = new DefaultAllocationStrategy();

  // item collection from which a subset is placed into the optimal allocation
  protected _items: Array<AllocatableItem> = [];

  // (nonzero) capacity that serves as a constraint for the allocation
  protected _capacity = 0;

  // an optional data item that allows properties to be passed to strategies
  protected _data: { [key: string]: number } = {};

  // post-solution
  protected _solutionCapacity = 0;  // total capacity consumed in the optimal allocation

  protected _solutionPayoff = 0;    // total payoff from the optimal allocation

  constructor()
  {
    this.clear();
  }

  /**
   * Access the total number of items in the environment (not the optimal allocation)
   */
  public get itemCount(): number
  {
    return this._items.length;
  }

  /**
   * Access the total capacity consumed in the optimal allocation
   */
  public get solutionCapacity(): number
  {
    return this._solutionCapacity;
  }

  /**
   * Access the total payoff of the optimal allocation
   */
  public get payoff(): number
  {
    return this._solutionPayoff;
  }

  /**
   * Access the capacity
   */
  public get capacity(): number
  {
    return this._capacity;
  }

  /**
   * Assign a capacity to this 'environment'.  If valid, environment capacity is set to the assigned value.  Capacity
   * represents the allowable consumption of some environment which may be physical space, but could also be time, for
   * example.  Capacity is always non-negative.
   *
   * @param {number} value Non-negative capacity value in arbitrary units
   */
  public set capacity(value: number)
  {
    // yes, this needs to be made more DRY in context of this project
    this._capacity = value !== null && !isNaN(value) && isFinite(value) && value >= 0 ? value : this._capacity;
  }

  /**
   * Assign strategy data to this allocation
   *
   * @param {[key: string]: number} value name-value pairs of arbitrary numberical data that may be passed to an input
   * strategy's {transform} method
   */
  public set data(value: { [key: string]: number })
  {
    if (value !== null && typeof value == "object") this._data = JSON.parse( JSON.stringify(value) );
  }

  /**
   * Add an item strategy to this environment
   *
   * @param {AllocatableItemStrategy} strategy:  Reference to an item allocation strategy.  The algorithm inside the
   * {transform} method alters the cost and/or payoff of each item in the environment to enable 'what-if' scenarios.
   * The original item settings always remain unchanged.
   */
  public addStrategy(strategy: AllocatableItemStrategy): void
  {
    if (this.__isValidStrategy(strategy)) this._strategy = strategy;
  }

  /**
   * Add an allocatable item to the collection
   *
   * @param {AllocatableItem} item Reference to an {AllocatableItem} to add to the collection
   */
  public addItem(item: AllocatableItem): void
  {
    if (this.__isValidItem(item)) this._items.push(item);
  }

  /**
   * Remove an allocatable item to the collection
   *
   * @param {AllocatableItem} item: Reference to an {AllocatableItem} to add to the collection
   */
  public removeItem(item: AllocatableItem): void
  {
    const len: number = this._items.length;
    if (len === 0) return;

    let i: number;
    for (i = 0; i < len; ++i)
    {
      if (item === this._items[i])
      {
        this._items.splice(i, 1);

        break;
      }
    }
  }

  /**
   * Allocate items to the environment from the collection, based on assigned item strategy and specified environment
   * capacity.  Use the {cost} and {payoff} accessors to obtain the total cost and payoff from this allocation.  Note
   * that the allocation is not cached - if a subsequent call is made to allocate() without changing any inputs, the
   * entire solution is recomputed.
   */
  public allocate(): Array<AllocatableItem>
  {
    const allocation: Array<AllocatableItem> = new Array<AllocatableItem>();
    const itemCount: number                  = this._items.length;

    if (itemCount == 0)
      return allocation;

    if (this._capacity == 0)
      return allocation;

    // need to set default strategy?
    if (this._strategy == null || this._strategy === undefined) this._strategy = new DefaultAllocationStrategy();

    // general reference to transformed item properties
    let p:AllocatableItemProps;

    // reference to an item in the collection
    let item: AllocatableItem;

    // edge cases - there is only one at present
    if (itemCount == 1)
    {
      item = this._items[0];

      // implement specified item transform
      p = this._strategy.transform(item, this._data);

      // fraction of total environment capacity that can be consumed by the singleton item
      let f: number = (p.capacity <= this._capacity) ? 1.0 : this._capacity/p.capacity;

      this._solutionCapacity = f*p.capacity;
      this._solutionPayoff   = f*p.payoff;
      item.solutionValue     = this._solutionPayoff;
      item.solutionCapacity  = this._solutionCapacity;

      allocation.push(item);

      return allocation;
    }

    let slack: number;  // amount of slack or 'leftover' capacity
    let i: number;

    // initial sort
    this._items.sort( (item1: AllocatableItem, item2: AllocatableItem): number => {
      let c = 0;

      const t1: AllocatableItemProps = this._strategy.transform(item1, this._data);
      const t2: AllocatableItemProps = this._strategy.transform(item2, this._data);
      const r1: number               = t1.rate;
      const r2: number               = t2.rate;

      if (r1 > r2)
        c = -1;
      else if (r1 < r2)
        c = 1;

      return c;
    });

    this._solutionCapacity = 0;  // begin with no environment capacity taken up by any item

    // Dantzig's greedy algorithm - really nothing new under the sun
    for (i = 0; i < itemCount; ++i)
    {
      slack = this._capacity - this._solutionCapacity;

      if (slack <= 0.0) break;

      item = this._items[i];
      p    = this._strategy.transform(item, this._data);  // get the transform parameters

      // does this item's capacity exceed or equal remaining slack?
      if (p.capacity >= slack)
      {
        // take up the remaining capacity with this item and we're finished!
        item.solutionCapacity  = slack;
        this._solutionCapacity = this._capacity;

        // p.rate is the rate of change of of payoff vs. capacity (presumed linear for this release)
        item.solutionValue    = p.rate*slack;
        this._solutionPayoff += item.solutionValue;

        allocation.push(item);  // add this item to the allocation

        break;
      }
      else
      {
        // this item's entire capacity can be consumed by the remaining slack in the environment
        item.solutionCapacity   = p.capacity;
        item.solutionValue      = p.payoff;
        this._solutionCapacity += p.capacity;
        this._solutionPayoff   += p.payoff;

        allocation.push(item);  // add this item to the allocation
      }
    }

    // tbd - mark that the solution has been validated and only recompute if input mods invalidate solution?

    return allocation; // beam me up, Scotty
  }

  /**
   * Clear the environment and prepare for new inputs
   */
  public clear(): void
  {
    this._strategy         = new DefaultAllocationStrategy();
    this._data             = {};
    this._items            = new Array<AllocatableItem>();
    this._capacity         = 0;
    this._solutionCapacity = 0;
    this._solutionPayoff   = 0;
  }

  // type guard for allocatable item
  protected __isValidItem(value: any): value is AllocatableItem
  {
    return value !== null && value instanceof AllocatableItem;
  }

  // type guard for assigned strategy
  protected __isValidStrategy(value: AllocatableItemStrategy): value is AllocatableItemStrategy
  {
    return value !== null && value.transform !== undefined;
  }

}
