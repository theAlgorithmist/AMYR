# AMYR AI LIBRARY

The _AMYR_ AI library is intended to support low-level operations that fit (generally speaking) under the AI or ML umbrella.

The AI folder structure is documented below. (C) means that code in that folder is complete, meaning on par with the ADT (Angular Dev Toolkit).  (N) means that new content beyond that existing in the ADT has been added to the folder. (P) means partial content (relative to the ADT).  (E) means the folder is currently empty, i.e. ADT code has yet to be moved into _AMYR_.  That requires some more coffee!!

- **decision-tree (expression-based decision tree) - C**
- finite-state-machine (data-driven finite state machine) - E
- optimize (some low-level optimization libraries) - E
- **pathfinding (A-star for waypoints in the plane) - C**
- rules-engine (lightweight, front-end rules engine) - E
- sequencing engine (run multiple decision trees in sequence) - E
- simulated annealing (small library for optimization using simulated annealing) - E
- **test (TSMT specs) - C**
- **tiles (A* for 2D game tiles) - C**

## Decision Tree
This folder contains the expression based decision tree. The tree replaces complex, nested if-then-else statements with organized data in a separate file.  This allows frequently changing and complex logic to be migrated out of a code base where it is harder to individually test and maintain. Front-end applications, in particular, benefit from becoming more data-driven and less dependent of new code that must be written, re-written, and changed again and again during the
  application lifecycle.

Each node in the tree contains an expression, which is a string representation of an expression in infix notations such as 

* "clientType = 'ADMIN' && statusLevel > 1000"

The root node contains a guard expression that can be used to decide whether or not to execute subsequent logic in the tree.

A data object is provided and the tree is evaluated against this object.  For the above example, the object should contain actual values for the independent variables _clientType_ and _statusLevel_.  Variable values may be either _string_, _number_, or _boolean_ .  

The tree is evaluated breadth-first, that is after the root node evaluates to _true_ (or is bypassed), all subsequent child nodes are processed left-to-right.  If a node at that level evaluates to _true_, evaluation proceeds to that node's children.  All children are processed left-to-right.  If all evaluations are _false_ after processing an entire level, then no action can be taken.

Processing continues until a leaf node is reached.  A leaf node contains a named action (string) with no expression.  This can be the name of a route or a symbol that can be looked up in a hash of functions, or a general label that can be used to indicate how to handle the final evaluation.

For more information, [see this article](https://www.linkedin.com/pulse/typescript-decision-tree-jim-armstrong/).

More detailed usage information can be found in the documentation for the DecisionTree class and in the specs for this class.

To run tests,

```
npm run test:ai:decision-tree
```


## Finite State Machine

The Reactive, data-driven Finite State Machine provides a simple API for both imperative and data-driven constructions of Finite State Machines.

_Observers_ may be created and assigned to the machine in order to take specific action when the machine reaches a particular state.

Both Moore and Mealy-style machines can be constructed.

See specs in the _test_ folder for detailed information on how to create and manipulate Finite State Machines.

To run tests,

```
npm run test:ai:fsm
```

## Optimize
  - Empty    

## Pathfinding

  The _pathfinding_ folder currently contains (see specs in the _test_ folder for complete examples):

  - interfaces (models specific to A* pathfinding)
  - astar-graph-arc (graph arc optimized for A*)
  - astar-graph (graph optimized for A*)
  - astar-min-heap (a min-heap optimized for use in A*)
  - astar-waypoint (implementation of an A* waypoint)
  - astar (implements the A* algorithm for 2D waypoints)

To run tests,

```
npm run test:ai:astar
npm run test:ai:astar:graph
npm run test:ai:astar:heap
npm run test:ai:astar:waypoint
```

## Rules Engine
  - empty

## Sequencing Engine
  - empty

## Simulated Annealing
  - empty

## Test
  - test specs for pathfinding

## Tiles
  - A* for Tiles.  These classes implement the A* algorithm for 2D game tiles.  Unit tests do not currently exist as they have been historically verified using interaction testing.  A sample game display will be created once general Canvas drawing has been added to _AMYR_.  This will be done in a means that is platform independent, i.e. it could be used in Angular (by creating an attribute directive), React, Vue, or any framework capable of obtaining a reference to a DOM element.
