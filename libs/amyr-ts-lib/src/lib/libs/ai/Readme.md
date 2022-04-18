# AMYR AI LIBRARY

The _AMYR_ AI library is intended to support low-level operations that fit (generally speaking) under the AI or ML umbrella.

The AI folder structure is documented below. (C) means that code in that folder is complete, meaning on par with the ADT (Angular Dev Toolkit).  (N) means that new content beyond that existing in the ADT has been added to the folder. (P) means partial content (relative to the ADT).  (E) means the folder is currently empty, i.e. ADT code has yet to be moved into _AMYR_.  That requires some more coffee!!

- decision-tree (expression-based decision tree) - E
- finite-state-machine (data-driven finite state machine) - E
- optimize (some low-level optimization libraries) - E
- **pathfinding (A-star for waypoints in the plane) - C**
- rules-engine (lightweight, front-end rules engine) - E
- sequencing engine (run multiple decision trees in sequence) - E
- simulated annealing (small library for optimization using simulated annealing) - E
- **test (TSMT specs) - C**
- **tiles (A* for 2D game tiles) - C**

## Decision Tree
  - Empty

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
