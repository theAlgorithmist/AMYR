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
  RTreeNode
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
export { FcnEval                 } from "./models/fcn-eval";
export { TSMT$Derivative         } from "./libs/tsmt/math/derivative";
export { TSMT$Matrix             } from "./libs/tsmt/math/matrix";
export { nevilleInterpolate      } from "./libs/tsmt/math/neville";
export { TSMT$PrimeFactorization } from "./libs/tsmt/math/prime-factorization";
export {
  Quaterion,
  TSMT$Quaternion
} from "./libs/tsmt/math/quaternion";
export {
  SimpleFraction,
  repeatToFraction
} from "./libs/tsmt/math/repeat-to-frac";

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

@NgModule({
  imports: [CommonModule],
})
export class AmyrTsLibModule {}
