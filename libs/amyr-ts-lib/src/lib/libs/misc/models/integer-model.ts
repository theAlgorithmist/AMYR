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
 * AMYR Library.  Implement the {BasicMathType} interface for Integers.  The default value for a
 * {IntegerModel} is zero.  All values that can not be coerced to a Javascript {number} are converted to zero as
 * a {BasicMathType}</p>
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */

import { MathTypeEnum } from "../../../models/math/math-type-enum";

import { BasicMathType, ExtendedMathType } from "../../../models/math/basic-math-type";

export class IntegerModel implements BasicMathType
{
  protected _value: number;     // numerical value of this model
  protected _isUnknown = false; // true if this type represents the unknown in an expression

  /**
   * Construct a new {IntegerType}
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
    return MathTypeEnum.INTEGER;
  }

  /**
   * Return a {string} representation of the current {integer modelModel}
   */
  public toString(): string
  {
    return this._value.toString();
  }

  /**
   * Access the numerical value of this integer model
   */
  public get value(): number
  {
    return this._value;
  }

  /**
   * Directly assign an {IntegerModel} from an external value, provided a coercion is possible.
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

        this._value = isNaN(value) ? 0 : Math.round(value);

        return;
      }

      this._value = this.toType(data).value;
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
   * Copy the current {IntegerModel}
   */
  public clone(): BasicMathType
  {
    const type: BasicMathType = new IntegerModel();

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
    // this is a simple, relative comparison that does not take into account extremely small, extremely large, or extreme
    // differences in magnitude between values.
    let compare = 0;
    if (typeof(type) === 'string')
      compare = parseFloat(type);
    else if (typeof(type) === 'number')
      compare = type as number;
    else if (type.value !== undefined && type.type !== undefined)
      compare = type.value as number;

    compare = isNaN(compare) ? 0 : compare;

    // this accommodates rare cases of a complex type coerced to a number that is very close to an integer
    return Math.abs( (this._value - compare) / this._value ) <= tolerance;
  }

  /**
   * Add the current integer model to an input type
   *
   * @param {ExtendedMathType} input Addend type
   *
   */
  public add(input: ExtendedMathType): BasicMathType
  {
    if (this._isUnknown ) return new IntegerModel();

    const integerModel: IntegerModel = new IntegerModel();

    const interim:IntegerModel = this.toType(input);

    integerModel.value = interim.value + this._value;

    return integerModel;
  }

  /**
   * Subtract a type from the current integer model
   *
   * @param {ExtendedMathType} input Subtrahend type
   *
   */
  public subtract(input: ExtendedMathType): BasicMathType
  {
    if (this._isUnknown) return new IntegerModel();

    const integerModel: IntegerModel = new IntegerModel();

    const interim:IntegerModel = this.toType(input);

    integerModel.value = this._value - interim.value;

    return integerModel;
  }

  /**
   * Multiply the current integer model by another type
   *
   * @param {ExtendedMathType} input Multiplicand type
   */
  public multiply(input: ExtendedMathType): BasicMathType
  {
    if (this._isUnknown) return new IntegerModel();

    const integerModel: IntegerModel = new IntegerModel();

    const interim:IntegerModel = this.toType(input);

    integerModel.value = this._value * interim.value;

    return integerModel;
  }

  /**
   * Divide the current integer model by an input {BasicMathType}
   *
   * @param {ExtendedMathType} input Divisor type.
   */
  public divide(input: ExtendedMathType): BasicMathType
  {
    if (this._isUnknown) return new IntegerModel();

    const integerModel: IntegerModel = new IntegerModel();

    const interim:IntegerModel = this.toType(input);

    integerModel.value = interim.value === 0 ? this._value : Math.round(this._value / interim.value);

    return integerModel;
  }

  /**
   * Overwite the current integer model by adding it to another {BasicMathType}
   *
   * @param {ExtendedMathType} input Addend type
   */
  public addAndReplace(input: ExtendedMathType): void
  {
    if (this._isUnknown) return;

    const interim:IntegerModel = this.toType(input);

    this._value += interim.value;
  }

  /**
   * Overwrite the current integer model by subtracting an input type from it
   *
   * @param {ExtendedMathType} input Subtrahend type
   */
  public subtractAndReplace(input: ExtendedMathType): void
  {
    if (this._isUnknown ) return;

    const interim:IntegerModel = this.toType(input);

    this._value -= interim.value;
  }

  /**
   * Overwrite the current integer model by multiplying it by another type
   *
   * @param {ExtendedMathType} input Multiplicand type
   */
  public multiplyAndReplace(input: ExtendedMathType): void
  {
    if (this._isUnknown ) return;

    const interim:IntegerModel = this.toType(input);

    this._value *= interim.value;
  }

  /**
   * Overwrite the current integer model with the quotient of this model and another type.  It is the caller's
   * responsibility to consider consequences of division by extremely small numbers and ratios of extremely small
   * numbers.
   *
   * @param {ExtendedMathType} input Divisor type
   */
  public divideAndReplace(input: ExtendedMathType):void
  {
    if (this._isUnknown ) return;

    const interim:IntegerModel = this.toType(input);

    this._value = Math.round(this._value / interim.value);
  }

  protected toType(mathType: ExtendedMathType): IntegerModel
  {
    // only string -> integer, number -> integer, and whole/real/integer model -> integer are currently implemented
    const type: IntegerModel = new IntegerModel();

    if (typeof(mathType) === "string")
    {
      const strVal        = String(mathType);
      const value: number = parseFloat(strVal);

      type.value = isNaN(value) ? 0 : Math.round(value);

      return type;
    }
    else if (typeof(mathType) === "number")
    {
      type.value = !isNaN(Number(mathType)) ? Math.round(Number(mathType)) : 0;
    }
    else if ((mathType as BasicMathType).type !== undefined && (mathType as BasicMathType).value !== undefined)
      {
        // a valid math type
        type.value = Math.round( (mathType as BasicMathType).value as number );
      }

    return type;
  }
}
