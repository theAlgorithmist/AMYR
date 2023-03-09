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
 * AMYR Library.  Continuous item allocation.  This is a container for generic items with capacity, risk, and payoff
 * attributes.  Such items are to be fractionally allocated inside some generic environment which could be physical
 * (have actual area, volume, etc) or artificial (such as a schedule of activities).
 *i
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */
export class AllocatableItem
{
  // optional item properties that may be used to further identify an Item inside an application
  public name: string;
  public id: number;

  // capacity and payoff must all be greater than or equal to zero
  protected _capacity         = 0;   // total capacity (could be time or some spatial capacity) consumed by this item
  protected _payoff           = 0;   // expected payoff if total capacity is used
  protected _value            = 0;   // value of having this Item in any solution (should be assigned by a solver)
  protected _solutionCapacity = 0;   // how much capacity is in an optimal solution (should be assigned by a solver)

  // risk factors recognize that capacity/payoff values are typically stochastic; they are estimated or computed from other data and at best represent point-estimates
  // these factors can be used by an outside strategy to transform the input capacity/payoff values during the analysis
  protected _capacityRisk = 0;
  protected _payoffRisk   = 0;

  constructor()
  {
    this.name = "";
    this.id   = 0;
  }

  /**
   * Access the capacity of this Item
   */
  public get capacity(): number
  {
    return this._capacity;
  }

 /**
  * Assign the capacity of this item; should be greater than or equal to zero
  */
  public set capacity(value: number)
  {
    this._capacity = value !== null && !isNaN(value) && isFinite(value) && value >= 0 ? value : this._capacity;
  }

  /**
   * Access the payoff for this Item
   */
  public get payoff(): number
  {
    return this._payoff;
  }

  /**
   * Assign the payoff of this item; should be greater than or equal to zero
   *
   */
  public set payoff(value: number)
  {
    this._payoff = value !== null && !isNaN(value) && isFinite(value) && value >= 0 ? value : this._payoff;
  }

  /**
   * Access the solution value for this Item
   */
  public get solutionValue(): number
  {
    return this._value;
  }

  /**
   * Assign the value of this item in the optimal solution
   *
   * @param {number} v Assigned value that should be greater than or equal to zero
   */
  public set solutionValue(v: number)
  {
    this._value = v !== null && !isNaN(v) && isFinite(v) && v >= 0 ? v : this._value;
  }

  /**
   * Access the solution capacity for this Item or fraction of this Item in the optimal solution.  The result is
   * converted into amount of this Item's total capacity consumed
   */
  public get solutionCapacity(): number
  {
    return this._solutionCapacity;
  }

  /**
   * Assign the solution capacity this item
   *
   * @param {number} value Solution capacity in arbitrary units
   */
  public set solutionCapacity(value: number)
  {
    this._solutionCapacity = value !== null && !isNaN(value) && isFinite(value) ? value : this._solutionCapacity;
  }

  /**
   * Access the capacity risk for this Item in arbitrary units - this can also be used as a parameter
   * in a more general model for payoff vs. capacity consumed.
   */
  public get capacityRisk(): number
  {
    return this._capacityRisk;
  }

  /**
   * Assign the capacity risk of this item
   *
   * @param {number} value Cost risk of this item in arbitrary units
   */
  public set capacityRisk(value: number)
  {
    this._capacityRisk = value !== null && !isNaN(value) && isFinite(value) ? value : this._capacityRisk;
  }

  /**
   * Access the payoff risk for this Item
   */
  public get payoffRisk(): number
  {
    return this._payoffRisk;
  }

  /**
   * Assign the payoff risk of this item
   *
   * @param {number} value Payoff risk of this item in arbitrary units
   */
  public set payoffRisk(value: number)
  {
    this._payoffRisk = value !== null && !isNaN(value) && isFinite(value) ? value : this._payoffRisk;
  }

  /**
   * Clone this Item
   */
  public clone(): AllocatableItem
  {
    const item: AllocatableItem = new AllocatableItem();

    item.capacity     = this._capacity;
    item.payoff       = this._payoff;
    item.capacityRisk = this._capacityRisk;
    item.payoffRisk   = this._payoffRisk;

    return item;
  }
}
