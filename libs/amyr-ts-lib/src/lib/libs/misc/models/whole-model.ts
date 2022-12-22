/**
 * Copyright 2022 Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
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
 * AMYR Library.  Implement the {BasicMathType} interface for Whole Numbers.  The default value for a
 * {WholeModel} is zero.  All values that can not be coerced to a Javascript {number} are converted to zero as
 * a {BasicMathType}</p>
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */

import { MathTypeEnum } from "../../../models/math/math-type-enum";

import { BasicMathType, ExtendedMathType } from "../../../models/math/basic-math-type";
import { IntegerModel } from "./integer-model";

export class WholeModel implements BasicMathType
{
  protected _value: number;     // numerical value of this model
  protected _isUnknown = false; // true if this type represents the unknown in an expression

  /**
   * Construct a new {WholeModel}
   */
  constructor()
  {
    this._value = 0;
  }

  /**
   * Access math type
   */
  public get type(): MathTypeEnum
  {
    return MathTypeEnum.WHOLE;
  }

  /**
   * Return a {string} representation of the current {whole modelModel}
   */
  public toString(): string
  {
    return this._value.toString();
  }

  /**
   * Access the numerical value of this whole model
   */
  public get value(): number
  {
    return this._value;
  }

  /**
   * Directly assign an {WholeModel} from an external value, provided a coercion is possible.  This mutator
   * performs a strong conversion to a {WholeModel}, so negative values are coerced to the nearest whole number,
   * which is zero.
   *
   * @param {ExtendedMathType} data reference to value for assignment
   */
  public set value(data: ExtendedMathType)
  {
    if (data !== undefined && data != null)
    {
      if (typeof (data) === "number")
      {
        const value = data as number;

        this._value = isNaN(value) ? 0 : Math.round(Math.max(0, value));

        return;
      }

      this._value = this.toType(data).value as number;
    }
  }

  /**
   * Is this type an unknown in an equation?
   */
  public get isUnknown(): boolean
  {
    return this._isUnknown;
  }

  /**
   * Designate this type as being the unknown in an expression
   */
  public set isUnknown(value: boolean)
  {
    this._isUnknown = value === true;
  }

  /**
   * Copy the current {WholeModel}
   */
  public clone(): BasicMathType
  {
    const type: BasicMathType = new WholeModel();

    type.value     = this._value;
    type.isUnknown = this._isUnknown;

    return type;
  }

  /**
   * Clear out the current integer model.
   */
  public clear():void
  {
    this._value = 0;
  }

  /**
   * Compare to another type with optional tolerance.
   */
  public compare(type: ExtendedMathType, tolerance: number = 0.0000001): boolean
  {
    // this is a simple, relative comparison that does not take into account extremely small, extremely large,
    // or extreme differences in magnitude between values.
    let compare = 0;
    if (typeof(type) === 'string')
      compare = parseFloat(type);
    else if (typeof(type) === 'number')
      compare = type as number;
    else if (type.value !== undefined && type.type !== undefined)
      compare = type.value as number;

    compare = isNaN(compare) ? 0 : compare;

    // this accommodates rare cases of a complex type coerced to a number that is very close to a whole number
    return Math.abs( (this._value - compare) / this._value ) <= tolerance;
  }

  /**
   * Add the current whole model to an input type
   *
   * @param {ExtendedMathType} input Addend type
   *
   */
  public add(input: ExtendedMathType): BasicMathType
  {
    if (this._isUnknown ) return new WholeModel();

    const interim: BasicMathType = this.toType(input, false);
    const tmp: number            = this._value + Number(interim.value);

    const model: BasicMathType = tmp >= 0 ? new WholeModel() : new IntegerModel();
    model.value = tmp;

    return model;
  }

  /**
   * Subtract a type from the current whole model and return the most relavant model; {WholeModel} if the result is
   * greater than or equal to zero, otherwise return an {IntegerModel}.
   *
   * @param {ExtendedMathType} input Subtrahend type
   *
   */
  public subtract(input: ExtendedMathType): BasicMathType
  {
    if (this._isUnknown) return new WholeModel();

    const interim: BasicMathType = this.toType(input, false);
    const tmp: number            = this._value - Number(interim.value);

    const model: BasicMathType = tmp >= 0 ? new WholeModel() : new IntegerModel();
    model.value = tmp;

    return model;
  }

  /**
   * Multiply the current whole model by another type
   *
   * @param {ExtendedMathType} input Multiplicand type
   */
  public multiply(input: ExtendedMathType): BasicMathType
  {
    if (this._isUnknown) return new WholeModel();

    const interim: BasicMathType = this.toType(input, false);
    const tmp: number            = this._value * Number(interim.value);

    const model: BasicMathType = tmp >= 0 ? new WholeModel() : new IntegerModel();
    model.value = tmp;

    return model;
  }

  /**
   * Divide the current whole model by an input {BasicMathType}. A {WholeModel} is currently returned unless division
   * is by a negative value, in which case an {IntegerModel} is returned. Non-integral divisions are rounded to the
   * nearest whole number.  This behavior may be replaced by returning a {RealModel} in the future.
   *
   * @param {ExtendedMathType} input Divisor type.
   */
  public divide(input: ExtendedMathType): BasicMathType
  {
    if (this._isUnknown) return new WholeModel();

    const interim: BasicMathType = this.toType(input, false);
    const tmp: number            = interim.value === 0 ? this._value : Math.round(this._value / Number(interim.value));

    const model: BasicMathType = tmp >= 0 ? new WholeModel() : new IntegerModel();
    model.value = tmp;

    return model;
  }

  /**
   * Overwite the current whole model by adding it to another {BasicMathType}
   *
   * @param {ExtendedMathType} input Addend type
   */
  public addAndReplace(input: ExtendedMathType): void
  {
    if (this._isUnknown) return;

    const interim: WholeModel = this.toType(input) as WholeModel;

    this._value += interim.value;
  }

  /**
   * Overwrite the current whole model by subtracting an input type from it
   *
   * @param {ExtendedMathType} input Subtrahend type
   */
  public subtractAndReplace(input: ExtendedMathType): void
  {
    if (this._isUnknown ) return;

    const interim: WholeModel = this.toType(input) as WholeModel;

    this._value -= interim.value;
    this._value  = Math.max(0, this._value);
  }

  /**
   * Overwrite the current whole model by multiplying it by another type
   *
   * @param {ExtendedMathType} input Multiplicand type
   */
  public multiplyAndReplace(input: ExtendedMathType): void
  {
    if (this._isUnknown ) return;

    const interim: WholeModel = this.toType(input) as WholeModel;

    this._value *= interim.value;
  }

  /**
   * Overwrite the current whole model with the quotient of it and another type.  Since a {WholeModel} value is
   * replaced with the result of the division, that result is coerced to the nearest whole number.
   *
   * @param {ExtendedMathType} input Divisor type
   */
  public divideAndReplace(input: ExtendedMathType):void
  {
    if (this._isUnknown ) return;

    const interim: WholeModel = this.toType(input) as WholeModel;

    this._value = interim.value === 0 ? this._value : Math.round(this._value / interim.value);
    this._value = Math.max(0, this._value);
  }

  protected toType(mathType: ExtendedMathType, asWhole: boolean = true): BasicMathType
  {
    // only string -> integer, number -> integer, and whole/real/whole model -> integer are currently implemented
    const type: WholeModel = new WholeModel();
    let value              = 0;

    if (typeof(mathType) === "string")
    {
      const strVal = String(mathType);
      value        = parseFloat(strVal);
    }
    else if (typeof(mathType) === "number")
    {
      value = !isNaN(Number(mathType)) ? Math.round(Number(mathType)) : 0;
    }
    else if ((mathType as BasicMathType).type !== undefined && (mathType as BasicMathType).value !== undefined)
    {
      // a valid math type
      value = Math.round( (mathType as BasicMathType).value as number );
    }

    if (value >= 0 || asWhole)
    {
      type.value = Math.max(0, value);
      return type;
    }
    else
    {
      const int: IntegerModel = new IntegerModel();
      int.value               = value;

      return int;
    }
  }
}
