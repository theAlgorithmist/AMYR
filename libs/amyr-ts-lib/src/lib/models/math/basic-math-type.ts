export type ExtendedMathType =
  BasicMathType |
  number |
  string;

import { MathTypeEnum } from "./math-type-enum";

export interface BasicMathType
{
  // what is the current math type?
  get type(): MathTypeEnum;

  // return a string representation of the current math type
  toString(): string

  // is this type an unknown in an expression?
  get isUnknown(): boolean;

  // designate this type as an unknown in an expression
  set isUnknown(value: boolean);

  // any Math Type evaluates to a number, but return an {ExtendedMathType} to be consistent between accessor and mutator
  get value(): ExtendedMathType;

  // assign a new value to this Math Type
  set value(data: ExtendedMathType);

  // compare to another type with optional tolerance
  compare(value: ExtendedMathType, tolerance: number): boolean;

  // return a copy of the current type
  clone(): BasicMathType;

  // add another type to the current
  add(type: ExtendedMathType): BasicMathType;

  // subtract another type from the current
  subtract(type: ExtendedMathType): BasicMathType

  // multiply the current and an input type
  multiply(type: ExtendedMathType): BasicMathType

  // return the quotient of the current and input type
  divide(type: ExtendedMathType): BasicMathType

  // overwrite the current type by adding another type
  addAndReplace(type: ExtendedMathType):void

  // ovewrite the current type by subtracting another from it
  subtractAndReplace(type: ExtendedMathType):void

  // overwrite the current type by multiplying it by another
  multiplyAndReplace(type: ExtendedMathType):void

  // overwrite the current type with the quotient of it and another
  divideAndReplace(type: ExtendedMathType):void
}
