/**
 * Copyright 2014 Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
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
 * AMYR Library.  Implement the {FractionType} interface for fractions and mixed numbers. The numerator is allowed to be
 * input as positive or negative. If the {FractionType} represents a mixed number, the negative sign is associated with
 * the whole part.  The denominator should always be input as strictly positive.  The default {FractionType} is the
 * fraction, 0/1. By default, the {FractionType} is not in reduded form and is not a mixed number.</p>
 *
 * <p>It is allowable from one part of the fraction (whole, numberator, or denominator) to be 'unknown' and this is
 * accounted for in the {string} representation.  This is useful for EdTech applications involving equations containing
 * fractions.</p>
 *
 * <p>Although mutators are provided to individually set whole part, numerator, and denominator, use the
 * the {setFraction} method to assign a fraction taking all consituents into account simultaneously.  Do not set a
 * fraction such as 5/3 and exepct a proper mixed num ber by setting the {isMixed} property, and then individually
 * assigning numerator and denominator.  Only use the individual mutators to change a single value in the context of
 * all other faction consituents.  Otherwise, unexpected results may occur.</p>
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */

import { FractionType    } from "../../../models/math/fraction-type";
import { UnknownPartEnum } from "../../../models/math/unknown-part-enum";
import { MathTypeEnum    } from "../../../models/math/math-type-enum";

import { gcd } from "../../tsmt/utils/math-utils";

import { BasicMathType, ExtendedMathType } from "../../../models/math/basic-math-type";

import { strToFrac   } from './utils/str-to-frac';
import { floatToFrac } from "./utils/float-to-frac";

export class FractionModel implements FractionType
{
  // while the whole part could be numerically extracted on-demand for a mixed number, the code is easier to follow
  // for others if it is internally maintained in the class.
  protected _whole       = 0;     // whole part of a mixed number
  protected _numerator   = 0;     // numerator
  protected _denominator = 1;     // denominator
  protected _isMixed     = false; // true if a mixed number
  protected _isReduced   = false; // true if in reduced form
  protected _isUnknown   = false; // true if this type represents the unknown in an expression

  // the 'unknown' part allows whole, numerator, or denominator to be unknown in an equation
  protected  _unknownPart: UnknownPartEnum = UnknownPartEnum.NONE;

 /**
  * Construct a new {FractionType}
  */
  public FractionType()
  {
    this.setFraction(0, 0, 1);
  }

 /**
  * Access math type
  */
  public get type(): MathTypeEnum
  {
    return MathTypeEnum.FRACTION;
  }

 /**
  * Return a {string} representation of the current {FractionModel}
  *
  */
  public toString(): string
  {
    if( this._isUnknown )
    {
      switch( this._unknownPart )
      {
        case UnknownPartEnum.NONE:
          return UnknownPartEnum.UNKNOWN;
          break;

        case UnknownPartEnum.NUMERATOR:
          if( this._isMixed )
            return this._numerator != 0 ? (this._whole + " " + UnknownPartEnum.UNKNOWN + "/" + this._denominator) : this._whole.toString();
          else
            return this._numerator != 0 ? (UnknownPartEnum.UNKNOWN + "/" + this._denominator) : UnknownPartEnum.UNKNOWN;
          break;

        case UnknownPartEnum.DENOMIMATOR:
          if( this._isMixed )
            return this._numerator != 0 ? (this._whole + " " + this._numerator + "/" + UnknownPartEnum.UNKNOWN) : this._whole.toString();
          else
            return this._numerator != 0 ? (this._numerator + "/" + UnknownPartEnum.UNKNOWN) : UnknownPartEnum.UNKNOWN;
          break;

        default:
          return UnknownPartEnum.UNKNOWN;
          break;
      }
    }

    if( this._isMixed )
    {
      if( this._whole != 0 )
      {
        // mixed formaating
        return this._numerator != 0 ? (this._whole + " " + this._numerator + "/" + this._denominator) : this._whole.toString();
      }
    }

    if (this._numerator === 0) return "0";

    return this._denominator === 1 ? this._numerator.toString() : (this._numerator.toString() + "/" + this._denominator.toString());
  }

 /**
  * Access the numerical value of this fraction
  */
  public get value(): number
  {
    return this._whole + this._numerator/this._denominator;
  }

 /**
  * Directly assign a {FractionModel} from an external value, provided a coercion is possible.
  *
  * @param {ExtendedMathType} data reference to value for assignment
  */
  public set value(data: ExtendedMathType)
  {
    if (data !== undefined && data != null)
    {
      const f: FractionType = this.toType(data);

      this.setFraction(f.whole, f.numerator, f.denominator);
    }
  }

 /**
  * Return whether or not the {FractionModel} is currently in reduced form.
  *
  */
  public get reduced(): boolean
  {
    return this._isReduced !== undefined ? this._isReduced : gcd(this._numerator, this._denominator) === 1;
  }

 /**
  * Assign whether future fraction changes are internally represented in reduced form
  *
  * @param {boolean} value {true} if future changes are converted to reduced form
  */
  public set reduced(value: boolean)
  {
    this._isReduced = value === true;

    if (this._isReduced) this.reduce();
  }

 /**
  * Return whether the {FractionModel} represents a mixed number
  */
  public get mixed(): boolean
  {
    return this._isMixed === true;
  }

 /**
  * Indicate if future updates are to be represented in mixed form.
  *
  * @param {boolean} ismixed {true} if future updates to the {FractionType} are maintaned as mixed numbers
  */
  public set mixed(isMixed: boolean)
  {
    this._isMixed = isMixed === true;

    if (this._isMixed)
      this.__toMixed();
    else
    {
      this._numerator += this._whole*this._denominator;
      this._numerator  = this._whole < 0 ? -this._numerator : this._numerator;
      this._whole      = 0;
    }
  }

 /**
  * Return the whole part of a mixed number or zero if the {FractionType} does not represent a mixed number
  */
  public get whole(): number
  {
    return this._isMixed ? this._whole : 0;
  }

 /**
  * Assign a new whole part to a mixed number, leaving the numerator and denominator unchanged.
  *
  * @param {number} newWhole New whole part of a mixed number
  */
  public set whole(newWhole: number)
  {
    this._whole = !isNaN(newWhole) ? newWhole : Math.round(this._whole);

    if (this._isReduced) this.reduce();
  }

 /**
  * Return the current numerator value based on mixed or non-mixed status
  */
  public get numerator(): number
  {
     return this._numerator
  }

 /**
  * Assign a new numerator value, respecting {mixed} and {reduced} settings
  *
  * @param {number} newNumerator New numerator value (positive integer)
  */
  public set numerator(newNumerator: number)
  {
    this._numerator = !isNaN(newNumerator) ? Math.round(newNumerator) : this._numerator;

    if (this._isMixed)
    {
      if (this._numerator < 0)
      {
        if (this._isMixed) this._whole > 0 ? -this._whole : this._whole;

        this._numerator = this._numerator > 0 ? -this._numerator: this._numerator;
      }
    }

    if (this._isReduced) this.reduce();

    if (this._isMixed) this.__toMixed();
  }

 /**
  * Access the unknown part of a fraction
  */
  public get unknownPart(): UnknownPartEnum
  {
    return this._unknownPart;
  }

 /**
  * Indicate the unknown part of this type
  *
  * @param {UnknownPartEnum} part Indicates whether unknown part is whole, numerator, or denominator ("w", "n", or "d")
  */
  public set unknownPart(part: UnknownPartEnum)
  {
    this._unknownPart = part !== undefined && part != null ? part : this._unknownPart;
  }

 /**
  * Return the current numerator value without regard to whether or not this is a mixed number
  */
  public get computedNumerator(): number
  {
    return this._whole*this._denominator + this._numerator;
  }

 /**
  * Return the current denominator value
  */
  public get denominator(): number
  {
    return this._denominator;
  }

 /**
  * Assign a new denominator value, leaving the whole part and numerator unchanged
  *
  * @param {number} newDenominator: number New denominator value (positive integer)
  */
  public set denominator(newDenominator: number)
  {
    this._denominator = !isNaN(newDenominator) ? Math.round(newDenominator) : this._denominator;

    if (this._denominator < 0)
    {
      this._denominator = -this._denominator;
      this._numerator   = -this._numerator;
    }

    if (this._isReduced ) this.reduce();

    if (this._isMixed) this.__toMixed();
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
  * Copy the current {FractionModel}
  */
  public clone(): BasicMathType
  {
    const fraction: FractionModel = new FractionModel();
    fraction.reduced              = this._isReduced;
    fraction.mixed                = this._isMixed;

    // assign fraction value
    fraction.setFraction(this._whole, this._numerator, this._denominator);

    return (fraction as unknown) as BasicMathType;
  }

 /**
  * Clear out the current fraction.  Set the value to 0 0/1 with both {mixed} and {reduced} set to {false}.
  */
  public clear():void
  {
    this._whole       = 0;
    this._numerator   = 0;
    this._denominator = 1;

    this._isMixed   = false;
    this._isReduced = false;
  }

  /**
   * Compare to another type with optional tolerance.
   */
  public compare(type: ExtendedMathType, tolerance: number = 0.0000001): boolean
  {
    return true;
  }

 /**
  * Assign a fraction based on the supplied whole, numerator, and denominator, simultaneously.  To assign a negative
  * mixed number, place the negative with the whole part.
  *
  * @param newWhole: number Whole part of the new fraction or mixed number (may be negative)
  * @default 0
  *
  * @param newNumerator: number Numerator of the new fraction or mixed number
  * @default 0
  *
  * @param newDenominator: number Denominator of the new fraction or mixed number
  * @default 1
  */
  public setFraction(
    newWhole: number=0,
    newNumerator: number=0,
    newDenominator: number=1
 ):void
  {
    this._denominator = !isNaN(newDenominator) && newDenominator !== 0 ? Math.round(Math.abs(newDenominator)) : this._denominator;
    this._numerator   = !isNaN(newNumerator) ? Math.round(newNumerator) : this._numerator;
    this._whole       = !isNaN(newWhole) ? Math.round(newWhole) : this._whole;

    if (this._whole !== 0)
    {
      if (!this._isMixed)
      {
        // just turned this into a mixed number
        this._isMixed = true;

        if (this._numerator < 0)
        {
          this._whole     = -this._whole;
          this._numerator = -this._numerator;
        }

        if (this._numerator/this._denominator > 1) this.__toMixed();
      }
      else
      {
        if (this._numerator < 0)
        {
          this._whole     = -this._whole;
          this._numerator = -this._numerator;
        }

        if (Math.abs(this._numerator) / this._denominator > 1)
        {
          this._whole    += Math.floor(this._numerator / this._denominator);
          this._numerator = this._numerator % this._denominator;
        }
      }
    }
    else
    {
      if (this._numerator / this._denominator > 1 && this._isMixed ) this.__toMixed();
    }

    if (this._isReduced) this.reduce();
  }

 /**
  * Return the least common denominator of the current and an input {FractionType}
  *
  * @param {FractionType} fraction Reference to a {FractionType}
  *
  */
  public leastCommonDenominator(fraction: FractionType): number
  {
    const d: number        = fraction.denominator;
    const gcdValue: number = gcd(this._denominator, d);

    return Math.floor( (this._denominator * d) / gcdValue );
  }

 /**
  * Return the greatest common divisor of the current and an input {FractionType}
  *
  * @param {FractionType} fraction Reference to a {FractionType}
  */
  public greatestCommonDivisor(fraction: FractionType): number
  {
    const d: number = fraction.denominator;

    let a: number = Math.max(this._denominator, d);
    let b: number = Math.min(this._denominator, d);
    let r         = 0;

    // in-line Euclid's algorithm for speed
    while (b > 0)
    {
      r = a % b;
      a = b;
      b = r;
    }

    return Math.floor(a);
  }

 /**
  * Convert the fraction to reduced form without affecting the reduction of future updates
  */
  public reduce(): void
  {
    const divisor: number = gcd(this._numerator, this._denominator);
    if( divisor === 1 ) return;

    this._numerator	  = Math.floor(this._numerator/divisor);
    this._denominator = Math.floor(this._denominator/divisor);
  }

 /**
  * Add the current fraction to an input type
  *
  * @param {ExtendedMathType} input Addend type
  *
  */
  public add(input: ExtendedMathType): BasicMathType
  {
    if (this._isUnknown ) return (new FractionModel() as unknown) as BasicMathType;

    let fractionType: FractionType = (new FractionModel() as unknown) as FractionType;

    if ( typeof(input) === 'string' ||
         typeof(input) === 'number' ||
         (input as BasicMathType).type !== MathTypeEnum.FRACTION)
      // convert to FractionType to complete operation; you will be assimilated
      fractionType = this.toType(input);
    else if (input instanceof FractionModel)
      fractionType = input as FractionType;
    else
      return fractionType;

    const cd: number = this.leastCommonDenominator(fractionType);
    const n1: number = this.computedNumerator * (cd/this._denominator);
    const n2: number = fractionType.computedNumerator * (cd/fractionType.denominator);

    const result: FractionType = new FractionModel();
    result.mixed               = this._isMixed || fractionType.mixed;

    result.setFraction(0, n1+n2, cd);

    return result;
  }

 /**
  * Subtract a type from the current fraction
  *
  * @param {ExtendedMathType} input Subtrahend type
  *
  */
  public subtract(input: ExtendedMathType): BasicMathType
  {
    if (this._isUnknown ) return (new FractionModel() as unknown) as BasicMathType;

    let fractionType: FractionType = (new FractionModel() as unknown) as FractionType;

    if ( typeof(input) === 'string' ||
      typeof(input) === 'number' ||
      (input as BasicMathType).type !== MathTypeEnum.FRACTION)
      // convert to FractionType to complete operation; you will be assimilated
      fractionType = this.toType(input);
    else if (input instanceof FractionModel)
      fractionType = input as FractionType;
    else
      return fractionType;

    const cd: number = this.leastCommonDenominator(fractionType);
    const n1: number = this.computedNumerator * (cd/this._denominator);
    const n2: number = fractionType.computedNumerator * (cd/fractionType.denominator);

    const result: FractionType = new FractionModel();
    result.mixed               = this._isMixed || fractionType.mixed;

    result.setFraction(0, n1 - n2, cd);

    return result;
  }

 /**
  * Multiply the current fraction by another type
  *
  * @param {ExtendedMathType} input Multiplicand type
  */
  public multiply(input: ExtendedMathType): BasicMathType
  {
    if (this._isUnknown ) return (new FractionModel() as unknown) as BasicMathType;

    let fractionType: FractionType = (new FractionModel() as unknown) as FractionType;

    if ( typeof(input) === 'string' ||
      typeof(input) === 'number' ||
      (input as BasicMathType).type !== MathTypeEnum.FRACTION)
      // convert to FractionType to complete operation; you will be assimilated
      fractionType = this.toType(input);
    else if (input instanceof FractionModel)
      fractionType = input as FractionType;
    else
      return fractionType;

    const n1: number = this.computedNumerator;
    const d1: number = this._denominator;

    const n2: number = fractionType.computedNumerator;
    const d2: number = fractionType.denominator;

    /* implement this for reduced form
     cd1: number = gcd(n1, d2);
     cd2: number = gcd(n2, d1);

      n1 = n1/cd1;
      n2 = n2/cd2;
      d1 = d1/cd2;
      d2 = d2/cd1;
    */

    const result: FractionType = new FractionModel();
    result.mixed               = this._isMixed || fractionType.mixed;

    result.setFraction(0, n1*n2, d1*d2);

    return result;
  }

 /**
  * Divide the current fraction by an input {BasicMathType}
  *
  * @param {ExtendedMathType} input Divisor type.
  */
  public divide(input: ExtendedMathType): BasicMathType
  {
    if (this._isUnknown ) return (new FractionModel() as unknown) as BasicMathType;

    let fractionType: FractionType = (new FractionModel() as unknown) as FractionType;

    if ( typeof(input) === 'string' ||
      typeof(input) === 'number' ||
      (input as BasicMathType).type !== MathTypeEnum.FRACTION)
      // convert to FractionType to complete operation; you will be assimilated
      fractionType = this.toType(input);
    else if (input instanceof FractionModel)
      fractionType = input as FractionType;
    else
      return fractionType;

    const n1: number = this.computedNumerator;
    const d1: number = this._denominator;

    const n2: number = fractionType.computedNumerator;
    const d2: number = fractionType.denominator;

    /* invert and multiply to return division result in reduced form
     cd1: number = gcd(n1, n2);
     cd2: number = gcd(d1, d2);

      n1 = n1/cd1;
      n2 = n2/cd1;

      d1 = d1/cd2;
      d2 = d2/cd2;
    */

    const result: FractionType = new FractionModel();
    result.mixed               = this._isMixed || fractionType.mixed;

    if (d1*n2 === 0) return new FractionModel();

    result.setFraction(0, n1*d2, d1*n2);

    return result;
  }

 /**
  * Overwite the current fraction by adding it to another {BasicMathType}
  *
  * @param {ExtendedMathType} input Addend type
  */
  public addAndReplace(input: ExtendedMathType): void
  {
    if (this._isUnknown) return;

    let fractionType: FractionType = (new FractionModel() as unknown) as FractionType;

    if ( typeof(input) === 'string' ||
      typeof(input) === 'number' ||
      (input as BasicMathType).type !== MathTypeEnum.FRACTION)
      // convert to FractionType to complete operation; you will be assimilated
      fractionType = this.toType(input);
    else if (input instanceof FractionModel)
      fractionType = input as FractionType;
    else
      return;

    const cd: number = this.leastCommonDenominator(fractionType);
    const n1: number = this.computedNumerator * (cd/this._denominator);
    const n2: number = fractionType.computedNumerator * (cd/fractionType.denominator);

    this.setFraction(0, n1+n2, cd);
  }

 /**
  * Overwrite the current fraction by subtracting an input type from it
  *
  * @param {ExtendedMathType} input Subtrahend type
  */
  public subtractAndReplace(input: ExtendedMathType): void
  {
    if (this._isUnknown) return;

    let fractionType: FractionType = (new FractionModel() as unknown) as FractionType;

    if ( typeof(input) === 'string' ||
      typeof(input) === 'number' ||
      (input as BasicMathType).type !== MathTypeEnum.FRACTION)
      // convert to FractionType to complete operation; you will be assimilated
      fractionType = this.toType(input);
    else if (input instanceof FractionModel)
      fractionType = input as FractionType;
    else
      return;

    const cd: number = this.leastCommonDenominator(fractionType);
    const n1: number = this.computedNumerator * (cd/this._denominator);
    const n2: number = fractionType.computedNumerator * (cd/fractionType.denominator);

    this.setFraction(0, n1-n2, cd);
  }

 /**
  * Overwrite the current fraction by multiplying it by another type
  *
  * @param {ExtendedMathType} input Multiplicand type
  */
  public multiplyAndReplace(input: ExtendedMathType): void
  {
    if (this._isUnknown) return;

    const n1: number = this.computedNumerator;
    const d1: number = this._denominator;

    let fractionType: FractionType = (new FractionModel() as unknown) as FractionType;

    if ( typeof(input) === 'string' ||
      typeof(input) === 'number' ||
      (input as BasicMathType).type !== MathTypeEnum.FRACTION)
      // convert to FractionType to complete operation; you will be assimilated
      fractionType = this.toType(input);
    else if (input instanceof FractionModel)
      fractionType = input as FractionType;
    else
      return;

    const n2: number = fractionType.computedNumerator;
    const d2: number = fractionType.denominator;

    /* implement this for reduced form
     cd1: number = gcd(n1, d2);
     cd2: number = gcd(n2, d1);

      n1 = n1/cd1;
      n2 = n2/cd2;
      d1 = d1/cd2;
      d2 = d2/cd1;
    */

    this.mixed = this._isMixed || fractionType.mixed;

    this.setFraction(0, n1*n2, d1*d2);
  }

 /**
  * Overwrite the current fraction with the quotient of it and another type
  *
  * @param {ExtendedMathType} input Divisor type
  */
  public divideAndReplace(input: ExtendedMathType):void
  {
    if (this._isUnknown) return;

    const n1: number = this.computedNumerator;
    const d1: number = this._denominator;

    let fractionType: FractionType = (new FractionModel() as unknown) as FractionType;

    if ( typeof(input) === 'string' ||
      typeof(input) === 'number' ||
      (input as BasicMathType).type !== MathTypeEnum.FRACTION)
      // convert to FractionType to complete operation; you will be assimilated
      fractionType = this.toType(input);
    else if (input instanceof FractionModel)
      fractionType = input as FractionType;
    else
      return;

    const n2: number = fractionType.computedNumerator;
    const d2: number = fractionType.denominator;

    /* invert and multiply to return division result in reduced form
     cd1: number = gcd(n1, n2);
     cd2: number = gcd(d1, d2);

      n1 = n1/cd1;
      n2 = n2/cd1;

      d1 = d1/cd2;
      d2 = d2/cd2;
    */

    this.mixed = this._isMixed || fractionType.mixed;

    if (d1*n2 === 0) return;

    this.setFraction(0, n1*d2, d1*n2);
  }

  protected toType(mathType: ExtendedMathType): FractionType
  {
    // only string -> fraction, float -> fraction and whole or integer -> fraction are currently implemented
    if (typeof (mathType) === "string")
    {
      const strVal = String(mathType);
      if (strVal.length === 0 || strVal === ' ')
      {
        const f: FractionModel = new FractionModel();
        f.setFraction(this._whole, this._numerator, this._denominator);

        return f;
      }

      // is the fraction defined with a division symbol, i.e. 3/8 or 1 3/4?
      if (String(mathType).indexOf('/') !== -1) return strToFrac(String(mathType));

      if (!isNaN(+mathType)) return floatToFrac(+mathType);

      return new FractionModel() as unknown as FractionType;
    }
    else if (typeof (mathType) === "number")
    {
      if (!isNaN(mathType)) return floatToFrac(mathType);

      return new FractionModel() as unknown as FractionType;
    }
    else
    {
      let f: FractionModel;
      let value: number;
      if ((mathType as BasicMathType).type !== undefined)
      {
        switch (mathType.type)
        {
          case MathTypeEnum.REAL:
            value = Number(mathType.value);
            if (!isNaN(value)) return floatToFrac(value);

            return new FractionModel() as unknown as FractionType;
            break;

          case MathTypeEnum.FRACTION:
            return (mathType as unknown as FractionModel).clone() as FractionType;
            break;

          case MathTypeEnum.INTEGER:
          case MathTypeEnum.WHOLE:
            f = new FractionModel();
            f.setFraction(0, (mathType as FractionModel).value, 1);
            return f;
        }
      }
    }

    return new FractionModel() as unknown as FractionType;
  }

  protected __toMixed(): void
  {
    const wholeAmt: number   = Math.floor(Math.abs(this._numerator)/this._denominator);
    const multiplier: number = this._whole < 0 || this._numerator < 0 ? -1 : 1;

    this._whole += wholeAmt * multiplier;

    this._numerator  = Math.abs(this._numerator);
    this._numerator -= wholeAmt*this._denominator;
  }
}
