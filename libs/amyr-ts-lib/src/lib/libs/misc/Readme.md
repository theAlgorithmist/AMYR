# AMYR MISC FUNCTIONS LIBRARY

The _AMYR_ library contains numerous miscellaneous classes and functions that support important, but _one-off_ functionality that does not generally fit anywhere else in the library

The file list is as follows

- capitalize-first (capitalize the first letter of each word in a string of words)
- clear-local-storage (clear local storage)
- day-hour-offset (Given a JS Date object, return a numerical code indicating the day of week and the number of hours offset from midnight)
- day-iterator (A C++ style iterator for moving back and forth between days of the week)
- from-local-storage (retrieve a named value from local storage)
- get-cookie-value (fetch a value from a named cookie)
- in-enum (is the specified value contained in a string enumeration)
- index-of-max (index of maximum value in an array of numbers)
- interval-between-days (given two different days, i.e. M and W, or TU and SA, computed the number of 24-hour intervals between the days, with wrapping to the next day of the week, in sequence.  The week is presumed to begin on Sunday, with day indices in the interval [0,6].)
- iterative-mean (iterative mean from Knuth TAOCP to handle mean computations where overflow is possible in the sum of the individual values)
- max-delta (compute the maximum delta in O(n) from an array of numbers containing strictly positive values)
- missing-step (given an array containing step labels 1, 2, ... N - and the value of N - with one step missing, determine the missing step label in O(N) complexity)
- orderd-permutations (algorithm L from Knuth TAOCP to compute ordered permutations of objects)
- set-cookie-value (assign a valueto a named cookie)
- time-stamp-to-milliseconds (given the constituents of a time stamp, i.e. days, hours, minutes, and seconds, convert to milliseconds)
- time-unit-to-milliseconds (given an individual time unit such as hours or minutes, convert to milliseconds)
- to-local-storage (assign a named value to local storge)
- to-spaced-list (convert the values of an array of strings into a single, space-delimited string)
- undo-redo (general undo/redo stack to support arbitrary undo and redo functionality in an application)
- uuid (a non-crypto unique ID generator)

## Folders

### models

This folder contains models that provide a somewhat uniform means of treating complex types as primitives that can be easily assigned, updated, and have simple operations (+, -, *, /, for example) applied to them.

Models are currently provided for _real_, _integer_, _whole numbers_, and _fractions._ These are collectively referred to as _math types._ in AMYR and all fulfill the contract specified in the _BasicMathType_ interface.

Models can be assigned a value, which can be another model.  For example,

```typescript
  const real: RealModel() = new RealModel();
  const frac: FractionModel = new FractionModel();

  frac.setFraction(1, 1, 2);
  
  real.value = 1.5;
  real.value = frac;
```

The value of the _real_ model in the above example is the same from both assignments.

Javascript _string_ and _numbers_ can be assigned and used in math type operations.

```typescript
    let int: IntegerModel = new IntegerModel();

    int.value = 1.25;

    let result: IntegerModel = int.multiply("2.0") as IntegerModel;

    result = int.multiply("a") as IntegerModel;  // invalid input coerced to zero value before multiply

    int.value = 1.25;

    result = int.multiply(2) as IntegerModel;
```

There is currently a model for clock time and it may be incorporated into the _BasicMathType_ framework in a future release.

Refer to the specs in _math-types-spec.ts_ for extensive and detailed usage examples.

### test
- test specs for all misc functions and classes
