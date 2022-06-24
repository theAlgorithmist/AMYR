# TYPESCRIPT MATH TOOLKIT

The TypeScript Math Toolkit (TSMT) is a continuation of the _JavaScript Math Toolkit_ created by Jim Armstrong in the 2014-2016 time frame.  Other than classical data structures, it consists primarily of software targeting mathematical (numerical) operations.

TSMT folder structure is documented below. (C) means that code in that folder is complete, meaning on par with the ADT (Angular Dev Toolkit).  (N) means that new content beyond that existing in the ADT has been added to the folder. (P) means partial content (relative to the ADT).  (E) means the folder is currently empty, i.e. ADT code has yet to be moved into _AMYR_.  That requires some more coffee!!

- crypto (code used in crypto algorithms) - E
- dataframe (TypeScript class emulating R-style data frames) - E
- **datastructures (TypeScript data structures library) - C**
- decorators (line decorators for dynamic drawing) - E
- expression-engine (evaluate string expression to boolean/number/string) - E
- function-parser (evaluate numerical value of a function expressed as a string) - E
- geometry (2D geometry functions) - E
- graphing (graphing support library) - E
- item-allocation (solve 0-1 and continous knapsack problems) - E
- math (general math libraries) - E
- random (functions involving pseudo-random computations) - E
- shuffle (shuffling code) - E
- **test (TSMT specs) - C**
- utils (TSMT utils library) - E

## Crypto
  - Empty

## Dataframe
  - Empty

## Datastructures

  The _datastructures_ folder currently contains (see specs in the _test_ folder for complete examples):

  - utils (supporting utility libraries)
  - array-deque (Java-style Array Deque)
  - avl-tree (Binary AVL Tree)
  - b-tree-light (Lighweight Binary Tree)
  - disjoint-set (Disjoint Set)
  - graph (General Graph)
  - heap (Min and Max Heap)
  - linked-list (Single-, double-, and circular-) linked list
  - priority-queue (Priority Queue)
  - queue (FIFO Queue)
  - r-tree (TS implementation of an R Tree - to support concave hull)
  - simple-graph (Lightweight graph with MST and k-clustering)
  - skip-list (Skip List)
  - Stack (LIFO or FIFO stack)
  - Tree (General Tree)
  - Trie (Aho-Corasick double-array Trie)

## Expression Engine

  - Empty

## Decorators

  - Empty

## Geometry

  hulls - Folder contain hull-computation classes and utilities
  - **convex-hull** Functions to compute convex hull of a planar point collection
  - **concave-hull** Concave-hull computations

  layout - Folder containing all classes for 2D Layouts (empty)

  line-smoothing - Folder containing all line-smoothing functions (empty)

  planar - Folder containing planar-curve classes

  - **cubic-bezier** Cubic Bezier with 4-point interpolation and arc-length parameterization
  - **line** Parametric representation of a straight line in the plane
  - **planar-curve** Abstract base class for up to cubic parametric curves in the plane
  - **quad-bezier** Quadratic Bezier with 3-point interpolation and arc-length parameterization

  circle - **Circle** class - general representation of a circle and methods to manage circle in quarants

  point - **PlanarPoint** class.  Representation of and computations on points in the plane.

  polygon - **Polygon** class. A general, two-dimensional (closed) polygon class.  Supports centroid computations, translation, and scaling about the centroid.

  splines - Spline classes include

  - **CubicBezierSpline** (piecewise) cubic bezier spline with auto-closure
  - **CubicSpline** Natural cubic spline with C-2 continuity (no overlapping interpolation segments)

  utils - Folder containing general or misc geometry classes

  - **circle-factory** - create one or more circles in a rectangular bounding region

## Graphing

  - Empty

## Item Allocation

  - Empty

## Math

 - derivative (Several methods for numerically evaluating first derivatives)
 - matrix (General Matrix class with LU factorization and linear system solution)
 - neville (Implementation of Neville's Method for interpolation)
 - prime-factorization (Prime Factorization algorithm for modest-sized integers)
 - quaternion (General operations on Quaternions)
 - repeat-to-frace (Repeating decimal to fractional form)

## Statistics

  - **bayes** Bayesian analysis
    - bayes (naive Bayes analysis)
    - frequency-table (2D frequency table for used in Bayes analys)
  - **regression** Linear and polynomial least squares
    - bagging (Support class for bagging in least squares)
    - bllsq (linear least squares with bagging and sub-bagging)
    - llsq (linear least squares fit witch chi-2 and rms error)
    - pllsq (polynomial least squares regression)
  - binomial-coef (Pascal's triangle with ability to quickly move up or down the triangle)
  - chi-square (Chi-square distribution)
  - data-stats (basic statistics with JIT computation of common stats)
  - ext-normal (Extended Normal distribution intended for graphing applications)
  - normal (Normal distribution with first derivatives)
  - poisson (Poisson distribution)
  - special-fcn (Special function approximations)

## Utils

General utilities, including

- approx-equals (compare two numbers for approximate equality)
- array-functions (single-line fcns for string and array computations)
- balanced-parens (are parentheses balanced in a string expression)
- bisect (root-isolation by interval biscetion for a function of a single variable)
- circle-utility-functions (comprehensive set of functions for circle-related computations)
- compare-utils (a small set of comparision utilities)
- cubic-roots (estimate roots of a cubic function of a single variable)
- gauss (Gaussian Quadrature)
- geom-utils (comprehensive set of functions for general planar geometry computations)
- halley (estimate roots of a function of a single variable by Halley's method)
- limits (some useful numerical constants)
- linear-interp (general linear interpolation and extrapolation)
- math-utils (a small, but growing set of math utilities)
- newton (estimate roots of a function of a single variable by Newton's method)
- number-formatter (a comprehensive set of functions for number formatting)
- point-utils (a comprehensive set of functions for computations on planar points)
- polygon-utils (commonly used functions for operations on polygons)
- quick-select (a TypeScript port of theJavascript quick-select, [https://www.npmjs.com/package/quickselect](https://www.npmjs.com/package/quickselect))
- solve-2x2 (quick solution of 2x2 systems of linear equations)
- str-equals (string compare from a starting position)
- string-utils (general string utility functions)
- to-number (format a string to a number)
- twbrf (TypeScript port of Jack Crenshaw's Worlds Best Root Finder)

