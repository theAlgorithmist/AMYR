import { NgModule     } from '@angular/core';
import { CommonModule } from '@angular/common';

// AMYR EXPORTS

// core/easing
export * as back from '../lib/core/easing/back';
export * as bounce from '../lib/core/easing/bounce';
export * as cubic from '../lib/core/easing/cubic';
export * as elastic from '../lib/core/easing/elastic';
export * as exponential from '../lib/core/easing/exponential';
export * as linear from '../lib/core/easing/linear';
export * as quadratic from '../lib/core/easing/quadratic';

export {
  expressionValue,
  expressionOperand,
  ExpressionFcn,
  ExpressionEngine
} from "./libs/expression-engine/expression-engine";

export {
  NumericFcn,
  FunctionParser
} from "./libs/function-parser/function-parser";

// FP functions
export {
  dynamicFilter,
  reverseFilter,
  dynamicXform,
  extendedReducer,
  hasAny,
  hasNone,
  partition,
  cache,
  PredicateFunction,
  XformFunction
} from "./libs/functional-programming/higher-order";

// models
export { IGraphics } from './models/graphics';
export { DecisionTreeAction } from "./models/decision-tree-action";
export {
  FSMState,
  FSMStateOutput,
  StateMachineDefinition,
  StateTransition,
  transFunction
} from "./models/state-machine-models";

// /lib/enumerations
export { TREE_COLOR_ENUM } from './enumerations/tree-color-enum';

// /lib/libs/misc
export {
  UndoRedoTypes,
  IUndoListData,
  IUndoTransform,
  TSMT$UndoRedo
} from './libs/misc/undo-redo';

// /lib/libs/sorting
export { sortOn } from './libs/sorting/sort-on';

// Finite State Machine
export { FiniteStateMachine } from "./libs/ai/finite-state-machine/finite-state-machine";

// /lib/tsmt/datastructures
export { TSMT$BTreeUtils } from './libs/tsmt/datastructures/utils/b-tree-utils';
export { invert          } from './libs/tsmt/datastructures/utils/btree-invert';
export { graphFromList   } from './libs/tsmt/datastructures/utils/graph-from-list';
export { reverseLList    } from './libs/tsmt/datastructures/utils/l-list-reverse';
export { quickSelect     } from './libs/tsmt/datastructures/utils/quick-select';

export { TSMT$ArrayDeque } from './libs/tsmt/datastructures/array-deque';
export {
  NodeFinished,
  TSMT$AVLTree,
  TSMT$NODE_DIRECTION
} from './libs/tsmt/datastructures/avl-tree';
export { TSMT$BTreeLight  } from './libs/tsmt/datastructures/b-tree-light';
export { TSMT$BTreeNode   } from './libs/tsmt/datastructures/b-tree-node';
export { TSMT$DisjointSet } from './libs/tsmt/datastructures/disjoint-set';
export { TSMT$IDSNode     } from './libs/tsmt/datastructures/ds-node';
export { TSMT$DSNode      } from './libs/tsmt/datastructures/ds-node-impl';
export { TSMT$Graph       } from './libs/tsmt/datastructures/graph';
export { TSMT$GraphArc    } from './libs/tsmt/datastructures/graph-arc';
export {
  IGraphNode,
  IGraphEdge,
  GraphList
} from './libs/tsmt/datastructures/graph-list';
export { TSMT$GraphNode     } from './libs/tsmt/datastructures/graph-node';
export { TSMT$Heap          } from './libs/tsmt/datastructures/heap';
export { TSMT$IBTree        } from './libs/tsmt/datastructures/ibtree';
export { Prioritizable      } from './libs/tsmt/datastructures/prioritizable';
export { TSMT$PriorityQueue } from './libs/tsmt/datastructures/priority-queue';
export { TSMT$Queue         } from './libs/tsmt/datastructures/queue';
export {
  RTree,
  RTNode,
  BBox,
  BBoxConversion,
  EqualFcn,
  Point2D,
  PointNode,
  RTreeNode,
  isPoint2D,

} from './libs/tsmt/datastructures/r-tree';
export {
  gatherChildren,
  TSMT$ClusterData,
  ClusterParams,
  TSMT$IEdge,
  TSMT$IEdgeData,
  TSMT$INode,
  TSMT$GraphData,
  TSMT$INodeData,
  TSMT$SimpleGraph,
  TSMT_CLUSTER_DEFAULT_PARAMS,
  TSMT_CLUSTER_TYPE
} from './libs/tsmt/datastructures/simple-graph';
export { TSMT$SkipListNode } from './libs/tsmt/datastructures/skip-list-node-impl';
export { TSMT$SkipList     } from './libs/tsmt/datastructures/skip-list';
export { TSMT$Stack        } from './libs/tsmt/datastructures/stack';
export { TSMT$TreeNode     } from './libs/tsmt/datastructures/tree-node';
export { TSMT$Tree         } from './libs/tsmt/datastructures/tree';
export { TSMT$Trie         } from './libs/tsmt/datastructures/trie';

// TSMT Math
export { FcnEval            } from "./models/fcn-eval";
export { Derivative         } from "./libs/tsmt/math/derivative";
export { Matrix             } from "./libs/tsmt/math/matrix";
export { nevilleInterpolate } from "./libs/tsmt/math/neville";
export { PrimeFactorization } from "./libs/tsmt/math/prime-factorization";
export {
  Quaterion,
  TSMT$Quaternion
} from "./libs/tsmt/math/quaternion";
export {
  SimpleFraction,
  repeatToFraction
} from "./libs/tsmt/math/repeat-to-frac";

export {
  DEFAULT_PHONE,
  INVALID_NUMBER
} from "./models/numeric";

export { PlanarPoint } from "./libs/tsmt/geometry/point";
export { Polygon     } from "./libs/tsmt/geometry/polygon";

export { compareNumbers } from "./libs/tsmt/utils/approx-equal";
export { isBalanced     } from "./libs/tsmt/utils/balanced-parens";
export { bisect         } from "./libs/tsmt/utils/bisect";

export {
  containsApproximately,
  vectorCompare,
  compareToDigits
} from "./libs/tsmt/utils/compare-utils";

export { CubicRoots          } from "./libs/tsmt/utils/cubic-roots";
export { Gauss               } from "./libs/tsmt/utils/gauss";
export { halleyRoot          } from "./libs/tsmt/utils/halley";
export { LinearInterpolation } from "./libs/tsmt/utils/linear-interp";

export {
  lcm,
  gcd
} from "./libs/tsmt/utils/math-utils";

export { Newton    } from "./libs/tsmt/utils/newton";
export { solve2x2  } from "./libs/tsmt/utils/solve-2x2";
export { strEquals } from "./libs/tsmt/utils/str-equals";
export { Timer     } from "./libs/tsmt/utils/timer";
export { toNumber  } from "./libs/tsmt/utils/to-number";
export { twbrf     } from "./libs/tsmt/utils/twbrf";

export * from './libs/tsmt/utils/array-functions';
export * from './libs/tsmt/utils/circle-utility-functions';
export * from './libs/tsmt/utils/geom-utils';
export * from './libs/tsmt/utils/limits';
export * from './libs/tsmt/utils/number-formatter';
export * from './libs/tsmt/utils/point-utils';
export * from './libs/tsmt/utils/polygon-utils';
export * from './libs/tsmt/utils/string-utils';

export {
  Point,
  Interval,
  NEWS,
  ProjectFromTo,
  Projection,
  SegmentIntersection,
  Rect,
  DirEnum,
  Vertices,
  IntersectionPoints,
  ZERO_TOL,
  ROOT_ITER_LIMIT,
  RAD_TO_DEG,
  Ranges
} from "./models/geometry";

// lib/libs/ai/interfaces
export { CELL_TYPE } from './libs/ai/pathfinding/interfaces/cell-type';
export { Grid2D    } from './libs/ai/tiles/grid-2d';
export { IGridView } from './libs/ai/pathfinding/interfaces/grid-view-model';

// lib/libs/ai/pathfinding
export {
  DEF_COST_FCN,
  AStarGraphArc
} from './libs/ai/pathfinding/astar-graph-arc';

export {
  CostFunction,
  IAStarGraphData,
  IAStarWaypoint,
  IEdge,
  IEdgeData,
  AStarGraph
} from './libs/ai/pathfinding/astar-graph';

export { AstarMinHeap } from './libs/ai/pathfinding/astar-min-heap';

export {
  createWaypoint,
  AStarWaypoint
} from './libs/ai/pathfinding/astar-waypoint';

export { AStar } from './libs/ai/pathfinding/astar';

export { grahamScan } from "./libs/tsmt/geometry/hulls/convex-hull";

export {
  fastConvexHull,
  concaveHull,
  QueueNode
} from "./libs/tsmt/geometry/hulls/concave-hull";

export { Line } from "./libs/tsmt/geometry/planar/line";

export * from "./models/planar-curve-model";

export { PlanarCurve } from "./libs/tsmt/geometry/planar/planar-curve";

export { Circle       } from "./libs/tsmt/geometry/circle";
export { createCircle } from "./libs/tsmt/geometry/utils/circle-factory";

export { QuadBezier  } from "./libs/tsmt/geometry/planar/quad-bezier";
export { CubicBezier } from "./libs/tsmt/geometry/planar/cubic-bezier";

export { CubicSpline         } from "./libs/tsmt/geometry/splines/natural-cubic-spline";
export { BezierSplineControl } from "./libs/tsmt/geometry/splines/bezier-spline-control";
export { CubicBezierSpline   } from "./libs/tsmt/geometry/splines/cubic-bezier-spline";
export { SplineTypes         } from "./models/planar-curve-model";

export { Fences, Confidence } from "./models/state-models";

export { BinomialCoef } from "./libs/tsmt/statistics/binomial-coef";
export { ChiSquare    } from "./libs/tsmt/statistics/chi-square";
export { isEven, DataStats} from "./libs/tsmt/statistics/data-stats";
export * as amyrConstants from '../../src/lib/models/constants';
export { Normal    } from "./libs/tsmt/statistics/normal";
export { ExtNormal } from "./libs/tsmt/statistics/ext-normal";

export { NMSimplex  } from "./models/optimization-models";
export { nelderMead } from "./libs/optimization/nelder-mead";

export { Bayes          } from "./libs/tsmt/statistics/bayes/bayes";
export { FrequencyTable } from "./libs/tsmt/statistics/bayes/frequency-table";
export { linearFit      } from "./libs/tsmt/statistics/regression/llsq";
export { Pllsq          } from "./libs/tsmt/statistics/regression/pllsq";
export { Deviates       } from "./libs/tsmt/statistics/deviates";
export * from './libs/tsmt/statistics/regression/bagging';

export { LLSQResult, PolyLLSQResult } from "./models/regression-models";

export { VSM_FILTER_WORDS, WordVector, VSM_OP } from "./models/vsm";
export { cosineSim, vsmCosineSim } from "./libs/text-vsm/cosine-similarity";
export { score     } from "./libs/text-vsm/score";
export { textToVSM } from "./libs/text-vsm/text-to-vector-state-model";
export { TFIDF     } from "./libs/text-vsm/tf-idf";
export { toVector  } from "./libs/text-vsm/to-vector";
export { vsmMod    } from "./libs/text-vsm/vsm-mod";
export { vsmNorm   } from "./libs/text-vsm/vsm-norm";

export { DAY_OF_WEEK, DayHourOffsetModel, TimeValues } from "./models/day-and-time";
export { capitalizeFirst         } from "./libs/misc/capitalize-first";
export { clearLocalStorage       } from "./libs/misc/clear-local-storage";
export { dayHourOffset           } from "./libs/misc/day-hour-offset";
export { DayIterator             } from "./libs/misc/day-iterator";
export { fromLocalStorage        } from "./libs/misc/from-local-storage";
export { timeStampToMilliseconds } from "./libs/misc/time-stamp-to-milliseconds";
export { getCookieValue          } from "./libs/misc/get-cookie-value";
export { inEnum                  } from "./libs/misc/in-enum";
export { indexOfMax              } from "./libs/misc/index-of-max";
export { intervalsBetweenDays    } from "./libs/misc/interval-between-days";
export { iterativeMean           } from "./libs/misc/iterative-mean";
export { orderedPermutations     } from "./libs/misc/ordered-permutations";
export { setCookie               } from "./libs/misc/set-cookie-value";
export { toLocalStorage          } from "./libs/misc/to-local-storage";
export { timeUnitToMilliseconds  } from "./libs/misc/time-unit-to-milliseconds";
export { toSpacedList            } from "./libs/misc/to-spaced-list";
export { uuid                    } from "./libs/misc/uuid";
export { missingStep             } from "./libs/misc/missing-step";
export { maxDelta                } from "./libs/misc/max-delta";

export { DecisionNode, DECISION_TREE_ACTIONS } from "./models/decision-tree";
export { DecisionTree     } from "./libs/ai/decision-tree/decision-tree";
export { extractVariables } from "./libs/ai/decision-tree/extract-variables";

export * from '../lib/models/clock-time';
export { ClockTimeModel } from "./libs/misc/models/clock-time-model";

export { BasicMathType } from "./models/math/basic-math-type";

// math types
export { FractionModel } from "./libs/misc/models/fraction-model";
export { FractionType  } from "./models/math/fraction-type";
export { floatToFrac   } from "./libs/misc/models/utils/float-to-frac";
export { strToFrac     } from "./libs/misc/models/utils/str-to-frac";
export { MathTypeEnum  } from "./models/math/math-type-enum";
export { RealModel     } from "./libs/misc/models/real-model";
export { IntegerModel  } from "./libs/misc/models/integer-model";
export { WholeModel    } from "./libs/misc/models/whole-model";

// paging calculator
export { PagingCalculator } from "./libs/paging/paging-calculator";

// item allocation
export { AllocatableItem           } from "./libs/item-allocation/allocatable-item";
export { ItemAllocation            } from "./libs/item-allocation/item-allocation";
export { AllocatableItemProps      } from "./models/allocatable-item-props";
export { AllocatableItemStrategy   } from "./models/allocatable-item-strategy";
export { DefaultAllocationStrategy } from "./libs/item-allocation/default-allocation-strategy";
export { Knapsack                  } from "./libs/item-allocation/knapsack";
export { matrixFactory             } from "./libs/item-allocation/matrix-factory";

@NgModule({
  imports: [CommonModule],
})
export class AmyrTsLibModule {}
